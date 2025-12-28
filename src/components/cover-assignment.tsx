"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateHostCovers } from "@/actions/cover-actions";
import { toast } from "sonner";
import { Ticket } from "lucide-react";

export function CoverAssignment({ hostEventId, currentQuota }: { hostEventId: string, currentQuota: number }) {
    const [editing, setEditing] = useState(false);
    const [quota, setQuota] = useState(currentQuota);
    const [loading, setLoading] = useState(false);

    async function handleSave() {
        setLoading(true);
        const result = await updateHostCovers(hostEventId, quota);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Covers asignados correctamente");
            setEditing(false);
        }
        setLoading(false);
    }

    if (!editing) {
        return (
            <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">{currentQuota} covers</span>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing(true)}
                    className="h-6 text-xs"
                >
                    Editar
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Input
                type="number"
                min="0"
                value={quota}
                onChange={(e) => setQuota(parseInt(e.target.value) || 0)}
                className="h-8 w-20 text-sm"
            />
            <Button
                size="sm"
                onClick={handleSave}
                disabled={loading}
                className="h-8 text-xs"
            >
                Guardar
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                    setQuota(currentQuota);
                    setEditing(false);
                }}
                className="h-8 text-xs"
            >
                Cancelar
            </Button>
        </div>
    );
}
