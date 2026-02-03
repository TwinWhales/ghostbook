'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProfileReminderProps {
  missingFields: string[]
}

export function ProfileReminder({ missingFields }: ProfileReminderProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we've already reminded the user in this session to avoid annoyance
    const reminded = sessionStorage.getItem('profile_reminded')
    if (!reminded && missingFields.length > 0) {
      setOpen(true)
      sessionStorage.setItem('profile_reminded', 'true')
    }
  }, [missingFields])

  const handleOpenChange = (open: boolean) => {
      setOpen(open)
  }

  if (missingFields.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>프로필을 완성해주세요!</DialogTitle>
          <DialogDescription className="pt-2">
            더 나은 네트워킹을 위해 다음 정보를 채워주세요:<br/>
            <span className="font-semibold text-primary">
              {missingFields.join(', ')}
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            나중에 하기
          </Button>
          <Link href="/mypage" className="w-full sm:w-auto">
            <Button className="w-full">
              지금 작성하러 가기
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
