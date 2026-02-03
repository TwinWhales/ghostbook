
import { signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <CardDescription>
            동아리 졸업생(OB) 네트워크에 오신 것을 환영합니다.<br/>
            이메일 인증(Magic Link)을 통해 가입됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signup} className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" name="email" type="email" required placeholder="example@gmail.com" />
            </div>

            <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800">
              * 가입하기를 누르면 인증 메일이 발송됩니다.
            </div>

            <Button type="submit" className="w-full">가입 및 인증 메일 받기</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            이미 계정이 있으신가요? <Link href="/login" className="text-primary hover:underline">로그인</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
