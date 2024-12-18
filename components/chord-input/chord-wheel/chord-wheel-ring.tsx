"use client"

import { ChordSegment } from "./chord-segment"

interface ChordWheelRingProps {
  items: string[][]  // Array of string arrays for enharmonic grouping
  radius: number
  selected: string | null
  ringType: 'root' | 'quality' | 'extension'
  isActive: boolean
  onSelect: (item: string) => void
  className?: string
}

export function ChordWheelRing({
  items,
  radius,
  selected,
  ringType,
  isActive,
  onSelect,
  className,
}: ChordWheelRingProps) {
  const arcSize = (2 * Math.PI) / items.length

  return (
    <g>
      {items.map((itemGroup, index) => {
        const angle = index * arcSize - Math.PI / 2 // Start at top
        const mainItem = itemGroup[0] // Use first item as main display
        const isSelected = itemGroup.includes(selected || '')
        
        return (
          <ChordSegment
            key={mainItem}
            item={itemGroup.join('/')} // Show all enharmonic options
            angle={angle}
            radius={radius}
            arcSize={arcSize}
            selected={isSelected}
            disabled={!isActive}
            ringType={ringType}
            onSelect={onSelect}
            className={className}
          />
        )
      })}
    </g>
  )
}