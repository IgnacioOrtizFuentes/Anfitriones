"use server";

import { createClient } from "@/utils/supabase/server";

export async function getEventDetails(eventId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .eq("id", eventId)
        .single();

    if (error) {
        console.error("Error fetching event:", error);
        return null;
    }
    return data;
}

export async function getEvents() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .order("fecha", { ascending: true });

    if (error) {
        console.error("Error fetching events:", error);
        return [];
    }
    return data;
}

export async function getEventHosts(eventId: string) {
    const supabase = await createClient();
    const { data: hosts, error } = await supabase
        .from("evento_anfitrion")
        .select(`
            *,
            *,
            anfitriones (*)
        `)
        .eq("evento_id", eventId);

    if (error) {
        console.error("Error fetching hosts:", error);
        return [];
    }

    // Transform to a friendlier structure if needed, or return as is suited for the UI
    return hosts;
}

export async function getEventStats(eventId: string) {
    const supabase = await createClient();

    // This could be optimized with a database function or running count
    // For MVP, we calculate on the fly
    const { data: hosts, error } = await supabase
        .from("evento_anfitrion")
        .select("estado, invitados_registrados, cupo_invitados")
        .eq("evento_id", eventId);

    if (error) return null;

    const totalHosts = hosts.length;
    const confirmedHosts = hosts.filter(h => h.estado === 'confirmado').length;
    const pendingHosts = hosts.filter(h => h.estado === 'pendiente').length;
    const checkedInHosts = hosts.filter(h => h.estado === 'ingresado').length;

    const totalGuestsPotential = hosts.reduce((acc, curr) => acc + (curr.cupo_invitados || 0), 0);
    const totalGuestsRegistered = hosts.reduce((acc, curr) => acc + (curr.invitados_registrados || 0), 0);

    return {
        totalHosts,
        confirmedHosts,
        pendingHosts,
        checkedInHosts,
        totalGuestsPotential,
        totalGuestsRegistered
    };
}

export async function createEvent(formData: FormData) {
    const supabase = await createClient();

    const nombre = formData.get("nombre") as string;
    const fecha = formData.get("fecha") as string;
    const lugar = formData.get("lugar") as string;

    if (!nombre || !fecha) return { error: "Nombre y fecha obligatorios" };

    const { data, error } = await supabase
        .from("eventos")
        .insert({
            nombre,
            fecha,
            lugar,
            estado: 'borrador'
        })
        .select()
        .single();

    if (error) return { error: error.message };

    return { success: true, eventId: data.id };
}

export async function addHostToEvent(eventId: string, formData: FormData) {
    const supabase = await createClient();

    const nombre = formData.get("nombre") as string;
    const email = formData.get("email") as string;
    const telefono = formData.get("telefono") as string;
    const cupo = parseInt(formData.get("cupo") as string) || 5;

    if (!nombre) return { error: "El nombre es obligatorio" };

    // 1. Create or Find User in 'anfitriones' table
    // For MVP, we'll just create a new one. In a real app, we might check email uniqueness.
    const { data: host, error: hostError } = await supabase
        .from("anfitriones")
        .insert({
            nombre,
            email: email || null,
            telefono: telefono || null
        })
        .select()
        .single();

    if (hostError || !host) return { error: "Error creando anfitrión: " + hostError?.message };

    // 2. Link to Event in 'evento_anfitrion'
    const { error: linkError } = await supabase
        .from("evento_anfitrion")
        .insert({
            evento_id: eventId,
            anfitrion_id: host.id,
            estado: 'pendiente',
            cupo_invitados: cupo,
            invitados_registrados: 0
        });

    if (linkError) return { error: "Error vinculando anfitrión: " + linkError.message };

    return { success: true };
}
