"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useState } from "react"

interface AIAssistantProps {
  chordProgression: string[]
}

export function AIAssistant({ chordProgression }: AIAssistantProps) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    // Placeholder for AI interaction
    console.log("Sending message:", message)
    console.log("Current chord progression:", chordProgression)
    setMessage("")
  }

  return (
    <div className="space-y-4">
      <div className="min-h-[200px] max-h-[400px] overflow-y-auto border rounded-md p-4">
        <div className="space-y-4">
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm">
              Hello! I'm your AI songwriting assistant. I can help you with chord progressions,
              suggest alternatives, and provide music theory insights. What would you like to explore?
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about your chord progression..."
          className="min-h-[80px]"
        />
        <Button onClick={handleSend} className="px-3">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}