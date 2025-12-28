"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitHostApplication } from "@/actions/onboarding-actions";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

export function HostApplicationForm() {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const res = await submitHostApplication(formData);

        if (res.success) {
            toast.success("¡Solicitud enviada! Te contactaremos pronto.");
            // Reset form manually or redirect
            (document.getElementById("application-form") as HTMLFormElement).reset();
        } else {
            toast.error("Error: " + res.error);
        }
        setLoading(false);
    }

    return (
        <form id="application-form" action={handleSubmit} className="space-y-4 max-w-md w-full bg-white p-6 rounded-xl shadow-lg border border-slate-100 mx-auto">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">Postula como Anfitrión</h3>

            <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input id="nombre" name="nombre" placeholder="Tu nombre real" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="contacto@..." required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="telefono">WhatsApp</Label>
                    <Input id="telefono" name="telefono" type="tel" placeholder="+56 9..." />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="instagram">Usuario Instagram</Label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">@</span>
                    <Input id="instagram" name="instagram" className="pl-7" placeholder="tu_usuario" required />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="evidencia">Evidencia de Seguidores/Alcance</Label>
                <div className="flex items-center gap-2">
                    <Input id="evidencia" name="evidencia" type="file" accept="image/*" className="cursor-pointer" required />
                </div>
                <p className="text-xs text-slate-500">Sube un pantallazo de tu perfil o estadísticas de stories.</p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Postulación"}
            </Button>
        </form>
    );
}
