"use client"

import { cn } from "@/lib/utils"
import { useState } from 'react'
import { theme } from "@/styles/theme"
import { motion } from "framer-motion"

interface ChordSegmentProps {
  item: string
  angle: number
  radius: number
  arcSize: number
  selected: boolean
  disabled?: boolean
  ringType: 'root' | 'quality' | 'extension'
  onSelect: (item: string) => void
  className?: string
}

export function ChordSegment({
  item,
  angle,
  radius,
  arcSize,
  selected,
  disabled = false,
  ringType,
  onSelect,
  className,
}: ChordSegmentProps) {
  const [isHovered, setIsHovered] = useState(false)
  const centerX = 300
  const centerY = 300
  
  // Get ring spacing based on type
  const getRingSpacing = () => {
    switch (ringType) {
      case 'root':
        return {
          inner: 200,
          outer: 280
        }
      case 'quality':
        return {
          inner: 120,
          outer: 190
        }
      case 'extension':
        return {
          inner: 60,
          outer: 110
        }
    }
  }

  // Get font size based on ring type
  const getFontSize = () => {
    switch (ringType) {
      case 'root':
        return theme.fontSize['3xl']
      case 'quality':
        return theme.fontSize['2xl']
      case 'extension':
        return theme.fontSize.xl
      default:
        return theme.fontSize['2xl']
    }
  }

  const ringSpacing = getRingSpacing()
  const startAngle = angle - arcSize / 2
  const endAngle = angle + arcSize / 2
  
  // Calculate text position - position text in middle of segment
  const textRadius = (ringSpacing.inner + ringSpacing.outer) / 2
  const textX = centerX + textRadius * Math.cos(angle)
  const textY = centerY + textRadius * Math.sin(angle)
  
  const startInner = {
    x: centerX + ringSpacing.inner * Math.cos(startAngle),
    y: centerY + ringSpacing.inner * Math.sin(startAngle)
  }
  const endInner = {
    x: centerX + ringSpacing.inner * Math.cos(endAngle),
    y: centerY + ringSpacing.inner * Math.sin(endAngle)
  }
  const startOuter = {
    x: centerX + ringSpacing.outer * Math.cos(startAngle),
    y: centerY + ringSpacing.outer * Math.sin(startAngle)
  }
  const endOuter = {
    x: centerX + ringSpacing.outer * Math.cos(endAngle),
    y: centerY + ringSpacing.outer * Math.sin(endAngle)
  }
  
  const largeArcFlag = arcSize > Math.PI ? 1 : 0
  
  const path = `M ${startInner.x} ${startInner.y} 
               A ${ringSpacing.inner} ${ringSpacing.inner} 0 ${largeArcFlag} 1 ${endInner.x} ${endInner.y} 
               L ${endOuter.x} ${endOuter.y} 
               A ${ringSpacing.outer} ${ringSpacing.outer} 0 ${largeArcFlag} 0 ${startOuter.x} ${startOuter.y} 
               Z`

  // Get colors based on ring type and state
  const getSegmentColors = () => {
    const colors = {
      root: {
        bg: theme.colors.rootRingBg,
        hover: theme.colors.rootRingHover,
        selected: theme.colors.rootRingSelected,
        disabled: theme.colors.rootRingDisabled,
        text: disabled ? theme.colors.rootTextDisabled : theme.colors.rootText,
      },
      quality: {
        bg: theme.colors.qualityRingBg,
        hover: theme.colors.qualityRingHover,
        selected: theme.colors.qualityRingSelected,
        disabled: theme.colors.qualityRingDisabled,
        text: disabled ? theme.colors.qualityTextDisabled : theme.colors.qualityText,
      },
      extension: {
        bg: theme.colors.extensionRingBg,
        hover: theme.colors.extensionRingHover,
        selected: theme.colors.extensionRingSelected,
        disabled: theme.colors.extensionRingDisabled,
        text: disabled ? theme.colors.extensionTextDisabled : theme.colors.extensionText,
      },
    }

    const ringColors = colors[ringType]
    
    if (disabled) return ringColors.disabled
    if (selected) return ringColors.selected
    if (isHovered) return ringColors.hover
    return ringColors.bg
  }

  const segmentFill = getSegmentColors()
  const textColor = theme.colors[`${ringType}Text`]

  return (
    <motion.g
      onClick={() => !disabled && onSelect(item)}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      className={cn(
        "transition-all",
        !disabled && "cursor-pointer",
        disabled && "cursor-not-allowed",
        className
      )}
      initial={false}
      animate={{
        opacity: disabled ? theme.opacity.disabled : 1,
        scale: selected ? 1.05 : 1,
      }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <path
        d={path}
        fill={segmentFill}
        stroke={theme.colors.wheelBorder}
        strokeWidth="1.5"
        filter={selected ? `drop-shadow(${theme.shadows.ring} ${theme.colors.selectionGlow})` : undefined}
      />
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        style={{
          fontSize: getFontSize(),
          fontWeight: selected ? theme.fontWeight.bold : theme.fontWeight.medium,
          transition: theme.transitions.default,
        }}
        className={cn(
          "transition-all",
          disabled && "opacity-50"
        )}
      >
        {item}
      </text>
    </motion.g>
  )
}
