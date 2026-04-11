'use client'

import { useEffect } from 'react'
import { useTerritoryStore } from '@/lib/store/territory-store'
import { Header } from '@/components/layout/header'
import { TerritorySidebar } from '@/components/territory/territory-sidebar'
import { MapWrapper } from '@/components/map/map-wrapper'

export default function MapaPage() {
  const initMockData = useTerritoryStore((state) => state.initMockData)
  const territories = useTerritoryStore((state) => state.territories)

  // Initialize mock data on mount
  useEffect(() => {
    if (territories.length === 0) {
      initMockData()
    }
  }, [initMockData, territories.length])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <TerritorySidebar />
        <main className="flex-1 relative">
          <MapWrapper />
        </main>
      </div>
    </div>
  )
}
