'use client'

import { Button } from '@/components/ui/button'
import { useTerritoryStore } from '@/lib/store/territory-store'
import {
  Pencil,
  X,
  Check,
  Undo2,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// This overlay is rendered OUTSIDE the MapContainer
// It only handles drawing controls which don't need map access
export function MapControlsOverlay() {
  const {
    mapMode,
    setMapMode,
    drawingPoints,
    clearDrawing,
    removeLastDrawingPoint,
    finishDrawing,
  } = useTerritoryStore()

  const isDrawing = mapMode === 'draw'
  const canFinish = drawingPoints.length >= 3
  const canUndo = drawingPoints.length > 0

  const handleStartDrawing = () => {
    setMapMode('draw')
  }

  const handleCancelDrawing = () => {
    clearDrawing()
  }

  const handleFinishDrawing = () => {
    finishDrawing()
  }

  return (
    <>
      {/* Bottom center - Drawing controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
        {!isDrawing ? (
          <Button
            onClick={handleStartDrawing}
            className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base shadow-lg"
          >
            <Pencil className="h-5 w-5 mr-2" />
            Desenhar Territorio
          </Button>
        ) : (
          <div className="flex items-center gap-2 p-2 bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleCancelDrawing}
            >
              <X className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12"
              onClick={removeLastDrawingPoint}
              disabled={!canUndo}
            >
              <Undo2 className="h-5 w-5" />
            </Button>

            <div className="h-8 w-px bg-border" />

            <div className="px-4 text-center">
              <div className="text-sm font-medium text-foreground">
                {drawingPoints.length} pontos
              </div>
              <div className="text-xs text-muted-foreground">
                {canFinish ? 'Pronto para salvar' : 'Min. 3 pontos'}
              </div>
            </div>

            <div className="h-8 w-px bg-border" />

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-12 w-12',
                canFinish
                  ? 'text-primary hover:text-primary hover:bg-primary/10'
                  : 'text-muted-foreground'
              )}
              onClick={handleFinishDrawing}
              disabled={!canFinish}
            >
              <Check className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Drawing mode indicator */}
      {isDrawing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/90 text-primary-foreground rounded-full text-sm font-medium shadow-lg">
            <Eye className="h-4 w-4" />
            Clique no mapa para adicionar pontos
          </div>
        </div>
      )}
    </>
  )
}
