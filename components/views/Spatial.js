"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from 'recharts';
import { Kpi, Panel, Intro, TierBadge, Callout, Signals } from '../ui';
import { Layers3, ShieldCheck, Target, BarChart3 } from 'lucide-react';
import { fmtFixed, signed, clusterColor, TIERS, tierMeta } from '../lib/derive.mjs';

const LeafletMap = dynamic(() => import('../LeafletMap'), { ssr: false, loading: () => <div className="map-loading">Memuat peta 38 provinsi…</div> });
const lerp = (a, b, t) => a + (b - a) * t;
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
function ramp(stops, t) { const x = Math.max(0, Math.min(1, t)) * (stops.length - 1); const i = Math.min(Math.floor(x), stops.length - 2); const a = hex(stops[i]), b = hex(stops[i + 1]); return `rgb(${[0, 1, 2].map((k) => Math.round(lerp(a[k], b[k], x - i))).join(',')})`; }
const SEQ = ['#f0f9e8', '#bae4bc', '#7bccc4', '#43a2ca', '#0868ac'];
const HOT = ['#fff7ec', '#fdd49e', '#fc8d59', '#d7301f', '#7f0000'];
const DIV = ['#7f0000', '#d7301f', '#f7f7f7', '#35978f', '#01665e'];

const LAYERS = [
  ['ikp', 'IKP 2025'], ['f28', 'Proyeksi IKP 2028'], ['delta', 'Perubahan 2025→2028'], ['score', 'Skor prioritas'], ['tier', 'Tingkat prioritas'], ['cluster', 'Tipologi'],
];

