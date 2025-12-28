import { HostApplicationForm } from "@/components/host-application-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PostularPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
            <Link href="/" className="absolute top-6 left-6">
                <Button variant="ghost" size="sm" className="gap-2 text-slate-500">
                    <ArrowLeft className="h-4 w-4" /> Volver al inicio
                </Button>
            </Link>

            <div className="max-w-md w-full space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold text-slate-900">Únete al Staff</h1>
                    <p className="text-slate-500">Postula para trabajar en los mejores eventos de la ciudad.</p>
                </div>

                <HostApplicationForm />
                
                <p className="text-center text-xs text-slate-400">
                    Tus datos serán revisados por nuestras productoras asociadas.
                </p>
            </div>
        </div>
    );
}
