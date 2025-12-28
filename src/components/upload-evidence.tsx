"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle, AlertCircle } from "lucide-react";
import { uploadEvidence } from "@/actions/validation-actions";

export function UploadEvidence({ hostId }: { hostId: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("hostId", hostId);

        try {
            const result = await uploadEvidence(formData);
            if (result.success) {
                setMessage({ type: 'success', text: 'Evidencia subida correctamente. Esperando aprobación.' });
                setFile(null);
            } else {
                setMessage({ type: 'error', text: result.error || 'Error al subir la imagen.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error inesperado.' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                <div className="flex flex-col items-center gap-2">
                    {file ? (
                        <>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                            <p className="text-sm font-medium text-slate-700">{file.name}</p>
                            <p className="text-xs text-slate-400">Clic para cambiar</p>
                        </>
                    ) : (
                        <>
                            <UploadCloud className="h-8 w-8 text-slate-400" />
                            <p className="text-sm font-medium text-slate-700">Sube captura de tu historia</p>
                            <p className="text-xs text-slate-400">JPG o PNG</p>
                        </>
                    )}
                </div>
            </div>

            {message && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'error' && <AlertCircle className="h-4 w-4" />}
                    {message.text}
                </div>
            )}

            <Button
                className="w-full"
                disabled={!file || uploading || message?.type === 'success'}
                onClick={handleUpload}
            >
                {uploading ? "Subiendo..." : "Enviar para Validación"}
            </Button>
        </div>
    );
}
