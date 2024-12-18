"use client"

import { DragHandleDots2Icon } from "@radix-ui/react-icons"
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd"

interface ProgressionDisplayProps {
  chords: string[]
  onReorder: (newChords: string[]) => void
  activeChordIndex?: number
}

export function ProgressionDisplay({
  chords,
  onReorder,
  activeChordIndex,
}: ProgressionDisplayProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(chords)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onReorder(items)
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="chords" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex items-center gap-2 min-h-[48px]"
            >
              {chords.map((chord, index) => (
                <Draggable
                  key={index}
                  draggableId={`chord-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "flex items-center h-10 px-3 rounded-md bg-background border",
                        index === activeChordIndex &&
                          "ring-2 ring-primary ring-offset-2"
                      )}
                    >
                      <span className="text-sm font-medium">{chord}</span>
                      <div
                        {...provided.dragHandleProps}
                        className="ml-2 text-muted-foreground"
                      >
                        <DragHandleDots2Icon />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {(index + 1) % 4 === 0 && (
                <div className="w-px h-10 bg-border" />
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}