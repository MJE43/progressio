// /components/progression/ProgressionDisplay.tsx

import React from 'react';
import { useProgression } from '@/hooks/useProgression';
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
import { ChordDefinition, ProgressionPattern, VoiceLeadingConnection } from '@/lib/theory/types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export function ProgressionDisplay() {
  const { chords, selectedChordIndex, selectChord, moveChord } = useProgression();
  const { analysisForChord } = useAnalysis();
  const { connections } = useVoiceLeading();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    moveChord(result.source.index, result.destination.index);
  };

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

  const getVoiceLeadingColor = (connection: VoiceLeadingConnection | undefined) => {
    if (!connection) return '';
    const smoothness = connection.smoothness;
    if (smoothness > 0.8) return 'border-green-500';
    if (smoothness > 0.5) return 'border-yellow-500';
    return 'border-red-500';
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Progression Analysis</h3>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="chords" direction="horizontal">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-wrap gap-2"
                >
                  {chords.map((chord: ChordDefinition, index: number) => {
                    const analysis = analysisForChord(index);
                    const connection = index > 0 ? connections[index - 1] : undefined;

                    return (
                      <Draggable 
                        key={`${chord.root}-${index}`} 
                        draggableId={`${chord.root}-${index}`} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => selectChord(index)}
                            className={cn(
                              "relative p-3 rounded-lg cursor-pointer transition-all",
                              getFunctionColor(analysis?.harmonicFunction.primary || ''),
                              selectedChordIndex === index && "ring-2 ring-primary",
                              connection && "border-2",
                              getVoiceLeadingColor(connection),
                              snapshot.isDragging && "scale-105 shadow-lg"
                            )}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <span className="text-lg font-medium">{chord.originalNotation}</span>
                                    {analysis && (
                                      <div className="mt-1 flex gap-1">
                                        <Badge variant="outline" className="text-xs">
                                          {analysis.harmonicFunction.primary}
                                        </Badge>
                                        {analysis.harmonicFunction.secondary && (
                                          <Badge variant="outline" className="text-xs">
                                            {analysis.harmonicFunction.secondary}
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                {connection?.parallelMotion?.length > 0 && (
                                  <TooltipContent>
                                    <div className="text-sm">
                                      <p className="font-semibold">Parallel Motions:</p>
                                      <ul className="list-disc list-inside">
                                        {connection.parallelMotions.map((motion, i) => (
                                          <li key={i}>{motion.type}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </CardContent>
    </Card>
  );
}
