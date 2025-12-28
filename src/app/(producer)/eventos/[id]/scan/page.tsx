import ScanClient from "./scan-client";

export default function ScanPage({ params }: { params: Promise<{ id: string }> }) {
    // We could fetch event details here to show "Scanning for Event X"
    return <ScanClient params={params} />;
}
