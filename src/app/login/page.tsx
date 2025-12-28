import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signup } from "@/actions/auth-actions"; // We need to create this action

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-slate-50">
            <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Iniciar Sesión</h1>
                    <p className="text-sm text-slate-500 mt-2">Acceso exclusivo para productoras</p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required placeholder="tu@email.com" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button formAction={login} className="w-full" size="lg">
                            Ingresar
                        </Button>
                        <Button formAction={signup} variant="outline" className="w-full" size="lg">
                            Crear Cuenta
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
