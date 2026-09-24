import React, { useEffect, useMemo, useState } from "react";

/*
 * INDIA CRICKET — TEAM CONTROL
 * Premium neo-brutalist cricket squad + fixture manager.
 * Tailwind CSS v3+ required.
 */

const STORAGE = {
  players: "stm.players.v2",
  matches: "stm.matches.v2",
  schema: "stm.schema.v2",
  legacyPlayers: "stm.india.players.v2",
  legacyMatches: "stm.india.matches.v2",
  legacySchema: "stm.india.schema.v2",
};

const SCHEMA = "india-cricket-brutalist-v2";
const XI = "Playing XI";
const ALT = "Alternate";
const GROUPS = [XI, ALT];
const ROLES = ["Batter", "Wicketkeeper-Batsman", "All-Rounder", "Bowler"];
const STATUSES = ["Available", "Injured"];
const MATCH_STATUSES = ["Upcoming", "In Progress", "Completed"];
const BLOCK_INJURED = true;

const SEED_PLAYERS = [
  { serialNumber: 1, name: "Sunil Gavaskar", jerseyNumber: null, role: "Batter", squad: XI, status: "Available" },
  { serialNumber: 2, name: "Virender Sehwag", jerseyNumber: 44, role: "Batter", squad: XI, status: "Available" },
  { serialNumber: 3, name: "Rahul Dravid", jerseyNumber: 5, role: "Batter", squad: XI, status: "Available" },
  { serialNumber: 4, name: "Sachin Tendulkar", jerseyNumber: 10, role: "Batter", squad: XI, status: "Available" },
  { serialNumber: 5, name: "Virat Kohli", jerseyNumber: 18, role: "Batter", squad: XI, status: "Available" },
  { serialNumber: 6, name: "MS Dhoni", jerseyNumber: 7, role: "Wicketkeeper-Batsman", squad: XI, status: "Available" },
  { serialNumber: 7, name: "Kapil Dev", jerseyNumber: null, role: "All-Rounder", squad: XI, status: "Available" },
  { serialNumber: 8, name: "Ravichandran Ashwin", jerseyNumber: 99, role: "All-Rounder", squad: XI, status: "Available" },
  { serialNumber: 9, name: "Anil Kumble", jerseyNumber: 37, role: "Bowler", squad: XI, status: "Available" },
  { serialNumber: 10, name: "Jasprit Bumrah", jerseyNumber: 93, role: "Bowler", squad: XI, status: "Available" },
  { serialNumber: 11, name: "Zaheer Khan", jerseyNumber: 34, role: "Bowler", squad: XI, status: "Available" },
  { serialNumber: 12, name: "Sourav Ganguly", jerseyNumber: 24, role: "Batter", squad: ALT, status: "Available" },
  { serialNumber: 13, name: "Rohit Sharma", jerseyNumber: 45, role: "Batter", squad: ALT, status: "Available" },
  { serialNumber: 14, name: "Yuvraj Singh", jerseyNumber: 12, role: "All-Rounder", squad: ALT, status: "Available" },
  { serialNumber: 15, name: "Rishabh Pant", jerseyNumber: 17, role: "Wicketkeeper-Batsman", squad: ALT, status: "Available" },
  { serialNumber: 16, name: "KL Rahul", jerseyNumber: 1, role: "Wicketkeeper-Batsman", squad: ALT, status: "Available" },
  { serialNumber: 17, name: "Ravindra Jadeja", jerseyNumber: 8, role: "All-Rounder", squad: ALT, status: "Available" },
  { serialNumber: 18, name: "Hardik Pandya", jerseyNumber: 33, role: "All-Rounder", squad: ALT, status: "Available" },
  { serialNumber: 19, name: "Harbhajan Singh", jerseyNumber: 3, role: "Bowler", squad: ALT, status: "Available" },
  { serialNumber: 20, name: "Bishan Singh Bedi", jerseyNumber: null, role: "Bowler", squad: ALT, status: "Available" },
  { serialNumber: 21, name: "Javagal Srinath", jerseyNumber: 14, role: "Bowler", squad: ALT, status: "Available" },
  { serialNumber: 22, name: "Ishant Sharma", jerseyNumber: 29, role: "Bowler", squad: ALT, status: "Available" },
  { serialNumber: 23, name: "Bhuvneshwar Kumar", jerseyNumber: 15, role: "Bowler", squad: ALT, status: "Available" },
];

const ROLE_SHORT = {
  Batter: "BAT",
  "Wicketkeeper-Batsman": "WK",
  "All-Rounder": "AR",
  Bowler: "BOWL",
};

const ROLE_ACCENT = {
  Batter: "bg-[#FF8A00]",
  "Wicketkeeper-Batsman": "bg-[#1E5EFF]",
  "All-Rounder": "bg-[#138A36]",
  Bowler: "bg-[#D72638]",
};

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const todayStr = () => {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const fmtDate = (value) =>
  new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(`${value}T00:00:00`)
  );
const read = (key, fallback = []) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
};

function seedPlayers() {
  return SEED_PLAYERS.map((player) => ({
    id: `seed-${player.serialNumber}`,
    serialNumber: player.serialNumber,
    name: player.name,
    jerseyNumber: player.jerseyNumber,
    role: player.role,
    squad: player.squad,
    status: player.status,
  }));
}

