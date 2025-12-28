"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateCoverQR } from "@/actions/cover-actions";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { Ticket, CheckCircle, XCircle } from "lucide-react";

export function CoverManager({ hostEventId, cupoCovers, covers }: {
    hostEventId: string,
    cupoCovers: number,
    covers: any[]
}) {
    const [loading, setLoading] = useState(false);
    const [generatedCovers, setGeneratedCovers] = useState(covers);

    async function handleGenerate() {
        setLoading(true);
        const result = await generateCoverQR(hostEventId);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Cover generado exitosamente");
            // Reload the page to show new cover
            window.location.reload();
        }
        setLoading(false);
    }

    const availableCovers = cupoCovers - generatedCovers.length;

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                <div>
                    <p className="text-sm text-slate-600">Covers asignados</p>
                    <p className="text-2xl font-bold text-indigo-600">{cupoCovers}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-600">Generados</p>
                    <p className="text-2xl font-bold">{generatedCovers.length}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-600">Disponibles</p>
                    <p className="text-2xl font-bold text-green-600">{availableCovers}</p>
                </div>
            </div>

            {/* Generate Button */}
            {availableCovers > 0 && (
                <Button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                >
                    <Ticket className="mr-2 h-5 w-5" />
                    {loading ? "Generando..." : "Generar Nuevo Cover"}
                </Button>
            )}

            {availableCovers === 0 && cupoCovers > 0 && (
                <p className="text-center text-amber-600 text-sm">
                    Has alcanzado tu límite de covers.
                </p>
            )}

            {cupoCovers === 0 && (
                <p className="text-center text-slate-400 text-sm">
                    No tienes covers asignados para este evento.
                </p>
            )}

            {/* Covers List */}
            <div className="space-y-4">
                <h3 className="font-semibold text-slate-700">Mis Covers QR</h3>
                {generatedCovers.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-8">
                        Aún no has generado covers.
                    </p>
                )}

                {generatedCovers.map((cover: any) => (
                    <Card key={cover.id} className="p-4">
                        <div className="flex gap-4 items-center">
                            <div className="flex-shrink-0 bg-white p-2 border rounded">
                                <QRCode value={cover.codigo_qr} size={100} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    {cover.usado ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-slate-400" />
                                    )}
                                    <span className={`text-sm font-medium ${cover.usado ? 'text-green-600' : 'text-slate-500'}`}>
                                        {cover.usado ? 'Utilizado' : 'Sin usar'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400">
                                    Generado: {new Date(cover.created_at).toLocaleDateString()}
                                </p>
                                {cover.usado && (
                                    <p className="text-xs text-slate-400">
                                        Usado: {new Date(cover.fecha_uso).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
