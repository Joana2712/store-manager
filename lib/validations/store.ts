import { z } from 'zod'

export const storeSchema = z.object({
    name: z.string().min(1, 'Name required'),
    street: z.string().min(1, 'Street required'),
    city: z.string().min(1, 'City required'),
    state: z.string().min(1, 'State required'),
    zip_code: z.string().min(1, 'Zip code required'),
    phone_number: z.string().min(1, 'Phone number required'),
    timezone: z.string().min(1, 'Timezone required'),
})

export type StoreFormValues = z.infer<typeof storeSchema>