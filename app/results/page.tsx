import Link from "next/link";
import { getResults } from "@/app/actions";
import ResultsChart from "@/components/ResultsChart";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const results = await getResults();

  return (
    <main className="min-h-screen flex flex-col px-4 py-16 max-w-2xl mx-auto w-full">
      <header className="text-center mb-12 space-y-3">
        <div className="inline-block text-xs font-mono tracking-[0.3em] uppercase text-neutral-500 border border-neutral-800 px-4 py-1.5 rounded-full mb-4">
          Live Results
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          The Envelope, So Far
        </h1>
        <p className="text-neutral-500 text-sm max-w-xs mx-auto">
          Votes are still coming in. The final genre will be revealed on the night.
        </p>
      </header>

      <div className="flex-1 border border-neutral-800/60 rounded-2xl p-6 sm:p-8 bg-white/[0.02]">
        <ResultsChart initial={results} />
      </div>

      <footer className="mt-10 text-center text-neutral-700 text-xs font-mono">
        <Link href="/" className="hover:text-neutral-400 transition-colors">
          ← Back to voting
        </Link>
      </footer>
    </main>
  );
}
