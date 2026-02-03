import { getAlumniList, getTags, getAlumniById } from '@/app/actions/alumni'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { AlumniDetailWrapper } from '@/components/alumni-detail-wrapper'

import { createClient } from '@/lib/supabase'
import LandingPage from '@/components/landing-page'
import { AnimatedHeader } from '@/components/animated-header'
import { AlumniCarousel } from '@/components/alumni-carousel'

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; id?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Check Auth
  if (!user) {
    const { redirect } = await import('next/navigation')
    redirect('/onboarding')
  }

  // 2. Fetch User Profile to check status and missing fields
  const { data: profile } = await supabase
    .from('tb_alumni')
    .select('*') // Select all to check bio, urls etc
    .eq('id', user.id)
    .single()

  // 3. Redirect if student_id missing
  if (!profile || !profile.student_id) {
    const { redirect } = await import('next/navigation')
    redirect('/register')
  }

  // 4. Check for missing optional fields for the reminder
  const missingFields: string[] = []
  if (!profile.company_name) missingFields.push('소속 회사')
  if (!profile.job_title) missingFields.push('직무')
  if (!profile.linkedin_url) missingFields.push('LinkedIn')
  if (!profile.blog_url) missingFields.push('블로그/포트폴리오')
  if (!profile.bio) missingFields.push('자기소개')
  
  const params = await searchParams;
  const search = params.q || ''
  const tag = params.tag || ''
  const id = params.id
    
  const alumniList = await getAlumniList(search, tag)
  const tags = await getTags()

  // Fetch detail if ID is present
  // Fetch detail if ID is present
  const selectedAlumni = id ? await getAlumniById(id) : null
  
  const { ProfileReminder } = await import('@/components/profile-reminder')

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <ProfileReminder missingFields={missingFields} />
      {/* Detail Modal/Drawer Wrapper */}
      {selectedAlumni && (
        <AlumniDetailWrapper alumni={selectedAlumni} />
      )}
      
      {/* ... rest of UI ... */}

      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">GHOST Archive</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
               {/* Search Form */}
               <form className="relative">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input
                   type="search"
                   placeholder="이름, 회사, 직무 검색..."
                   className="pl-8 h-9 md:w-[300px] lg:w-[400px]"
                   name="q"
                   defaultValue={search}
                 />
                 {tag && <input type="hidden" name="tag" value={tag} />}
               </form>
            </div>
            <nav className="flex items-center space-x-2">
              <Link href="/mypage">
                <Button variant="ghost" size="sm">내 정보</Button>
              </Link>
              <form action={async () => {
                'use server'
                const { signout } = await import('@/app/actions/signout')
                await signout()
              }}>
                <Button variant="ghost" size="sm">로그아웃</Button>
              </form>
            </nav>
          </div>
        </div>
        
        {/* Mobile Tag Filter (Horizontal Scroll) */}
        <div className="container mx-auto px-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide border-b md:border-none">
          <div className="flex space-x-2">
             <Link href="/">
               <span className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-colors ${!tag ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
                 전체
               </span>
             </Link>
             {tags.map((t) => (
               <Link key={t} href={`/?q=${search}&tag=${t}`}>
                 <span className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-colors ${tag === t ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
                   {t}
                 </span>
               </Link>
             ))}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 md:py-8 overflow-hidden">
        <AnimatedHeader />
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-sm inline-block"></span>
            {tag ? `#${tag}` : 'MEMBERS'} 
            <span className="text-muted-foreground ml-2 text-sm font-normal font-mono">
              [{alumniList.length} FOUND]
            </span>
          </h2>
          
          <AlumniCarousel 
            alumniList={alumniList} 
            searchParams={`q=${search}&tag=${tag}`}
          />
        </div>
      </main>
    </div>
  )
}
