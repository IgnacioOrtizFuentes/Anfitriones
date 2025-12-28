"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Asignar covers a un anfitrión (usado por productor)
export async function updateHostCovers(hostEventId: string, cupoCovers: number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("evento_anfitrion")
        .update({ cupo_covers: cupoCovers })
        .eq("id", hostEventId);

    if (error) return { error: error.message };

    revalidatePath(`/eventos/[id]`);
    return { success: true };
}

// Generar un cover QR (usado por anfitrión)
export async function generateCoverQR(hostEventId: string) {
    const supabase = await createClient();

    // 1. Check quota
    const { data: host } = await supabase
        .from("evento_anfitrion")
        .select("cupo_covers, covers_usados")
        .eq("id", hostEventId)
        .single();

    if (!host) return { error: "Host no encontrado" };

    // Count generated covers (not used)
    const { count: generatedCount } = await supabase
        .from("covers_canjeados")
        .select("*", { count: 'exact', head: true })
        .eq("evento_anfitrion_id", hostEventId);

    if ((generatedCount || 0) >= host.cupo_covers) {
        return { error: `Límite de covers alcanzado (${host.cupo_covers})` };
    }

    // 2. Generate unique QR code
    const codigoQR = crypto.randomUUID();

    // 3. Insert cover
    const { error } = await supabase
        .from("covers_canjeados")
        .insert({
            evento_anfitrion_id: hostEventId,
            codigo_qr: codigoQR,
            usado: false
        });

    if (error) return { error: error.message };

    return { success: true, codigo_qr: codigoQR };
}

// Obtener covers de un anfitrión
export async function getHostCovers(hostEventId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("covers_canjeados")
        .select("*")
        .eq("evento_anfitrion_id", hostEventId)
        .order("created_at", { ascending: false });

    if (error) return [];
    return data;
}

// Validar/Canjear un cover (usado por escáner)
export async function validateCover(codigoQR: string) {
    const supabase = await createClient();

    // 1. Find the cover
    const { data: cover, error: fetchError } = await supabase
        .from("covers_canjeados")
        .select(`
            *,
            evento_anfitrion (
                evento_id,
                anfitriones (nombre)
            )
        `)
        .eq("codigo_qr", codigoQR)
        .single();

    if (fetchError || !cover) {
        return { error: "Cover no encontrado o inválido" };
    }

    // 2. Check if already used
    if (cover.usado) {
        return {
            error: "Cover ya utilizado",
            usado: true,
            fecha_uso: cover.fecha_uso
        };
    }

    // 3. Mark as used and increment counter
    const { error: updateError } = await supabase
        .from("covers_canjeados")
        .update({
            usado: true,
            fecha_uso: new Date().toISOString(),
            validado_por: "Scanner" // Can be enhanced with actual user
        })
        .eq("id", cover.id);

    if (updateError) return { error: updateError.message };

    // 4. Increment covers_usados
    const { error: incError } = await supabase.rpc('increment_covers_usados', {
        row_id: cover.evento_anfitrion_id
    });

    if (incError) console.error("Error incrementing counter:", incError);

    return {
        success: true,
        anfitrion: (cover.evento_anfitrion as any)?.anfitriones?.nombre || "Desconocido"
    };
}
