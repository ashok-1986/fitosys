import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
            <div className="mb-8 text-center">
                <Link href="/" className="inline-block">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="text-brand">Fito</span>
                        <span className="text-foreground">sys</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Business OS for Fitness Coaches
                    </p>
                </Link>
            </div>
            <div className="w-full max-w-md">{children}</div>
        </div>
    );
}
