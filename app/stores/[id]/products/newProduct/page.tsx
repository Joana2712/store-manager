'use client'

import {use, useEffect} from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { productSchema, type ProductFormInput, type ProductFormValues } from '@/lib/validations/product'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import Image from "next/image";
import LogoutButton from '@/components/logoutButton'
import BackButton from '@/components/backButton'
import PageWrapper from '@/components/pageWrapper'
import PageHeader from '@/components/pageHeader'



type PageProps = {
    params: Promise<{ id: string }>
}

export default function NewProduct({ params}: PageProps){
    const router = useRouter()
    const supabase = createClient()
    const[error, setError] = useState<string | null>(null)
    const{ id } = use(params)
    const [username, setUsername] = useState<string | null>(null)

    const {register, handleSubmit, formState: { errors },
    } = useForm<ProductFormInput, unknown, ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            available: true,
        },
    })

    useEffect(() => {
        const fetchUsername = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser()

            if (!userData.user || userError)
                return

            const { data: users } = await supabase.from('merchants').select('username').eq('id', userData.user.id).single()

            if (users?.username) {
                setUsername(users.username)
            }
        }

        fetchUsername()
    }, [supabase])
    const onSubmit = async (values: ProductFormValues) => {
        setError(null)

        const { error } = await supabase.from('products').insert({
            store_id: id,
            ...values,
        })

        if (error) {
            setError(error.message)
            return
        }

        router.push(`/stores/${id}/products`)
        router.refresh()
    }

    return (
        <PageWrapper>
            <div className="min-h-[120px]">
                {username && (
                    <PageHeader
                        title={`${username}'s Dashboard`}
                        subtitle="Manage your stores with just one click"
                    />
                )}
            </div>
            <div className="relative z-10 flex justify-center px-4">
                <Card
                    className="w-full max-w-2xl rounded-2xl border border-purple-500/30 bg-white/5 text-white backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)]">

                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>New Product</CardTitle>

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

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Name</label>
                                <Input
                                    {...register('name')}
                                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Description</label>
                                <Textarea
                                    {...register('description')}
                                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">{errors.description.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Price</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register('price', {valueAsNumber: true})}
                                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500">{errors.price.message}</p>
                                )}
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <Button type="submit" className="w-full">
                                Create Product
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <div className="fixed bottom-6 right-6 z-20">
                <LogoutButton/>
            </div>
            <div className="fixed left-6 top-1/2 -translate-y-1/2 z-20">
                <BackButton href={`/stores/${id}/products`}/>
            </div>
        </PageWrapper>
    )

}