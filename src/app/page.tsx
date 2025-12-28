import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TokenLoginDialog } from "@/components/token-login-dialog";
import { ArrowRight, CheckCircle2, BarChart3, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar B2B */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Productoras.app</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/postular">
              <Button variant="ghost">Postular como Anfitrión</Button>
            </Link>
            <Link href="/login">
              <Button>Acceso Clientes</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section B2B */}
      <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Gestión de eventos, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              simplificada.
            </span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            La plataforma definitiva para productoras modernas. Gestiona tus listas de invitados,
            controla tu staff de anfitriones y valida accesos con QR en tiempo real.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login">
              <Button size="xl" className="h-12 px-8 text-base w-full sm:w-auto">
                Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <TokenLoginDialog />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Métricas en Tiempo Real</h3>
              <p className="text-slate-500 leading-relaxed">
                Visualiza al instante cuántos invitados han ingresado, quién vendió más tickets y el rendimiento de tu staff.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Seguridad Total</h3>
              <p className="text-slate-500 leading-relaxed">
                Control de acceso mediante códigos QR únicos y rotativos. Olvídate de las listas de papel y el fraude.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Gestión de Staff</h3>
              <p className="text-slate-500 leading-relaxed">
                Recluta, aprueba y gestiona a tus anfitriones desde un solo panel centralizado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Simple */}
      <footer className="border-t border-slate-100 py-12 text-center text-slate-400 text-sm">
        <p>© 2024 Productoras.app. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
