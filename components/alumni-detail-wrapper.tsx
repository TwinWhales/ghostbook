'use client'

import { AlumniDetail } from '@/components/alumni-detail'
import { Alumni } from '@/app/actions/alumni'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function AlumniDetailWrapper({ alumni }: { alumni: Alumni }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleClose = () => {
    // Remove 'id' param but keep others (q, tag)
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('id')
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
  }

  return (
    <AlumniDetail 
      alumni={alumni} 
      open={true} 
      onClose={handleClose} 
    />
  )
}
