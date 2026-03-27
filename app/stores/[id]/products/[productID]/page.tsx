import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LogoutButton from "@/components/logoutButton"
import BackButton from '@/components/backButton'
import PageWrapper from '@/components/pageWrapper'
import PageHeader from '@/components/pageHeader'


type PageProps = {
    params: Promise<{ id: string; productID: string }>
}

export default async function EditProduct({ params }: PageProps) {
    const { id, productID } = await params
    const supabase = await createClient()

    const {data: userData, error: userError,} = await supabase.auth.getUser()

    if (!userData.user || userError) {
        redirect('/login')
    }
    const {data: user } = await supabase.from('merchants').select('username').eq('id', userData.user.id).single()

    const { data: store } = await supabase.from('stores').select('*').eq('id', id).single()

    if (!store) {
        return <main className="p-8 text-white">Store not found.</main>
    }

    const { data: products } = await supabase.from('products').select('*').eq('store_id', id)
        .order('created_at', { ascending: false })

    const { data: product, error } = await supabase.from('products').select('*')
        .eq('id', productID)
        .eq('store_id', id)
        .single()

    if (error || !product) {
        return <main className="p-8 text-white">Produto não encontrado.</main>
    }

    async function updateProduct(formData: FormData) {
        'use server'

        const supabase = await createClient()

        await supabase.from('products').update({
                name: String(formData.get('name') || ''),
                description: String(formData.get('description') || ''),
                price: Number(formData.get('price') || 0),
                available: formData.get('available') === 'on',
            })
            .eq('id', productID)

        revalidatePath(`/stores/${id}/products`)
        revalidatePath(`/stores/${id}/products/${productID}`)
        redirect(`/stores/${id}/products`)
    }

    async function deleteProduct() {
        'use server'

        const supabase = await createClient()

        await supabase.from('products').delete().eq('id', productID)

        revalidatePath(`/stores/${id}/products`)
        redirect(`/stores/${id}/products`)
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
                        <p className="text-sm text-white/60">Products</p>
                    </div>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center">
                    <div className="space-y-4">
                        {products?.length ? (
                            products.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/stores/${id}/products/${item.id}`}
                                    className="block"
                                >
                                    <Card
                                        className={`w-full rounded-2xl border bg-white/5 text-white backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)] 'border-purple-500/30' ${
                                            item.id === productID
                                                ? 'border-purple-400'
                                                : 'border-purple-500/30'
                                        }`}
                                    >
                                        <CardContent className="space-y-3 p-6">
                                            <h2 className="text-xl font-semibold">{item.name}</h2>

                                            <p className="text-white/70">{item.description}</p>

                                            <div className="space-y-1 text-sm">
                                                <p>
                                                    <span className="text-white/50">Price:</span>{' '}
                                                    <span
                                                        className="text-white">€ {Number(item.price).toFixed(2)}</span>
                                                </p>

                                                <p>
                                                    <span className="text-white/50">Available:</span>{' '}
                                                    <span
                                                        className={
                                                            item.available ? 'text-emerald-300' : 'text-white/60'
                                                        }
                                                    >{item.available ? 'Yes' : 'No'}</span>
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
                    <Card
                        className="h-fit rounded-2xl border border-purple-500/30 bg-white/5 text-white backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)] animate-smooth-in-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Edit Product</CardTitle>
                            <Button
                                asChild
                                variant="ghost"
                                className="text-white/70 hover:text-white hover:bg-white/10"
                            >
                                <Link href={`/stores/${id}/products`}>
                                    ✕
                                </Link>
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <form action={updateProduct} className="space-y-4">
                                <Input
                                    name="name"
                                    defaultValue={product.name}
                                    placeholder="Name"
                                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                                />

                                <Input
                                    name="description"
                                    defaultValue={product.description}
                                    placeholder="Description"
                                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                                />

                                <Input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={product.price}
                                    placeholder="Price"
                                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                                />

                                <label className="flex items-center gap-3 text-sm text-white/80">
                                    <input
                                        type="checkbox"
                                        name="available"
                                        defaultChecked={product.available}
                                        className="h-4 w-4"
                                    />
                                    Available
                                </label>

                                <div className="flex gap-3">
                                    <Button type="submit" className="flex-1">
                                      Save
                                    </Button>

                                </div>
                            </form>

                            <form action={deleteProduct}>
                                <Button type="submit" variant="destructive" className="w-full">
                                   Delete Product
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
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