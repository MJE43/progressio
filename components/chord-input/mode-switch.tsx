"use client"

import { Button } from "@/components/ui/button"

interface ModeSwitchProps {
  mode: "visual" | "text"
  onChange: (mode: "visual" | "text") => void
}

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div className="inline-flex p-1 bg-muted rounded-full">
      <Button
        variant={mode === "visual" ? "default" : "ghost"}
        size="sm"
        className="rounded-full"
        onClick={() => onChange("visual")}
      >
        Visual
      </Button>
      <Button
        variant={mode === "text" ? "default" : "ghost"}
        size="sm"
        className="rounded-full"
        onClick={() => onChange("text")}
      >
        Text
      </Button>
    </div>
  )
}