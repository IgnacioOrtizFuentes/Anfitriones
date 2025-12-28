"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Ticket } from "lucide-react";

export function TokenLoginDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const token = formData.get("token") as string;

        if (token) {
            // Simple client-side redirect. 
            // In a real app, we might validte existence first via server action to show error inline,
            // but for now, redirecting to the dynamic route is sufficient.
            router.push(`/p/${token}`);
            setOpen(false);
        }
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Ticket className="mr-2 h-4 w-4" />
                    Ya soy anfitrión
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ingresa a tu Portal</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="token">Código de Acceso (Token)</Label>
                        <Input
                            id="token"
                            name="token"
                            placeholder="Pega tu token aquí..."
                            required
                            autoComplete="off"
                        />
                        <p className="text-xs text-slate-500">Este código te fue enviado por la productora.</p>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Entrando..." : "Ingresar"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
