import Link from 'next/link'
import { Map } from 'lucide-react'

import { LoginForm } from '@/components/auth/login-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                            linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8 text-foreground hover:text-primary transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Map className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">TerritoryRun</span>
        </Link>

        <Card className="border-border shadow-lg">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription>
              Use sua conta para acessar o mapa e seus territórios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LoginForm />
            <p className="text-center text-xs text-muted-foreground border-t border-border pt-4">
              Demo:{' '}
              <span className="font-mono text-foreground/90">
                demo@territory.run
              </span>{' '}
              /{' '}
              <span className="font-mono text-foreground/90">demo123</span>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Voltar ao início
          </Link>
        </p>
      </div>
    </div>
  )
}
