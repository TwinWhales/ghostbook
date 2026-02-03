'use client'

import { updateProfile } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Alumni } from '@/app/actions/alumni'
import { useActionState, useEffect } from 'react'

interface ProfileFormProps {
  profile: Alumni
  allTags: string[]
}

const initialState = {
  error: '',
  success: false
}

export function ProfileForm({ profile, allTags }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      alert('저장되었습니다.')
      router.refresh()
    }
  }, [state?.success, router])

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md font-medium">
          {state.error}
        </div>
      )}

      {/* Read-only Info */}
      <div className="space-y-2">
         <Label>이메일</Label>
         <Input disabled value={profile.email} className="bg-muted" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
           <Label htmlFor="student_id">학번</Label>
           <Input disabled value={profile.student_id} className="bg-muted" />
        </div>
        <div className="space-y-2">
           <Label htmlFor="cohort">기수 (수정 가능)</Label>
           <Input id="cohort" name="cohort" type="number" defaultValue={profile.cohort} required />
        </div>
      </div>

      {/* OB/YB Selection */}
      <div className="space-y-2">
        <Label>구분 (OB/YB)</Label>
        <div className="flex gap-4">
          <label className="flex items-center space-x-2 border p-3 rounded-md w-full cursor-pointer hover:bg-accent">
            <input type="radio" name="ob_yb" value="OB" defaultChecked={profile.ob_yb === 'OB' || !profile.ob_yb} className="accent-primary" />
            <span>OB (졸업생)</span>
          </label>
          <label className="flex items-center space-x-2 border p-3 rounded-md w-full cursor-pointer hover:bg-accent">
            <input type="radio" name="ob_yb" value="YB" defaultChecked={profile.ob_yb === 'YB'} className="accent-primary" />
            <span>YB (재학생)</span>
          </label>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="space-y-2">
        <Label htmlFor="company_name">회사명</Label>
        <Input id="company_name" name="company_name" defaultValue={profile.company_name || ''} placeholder="Ex. 당근마켓" maxLength={50} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job_title">직무</Label>
        <Input id="job_title" name="job_title" defaultValue={profile.job_title || ''} placeholder="Ex. Frontend Engineer" maxLength={50} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="bio">자기소개</Label>
          <span className="text-xs text-muted-foreground">최대 300자</span>
        </div>
        <textarea 
          id="bio" 
          name="bio"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          defaultValue={profile.bio || ''}
          placeholder="관심 분야나 멘토링 가능한 내용을 적어주세요."
          maxLength={300}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="space-y-2">
           <Label htmlFor="linkedin_url">LinkedIn URL</Label>
           <Input id="linkedin_url" name="linkedin_url" defaultValue={profile.linkedin_url || ''} placeholder="https://linkedin.com/in/..." />
         </div>
         <div className="space-y-2">
           <Label htmlFor="blog_url">블로그/GitHub URL</Label>
           <Input id="blog_url" name="blog_url" defaultValue={profile.blog_url || ''} placeholder="https://github.com/..." />
         </div>
      </div>

      <div className="space-y-2">
        <Label>태그 (관심사/직무)</Label>
        <div className="p-4 border rounded-md h-40 overflow-y-auto space-y-2 bg-muted/20">
           {allTags.map(tag => (
             <div key={tag} className="flex items-center space-x-2">
               <input 
                 type="checkbox" 
                 id={`tag-${tag}`} 
                 name="tags" 
                 value={tag}
                 defaultChecked={profile.tags.includes(tag)}
                 className="accent-primary h-4 w-4"
               />
               <label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer select-none">
                 {tag}
               </label>
             </div>
           ))}
        </div>
        <p className="text-xs text-muted-foreground">여러 개 선택 가능합니다.</p>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? '저장 중...' : '저장하기'}
      </Button>
    </form>
  )
}
