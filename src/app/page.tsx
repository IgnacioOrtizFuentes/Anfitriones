import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HostApplicationForm } from "@/components/host-application-form";
import { TokenLoginDialog } from "@/components/token-login-dialog";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Simple */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">SaaS Productoras</h1>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Area Productores</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 p-6 md:p-12 max-w-7xl mx-auto">
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Únete al staff de eventos <br /> <span className="text-indigo-600">más exclusivo.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-lg">
            Gestiona tus listas, obtén accesos QR únicos y gana beneficios por ser anfitrión.
            Postula hoy mismo para unirte a nuestra red.
          </p>
          <div className="flex gap-4 pt-2">
            <TokenLoginDialog />
          </div>
        </div>

        {/* Application Form */}
        <div className="flex-1 w-full max-w-md">
          <HostApplicationForm />
        </div>
      </div>
    </div>
  );
}
