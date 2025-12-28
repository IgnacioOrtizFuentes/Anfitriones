import { use } from "react";
import { getHostByToken } from "@/actions/host-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HostPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);
    const data = use(getHostByToken(token));

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Portal Anfitrión</h1>
            <Link href={`/p/${token}/guests`}><Button>Ver Invitados</Button></Link>
            <Link href={`/p/${token}/covers`}><Button variant="outline">Mis Covers</Button></Link>
        </div>
    );
}
