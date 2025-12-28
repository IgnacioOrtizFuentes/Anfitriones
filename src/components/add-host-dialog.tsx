"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { addHostToEvent } from "@/actions/event-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AddHostDialog({ eventId }: { eventId: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        // We need to wrap the action call to pass eventId, or bind it. 
        // For simplicity here, we call the action directly.
        const res = await addHostToEvent(eventId, formData);

        if (res.success) {
            setOpen(false);
            toast.success("Anfitrión agregado correctamente");
            router.refresh();
        } else {
            toast.error("Error: " + res.error);
        }
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                    <UserPlus className="h-4 w-4" /> Agregar Anfitrión
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar Anfitrión Manualmente</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre Completo</Label>
                        <Input id="nombre" name="nombre" placeholder="Ej. Juan Pérez" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email (Opcional)</Label>
                        <Input id="email" name="email" type="email" placeholder="Para enviar el ticket..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono (Opcional)</Label>
                        <Input id="telefono" name="telefono" type="tel" placeholder="+56 9..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cupo">Cupo de Invitados (+1s)</Label>
                        <Input id="cupo" name="cupo" type="number" defaultValue="5" min="0" required />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Agregando..." : "Agregar al Evento"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
