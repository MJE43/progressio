import { ChordWorkspace } from "@/components/chord-workspace"
import { TopNav } from "@/components/navigation/top-nav"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="container mx-auto px-4 py-8">
        <ChordWorkspace />
      </main>
    </div>
  )
}