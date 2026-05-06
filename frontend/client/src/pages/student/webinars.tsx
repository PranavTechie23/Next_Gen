import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  FileText,
  Link as LinkIcon,
  MapPin,
  Play,
  Search,
  User,
  Video,
  Wifi,
  WifiOff,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { studentApi } from "@/services/studentApi";
import { toast } from "sonner";

/* ─── Types ────────────────────────────────────────────────────── */
type Webinar = {
  id: number;
  title: string;
  summary: string;
  speaker_name: string;
  speaker_role?: string | null;
  speaker_background?: string | null;
  speaker_photo_url?: string | null;
  session_mode: "OFFLINE" | "ONLINE" | "HYBRID";
  venue?: string | null;
  meeting_link?: string | null;
  recording_url?: string | null;
  starts_at: string;
  registration_required: boolean;
  status: "DRAFT" | "PUBLISHED" | "COMPLETED" | "CANCELLED";
  mom_text?: string | null;
  mom_url?: string | null;
  key_takeaways?: string | null;
  is_registered?: boolean;
  is_dept_event?: boolean;
};

/* ─── Helpers ───────────────────────────────────────────────────── */
const modeIcon = (mode: Webinar["session_mode"]) => {
  if (mode === "ONLINE") return <Wifi className="w-3 h-3" />;
  if (mode === "HYBRID") return <Layers className="w-3 h-3" />;
  return <WifiOff className="w-3 h-3" />;
};
const modeLabel = (mode: Webinar["session_mode"]) =>
  ({ ONLINE: "Online", HYBRID: "Hybrid", OFFLINE: "Offline" }[mode]);

const modeColor = (mode: Webinar["session_mode"]) =>
  ({
    ONLINE: "var(--w-badge-online-bg)",
    HYBRID: "var(--w-badge-hybrid-bg)",
    OFFLINE: "var(--w-badge-offline-bg)",
  }[mode]);

const modeBorder = (mode: Webinar["session_mode"]) =>
  ({
    ONLINE: "rgba(139,92,246,0.5)",
    HYBRID: "rgba(6,182,212,0.5)",
    OFFLINE: "rgba(245,158,11,0.5)",
  }[mode]);

const modeText = (mode: Webinar["session_mode"]) =>
  ({
    ONLINE: "var(--w-online-text)",
    HYBRID: "var(--w-hybrid-text)",
    OFFLINE: "var(--w-offline-text)",
  }[mode]);

function SpeakerAvatar({ url, name, size = 48 }: { url?: string | null; name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  if (url)
    return (
      <img
        src={url}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1.5px solid rgba(139,92,246,0.4)",
          flexShrink: 0,
        }}
      />
    );
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#4c1d95,#7c3aed)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.33,
        fontWeight: 600,
        color: "#fff",
        flexShrink: 0,
        border: "1.5px solid rgba(139,92,246,0.4)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {initials}
    </div>
  );
}

/* ─── Glass token ───────────────────────────────────────────────── */
const glass = {
  background: "var(--w-card-bg)",
  backdropFilter: "blur(16px) saturate(1.6)",
  WebkitBackdropFilter: "blur(16px) saturate(1.6)",
  border: "1px solid var(--w-card-border)",
  borderRadius: 18,
  boxShadow: "var(--w-card-shadow)",
};

