"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getHostByToken(token: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("evento_anfitrion")
        .select(`
        *,
        eventos (
            nombre,
            fecha,
            lugar
        ),
        anfitriones (
            nombre
        )
    `)
        .eq("access_token", token)
        .single();

    if (error) {
        console.error("Error fetching host by token:", error);
        return null;
    }
    return data;
}

export async function confirmAttendance(hostId: string, path: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("evento_anfitrion")
        .update({ estado: 'confirmado' })
        .eq("id", hostId);

    if (error) throw new Error("Failed to confirm attendance");

    revalidatePath(path);
    return { success: true };
}

export async function addGuest(hostId: string, guest: { nombre_completo: string, rut_dni: string }) {
    const supabase = await createClient();

    // 1. Check quota
    const { data: host } = await supabase
        .from("evento_anfitrion")
        .select("cupo_invitados, invitados_registrados")
        .eq("id", hostId)
        .single();

    if (!host) throw new Error("Host not found");
    if (host.invitados_registrados >= host.cupo_invitados) {
        return { error: "Cupo lleno" };
    }

    // 2. Add guest
    const { error } = await supabase
        .from("invitados_anfitrion")
        .insert({
            evento_anfitrion_id: hostId,
            nombre_completo: guest.nombre_completo,
            rut_dni: guest.rut_dni,
            estado: 'en_lista'
        });

    if (error) return { error: error.message };

    // 3. Update counter (Atomic increment ideally, simplified here)
    // 3. Update counter manually for now to avoid RPC dependency if not created
    const { error: updateError } = await supabase
        .from("evento_anfitrion")
        .update({ invitados_registrados: host.invitados_registrados + 1 })
        .eq("id", hostId);

    if (updateError) console.error("Error updating counter:", updateError);

    // Optional: Try RPC if preferred, but fallback to manual update is safer for this stage
    // await supabase.rpc('increment_guests', { row_id: hostId });

    return { success: true };
}

export async function getHostGuests(hostId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("invitados_anfitrion")
        .select("*")
        .eq("evento_anfitrion_id", hostId);

    if (error) return [];
    return data;
}

export async function getPendingHosts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("anfitriones")
        .select("*")
        .eq("estado_cuenta", "pendiente")
        .order("created_at", { ascending: false });

    if (error) return [];
    return data;
}

export async function getAllHosts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("anfitriones")
        .select("*")
        .neq("estado_cuenta", "pendiente") // Exclude pending
        .order("nombre", { ascending: true });

    if (error) return [];
    return data;
}

export async function updateHostAccountStatus(hostId: string, status: 'aprobado' | 'rechazado') {
    const supabase = await createClient();
    const { error } = await supabase
        .from("anfitriones")
        .update({ estado_cuenta: status })
        .eq("id", hostId);

    if (error) return { error: error.message };

    revalidatePath("/anfitriones");
    return { success: true };
}
