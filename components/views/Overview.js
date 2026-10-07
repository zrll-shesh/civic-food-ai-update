"use client";
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowUpRight, Layers3, Map, MessageSquare, ShieldCheck, Target } from 'lucide-react';
import { Kpi, Panel, TierBadge, Signals, Callout, ShiftChip } from '../ui';
import { fmt, fmtFixed, signed, TIERS } from '../lib/derive.mjs';

export default function Overview({ model, data, go }) {
  const { rows, tierCounts, q } = model; const d = data.derived; const s = data.summary;
  const top = [...rows].sort((a, b) => a.rankPs - b.rankPs).slice(0, 8);
  const movers = [...rows].sort((a, b) => b.shift - a.shift); const shiftData = [...movers.slice(0, 6), ...movers.slice(-6).reverse()].map((r) => ({ name: r.name, shift: r.shift, key: r.key }));
  const naive = data.forecastModels.find((m) => m.model === 'Naive Lag-1'); const tuned = data.forecastModels.find((m) => m.model === 'XGBoost Tuned'); const base = data.forecastModels.find((m) => m.model === 'XGBoost Baseline');
  const maxMape = Math.max(...data.forecastModels.map((m) => Number(m['MAPE (%)'])));
  const ntb = model.byKey['NUSA TENGGARA BARAT'];
  const pctOf = (n) => (n / rows.length) * 100;
  return <>
    <section className="hero">
      <div>
        <span className="badge dark">DECISION SUPPORT SYSTEM · KETAHANAN PANGAN</span>
        <h2>IKP menjawab <em>seberapa rawan</em>. CIVIC-FOOD AI menambah <em>ke mana arahnya</em>, <em>setipe dengan siapa</em>, dan <em>apa kata warga</em>.</h2>
        <p>Lapisan triase di atas Indeks Ketahanan Pangan untuk Badan Pangan Nasional, Bappenas, dan pemerintah daerah: tipologi wilayah, proyeksi IKP 2026–2028 yang dapat dijelaskan, dan konteks suara publik dipadukan menjadi prioritas yang dapat ditelusuri. Bukan pengganti IKP dan bukan keputusan otomatis.</p>
        <div className="hero-actions"><button className="primary" onClick={() => go('decision')}>Buka prioritas intervensi <ArrowUpRight size={17} /></button><button className="secondary" onClick={() => go('province', 'NUSA TENGGARA BARAT')}>Lihat studi kasus NTB</button></div>
      </div>
      <div className="hero-score">
        <span>Transparansi model · MAPE validasi 2025</span>
        <div className="mape-row"><b>XGBoost Tuned</b><strong>{fmtFixed(tuned['MAPE (%)'])}%</strong></div>
        <div className="mape-row alt"><b>Baseline naif (lag-1)</b><strong>{fmtFixed(naive['MAPE (%)'])}%</strong></div>
        <small>Baseline naif lebih akurat untuk satu langkah, tetapi tidak menghasilkan sinyal arah maupun penjelasan. Proyeksi diperlakukan sebagai sinyal untuk diperiksa.</small>
      </div>
    </section>

    <div className="kpi-grid">
      <Kpi icon={Map} label="Provinsi dianalisis" value={s.n_provinces} note={`${s.n_panel_rows} observasi panel · ${s.years[0]}–${s.years[s.years.length - 1]}`} />
      <Kpi icon={Layers3} label="Tipologi wilayah" value={`${s.cluster_count - 1} + 1`} note="9 tipologi dan 1 kelompok pencilan" />
      <Kpi icon={Target} label="Immediate Attention" value={tierCounts[0].count} note={`skor di atas ${fmtFixed(q.q75)} (kuartil ke-3)`} tone="danger" />
      <Kpi icon={ShieldCheck} label="Konkordansi dengan IKP" value={`${d.concordance.overlap_top10}/10`} note={`10 prioritas teratas sama dengan 10 IKP terendah · Spearman ${fmtFixed(d.concordance.spearman)}`} />
      <Kpi icon={MessageSquare} label="Unggahan publik" value={s.n_nlp_tweets.toLocaleString('id-ID')} note={`potret ${d.voice.days} hari (18 Des 2025–1 Jan 2026)`} />
    </div>

    <section className="grid-2">
      <Panel eyebrow="TEMUAN UTAMA" title="Di mana sistem berbeda dari IKP" sub="Pergeseran peringkat: peringkat IKP terendah dikurangi peringkat prioritas. Positif = naik prioritas.">
        <div className="chart-box" style={{ height: 340 }}>
          <ResponsiveContainer width="100%" height="100%"><BarChart data={shiftData} layout="vertical" margin={{ left: 8, right: 24 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
            <ReferenceLine x={0} stroke="#334155" />
            <Tooltip formatter={(v) => [`${v > 0 ? '+' : ''}${v} peringkat`, 'Pergeseran']} />
            <Bar dataKey="shift" radius={3} onClick={(e) => go('province', e.key)} cursor="pointer">{shiftData.map((r) => <Cell key={r.key} fill={r.shift >= 0 ? '#b91c1c' : '#0f766e'} />)}</Bar>
          </BarChart></ResponsiveContainer>
        </div>
        <Callout tone="info" title="Cara membaca">Di ujung paling rentan, sistem sejalan dengan IKP (9 dari 10 sama). Perbedaan muncul pada provinsi yang arahnya berlawanan dengan kondisinya, misalnya <b>{ntb.name}</b> (IKP {fmtFixed(ntb.ikp)}, peringkat IKP {ntb.rankIkp} → prioritas {ntb.rankPs}, proyeksi {signed(ntb.delta)} poin). Klik batang untuk membuka profil provinsi.</Callout>
      </Panel>

      <Panel eyebrow="SIGNAL BOARD" title="Prioritas tertinggi" actions={<button className="text-btn" onClick={() => go('decision')}>Lihat semua <ArrowUpRight size={14} /></button>}>
        <div className="priority-list">{top.map((r) => <div className="priority-row" key={r.key} onClick={() => go('province', r.key)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && go('province', r.key)}>
          <span className="rank">{String(r.rankPs).padStart(2, '0')}</span>
          <div className="priority-main"><strong>{r.name}</strong><small>{r.clusterName}</small></div>
          <ShiftChip shift={r.shift} /><Signals r={r} /><strong className="score">{fmtFixed(r.fileScore)}</strong>
        </div>)}</div>
      </Panel>
    </section>

    <section className="grid-2">
      <Panel eyebrow="TINGKAT PRIORITAS" title="Sebaran 38 provinsi berdasarkan kuartil skor" sub="Pembagian bersifat relatif: selalu menandai sekitar seperempat provinsi pada tingkat teratas.">
        <div className="tier-bar">{tierCounts.map((t) => <div key={t.id} style={{ width: `${pctOf(t.count)}%`, background: t.color }} title={`${t.id}: ${t.count}`}>{t.count}</div>)}</div>
        <div className="tier-list">{tierCounts.map((t, i) => <div key={t.id} className="tier-item"><TierBadge tier={t.id} /><span>{t.count} provinsi</span><small>{i === 0 ? `skor > ${fmtFixed(q.q75)}` : i === 1 ? `${fmtFixed(q.q50)} – ${fmtFixed(q.q75)}` : i === 2 ? `${fmtFixed(q.q25)} – ${fmtFixed(q.q50)}` : `≤ ${fmtFixed(q.q25)}`}</small></div>)}</div>
        <p className="muted">{tierCounts[0].count} provinsi teratas: {rows.filter((r) => r.tier === 'Immediate Attention').sort((a, b) => a.rankPs - b.rankPs).map((r) => r.name).join(', ')}.</p>
      </Panel>
      <Panel eyebrow="ARSITEKTUR" title="Empat lapisan yang saling mengunci">
        <div className="architecture">{[['01', 'Tipologi struktural', 'UMAP + HDBSCAN', 'Profil wilayah dari 19 fitur; kelompok sejenis menjadi pembanding.'], ['02', 'Analitik prediktif', 'XGBoost + SHAP', 'Proyeksi IKP 2026–2028 dan penjelasan fitur penentu.'], ['03', 'Suara publik', 'BERTopic + IndoBERT', 'Topik dan emosi percakapan sebagai konteks, tidak masuk ke skor.'], ['04', 'Fusi bukti', 'Decision Support Score', 'Risiko IKP, arah proyeksi, underdog, dan paradox menjadi tingkat prioritas.']].map((x) => <div className="arch-card" key={x[0]}><span>{x[0]}</span><h4>{x[1]}</h4><b>{x[2]}</b><p>{x[3]}</p></div>)}</div>
      </Panel>
    </section>
  </>;
}
