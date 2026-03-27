'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";

export default function LogoutButton(){
    const supabase = createClient()
    const router = useRouter()
    
    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }
    return (
        <Button
            onClick={handleLogout}
            variant="outline"
            className="mt-4 border-white/30 bg-black/20 text-white backdrop-blur-md hover:bg-white/10"
        >
            Logout
        </Button>
    )
}