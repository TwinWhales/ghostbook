'use server'

import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
