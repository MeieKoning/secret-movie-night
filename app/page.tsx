import { cookies } from "next/headers";
import Link from "next/link";
import VoteForm from "@/components/VoteForm";
import AlreadyVoted from "@/components/AlreadyVoted";

export default async function Home() {
  const cookieStore = await cookies();
  const hasVoted = !!cookieStore.get("smn_voted");

  return (
    <main className="min-h-screen flex flex-col px-4 py-16 max-w-4xl mx-auto w-full">
      {/* Header */}
      <header className="text-center mb-14 space-y-4">
        <div className="inline-block text-xs font-mono tracking-[0.3em] uppercase text-neutral-500 border border-neutral-800 px-4 py-1.5 rounded-full mb-6">
          Haven Residents Only
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          Secret Movie Night
        </h1>
        <p className="text-neutral-400 max-w-md mx-auto text-base leading-relaxed">
          One genre will be chosen. One film will be screened.{" "}
          <span className="text-neutral-200">The rest stays secret.</span>
        </p>
        {!hasVoted && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="h-px w-12 bg-neutral-800" />
            <span className="text-neutral-600 text-xs font-mono tracking-widest">CAST YOUR VOTE</span>
            <div className="h-px w-12 bg-neutral-800" />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="flex-1">
        {hasVoted ? <AlreadyVoted /> : <VoteForm />}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-neutral-700 text-xs font-mono space-x-4">
        <Link href="/results" className="hover:text-neutral-400 transition-colors">
          View Results
        </Link>
        <span>·</span>
        <span>Haven {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
