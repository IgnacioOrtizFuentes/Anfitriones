"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { updateHostAccountStatus } from "@/actions/host-actions";
import { toast } from "sonner";

export function HostApprovalButtons({ hostId }: { hostId: string }) {
    const [loading, setLoading] = useState(false);

    async function handleUpdate(status: 'aprobado' | 'rechazado') {
        setLoading(true);
        const res = await updateHostAccountStatus(hostId, status);
        if (res.success) {
            toast.success(`Anfitrión ${status === 'aprobado' ? 'aprobado' : 'rechazado'} correctamente`);
        } else {
            toast.error("Error: " + res.error);
        }
        setLoading(false);
    }

    return (
        <div className="flex gap-2">
            <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 h-8 text-xs gap-1"
                onClick={() => handleUpdate('aprobado')}
                disabled={loading}
            >
                <Check className="h-3 w-3" /> Aprobar
            </Button>
            <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:bg-red-50 hover:text-red-700 h-8 text-xs gap-1"
                onClick={() => handleUpdate('rechazado')}
                disabled={loading}
            >
                <X className="h-3 w-3" /> Rechazar
            </Button>
        </div>
    );
}
