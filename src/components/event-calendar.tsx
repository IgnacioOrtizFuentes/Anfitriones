"use client";

import { useState } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useRouter } from 'next/navigation';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    estado: string;
}

export function EventCalendar({ events }: { events: any[] }) {
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState<View>('month');

    // Transform events to calendar format
    const calendarEvents: CalendarEvent[] = events.map(event => ({
        id: event.id,
        title: event.nombre,
        start: new Date(event.fecha),
        end: new Date(event.fecha),
        estado: event.estado
    }));

    // Color events by status
    const eventStyleGetter = (event: CalendarEvent) => {
        let backgroundColor = '#3b82f6'; // default blue

        if (event.estado === 'finalizado') {
            backgroundColor = '#64748b'; // gray
        } else if (event.estado === 'borrador') {
            backgroundColor = '#f59e0b'; // amber
        } else if (event.estado === 'publicado') {
            backgroundColor = '#10b981'; // green
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '6px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block',
                fontWeight: '500'
            }
        };
    };

    return (
        <div className="h-[700px] bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                date={date}
                view={view}
                onNavigate={(newDate) => setDate(newDate)}
                onView={(newView) => setView(newView)}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event) => {
                    router.push(`/eventos/${event.id}`);
                }}
                messages={{
                    next: "Siguiente",
                    previous: "Anterior",
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    agenda: "Agenda",
                    date: "Fecha",
                    time: "Hora",
                    event: "Evento",
                    noEventsInRange: "No hay eventos en este rango."
                }}
            />
        </div>
    );
}
