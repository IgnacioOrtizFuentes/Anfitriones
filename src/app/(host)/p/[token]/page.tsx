import { getHostByToken } from "@/actions/host-actions";
import HostLandingClient from "./host-landing-client";
import { notFound } from "next/navigation";

export default async function HostLandingPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    const host = await getHostByToken(token);

    if (!host) {
        notFound();
    }

    return <HostLandingClient host={host} />;
}
