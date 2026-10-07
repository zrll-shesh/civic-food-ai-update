"use client";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link2, Printer } from 'lucide-react';
import { Panel, Kpi, TierBadge, Signals, Callout, StackBar, StackLegend, ProvincePicker, ShiftChip } from '../ui';
import { explain, fmtFixed, signed, tierMeta, clusterColor } from '../lib/derive.mjs';

export default function Province({ model, data, selected, setSelected, go }) {
  const key = selected && selected !== 'ALL' ? selected : 'NUSA TENGGARA BARAT';
  const r = model.byKey[key]; if (!r) return null;
  const tier = tierMeta(r.tier); const sens = r.sens; const flat = data.derived.flat_forecast.find((f) => f.provinces.includes(r.key));
  const peers = model.rows.filter((x) => x.cluster === r.cluster && x.key !== r.key).sort((a, b) => a.rankPs - b.rankPs);
  const own = model.series(r.key); const nat = model.national;
  const chart = model.years.map((y, i) => ({ year: y, prov: own[i].forecast ? null : own[i].value, provF: y >= 2025 ? own[i].value : null, nat: nat[i].forecast ? null : nat[i].value, natF: y >= 2025 ? nat[i].value : null }));
  const copy = () => { const u = `${location.origin}${location.pathname}#/province/${encodeURIComponent(r.key)}`; navigator.clipboard?.writeText(u); };
  return <div className="profile">
    <div className="profile-bar no-print">
      <ProvincePicker model={model} value={r.key} onChange={(v) => setSelected(v)} all={false} />
      <div className="row-gap"><button className="secondary light" onClick={copy}><Link2 size={15} /> Salin tautan</button><button className="secondary light" onClick={() => window.print()}><Printer size={15} /> Cetak ringkasan</button></div>
    </div>
    <section className="profile-hero" style={{ borderColor: tier.color }}>
      <div>
        <span className="eyebrow">RINGKASAN PROVINSI · {model.latestYear}</span>
        <h2>{r.name}</h2>
        <p className="muted"><i className="dot" style={{ background: clusterColor(r.cluster) }} /> {r.clusterName}</p>
        <div className="row-gap wrap"><TierBadge tier={r.tier} /><Signals r={r} /><ShiftChip shift={r.shift} /><small className="muted">dibanding peringkat IKP saja</small></div>
      </div>
      <div className="profile-score"><small>Skor prioritas</small><b>{fmtFixed(r.fileScore)}</b><span>peringkat {r.rankPs} dari 38</span></div>
    </section>

    <div className="kpi-grid">
      <Kpi label="IKP 2025" value={fmtFixed(r.ikp)} note={`peringkat ${r.rankIkp} dari IKP terendah · median nasional ${fmtFixed(model.medianIkp)}`} />
      <Kpi label="Proyeksi 2028" value={fmtFixed(r.f28)} note={`${signed(r.delta)} poin dari 2025`} tone={r.delta < -2 ? 'danger' : ''} />
      <Kpi label="Peringkat prioritas" value={`#${r.rankPs}`} note={`peringkat IKP saja #${r.rankIkp}`} />
      <Kpi label="Stabilitas peringkat" value={`${fmtFixed(sens.top10_pct, 0)}%`} note={`masuk 10 besar pada ${data.derived.sensitivity_params.n.toLocaleString('id-ID')} skenario bobot ±30%`} />
    </div>

    <section className="grid-2">
      <Panel eyebrow="MENGAPA PROVINSI INI?" title="Penjelasan skor">
        <ul className="why">{explain(r, model).map((t, i) => <li key={i}>{t}</li>)}</ul>
        <div className="decomp"><div className="decomp-head"><b>Komposisi skor {fmtFixed(r.fileScore)}</b><small>R×45 + D×30 + U×15 + P×10</small></div><StackBar r={r} w={16} scale={Math.max(r.fileScore, 1)} /><StackLegend />
          <div className="decomp-grid"><span>Risiko IKP<b>{fmtFixed(r.cR, 1)}</b></span><span>Penurunan proyeksi<b>{fmtFixed(r.cD, 1)}</b></span><span>Underdog<b>{fmtFixed(r.cU, 1)}</b></span><span>Paradox<b>{fmtFixed(r.cP, 1)}</b></span></div></div>
        {r.P ? <Callout tone="info" title="Uji ketahanan">Tanpa bonus paradox, skor {fmtFixed(sens.no_paradox_score)} dan peringkat {sens.no_paradox_rank}. Pada simulasi bobot ±30%, peringkat berkisar {sens.rank_min}–{sens.rank_max} (median {sens.rank_median}).</Callout> : <Callout tone="info" title="Uji ketahanan">Pada simulasi bobot ±30%, peringkat berkisar {sens.rank_min}–{sens.rank_max} (median {sens.rank_median}); masuk 5 besar pada {fmtFixed(sens.top5_pct, 0)}% skenario.</Callout>}
        {flat && <Callout tone="warn" title="Catatan kualitas proyeksi">Proyeksi 2028 provinsi ini identik ({fmtFixed(flat.value)}) dengan {flat.provinces.length - 1} provinsi lain: model berbasis pohon cenderung menghasilkan proyeksi mendatar. Baca sebagai sinyal kasar.</Callout>}
      </Panel>

      <Panel eyebrow="LINTASAN" title="IKP 2021–2028 dibanding rata-rata nasional" sub="Garis putus-putus = proyeksi (validasi satu langkah, 2025).">
        <div className="chart-box" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%"><LineChart data={chart} margin={{ left: 0, right: 16, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => fmtFixed(v)} /><Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={2025} stroke="#94a3b8" strokeDasharray="4 4" />
            <Line name={`${r.name} (aktual)`} dataKey="prov" stroke="#0f766e" strokeWidth={3} dot={{ r: 3 }} connectNulls={false} />
            <Line name={`${r.name} (proyeksi)`} dataKey="provF" stroke="#0f766e" strokeWidth={3} strokeDasharray="6 4" dot={{ r: 3, fill: '#fff' }} legendType="plainline" />
            <Line name="Rata-rata nasional (aktual)" dataKey="nat" stroke="#64748b" strokeWidth={2} dot={{ r: 2 }} />
            <Line name="Rata-rata nasional (proyeksi)" dataKey="natF" stroke="#64748b" strokeWidth={2} strokeDasharray="6 4" dot={false} legendType="plainline" />
          </LineChart></ResponsiveContainer>
        </div>
      </Panel>
    </section>

    <section className="grid-2">
      <Panel eyebrow="KELOMPOK SEJENIS" title={`Pembanding dalam tipologi yang sama (${peers.length + 1} provinsi)`} sub={r.clusterName}>
        <div className="table-wrap"><table><thead><tr><th>Provinsi</th><th>IKP</th><th>Δ 2025–28</th><th>Tingkat</th><th>#</th></tr></thead><tbody>
          <tr className="highlight"><td><strong>{r.name}</strong></td><td>{fmtFixed(r.ikp)}</td><td className={r.delta < 0 ? 'negative' : 'positive'}>{signed(r.delta)}</td><td><TierBadge tier={r.tier} /></td><td>{r.rankPs}</td></tr>
          {peers.map((p) => <tr key={p.key} className="clickable" onClick={() => go('province', p.key)}><td>{p.name}</td><td>{fmtFixed(p.ikp)}</td><td className={p.delta < 0 ? 'negative' : 'positive'}>{signed(p.delta)}</td><td><TierBadge tier={p.tier} /></td><td>{p.rankPs}</td></tr>)}
        </tbody></table></div>
      </Panel>
      <Panel eyebrow="TINDAK LANJUT" title="Arah penggunaan untuk pembuat kebijakan">
        <div className="action-card" style={{ borderColor: tier.color, background: tier.soft }}><TierBadge tier={r.tier} /><p>{tier.action}</p></div>
        <Callout tone="warn" title="Bukan vonis">Tingkat prioritas adalah sinyal untuk diperiksa bersama dinas pangan daerah dan data lapangan. Proyeksi berbasis data panel lima tahun dan baru divalidasi satu langkah; sinyal suara publik tidak dibagi per provinsi.</Callout>
        <p className="muted small">Dibuat otomatis dari artefak analisis CIVIC-FOOD AI. Sumber data: BPS dan Badan Pangan Nasional (2021–2025).</p>
      </Panel>
    </section>
  </div>;
}
