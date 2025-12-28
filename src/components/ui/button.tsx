import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "brand"
    size?: "default" | "sm" | "lg" | "icon" | "xl"
}

// Simplified version of Shadcn button for this MVP, added "brand" and "xl"
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-slate-900 text-slate-50 hover:bg-slate-900/90": variant === "default",
                        "bg-red-500 text-slate-50 hover:bg-red-500/90": variant === "destructive",
                        "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900": variant === "outline",
                        "bg-slate-100 text-slate-900 hover:bg-slate-100/80": variant === "secondary",
                        "hover:bg-slate-100 hover:text-slate-900": variant === "ghost",
                        "text-slate-900 underline-offset-4 hover:underline": variant === "link",
                        "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200": variant === "brand",

                        "h-10 px-4 py-2": size === "default",
                        "h-9 rounded-md px-3": size === "sm",
                        "h-11 rounded-md px-8": size === "lg",
                        "h-14 rounded-xl px-8 text-lg w-full": size === "xl", // Mobile main action
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
