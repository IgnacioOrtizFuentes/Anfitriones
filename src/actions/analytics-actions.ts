"use server";

import { createClient } from "@/utils/supabase/server";

export async function getBoardStats() {
    const supabase = await createClient();

    // 1. Total Active Hosts
    const { count: totalHosts } = await supabase
        .from("anfitriones")
        .select("*", { count: 'exact', head: true })
        .neq("estado_cuenta", "pendiente");

    // 2. Total Events
    const { count: totalEvents } = await supabase
        .from("eventos")
        .select("*", { count: 'exact', head: true });

    // 3. Total Guests (Sum of guests brought by hosts)
    // Note: This is an aggregation. For large datasets, use a view or RPC.
    // For MVP, we sum in app memory or simple query if volume is low.
    // Efficient way:
    const { data: guestsData } = await supabase
        .from("evento_anfitrion")
        .select("invitados_registrados");

    const totalGuests = guestsData?.reduce((sum, row) => sum + (row.invitados_registrados || 0), 0) || 0;

    return {
        totalHosts: totalHosts || 0,
        totalEvents: totalEvents || 0,
        totalGuests
    };
}

export async function getTopHosts() {
    const supabase = await createClient();

    // Complex query: Join hosts with their aggregations.
    // We want: Host Name, Total Guests Brought (sum of invitations), Total Events participated.
    // Supabase JS doesn't support easy Group By without views.
    // Workaround for MVP: Fetch all 'evento_anfitrion' with host details and aggregate in JS. 
    // *Not scalable for thousands of hosts, but perfect for < 500.*

    const { data, error } = await supabase
        .from("evento_anfitrion")
        .select(`
            invitados_registrados,
            cupo_invitados,
            anfitriones (
                id,
                nombre,
                avatar_url
            )
        `);

    if (error) {
        console.error("Error fetching top hosts:", error);
        return [];
    }

    // Aggregation Logic
    const hostStats: Record<string, {
        id: string,
        nombre: string,
        avatar_url: string | null,
        total_invitados: number,
        eventos_count: number
    }> = {};

    data.forEach((row: any) => {
        const host = row.anfitriones;
        if (!host) return; // Should not happen

        if (!hostStats[host.id]) {
            hostStats[host.id] = {
                id: host.id,
                nombre: host.nombre,
                avatar_url: host.avatar_url,
                total_invitados: 0,
                eventos_count: 0
            };
        }

        hostStats[host.id].total_invitados += (row.invitados_registrados || 0);
        hostStats[host.id].eventos_count += 1;
    });

    // Convert to array and sort
    const sortedHosts = Object.values(hostStats)
        .sort((a, b) => b.total_invitados - a.total_invitados)
        .slice(0, 5); // Top 5

    return sortedHosts;
}
