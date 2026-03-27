import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from "next/image";
import LogoutButton from "@/components/logoutButton";
import BackButton from '@/components/backButton'
import { Input } from '@/components/ui/input'
import PageWrapper from '@/components/pageWrapper'
import PageHeader from '@/components/pageHeader'

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function EditStore({params}: PageProps) {
    const {id} = await params
    const supabase = await createClient()

    const {data: userData, error: userError} = await supabase.auth.getUser()

    if (userError || !userData.user) {
        redirect('/login')
    }

    const {data: user } = await supabase.from('merchants').select('username').eq('id', userData.user.id).single()


    const {data: stores, error} = await supabase.from('stores').select('*').eq('id', id).single()

    if (error || !stores) {
        return <main className="p-8">Store not found</main>
    }

    async function updateStore(formData: FormData) {
        'use server'

        const supabase = await createClient()
        const {data: userData} = await supabase.auth.getUser()

        if (!userData.user) {
            redirect('/login')
        }

        //PAYLOAD?????
        const payload = {
            name: String(formData.get('name') || ''),
            street: String(formData.get('street') || ''),
            city: String(formData.get('city') || ''),
            state: String(formData.get('state') || ''),
            zip_code: String(formData.get('zip_code') || ''),
            phone_number: String(formData.get('phone_number') || ''),
            timezone: String(formData.get('timezone') || ''),
        }

        await supabase.from('stores').update(payload).eq('id', id)

        revalidatePath('/stores')
        revalidatePath(`/stores/${id}`)
        redirect('/dashboard')
    }

    async function deactivateStore() {
        'use server'

        const supabase = await createClient()
        const {data: userData} = await supabase.auth.getUser()

        if (!userData.user) {
            redirect('/login')
        }

        await supabase.from('stores').update({active: false}).eq('id', id)

        revalidatePath('/stores')
        redirect('/dashboard')
    }

    return (
        <PageWrapper>
            <PageHeader
                title={`${user?.username}'s Dashboard`}
                subtitle="Manage your stores with just one click"
            />
                <div className="relative z-10 flex justify-center px-4">
                    <Card
                        className="w-full max-w-2xl rounded-2xl border border-purple-500/30 bg-white/5 text-white backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Edit Store</CardTitle>

                            <Button
                                asChild
                                variant="ghost"
                                className="text-white/70 hover:text-white hover:bg-white/10"
                            >
                                <Link href={`/dashboard`}>✕</Link>
                            </Button>
                        </CardHeader>

                        <CardContent>
                            <form action={updateStore} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Name</label>
                                    <Input
                                        name="name"
                                        defaultValue={stores.name}
                                        placeholder="Name"
                                        className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Street</label>
                                    <Input
                                        name="street"
                                        defaultValue={stores.street}
                                        placeholder="Street"
                                        className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">City</label>
                                    <Input
                                        name="city"
                                        defaultValue={stores.city}
                                        placeholder="City"
                                        className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">State</label>
                                    <Input
                                        name="state"
                                        defaultValue={stores.state}
                                        placeholder="State"
                                        className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Zip Code</label>
                                    <Input
                                        name="zip_code"
                                        defaultValue={stores.zip_code}
                                        placeholder="Zip code"
                                        className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Phone Number</label>
                                    <Input
                                        name="phone_number"
                                        defaultValue={stores.phone_number}
                                        placeholder="Phone number"
                                        className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Timezone</label>
                                    <Input
                                        name="timezone"
                                        defaultValue={stores.timezone}
                                        placeholder="Timezone"
                                        className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    Save
                                </Button>
                            </form>

                            <form action={deactivateStore} className="mt-6">
                                <Button type="submit" variant="destructive" className="w-full">
                                    Deactivate Store
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
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