function seedMatches(players) {
  const ids = (serials) => serials.map((n) => players.find((p) => p.serialNumber === n)?.id).filter(Boolean);
  return [
    {
      id: "fixture-1",
      opponent: "Australia",
      date: addDays(7),
      location: "M. Chinnaswamy Stadium, Bengaluru",
      format: "ODI",
      status: "Upcoming",
      roster: ids([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    },
    {
      id: "fixture-2",
      opponent: "England",
      date: addDays(14),
      location: "Wankhede Stadium, Mumbai",
      format: "T20I",
      status: "Upcoming",
      roster: [],
    },
    {
      id: "fixture-3",
      opponent: "South Africa",
      date: addDays(28),
      location: "Eden Gardens, Kolkata",
      format: "Test",
      status: "Upcoming",
      roster: [],
    },
  ];
}

function normalizeJerseyNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1 || num > 99) return null;
  return num;
}

function normalizePlayers(raw) {
  const seen = new Set();
  return raw
    .filter((p) => p && typeof p === "object" && p.name)
    .map((p) => {
      let id = typeof p.id === "string" && p.id ? p.id : uid();
      while (seen.has(id)) id = uid();
      seen.add(id);

      const serialNumber = Number.isInteger(Number(p.serialNumber)) ? Number(p.serialNumber) : (Number.isInteger(Number(p.jersey)) ? Number(p.jersey) : 1);
      const jerseyNumber = normalizeJerseyNumber(p.jerseyNumber ?? p.jersey ?? null);

      return {
        id,
        serialNumber,
        jerseyNumber,
        name: String(p.name).trim(),
        role: ROLES.includes(p.role) ? p.role : "Batter",
        squad: GROUPS.includes(p.squad) ? p.squad : ALT,
        status: STATUSES.includes(p.status) ? p.status : "Available",
      };
    })
    .sort((a, b) => (a.serialNumber ?? 999) - (b.serialNumber ?? 999));
}

function normalizeMatches(raw) {
  return raw
    .filter((m) => m && m.date && m.opponent)
    .map((m) => ({
      id: m.id || uid(),
      opponent: String(m.opponent),
      date: String(m.date),
      location: String(m.location || ""),
      format: ["Test", "ODI", "T20I"].includes(m.format) ? m.format : "ODI",
      status: MATCH_STATUSES.includes(m.status) ? m.status : "Upcoming",
      roster: Array.isArray(m.roster) ? m.roster : [],
    }));
}

function initialData() {
  try {
    const schemaMatches = localStorage.getItem(STORAGE.schema) === SCHEMA || localStorage.getItem(STORAGE.legacySchema) === SCHEMA;
    if (schemaMatches) {
      const players = normalizePlayers(read(STORAGE.players).length ? read(STORAGE.players) : read(STORAGE.legacyPlayers));
      const matches = normalizeMatches(read(STORAGE.matches).length ? read(STORAGE.matches) : read(STORAGE.legacyMatches));
      return { players, matches }; 
    }
  } catch {}

  const players = seedPlayers();
  return { players, matches: seedMatches(players) };
}

const EMPTY_PLAYER = {
  serialNumber: "",
  name: "",
  jerseyNumber: "",
  role: "Batter",
  squad: ALT,
  status: "Available",
};
const EMPTY_MATCH = { opponent: "", date: "", location: "", format: "ODI" };

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Icon({ name, className = "h-5 w-5", stroke = 2 }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "square", strokeLinejoin: "miter" };
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" {...common}/><rect x="14" y="3" width="7" height="7" {...common}/><rect x="3" y="14" width="7" height="7" {...common}/><rect x="14" y="14" width="7" height="7" {...common}/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...common}/><circle cx="9" cy="7" r="4" {...common}/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" {...common}/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" {...common}/><path d="M16 2v4M8 2v4M3 10h18" {...common}/></>,
    plus: <><path d="M12 5v14M5 12h14" {...common}/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" {...common}/><path d="m16 16 5 5" {...common}/></>,
    edit: <><path d="m4 20 4-.8L19 8.2a2.1 2.1 0 0 0-3-3L5 16.2 4 20Z" {...common}/><path d="m14.5 6.5 3 3" {...common}/></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" {...common}/></>,
    arrow: <><path d="M4 12h15M13 6l6 6-6 6" {...common}/></>,
    chevron: <path d="m7 10 5 5 5-5" {...common}/>,
    close: <><path d="M5 5l14 14M19 5 5 19" {...common}/></>,
    refresh: <><path d="M20 11a8 8 0 1 0 1 5" {...common}/><path d="M20 4v7h-7" {...common}/></>,
    cricket: <><circle cx="12" cy="12" r="9" {...common}/><path d="M8 5c3 3 5 9 8 14M16 5c-3 3-5 9-8 14" {...common}/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>{paths[name] || paths.grid}</svg>;
}

function BrutalButton({ children, onClick, type = "button", tone = "dark", className = "", disabled = false }) {
  const tones = {
    dark: "bg-[#111111] text-[#F2EDE3] border-[#111111] shadow-[4px_4px_0_#FF8A00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#FF8A00]",
    paper: "bg-[#F2EDE3] text-[#111111] border-[#111111] shadow-[4px_4px_0_#111111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#111111]",
    blue: "bg-[#1E5EFF] text-white border-[#111111] shadow-[4px_4px_0_#111111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#111111]",
    orange: "bg-[#FF8A00] text-[#111111] border-[#111111] shadow-[4px_4px_0_#111111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#111111]",
    danger: "bg-[#D72638] text-white border-[#111111] shadow-[4px_4px_0_#111111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#111111]",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn("inline-flex items-center justify-center gap-2 border-2 px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] transition-all duration-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E5EFF]", tones[tone], className)}>
      {children}
    </button>
  );
}

