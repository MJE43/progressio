"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"
import { ModeSwitch } from "./chord-input/mode-switch"
import { ChordWheel } from "./chord-input/chord-wheel/chord-wheel"
import { Card } from "./ui/card"
import { ChordParser } from "@/lib/theory/parser"
import { cn } from "@/lib/utils"

import { useProgression } from "@/hooks/useProgression"

export function ChordInput() {
  const { chords: chordProgression, addChord } = useProgression()
  const [mode, setMode] = useState<"visual" | "text">("visual")
  const [currentChord, setCurrentChord] = useState("")


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Chord Progression</h2>
        <ModeSwitch mode={mode} onChange={setMode} />
      </div>

      <div className="flex flex-wrap gap-2">
        {chordProgression.map((chord, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-md"
          >
            <span>{chord}</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>

    {mode === "visual" ? (
      <Card className="p-6">
        <ChordWheel onChordSelect={addChord} />
      </Card>
    ) : (
      <div className="flex gap-2">
        <Input
          value={currentChord}
          onChange={(e) => {
            const value = e.target.value
            setCurrentChord(value)
            setIsInputValid(validateChord(value))
          }}
          placeholder="Enter chord (e.g., Cmaj7)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addChord()
            }
          }}
          className={cn(
            !isInputValid && "border-destructive focus-visible:ring-destructive"
          )}
        />
        <Button
          onClick={() => addChord()}
          disabled={!isInputValid || !currentChord.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    )}
  </div>
)
