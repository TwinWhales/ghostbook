'use client'

import * as React from 'react'
import { useMediaQuery } from '@/hooks/use-media-query' // Logic needed here
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'

import { Alumni } from '@/app/actions/alumni'
import { useRouter } from 'next/navigation'
import { Copy, Linkedin, Link as LinkIcon } from 'lucide-react'

// I need to implement useMediaQuery or just copy a simple one.
// Let's implement a simple hook inside or separately. 
// Standard pattern is hooks/use-media-query.ts.
// But for minimalism, I will use a simple inline check or create the hook file.
// Let's create `hooks/use-media-query.ts` separately first.

export function AlumniDetail({ 
  alumni, 
  open, 
  onClose 
}: { 
  alumni: Alumni | null, 
  open: boolean, 
  onClose: () => void 
}) {
  const [isDesktop, setIsDesktop] = React.useState(false) // Default false for mobile first logic
  // Simple media query effect
  React.useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const listener = () => setIsDesktop(media.matches)
    setIsDesktop(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])
  
  if (!alumni) return null

  // Shared Content
  const Content = (
    <div className="grid gap-4 py-4">
      {/* Basic Info */}
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium text-muted-foreground">{alumni.cohort}기 / {alumni.student_id}</div>
        <div className="text-2xl font-bold">{alumni.company_name}</div>
        <div className="text-lg">{alumni.job_title}</div>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {alumni.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 text-xs font-semibold bg-secondary text-secondary-foreground rounded-md">
            #{tag}
          </span>
        ))}
      </div>

      {/* Bio */}
      {alumni.bio && (
        <div className="mt-2 p-3 bg-muted/50 rounded-md text-sm whitespace-pre-line">
          {alumni.bio}
        </div>
      )}

      {/* Contact & Links */}
      <div className="flex flex-col gap-3 mt-2">
         <div className="flex items-center justify-between p-3 border rounded-md">
            <span className="text-sm font-medium">Email</span>
            <div className="flex items-center gap-2">
               <span className="text-sm text-muted-foreground">{alumni.email}</span>
               <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(alumni.email)}>
                  <Copy className="h-3 w-3" />
               </Button>
            </div>
         </div>

         <div className="flex gap-2">
            {alumni.linkedin_url && (
               <a href={alumni.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                 <Button className="w-full" variant="outline">
                   <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                 </Button>
               </a>
            )}
            {alumni.blog_url && (
               <a href={alumni.blog_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                 <Button className="w-full" variant="outline">
                   <LinkIcon className="mr-2 h-4 w-4" /> Link/Blog
                 </Button>
               </a>
            )}
         </div>
      </div>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{alumni.name}</DialogTitle>
            <DialogDescription>
              졸업생 상세 정보
            </DialogDescription>
          </DialogHeader>
          {Content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={(val) => !val && onClose()}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{alumni.name}</DrawerTitle>
          <DrawerDescription>
            졸업생 상세 정보
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          {Content}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">닫기</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
