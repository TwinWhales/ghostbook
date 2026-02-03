
import { getProfile, updateProfile } from '@/app/actions/profile'
import { getTags } from '@/app/actions/alumni'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Quick check: Textarea component? I might need to run shadcn add textarea.
// I'll run it in parallel or assume standard HTML textarea with styling if missed.
// Let's assume standard textarea with tailwind classes for now to be safe and fast.

export default async function MyPage() {
  const profile = await getProfile()
  if (!profile) {
    redirect('/login')
  }

  const allTags = await getTags()

  return (
    <div className="container mx-auto max-w-lg py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">내 정보 수정</CardTitle>
          <CardDescription>
            {profile.name} ({profile.cohort}기, {profile.student_id})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateProfile} className="space-y-6">
            
            {/* Read-only Info */}
            <div className="space-y-2">
               <Label>이메일</Label>
               <Input disabled value={profile.email} className="bg-muted" />
            </div>

            {/* Editable Fields */}
            <div className="space-y-2">
              <Label htmlFor="company_name">회사명</Label>
              <Input id="company_name" name="company_name" defaultValue={profile.company_name || ''} placeholder="Ex. 당근마켓" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_title">직무</Label>
              <Input id="job_title" name="job_title" defaultValue={profile.job_title || ''} placeholder="Ex. Frontend Engineer" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">자기소개</Label>
              <textarea 
                id="bio" 
                name="bio"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={profile.bio || ''}
                placeholder="관심 분야나 멘토링 가능한 내용을 적어주세요."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            <Button type="submit" className="w-full">저장하기</Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
           <Link href="/" className="text-sm text-muted-foreground hover:underline">
             메인으로 돌아가기
           </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
