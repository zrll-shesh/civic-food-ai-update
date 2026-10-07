// Lapisan turunan: semua angka dihitung dari artefak analisis di /public/data (tanpa angka yang ditulis tangan).
export const IKP = 'Indeks Ketahanan Pangan';
export const DEFAULT_W = { R: 45, D: 30, U: 15, P: 10 };

export const TIERS = [
  { id: 'Immediate Attention', short: 'Immediate', color: '#b91c1c', soft: '#fee2e2', order: 0,
    action: 'Masukan untuk penajaman wilayah Prioritas 1 pada FSVA dan verifikasi lapangan terlebih dahulu.' },
  { id: 'Elevated Watch', short: 'Elevated', color: '#c2610c', soft: '#ffedd5', order: 1,
    action: 'Dasar penentuan lokasi Gerakan Pangan Murah yang lebih terarah dan pemantauan triwulanan.' },
  { id: 'Monitoring', short: 'Monitoring', color: '#0369a1', soft: '#e0f2fe', order: 2,
    action: 'Pantau berkala; tinjau ulang saat data IKP resmi tahun berikutnya terbit.' },
  { id: 'Stable Monitoring', short: 'Stable', color: '#15803d', soft: '#dcfce7', order: 3,
    action: 'Cukup dipantau rutin tanpa alokasi sumber daya intervensi khusus.' },
];
export const tierMeta = (id) => TIERS.find((t) => t.id === id) || TIERS[3];

export const CLUSTER_COLORS = ['#0f766e', '#be123c', '#1d4ed8', '#b45309', '#6d28d9', '#0e7490', '#4d7c0f', '#a21caf', '#c2410c', '#475569'];
export const clusterColor = (c) => (Number(c) === -1 ? '#94a3b8' : CLUSTER_COLORS[Number(c) % CLUSTER_COLORS.length]);

export const fmt = (n, d = 2) => (Number.isFinite(Number(n)) && n !== null && n !== '' ? Number(n).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: d }) : '—');
export const fmtFixed = (n, d = 2) => (Number.isFinite(Number(n)) ? Number(n).toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d }) : '—');
export const signed = (n, d = 2) => (Number.isFinite(Number(n)) ? `${Number(n) > 0 ? '+' : Number(n) < 0 ? '−' : ''}${fmtFixed(Math.abs(Number(n)), d)}` : '—');

export function quantile(values, q) {
  const a = [...values].sort((x, y) => x - y); const pos = (a.length - 1) * q; const lo = Math.floor(pos); const hi = Math.ceil(pos);
  return a[lo] + (a[hi] - a[lo]) * (pos - lo);
}
export const truthy = (v) => v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true';

const ALIASES = { 'KEPULAUAN RIAU': 'KEP. RIAU', 'KEPULAUAN BANGKA BELITUNG': 'KEP. BANGKA BELITUNG', 'DAERAH ISTIMEWA YOGYAKARTA': 'DI YOGYAKARTA' };
export function buildNameMap(geojson) {
  const m = {}; (geojson?.features || []).forEach((f) => { const n = f.properties.PROVINSI; const up = n.toUpperCase(); m[ALIASES[up] || up] = n; }); return m;
}
const titleCase = (s) => s.toLowerCase().replace(/\b([a-z])/g, (m) => m.toUpperCase());

export function scoreRows(rows, w = DEFAULT_W) {
  const tot = w.R + w.D + w.U + w.P || 1; const k = 100 / tot;
  const out = rows.map((r) => {
    const cR = r.R * w.R * k, cD = r.D * w.D * k, cU = r.U * w.U * k, cP = r.P * w.P * k;
    return { ...r, score: cR + cD + cU + cP, cR, cD, cU, cP };
  });
  const order = [...out].sort((a, b) => b.score - a.score);
  order.forEach((r, i) => { r.rank = i + 1; });
  return out;
}

