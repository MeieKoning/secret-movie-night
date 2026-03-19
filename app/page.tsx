import { cookies } from "next/headers";
import Link from "next/link";
import VoteForm from "@/components/VoteForm";
import AlreadyVoted from "@/components/AlreadyVoted";

export default async function Home() {
  const cookieStore = await cookies();
  const hasVoted    = !!cookieStore.get("smn_voted");

  return (
    <main style={{ position: "relative", zIndex: 1 }}>
      {/* ── HERO ── */}
      <section style={{
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "4rem 2rem",
      }}>
        {/* Film strip */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", opacity: 0.5 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{
              width: 14, height: 14,
              background: "var(--gold)",
              borderRadius: 3,
              animation: `flicker 2s ease ${i * 0.15}s infinite`,
            }} />
          ))}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "var(--font-bebas), sans-serif",
          fontSize: "clamp(3.5rem, 9vw, 7rem)",
          lineHeight: 0.88,
          letterSpacing: "6px",
          marginBottom: "1.5rem",
        }}>
          <span style={{
            display: "block",
            background: "linear-gradient(180deg, #fff 30%, rgba(255,255,255,0.5))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Secret</span>
          <span style={{
            display: "block",
            background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 40px rgba(255,215,0,0.4))",
          }}>Movie</span>
          <span style={{
            display: "block",
            background: "linear-gradient(180deg, #fff 30%, rgba(255,255,255,0.5))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Night</span>
        </h1>

        <p style={{
          fontSize: "1.1rem",
          color: "var(--muted)",
          maxWidth: 460,
          lineHeight: 1.8,
          marginBottom: "2.5rem",
        }}>
          You vote. The genre wins. The movie stays secret.
          Every Friday is a surprise.
        </p>

        {!hasVoted && (
          <a href="#vote" className="hero-cta">
            🗳️ Cast Your Vote
          </a>
        )}
      </section>

      {/* ── VOTE / ALREADY VOTED ── */}
      <section id="vote" style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "3rem 2rem 6rem",
      }}>
        {hasVoted ? (
          <AlreadyVoted />
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={{ fontSize: "0.68rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.8rem" }}>
                📽️ This Week&apos;s Poll
              </div>
              <h2 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", letterSpacing: "3px", marginBottom: "0.8rem" }}>
                Vote for the Genre
              </h2>
              <p style={{ color: "var(--muted)", maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
                What kind of movie should play this Friday? Cast your vote — the result stays secret until the night.
              </p>
            </div>
            <VoteForm />
          </>
        )}

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link href="/results" style={{ color: "var(--muted)", fontSize: "0.85rem", textDecoration: "none", letterSpacing: "1px" }}
            className="hover:text-white transition-colors">
            View live results →
          </Link>
        </div>
      </section>
    </main>
  );
}
