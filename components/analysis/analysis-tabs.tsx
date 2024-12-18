// /components/analysis/analysis-tabs.tsx

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalysisPanel } from "@/components/chord-analysis/AnalysisPanel"

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
        <AnalysisPanel selectedAnalysisType="overview" />
      </TabsContent>
      <TabsContent value="voice-leading">
        <AnalysisPanel selectedAnalysisType="voice-leading" />
      </TabsContent>
      <TabsContent value="rhythm">
         <p className="text-center text-muted-foreground py-8">Rhythm analysis coming soon...</p>
      </TabsContent>
      <TabsContent value="patterns">
        <AnalysisPanel selectedAnalysisType="patterns" />
      </TabsContent>
    </Tabs>
  )
}
