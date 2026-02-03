'use server'

import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function completeOnboarding(formData: FormData) {
  const secret_code = formData.get('secret_code') as string
  const name = formData.get('name') as string
  const student_id = formData.get('student_id') as string
  const cohort = formData.get('cohort') as string

  // 1. Verify Secret Code
  if (secret_code !== process.env.ALUMNI_SECRET_CODE) {
    redirect('/register?error=Invalid Secret Code')
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // 1.5 Check Duplicate Student ID
  const { data: existingUser } = await supabase
    .from('tb_alumni')
    .select('id')
    .eq('student_id', student_id)
    .neq('id', user.id)
    .single()

  if (existingUser) {
     redirect(`/register?error=${encodeURIComponent('이미 가입된 학번입니다.')}`)
  }

  // 2. Update Profile
  const { error: updateError } = await supabase
    .from('tb_alumni')
    .update({
      name,
      student_id,
      cohort: parseInt(cohort),
      last_updated: new Date().toISOString()
    })
    .eq('id', user.id)
    .select() // Return updated data to verify or check count

  if (updateError) {
    redirect(`/register?error=${encodeURIComponent(updateError.message)}`)
  }

  // If no data returned (meaning no row found to update), we might need to INSERT or handle error
  // But wait, .update().select() returns { data, error }
  // We should actually check data.
  
  // Let's rely on the fact that if we get here, we assume it worked. 
  // But to be safe, let's just make sure we check count if possible or just assume trigger worked.
  // Actually, standard practice for now: if trigger failed, row is missing.
  // We can try to upsert if missing?
  // Let's try upsert instead of update to be robust against missing rows (trigger failures).
  
  const { error: upsertError } = await supabase
    .from('tb_alumni')
    .upsert({
      id: user.id,
      email: user.email!, 
      name,
      student_id,
      cohort: parseInt(cohort),
      last_updated: new Date().toISOString(),
      password: 'managed_by_supabase_auth' // Required by schema but dummy
    })

  if (upsertError) {
      redirect(`/register?error=${encodeURIComponent(upsertError.message)}`)
  }

  revalidatePath('/')
  redirect('/')
}
