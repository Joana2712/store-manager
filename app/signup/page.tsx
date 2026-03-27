'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signupSchema, type SignupFormValues } from '@/lib/validations/auth'

import { Button } from '@/components/ui/button'
import { Card, CardContent} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Image from "next/image";



export default function SignupPage(){
    const supabase = createClient()
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const {register, handleSubmit, formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: '',
            username: '',
            password: '',
        },
    })

    const onSubmit = async (values: SignupFormValues) => {
        setError(null) 
        setLoading(true)
        
       /* const { data, error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                data: {
                    username: values.username,
                },
            },
        })

        console.log('SIGNUP DATA:', data)
        console.log('SIGNUP ERROR:', error)
        
        setLoading(false)

        if (error) {
            setError(error.message)
            return
        }

        router.push('/login')*/

        try {
            const email = values.email.trim().toLowerCase()
            const password = values.password

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: values.username.trim(),
                    },
                },
            })

            console.log('EMAIL:', email)
            console.log('PASSWORD:', password)
            console.log('SIGNUP DATA:', data)
            console.log('SIGNUP ERROR:', error)

            if (error) {
                setError(error.message)
                return
            }

            router.push('/login')
        } catch (err) {
            console.error('UNEXPECTED ERROR:', err)
            setError('Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="relative min-h-screen overflow-hidden">

            <div className="absolute inset-0">
                <Image
                    src="/initial-bg.jpg"
                    alt="Background"
                    fill
                    priority
                    className="object-cover scale-105 blur-[3px]"
                />
                <div className="absolute inset-0 bg-black/50"/>
            </div>
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
                <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Username</label>
                                <Input
                                    placeholder="your username"
                                    {...register('username')}
                                    className="text-white"
                                />
                                {errors.username && (
                                    <p className="text-sm text-red-500">{errors.username.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Email</label>
                                <Input placeholder="merchant@email.com" {...register('email')}
                                       className="text-white"/>
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Password</label>
                                <Input type="password" 
                                       placeholder="******" {...register('password')}
                                       className="text-white"/>
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}