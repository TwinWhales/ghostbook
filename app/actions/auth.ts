'use server'

import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function loginWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Hardcode to localhost for development.
      // In production, we should use `process.env.NEXT_PUBLIC_SITE_URL` if available.
      redirectTo: `${process.env.NODE_ENV === 'production' ? 'https://ghostbook-sigma.vercel.app' : 'http://localhost:3000'}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    return redirect(`/login?error=${error.message}`)
  }

  if (data.url) {
    redirect(data.url)
  }
}