function SectionTitle({ eyebrow, title, meta }) {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b-4 border-[#111111] pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-1 text-[10px] font-black uppercase tracking-[0.28em] text-[#1E5EFF]">{eyebrow}</p>}
        <h2 className="font-black uppercase leading-[0.82] tracking-[-0.05em] text-5xl sm:text-6xl lg:text-7xl">{title}</h2>
      </div>
      {meta && <div className="text-right text-[10px] font-black uppercase tracking-[0.18em] text-[#555]"><span className="text-[#111111]">{meta}</span></div>}
    </div>
  );
}

function StatusMark({ status }) {
  const style = status === "Available" ? "bg-[#138A36]" : "bg-[#D72638]";
  return <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em]"><i className={cn("h-2 w-2 border border-[#111111]", style)} />{status}</span>;
}

function RoleMark({ role }) {
  return <span className={cn("inline-flex border-2 border-[#111111] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em]", ROLE_ACCENT[role])}>{ROLE_SHORT[role]}</span>;
}

function PlayerRow({ player, onEdit, onDelete, compact = false }) {
  return (
    <div className={cn("group grid grid-cols-[44px_minmax(0,1fr)_80px_auto_auto] items-center gap-3 border-b-2 border-[#111111] bg-[#F2EDE3] px-3 py-3 transition-transform hover:translate-x-1 sm:grid-cols-[58px_minmax(0,1fr)_110px_130px_105px_auto]", compact ? "py-2" : "py-3") }>
      <div className="font-black text-xl leading-none">{String(player.serialNumber ?? 0).padStart(2, "0")}</div>
      <div className="min-w-0">
        <div className="truncate text-sm font-black uppercase tracking-tight sm:text-base">{player.name}</div>
        <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#666]">{player.squad === XI ? "STARTING XI" : "ALTERNATE"}</div>
      </div>
      <div className="text-left text-[11px] font-black uppercase tracking-[0.08em] text-[#111111]">{player.jerseyNumber === null ? "—" : `#${player.jerseyNumber}`}</div>
      <div className="hidden sm:block"><RoleMark role={player.role} /></div>
      <div className="hidden sm:block"><StatusMark status={player.status} /></div>
      <div className="flex justify-end gap-1 opacity-100 sm:opacity-40 sm:group-hover:opacity-100">
        <button onClick={() => onEdit(player)} className="border-2 border-[#111111] bg-white p-1.5 hover:bg-[#FF8A00]" aria-label={`Edit ${player.name}`}><Icon name="edit" className="h-4 w-4"/></button>
        <button onClick={() => onDelete(player)} className="border-2 border-[#111111] bg-white p-1.5 hover:bg-[#D72638] hover:text-white" aria-label={`Delete ${player.name}`}><Icon name="trash" className="h-4 w-4"/></button>
      </div>
    </div>
  );
}

function StatTile({ number, label, accent = "orange", note }) {
  const colors = { orange: "bg-[#FF8A00]", blue: "bg-[#1E5EFF] text-white", green: "bg-[#138A36] text-white", red: "bg-[#D72638] text-white" };
  return (
    <div className={cn("relative min-h-[145px] border-4 border-[#111111] p-4 shadow-[6px_6px_0_#111111]", colors[accent])}>
      <div className="text-6xl font-black leading-none tracking-[-0.07em] sm:text-7xl">{number}</div>
      <div className="mt-4 text-[10px] font-black uppercase tracking-[0.2em]">{label}</div>
      {note && <div className="absolute bottom-3 right-3 text-[8px] font-black uppercase opacity-70">{note}</div>}
    </div>
  );
}

