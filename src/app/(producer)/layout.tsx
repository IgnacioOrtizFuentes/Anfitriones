import { ProducerNav } from "@/components/producer-nav";

export default function ProducerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <ProducerNav />
            {/* Content wrapper with padding for bottom nav on mobile and sidebar on desktop */}
            <main className="pb-20 md:ml-64 md:pb-8">
                <div className="mx-auto max-w-5xl md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
