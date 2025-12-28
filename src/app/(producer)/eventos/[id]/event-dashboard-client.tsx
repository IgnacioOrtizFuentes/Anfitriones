"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AddHostDialog } from "@/components/add-host-dialog";
import { CoverAssignment } from "@/components/cover-assignment";

// Define simpler local types based on what we passed from server
interface EventDashboardClientProps {
    event: any;
    hosts: any[];
    stats: any;
}

export default function EventDashboardClient({ event, hosts, stats }: EventDashboardClientProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'anfitriones' | 'validations'>('general');

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-3xl font-bold">{event.nombre}</h1>
                        <span className={(event.estado === "publicado" ? "bg-green-100 text-green-700" : "bg-slate-100") + " text-xs px-2 py-1 rounded-full font-medium"}>
                            {event.estado}
                        </span>
                    </div>
                    <p className="text-slate-500">{new Date(event.fecha).toLocaleDateString()} • {event.lugar}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Editar</Button>
                    <Link href={`/eventos/${event.id}/scan`}>
                        <Button variant="outline" className="gap-2">
                            <CheckCircle className="h-4 w-4" /> Escanear QR
                        </Button>
                    </Link>
                    <Button variant="brand">Link Público</Button>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard
                    label="Anfitriones"
                    value={stats?.totalHosts || 0}
                    sub="Total inscritos"
                    icon={Users}
                />
                <StatsCard
                    label="Confirmados"
                    value={stats?.confirmedHosts || 0}
                    sub={`${Math.round(((stats?.confirmedHosts || 0) / (stats?.totalHosts || 1)) * 100)}% tasa`}
                    className="text-green-600"
                    icon={CheckCircle}
                />
                <StatsCard
                    label="En Lista"
                    value={stats?.totalGuestsRegistered || 0}
                    sub={`de ${stats?.totalGuestsPotential || 0} cupos`}
                    icon={Clock}
                />
                <StatsCard
                    label="Check-in"
                    value={stats?.checkedInHosts || 0}
                    sub="Ya ingresaron"
                    className="text-indigo-600"
                    icon={AlertCircle}
                />
            </div>

            {/* Operational Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
                <TabButton
                    active={activeTab === 'general'}
                    onClick={() => setActiveTab('general')}
                    label="General"
                />
                <TabButton
                    active={activeTab === 'anfitriones'}
                    onClick={() => setActiveTab('anfitriones')}
                    label={`Anfitriones (${hosts.length})`}
                />
                <TabButton
                    active={activeTab === 'validations'}
                    onClick={() => setActiveTab('validations')}
                    label="Validaciones (Stories)"
                    badge={hosts.filter(h => h.estado === 'revision').length}
                />
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
                {activeTab === 'general' && (
                    <div className="p-4 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                        <p>Gráficos de tendencia y feed de actividad próximamente.</p>
                    </div>
                )}

                {activeTab === 'anfitriones' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Lista de Anfitriones</h2>
                            <AddHostDialog eventId={event.id} />
                        </div>
                        <Card>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 border-b">
                                            <tr>
                                                <th className="p-3 text-left font-medium text-slate-500">Nombre</th>
                                                <th className="p-3 text-left font-medium text-slate-500">Estado</th>
                                                <th className="p-3 text-center font-medium text-slate-500">Invitados</th>
                                                <th className="p-3 text-center font-medium text-slate-500">Covers</th>
                                                <th className="p-3 text-center font-medium text-slate-500">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {hosts.map((host: any) => (
                                                <tr key={host.id} className="hover:bg-slate-50">
                                                    <td className="p-3 font-medium">{host.anfitriones?.nombre}</td>
                                                    <td className="p-3">
                                                        <StatusBadge status={host.estado} />
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        {host.invitados_registrados} / {host.cupo_invitados}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <CoverAssignment
                                                            hostEventId={host.id}
                                                            currentQuota={host.cupo_covers || 0}
                                                        />
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <Link href={`/p/${host.access_token}`}>
                                                            <Button size="sm" variant="outline">Ver Portal</Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'validations' && (
                    <div className="grid gap-3">
                        {hosts.filter(h => h.estado === 'revision').length === 0 && (
                            <div className="p-12 text-center">
                                <div className="mx-auto h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="font-medium text-slate-900">Todo al día</h3>
                                <p className="text-slate-500 text-sm">No hay historias pendientes de validar.</p>
                            </div>
                        )}

                        {hosts.filter(h => h.estado === 'revision').map(host => (
                            <Card key={host.id} className="p-4 flex gap-4 items-start">
                                {host.evidencia_url ? (
                                    <div className="h-40 w-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                                        {/* Using img tag for simplicity in MVP, upgrade to Image later */}
                                        <img src={host.evidencia_url} alt="Evidencia" className="h-full w-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="h-40 w-24 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="text-slate-400" />
                                    </div>
                                )}

                                <div className="flex-1">
                                    <h4 className="font-bold text-lg">{host.anfitriones?.nombre}</h4>
                                    <p className="text-slate-500 text-sm mb-4">Ha subido evidencia de su historia.</p>
                                    <div className="flex gap-2">
                                        <Button
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={async () => {
                                                const { updateValidationStatus } = await import("@/actions/validation-actions");
                                                await updateValidationStatus(host.id, 'confirmado', `/eventos/${event.id}`);
                                            }}
                                        >
                                            Aprobar
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={async () => {
                                                const { updateValidationStatus } = await import("@/actions/validation-actions");
                                                await updateValidationStatus(host.id, 'rechazado', `/eventos/${event.id}`);
                                            }}
                                        >
                                            Rechazar
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatsCard({ label, value, sub, icon: Icon, className }: any) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-medium text-slate-500 uppercase">{label}</p>
                    {Icon && <Icon className="h-4 w-4 text-slate-400" />}
                </div>
                <div className={cn("text-2xl font-bold", className)}>{value}</div>
                {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
            </CardContent>
        </Card>
    );
}

function TabButton({ active, onClick, label, badge }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2",
                active
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
            )}
        >
            {label}
            {badge !== undefined && badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {badge}
                </span>
            )}
        </button>
    );
}
