'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent } from 'react'

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get('q') || ''
  const currentTag = searchParams.get('tag') || ''

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const q = formData.get('q') as string
    
    // Construct new URLSearchParams
    const newParams = new URLSearchParams(searchParams.toString())
    
    if (q) {
      newParams.set('q', q)
    } else {
      newParams.delete('q')
    }
    
    // Maintain tag if exists? 
    // Usually a new search might want to keep the tag filter or reset it.
    // The current implementation in page.tsx:
    // <input type="hidden" name="tag" value={tag} />
    // So it keeps the tag.
    if (currentTag) {
        newParams.set('tag', currentTag)
    }

    // Use router.push with scroll: false
    router.push(`/?${newParams.toString()}`, { scroll: false })
  }

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="이름, 회사, 직무 검색..."
        className="pl-10 h-11 text-lg"
        name="q"
        defaultValue={currentSearch}
      />
    </form>
  )
}
