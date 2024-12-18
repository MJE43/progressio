"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ChordInput } from "./chord-input"
import { ChordAnalysis } from "./chord-analysis"
import { AIAssistant } from "./ai-assistant"

export function ChordWorkspace() {
  const [chordProgression, setChordProgression] = useState<string[]>([])

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <ChordInput
                chordProgression={chordProgression}
                setChordProgression={setChordProgression}
              />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <ChordAnalysis chordProgression={chordProgression} />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="assistant" className="w-full">
        <TabsList>
          <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="history">Version History</TabsTrigger>
        </TabsList>
        <TabsContent value="assistant">
          <Card>
            <CardContent className="p-6">
              <AIAssistant chordProgression={chordProgression} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardContent className="p-6">
              <p>Version history coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
