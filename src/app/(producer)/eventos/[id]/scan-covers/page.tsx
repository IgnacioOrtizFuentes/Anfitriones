import { ScanCoverClient } from "./scan-cover-client";

export default function ScanCoverPage({ params }: { params: Promise<{ id: string }> }) {
    return <ScanCoverClient />;
}