function FeaturedPlayer({ player }) {
  return (
    <div className="relative min-h-[300px] overflow-hidden border-4 border-[#111111] bg-[#0B1F3A] p-5 text-[#F2EDE3] shadow-[8px_8px_0_#FF8A00]">
      <div className="absolute right-[-12px] top-[-35px] text-[190px] font-black leading-none text-white/5">{String(player.serialNumber ?? 0).padStart(2, "0")}</div>
      <div className="relative flex h-full min-h-[260px] flex-col justify-between">
        <div className="flex items-start justify-between"><span className="border-2 border-[#F2EDE3] px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em]">FEATURED PLAYER</span><span className="text-[10px] font-black">{ROLE_SHORT[player.role]}</span></div>
        <div>
          <div className="mb-1 text-7xl font-black leading-[0.8] tracking-[-0.07em]">{String(player.serialNumber ?? 0).padStart(2, "0")}</div>
          <h3 className="max-w-xl text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl">{player.name}</h3>
          <div className="mt-4 flex flex-wrap gap-2 text-[9px] font-black uppercase tracking-[0.15em]"><span className="border-2 border-white px-2 py-1">SQUAD {String(player.serialNumber ?? 0).padStart(2, "0")}</span><span className="border-2 border-white px-2 py-1">{player.jerseyNumber === null ? "JERSEY —" : `JERSEY #${player.jerseyNumber}`}</span><span className="border-2 border-white px-2 py-1">{player.status}</span></div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ players, matches, setView, onRestore }) {
  const today = todayStr();
  const xi = players.filter((p) => p.squad === XI).sort((a, b) => (a.serialNumber ?? 999) - (b.serialNumber ?? 999));
  const available = players.filter((p) => p.status === "Available").length;
  const injured = players.filter((p) => p.status === "Injured").length;
  const upcoming = matches.filter((m) => m.date >= today && m.status !== "Completed").sort((a, b) => a.date.localeCompare(b.date));
  const featured = players.find((p) => p.serialNumber === 6) || xi[0] || players[0];
  const roleCounts = ROLES.map((role) => ({ role, count: players.filter((p) => p.role === role).length }));

  return (
    <div className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <div className="relative overflow-hidden border-4 border-[#111111] bg-[#F2EDE3] p-5 shadow-[8px_8px_0_#111111] sm:p-8">
          <div className="absolute right-[-30px] top-[-60px] select-none text-[180px] font-black leading-none text-[#111111]/[0.045]">IND</div>
          <div className="relative">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-[#1E5EFF]">01 / COMMAND CENTRE</p>
            <h2 className="max-w-4xl text-6xl font-black uppercase leading-[0.78] tracking-[-0.07em] sm:text-8xl">India<br/><span className="text-[#1E5EFF]">Cricket</span><br/>Control</h2>
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t-2 border-[#111111] pt-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">SQUAD / 2026</span><span className="h-2 w-2 bg-[#138A36]"/><span className="text-[10px] font-black uppercase tracking-[0.2em]">SYSTEM ONLINE</span>
            </div>
          </div>
        </div>
        <FeaturedPlayer player={featured} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile number={players.length} label="Total Players" accent="orange" note="SQUAD" />
        <StatTile number={xi.length} label="Playing XI" accent="blue" note="STARTING" />
        <StatTile number={available} label="Available" accent="green" note={`${injured} INJURED`} />
        <StatTile number={upcoming.length} label="Upcoming" accent="red" note="FIXTURES" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_.65fr]">
        <section className="border-4 border-[#111111] bg-[#F2EDE3] shadow-[7px_7px_0_#111111]">
          <div className="flex items-center justify-between border-b-4 border-[#111111] bg-[#111111] px-4 py-4 text-[#F2EDE3]"><div><p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#FF8A00]">Starting unit</p><h3 className="text-2xl font-black uppercase">Playing XI</h3></div><span className="text-4xl font-black">11</span></div>
          <div>{xi.map((p) => <div key={p.id} className="grid grid-cols-[42px_minmax(0,1fr)_58px] items-center gap-3 border-b-2 border-[#111111] px-4 py-2.5"><span className="text-xl font-black">{String(p.serialNumber ?? 0).padStart(2, "0")}</span><div className="min-w-0"><div className="truncate text-sm font-black uppercase">{p.name}</div><div className="mt-0.5 text-[8px] font-black uppercase tracking-[0.15em] text-[#555]">{p.jerseyNumber === null ? "JERSEY —" : `JERSEY #${p.jerseyNumber}`}</div></div><span className="justify-self-end"><RoleMark role={p.role}/></span></div>)}</div>
          <div className="p-4"><BrutalButton tone="paper" onClick={() => setView("squad")} className="w-full">View full squad <Icon name="arrow" className="h-4 w-4"/></BrutalButton></div>
        </section>

        <section className="space-y-5">
          <div className="border-4 border-[#111111] bg-[#1E5EFF] p-5 text-white shadow-[7px_7px_0_#111111]">
            <p className="text-[9px] font-black uppercase tracking-[0.25em]">Role distribution</p>
            <div className="mt-5 space-y-4">{roleCounts.map(({ role, count }) => <div key={role}><div className="mb-1 flex justify-between text-[10px] font-black uppercase"><span>{role}</span><span>{count}</span></div><div className="h-4 border-2 border-[#111111] bg-white"><div className={cn("h-full", ROLE_ACCENT[role])} style={{ width: `${Math.max(5, (count / players.length) * 100)}%` }}/></div></div>)}</div>
          </div>
          <div className="border-4 border-[#111111] bg-[#FF8A00] p-5 shadow-[7px_7px_0_#111111]">
            <p className="text-[9px] font-black uppercase tracking-[0.25em]">Next fixture</p>
            {upcoming[0] ? <><div className="mt-2 text-4xl font-black uppercase leading-none">INDIA<br/><span className="text-[#111111]/40">VS</span><br/>{upcoming[0].opponent}</div><div className="mt-5 border-t-2 border-[#111111] pt-3 text-[10px] font-black uppercase">{fmtDate(upcoming[0].date)} · {upcoming[0].format}</div><div className="mt-1 text-[10px] font-bold uppercase">{upcoming[0].location}</div></> : <div className="mt-5 text-sm font-black uppercase">No upcoming fixture.</div>}
            <BrutalButton tone="dark" onClick={() => setView("matches")} className="mt-5 w-full">Open fixtures <Icon name="arrow" className="h-4 w-4"/></BrutalButton>
          </div>
          <button onClick={onRestore} className="w-full border-2 border-dashed border-[#666] px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#666] hover:border-[#111111] hover:text-[#111111]">Reset demo squad & fixtures</button>
        </section>
      </div>
    </div>
  );
}

function PlayerModal({ player, players, onClose, onSave }) {
  const editing = Boolean(player);
  const nextSerialNumber = players.reduce((max, item) => Math.max(max, Number(item.serialNumber) || 0), 0) + 1;
  const [form, setForm] = useState(
    player
      ? {
          serialNumber: player.serialNumber ?? nextSerialNumber,
          name: player.name,
          jerseyNumber: player.jerseyNumber ?? "",
          role: player.role,
          squad: player.squad,
          status: player.status,
        }
      : { ...EMPTY_PLAYER, serialNumber: nextSerialNumber }
  );
  const [error, setError] = useState("");
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Player name is required.");

    const serialNumber = Number(form.serialNumber) || nextSerialNumber;
    const jerseyNumber = form.jerseyNumber === "" ? null : Number(form.jerseyNumber);
    if (!Number.isInteger(serialNumber) || serialNumber < 1) return setError("Squad serial number must be valid.");
    if (form.jerseyNumber !== "" && (!Number.isInteger(jerseyNumber) || jerseyNumber < 1 || jerseyNumber > 99)) return setError("Jersey number must be 1–99 when provided.");
    const duplicate = players.some((p) => p.jerseyNumber !== null && jerseyNumber !== null && p.jerseyNumber === jerseyNumber && p.id !== player?.id);
    if (duplicate) return setError(`Jersey number ${jerseyNumber} is already assigned.`);

    onSave({ ...form, name: form.name.trim(), serialNumber, jerseyNumber }, player?.id);
  };
  const field = "w-full border-2 border-[#111111] bg-white px-3 py-3 text-sm font-bold uppercase outline-none focus:border-[#1E5EFF] focus:ring-4 focus:ring-[#1E5EFF]/20";
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/80 p-4" role="dialog" aria-modal="true">
    <form onSubmit={submit} className="w-full max-w-2xl border-4 border-[#111111] bg-[#F2EDE3] p-5 shadow-[10px_10px_0_#FF8A00] sm:p-7">
      <div className="mb-6 flex items-start justify-between border-b-4 border-[#111111] pb-4"><div><p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#1E5EFF]">Squad database</p><h2 className="text-4xl font-black uppercase leading-none">{editing ? "Edit player" : "Add player"}</h2></div><button type="button" onClick={onClose} className="border-2 border-[#111111] bg-white p-2 hover:bg-[#FF8A00]" aria-label="Close"><Icon name="close"/></button></div>
      {error && <div className="mb-4 border-2 border-[#111111] bg-[#D72638] p-3 text-xs font-black uppercase text-white">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <label><span className="mb-1 block text-[9px] font-black uppercase tracking-[0.18em]">Squad serial number</span><input className={field} value={form.serialNumber} readOnly placeholder="01" /></label>
        <label className="sm:col-span-1"><span className="mb-1 block text-[9px] font-black uppercase tracking-[0.18em]">Player name</span><input autoFocus className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="PLAYER NAME"/></label>
        <label><span className="mb-1 block text-[9px] font-black uppercase tracking-[0.18em]">Jersey number</span><input type="number" min="1" max="99" className={field} value={form.jerseyNumber} onChange={(e) => set("jerseyNumber", e.target.value)} placeholder="—" /></label>
        <label><span className="mb-1 block text-[9px] font-black uppercase tracking-[0.18em]">Role</span><select className={field} value={form.role} onChange={(e) => set("role", e.target.value)}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></label>
        <label><span className="mb-1 block text-[9px] font-black uppercase tracking-[0.18em]">Squad group</span><select className={field} value={form.squad} onChange={(e) => set("squad", e.target.value)}>{GROUPS.map((g) => <option key={g}>{g}</option>)}</select></label>
        <label><span className="mb-1 block text-[9px] font-black uppercase tracking-[0.18em]">Availability</span><select className={field} value={form.status} onChange={(e) => set("status", e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-3 border-t-2 border-[#111111] pt-5 sm:flex-row sm:justify-end"><BrutalButton tone="paper" onClick={onClose}>Cancel</BrutalButton><BrutalButton type="submit" tone="dark">{editing ? "Save changes" : "Add player"}</BrutalButton></div>
    </form>
  </div>;
}

function SquadView({ players, onSave, onDelete, onReset }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");
  const [group, setGroup] = useState("All");
  const [modal, setModal] = useState(null);
  const filtered = useMemo(() => players.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) && (role === "All" || p.role === role) && (group === "All" || p.squad === group)).sort((a, b) => (a.serialNumber ?? 999) - (b.serialNumber ?? 999)), [players, query, role, group]);
  const handleDelete = (p) => { if (window.confirm(`Delete ${p.name} from the squad?`)) onDelete(p.id); };
  return <div className="space-y-7">
    <SectionTitle eyebrow="02 / squad database" title="India Squad" meta={`${players.length} players / ${players.filter((p) => p.squad === XI).length} XI`}/>
    <div className="grid gap-3 border-4 border-[#111111] bg-[#0B1F3A] p-3 shadow-[7px_7px_0_#111111] sm:grid-cols-[1fr_180px_180px_auto]">
      <label className="flex items-center border-2 border-[#111111] bg-[#F2EDE3] px-3"><Icon name="search" className="mr-2 h-4 w-4"/><input className="w-full bg-transparent py-3 text-xs font-black uppercase outline-none" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="SEARCH PLAYER"/></label>
      <select className="border-2 border-[#111111] bg-[#F2EDE3] px-3 py-3 text-xs font-black uppercase" value={group} onChange={(e) => setGroup(e.target.value)}><option>All</option>{GROUPS.map((g) => <option key={g}>{g}</option>)}</select>
      <select className="border-2 border-[#111111] bg-[#F2EDE3] px-3 py-3 text-xs font-black uppercase" value={role} onChange={(e) => setRole(e.target.value)}><option>All</option>{ROLES.map((r) => <option key={r}>{r}</option>)}</select>
      <BrutalButton tone="orange" onClick={() => setModal({ player: null })} className="bg-[#FF8A00] text-[#111111] shadow-[4px_4px_0_#F2EDE3]"><Icon name="plus" className="h-4 w-4"/> Add player</BrutalButton>
    </div>
    <div className="grid gap-7 xl:grid-cols-2">
      {GROUPS.map((g) => {
        const list = filtered.filter((p) => p.squad === g);
        return <section key={g} className="border-4 border-[#111111] bg-[#F2EDE3] shadow-[7px_7px_0_#111111]"><div className={cn("flex items-end justify-between border-b-4 border-[#111111] px-4 py-4", g === XI ? "bg-[#FF8A00]" : "bg-white")}><div><p className="text-[9px] font-black uppercase tracking-[0.2em]">{g === XI ? "Starting unit" : "Bench depth"}</p><h3 className="text-3xl font-black uppercase leading-none">{g}</h3></div><span className="text-4xl font-black">{list.length}</span></div><div>{list.length ? list.map((p) => <PlayerRow key={p.id} player={p} onEdit={(x) => setModal({ player: x })} onDelete={handleDelete}/>) : <div className="p-8 text-center text-xs font-black uppercase text-[#666]">No players match this filter.</div>}</div></section>;
      })}
    </div>
    <div className="flex justify-end"><button onClick={onReset} className="text-[9px] font-black uppercase tracking-[0.18em] text-[#666] underline decoration-2 underline-offset-4 hover:text-[#111111]">Reset squad to default 23</button></div>
    {modal && <PlayerModal player={modal.player} players={players} onClose={() => setModal(null)} onSave={(data, id) => { onSave(data, id); setModal(null); }}/>} 
  </div>;
}

function FixtureCard({ match, players, onToggle, onSetRoster, onDelete, onStatus }) {
  const [open, setOpen] = useState(false);
  const eligible = players.filter((p) => !BLOCK_INJURED || p.status !== "Injured");
  const selected = new Set(match.roster);
  const selectedCount = eligible.filter((p) => selected.has(p.id)).length;
  const percent = eligible.length ? Math.round((selectedCount / eligible.length) * 100) : 0;
  const ordered = [...players].sort((a, b) => (a.serialNumber ?? 999) - (b.serialNumber ?? 999));
  return <article className="border-4 border-[#111111] bg-[#F2EDE3] shadow-[7px_7px_0_#111111]">
    <div className="grid gap-4 border-b-4 border-[#111111] p-4 sm:grid-cols-[110px_1fr_auto] sm:items-center">
      <div className="border-2 border-[#111111] bg-[#111111] p-2 text-center text-[#F2EDE3]"><div className="text-3xl font-black leading-none">{new Date(`${match.date}T00:00:00`).getDate()}</div><div className="text-[9px] font-black uppercase">{new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(`${match.date}T00:00:00`))}</div></div>
      <div><div className="mb-1 flex flex-wrap items-center gap-2"><span className="bg-[#1E5EFF] px-2 py-1 text-[9px] font-black uppercase text-white">{match.format}</span><span className="text-[9px] font-black uppercase tracking-[0.16em]">{match.status}</span></div><h3 className="text-4xl font-black uppercase leading-[0.85] tracking-[-0.04em]">INDIA <span className="text-[#777]">VS</span> {match.opponent}</h3><p className="mt-2 text-[9px] font-black uppercase tracking-[0.15em] text-[#666]">{match.location || "Venue TBC"}</p></div>
      <div className="flex gap-2 sm:flex-col"><BrutalButton tone="paper" onClick={() => setOpen((v) => !v)} className="px-3">{open ? "Close" : "Manage"} <Icon name="chevron" className={cn("h-4 w-4 transition-transform", open && "rotate-180")}/></BrutalButton><button onClick={() => onDelete(match)} className="border-2 border-[#111111] bg-white px-3 py-2 text-[9px] font-black uppercase hover:bg-[#D72638] hover:text-white">Delete</button></div>
    </div>
    <div className="grid gap-5 border-b-2 border-[#111111] p-4 sm:grid-cols-[1fr_150px] sm:items-center"><div><div className="mb-2 flex justify-between text-[9px] font-black uppercase"><span>Squad readiness</span><span>{selectedCount}/{eligible.length} selected</span></div><div className="h-5 border-2 border-[#111111] bg-white"><div className="h-full bg-[#138A36]" style={{ width: `${percent}%` }}/></div></div><div className="text-right"><div className="text-4xl font-black">{percent}%</div><div className="text-[8px] font-black uppercase">participation</div></div></div>
    {open && <div className="bg-[#111111] p-4 text-[#F2EDE3]"><div className="mb-4 flex flex-col gap-3 border-b-2 border-white/30 pb-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF8A00]">Match-day squad</p><h4 className="text-2xl font-black uppercase">Select participation</h4></div><div className="flex gap-2"><button onClick={() => onSetRoster(match.id, eligible.map((p) => p.id))} className="border-2 border-[#F2EDE3] px-3 py-2 text-[9px] font-black uppercase hover:bg-[#F2EDE3] hover:text-[#111111]">Select all</button><button onClick={() => onSetRoster(match.id, [])} className="border-2 border-[#F2EDE3] px-3 py-2 text-[9px] font-black uppercase hover:bg-[#F2EDE3] hover:text-[#111111]">Clear</button></div></div><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{ordered.map((p) => { const locked = BLOCK_INJURED && p.status === "Injured"; const isIn = selected.has(p.id); return <button key={p.id} disabled={locked} onClick={() => onToggle(match.id, p.id)} className={cn("grid grid-cols-[42px_1fr_auto] items-center gap-2 border-2 p-2 text-left transition-transform hover:translate-x-1 disabled:cursor-not-allowed disabled:opacity-35", isIn ? "border-[#FF8A00] bg-[#FF8A00] text-[#111111]" : "border-white/50 bg-transparent", p.squad === XI && "") }><span className="text-xl font-black">{String(p.serialNumber ?? 0).padStart(2, "0")}</span><span className="min-w-0"><span className="block truncate text-[10px] font-black uppercase">{p.name}</span><span className="block text-[8px] font-bold uppercase opacity-60">{p.jerseyNumber === null ? "JERSEY —" : `#${p.jerseyNumber}`}</span></span><span className="text-[8px] font-black uppercase">{locked ? "OUT" : isIn ? "IN" : "OUT"}</span></button>; })}</div></div>}
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[9px] font-black uppercase tracking-[0.12em]"><span>Fixture ID / {match.id.slice(0, 8)}</span><select value={match.status} onChange={(e) => onStatus(match.id, e.target.value)} className="border-2 border-[#111111] bg-white px-2 py-1 font-black uppercase"><option>Upcoming</option><option>In Progress</option><option>Completed</option></select></div>
  </article>;
}

function MatchModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ ...EMPTY_MATCH, date: addDays(7) });
  const [error, setError] = useState("");
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const submit = (e) => { e.preventDefault(); if (!form.opponent.trim()) return setError("Opponent is required."); if (!form.date || form.date < todayStr()) return setError("Fixture date cannot be in the past."); onAdd({ ...form, opponent: form.opponent.trim(), location: form.location.trim() }); onClose(); };
  const field = "w-full border-2 border-[#111111] bg-white px-3 py-3 text-sm font-bold uppercase outline-none focus:border-[#1E5EFF] focus:ring-4 focus:ring-[#1E5EFF]/20";
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/80 p-4"><form onSubmit={submit} className="w-full max-w-xl border-4 border-[#111111] bg-[#F2EDE3] p-5 shadow-[10px_10px_0_#1E5EFF] sm:p-7"><div className="mb-6 flex items-start justify-between border-b-4 border-[#111111] pb-4"><div><p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#1E5EFF]">Fixture desk</p><h2 className="text-4xl font-black uppercase leading-none">New fixture</h2></div><button type="button" onClick={onClose} className="border-2 border-[#111111] bg-white p-2 hover:bg-[#FF8A00]"><Icon name="close"/></button></div>{error && <div className="mb-4 border-2 border-[#111111] bg-[#D72638] p-3 text-xs font-black uppercase text-white">{error}</div>}<div className="grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-1 block text-[9px] font-black uppercase tracking-[0.18em]">Opponent</span><input autoFocus className={field} value={form.opponent} onChange={(e) => set("opponent", e.target.value)} placeholder="OPPONENT"/></label><label><span className="mb-1 block text-[9px] font-black uppercase tracking-[0.18em]">Date</span><input type="date" min={todayStr()} className={field} value={form.date} onChange={(e) => set("date", e.target.value)}/></label><label><span className="mb-1 block text-[9px] font-black uppercase tracking-[0.18em]">Format</span><select className={field} value={form.format} onChange={(e) => set("format", e.target.value)}><option>Test</option><option>ODI</option><option>T20I</option></select></label><label className="sm:col-span-2"><span className="mb-1 block text-[9px] font-black uppercase tracking-[0.18em]">Venue</span><input className={field} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="VENUE"/></label></div><div className="mt-6 flex justify-end gap-3 border-t-2 border-[#111111] pt-5"><BrutalButton tone="paper" onClick={onClose}>Cancel</BrutalButton><BrutalButton type="submit" tone="blue">Create fixture</BrutalButton></div></form></div>;
}

