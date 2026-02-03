import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function checkAuthAndRedirect() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Check profile
    const { data: profile } = await supabase
      .from('tb_alumni')
      .select('student_id')
      .eq('id', user.id)
      .single()

    if (profile && profile.student_id) {
       redirect('/')
    } else {
       redirect('/register')
    }
  }
}
