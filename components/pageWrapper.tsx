import Image from "next/image"

type PageWrapperProps = {
    children: React.ReactNode
}

export default function PageWrapper({ children }: PageWrapperProps) {
    return (
        <main className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src="/dashboard-bg.jpg"
                    alt="Background"
                    fill
                    priority
                    className="object-cover scale-101 blur-[3px]"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 text-white">
                {children}
            </div>
        </main>
    )
}