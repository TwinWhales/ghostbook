'use server'

import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return null
  }

  const { data, error } = await supabase
    .from('tb_alumni')
    .select(`
      *,
      tb_alumni_tags (
        tb_tags (
          tag_name
        )
      )
    `)
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  // Flatten tags
  return {
    ...data,
    tags: data.tb_alumni_tags?.map((t: any) => t.tb_tags?.tag_name).filter(Boolean) || []
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  const company_name = formData.get('company_name') as string
  const job_title = formData.get('job_title') as string
  const bio = formData.get('bio') as string
  const linkedin_url = formData.get('linkedin_url') as string
  const blog_url = formData.get('blog_url') as string
  
  // New Fields
  const ob_yb = formData.get('ob_yb') as string
  const cohort = formData.get('cohort') as string

  // Validation
  if (company_name && company_name.length > 50) return { error: '회사명은 50자를 초과할 수 없습니다.' }
  if (job_title && job_title.length > 50) return { error: '직무명은 50자를 초과할 수 없습니다.' }
  if (bio && bio.length > 300) return { error: '자기소개는 300자를 초과할 수 없습니다.' }
  
  // URL Validation (Simple "starts with http" check to prevent javascript: or malicious schemes)
  const validateUrl = (url: string) => {
    if (!url) return null
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'URL은 http:// 또는 https://로 시작해야 합니다.'
    }
    return null
  }

  const linkedinError = validateUrl(linkedin_url)
  if (linkedinError) return { error: `LinkedIn ${linkedinError}` }
  
  const blogError = validateUrl(blog_url)
  if (blogError) return { error: `블로그 ${blogError}` }

  // OB/YB Cohort Validation
  if (ob_yb && !['OB', 'YB'].includes(ob_yb)) return { error: 'OB 또는 YB만 선택 가능합니다.' }
  if (cohort && isNaN(parseInt(cohort))) return { error: '기수는 숫자여야 합니다.' }

  const tags = formData.getAll('tags') as string[] 

  // 1. Update TB_ALUMNI
  const { error: updateError } = await supabase
    .from('tb_alumni')
    .update({
      company_name: company_name || null,
      job_title: job_title || null,
      bio: bio || null,
      linkedin_url: linkedin_url || null,
      blog_url: blog_url || null,
      ob_yb: ob_yb || 'OB', // Default to OB if missing, but UI should force it
      cohort: cohort ? parseInt(cohort) : null,
      last_updated: new Date().toISOString()
    })
    .eq('id', user.id)

  if (updateError) {
    return { error: updateError.message }
  }

  // 2. Update Tags (Delete all and re-insert? Or diff?)
  // For MVP, Delete all and Insert is easiest for M-to-M.
  // Note: tb_alumni_tags has FK with cascade delete? No, cascading delete of ALUMNI deletes mapping.
  // We want to delete MAPPING for this alumni.
  
  // 2.1 Get Tag IDs for the selected Tag Names
  // If tags are custom new tags? Project req said "Filter by Tag". Usually predefined.
  // Let's assume we allow selecting from predefined tags.
  // If we allow NEW tags, we need to insert them into tb_tags first.
  
  // Let's implement: predefined tags only for simplicity first, or upsert tags.
  // "Tag Management" task implies managing them?
  // Let's assume predefined tags.
  
  if (tags.length > 0) {
    // Get IDs for these tags
    const { data: tagObjects, error: tagFetchError } = await supabase
      .from('tb_tags')
      .select('tag_id, tag_name')
      .in('tag_name', tags)
    
    if (tagFetchError) return { error: 'Failed to fetch tags' }
    
    const validTagIds = tagObjects.map(t => t.tag_id)

    // 2.2 Delete existing mappings
    await supabase.from('tb_alumni_tags').delete().eq('alumni_id', user.id)

    // 2.3 Insert new mappings
    if (validTagIds.length > 0) {
      const inserts = validTagIds.map(tid => ({
        alumni_id: user.id,
        tag_id: tid
      }))
      const { error: insertError } = await supabase.from('tb_alumni_tags').insert(inserts)
      if (insertError) return { error: 'Failed to update tags' }
    }
  } else {
    // If no tags selected, just delete existing
     await supabase.from('tb_alumni_tags').delete().eq('alumni_id', user.id)
  }

  revalidatePath('/mypage')
  revalidatePath('/') // Main list needs update too
  return { success: true }
}