export function buildModel(data) {
  const nameMap = buildNameMap(data.geo);
  const base = data.integrated.map((r) => ({
    key: r.Provinsi, name: nameMap[r.Provinsi] || titleCase(r.Provinsi), cluster: Number(r.cluster), clusterName: r.cluster_name,
    ikp: Number(r[IKP]), f28: Number(r.IKP_forecast), delta: Number(r.forecast_delta),
    R: Number(r.risk_level_score), D: Number(r.decline_score), U: truthy(r.underdog_signal) ? 1 : 0, P: truthy(r.paradox_signal) ? 1 : 0,
    fileScore: Number(r.priority_score),
  }));
  const scored = scoreRows(base);
  const q25 = quantile(scored.map((r) => r.fileScore), 0.25), q50 = quantile(scored.map((r) => r.fileScore), 0.5), q75 = quantile(scored.map((r) => r.fileScore), 0.75);
  const tierOf = (s) => (s > q75 ? 'Immediate Attention' : s > q50 ? 'Elevated Watch' : s > q25 ? 'Monitoring' : 'Stable Monitoring');
  const ikpOrder = [...scored].sort((a, b) => a.ikp - b.ikp);
  ikpOrder.forEach((r, i) => { r.rankIkp = i + 1; });
  const medianIkp = quantile(scored.map((r) => r.ikp), 0.5);

  // riwayat IKP dan proyeksi per provinsi
  const hist = {}; data.clusterAssign.forEach((r) => { (hist[r.Provinsi] ||= {})[Number(r.Tahun)] = Number(r[IKP]); });
  const fcast = {}; data.forecast.forEach((r) => { (fcast[r.Provinsi] ||= {})[Number(r.Tahun)] = Number(r.IKP_forecast); });
  const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];
  const national = years.map((y) => { const v = scored.map((r) => (y <= 2025 ? hist[r.key]?.[y] : fcast[r.key]?.[y])).filter(Number.isFinite); return { year: y, value: v.reduce((a, b) => a + b, 0) / v.length, forecast: y > 2025 }; });
  const series = (key) => years.map((y) => ({ year: y, value: y <= 2025 ? hist[key]?.[y] : fcast[key]?.[y], forecast: y > 2025 }));

  scored.forEach((r) => {
    r.tier = tierOf(r.fileScore); r.rankPs = r.rank; r.shift = r.rankIkp - r.rankPs; r.aboveMedian = r.ikp >= medianIkp;
    r.sens = data.derived.sensitivity[r.key];
  });
  const byKey = Object.fromEntries(scored.map((r) => [r.key, r]));

  // klaster (keanggotaan tahun terakhir = 2025)
  const latestYear = Math.max(...data.clusterAssign.map((r) => Number(r.Tahun)));
  const clusterMap = {};
  data.clusterAssign.filter((r) => Number(r.Tahun) === latestYear).forEach((r) => { (clusterMap[r.cluster] ||= { id: Number(r.cluster), name: r.cluster_name, members: [] }).members.push(r.Provinsi); });
  const profile = Object.fromEntries(data.clusters.map((c) => [Number(c.cluster), Number(c[IKP])]));
  const clusters = Object.values(clusterMap).map((c) => ({ ...c, meanIkp: profile[c.id], n2025: c.members.length, memberNames: c.members.map((m) => byKey[m]?.name || m) }))
    .sort((a, b) => b.meanIkp - a.meanIkp);

  const tierCounts = TIERS.map((t) => ({ ...t, count: scored.filter((r) => r.tier === t.id).length }));
  return { rows: scored, byKey, q: { q25, q50, q75 }, medianIkp, national, series, years, clusters, tierCounts, nameMap, latestYear,
    meanIkp2025: scored.reduce((a, r) => a + r.ikp, 0) / scored.length };
}

export function explain(r, model) {
  const comps = [['tingkat IKP 2025 yang rendah', r.cR], ['proyeksi penurunan IKP', r.cD], ['status underdog', r.cU], ['status paradox', r.cP]].sort((a, b) => b[1] - a[1]);
  const sigs = [];
  if (r.U) sigs.push('underdog (IKP di bawah median nasional tetapi di atas rata-rata kelompok sejenis)');
  if (r.P) sigs.push('paradox (IKP di atas median nasional tetapi di bawah rata-rata kelompok sejenis)');
  const dir = r.delta < -0.05 ? `diproyeksikan turun ${fmtFixed(Math.abs(r.delta))} poin` : r.delta > 0.05 ? `diproyeksikan naik ${fmtFixed(r.delta)} poin` : 'diproyeksikan relatif datar';
  const lines = [
    `IKP 2025 ${fmtFixed(r.ikp)} (peringkat ${r.rankIkp} dari 38 dari IKP terendah; ${r.aboveMedian ? 'di atas' : 'di bawah'} median nasional ${fmtFixed(model.medianIkp)}), ${dir} menjadi ${fmtFixed(r.f28)} pada 2028.`,
    `Skor prioritas ${fmtFixed(r.fileScore)} menempatkan provinsi ini di peringkat ${r.rankPs} dan tingkat ${r.tier}. Kontribusi terbesar berasal dari ${comps[0][0]} (${fmtFixed(comps[0][1], 1)} poin).`,
  ];
  if (sigs.length) lines.push(`Sinyal pembanding: ${sigs.join('; ')}.`);
  if (r.shift >= 8) lines.push(`Peringkatnya naik ${r.shift} posisi dibanding bila hanya memakai IKP: arah proyeksi dan posisi terhadap kelompok sejenis mengubah gambaran yang tampak dari IKP saja.`);
  else if (r.shift <= -8) lines.push(`Peringkatnya turun ${Math.abs(r.shift)} posisi dibanding bila hanya memakai IKP karena proyeksi membaik; perlu kehati-hatian karena proyeksi berbasis data lima tahun.`);
  return lines;
}

export function toCsv(rows, cols) {
  const esc = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return [cols.map((c) => esc(c.h)).join(','), ...rows.map((r) => cols.map((c) => esc(c.v(r))).join(','))].join('\n');
}
export function downloadText(name, text, mime = 'text/csv') {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` }); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 500);
}
