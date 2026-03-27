import { z } from 'zod'

export const productSchema = z.object({
    name: z.string().min(1, 'Name required'),
    description: z.string().optional(),
    price: z.coerce.number().gt(0, 'Price must be greater than 0'),
    available: z.boolean(),
})

//export type ProductFormValues = z.infer<typeof productSchema>
export type ProductFormInput = z.input<typeof productSchema>
export type ProductFormValues = z.output<typeof productSchema>