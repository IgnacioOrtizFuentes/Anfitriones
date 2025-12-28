import { getHostByToken, getHostGuests } from "@/actions/host-actions";
import GuestListClient from "./guest-list-client";
import { notFound } from "next/navigation";

export default async function GuestPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;

    const host = await getHostByToken(token);

    if (!host) {
        notFound();
    }

    const guests = await getHostGuests(host.id);

    return (
        <GuestListClient
            host={host}
            initialGuests={guests}
        />
    );
}