export default function Spatial({ model, data, selected, setSelected, go }) {
  const [layer, setLayer] = useState('tier');
  const rows = model.rows; const sel = selected && selected !== 'ALL' ? model.byKey[selected] : null;
  const vals = { ikp: (r) => r.ikp, f28: (r) => r.f28, delta: (r) => r.delta, score: (r) => r.fileScore };
  let legend = null; const styles = {};
  if (vals[layer]) {
    const v = rows.map(vals[layer]); const min = Math.min(...v), max = Math.max(...v);
    const absMax = Math.max(Math.abs(min), Math.abs(max));
    rows.forEach((r) => { const x = vals[layer](r);
      const fill = layer === 'delta' ? ramp(DIV, (x + absMax) / (2 * absMax)) : ramp(layer === 'score' ? HOT : SEQ, (x - min) / (max - min || 1));
      styles[r.name] = { fill, tip: `${LAYERS.find((l) => l[0] === layer)[1]}: ${layer === 'delta' ? signed(x) : fmtFixed(x)}<br/>Tingkat: ${r.tier}` }; });
    legend = { type: 'grad', min: layer === 'delta' ? -absMax : min, max: layer === 'delta' ? absMax : max, stops: layer === 'delta' ? DIV : layer === 'score' ? HOT : SEQ };
  } else if (layer === 'tier') {
    rows.forEach((r) => { styles[r.name] = { fill: tierMeta(r.tier).color, tip: `${r.tier} · skor ${fmtFixed(r.fileScore)}` }; }); legend = { type: 'cat', items: TIERS.map((t) => [t.id, t.color]) };
  } else {
    rows.forEach((r) => { styles[r.name] = { fill: clusterColor(r.cluster), tip: `${r.clusterName}` }; }); legend = { type: 'cat', items: model.clusters.map((c) => [`C${c.id} · ${c.name.length > 38 ? c.name.slice(0, 36) + '…' : c.name}`, clusterColor(c.id)]) };
  }
  const cfgs = Object.values(Object.fromEntries(data.clusterCompare.map((r) => [`${r.embedding}|${r.algorithm}|${r.param}|${Number(r.silhouette).toFixed(6)}`, r]))); const best = data.clusterCompare[0]; const chosen = data.clusterCompare.find((r) => r.embedding === 'UMAP_3' && r.algorithm === 'HDBSCAN' && String(r.param) === data.summary.best_clustering_param) || best;
  const bestSil = Math.max(...cfgs.map((r) => Number(r.silhouette)));
  const sens = data.sensitivity.map((r) => ({ k: `k=${r.k}`, eta: Number(r.eta_ikp_no_ikp) }));
  const topCfg = [...cfgs].sort((a, b) => Number(b.composite_score) - Number(a.composite_score)).slice(0, 8).map((r) => ({ label: `${r.embedding} + ${r.algorithm} (${r.param})`, score: Number(r.composite_score) }));
  const onSelect = (geoName) => { const r = rows.find((x) => x.name === geoName); if (r) setSelected(r.key); };
  return <>
    <Intro badge="SPATIAL INTELLIGENCE" title="Peta kondisi, arah, dan tipologi 38 provinsi">Ganti lapisan peta untuk membandingkan IKP saat ini, proyeksi, skor prioritas, dan tipologi. Klik provinsi untuk melihat ringkasannya. IKP ikut menjadi salah satu dari 19 fitur klasterisasi, sehingga validitas eksternal diuji ulang tanpa IKP.</Intro>
    <div className="kpi-grid">
      <Kpi icon={Target} label="IKP rata-rata 2025" value={fmtFixed(model.meanIkp2025)} note={`median ${fmtFixed(model.medianIkp)} · 38 provinsi`} />
      <Kpi icon={ShieldCheck} label="Eta² terhadap IKP" value={fmtFixed(data.summary.eta_squared_ikp, 3)} note={`${fmtFixed(Math.max(...sens.map((s) => s.eta)), 3)} bila IKP dikeluarkan (k=8)`} />
      <Kpi icon={BarChart3} label="Silhouette konfigurasi terpilih" value={fmtFixed(chosen.silhouette, 3)} note={`K-Means 2 klaster mencapai ${fmtFixed(bestSil, 3)} tetapi terlalu kasar`} />
      <Kpi icon={Layers3} label="Konfigurasi" value="UMAP 3 + HDBSCAN" note={`parameter ${data.summary.best_clustering_param} · ${cfgs.length} konfigurasi unik diuji`} />
    </div>
    <div className="grid-map">
      <Panel eyebrow="CHOROPLETH" title="Lapisan peta" actions={<div className="seg">{LAYERS.map(([id, l]) => <button key={id} className={layer === id ? 'on' : ''} onClick={() => setLayer(id)}>{l}</button>)}</div>} className="map-panel">
        <LeafletMap geojson={data.geo} styles={styles} selected={sel?.name} onSelect={onSelect} layerId={layer} />
        {legend?.type === 'grad' && <div className="map-legend"><span>{fmtFixed(legend.min, 1)}</span><div className="gradient" style={{ background: `linear-gradient(90deg,${legend.stops.join(',')})` }} /><span>{fmtFixed(legend.max, 1)}</span></div>}
        {legend?.type === 'cat' && <div className="legend-row wrap">{legend.items.map(([l, c]) => <span key={l}><i style={{ background: c }} />{l}</span>)}</div>}
      </Panel>
      <Panel eyebrow="PROVINSI TERPILIH" title={sel ? sel.name : 'Klik provinsi di peta'}>
        {sel ? <div className="mini-profile"><TierBadge tier={sel.tier} /><Signals r={sel} />
          <div className="stat-grid"><span>IKP 2025<b>{fmtFixed(sel.ikp)}</b></span><span>Proyeksi 2028<b>{fmtFixed(sel.f28)}</b></span><span>Perubahan<b className={sel.delta < 0 ? 'negative' : 'positive'}>{signed(sel.delta)}</b></span><span>Skor<b>{fmtFixed(sel.fileScore)}</b></span><span>Peringkat prioritas<b>#{sel.rankPs}</b></span><span>Peringkat IKP<b>#{sel.rankIkp}</b></span></div>
          <p className="muted small">{sel.clusterName}</p><button className="primary sm" onClick={() => go('province', sel.key)}>Buka profil lengkap</button></div>
          : <p className="muted">Pilih provinsi pada peta atau dari kotak pilihan di bagian atas untuk melihat ringkasan skor, proyeksi, dan tipologinya.</p>}
      </Panel>
    </div>
    <Panel eyebrow="TIPOLOGI" title="Sembilan tipologi dan satu kelompok pencilan" sub="Keanggotaan berdasarkan data 2025; rata-rata IKP dihitung dari seluruh observasi klaster 2021–2025.">
      <div className="cluster-grid">{model.clusters.map((c) => <div key={c.id} className="cluster-card" style={{ borderTopColor: clusterColor(c.id) }}>
        <div className="cluster-top"><span className="cid" style={{ background: clusterColor(c.id) }}>{c.id === -1 ? 'Noise' : `C${c.id}`}</span><strong>{fmtFixed(c.meanIkp)}</strong><small>rata-rata IKP</small></div>
        <h4>{c.name}</h4><p>{c.memberNames.join(' · ')}</p></div>)}</div>
      <Callout tone="info" title="Temuan">Papua Selatan, Tengah, dan Pegunungan (C1, IKP rata-rata {fmtFixed(model.clusters.find((c) => c.id === 1).meanIkp)}) berada pada tipologi deprivasi berlapis, sedangkan Maluku, Maluku Utara, Papua, Papua Barat, dan Papua Barat Daya (C8, {fmtFixed(model.clusters.find((c) => c.id === 8).meanIkp)}) pada tipologi keterbatasan akses. Wilayah timur bukan satu blok kerentanan; kebutuhan intervensinya berbeda.</Callout>
    </Panel>
    <section className="grid-2">
      <Panel eyebrow="VALIDITAS" title="Eta² terhadap IKP saat IKP dikeluarkan" sub="Uji sensitivitas: klasterisasi diulang tanpa fitur IKP pada k = 2 sampai 8.">
        <div className="chart-box" style={{ height: 260 }}><ResponsiveContainer width="100%" height="100%"><LineChart data={sens} margin={{ left: 0, right: 16, top: 8 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="k" tick={{ fontSize: 11 }} /><YAxis domain={[0.4, 0.9]} tick={{ fontSize: 11 }} /><Tooltip formatter={(v) => fmtFixed(v, 3)} /><ReferenceLine y={data.summary.eta_squared_ikp} stroke="#be123c" strokeDasharray="5 4" label={{ value: `Model utama ${fmtFixed(data.summary.eta_squared_ikp, 3)}`, fontSize: 10, fill: '#be123c', position: 'insideBottomRight' }} /><Line dataKey="eta" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></div>
        <p className="muted small">Asosiasi tetap kuat ({fmtFixed(Math.min(...sens.map((s) => s.eta)), 3)}–{fmtFixed(Math.max(...sens.map((s) => s.eta)), 3)}) meski IKP tidak dilibatkan. Asosiasi bukan hubungan sebab-akibat. Stabilitas klaster (Adjusted Rand Index) belum diuji.</p>
      </Panel>
      <Panel eyebrow="PEMILIHAN MODEL" title="Konfigurasi dengan composite score tertinggi" sub={`${cfgs.length} konfigurasi unik (embedding, algoritme, parameter)`}>
        <div className="chart-box" style={{ height: 260 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={topCfg} layout="vertical" margin={{ left: 8, right: 16 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" domain={[0.7, 0.95]} tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="label" width={150} tick={{ fontSize: 10 }} /><Tooltip formatter={(v) => fmtFixed(v, 3)} /><Bar dataKey="score" fill="#0f766e" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div>
      </Panel>
    </section>
  </>;
}