function MatchesView({ players, matches, onAdd, onDelete, onToggle, onSetRoster, onStatus }) {
  const [modal, setModal] = useState(false);
  const sorted = [...matches].sort((a, b) => a.date.localeCompare(b.date));
  return <div className="space-y-7"><SectionTitle eyebrow="03 / fixture desk" title="Fixtures" meta={`${matches.length} matches / ${players.length} squad`}/><div className="flex flex-col justify-between gap-4 border-4 border-[#111111] bg-[#FF8A00] p-5 shadow-[7px_7px_0_#111111] sm:flex-row sm:items-center"><div><p className="text-[9px] font-black uppercase tracking-[0.22em]">India cricket / calendar</p><h3 className="mt-1 text-3xl font-black uppercase leading-none">Manage the next innings.</h3></div><BrutalButton tone="dark" onClick={() => setModal(true)}><Icon name="plus" className="h-4 w-4"/> New fixture</BrutalButton></div><div className="space-y-6">{sorted.length ? sorted.map((m) => <FixtureCard key={m.id} match={m} players={players} onToggle={onToggle} onSetRoster={onSetRoster} onDelete={onDelete} onStatus={onStatus}/>) : <div className="border-4 border-dashed border-[#111111] p-10 text-center"><div className="text-5xl font-black">00</div><p className="mt-2 text-xs font-black uppercase">No fixtures scheduled.</p></div>}</div>{modal && <MatchModal onClose={() => setModal(false)} onAdd={onAdd}/>}</div>;
}

