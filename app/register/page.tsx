
import { completeOnboarding } from '@/app/actions/onboarding'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams;
  const error = params.error

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">학생 인증</CardTitle>
          <CardDescription>
            서비스 이용을 위해 추가 정보(학생 인증)를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 font-medium">
              {error}
            </div>
          )}
          <form action={completeOnboarding} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secret_code">동아리 인증 코드 (Secret Code)</Label>
              <Input id="secret_code" name="secret_code" type="password" required placeholder="관리자에게 받은 코드를 입력하세요" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input id="name" name="name" required placeholder="홍길동" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student_id">학번</Label>
                <Input id="student_id" name="student_id" required placeholder="20181234" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cohort">기수</Label>
              <Input id="cohort" name="cohort" type="number" required placeholder="10" />
            </div>

            <Button type="submit" className="w-full mt-4">
              가입 완료 및 시작하기
            </Button>
          </form>
        </CardContent>
        <div className="flex justify-center pb-4">
          <form action={async () => {
            'use server'
             const { signout } = await import('@/app/actions/signout')
             await signout()
          }}>
             <button type="submit" className="text-xs text-muted-foreground hover:underline">
               계정 변경 / 로그아웃
             </button>
          </form>
        </div>
      </Card>
    </div>
  )
}
