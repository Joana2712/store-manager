'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type BackButtonProps ={
    href: string
}

export default function BackButton({href}: BackButtonProps){
    const router = useRouter()
    
    return(
        <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(href)}
            className="h-14 w-14 rounded-full border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-white/10"
        >
            <ChevronLeft className="h-7 w-7" />
        </Button>
    )
}