export default function App() {
  const [initial] = useState(initialData);
  const [players, setPlayers] = useState(initial.players);
  const [matches, setMatches] = useState(initial.matches);
  const [view, setView] = useState("dashboard");

  useEffect(() => { localStorage.setItem(STORAGE.schema, SCHEMA); localStorage.setItem(STORAGE.players, JSON.stringify(players)); }, [players]);
  useEffect(() => { localStorage.setItem(STORAGE.schema, SCHEMA); localStorage.setItem(STORAGE.matches, JSON.stringify(matches)); }, [matches]);
  useEffect(() => { document.title = "INDIA CRICKET · TEAM CONTROL"; }, []);

  const savePlayer = (data, id) => {
    if (id) {
      setPlayers((prev) => prev.map((p) => p.id === id ? { ...p, ...data, serialNumber: Number(data.serialNumber) || p.serialNumber, jerseyNumber: data.jerseyNumber === null ? null : Number(data.jerseyNumber) ?? p.jerseyNumber } : p).sort((a, b) => (a.serialNumber ?? 999) - (b.serialNumber ?? 999)));
      if (BLOCK_INJURED && data.status === "Injured") setMatches((prev) => prev.map((m) => ({ ...m, roster: m.roster.filter((pid) => pid !== id) })));
    } else {
      const serialNumber = Math.max(0, ...players.map((p) => Number(p.serialNumber) || 0)) + 1;
      const player = {
        id: uid(),
        serialNumber,
        ...data,
        jerseyNumber: data.jerseyNumber === "" ? null : Number(data.jerseyNumber),
      };
      setPlayers((prev) => [...prev, player].sort((a, b) => (a.serialNumber ?? 999) - (b.serialNumber ?? 999)));
    }
  };
  const deletePlayer = (id) => { setPlayers((prev) => prev.filter((p) => p.id !== id)); setMatches((prev) => prev.map((m) => ({ ...m, roster: m.roster.filter((pid) => pid !== id) }))); };
  const addMatch = (data) => setMatches((prev) => [...prev, { id: uid(), ...data, status: "Upcoming", roster: [] }]);
  const deleteMatch = (id) => setMatches((prev) => prev.filter((m) => m.id !== id));
  const toggle = (matchId, playerId) => setMatches((prev) => prev.map((m) => { if (m.id !== matchId) return m; const p = players.find((x) => x.id === playerId); if (!p || (BLOCK_INJURED && p.status === "Injured")) return m; return { ...m, roster: m.roster.includes(playerId) ? m.roster.filter((id) => id !== playerId) : [...m.roster, playerId] }; }));
  const setRoster = (matchId, ids) => setMatches((prev) => prev.map((m) => m.id === matchId ? { ...m, roster: ids } : m));
  const setStatus = (matchId, status) => setMatches((prev) => prev.map((m) => m.id === matchId ? { ...m, status } : m));
  const reset = () => { if (!window.confirm("Reset the application to the default 23-player India squad and demo fixtures?")) return; const p = seedPlayers(); setPlayers(p); setMatches(seedMatches(p)); };

  const nav = [
    ["dashboard", "Dashboard", "grid"],
    ["squad", "Squad", "users"],
    ["matches", "Fixtures", "calendar"],
  ];

  return <div className="min-h-screen bg-[#8D8C83] font-sans text-[#111111] selection:bg-[#FF8A00] selection:text-[#111111]">
    <header className="sticky top-0 z-40 border-b-4 border-[#111111] bg-[#111111] text-[#F2EDE3]">
      <div className="mx-auto flex max-w-[1500px] flex-col lg:flex-row lg:items-stretch">
        <div className="flex min-h-[76px] items-center justify-between border-b-2 border-white/20 px-4 py-3 lg:w-[330px] lg:border-b-0 lg:border-r-4 lg:border-[#F2EDE3] lg:px-6">
          <button onClick={() => setView("dashboard")} className="text-left"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center border-2 border-[#F2EDE3] bg-[#FF8A00] text-[#111111]"><Icon name="cricket"/></span><div><div className="text-xl font-black uppercase leading-none tracking-tight">India Cricket</div><div className="mt-1 text-[8px] font-black uppercase tracking-[0.25em] text-[#FF8A00]">Team Control</div></div></div></button>
          <div className="text-right lg:hidden"><div className="text-[9px] font-black uppercase text-[#138A36]">● Online</div><div className="text-[8px] font-bold uppercase text-white/50">v2.0</div></div>
        </div>
        <div className="flex flex-1 flex-col sm:flex-row sm:items-stretch sm:justify-between">
          <nav className="grid flex-1 grid-cols-3" aria-label="Main navigation">{nav.map(([id, label, icon], i) => <button key={id} onClick={() => setView(id)} aria-current={view === id ? "page" : undefined} className={cn("flex items-center justify-center gap-2 border-b-2 border-white/20 px-2 py-4 text-[10px] font-black uppercase tracking-[0.14em] transition-colors sm:justify-start sm:px-5", view === id ? "bg-[#FF8A00] text-[#111111]" : "hover:bg-white/10")}><span className="hidden sm:block"><Icon name={icon} className="h-4 w-4"/></span><span>{String(i + 1).padStart(2, "0")}</span>{label}</button>)}</nav>
          <div className="hidden items-center gap-5 px-5 lg:flex"><div><div className="text-[9px] font-black uppercase tracking-[0.15em] text-white/40">Squad</div><div className="text-2xl font-black leading-none">{players.length}</div></div><div className="h-8 w-px bg-white/20"/><div><div className="text-[9px] font-black uppercase tracking-[0.15em] text-white/40">XI</div><div className="text-2xl font-black leading-none">{players.filter((p) => p.squad === XI).length}</div></div><div className="h-2 w-2 bg-[#138A36]"/></div>
        </div>
      </div>
      <div className="grid h-1 grid-cols-3"><span className="bg-[#FF8A00]"/><span className="bg-white"/><span className="bg-[#138A36]"/></div>
    </header>

    <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      {view === "dashboard" && <Dashboard players={players} matches={matches} setView={setView} onRestore={reset}/>} 
      {view === "squad" && <SquadView players={players} onSave={savePlayer} onDelete={deletePlayer} onReset={reset}/>} 
      {view === "matches" && <MatchesView players={players} matches={matches} onAdd={addMatch} onDelete={(m) => { if (window.confirm(`Delete India vs ${m.opponent}?`)) deleteMatch(m.id); }} onToggle={toggle} onSetRoster={setRoster} onStatus={setStatus}/>} 
    </main>
    <footer className="mx-auto flex max-w-[1500px] flex-col gap-2 border-t-4 border-[#111111] px-4 py-5 text-[8px] font-black uppercase tracking-[0.2em] text-[#222] sm:flex-row sm:items-center sm:justify-between sm:px-8"><span>INDIA CRICKET / TEAM CONTROL / {new Date().getFullYear()}</span><span>LOCAL DATA · NO BACKEND REQUIRED</span></footer>
  </div>;
}
