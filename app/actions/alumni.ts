'use server'

import { createClient } from '@/lib/supabase'

export type Alumni = {
  id: string
  name: string
  student_id: string
  cohort: number
  email: string
  company_name: string | null
  job_title: string | null
  linkedin_url: string | null
  blog_url: string | null
  bio: string | null
  ob_yb: 'OB' | 'YB' | null
  tags: string[]
}

export async function getAlumniList(search?: string, tag?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('tb_alumni')
    .select(`
      *,
      tb_alumni_tags (
        tb_tags (
          tag_name
        )
      )
    `)
    .order('cohort', { ascending: false }) // Default sort by cohort descending (youngest first)
    // Or requirement said "Last Updated" desc. Let's stick to req.
    .order('last_updated', { ascending: false })

  if (search) {
    // Search in Name, Company, Job Title
    query = query.or(`name.ilike.%${search}%,company_name.ilike.%${search}%,job_title.ilike.%${search}%`)
  }

  // Filter by Tag is tricky in Supabase 'select' with deep filtering on M-to-M.
  // Standard way: use !inner join to filter parents who have the child.
  if (tag) {
    query = supabase
      .from('tb_alumni')
      .select(`
        *,
        tb_alumni_tags!inner (
          tb_tags!inner (
            tag_name
          )
        )
      `)
      .eq('tb_alumni_tags.tb_tags.tag_name', tag)
      .order('last_updated', { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching alumni:', error)
    return []
  }

  // Transform data to flatten tags
  return data.map((item: any) => ({
    ...item,
    tags: item.tb_alumni_tags?.map((t: any) => t.tb_tags?.tag_name).filter(Boolean) || []
  })) as Alumni[]
}

export async function getAlumniById(id: string) {
  const supabase = await createClient()
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
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching alumni detail:', error)
    return null
  }

  return {
    ...data,
    tags: data.tb_alumni_tags?.map((t: any) => t.tb_tags?.tag_name).filter(Boolean) || []
  } as Alumni
}

export async function getTags() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('tb_tags').select('tag_name').order('tag_name')
  if (error) return []
  return data.map((d: { tag_name: string }) => d.tag_name)
}
