import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LogoutButton from "@/components/logoutButton"
/*export default async function StoresPage() {
    const supabase = await createClient()
    const {data: userData, error: userError} = await supabase.auth.getUser()

    if (userError || !userData.user) {
        redirect('/login')
    }

    const {data: stores, error} = await supabase.from('stores').select('*').order('created_at', {ascending: false})

    if (error) {
        return <main className="p-8">Erro ao carregar stores</main>
    }

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
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
                        Your Stores
                    </h1>
                    <p className="mt-3 text-sm md:text-base text-white/70">
                        View and manage your stores.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {stores?.length ? (
                        stores.map((store) => (
                            <Link
                                key={store.id}
                                href={`/stores/${store.id}`}
                                className="block"
                            >
                                <Card
                                    className="border border-purple-500/30 bg-white/5 text-white backdrop-blur-md rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.35)]"
                                >
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between text-lg">
                                            <span>{store.name}</span>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs ${
                                                    store.active
                                                        ? 'bg-emerald-500/20 text-emerald-300'
                                                        : 'bg-white/10 text-white/60'
                                                }`}
                                            >{store.active ? 'Active' : 'Inactive'}</span>
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-sm text-white/70">
                                            {store.city}, {store.state}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <p className="text-white/60">No stores yet.</p>
                    )}
                </div>
            </div>
            <div className="fixed bottom-6 right-6 z-20">
                <LogoutButton />
            </div>
        </main>
    )
}*/