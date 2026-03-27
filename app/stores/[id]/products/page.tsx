import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

import { Button } from '@/components/ui/button'
import { Card, CardContent} from '@/components/ui/card'
import LogoutButton from '@/components/logoutButton'
import BackButton from '@/components/backButton'
import PageWrapper from '@/components/pageWrapper'
import PageHeader from '@/components/pageHeader'

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function ProductsPerStore({params}: PageProps) {
    const {id} = await params
    const supabase = await createClient()

    const {data: userData, error: userError} = await supabase.auth.getUser()

    if (!userData.user || userError) {
        redirect('/login')
    }

    const {data: user } = await supabase.from('merchants').select('username').eq('id', userData.user.id).single()

    const {data: store} = await supabase.from('stores').select('*').eq('id', id).single()

    if (!store) {
        return <main className="p-8">Store não encontrada.</main>
    }

    const {data: products, error} = await supabase.from('products').select('*').eq('store_id', id)
        .order('created_at', {ascending: false})

    if (error) {
        return <main className="p-8">Error loading data.</main>
    }


    return (
        <PageWrapper>
            <PageHeader
                title={`${user?.username}'s Dashboard`}
                subtitle="Manage your stores with just one click"
            />
            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 text-white">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">{store.name}</h1>
                            <p className="text-sm text-gray-400">Products</p>
                        </div>
    
                    </div>
    
                    <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-4 max-w-4xl">
                            {products?.length ? (
                                products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/stores/${id}/products/${product.id}`}
                                        className="block"
                                    >
                                        <Card
                                            className="w-full rounded-2xl border border-purple-500/30 bg-white/5 text-white backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)] 
                                        transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.35)]"
                                        >
                                            <CardContent className="space-y-3 p-6">
                                                <h2 className="text-xl font-semibold">{product.name}</h2>
    
                                                <p className="text-white/70">{product.description}</p>
    
                                                <div className="space-y-1 text-sm">
                                                    <p>
                                                        <span className="text-white/50">Price:</span>{" "}
                                                        <span
                                                            className="text-white">€ {Number(product.price).toFixed(2)}</span>
                                                    </p>
    
                                                    <p>
                                                        <span className="text-white/50">Available:</span>{" "}
                                                        <span
                                                            className={product.available ? "text-emerald-300" : "text-white/60"}
                                                        >{product.available ? "Yes" : "No"}</span>
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-white/60">No products.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="sticky bottom-6 mt-12 flex justify-center">
                    <Button
                        asChild
                        variant="outline"
                        className="rounded-full border-white/50 bg-black/30 px-8 py-5 text-xl text-white backdrop-blur-md hover:bg-white/10"
                    >
                        <Link href={`/stores/${id}/products/newProduct`}>+ Add Product</Link>
                    </Button>
                </div>

            <div className="fixed bottom-6 right-6 z-20">
                <LogoutButton/>
            </div>
            <div className="fixed left-6 top-1/2 -translate-y-1/2 z-20">
                <BackButton href={`/dashboard`}/>
            </div>
        </PageWrapper>
    )

}
