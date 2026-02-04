'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
    activeTab: string;
    setActiveTab: (id: string) => void;
} | null>(null)

export function Tabs({
    defaultValue,
    className,
    children,
    onValueChange
}: {
    defaultValue: string;
    className?: string;
    children: React.ReactNode;
    onValueChange?: (value: string) => void;
}) {
    const [activeTab, setActiveTab] = React.useState(defaultValue)

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        onValueChange?.(value)
    }

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    )
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
            {children}
        </div>
    )
}

export function TabsTrigger({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsTrigger must be used within Tabs")

    const isActive = context.activeTab === value

    return (
        <button
            onClick={() => context.setActiveTab(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive && "bg-background text-foreground shadow-sm",
                className
            )}
        >
            {children}
        </button>
    )
}

export function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsContent must be used within Tabs")

    return (
        <div className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className,
            context.activeTab !== value && "hidden"
        )}>
            {children}
        </div>
    )
}
