import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Space_Grotesk } from "next/font/google"
import { Inter } from "next/font/google"

const titleFont = Space_Grotesk({ subsets: ["latin"] })
const bodyFont = Inter({ subsets: ["latin"] })

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src="/initial-bg.jpg"
                    alt="Store background"
                    fill
                    priority
                    className="object-cover scale-105 scale-x-[-1] blur-[2px]"
                />
                <div className="absolute inset-0 bg-black/50"/>
            </div>

            <div className="absolute top-0 left-[70%] h-full w-px bg-gradient-to-b from-transparent via-white/40 to-transparent -translate-x-1/2 z-10"/>
            <div className="relative z-10 flex min-h-screen items-center justify-end pr-24 md:pr-32 lg:pr-40">
                <div className="max-w-xl text-right animate-smooth-in">
                    <h1 className={`${titleFont.className} text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight`}>Foodlivra</h1>
                    <p className={`${bodyFont.className} mt-2 text-sm md:text-base text-white/80 max-w-md ml-auto`}>All
                        Your Stores in One Place.</p>

                    <div className="mt-8 flex justify-end">
                        <Button
                            asChild variant="outline"
                            className="rounded-full border-white/50 bg-transparent px-8 py-5 text-xl text-white hover:bg-white/10">
                            <Link href="/login" className={`${bodyFont.className}`}>Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    )
}
