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
  
  // Tags are a bit complex from standard FormData if invalid multiple selects.
  // Assuming we use standard <select multiple> or a hidden input with comma separated values?
  // Let's assume frontend sends 'tags' as comma separated string or multiple entries.
  // FormData.getAll('tags') gives array of strings.
  const tags = formData.getAll('tags') as string[] 
  // If we decide to use a simpler "comma separated string" input for MVP:
  // const tagsString = formData.get('tags') as string
  // const tags = tagsString.split(',').map(t => t.trim()).filter(Boolean)

  // 1. Update TB_ALUMNI
  const { error: updateError } = await supabase
    .from('tb_alumni')
    .update({
      company_name,
      job_title,
      bio,
      linkedin_url,
      blog_url,
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
