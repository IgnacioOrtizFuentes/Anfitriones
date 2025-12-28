"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar, Users, Home, Settings } from "lucide-react";

const NAV_ITEMS = [
    { label: "Inicio", href: "/dashboard", icon: Home },
    { label: "Eventos", href: "/eventos", icon: Calendar },
    { label: "Calendario", href: "/calendario", icon: Calendar },
    { label: "RRHH", href: "/anfitriones", icon: Users },
];

export function ProducerNav() {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white md:hidden">
                <div className="flex h-16 items-center justify-around px-4">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors",
                                    isActive
                                        ? "text-indigo-600"
                                        : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                <item.icon className={cn("h-6 w-6", isActive && "fill-current")} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Desktop Sidebar (Hidden on mobile) */}
            <aside className="hidden w-64 border-r border-slate-200 bg-white md:fixed md:bottom-0 md:top-0 md:flex md:flex-col">
                <div className="flex h-16 items-center border-b border-slate-200 px-6 font-bold text-lg">
                    SaaS Productoras
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-slate-700 hover:bg-slate-100"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5", isActive && "text-indigo-600")} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
}
