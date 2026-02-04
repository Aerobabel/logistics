'use client'

import { useActionState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function LoginPage() {
    const [state, formAction] = useActionState(login, null)

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-slate-200">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 bg-[#E66400] rounded-lg flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">Z</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">ZernoLab Logistics</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the workspace
                    </CardDescription>
                </CardHeader>
                <form action={formAction}>
                    <CardContent className="space-y-4">
                        {state?.error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                <span>{state.error}</span>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@zernolab.com"
                                required
                                className="bg-white"
                                defaultValue="admin@zernolab.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="bg-white"
                                defaultValue="admin"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full bg-[#E66400] hover:bg-orange-700 text-white font-medium">
                            Sign In
                        </Button>
                    </CardFooter>
                </form>
                <div className="p-6 pt-0 text-center text-xs text-slate-500">
                    Protected by ZernoLab Security
                </div>
            </Card>
        </div>
    )
}
