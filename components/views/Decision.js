"use client";
import { useMemo, useState } from 'react';
import { Download, RotateCcw, Search } from 'lucide-react';
import { Panel, Intro, TierBadge, Signals, Callout, StackBar, StackLegend, ShiftChip, Tip } from '../ui';
import { DEFAULT_W, TIERS, downloadText, fmtFixed, scoreRows, signed, toCsv } from '../lib/derive.mjs';

const SLIDERS = [['R', 'Risiko IKP 2025', 'Semakin rendah IKP, semakin tinggi risiko (normalisasi min-maks terbalik).'], ['D', 'Penurunan proyeksi', 'Besarnya penurunan IKP 2025→2028, dinormalisasi 0–1.'], ['U', 'Sinyal underdog', 'IKP di bawah median nasional tetapi di atas rata-rata kelompok sejenis.'], ['P', 'Sinyal paradox', 'IKP di atas median nasional tetapi di bawah rata-rata kelompok sejenis.']];

export default function Decision({ model, data, go }) {
  const [w, setW] = useState(DEFAULT_W); const [tier, setTier] = useState('ALL'); const [q, setQ] = useState(''); const [sort, setSort] = useState('rank');
  const isDefault = Object.keys(DEFAULT_W).every((k) => w[k] === DEFAULT_W[k]);
  const sim = useMemo(() => scoreRows(model.rows, w), [model, w]);
  const rows = useMemo(() => {
    let r = sim.filter((x) => (tier === 'ALL' || x.tier === tier) && x.name.toLowerCase().includes(q.toLowerCase()));
    const f = { rank: (a, b) => a.rank - b.rank, ikp: (a, b) => a.ikp - b.ikp, delta: (a, b) => a.delta - b.delta, name: (a, b) => a.name.localeCompare(b.name, 'id'), shift: (a, b) => (b.rankIkp - b.rank) - (a.rankIkp - a.rank) }[sort];
    return [...r].sort(f);
  }, [sim, tier, q, sort]);
  const moved = sim.filter((r) => r.rank !== r.rankPs).length;
  const exportCsv = () => downloadText('civic-food-ai_prioritas.csv', toCsv(rows, [
    { h: 'Peringkat', v: (r) => r.rank }, { h: 'Provinsi', v: (r) => r.name }, { h: 'Tingkat', v: (r) => r.tier }, { h: 'IKP 2025', v: (r) => r.ikp.toFixed(2) }, { h: 'Peringkat IKP saja', v: (r) => r.rankIkp },
    { h: 'Proyeksi 2028', v: (r) => r.f28.toFixed(2) }, { h: 'Delta 2025-2028', v: (r) => r.delta.toFixed(2) }, { h: 'Underdog', v: (r) => r.U }, { h: 'Paradox', v: (r) => r.P }, { h: 'Skor', v: (r) => r.score.toFixed(2) }, { h: 'Tipologi', v: (r) => r.clusterName }]));
  return <>
    <Intro badge="DECISION SUPPORT" title="Prioritas untuk penargetan intervensi">Skor prioritas = <b>R×45 + D×30 + U×15 + P×10</b> (risiko IKP, penurunan proyeksi, underdog, paradox). Ini bukan keputusan otomatis: tabel adalah daftar periksa bukti untuk analis dan pembuat kebijakan. Geser bobot untuk menguji seberapa tahan peringkat terhadap pilihan bobot.</Intro>
    <section className="tier-cards">{model.tierCounts.map((t, i) => <button key={t.id} className={`tier-card ${tier === t.id ? 'on' : ''}`} style={{ borderColor: t.color }} onClick={() => setTier(tier === t.id ? 'ALL' : t.id)}>
      <TierBadge tier={t.id} /><strong>{t.count}</strong><small>{i === 0 ? `skor > ${fmtFixed(model.q.q75)}` : i === 1 ? `${fmtFixed(model.q.q50)}–${fmtFixed(model.q.q75)}` : i === 2 ? `${fmtFixed(model.q.q25)}–${fmtFixed(model.q.q50)}` : `≤ ${fmtFixed(model.q.q25)}`}</small><p>{t.action}</p></button>)}</section>

    <Panel eyebrow="SIMULATOR BOBOT" title="Uji ketahanan peringkat" actions={<button className="secondary light" onClick={() => setW(DEFAULT_W)} disabled={isDefault}><RotateCcw size={14} /> Atur ulang</button>}
      sub="Bobot dinormalisasi otomatis ke total 100. Tingkat prioritas tetap mengikuti hasil dasar (45/30/15/10); peringkat dan skor mengikuti bobot Anda.">
      <div className="sliders">{SLIDERS.map(([k, l, tip]) => <label key={k} className="slider"><span>{l} <Tip>{tip}</Tip></span><input type="range" min="0" max="100" value={w[k]} onChange={(e) => setW({ ...w, [k]: Number(e.target.value) })} /><b>{Math.round((w[k] / (w.R + w.D + w.U + w.P || 1)) * 100)}</b></label>)}</div>
      <p className={`muted ${isDefault ? '' : 'accent'}`}>{isDefault ? 'Bobot dasar sesuai analisis. Pada 10.000 skenario bobot ±30%, perubahan peringkat dirangkum di profil tiap provinsi.' : `${moved} provinsi berubah peringkat dibanding bobot dasar. Peringkat teratas: ${[...sim].sort((a, b) => a.rank - b.rank).slice(0, 5).map((r) => r.name).join(', ')}.`}</p>
    </Panel>

    <Panel eyebrow="38 PROVINSI" title="Antrean tindak lanjut" actions={<div className="row-gap wrap">
      <label className="search light"><Search size={15} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari provinsi…" /></label>
      <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Urutkan"><option value="rank">Urut peringkat</option><option value="shift">Geser peringkat terbesar</option><option value="delta">Proyeksi turun terbesar</option><option value="ikp">IKP terendah</option><option value="name">Nama</option></select>
      <button className="secondary light" onClick={exportCsv}><Download size={14} /> CSV</button></div>}>
      <StackLegend />
      <div className="table-wrap tall"><table className="dss"><thead><tr><th>#</th><th>Provinsi</th><th>Tingkat</th><th>IKP</th><th>#IKP <Tip>Peringkat dari IKP terendah (1 = paling rendah).</Tip></th><th>Geser <Tip>Peringkat IKP − peringkat prioritas. Naik = lebih diprioritaskan daripada bila hanya melihat IKP.</Tip></th><th>2028</th><th>Δ</th><th>Sinyal</th><th>Komposisi skor</th><th>Skor</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.key} className="clickable" onClick={() => go('province', r.key)}>
          <td>{r.rank}</td><td><strong>{r.name}</strong><small className="muted block">{r.clusterName}</small></td><td><TierBadge tier={r.tier} /></td><td>{fmtFixed(r.ikp)}</td><td>{r.rankIkp}</td><td><ShiftChip shift={r.rankIkp - r.rank} /></td>
          <td>{fmtFixed(r.f28)}</td><td className={r.delta < 0 ? 'negative' : 'positive'}>{signed(r.delta)}</td><td><Signals r={r} /></td><td style={{ minWidth: 120 }}><StackBar r={r} w={9} scale={Math.max(...sim.map((x) => x.score))} /></td><td><strong>{fmtFixed(r.score)}</strong></td></tr>)}
          {!rows.length && <tr><td colSpan={11} className="empty">Tidak ada provinsi yang cocok.</td></tr>}</tbody></table></div>
    </Panel>

    <section className="grid-2">
      <Panel eyebrow="UNDERDOG" title={`${model.rows.filter((r) => r.U).length} provinsi bersinyal underdog`} sub="IKP di bawah median nasional, tetapi di atas rata-rata kelompok sejenis."><div className="signal-list">{model.rows.filter((r) => r.U).sort((a, b) => a.rankPs - b.rankPs).map((r) => <div key={r.key} className="line-item" onClick={() => go('province', r.key)}><span>{r.name}</span><small>{fmtFixed(r.ikp, 1)} → {fmtFixed(r.f28, 1)}</small><b className={r.delta < 0 ? 'negative' : 'positive'}>{signed(r.delta)}</b></div>)}</div>
        <p className="muted small">Sinyal ini berasal dari perbandingan dengan kelompok sejenis, bukan dari arah proyeksi; karena itu sebagian provinsi underdog tetap diproyeksikan turun.</p></Panel>
      <Panel eyebrow="PARADOX" title={`${model.rows.filter((r) => r.P).length} provinsi bersinyal paradox`} sub="IKP di atas median nasional, tetapi di bawah rata-rata kelompok sejenis."><div className="signal-list">{model.rows.filter((r) => r.P).sort((a, b) => a.rankPs - b.rankPs).map((r) => <div key={r.key} className="line-item" onClick={() => go('province', r.key)}><span>{r.name}</span><small>{fmtFixed(r.ikp, 1)} → {fmtFixed(r.f28, 1)}</small><b className={r.delta < 0 ? 'negative' : 'positive'}>{signed(r.delta)}</b></div>)}</div>
        <p className="muted small">Klasterisasi memakai IKP sebagai salah satu fitur, sehingga selisih terhadap rata-rata kelompok bersifat agak sirkuler dan sebaiknya dibaca sebagai petunjuk.</p></Panel>
    </section>
  </>;
}
