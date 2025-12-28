import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar, MapPin, ChevronRight, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { getEvents } from "@/actions/event-actions";
import { CreateEventDialog } from "@/components/create-event-dialog";

export default async function EventosPage() {
    const events = await getEvents();

    return (
        <div className="p-4 space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Mis Eventos</h1>
                <h1 className="text-2xl font-bold">Mis Eventos</h1>
                <CreateEventDialog />
            </div>

            <div className="space-y-4">
                {events.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-slate-500 mb-4">No se encontraron eventos</p>
                        <form action={async () => { "use server"; await getEvents(); }}>
                            <Button variant="outline" size="sm" className="gap-2">
                                <RefreshCw className="h-4 w-4" /> Recargar
                            </Button>
                        </form>
                        {/* Note for User */}
                        <p className="text-xs text-slate-400 mt-4 max-w-xs mx-auto">
                            Si creaste uno en Supabase y no aparece, revisa las políticas RLS de la tabla 'eventos'.
                        </p>
                    </div>
                )}

                {events.map((event: any) => (
                    <Link key={event.id} href={`/eventos/${event.id}`} className="block">
                        <Card className="hover:border-indigo-200 transition-colors">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{event.nombre}</CardTitle>
                                        <p className="text-slate-500 text-sm mt-1">
                                            {new Date(event.fecha).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={
                                        "text-xs px-2 py-1 rounded-full font-medium " +
                                        (event.estado === 'publicado' ? "bg-green-100 text-green-700" : "bg-slate-100")
                                    }>
                                        {event.estado}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-slate-500 text-sm mb-2">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    <span>{event.lugar || "Sin ubicación"}</span>
                                </div>
                                {/* 
                    TODO: Fetch aggregate stats per event efficiently. 
                    For now omitting to avoid N+1 queries on the list view.
                */}
                            </CardContent>
                            <CardFooter className="bg-slate-50 p-3 flex justify-between items-center rounded-b-xl">
                                <span className="text-xs text-slate-500">Gestionar Operación</span>
                                <ChevronRight className="h-4 w-4 text-slate-400" />
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
