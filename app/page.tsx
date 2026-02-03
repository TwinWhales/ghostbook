import { getAlumniList, getTags, getAlumniById } from '@/app/actions/alumni'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { AlumniDetailWrapper } from '@/components/alumni-detail-wrapper'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; id?: string }>
}) {
  const params = await searchParams;
  const search = params.q || ''
  const tag = params.tag || ''
  const id = params.id
    
  const alumniList = await getAlumniList(search, tag)
  const tags = await getTags()

  // Fetch detail if ID is present
  const selectedAlumni = id ? await getAlumniById(id) : null
  
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Detail Modal/Drawer Wrapper */}
      {selectedAlumni && (
        <AlumniDetailWrapper alumni={selectedAlumni} />
      )}
      
      {/* ... rest of UI ... */}

      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">GHOSTd</span>
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
              <Link href="/login">
                <Button variant="ghost" size="sm">로그인</Button>
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Mobile Tag Filter (Horizontal Scroll) */}
        <div className="container px-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide border-b md:border-none">
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

      <main className="container px-4 py-6 md:py-8">
        <h2 className="text-xl font-semibold mb-4">
          {tag ? `#${tag}` : '전체 졸업생'} 
          <span className="text-muted-foreground ml-2 text-sm font-normal">({alumniList.length})</span>
        </h2>

        {alumniList.length === 0 ? (
           <div className="text-center py-20 text-muted-foreground">
             검색 결과가 없습니다.
           </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {alumniList.map((alumni) => (
              <Link key={alumni.id} href={`/?q=${search}&tag=${tag}&id=${alumni.id}`} scroll={false}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{alumni.name}</CardTitle>
                        <CardDescription>{alumni.cohort}기 / {alumni.student_id}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-2">
                    <div className="text-sm font-medium">
                      {alumni.company_name || '소속 없음'} 
                      {alumni.job_title && <span className="text-muted-foreground font-normal"> | {alumni.job_title}</span>}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {alumni.tags.map(t => (
                        <span key={t} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
