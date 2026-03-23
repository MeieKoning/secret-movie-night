"use client";

import { useState, useEffect } from "react";
import { type Genre } from "@/lib/genres";
import {
  verifyAdmin,
  adminGetData,
  adminSaveGenres,
  adminSetVote,
  adminResetVotes,
} from "@/app/actions";

const ACCENT_COLORS = ["amber", "red", "violet", "orange", "yellow", "rose", "teal", "blue", "green", "indigo", "pink", "cyan"];

const colorHex: Record<string, string> = {
  amber:  "#FFD700",
  red:    "#FF6B6B",
  violet: "#B39DDB",
  orange: "#FF6B35",
  yellow: "#FFD93D",
  rose:   "#FF79C6",
  teal:   "#2DD4BF",
  blue:   "#60A5FA",
  green:  "#4ADE80",
  indigo: "#818CF8",
  pink:   "#F472B6",
  cyan:   "#22D3EE",
};

type AdminData = { genres: Genre[]; votes: Record<string, number> };

// ── Shared styles ──────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "#0E0E1C", border: "1px solid #1C1C2E",
  borderRadius: 16, padding: "1.5rem",
};

const input: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8, padding: "0.6rem 0.85rem", color: "#fff",
  fontSize: "0.88rem", outline: "none", width: "100%",
  fontFamily: "var(--font-inter), sans-serif",
};

const btnGold: React.CSSProperties = {
  background: "linear-gradient(135deg, #FFD700, #FF6B35)", color: "#000",
  border: "none", borderRadius: 8, padding: "0.65rem 1.4rem",
  fontWeight: 800, fontSize: "0.82rem", letterSpacing: "1px",
  textTransform: "uppercase", cursor: "pointer",
  fontFamily: "var(--font-inter), sans-serif",
};

const btnRed: React.CSSProperties = {
  ...btnGold,
  background: "linear-gradient(135deg, #E50914, #FF5252)", color: "#fff",
};

const btnGhost: React.CSSProperties = {
  ...btnGold,
  background: "rgba(255,255,255,0.07)", color: "#fff",
  border: "1px solid rgba(255,255,255,0.14)",
};

// ── Login screen ───────────────────────────────────────────────────────────
function Login({ onAuth }: { onAuth: (pw: string) => void }) {
  const [pw, setPw]     = useState("");
  const [err, setErr]   = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit() {
    setBusy(true);
    setErr(false);
    const res = await verifyAdmin(pw);
    if (res.success) {
      onAuth(pw);
    } else {
      setErr(true);
      setPw("");
    }
    setBusy(false);
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", zIndex: 1 }}>
      <div style={{ ...card, width: "100%", maxWidth: 400, textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🔐</div>
        <h1 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "2.2rem", letterSpacing: "3px", marginBottom: "0.4rem" }}>
          Admin Access
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          Enter the password to manage genres and votes.
        </p>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <input
            style={{ ...input, borderColor: err ? "#FF6B6B" : "rgba(255,255,255,0.12)" }}
            type="password"
            placeholder="Password…"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button style={btnGold} onClick={handleSubmit} disabled={busy}>
            {busy ? "…" : "Enter"}
          </button>
        </div>
        {err && <p style={{ color: "#FF6B6B", fontSize: "0.82rem", marginTop: "0.75rem" }}>Wrong password.</p>}
      </div>
    </div>
  );
}

// ── Genre editor row ───────────────────────────────────────────────────────
function GenreRow({
  genre, votes, password,
  onChange, onDelete, onVoteChange,
}: {
  genre: Genre; votes: number; password: string;
  onChange: (g: Genre) => void;
  onDelete: () => void;
  onVoteChange: (id: string, v: number) => void;
}) {
  const [saving, setSaving]       = useState(false);
  const [localVote, setLocalVote] = useState(String(votes));

  async function saveVote() {
    const val = parseInt(localVote) || 0;
    if (val === votes) return;
    setSaving(true);
    await adminSetVote(password, genre.id, val);
    onVoteChange(genre.id, val);
    setSaving(false);
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "48px 1fr 1fr 120px 80px 36px",
      gap: "0.75rem",
      alignItems: "center",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 12,
      padding: "0.85rem 1rem",
    }}>
      {/* Emoji */}
      <input
        style={{ ...input, textAlign: "center", fontSize: "1.3rem", padding: "0.3rem" }}
        value={genre.emoji}
        onChange={(e) => onChange({ ...genre, emoji: e.target.value })}
        maxLength={4}
      />
      {/* Label */}
      <input
        style={input}
        value={genre.label}
        placeholder="Genre name"
        onChange={(e) => onChange({ ...genre, label: e.target.value })}
      />
      {/* Description */}
      <input
        style={input}
        value={genre.description}
        placeholder="Short description"
        onChange={(e) => onChange({ ...genre, description: e.target.value })}
      />
      {/* Color */}
      <select
        style={{ ...input, cursor: "pointer" }}
        value={genre.accentColor}
        onChange={(e) => onChange({ ...genre, accentColor: e.target.value })}
      >
        {ACCENT_COLORS.map((c) => (
          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
        ))}
      </select>
      {/* Votes */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <input
          style={{ ...input, textAlign: "center", padding: "0.6rem 0.4rem" }}
          type="number"
          min={0}
          value={localVote}
          onChange={(e) => setLocalVote(e.target.value)}
          onBlur={saveVote}
          title="Edit vote count"
        />
        {saving && <span style={{ color: "var(--gold)", fontSize: "0.7rem" }}>✓</span>}
      </div>
      {/* Color swatch + delete */}
      <button
        onClick={onDelete}
        style={{
          background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.3)",
          color: "#FF6B6B", borderRadius: 8, width: 36, height: 36,
          cursor: "pointer", fontSize: "1rem", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}
        title="Remove genre"
      >
        ✕
      </button>
    </div>
  );
}

