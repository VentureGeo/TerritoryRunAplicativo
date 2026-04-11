'use client'

import { useState } from 'react'
import { useTerritoryStore } from '@/lib/store/territory-store'
import { TerritoryCard } from './territory-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatArea } from '@/lib/territory/geo'
import { cn } from '@/lib/utils'
import {
  Map,
  MapPin,
  Swords,
  User,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from 'lucide-react'

type FilterType = 'all' | 'mine' | 'disputed'

export function TerritorySidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')

  const {
    territories,
    currentUserId,
    selectedTerritoryId,
    selectTerritory,
    setMapCenter,
    getTotalAreaForUser,
    users,
  } = useTerritoryStore()

  const currentUser = users.find((u) => u.id === currentUserId)

  // Filter territories
  const filteredTerritories = territories.filter((t) => {
    if (filter === 'mine') return t.userId === currentUserId
    if (filter === 'disputed') return t.status === 'disputed'
    return true
  })

  // Stats
  const myTerritories = territories.filter((t) => t.userId === currentUserId)
  const myTotalArea = getTotalAreaForUser(currentUserId)
  const disputedCount = territories.filter((t) => t.status === 'disputed').length

  const handleTerritoryClick = (territory: typeof territories[0]) => {
    selectTerritory(
      selectedTerritoryId === territory.id ? null : territory.id
    )
    if (territory.center) {
      setMapCenter(territory.center)
    }
  }

  if (isCollapsed) {
    return (
      <div className="h-full w-12 bg-card border-r border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="flex flex-col gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div className="text-xs text-center font-mono text-foreground">
            {territories.length}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Territorios</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsCollapsed(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* User stats */}
        <Card className="p-3 bg-secondary/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-foreground">
                {currentUser?.displayName || 'Usuario Demo'}
              </div>
              <div className="text-xs text-muted-foreground">
                Nivel {myTerritories.length > 5 ? 'Ouro' : myTerritories.length > 2 ? 'Prata' : 'Bronze'}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 rounded-lg bg-background/50">
              <div className="text-lg font-mono font-bold text-primary">
                {myTerritories.length}
              </div>
              <div className="text-xs text-muted-foreground">Territorios</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-background/50">
              <div className="text-lg font-mono font-bold text-primary">
                {formatArea(myTotalArea)}
              </div>
              <div className="text-xs text-muted-foreground">Area Total</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex p-2 gap-1 border-b border-border">
        <Button
          variant={filter === 'all' ? 'secondary' : 'ghost'}
          size="sm"
          className={cn(
            'flex-1 text-xs',
            filter === 'all' && 'bg-primary/20 text-primary'
          )}
          onClick={() => setFilter('all')}
        >
          <MapPin className="h-3 w-3 mr-1" />
          Todos ({territories.length})
        </Button>
        <Button
          variant={filter === 'mine' ? 'secondary' : 'ghost'}
          size="sm"
          className={cn(
            'flex-1 text-xs',
            filter === 'mine' && 'bg-primary/20 text-primary'
          )}
          onClick={() => setFilter('mine')}
        >
          <User className="h-3 w-3 mr-1" />
          Meus ({myTerritories.length})
        </Button>
        <Button
          variant={filter === 'disputed' ? 'secondary' : 'ghost'}
          size="sm"
          className={cn(
            'flex-1 text-xs',
            filter === 'disputed' && 'bg-destructive/20 text-destructive'
          )}
          onClick={() => setFilter('disputed')}
        >
          <Swords className="h-3 w-3 mr-1" />
          Disputa ({disputedCount})
        </Button>
      </div>

      {/* Territory list */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredTerritories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
              {filter === 'mine' ? (
                <Trophy className="h-8 w-8 text-muted-foreground" />
              ) : filter === 'disputed' ? (
                <Swords className="h-8 w-8 text-muted-foreground" />
              ) : (
                <MapPin className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {filter === 'mine'
                ? 'Voce ainda nao conquistou nenhum territorio'
                : filter === 'disputed'
                  ? 'Nenhum territorio em disputa'
                  : 'Nenhum territorio encontrado'}
            </p>
            {filter === 'mine' && (
              <p className="text-xs text-muted-foreground mt-2">
                Clique em &quot;Desenhar Territorio&quot; para comecar
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTerritories.map((territory) => (
              <TerritoryCard
                key={territory.id}
                territory={territory}
                isOwn={territory.userId === currentUserId}
                isSelected={selectedTerritoryId === territory.id}
                onClick={() => handleTerritoryClick(territory)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>TerritoryRun v0.1</span>
          <span>by Venture Geo</span>
        </div>
      </div>
    </div>
  )
}
