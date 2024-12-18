import React from 'react';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useVoiceLeading } from '@/hooks/useVoiceLeading';
import { useProgression } from '@/hooks/useProgression';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AnalysisPanelProps {
  selectedAnalysisType: 'overview' | 'patterns' | 'voice-leading';
}

export function AnalysisPanel({ selectedAnalysisType }: AnalysisPanelProps) {
  const { currentKey, keyConfidence, detectedPatterns, harmonicFunctions } = useAnalysis();
  const { chords, selectedChordIndex } = useProgression();
  const { getConnection } = useVoiceLeading();

  const selectedChord = selectedChordIndex !== null ? chords[selectedChordIndex] : null;
  const selectedFunction = selectedChordIndex !== null ? harmonicFunctions[selectedChordIndex] : null;
  const voiceLeading = selectedChordIndex !== null ? getConnection(selectedChordIndex) : null;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Music Theory Analysis</CardTitle>
            <CardDescription>
              Key: {currentKey.root} {currentKey.mode} ({(keyConfidence * 100).toFixed(0)}% confidence)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue={selectedAnalysisType} className="h-full space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="voice-leading">Voice Leading</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {selectedChord ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Selected Chord: {selectedChord.originalNotation}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="font-medium">Structure</p>
                      <ul className="text-sm space-y-1">
                        <li>Root: {selectedChord.root}</li>
                        <li>Quality: {selectedChord.quality}</li>
                        {selectedChord.extensions && selectedChord.extensions.length > 0 && (
                          <li>Extensions: {selectedChord.extensions.join(', ')}</li>
                        )}
                        {selectedChord.alterations && selectedChord.alterations.length > 0 && (
                          <li>Alterations: {selectedChord.alterations.join(', ')}</li>
                        )}
                        {selectedChord.bass && (
                          <li>Bass: {selectedChord.bass}</li>
                        )}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">Function</p>
                      {selectedFunction && (
                        <ul className="text-sm space-y-1">
                          <li>Primary: {selectedFunction.primary}</li>
                          {selectedFunction.secondary && (
                            <li>Secondary: {selectedFunction.secondary}</li>
                          )}
                          <li>Scale Degree: {selectedFunction.relativeScale}</li>
                          {selectedFunction.tonicization && (
                            <li>Tonicizing: {selectedFunction.tonicization}</li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Select a chord to see detailed analysis
              </div>
            )}
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns">
            {detectedPatterns.length > 0 ? (
              <Accordion type="single" collapsible>
                {detectedPatterns.map((pattern: { type: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; confidence: number; description: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; startIndex: number; length: any; }, index: React.Key | null | undefined) => (
                  <AccordionItem key={index} value={`pattern-${index}`}>
                    <AccordionTrigger>
                      {pattern.type} ({pattern.confidence * 100}% confidence)
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 p-2">
                        <p>{pattern.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Chords {pattern.startIndex + 1} to {pattern.startIndex + pattern.length}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No common patterns detected in current progression
              </div>
            )}
          </TabsContent>

          {/* Voice Leading Tab */}
          <TabsContent value="voice-leading">
            {voiceLeading ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Voice Leading Analysis</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Connection Quality</p>
                      <div className="flex items-end gap-2">
                        <p className="text-2xl font-bold">
                          {(voiceLeading.smoothness * 100).toFixed(0)}%
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">smooth</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium">Voice Movement</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {voiceLeading.from.map((note, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span>{note}</span>
                            <span>→</span>
                            <span>{voiceLeading.to[i] || '×'}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {voiceLeading.parallelMotion && voiceLeading.parallelMotion.length > 0 && (
                      <div>
                        <p className="font-medium text-yellow-500">Warnings</p>
                        <ul className="text-sm space-y-1 mt-2">
                          {voiceLeading.parallelMotion.map((motion, i) => (
                            <li key={i} className="text-yellow-500">
                              {motion.type} between voices {motion.voices[0] + 1} and {motion.voices[1] + 1}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Select a chord to see its voice leading analysis
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
