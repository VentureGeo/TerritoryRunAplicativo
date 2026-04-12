'use client'

import { useRouter } from 'next/navigation'
import { useTerritoryStore } from '@/lib/store/territory-store'
import { useAuthStore } from '@/lib/store/auth-store'
import { Button } from '@/components/ui/button'
import { formatArea } from '@/lib/territory/geo'
import { LogOut, Map, Settings, Trophy, User } from 'lucide-react'

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
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Map className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-none">
            TerritoryRun
          </h1>
          <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
            Conquiste seu caminho
          </p>
        </div>
      </div>

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
            logout()
            router.replace('/')
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
