import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBoardStats, getTopHosts } from "@/actions/analytics-actions";
import { Users, Calendar, UserCheck, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
    const stats = await getBoardStats();
    const topHosts = await getTopHosts();

    return (
        <div className="p-4 space-y-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900">Hola, Productora</h1>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Eventos Totales</CardTitle>
                        <Calendar className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalEvents}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Staff Activo</CardTitle>
                        <UserCheck className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-600">{stats.totalHosts}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Invitados Históricos</CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalGuests}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Hosts Table */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    Ranking de Anfitriones (Top 5)
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="p-4">#</th>
                                <th className="p-4">Anfitrión</th>
                                <th className="p-4 text-center">Eventos</th>
                                <th className="p-4 text-center">Invitados Totales</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {topHosts.map((host: any, index: number) => (
                                <tr key={host.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-400 w-10">#{index + 1}</td>
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border">
                                            {host.avatar_url ? (
                                                <img src={host.avatar_url} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-xs text-slate-500 font-bold">{host.nombre.charAt(0)}</span>
                                            )}
                                        </div>
                                        {host.nombre}
                                    </td>
                                    <td className="p-4 text-center text-slate-500">{host.eventos_count}</td>
                                    <td className="p-4 text-center font-bold text-indigo-600">{host.total_invitados}</td>
                                </tr>
                            ))}
                            {topHosts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-400">
                                        Aún no hay datos suficientes para el ranking.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
