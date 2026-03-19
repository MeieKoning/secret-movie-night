import Link from "next/link";

export default function AlreadyVoted() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6 text-center">
      <div className="text-9xl">🎟️</div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Your vote is sealed.</h2>
        <p className="text-neutral-400 max-w-sm">
          The envelope has been received. The outcome remains a secret — for now.
        </p>
      </div>
      <Link
        href="/results"
        className="mt-2 px-6 py-2.5 rounded-full border border-white/20 text-sm text-neutral-300 hover:border-white/50 hover:text-white transition-all duration-200 tracking-wide"
      >
        Peek at the results →
      </Link>
    </div>
  );
}
