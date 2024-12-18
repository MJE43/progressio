import { Music4 } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Music4 className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Progressio</h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  )
}