
import { getProfile } from '@/app/actions/profile'
import { getTags } from '@/app/actions/alumni'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ProfileForm } from '@/components/profile-form'

export default async function MyPage() {
  const profile = await getProfile()
  if (!profile) {
    redirect('/login')
  }

  const allTags = await getTags()

  // Make sure profile matches Alumni type
  // profile object from getProfile has 'tags' as string[] which matches.
  // We need to cast or ensure type safety if possible, but for now passing as is should work if types align.
  
  return (
    <div className="container mx-auto max-w-lg py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">내 정보 수정</CardTitle>
          <CardDescription>
            {profile.name} (학번: {profile.student_id})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile as any} allTags={allTags} />
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