// ── Main panel ─────────────────────────────────────────────────────────────
function Panel({ password }: { password: string }) {
  const [data, setData]       = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState("");
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await adminGetData(password);
      if (res.success && res.genres && res.votes) {
        setData({ genres: res.genres, votes: res.votes });
      }
      setLoading(false);
    }
    load();
  }, [password]);

  function updateGenre(i: number, g: Genre) {
    if (!data) return;
    const genres = [...data.genres];
    genres[i] = g;
    setData({ ...data, genres });
  }

  function deleteGenre(i: number) {
    if (!data) return;
    const genres = data.genres.filter((_, idx) => idx !== i);
    setData({ ...data, genres });
  }

  function addGenre() {
    if (!data) return;
    const id = `genre_${Date.now()}`;
    setData({
      ...data,
      genres: [...data.genres, { id, label: "New Genre", emoji: "🎬", description: "Description here.", accentColor: "amber" }],
      votes: { ...data.votes, [id]: 0 },
    });
  }

  function updateVote(id: string, v: number) {
    if (!data) return;
    setData({ ...data, votes: { ...data.votes, [id]: v } });
  }

  async function saveGenres() {
    if (!data) return;
    setSaving(true);
    setStatus("");
    const res = await adminSaveGenres(password, data.genres);
    setStatus(res.success ? "✓ Genres saved." : `Error: ${res.error}`);
    setSaving(false);
  }

  async function resetVotes() {
    if (window.prompt('Type "RESET" to confirm clearing all votes:') !== "RESET") return;
    const res = await adminResetVotes(password);
    if (res.success && data) {
      const votes = Object.fromEntries(data.genres.map((g) => [g.id, 0]));
      setData({ ...data, votes });
      setStatus("✓ Votes reset.");
    }
  }

  if (loading || !data) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>Loading…</div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Column headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr 1fr 120px 80px 36px",
        gap: "0.75rem", padding: "0 1rem",
      }}>
        {["Emoji", "Name", "Description", "Color", "Votes", ""].map((h) => (
          <span key={h} style={{ fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "2px" }}>{h}</span>
        ))}
      </div>

      {/* Genre rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {data.genres.map((g, i) => (
          <GenreRow
            key={g.id}
            genre={g}
            votes={data.votes[g.id] ?? 0}
            password={password}
            onChange={(updated) => updateGenre(i, updated)}
            onDelete={() => deleteGenre(i)}
            onVoteChange={updateVote}
          />
        ))}
      </div>

      {/* Color legend */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {ACCENT_COLORS.map((c) => (
          <div key={c} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", color: "var(--muted)" }}>
            <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: colorHex[c] }} />
            {c}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button style={btnGhost} onClick={addGenre}>＋ Add Genre</button>
        <button style={btnGold} onClick={saveGenres} disabled={saving}>
          {saving ? "Saving…" : "✓ Save Genres"}
        </button>
        <button style={btnRed} onClick={resetVotes}>↺ Reset All Votes</button>
      </div>

      {status && (
        <p style={{ color: status.startsWith("✓") ? "var(--gold)" : "#FF6B6B", fontSize: "0.85rem" }}>
          {status}
        </p>
      )}
    </div>
  );
}

// ── Root export ────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [password, setPassword] = useState<string | null>(null);

  if (!password) return <Login onAuth={setPassword} />;

  return (
    <main style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "3rem 2rem 6rem" }}>
      <header style={{ marginBottom: "2.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.68rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.6rem" }}>
            🔐 Admin Panel
          </div>
          <h1 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "3rem", letterSpacing: "3px" }}>
            Manage Movie Night
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: "0.4rem" }}>
            Edit genres, descriptions, and vote counts. Changes go live immediately.
          </p>
        </div>
        <a href="/" style={{ ...btnGhost, textDecoration: "none", whiteSpace: "nowrap", alignSelf: "flex-start" }}>
          ← Back to Voting
        </a>
      </header>

      <div style={card}>
        <Panel password={password} />
      </div>
    </main>
  );
}
