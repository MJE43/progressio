"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"
import { ModeSwitch } from "./chord-input/mode-switch"
import { ChordWheel } from "./chord-input/chord-wheel/chord-wheel"
import { Card } from "./ui/card"

interface ChordInputProps {
  chordProgression: string[]
  setChordProgression: (chords: string[]) => void
}

export function ChordInput({ chordProgression, setChordProgression }: ChordInputProps) {
  const [mode, setMode] = useState<"visual" | "text">("visual")
  const [currentChord, setCurrentChord] = useState("")

  const addChord = (chord: string = currentChord) => {
    if (chord.trim()) {
      setChordProgression([...chordProgression, chord.trim()])
      setCurrentChord("")
    }
  }

  const removeChord = (index: number) => {
    setChordProgression(chordProgression.filter((_, i) => i !== index))
  }

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
            <button
              onClick={() => removeChord(index)}
              className="text-muted-foreground hover:text-foreground"
            >
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
            onChange={(e) => setCurrentChord(e.target.value)}
            placeholder="Enter chord (e.g., Cmaj7)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addChord()
              }
            }}
          />
          <Button onClick={() => addChord()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}