"use client"

import { RefreshCw, Undo2, Timer, Save, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navIcons = [
  { icon: RefreshCw, tooltip: "Reset progression" },
  { icon: Undo2, tooltip: "Undo last change" },
  { icon: Timer, tooltip: "View history" },
  { icon: Save, tooltip: "Save progression" },
  { icon: Settings, tooltip: "Settings" },
]

export function TopNav() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-inter font-semibold">ChordCraft</h1>
        <TooltipProvider>
          <div className="flex items-center space-x-5">
            {navIcons.map(({ icon: Icon, tooltip }) => (
              <Tooltip key={tooltip}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </header>
  )
}
