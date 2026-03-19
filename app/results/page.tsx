import Link from "next/link";
import { getResults } from "@/app/actions";
import ResultsChart from "@/components/ResultsChart";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const results = await getResults();

  return (
    <main style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "4rem 2rem 6rem" }}>
      <header style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ fontSize: "0.68rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.8rem" }}>
          📊 Live Results
        </div>
        <h1 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "clamp(2.8rem, 6vw, 4rem)", letterSpacing: "3px", marginBottom: "0.8rem" }}>
          The Envelope, So Far
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: 380, margin: "0 auto", lineHeight: 1.7 }}>
          Votes are still coming in. The final genre will be revealed on the night.
        </p>
      </header>

      <div style={{
        background: "#0E0E1C",
        border: "1px solid #1C1C2E",
        borderRadius: 20,
        padding: "2rem 2.5rem",
      }}>
        <ResultsChart initial={results} />
      </div>

      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <Link href="/" style={{ color: "var(--muted)", fontSize: "0.85rem", textDecoration: "none" }}>
          ← Back to voting
        </Link>
      </div>
    </main>
  );
}
