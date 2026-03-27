import { z } from 'zod'

export const signupSchema = z.object({
    username: z.string().min(3, 'Username must have at least 3 characters'),
    email: z.email('Invalid email'),
    password: z
        .string()
        .min(6, 'Password must have at least 6 characters and a Special Character')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must include a special character'),
})

export const loginSchema = z.object({
    email: z.email('Invalid email'),
    password: z
        .string()
        .min(6, 'Password must have at least 6 characters and a Special Character')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must include a special character'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
