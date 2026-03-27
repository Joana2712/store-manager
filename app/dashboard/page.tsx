import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import  LogoutButton  from '@/components/logoutButton'
import Image from "next/image";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageWrapper from '@/components/pageWrapper'
import PageHeader from '@/components/pageHeader'

export default async function Dashboard(){
    const supabase = await createClient()
    const {data: { user },} = await supabase.auth.getUser()

    if (!user) 
        return

    const { data: users, error } = await supabase.from('merchants').select('username').eq('id', user.id).single()

    const { data: stores } = await supabase.from('stores').select('*').eq('merchant_id', user.id)
    
    return (
        <PageWrapper>
            <PageHeader
                title={`${users?.username}'s Dashboard`}
                subtitle="Manage your stores with just one click"
            />
            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 text-white">
                <div className="relative z-10 px-8 pb-10">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {stores?.map((store) => (

                            <Card
                                key={store.id}
                                className="border border-purple-500/30 bg-white/5 text-white backdrop-blur-md rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.15)]
                                    transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.35)]">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between text-lg">
                                        <span>{store.name}</span>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs ${
                                                store.active
                                                    ? 'bg-emerald-500/20 text-emerald-300'
                                                    : 'bg-white/10 text-white/60'
                                            }`}
                                        >
                                        {store.active ? 'Active' : 'Inactive'}
                                    </span>
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-sm text-white/70">
                                        Location: {store.street}, {store.city}, {store.state}
                                    </p>
                                    <p className="text-sm text-white/70">
                                        Phone Number: {store.phone_number}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10"
                                        >
                                            <Link href={`/stores/${store.id}/products`}>View Products</Link>
                                        </Button>

                                        <Button
                                            asChild
                                            variant="outline"
                                            className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10"
                                        >
                                            <Link href={`/stores/${store.id}`}>Edit Store</Link>
                                        </Button>
                                    </div>

                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="sticky bottom-6 mt-12 flex justify-center">
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full border-white/50 bg-transparent px-8 py-5 text-xl text-white hover:bg-white/10"
                        >
                            <Link href="/stores/newStore">+ Add Store</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-6 right-6 z-20">
                <LogoutButton/>
            </div>
        </PageWrapper>
    )
}
