"use client"

import { useState, useEffect, MouseEvent } from "react"
import { ChordWheelRing } from "./chord-wheel-ring"
import { Button } from "@/components/ui/button"
import { theme } from "@/styles/theme"
import { motion, AnimatePresence } from "framer-motion"
import { useProgression } from "@/hooks/useProgression"

interface ChordWheelProps {
  onChordSelect: (chord: string) => void
}

export function ChordWheel({ onChordSelect }: ChordWheelProps) {
  const { addChord } = useProgression()
  const [selectedRoot, setSelectedRoot] = useState<string | null>(null)
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null)
  const [selectedExtension, setSelectedExtension] = useState<string | null>(null)
  const [previewChord, setPreviewChord] = useState<string>("")
  const [step, setStep] = useState<'root' | 'quality' | 'extension'>('root')

  // Organize notes in circle of fifths with enharmonic grouping
  const roots = [
    ["C"],           // I
    ["G"],           // V
    ["D"],           // II
    ["A"],           // VI
    ["E"],           // III
    ["B"],           // VII
    ["F#", "Gb"],   // #IV/bV
    ["C#", "Db"],   // #I/bII
    ["G#", "Ab"],   // #V/bVI
    ["D#", "Eb"],   // #II/bIII
    ["A#", "Bb"],   // #VI/bVII
    ["F"],          // IV
  ]

  // Organize qualities by frequency of use
  const qualities = [
    ["major"],     // Most common
    ["minor"],     // Second most common
    ["dim"],       // Less common
    ["aug"],       // Least common
  ]

  // Organize extensions by complexity
  const extensions = [
    ["7"],         // Basic seventh
    ["maj7"],      // Major seventh
    ["m7"],        // Minor seventh
    ["dim7"],      // Diminished seventh
    ["9"],         // Ninth
    ["11"],        // Eleventh
    ["13"],        // Thirteenth
  ]

  // Update preview chord when selections change
  useEffect(() => {
    if (selectedRoot) {
      const quality = selectedQuality === "major" ? "" : selectedQuality || ""
      const extension = selectedExtension || ""
      setPreviewChord(`${selectedRoot}${quality}${extension}`)
    } else {
      setPreviewChord("")
    }
  }, [selectedRoot, selectedQuality, selectedExtension])

  // Handle root selection
  const handleRootSelect = (root: string) => {
    if (selectedRoot === root) {
      handleReset()
    } else {
      setSelectedRoot(root)
      setStep('quality')
    }
  }

  // Handle quality selection
  const handleQualitySelect = (quality: string) => {
    if (selectedQuality === quality) {
      setSelectedQuality(null)
      setSelectedExtension(null)
      setStep('quality')
    } else {
      setSelectedQuality(quality)
      setStep('extension')
    }
  }

  // Handle extension selection
  const handleExtensionSelect = (extension: string) => {
    if (selectedExtension === extension) {
      setSelectedExtension(null)
    } else {
      setSelectedExtension(extension)
      
      // Only add the chord when we have all selections and extension is clicked
      if (selectedRoot && selectedQuality) {
        const quality = selectedQuality === "major" ? "" : selectedQuality
        const chord = `${selectedRoot}${quality}${extension}`
        addChord(chord)
        handleReset()
      }
    }
  }

  // Reset selections
  const handleReset = () => {
    setSelectedRoot(null)
    setSelectedQuality(null)
    setSelectedExtension(null)
    setPreviewChord("")
    setStep('root')
  }

  function handleAddChord(event: MouseEvent<HTMLButtonElement>): void {
    if (selectedRoot && selectedQuality) {
      const quality = selectedQuality === "major" ? "" : selectedQuality
      const extension = selectedExtension || ""
      const chord = `${selectedRoot}${quality}${extension}`
      addChord(chord)
      handleReset()
    }
  }

  return (
    <div className="space-y-8">
      <div className="relative w-[600px] h-[600px] mx-auto bg-[#0A0A1A] rounded-lg p-6 shadow-lg max-w-[600px] max-h-[600px]">
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full"
          style={{ backgroundColor: theme.colors.wheelBackground }}
        >
          {/* Selection path lines */}
          {selectedRoot && (
            <path
              d={`M 300 300 L ${300 + 240 * Math.cos(roots.findIndex(r => r.includes(selectedRoot)) * (2 * Math.PI / 12) - Math.PI / 2)} ${300 + 240 * Math.sin(roots.findIndex(r => r.includes(selectedRoot)) * (2 * Math.PI / 12) - Math.PI / 2)}`}
              stroke={theme.colors.selectionPath}
              strokeWidth="2"
              fill="none"
            />
          )}
          
          {/* Root notes ring - Always active */}
          <ChordWheelRing
            items={roots}
            radius={240}
            selected={selectedRoot}
            onSelect={handleRootSelect}
            ringType="root"
            isActive={true}
          />
          
          {/* Quality ring - Active after root selection */}
          <AnimatePresence>
            {step !== 'root' && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ChordWheelRing
                  items={qualities}
                  radius={170}
                  selected={selectedQuality}
                  onSelect={handleQualitySelect}
                  ringType="quality"
                  isActive={step !== 'root'}
                />
              </motion.g>
            )}
          </AnimatePresence>
          
          {/* Extension ring - Active after quality selection */}
          <AnimatePresence>
            {step === 'extension' && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ChordWheelRing
                  items={extensions}
                  radius={100}
                  selected={selectedExtension}
                  onSelect={handleExtensionSelect}
                  ringType="extension"
                  isActive={step === 'extension'}
                />
              </motion.g>
            )}
          </AnimatePresence>
          
          {/* Center display */}
          <g className="text-center">
            {/* Step indicator */}
            <text
              x="300"
              y="260"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={theme.colors.textSecondary}
              className="text-lg font-medium"
            >
              {step === 'root' 
                ? "Select Root Note" 
                : step === 'quality'
                  ? "Choose Quality"
                  : "Add Extension"}
            </text>
            
            {/* Current chord display */}
            <text
              x="300"
              y="300"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={theme.colors.textPrimary}
              className="text-3xl font-bold"
            >
              {previewChord || "C"}
            </text>
            
            {/* Optional text */}
            {step === 'extension' && (
              <text
                x="300"
                y="335"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={theme.colors.textSecondary}
                className="text-sm italic"
              >
                (Optional)
              </text>
            )}
            
            {/* Reset button */}
            {(selectedRoot || selectedQuality) && (
              <g
                onClick={handleReset}
                className="cursor-pointer"
                opacity={0.7}
              >
                <text
                  x="300"
                  y="370"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={theme.colors.textSecondary}
                  className="text-sm"
                >
                  Click to Reset
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>
      
      <Button
        onClick={handleAddChord}
        disabled={!selectedRoot || !selectedQuality}
        className="w-full h-12 text-lg font-medium rounded-lg transition-all"
        style={{
          backgroundColor: theme.colors.buttonPrimary,
          color: theme.colors.textPrimary,
          opacity: (!selectedRoot || !selectedQuality) ? theme.opacity.disabled : 1,
          boxShadow: `0 0 20px ${theme.colors.selectionGlow}`
        }}
      >
        Add Chord
      </Button>
    </div>
  )
}