/* ─── Featured upcoming card (large bento) ──────────────────────── */
function FeaturedCard({
  w,
  onRegister,
  submitting,
}: {
  w: Webinar;
  onRegister: (id: number) => void;
  submitting: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...glass,
        position: "relative",
        overflow: "hidden",
        padding: "32px",
        transition: "border 0.3s, transform 0.3s, box-shadow 0.3s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        border: hovered
          ? "1px solid var(--w-card-border-hover)"
          : "1px solid var(--w-card-border)",
        boxShadow: hovered
          ? "var(--w-card-shadow-hover)"
          : "var(--w-card-shadow)",
        gridColumn: "span 2",
        minHeight: 280,
      }}
    >
      {/* Decorative glow blob */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,217,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: 80,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <SpeakerAvatar url={w.is_dept_event ? null : w.speaker_photo_url} name={w.is_dept_event ? "DF" : w.speaker_name} size={52} />
          <div>
            <p style={{ fontSize: 14, color: "var(--w-text-main)", fontWeight: 600, marginBottom: 2, letterSpacing: 0.3 }}>
              {w.is_dept_event ? "Department Faculty" : w.speaker_name}
            </p>
            {w.is_dept_event ? (
               <p style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginBottom: 0 }}>Department Session</p>
            ) : w.speaker_role && (
              <p style={{ fontSize: 13, color: "var(--w-text-subtle)", marginBottom: 0 }}>{w.speaker_role}</p>
            )}
          </div>
        </div>
        <ModeBadge mode={w.is_dept_event ? "OFFLINE" : w.session_mode} />
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 26, fontWeight: 700, color: "var(--w-text-main)", marginBottom: 10, lineHeight: 1.25, fontFamily: "'Instrument Serif', serif", letterSpacing: -0.3 }}>
        {w.title}
      </h3>
      <p style={{ fontSize: 16, color: "var(--w-text-muted)", lineHeight: 1.65, marginBottom: 20, maxWidth: 520 }}>
        {w.summary}
      </p>

      {w.speaker_background && (
        <p style={{ fontSize: 14, color: "var(--w-text-subtle)", lineHeight: 1.6, marginBottom: 20, maxWidth: 540, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {w.speaker_background}
        </p>
      )}

      {/* Meta row */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
        <MetaChip icon={<Calendar className="w-3.5 h-3.5" />} label={format(new Date(w.starts_at), "dd MMM yyyy")} />
        <MetaChip icon={<Clock className="w-3.5 h-3.5" />} label={format(new Date(w.starts_at), "hh:mm a")} />
        {w.venue && <MetaChip icon={<MapPin className="w-3.5 h-3.5" />} label={w.venue} />}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {w.meeting_link && (
          <a href={w.meeting_link} target="_blank" rel="noreferrer">
            <GlassButton icon={<LinkIcon className="w-3.5 h-3.5" />} label="Join Session" accent />
          </a>
        )}
        {w.registration_required && !w.is_dept_event && (
          <button
            disabled={Boolean(w.is_registered) || submitting}
            onClick={() => onRegister(w.id)}
            style={{
              display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
              borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: w.is_registered || submitting ? "not-allowed" : "pointer",
              background: w.is_registered ? "rgba(139,92,246,0.12)" : "rgba(139,92,246,0.85)",
              border: "1px solid rgba(139,92,246,0.6)", color: w.is_registered ? "#a78bfa" : "#fff",
              transition: "all 0.2s", opacity: submitting ? 0.6 : 1,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {w.is_registered ? "Registered ✓" : submitting ? "Registering…" : "Register Now"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Compact upcoming card ─────────────────────────────────────── */
function CompactCard({
  w,
  onRegister,
  submitting,
}: {
  w: Webinar;
  onRegister: (id: number) => void;
  submitting: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...glass,
        padding: "24px",
        transition: "border 0.3s, transform 0.3s, box-shadow 0.3s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        border: hovered ? "1px solid var(--w-card-border-hover)" : "1px solid var(--w-card-border)",
        boxShadow: hovered ? "var(--w-card-shadow-hover)" : "var(--w-card-shadow)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SpeakerAvatar url={w.is_dept_event ? null : w.speaker_photo_url} name={w.is_dept_event ? "DF" : w.speaker_name} size={38} />
          <div>
            <p style={{ fontSize: 13, color: "var(--w-text-main)", fontWeight: 600, marginBottom: 1 }}>
              {w.is_dept_event ? "Department" : w.speaker_name}
            </p>
            {w.is_dept_event ? (
               <p style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600, marginBottom: 0 }}>Internal Session</p>
            ) : w.speaker_role && (
               <p style={{ fontSize: 12, color: "var(--w-text-subtle)" }}>{w.speaker_role}</p>
            )}
          </div>
        </div>
        <ModeBadge mode={w.is_dept_event ? "OFFLINE" : w.session_mode} small />
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--w-text-main)", marginBottom: 8, lineHeight: 1.3, fontFamily: "'Instrument Serif', serif" }}>
        {w.title}
      </h3>
      <p style={{ fontSize: 14, color: "var(--w-text-muted)", lineHeight: 1.6, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {w.summary}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <MetaChip icon={<Calendar className="w-3 h-3" />} label={format(new Date(w.starts_at), "dd MMM")} small />
        <MetaChip icon={<Clock className="w-3 h-3" />} label={format(new Date(w.starts_at), "hh:mm a")} small />
        {w.venue && <MetaChip icon={<MapPin className="w-3 h-3" />} label={w.venue} small />}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {w.meeting_link && (
          <a href={w.meeting_link} target="_blank" rel="noreferrer">
            <GlassButton icon={<LinkIcon className="w-3 h-3" />} label="Join" small />
          </a>
        )}
        {w.registration_required && !w.is_dept_event && (
          <button
            disabled={Boolean(w.is_registered) || submitting}
            onClick={() => onRegister(w.id)}
            style={{
              display: "flex", alignItems: "center", gap: 5, padding: "7px 12px",
              borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: w.is_registered || submitting ? "not-allowed" : "pointer",
              background: w.is_registered ? "rgba(139,92,246,0.12)" : "rgba(139,92,246,0.75)",
              border: "1px solid rgba(139,92,246,0.5)", color: w.is_registered ? "#a78bfa" : "#fff",
              transition: "all 0.2s", opacity: submitting ? 0.6 : 1,
            }}
          >
            {w.is_registered ? "Registered ✓" : submitting ? "…" : "Register"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Past session card ─────────────────────────────────────────── */
function PastCard({ w }: { w: Webinar }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...glass,
        padding: "24px",
        transition: "border 0.3s, transform 0.3s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        border: hovered ? "1px solid var(--w-card-border-hover)" : "1px solid var(--w-card-border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SpeakerAvatar url={w.speaker_photo_url} name={w.speaker_name} size={36} />
          <div>
            <p style={{ fontSize: 13, color: "var(--w-text-main)", fontWeight: 600 }}>{w.speaker_name}</p>
            <p style={{ fontSize: 12, color: "var(--w-text-muted)" }}>{format(new Date(w.starts_at), "dd MMM yyyy, hh:mm a")}</p>
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--w-text-subtle)", background: "var(--w-icon-bg)", padding: "3px 8px", borderRadius: 6, border: "1px solid var(--w-icon-border)" }}>
          Past
        </span>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--w-text-main)", marginBottom: 10, fontFamily: "'Instrument Serif', serif" }}>
        {w.title}
      </h3>

      {w.key_takeaways && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: "var(--w-text-main)", fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
            <Sparkles className="w-3 h-3" /> Key Takeaways
          </p>
          <p
            style={{
              fontSize: 14, color: "var(--w-text-muted)", lineHeight: 1.6,
              display: "-webkit-box", WebkitLineClamp: expanded ? "unset" : 3,
              WebkitBoxOrient: "vertical", overflow: "hidden",
              whiteSpace: "pre-wrap",
            }}
          >
            {w.key_takeaways}
          </p>
          {w.key_takeaways.split("\n").length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{ fontSize: 12, color: "#a78bfa", background: "none", border: "none", padding: 0, marginTop: 4, cursor: "pointer" }}
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {w.mom_text && (
        <div style={{ background: "var(--w-icon-bg)", borderRadius: 10, padding: "12px 14px", marginBottom: 14, border: "1px solid var(--w-icon-border)" }}>
          <p style={{ fontSize: 13, color: "var(--w-text-main)", fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
            <FileText className="w-3 h-3" /> Minutes of Meeting
          </p>
          <p style={{ fontSize: 13.5, color: "var(--w-text-muted)", lineHeight: 1.6, whiteSpace: "pre-wrap", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {w.mom_text}
          </p>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {w.mom_url && (
          <a href={w.mom_url} target="_blank" rel="noreferrer">
            <GlassButton icon={<FileText className="w-3 h-3" />} label="Open MOM" small />
          </a>
        )}
        {w.recording_url && (
          <a href={w.recording_url} target="_blank" rel="noreferrer">
            <GlassButton icon={<Play className="w-3 h-3" />} label="Watch Recording" small accent />
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── Primitives ────────────────────────────────────────────────── */
function ModeBadge({ mode, small }: { mode: Webinar["session_mode"]; small?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: small ? "3px 8px" : "4px 10px",
        borderRadius: 20,
        fontSize: small ? 10.5 : 11.5,
        fontWeight: 600,
        background: modeColor(mode),
        border: `1px solid ${modeBorder(mode)}`,
        color: modeText(mode),
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {modeIcon(mode)}
      {modeLabel(mode)}
    </span>
  );
}

function MetaChip({ icon, label, small }: { icon: React.ReactNode; label: string; small?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        color: "var(--w-text-muted)",
        fontSize: small ? 12.5 : 13.5,
        fontWeight: 500,
      }}
    >
      <span style={{ color: "var(--w-text-subtle)", opacity: 0.7 }}>{icon}</span>
      {label}
    </span>
  );
}

function GlassButton({
  icon, label, accent, small,
}: {
  icon: React.ReactNode;
  label: string;
  accent?: boolean;
  small?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: small ? "7px 12px" : "9px 16px",
        borderRadius: small ? 8 : 10,
        fontSize: small ? 12 : 13,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s",
        background: accent
          ? hovered ? "rgba(139,92,246,0.25)" : "rgba(139,92,246,0.12)"
          : hovered ? "var(--w-icon-border)" : "var(--w-icon-bg)",
        border: accent
          ? "1px solid rgba(139,92,246,0.4)"
          : "1px solid var(--w-icon-border)",
        color: accent ? "var(--accent)" : "var(--w-text-muted)",
      }}
    >
      {icon}
      {label}
    </span>
  );
}

/* ─── Skeleton loader ───────────────────────────────────────────── */
function Skeleton({ h = 200 }: { h?: number }) {
  return (
    <div
      style={{
        ...glass,
        height: h,
        background: "rgba(255,255,255,0.02)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
          animation: "shimmer 1.8s infinite",
        }}
      />
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────── */
export default function StudentWebinar(props: { isDashboard?: boolean }) {
  const isDashboard = props?.isDashboard || false;
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [allWebinars, setAllWebinars] = useState<Webinar[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadWebinars = async () => {
    try {
      setLoading(true);
      const [webResponse, deptResponse] = await Promise.all([
        studentApi.getWebinars({ scope: "all", search: query || undefined }),
        studentApi.getDeptEvents()
      ]);
      
      const webs = Array.isArray(webResponse?.webinars) ? webResponse.webinars : [];
      const depts = Array.isArray(deptResponse) ? deptResponse.map((d: any) => ({
        ...d,
        starts_at: d.date,
        speaker_name: "Department Faculty",
        session_mode: d.mode || "OFFLINE",
        summary: `Departmental ${d.type} session focused on student readiness.`,
        is_dept_event: true
      })) : [];

      setAllWebinars([...webs, ...depts].sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime()));
    } catch (error) {
      console.error("Failed to load webinars", error);
      toast.error("Unable to load webinars right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWebinars(); }, []); // eslint-disable-line

  const upcoming = useMemo(
    () => allWebinars.filter((w) => new Date(w.starts_at).getTime() >= Date.now() && w.status !== "CANCELLED"),
    [allWebinars]
  );
  const past = useMemo(
    () => allWebinars.filter((w) => new Date(w.starts_at).getTime() < Date.now() && w.status !== "CANCELLED"),
    [allWebinars]
  );

  const register = async (id: number) => {
    try {
      setSubmittingId(id);
      await studentApi.registerWebinar(id);
      toast.success("Registered successfully.");
      await loadWebinars();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed.");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadWebinars();
  };

  return (
    <>
      {/* Inject fonts + keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .webinar-root * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
        .webinar-root {
          --accent: #8b5cf6;
          --accent-light: #a78bfa;
          --w-bg: #f8fafc;
          --w-text-main: #0f172a;
          --w-text-muted: #475569;
          --w-text-subtle: #64748b;
          --w-card-bg: rgba(255, 255, 255, 0.75);
          --w-card-border: rgba(139, 92, 246, 0.15);
          --w-card-border-hover: rgba(139, 92, 246, 0.35);
          --w-card-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          --w-card-shadow-hover: 0 8px 24px rgba(139, 92, 246, 0.12);
          --w-icon-bg: rgba(0, 0, 0, 0.03);
          --w-icon-border: rgba(0, 0, 0, 0.08);
          --w-online-text: #6d28d9;
          --w-hybrid-text: #0891b2;
          --w-offline-text: #d97706;
          --w-badge-online-bg: rgba(139,92,246,0.12);
          --w-badge-hybrid-bg: rgba(6,182,212,0.12);
          --w-badge-offline-bg: rgba(245,158,11,0.12);
        }
        .dark .webinar-root {
          --w-bg: #0b1120;
          --w-text-main: #f8fafc;
          --w-text-muted: rgba(226,232,240,0.92);
          --w-text-subtle: rgba(203,213,225,0.85);
          --w-card-bg: rgba(17,24,39,0.72);
          --w-card-border: rgba(255,255,255,0.07);
          --w-card-border-hover: rgba(139,92,246,0.4);
          --w-card-shadow: none;
          --w-card-shadow-hover: 0 8px 40px rgba(139,92,246,0.15), inset 0 0 0 1px rgba(139,92,246,0.1);
          --w-icon-bg: rgba(255,255,255,0.04);
          --w-icon-border: rgba(255,255,255,0.1);
          --w-online-text: #a78bfa;
          --w-hybrid-text: #67e8f9;
          --w-offline-text: #fcd34d;
          --w-badge-online-bg: rgba(139,92,246,0.18);
          --w-badge-hybrid-bg: rgba(6,182,212,0.18);
          --w-badge-offline-bg: rgba(245,158,11,0.18);
        }
      `}</style>

      <div
        className="webinar-root"
        style={{
          padding: isDashboard ? 0 : "32px 28px",
          maxWidth: isDashboard ? "100%" : 1200,
          margin: isDashboard ? 0 : "0 auto",
          minHeight: "100vh",
          background: isDashboard
            ? "transparent"
            : "radial-gradient(circle at top right, rgba(124,58,237,0.08), transparent 35%), radial-gradient(circle at bottom left, rgba(6,182,212,0.06), transparent 40%), var(--w-bg)",
          borderRadius: isDashboard ? 0 : 22,
        }}
      >
        {/* ── Page Header ── */}
        {!isDashboard && (
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 36, animation: "fadeUp 0.5s ease both" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <Video style={{ width: 22, height: 22, color: "#a78bfa" }} />
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2.5, color: "var(--accent)", textTransform: "uppercase" }}>
                  Live Learning Sessions
                </span>
              </div>
              <h1 style={{ fontSize: 44, fontWeight: 700, color: "var(--w-text-main)", lineHeight: 1.1, fontFamily: "'Instrument Serif', serif", letterSpacing: -0.8, margin: 0 }}>
                Webinars
              </h1>
              <p style={{ fontSize: 16, color: "var(--w-text-muted)", marginTop: 10 }}>
                Upcoming notices & post-session archives — never miss what matters.
              </p>
            </div>
            <ThemeToggle />
          </div>
        )}

        {/* ── Search bar ── */}
        <form
          onSubmit={handleSearch}
          style={{
            ...glass,
            padding: "20px 24px",
            marginBottom: 36,
            display: "flex",
            gap: 12,
            alignItems: "center",
            animation: "fadeUp 0.5s 0.05s ease both",
          }}
        >
          <Search style={{ width: 18, height: 18, color: "var(--w-text-subtle)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, speaker, or topic…"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontSize: 16, color: "var(--w-text-main)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 22px", borderRadius: 10, fontSize: 14, fontWeight: 700,
              background: "rgba(139,92,246,0.8)", border: "1px solid rgba(139,92,246,0.6)",
              color: "#fff", cursor: "pointer", transition: "background 0.2s",
            }}
          >
            Search
          </button>
        </form>

        {/* ── Upcoming Section ── */}
        <section style={{ marginBottom: 48, animation: "fadeUp 0.5s 0.1s ease both" }}>
          <SectionHeader
            label="Upcoming"
            count={upcoming.length}
            accent
            sublabel="Register early — seats fill fast."
          />

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              <Skeleton h={280} />
              <Skeleton h={200} />
              <Skeleton h={200} />
            </div>
          ) : upcoming.length === 0 ? (
            <EmptyState message="No upcoming webinars right now. Check back soon." />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 16,
              }}
            >
              {upcoming.map((w, i) =>
                i === 0 ? (
                  <FeaturedCard key={w.id} w={w} onRegister={register} submitting={submittingId === w.id} />
                ) : (
                  <CompactCard key={w.id} w={w} onRegister={register} submitting={submittingId === w.id} />
                )
              )}
            </div>
          )}
        </section>

        {/* ── Past Sessions Section ── */}
        <section style={{ animation: "fadeUp 0.5s 0.15s ease both" }}>
          <SectionHeader label="Past Sessions" count={past.length} sublabel="MOM, key takeaways, and recordings." />

          {loading ? null : past.length === 0 ? (
            <EmptyState message="No past sessions recorded yet." />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {past.map((w) => (
                <PastCard key={w.id} w={w} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

/* ─── Section Header ────────────────────────────────────────────── */
function SectionHeader({ label, count, sublabel, accent }: { label: string; count: number; sublabel?: string; accent?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--w-text-main)", margin: 0, fontFamily: "'Instrument Serif', serif" }}>
            {label}
          </h2>
          {count > 0 && (
            <span style={{
              fontSize: 12.5, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
              background: accent ? "rgba(139,92,246,0.15)" : "var(--w-icon-bg)",
              border: accent ? "1px solid rgba(139,92,246,0.3)" : `1px solid var(--w-icon-border)`,
              color: accent ? "var(--accent)" : "var(--w-text-muted)",
            }}>
              {count}
            </span>
          )}
        </div>
        {sublabel && <p style={{ fontSize: 14, color: "var(--w-text-subtle)", marginTop: 6 }}>{sublabel}</p>}
      </div>
    </div>
  );
}

/* ─── Empty State ───────────────────────────────────────────────── */
function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        ...glass,
        padding: "40px 24px",
        textAlign: "center",
        color: "var(--w-text-subtle)",
        fontSize: 16,
      }}
    >
      <Video style={{ width: 28, height: 28, margin: "0 auto 10px", opacity: 0.2 }} />
      {message}
    </div>
  );
}