"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateCover } from "@/actions/cover-actions";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export function ScanCoverClient() {
    const [codigo, setCodigo] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    async function handleValidate(e: React.FormEvent) {
        e.preventDefault();
        if (!codigo.trim()) return;

        setLoading(true);
        setResult(null);

        const validation = await validateCover(codigo.trim());
        setResult(validation);
        setLoading(false);

        // Auto-clear after 3 seconds for next scan
        setTimeout(() => {
            setCodigo("");
            setResult(null);
        }, 3000);
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
            <Card className="w-full max-w-md p-6 space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Validador de Covers</h1>
                    <p className="text-slate-500 text-sm">Escanea o ingresa el código QR del cover</p>
                </div>

                <form onSubmit={handleValidate} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="codigo">Código QR</Label>
                        <Input
                            id="codigo"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            placeholder="Pega el código aquí..."
                            autoFocus
                            disabled={loading}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading || !codigo.trim()}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Validando...
                            </>
                        ) : (
                            'Validar Cover'
                        )}
                    </Button>
                </form>

                {/* Result Display */}
                {result && (
                    <div className={`p-4 rounded-lg border-2 ${result.success
                            ? 'bg-green-50 border-green-300'
                            : 'bg-red-50 border-red-300'
                        }`}>
                        <div className="flex items-center gap-3">
                            {result.success ? (
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            ) : (
                                <XCircle className="h-8 w-8 text-red-600" />
                            )}
                            <div>
                                <p className={`font-bold ${result.success ? 'text-green-900' : 'text-red-900'
                                    }`}>
                                    {result.success ? '✅ Cover Válido' : '❌ Cover Inválido'}
                                </p>
                                {result.success && (
                                    <p className="text-sm text-green-700">
                                        Anfitrión: {result.anfitrion}
                                    </p>
                                )}
                                {result.error && (
                                    <p className="text-sm text-red-700">{result.error}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
