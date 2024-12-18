"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HarmonyAnalysis } from "./harmony-analysis"
import { VoiceLeadingAnalysis } from "./voice-leading-analysis"
import { RhythmAnalysis } from "./rhythm-analysis"
import { PatternAnalysis } from "./pattern-analysis"

interface AnalysisTabsProps {
  chordProgression: string[]
}

export function AnalysisTabs({ chordProgression }: AnalysisTabsProps) {
  return (
    <Tabs defaultValue="harmony" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="harmony">Harmony</TabsTrigger>
        <TabsTrigger value="voice-leading">Voice Leading</TabsTrigger>
        <TabsTrigger value="rhythm">Rhythm</TabsTrigger>
        <TabsTrigger value="patterns">Patterns</TabsTrigger>
      </TabsList>
      <TabsContent value="harmony">
        <HarmonyAnalysis chordProgression={chordProgression} />
      </TabsContent>
      <TabsContent value="voice-leading">
        <VoiceLeadingAnalysis chordProgression={chordProgression} />
      </TabsContent>
      <TabsContent value="rhythm">
        <RhythmAnalysis chordProgression={chordProgression} />
      </TabsContent>
      <TabsContent value="patterns">
        <PatternAnalysis chordProgression={chordProgression} />
      </TabsContent>
    </Tabs>
  )
}