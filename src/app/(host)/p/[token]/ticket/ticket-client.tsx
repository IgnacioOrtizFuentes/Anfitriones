"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, MapPin, Calendar, Ticket } from "lucide-react";
import Link from "next/link";

export default function TicketClient({ host, guests }: { host: any, guests: any[] }) {
    const [currentTicket, setCurrentTicket] = useState<'host' | string>('host');
    const event = host.eventos;

    const generateQRData = (type: 'host' | 'guest', id: string) => {
        return JSON.stringify({
            type,
            id, // hostId or guestId
            parentId: host.id, // always hostId for context
            eventId: event.id
        });
    };

    const activeGuest = guests.find(g => g.id === currentTicket);
    const isHostTicket = currentTicket === 'host';

    const qrValue = isHostTicket
        ? generateQRData('host', host.id)
        : generateQRData('guest', activeGuest?.id);

    const ticketOwnerName = isHostTicket ? host.anfitriones?.nombre : activeGuest?.nombre_completo;
    const ticketLabel = isHostTicket ? "Anfitrión Titular" : "Invitado (+1)";
    const ticketStatus = isHostTicket ? host.estado : activeGuest?.estado;

    return (
        <div className="min-h-screen bg-slate-100 p-4 flex flex-col items-center justify-center">

            <Link href={`/p/${host.access_token}`} className="absolute top-4 left-4 z-10">
                <Button variant="ghost" size="sm" className="gap-2 bg-white/50 backdrop-blur-sm hover:bg-white/80">
                    <ArrowLeft className="h-4 w-4" /> Volver
                </Button>
            </Link>

            {/* Pagination / Navigation */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto max-w-full p-2 w-full justify-center">
                <Button
                    variant={isHostTicket ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentTicket('host')}
                    className="whitespace-nowrap rounded-full transition-all"
                >
                    Yo (Anfitrión)
                </Button>
                {guests.map((guest, idx) => (
                    <Button
                        key={guest.id}
                        variant={currentTicket === guest.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentTicket(guest.id)}
                        className="whitespace-nowrap rounded-full transition-all"
                    >
                        Invitado {idx + 1}
                    </Button>
                ))}
            </div>

            <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden transition-all duration-300">
                <div className="bg-slate-900 p-6 text-white text-center">
                    <h1 className="text-xl font-bold mb-2">{event.nombre}</h1>
                    <div className="flex justify-center gap-4 text-xs text-slate-300">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(event.fecha).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.lugar}</span>
                    </div>
                </div>

                <div className="bg-white p-6 flex flex-col items-center relative min-h-[400px] justify-center">
                    {/* Haly-circles for ticket effect */}
                    <div className="absolute -left-3 top-[-12px] h-6 w-6 rounded-full bg-slate-100" />
                    <div className="absolute -right-3 top-[-12px] h-6 w-6 rounded-full bg-slate-100" />

                    <div className="mb-6 text-center animate-in fade-in zoom-in-50 duration-300" key={currentTicket}>
                        <div className="mb-2 flex justify-center">
                            {/* Small status badge */}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border ${ticketStatus === 'ingresado' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                                    ticketStatus === 'confirmado' || ticketStatus === 'en_lista' ? 'bg-green-100 text-green-700 border-green-200' :
                                        'bg-slate-100 text-slate-500 border-slate-200'
                                }`}>
                                {ticketStatus === 'en_lista' ? 'CONFIRMADO' : ticketStatus}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold">{ticketOwnerName}</h2>
                        <p className="text-slate-500 text-sm font-medium flex items-center justify-center gap-1">
                            <Ticket className="h-3 w-3" /> {ticketLabel}
                        </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border-2 border-slate-900 mb-6 shadow-sm">
                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={qrValue}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    </div>

                    <p className="text-xs text-center text-slate-400 max-w-[200px]">
                        Presenta este código en la entrada.
                    </p>
                </div>

                <CardFooter className="bg-slate-50 border-t border-slate-100 p-4">
                    <Button variant="outline" className="w-full gap-2" onClick={() => window.print()}>
                        <Download className="h-4 w-4" /> Screenshot / Imprimir
                    </Button>
                </CardFooter>
            </Card>

            <p className="mt-8 text-xs text-slate-400">ID: {isHostTicket ? host.access_token.slice(0, 8) : activeGuest?.id.slice(0, 8)}...</p>
        </div>
    );
}
