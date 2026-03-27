'use client'

import {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { storeSchema, type StoreFormValues } from '@/lib/validations/store'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import LogoutButton from "@/components/logoutButton"
import BackButton from '@/components/backButton'
import PageWrapper from '@/components/pageWrapper'
import PageHeader from '@/components/pageHeader'


export default function NewStore(){
    const supabase = createClient()
    const router = useRouter()
    const[error, setError] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)

    const {register, handleSubmit, formState: { errors },
    } = useForm<StoreFormValues>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            name: '',
            street: '',
            city: '',
            state: '',
            zip_code: '',
            phone_number: '',
            timezone: '',
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
    const onSubmit = async (values: StoreFormValues)=> {
        
        setError(null)
        
        const { data: userData, error: userError} = await supabase.auth.getUser()
        
        if(!userData.user || userError){
            setError("user not authenticated")
            return
        }
        
        const { error } = await supabase.from('stores').insert({
            merchant_id: userData.user.id,
            ...values,
            active: true
        })
        
        if(error){
            setError(error.message)
            return
        }
        
        router.push('/dashboard')
        router.refresh()
    }
    
    return (
        <PageWrapper>
            
            <div className="relative z-10 flex justify-center px-4">
                <Card
                    className="w-full max-w-2xl rounded-2xl border border-purple-500/30 bg-white/5 text-white backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                    <CardHeader>
                        <CardTitle>New Store</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input {...register('name')} />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Street</label>
                                <Input {...register('street')} />
                                {errors.street && <p className="text-sm text-red-500">{errors.street.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">City</label>
                                <Input {...register('city')} />
                                {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">State</label>
                                <Input {...register('state')} />
                                {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Zip code</label>
                                <Input {...register('zip_code')} />
                                {errors.zip_code && <p className="text-sm text-red-500">{errors.zip_code.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone number</label>
                                <Input {...register('phone_number')} />
                                {errors.phone_number &&
                                    <p className="text-sm text-red-500">{errors.phone_number.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Timezone</label>
                                <Input placeholder="Europe/Lisbon" {...register('timezone')} />
                                {errors.timezone && <p className="text-sm text-red-500">{errors.timezone.message}</p>}
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <Button type="submit" className="w-full">
                                Create Store
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