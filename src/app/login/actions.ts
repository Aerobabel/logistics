'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Simple mock validation
    if (email === 'admin@zernolab.com' && password === 'admin') {
        // Set cookie
        // Note: In Next.js 15, cookies() is async if expected
        (await cookies()).set('auth_token', 'valid_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })

        redirect('/')
    }

    return { error: 'Invalid credentials. Try admin@zernolab.com / admin' }
}

export async function logout() {
    (await cookies()).delete('auth_token')
    redirect('/login')
}
