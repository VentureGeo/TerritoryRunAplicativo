'use client'

import { Card } from '@/components/ui/card'
import type { Territory } from '@/lib/territory/types'
import { formatArea } from '@/lib/territory/geo'
import { cn } from '@/lib/utils'
import { MapPin, Shield, Swords, Crown } from 'lucide-react'

interface TerritoryCardProps {
  territory: Territory
  isOwn: boolean
  isSelected: boolean
  onClick: () => void
}

const statusConfig = {
  active: {
    icon: MapPin,
    label: 'Ativo',
    className: 'text-primary',
  },
  protected: {
    icon: Shield,
    label: 'Protegido',
    className: 'text-green-500',
  },
  disputed: {
    icon: Swords,
    label: 'Em Disputa',
    className: 'text-destructive',
  },
  expired: {
    icon: MapPin,
    label: 'Expirado',
    className: 'text-muted-foreground',
  },
}

const dominanceConfig = {
  bronze: { color: '#CD7F32', label: 'Bronze' },
  silver: { color: '#C0C0C0', label: 'Prata' },
  gold: { color: '#FFD700', label: 'Ouro' },
  platinum: { color: '#E5E4E2', label: 'Platina' },
  diamond: { color: '#B9F2FF', label: 'Diamante' },
}

export function TerritoryCard({
  territory,
  isOwn,
  isSelected,
  onClick,
}: TerritoryCardProps) {
  const status = statusConfig[territory.status]
  const StatusIcon = status.icon
  const dominance = dominanceConfig[territory.dominanceLevel]

  const timeAgo = getTimeAgo(territory.createdAt)

  return (
    <Card
      className={cn(
        'p-3 cursor-pointer transition-all duration-200 hover:bg-secondary/50',
        isSelected && 'ring-2 ring-primary bg-secondary/30'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Color indicator */}
        <div
          className="w-3 h-10 rounded-full shrink-0 mt-0.5"
          style={{
            backgroundColor: isOwn
              ? '#B8FF00'
              : territory.userColor || '#00BFFF',
          }}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-medium text-foreground truncate">
              {isOwn ? 'Seu Territorio' : territory.userName || 'Usuario'}
            </span>
            <div className="flex items-center gap-1">
              <Crown className="h-3 w-3" style={{ color: dominance.color }} />
              <span
                className="text-xs font-medium"
                style={{ color: dominance.color }}
              >
                {dominance.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="font-mono text-foreground font-semibold">
              {formatArea(territory.areaM2)}
            </span>
            <div className={cn('flex items-center gap-1', status.className)}>
              <StatusIcon className="h-3 w-3" />
              <span className="text-xs">{status.label}</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mt-1">{timeAgo}</div>
        </div>
      </div>
    </Card>
  )
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) return `${days}d atras`
  if (hours > 0) return `${hours}h atras`
  if (minutes > 0) return `${minutes}min atras`
  return 'Agora'
}
