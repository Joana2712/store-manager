'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import Link from "next/link"
import Image from "next/image"
import { Inter } from "next/font/google"

const bodyFont = Inter({ subsets: ["latin"] })

export default function LoginPage() {
    const supabase = createClient()
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    
    const { register, handleSubmit, formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })
    
    const onSubmit = async(values: LoginFormValues) => {
        setError(null)
        
        const { error } = await supabase.auth.signInWithPassword(values)
        
        if(error){
            setError(error.message)
            return
        }
        
        router.push('/dashboard')
        router.refresh()
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
                                <label className="text-sm font-medium text-white/80">Email</label>
                                <Input placeholder="merchant@email.com" {...register('email')}
                                       className="bg-white/10 border-white-500/40 text-white placeholder:text-white/50"/>
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Password</label>
                                <Input type="password" placeholder="******" {...register('password')}
                                       className="bg-white/10 border-white-500/40 text-white placeholder:text-white/50"/>
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <Button className="w-full" type="submit">
                                Log in
                            </Button>

                        </form>
                        <p className="mt-4 text-center text-sm text-white/70">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-purple-400 hover:underline">
                                Create one
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>

        </main>
    )

    /*
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
        
        const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            setError(null)
    
            //send email and password to supabase to verify client/merchant
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
    
            if (signInError) {
                setError(signInError.message)
                return
            }
    
            router.push('/dashboard')
            router.refresh()
        }
        
        //login form
        return (
            <main className="mx-auto max-w-md p-8">
                <h1 className="mb-6 text-2xl font-bold">Login</h1>
    
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        className="w-full rounded border p-2"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
    
                    <input
                        className="w-full rounded border p-2"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
    
                    {error && <p className="text-sm text-red-500">{error}</p>}
    
                    <button className="rounded bg-black px-4 py-2 text-white" type="submit">
                        Entrar
                    </button>
                </form>
            </main>
        )
           */
     
}