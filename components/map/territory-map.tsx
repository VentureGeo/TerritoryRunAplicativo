'use client'

import { useEffect, useRef, useCallback } from 'react'
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  CircleMarker,
  Popup,
  useMap,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet'
import type { LatLngExpression, LeafletMouseEvent } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTerritoryStore } from '@/lib/store/territory-store'
import type { Territory } from '@/lib/territory/types'
import { formatArea } from '@/lib/territory/geo'
import { TERRITORY_COLORS } from '@/lib/territory/types'
import { Button } from '@/components/ui/button'
import { Crosshair } from 'lucide-react'

// Map event handler component
function MapEventHandler() {
  const { mapMode, addDrawingPoint, setMapCenter, setMapZoom } = useTerritoryStore()

  const map = useMapEvents({
    click(e: LeafletMouseEvent) {
      if (mapMode === 'draw') {
        addDrawingPoint([e.latlng.lng, e.latlng.lat])
      }
    },
    moveend() {
      const center = map.getCenter()
      setMapCenter([center.lng, center.lat])
    },
    zoomend() {
      setMapZoom(map.getZoom())
    },
  })

  return null
}

// Component to sync map view with store
function MapViewSync() {
  const map = useMap()
  const mapCenter = useTerritoryStore((state) => state.mapCenter)
  const mapZoom = useTerritoryStore((state) => state.mapZoom)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!initializedRef.current) {
      map.setView([mapCenter[1], mapCenter[0]], mapZoom)
      initializedRef.current = true
    }
  }, [map, mapCenter, mapZoom])

  return null
}

// Location button that needs to be inside MapContainer
function LocationControl() {
  const map = useMap()
  const setMapCenter = useTerritoryStore((state) => state.setMapCenter)

  const handleLocate = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          map.setView([latitude, longitude], 16)
          setMapCenter([longitude, latitude])
        },
        (error) => {
          console.error('Erro ao obter localizacao:', error)
        }
      )
    }
  }

  return (
    <div className="leaflet-bottom leaflet-right" style={{ marginBottom: '80px' }}>
      <div className="leaflet-control">
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 bg-card hover:bg-secondary border border-border"
          onClick={handleLocate}
        >
          <Crosshair className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Territory polygon component
function TerritoryPolygon({
  territory,
  isOwn,
  isSelected,
  onClick,
}: {
  territory: Territory
  isOwn: boolean
  isSelected: boolean
  onClick: () => void
}) {
  const getColor = () => {
    if (territory.status === 'disputed') return TERRITORY_COLORS.disputed
    if (territory.status === 'protected') return TERRITORY_COLORS.protected
    if (isOwn) return TERRITORY_COLORS.own
    return territory.userColor || TERRITORY_COLORS.other
  }

  const coordinates = territory.polygon.geometry.coordinates[0]
  const positions: LatLngExpression[] = coordinates.map(
    (coord) => [coord[1], coord[0]] as LatLngExpression
  )

  const color = getColor()
  const fillOpacity = isSelected ? 0.5 : 0.3
  const weight = isSelected ? 3 : 2

  return (
    <Polygon
      positions={positions}
      pathOptions={{
        color: isSelected ? TERRITORY_COLORS.selected : color,
        fillColor: color,
        fillOpacity,
        weight,
      }}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div className="min-w-48 p-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: territory.userColor || color }}
            />
            <span className="font-semibold text-foreground">
              {territory.userName || 'Usuario'}
            </span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Area:</span>
              <span className="font-mono font-medium">
                {formatArea(territory.areaM2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span
                className={`font-medium ${
                  territory.status === 'disputed'
                    ? 'text-destructive'
                    : territory.status === 'protected'
                      ? 'text-green-500'
                      : 'text-primary'
                }`}
              >
                {territory.status === 'active'
                  ? 'Ativo'
                  : territory.status === 'disputed'
                    ? 'Disputa'
                    : territory.status === 'protected'
                      ? 'Protegido'
                      : territory.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nivel:</span>
              <span className="font-medium capitalize">
                {territory.dominanceLevel}
              </span>
            </div>
          </div>
        </div>
      </Popup>
    </Polygon>
  )
}

// Drawing layer component
function DrawingLayer() {
  const { drawingPoints, isDrawing } = useTerritoryStore()

  if (!isDrawing || drawingPoints.length === 0) return null

  const positions: LatLngExpression[] = drawingPoints.map(
    (point) => [point[1], point[0]] as LatLngExpression
  )

  return (
    <>
      {/* Line connecting points */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: TERRITORY_COLORS.own,
          weight: 3,
          dashArray: '10, 10',
        }}
      />
      
      {/* Points */}
      {drawingPoints.map((point, index) => (
        <CircleMarker
          key={index}
          center={[point[1], point[0]]}
          radius={index === 0 ? 8 : 5}
          pathOptions={{
            color: TERRITORY_COLORS.own,
            fillColor: index === 0 ? TERRITORY_COLORS.own : '#0A1628',
            fillOpacity: 1,
            weight: 2,
          }}
        />
      ))}

      {/* Close line to start if 3+ points */}
      {drawingPoints.length >= 3 && (
        <Polyline
          positions={[
            [drawingPoints[drawingPoints.length - 1][1], drawingPoints[drawingPoints.length - 1][0]],
            [drawingPoints[0][1], drawingPoints[0][0]],
          ]}
          pathOptions={{
            color: TERRITORY_COLORS.own,
            weight: 2,
            dashArray: '5, 10',
            opacity: 0.5,
          }}
        />
      )}
    </>
  )
}

export function TerritoryMap() {
  const {
    territories,
    currentUserId,
    selectedTerritoryId,
    selectTerritory,
    mapCenter,
    mapZoom,
  } = useTerritoryStore()

  const handleTerritoryClick = useCallback(
    (id: string) => {
      selectTerritory(selectedTerritoryId === id ? null : id)
    },
    [selectTerritory, selectedTerritoryId]
  )

  return (
    <MapContainer
      center={[mapCenter[1], mapCenter[0]]}
      zoom={mapZoom}
      className="h-full w-full"
      zoomControl={true}
      attributionControl={false}
    >
      {/* Dark theme tiles - CartoDB Dark Matter */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {/* Map event handlers */}
      <MapEventHandler />
      <MapViewSync />
      <LocationControl />

      {/* Render territories */}
      {territories.map((territory) => (
        <TerritoryPolygon
          key={territory.id}
          territory={territory}
          isOwn={territory.userId === currentUserId}
          isSelected={selectedTerritoryId === territory.id}
          onClick={() => handleTerritoryClick(territory.id)}
        />
      ))}

      {/* Drawing layer */}
      <DrawingLayer />
    </MapContainer>
  )
}
