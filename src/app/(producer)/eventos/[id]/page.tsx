import { getEventDetails, getEventStats, getEventHosts } from "@/actions/event-actions";
import EventDashboardClient from "./event-dashboard-client";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Parallel fetching
    const [event, stats, hosts] = await Promise.all([
        getEventDetails(id),
        getEventStats(id),
        getEventHosts(id)
    ]);

    if (!event) {
        return <div>Evento no encontrado</div>;
    }

    return (
        <EventDashboardClient
            event={event}
            stats={stats}
            hosts={hosts}
        />
    );
}
