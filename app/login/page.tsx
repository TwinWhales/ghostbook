
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
          <CardDescription>
             가입하신 이메일 주소를 입력하세요.<br/>
             로그인 링크가 담긴 메일을 보내드립니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" name="email" type="email" required placeholder="example@gmail.com" />
            </div>

            <Button type="submit" className="w-full">인증 메일 받기</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            아직 계정이 없으신가요? <Link href="/signup" className="text-primary hover:underline">회원가입</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
