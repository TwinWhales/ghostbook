import { getAlumniList, getTags, getAlumniById } from '@/app/actions/alumni'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Ghost } from 'lucide-react'
import { AlumniDetailWrapper } from '@/components/alumni-detail-wrapper'

import { createClient } from '@/lib/supabase'
import LandingPage from '@/components/landing-page'
import { AnimatedHeader } from '@/components/animated-header'
import { AlumniCarousel } from '@/components/alumni-carousel'

import { SearchForm } from '@/components/search-form'
import { ScrollToTopButton } from '@/components/scroll-to-top-button'

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
    return null
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
      <header className="z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Ghost className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">GHOST Book</span>
            </Link>
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
      </header>
      

      
      <div className="w-full bg-neutral-950 text-white border-b border-neutral-800">
        <div className="container mx-auto">
           <AnimatedHeader />
        </div>
      </div>

      <main id="main-content" className="container mx-auto px-4 py-8 overflow-hidden min-h-screen flex flex-col">
        {/* Search & Filter Section */}
        <div className="mb-10 space-y-4">
          <div className="w-full md:w-1/2 mx-auto">
             <SearchForm />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
             <Link href="/" scroll={false}>
               <span className={`px-4 py-2 text-sm rounded-full cursor-pointer transition-colors ${!tag ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
                 전체
               </span>
             </Link>
             {tags.map((t) => (
               <Link key={t} href={`/?q=${search}&tag=${t}`} scroll={false}>
                 <span className={`px-4 py-2 text-sm rounded-full cursor-pointer transition-colors ${tag === t ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
                   {t}
                 </span>
               </Link>
             ))}
          </div>
        </div>
        
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

        {/* Scroll To Top Button */}
        <div className="flex justify-center pb-10 mt-auto">
           <ScrollToTopButton />
        </div>
      </main>
    </div>
  )
}
