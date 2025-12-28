"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { checkInHost } from "@/actions/scan-actions";
import { use } from "react";

export default function ScanClient({ params }: { params: Promise<{ id: string }> }) {
    const { id: eventId } = use(params);
    const [scanResult, setScanResult] = useState<any>(null);
    const [isScanning, setIsScanning] = useState(true);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Initialize Scanner only once and if we are in scanning mode
        if (isScanning && !scannerRef.current) {
            const scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );

            scanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = scanner;
        }

        // Cleanup function
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => console.error("Failed to clear html5-qrcode scanner. ", error));
                scannerRef.current = null;
            }
        };
    }, [isScanning]);

    const onScanSuccess = async (decodedText: string) => {
        if (!isScanning) return;

        // Pause scanning
        setIsScanning(false);
        if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
        }

        const result = await checkInHost(decodedText);
        setScanResult(result);
    };

    const onScanFailure = (error: any) => {
        console.warn(`Code scan error = ${error}`);
    };

    const resetScan = () => {
        setScanResult(null);
        setIsScanning(true);
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <Link href={`/eventos/${eventId}`}>
                    <Button variant="ghost" className="text-white hover:bg-white/20">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold">Escáner de Acceso</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">

                {isScanning && (
                    <Card className="w-full max-w-sm bg-slate-900 border-slate-800 p-4">
                        <div id="reader" className="w-full overflow-hidden rounded-lg"></div>
                        <p className="text-center text-slate-400 mt-4 text-sm">Apunta al código QR del invitado</p>
                    </Card>
                )}

                {!isScanning && scanResult && (
                    <div className="w-full max-w-sm animate-in zoom-in-95 duration-300">
                        {scanResult.success ? (
                            <div className="bg-green-600 rounded-2xl p-8 text-center shadow-2xl shadow-green-900/50">
                                <CheckCircle className="h-20 w-20 text-white mx-auto mb-4" />
                                <h2 className="text-3xl font-bold mb-2">¡Bienvenido!</h2>
                                <p className="text-green-100 text-xl font-medium">{scanResult.host?.anfitriones?.nombre}</p>
                                <div className="mt-6 bg-white/20 rounded-lg p-3 inline-block">
                                    <span className="text-sm font-bold uppercase tracking-wider">Acceso Permitido</span>
                                </div>
                            </div>
                        ) : (
                            <div className={`rounded-2xl p-8 text-center shadow-2xl ${scanResult.error.includes("YA INGRESÓ") ? "bg-yellow-600 shadow-yellow-900/50" : "bg-red-600 shadow-red-900/50"}`}>
                                {scanResult.error.includes("YA INGRESÓ") ? (
                                    <AlertTriangle className="h-20 w-20 text-white mx-auto mb-4" />
                                ) : (
                                    <XCircle className="h-20 w-20 text-white mx-auto mb-4" />
                                )}
                                <h2 className="text-2xl font-bold mb-4">{scanResult.error.includes("YA INGRESÓ") ? "ALERTA" : "ACCESO DENEGADO"}</h2>
                                <p className="text-white/90 text-lg mb-2">{scanResult.error}</p>
                                {scanResult.host && (
                                    <p className="font-bold border-t border-white/20 pt-2 mt-2">{scanResult.host?.anfitriones?.nombre}</p>
                                )}
                            </div>
                        )}

                        <div className="mt-8">
                            <Button size="xl" className="w-full bg-white text-black hover:bg-slate-200 font-bold gap-2" onClick={resetScan}>
                                <RefreshCw className="h-5 w-5" /> Escanear Siguiente
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
