"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createEvent } from "@/actions/event-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CreateEventDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const res = await createEvent(formData);

        if (res.success) {
            setOpen(false);
            toast.success("Evento creado correctamente");
            router.refresh();
        } else {
            toast.error("Error al crear evento: " + res.error);
        }
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> Nuevo
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Evento</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre del Evento</Label>
                        <Input id="nombre" name="nombre" placeholder="Ej. Cumpleaños de..." required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fecha">Fecha</Label>
                        <Input id="fecha" name="fecha" type="datetime-local" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lugar">Lugar</Label>
                        <Input id="lugar" name="lugar" placeholder="Ej. Club Social..." />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creando..." : "Crear Evento"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
