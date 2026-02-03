'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface Alumni {
  id: string
  name: string
  student_id: string
  cohort: number
  company_name?: string | null
  job_title?: string | null
  tags: string[]
}

interface AlumniCarouselProps {
  alumniList: Alumni[]
  searchParams: string // Query string for preserving state
}

export function AlumniCarousel({ alumniList, searchParams }: AlumniCarouselProps) {
  if (alumniList.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        검색 결과가 없습니다.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto pb-6 pt-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
      <div className="flex space-x-4 md:space-x-6 w-max">
        {alumniList.map((alumni) => (
          <Link 
            key={alumni.id} 
            href={`/?${searchParams}&id=${alumni.id}`} 
            scroll={false}
            className="w-[280px] md:w-[320px] shrink-0"
          >
            <Card className="h-full hover:-translate-y-1 transition-transform duration-300 hover:shadow-lg cursor-pointer border-l-4 border-l-primary/40">
              <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{alumni.name}</CardTitle>
                    <CardDescription className="font-mono text-xs mt-1">
                      {alumni.cohort}TH / {alumni.student_id}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-2 space-y-3">
                <div className="text-base font-medium text-foreground/90">
                  {alumni.company_name || 'GHOST'} 
                  {alumni.job_title && <span className="text-muted-foreground font-normal"> | {alumni.job_title}</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {alumni.tags.map(t => (
                    <span key={t} className="text-[10px] uppercase font-bold tracking-wider bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
