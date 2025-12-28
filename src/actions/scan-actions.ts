"use server";

import { createClient } from "@/utils/supabase/server";

export async function checkInHost(qrData: string) {
    const supabase = await createClient();

    let parsedData;
    try {
        parsedData = JSON.parse(qrData);
    } catch (e) {
        return { error: "Formato de QR inválido o antiguo" };
    }

    // Support legacy QR format (just for backward compatibility during dev)
    // Legacy: { token, hostId, eventId } -> Treating as host
    const type = parsedData.type || 'host';
    const id = parsedData.id || parsedData.hostId; // in legacy, hostId was the main ID

    if (!id) return { error: "ID no encontrado en QR" };

    // --- CASE A: MAIN HOST ---
    if (type === 'host') {
        const { data: host, error: fetchError } = await supabase
            .from("evento_anfitrion")
            .select("*, anfitriones(nombre)")
            .eq("id", id)
            .single();

        if (fetchError || !host) return { error: "Anfitrión no encontrado" };

        if (host.estado === 'ingresado') {
            return { error: "ALERTA: Este anfitrión YA INGRESÓ previamente.", host };
        }
        if (host.estado !== 'confirmado') {
            return { error: `Anfitrión no confirmado (Estado: ${host.estado})`, host };
        }

        const { error: updateError } = await supabase
            .from("evento_anfitrion")
            .update({ estado: 'ingresado', last_seen_at: new Date().toISOString() })
            .eq("id", id);

        if (updateError) return { error: "Error al registrar ingreso" };

        return { success: true, host, type: 'Anfitrión' };
    }

    // --- CASE B: GUEST (+1) ---
    if (type === 'guest') {
        const { data: guest, error: fetchError } = await supabase
            .from("invitados_anfitrion")
            .select(`
                *,
                evento_anfitrion (
                    anfitriones (nombre)
                )
            `)
            .eq("id", id)
            .single();

        if (fetchError || !guest) return { error: `Invitado no encontrado` };

        if (guest.estado === 'ingresado') {
            // Construct a fake host object for the UI to show the name
            const hostObj = { anfitriones: { nombre: guest.nombre_completo + ` (Inv. de ${guest.evento_anfitrion?.anfitriones?.nombre})` } };
            return { error: "ALERTA: Este invitado YA INGRESÓ.", host: hostObj };
        }

        const { error: updateError } = await supabase
            .from("invitados_anfitrion")
            .update({ estado: 'ingresado' })
            .eq("id", id);

        if (updateError) return { error: "Error al registrar ingreso de invitado" };

        // Mock host object for success screen
        const hostObj = { anfitriones: { nombre: guest.nombre_completo + ` (Inv. de ${guest.evento_anfitrion?.anfitriones?.nombre})` } };
        return { success: true, host: hostObj, type: 'Invitado' };
    }

    return { error: "Tipo de QR desconocido" };
}
