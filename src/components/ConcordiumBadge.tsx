import React, { useEffect, useState } from 'react';
import { ShieldCheck, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { useThemeStore, colors } from '../store/useThemeStore';

/**
 * Live "Verified by Concordium" badge.
 *
 * BotIn is registered on the Concordium Agent Registry (CIS-8004, testnet
 * contract <12802,0>). This component queries Concordium's public badge
 * verification service on mount and renders the live result — no hard-coded
 * "verified" claim: judges can open the verify link and reproduce it.
 */
export const CONCORDIUM_BADGE = 'JyP9X278CKWoNLAFg5kVr';
export const CONCORDIUM_ACCOUNT = '2yR1ck8SshaDaK1QbjkRbafjoRtzSVJ1LSSyn23AdkWazZ4Rqh';
export const CONCORDIUM_AGENT_ID = 1190;
export const AGENT_CARD_URL = 'https://botin-7ud.pages.dev/.well-known/agent-card.json';
export const BADGE_VERIFY_URL = `https://agent-registry-mcp.concordium.com/v1/badge-check/${CONCORDIUM_BADGE}`;
export const REGISTRY_DASHBOARD_URL = 'https://testnet-agent-registry.concordium.com/dashboard.html';

type BadgeState =
  | { kind: 'checking' }
  | { kind: 'verified'; cardSha256: string | null }
  | { kind: 'onchain'; reason: string }
  | { kind: 'error'; message: string };

const fetchBadge = async (signal: AbortSignal): Promise<BadgeState> => {
  try {
    const res = await fetch(BADGE_VERIFY_URL, { signal, headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`verify service responded ${res.status}`);
    const data = await res.json();
    if (data.badge_valid) {
      return { kind: 'verified', cardSha256: data.card_sha256 ?? null };
    }
    const issue = Array.isArray(data.issues) && data.issues[0]?.message ? data.issues[0].message : 'badge not yet valid';
    return { kind: 'onchain', reason: issue };
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') throw e;
    return { kind: 'error', message: String((e as Error)?.message || e) };
  }
};

const useBadge = () => {
  const [state, setState] = useState<BadgeState>({ kind: 'checking' });
  useEffect(() => {
    const controller = new AbortController();
    let alive = true;
    fetchBadge(controller.signal)
      .then((s) => { if (alive) setState(s); })
      .catch(() => { /* aborted */ });
    return () => { alive = false; controller.abort(); };
  }, []);
  return state;
};

/** Compact chip for the sidebar profile card. */
export const ConcordiumBadgeChip: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? colors.dark : colors.light;
  const state = useBadge();

  const style =
    state.kind === 'verified'
      ? { bg: 'rgba(0, 186, 124, 0.1)', text: '#00ba7c', border: 'rgba(0, 186, 124, 0.35)' }
      : state.kind === 'onchain'
        ? { bg: 'rgba(255, 173, 31, 0.1)', text: '#ffad1f', border: 'rgba(255, 173, 31, 0.35)' }
        : { bg: theme.primaryLight, text: theme.primary, border: theme.border };

  const label =
    state.kind === 'verified' ? 'Verified by Concordium'
      : state.kind === 'onchain' ? 'Concordium · on-chain'
        : state.kind === 'checking' ? 'Verifying…'
          : 'Concordium';

  return (
    <a
      href={BADGE_VERIFY_URL}
      target="_blank"
      rel="noopener noreferrer"
      title={`Concordium Agent Registry badge ${CONCORDIUM_BADGE} — click to verify live`}
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-opacity hover:opacity-80"
      style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
    >
      {state.kind === 'checking'
        ? <Loader2 className="w-3 h-3 animate-spin" />
        : state.kind === 'verified'
          ? <ShieldCheck className="w-3 h-3" />
          : state.kind === 'error'
            ? <AlertCircle className="w-3 h-3" />
            : <ShieldCheck className="w-3 h-3" />}
      {label}
    </a>
  );
};

/** Full detail block for the Reputation/Profile view. */
export const ConcordiumIdentity: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? colors.dark : colors.light;
  const state = useBadge();

  const rows: Array<{ k: string; v: React.ReactNode }> = [
    { k: 'Registry', v: 'CIS-8004 Agent Registry · Concordium testnet' },
    { k: 'Agent ID', v: <span className="font-mono">#{CONCORDIUM_AGENT_ID} · {CONCORDIUM_BADGE}</span> },
    { k: 'Owner (Concordium ID)', v: <span className="font-mono text-[11px] break-all">{CONCORDIUM_ACCOUNT}</span> },
    { k: 'Status', v: 'Active' },
    { k: 'Agent Card', v: <a href={AGENT_CARD_URL} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] break-all" style={{ color: theme.primary }}>.well-known/agent-card.json</a> },
    {
      k: 'Verification',
      v: state.kind === 'verified'
        ? <span className="font-medium" style={{ color: '#00ba7c' }}>badge_valid: true (live)</span>
        : state.kind === 'checking'
          ? <span style={{ color: theme.textSecondary }}>checking Concordium service…</span>
          : <span style={{ color: '#ffad1f' }}>{state.kind === 'onchain' ? state.reason : state.message}</span>,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-4 h-4" style={{ color: state.kind === 'verified' ? '#00ba7c' : theme.primary }} />
        <h3 style={{ color: theme.text }} className="text-lg font-bold">Concordium On-Chain Identity</h3>
        {state.kind === 'verified' && (
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
            style={{ backgroundColor: 'rgba(0, 186, 124, 0.1)', color: '#00ba7c', borderColor: 'rgba(0, 186, 124, 0.35)' }}
          >
            Verified by Concordium
          </span>
        )}
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.k} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-1" style={{ borderBottom: `1px solid ${theme.border}` }}>
            <span className="text-xs sm:w-44 flex-shrink-0" style={{ color: theme.textSecondary }}>{row.k}</span>
            <span className="text-xs" style={{ color: theme.text }}>{row.v}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        <a href={BADGE_VERIFY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: theme.primary }}>
          Live badge verification <ExternalLink className="w-3 h-3" />
        </a>
        <a href={REGISTRY_DASHBOARD_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: theme.primary }}>
          Agent Registry dashboard <ExternalLink className="w-3 h-3" />
        </a>
        <a href="https://botin-7ud.pages.dev/tools/set-agent-uri" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: theme.primary }}>
          setAgentURI tool <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default ConcordiumBadgeChip;
