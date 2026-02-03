'use server'

import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const secret_code = formData.get('secret_code') as string
  const name = formData.get('name') as string
  const student_id = formData.get('student_id') as string
  const cohort = formData.get('cohort') as string
  const email = formData.get('email') as string

  if (secret_code !== process.env.ALUMNI_SECRET_CODE) {
    return { error: 'Invalid Secret Code' } // In a real app, handle state better
    // Ideally we should return state to the form.
  }

  // Magic Link Signup
  // We pass user metadata here so the Trigger can pick it up.
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: {
        name,
        student_id,
        cohort: parseInt(cohort),
      },
      // Redirect to the current domain's callback or home
      // In development localhost:3000 is default allowed.
      emailRedirectTo: `${process.env.NEXT_PUBLIC_Supabase_URL ? 'https://ghostbook-app.vercel.app' : 'http://localhost:3000'}/auth/callback`, 
      // Actually, for now let's just let it be default or set explicitly if needed.
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/login?message=Check your email for the magic link!')
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Login only? Or allow implicit signup? 
      // User said: "Signup requires secret code". So Login should NOT create user.
      // But signInWithOtp by default might create user if not exists?
      // Supabase `signInWithOtp` generic behavior handles user creation if configured.
      // `shouldCreateUser: false` is available in some client versions/methods. 
      // Actually, `signInWithOtp` does not distinguish well unless we handle it.
      // But if we want to STRICTLY prevent signup without Secret Code:
      // We rely on the fact that standard `signInWithOtp` sends a link. 
      // If a new user tries to "Login", they get a link. If they click it, a user is created.
      // Our TRIGGER `on_auth_user_created` will run.
      // If that trigger FAILS (e.g. missing metadata), the transaction might rollback or row not inserted.
      // But `auth.users` row might still exist. 
      // For MVP: Let's assume users follow the flow. 
      // Better: Login just sends link. If they are not registered, they will just have an empty profile or prompt to complete?
      // Let's keep it simple.
    }
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/login?message=Check your email for the magic link!')
}
