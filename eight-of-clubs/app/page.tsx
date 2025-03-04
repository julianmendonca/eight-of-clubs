import CardDeck from "@/components/card-deck"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <CardDeck />
    </main>
  )
}

