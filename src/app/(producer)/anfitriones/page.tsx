import { getAllHosts, getPendingHosts } from "@/actions/host-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, User } from "lucide-react";
import { HostApprovalButtons } from "@/components/host-approval-buttons"; // We'll create this client component

export default async function AnfitrionesPage() {
    const pendingHosts = await getPendingHosts();
    const approvedHosts = await getAllHosts();

    return (
        <div className="p-4 space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold mb-1">Base de Anfitriones</h1>
                <p className="text-slate-500">Gestión global de staff y anfitriones.</p>
            </div>

            {/* Pending Requests Queue */}
            {pendingHosts.length > 0 && (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                        <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full">{pendingHosts.length}</span>
                        Solicitudes Pendientes
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {pendingHosts.map((host: any) => (
                            <Card key={host.id} className="p-4 bg-white shadow-sm border-orange-100">
                                <div className="flex gap-4">
                                    {/* Evidence Thumbnail - Click to zoom in real app */}
                                    <div className="h-24 w-16 bg-slate-100 rounded flex-shrink-0 overflow-hidden border">
                                        {host.evidencia_seguidores_url ? (
                                            <img src={host.evidencia_seguidores_url} className="h-full w-full object-cover" alt="evidencia" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">Sin foto</div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-bold text-slate-900">{host.nombre}</h3>
                                        <p className="text-sm text-indigo-600 font-medium">{host.instagram_handle ? `@${host.instagram_handle}` : 'Sin Instragram'}</p>
                                        <p className="text-xs text-slate-500">{host.email} • {host.telefono}</p>

                                        <div className="pt-2">
                                            <HostApprovalButtons hostId={host.id} />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Approved Hosts List */}
            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Staff Activo ({approvedHosts.length})</h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="p-4">Nombre</th>
                                    <th className="p-4">Contacto</th>
                                    <th className="p-4 text-center">Eventos</th>
                                    <th className="p-4 text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {approvedHosts.map((host: any) => (
                                    <tr key={host.id} className="hover:bg-slate-50">
                                        <td className="p-4 font-medium flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                {host.nombre.charAt(0)}
                                            </div>
                                            {host.nombre}
                                        </td>
                                        <td className="p-4 text-slate-500">
                                            <div className="flex flex-col">
                                                <span>{host.email || '-'}</span>
                                                <span className="text-xs">{host.telefono}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-slate-500">-</td>
                                        <td className="p-4 text-center">
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Activo</span>
                                        </td>
                                    </tr>
                                ))}
                                {approvedHosts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-400">
                                            No hay anfitriones activos aún.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
