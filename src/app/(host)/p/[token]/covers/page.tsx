import { use } from "react";
import { getHostByToken, getHostGuests } from "@/actions/host-actions";
import { getHostCovers } from "@/actions/cover-actions";
import { CoverManager } from "@/components/cover-manager";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CoversPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);
    const hostData = use(getHostByToken(token));
    const covers = use(getHostCovers(hostData?.id || ''));

    if (!hostData) {
        return <div className="p-8 text-center">Token inválido</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4">
            <div className="max-w-2xl mx-auto space-y-6">
                <Link href={`/p/${token}`}>
                    <Button variant="ghost" size="sm" className="gap-2 mb-4">
                        <ArrowLeft className="h-4 w-4" /> Volver
                    </Button>
                </Link>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h1 className="text-2xl font-bold mb-1">Mis Covers</h1>
                    <p className="text-slate-500 text-sm mb-4">
                        Evento: {(hostData as any).eventos?.nombre}
                    </p>

                    <CoverManager
                        hostEventId={hostData.id}
                        cupoCovers={hostData.cupo_covers || 0}
                        covers={covers}
                    />
                </div>
            </div>
        </div>
    );
}
