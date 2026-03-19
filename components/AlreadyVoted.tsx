import Link from "next/link";

export default function AlreadyVoted() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "2.5rem", padding: "2rem 1rem" }}>

      {/* Ticket with glow */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "absolute", width: 160, height: 160, borderRadius: "50%",
          background: "rgba(255,215,0,0.08)", animation: "pulse-ring 2.5s ease infinite",
        }} />
        <div style={{ fontSize: "9rem", lineHeight: 1, filter: "drop-shadow(0 0 32px rgba(255,215,0,0.45))", animation: "wb-float 3s ease-in-out infinite" }}>
          🎟️
        </div>
      </div>

      {/* Message */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <h2 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "3rem", letterSpacing: "4px", color: "#fff" }}>
          You&apos;re In.
        </h2>
        <p style={{ color: "var(--muted)", maxWidth: 340, margin: "0 auto", lineHeight: 1.7 }}>
          Your vote is sealed in the envelope. The genre will be revealed when the lights go down.
        </p>
      </div>

      <Link href="/results" style={{
        padding: "0.75rem 2rem",
        borderRadius: "50px",
        border: "1px solid rgba(255,255,255,0.15)",
        color: "var(--muted)",
        fontSize: "0.85rem",
        textDecoration: "none",
        letterSpacing: "1px",
      }}>
        Peek at the votes →
      </Link>
    </div>
  );
}
