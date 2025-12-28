import { getHostByToken, getHostGuests } from "@/actions/host-actions";
import TicketClient from "./ticket-client";
import { notFound } from "next/navigation";

export default async function TicketPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    const host = await getHostByToken(token);

    if (!host) {
        notFound();
    }

    const guests = await getHostGuests(host.id);

    return <TicketClient host={host} guests={guests} />;
}
