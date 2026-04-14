'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTerritoryStore } from '@/lib/store/territory-store'
import { useAuthStore } from '@/lib/store/auth-store'
import { signOutRemote } from '@/lib/auth/auth-service'
import { Button } from '@/components/ui/button'
import { VentureGeoBrandLogo } from '@/components/brand/venture-geo-logo'
import { formatArea } from '@/lib/territory/geo'
import { LogOut, Map, Settings, Trophy, User, Users, Medal } from 'lucide-react'

export function Header() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)
  const { territories, currentUserId, getTotalAreaForUser, users } =
    useTerritoryStore()

  const currentUser = users.find((u) => u.id === currentUserId)
  const myTerritories = territories.filter((t) => t.userId === currentUserId)
  const myTotalArea = getTotalAreaForUser(currentUserId)

  return (
    <header className="h-14 bg-card border-b border-border px-4 flex items-center justify-between shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <VentureGeoBrandLogo height={42} />
        <div>
          <h1 className="text-lg font-bold text-foreground leading-none">
            TerritoryRun
          </h1>
          <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
            Conquiste seu caminho
          </p>
        </div>
      </div>

      <nav className="hidden lg:flex items-center gap-1 text-sm">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/mapa" className="gap-1.5">
            <Map className="h-4 w-4" />
            Mapa
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/competicao" className="gap-1.5">
            <Medal className="h-4 w-4" />
            Competição
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/amigos" className="gap-1.5">
            <Users className="h-4 w-4" />
            Amigos
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/trofeus" className="gap-1.5">
            <Trophy className="h-4 w-4" />
            Troféus
          </Link>
        </Button>
      </nav>

      {/* Quick stats */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <div>
            <span className="text-sm font-mono font-semibold text-foreground">
              {myTerritories.length}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              territorios
            </span>
          </div>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-accent" />
          <div>
            <span className="text-sm font-mono font-semibold text-foreground">
              {formatArea(myTotalArea)}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              conquistados
            </span>
          </div>
        </div>
      </div>

      {/* User menu */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => {
            void signOutRemote().finally(() => {
              logout()
              router.replace('/')
            })
          }}
          aria-label="Sair"
        >
          <LogOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" className="h-9 gap-2 px-2">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="hidden sm:inline text-sm font-medium">
            {currentUser?.displayName || 'Demo'}
          </span>
        </Button>
      </div>
    </header>
  )
}
