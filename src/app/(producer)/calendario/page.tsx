import { getEvents } from "@/actions/event-actions";
import { EventCalendar } from "@/components/event-calendar";

export default async function CalendarioPage() {
    const events = await getEvents();

    return (
        <div className="p-4 space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Calendario de Eventos</h1>
                <p className="text-slate-500">Vista mensual de todos tus eventos programados.</p>
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-green-500 rounded"></div>
                    <span className="text-slate-600">Publicado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-amber-500 rounded"></div>
                    <span className="text-slate-600">Borrador</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-slate-500 rounded"></div>
                    <span className="text-slate-600">Finalizado</span>
                </div>
            </div>

            <EventCalendar events={events} />
        </div>
    );
}
