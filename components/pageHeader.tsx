import { Inter } from "next/font/google"

const bodyFont = Inter({ subsets: ["latin"] })

type PageHeaderProps = {
    title: string
    subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <div className="mb-10 text-center">
            <h1 className={`${bodyFont.className} text-3xl md:text-5xl font-semibold tracking-tight`}>
                {title}
            </h1>
            {subtitle && (
                <p className="mt-3 text-sm md:text-base text-white/70">
                    {subtitle}
                </p>
            )}
        </div>
    )
}