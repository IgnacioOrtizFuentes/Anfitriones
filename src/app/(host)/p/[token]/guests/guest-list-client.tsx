"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, UserPlus, Trash2 } from "lucide-react";
import Link from "next/link";
import { addGuest } from "@/actions/host-actions";

export default function GuestListClient({ host, initialGuests }: { host: any, initialGuests: any[] }) {
    const [guests, setGuests] = useState(initialGuests);
    const [formData, setFormData] = useState({ nombre: "", rut: "" });
    const [loading, setLoading] = useState(false);

    const guestsCount = guests.length;
    const guestsAllowed = host.cupo_invitados || 0;
    const isFull = guestsCount >= guestsAllowed;

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (isFull) return;

        setLoading(true);

        try {
            const res = await addGuest(host.id, {
                nombre_completo: formData.nombre,
                rut_dni: formData.rut
            });

            if (res.error) {
                alert("Error: " + res.error);
            } else {
                // Optimistic update (or re-fetch)
                setGuests([...guests, {
                    id: Math.random(), // Temp ID
                    nombre_completo: formData.nombre,
                    rut_dni: formData.rut,
                    estado: 'en_lista'
                }]);
                setFormData({ nombre: "", rut: "" });
            }
        } catch (err) {
            alert("Error al agregar invitado");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white p-4 items-center flex gap-4 border-b border-slate-200 sticky top-0 z-10">
                <Link href={`/p/${host.access_token}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="font-bold text-lg">Mis Invitados</h1>
                    <p className="text-xs text-slate-500">
                        {guestsCount} de {guestsAllowed} cupos utilizados
                    </p>
                </div>
            </div>

            {/* List */}
            <div className="p-4 space-y-4">
                {guestsCount === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        <p>No tienes invitados en la lista aún.</p>
                    </div>
                )}

                {guests.map((guest: any) => (
                    <Card key={guest.id}>
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-slate-900">{guest.nombre_completo}</p>
                                <p className="text-xs text-slate-500">{guest.rut_dni || "Sin RUT"}</p>
                            </div>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                {guest.estado === 'ingresado' ? 'Ingresó' : 'En lista'}
                            </span>
                            {/* Delete button could go here */}
                        </CardContent>
                    </Card>
                ))}

                {/* Add Form (Bottom Sheet style) */}
                {!isFull && (
                    <Card className="border-indigo-100 shadow-md">
                        <CardContent className="p-4 space-y-3">
                            <h3 className="font-medium text-indigo-900 flex items-center gap-2">
                                <UserPlus className="h-4 w-4" /> Agregar Invitado
                            </h3>
                            <form onSubmit={handleAdd} className="space-y-3">
                                <input
                                    className="w-full flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Nombre Completo"
                                    required
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                />
                                <input
                                    className="w-full flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="RUT / DNI (Opcional)"
                                    value={formData.rut}
                                    onChange={e => setFormData({ ...formData, rut: e.target.value })}
                                />
                                <Button className="w-full" size="lg" disabled={loading}>
                                    {loading ? "Guardando..." : "Agregar a la lista"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {isFull && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-yellow-800 text-center text-sm">
                        Has completado tu cupo de invitados.
                    </div>
                )}
            </div>
        </div>
    );
}
