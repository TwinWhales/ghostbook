import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/20 p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-primary">GHOSTd</h1>
          <p className="text-xl text-muted-foreground">
            동아리 졸업생(OB)만을 위한<br/>
            프라이빗 네트워킹 플랫폼
          </p>
        </div>

        <Card className="w-full shadow-lg border-0 bg-background/80 backdrop-blur">
          <CardHeader>
             <CardTitle className="text-lg">환영합니다</CardTitle>
             <CardDescription>서비스 이용을 위해 로그인하거나 가입해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/login" className="w-full">
              <Button size="lg" className="w-full font-semibold">
                로그인
              </Button>
            </Link>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  처음 방문하셨나요?
                </span>
              </div>
            </div>
            <Link href="/signup" className="w-full">
              <Button variant="outline" size="lg" className="w-full">
                회원가입 (인증 코드 필요)
              </Button>
            </Link>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          © 2026 GHOSTd. All rights reserved.
        </p>
      </div>
    </div>
  )
}
