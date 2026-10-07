"use client";
import { useState } from 'react';
import { Info } from 'lucide-react';
import { tierMeta, fmtFixed } from './lib/derive.mjs';

export function Kpi({ icon: Icon, label, value, note, tone }) {
  return <div className={`kpi ${tone || ''}`}><div className="kpi-top"><span>{label}</span>{Icon && <div className="kpi-icon"><Icon size={16} /></div>}</div><strong>{value}</strong><small>{note}</small></div>;
}
export function Panel({ eyebrow, title, sub, actions, children, className = '' }) {
  return <section className={`panel ${className}`}>{(title || eyebrow) && <div className="panel-head"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}{title && <h3>{title}</h3>}{sub && <small className="sub">{sub}</small>}</div>{actions && <div className="panel-actions">{actions}</div>}</div>}{children}</section>;
}
export function Intro({ badge, title, children }) {
  return <section className="section-intro"><span className="badge">{badge}</span><h2>{title}</h2><p>{children}</p></section>;
}
export function TierBadge({ tier }) { const t = tierMeta(tier); return <span className="tier" style={{ background: t.soft, color: t.color, borderColor: t.color + '55' }}>{t.id}</span>; }
export function Signals({ r }) {
  return <div className="signal-stack">{r.U ? <span className="pill amber" title="IKP di bawah median nasional tetapi di atas rata-rata kelompok sejenis">UNDERDOG</span> : null}{r.P ? <span className="pill violet" title="IKP di atas median nasional tetapi di bawah rata-rata kelompok sejenis">PARADOX</span> : null}{!r.U && !r.P ? <span className="pill slate">—</span> : null}</div>;
}
export function Callout({ tone = 'info', title, children }) { return <div className={`callout ${tone}`}>{title && <strong>{title}</strong>}<div>{children}</div></div>; }
export function Tip({ children }) {
  const [open, setOpen] = useState(false);
  return <span className="tip"><button type="button" aria-label="Penjelasan" onClick={() => setOpen(!open)} onBlur={() => setOpen(false)}><Info size={13} /></button>{open && <span className="tip-body" role="note">{children}</span>}</span>;
}
export function ShiftChip({ shift }) {
  if (!shift) return <span className="shift zero">0</span>;
  return <span className={`shift ${shift > 0 ? 'up' : 'down'}`}>{shift > 0 ? '▲' : '▼'} {Math.abs(shift)}</span>;
}
export function StackBar({ r, w = 8, scale = 100 }) {
  const parts = [['R', r.cR, '#0f766e', 'Risiko IKP'], ['D', r.cD, '#b91c1c', 'Penurunan proyeksi'], ['U', r.cU, '#c2610c', 'Underdog'], ['P', r.cP, '#6d28d9', 'Paradox']];
  return <div className="stackbar" style={{ height: w }} title={parts.map((p) => `${p[3]}: ${fmtFixed(p[1], 1)}`).join(' · ')}>{parts.map((p) => p[1] > 0 && <i key={p[0]} style={{ width: `${(p[1] / scale) * 100}%`, background: p[2] }} />)}</div>;
}
export const StackLegend = () => <div className="legend-row"><span><i style={{ background: '#0f766e' }} />Risiko IKP (R)</span><span><i style={{ background: '#b91c1c' }} />Penurunan proyeksi (D)</span><span><i style={{ background: '#c2610c' }} />Underdog (U)</span><span><i style={{ background: '#6d28d9' }} />Paradox (P)</span></div>;
export function ProvincePicker({ model, value, onChange, all = true, label = 'Semua provinsi' }) {
  const rows = [...model.rows].sort((a, b) => a.name.localeCompare(b.name, 'id'));
  return <select aria-label="Pilih provinsi" value={value || 'ALL'} onChange={(e) => onChange(e.target.value)}>{all && <option value="ALL">{label}</option>}{rows.map((r) => <option key={r.key} value={r.key}>{r.name}</option>)}</select>;
}
export function Empty({ children }) { return <div className="empty">{children}</div>; }
