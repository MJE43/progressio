// /components/progression/ProgressionDisplay.tsx

import React from 'react';
import {  useProgression } from '@/hooks/useProgression';
import { useAnalysis } from '@/hooks/useAnalysis';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useVoiceLeading } from '@/hooks/useVoiceLeading';

export function ProgressionDisplay() {
  const { chords, selectedChordIndex, selectChord } = useProgression();
  const { analysisForChord } = useAnalysis();
  const { getSmoothnessScore, getParallelMotions } = useVoiceLeading();

  const getFunctionColor = (primary: string) => {
    switch (primary) {
      case 'tonic':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'dominant':
        return 'bg-red-500/20 text-red-700 dark:text-red-300';
      case 'subdominant':
        return 'bg-green-500/20 text-green-700 dark:text-green-300';
      default:
        return 'bg-gray-500/20';
    }
  };

  const getVoiceLeadingColor = (smoothness: number | null) => {
    if (smoothness === null) return '';
    if (smoothness > 0.8) return 'border-green-500';
    if (smoothness > 0.5) return 'border-yellow-500';
    return 'border-red-500';
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Progression Analysis</h3>
          
          <div className="flex flex-wrap gap-2">
            {chords.map((chord, index) => {
              const analysis = analysisForChord(index);
              const smoothness = getSmoothnessScore(index);
              const parallelMotions = getParallelMotions(index);
              
              return (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={cn(
                          "relative group cursor-pointer",
                          "transition-all duration-200",
                          selectedChordIndex === index && "scale-105"
                        )}
                        onClick={() => selectChord(index)}
                      >
                        {/* Chord Display */}
                        <div 
                          className={cn(
                            "px-4 py-2 rounded-md",
                            getFunctionColor(analysis?.harmonicFunction.primary || 'unknown'),
                            "border-2",
                            getVoiceLeadingColor(smoothness)
                          )}
                        >
                          <span className="font-medium">{chord.originalNotation}</span>
                          
                          {/* Function Badge */}
                          {analysis?.harmonicFunction && (
                            <div className="absolute -top-2 -right-2">
                              <Badge variant="outline" className="text-xs">
                                {analysis.harmonicFunction.primary}
                              </Badge>
                            </div>
                          )}
                          
                          {/* Pattern Indicators */}
                          {analysis?.patterns.length ? (
                            <div className="absolute -bottom-2 left-0 right-0 flex justify-center gap-1">
                              {analysis.patterns.map((pattern: any, i: React.Key | null | undefined) => (
                                <div
                                  key={i}
                                  className="w-1.5 h-1.5 rounded-full bg-primary"
                                />
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </TooltipTrigger>
                    
                    <TooltipContent>
                      <div className="space-y-2 p-2">
                        <div>
                          <span className="font-semibold">Function: </span>
                          {analysis?.harmonicFunction.primary}
                          {analysis?.harmonicFunction.secondary && 
                            ` (${analysis.harmonicFunction.secondary})`}
                        </div>
                        
                        {smoothness !== null && (
                          <div>
                            <span className="font-semibold">Voice Leading: </span>
                            {(smoothness * 100).toFixed(0)}% smooth
                          </div>
                        )}
                        
                        {parallelMotions.length > 0 && (
                          <div className="text-yellow-500">
                            Warning: {parallelMotions.map(m => m.type).join(', ')}
                          </div>
                        )}
                        
                        {analysis?.patterns.map((pattern: { type: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }, i: React.Key | null | undefined) => (
                          <div key={i} className="text-sm text-muted-foreground">
                            Part of: {pattern.type} pattern
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
