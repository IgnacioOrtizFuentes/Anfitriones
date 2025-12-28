"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, MapPin, CheckCircle2, Users, Clock } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { UploadEvidence } from "@/components/upload-evidence";
import { confirmAttendance } from "@/actions/host-actions";
import { useTransition } from "react";

export default function HostLandingClient({ host }: { host: any }) {
    const [isPending, startTransition] = useTransition();

    const handleConfirm = () => {
        startTransition(async () => {
            await confirmAttendance(host.id, `/p/${host.access_token}`);
        });
    };

    const isConfirmed = host.estado === 'confirmado';
    const isRevision = host.estado === 'revision';
    const isPendingStatus = host.estado === 'pendiente';

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Header */}
            <div className="bg-slate-900 text-white p-8 pt-12 rounded-b-[2rem] shadow-xl">
                <div className="flex items-start justify-between mb-6">
                    <StatusBadge status={host.estado} className={isConfirmed ? "bg-green-500 text-white border-transparent" : "bg-yellow-400 text-yellow-900 border-transparent"} />
                </div>

                <h1 className="text-3xl font-bold mb-2">{host.eventos?.nombre}</h1>
                <div className="space-y-2 text-slate-300">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>{new Date(host.eventos?.fecha).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        <span>{host.eventos?.lugar}</span>
                    </div>
                </div>
            </div>

            <div className="p-6 -mt-8 relative z-10 space-y-6">

                {isPendingStatus && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="border-l-4 border-l-yellow-400 shadow-lg">
                            <CardHeader>
                                <CardTitle>Confirmar Asistencia</CardTitle>
                                <CardDescription>Confirma tu cupo de anfitrión para activar tus beneficios.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 mb-4 bg-slate-100 p-3 rounded-lg">
                                    <strong>Requisito:</strong> Debes subir una historia a Instagram promocionando el evento para ser confirmado.
                                </p>

                                <UploadEvidence hostId={host.id} />

                                {/* 
                                <Button
                                    size="xl"
                                    className="w-full bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 text-xl font-bold"
                                    onClick={handleConfirm}
                                    disabled={isPending}
                                >
                                    {isPending ? "Confirmando..." : "¡SÍ, VOY!"}
                                </Button> 
                                */}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {isRevision && (
                    <div className="animate-in fade-in duration-500">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center space-y-2">
                            <Clock className="h-10 w-10 text-blue-500 mx-auto" />
                            <h3 className="font-bold text-blue-900">En Revisión</h3>
                            <p className="text-sm text-blue-700">Tu evidencia está siendo validada por la productora.</p>
                        </div>
                    </div>
                )}

                {isConfirmed && (
                    <div className="animate-in fade-in zoom-in-95 duration-500 space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4 text-green-800">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                            <div>
                                <h3 className="font-bold">¡Estás confirmado!</h3>
                                <p className="text-sm">Tu cupo está asegurado.</p>
                            </div>
                        </div>

                        <Link href={`/p/${host.access_token}/guests`}>
                            <Button size="xl" variant="brand" className="w-full gap-2 relative overflow-hidden">
                                <Users className="h-6 w-6" />
                                Gestionar mis Invitados (+1)
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 px-2 py-1 rounded text-xs font-mono">
                                    0/5
                                </span>
                            </Button>
                        </Link>

                        <Link href={`/p/${host.access_token}/ticket`}>
                            <Button variant="outline" size="xl" className="w-full">
                                Ver mi Ticket QR
                            </Button>
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}
