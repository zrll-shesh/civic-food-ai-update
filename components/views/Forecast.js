"use client";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';
import { BarChart3, Target, TrendingDown, TrendingUp } from 'lucide-react';
import { Kpi, Panel, Intro, Callout, ProvincePicker } from '../ui';
import { fmtFixed, signed } from '../lib/derive.mjs';

const SHAP_LABEL = { ikp_lag2: 'IKP dua tahun sebelumnya', ikp_lag1: 'IKP satu tahun sebelumnya', ikp_delta1: 'Perubahan IKP tahun terakhir', ikp_roll2: 'Rata-rata bergerak 2 tahun', year_index: 'Indeks waktu' };

export default function Forecast({ model, data, selected, setSelected, go }) {
  const s = data.summary; const prov = selected && selected !== 'ALL' ? model.byKey[selected] : null;
  const chart = model.years.map((y, i) => { const o = { year: y, nat: model.national[i].forecast ? null : model.national[i].value, natF: y >= 2025 ? model.national[i].value : null };
    if (prov) { const v = model.series(prov.key)[i]; o.prov = v.forecast ? null : v.value; o.provF = y >= 2025 ? v.value : null; } return o; });
  const models = data.forecastModels.map((r) => ({ ...r, mape: Number(r['MAPE (%)']) })); const maxMape = Math.max(...models.map((m) => m.mape));
  const val = data.validation.map((r) => ({ name: r.Provinsi, actual: Number(r['Indeks Ketahanan Pangan']), pred: Number(r.predicted_IKP), err: Number(r.error) }));
  const worst = [...val].sort((a, b) => Math.abs(b.err) - Math.abs(a.err)).slice(0, 3);
  const shap = data.shap.map((r) => ({ feature: SHAP_LABEL[r.feature] || r.feature, raw: r.feature, impact: Number(r.mean_abs_shap) })).sort((a, b) => b.impact - a.impact);
  const gain = [...model.rows].sort((a, b) => b.delta - a.delta).slice(0, 5); const loss = [...model.rows].sort((a, b) => a.delta - b.delta).slice(0, 5);
  const naive = models.find((m) => m.model === 'Naive Lag-1'); const tuned = models.find((m) => m.model === 'XGBoost Tuned');
  const flat = data.derived.flat_forecast;
  return <>
    <Intro badge="PREDICTIVE ANALYTICS" title="Proyeksi IKP 2026–2028 dan faktor penentunya">Model XGBoost memproyeksikan IKP tiap provinsi dari riwayat dua tahun terakhir; SHAP menguraikan fitur yang mendorong hasilnya. Validasi hanya satu langkah (2025) pada 38 provinsi, dan pembanding naif ditampilkan apa adanya agar keunggulan model tidak dilebih-lebihkan.</Intro>
    <div className="kpi-grid">
      <Kpi icon={Target} label="RMSE" value={fmtFixed(s.forecast_rmse)} note="validasi 2025" /><Kpi icon={TrendingDown} label="MAE" value={fmtFixed(s.forecast_mae)} note="validasi 2025" />
      <Kpi icon={BarChart3} label="MAPE" value={`${fmtFixed(s.forecast_mape_percent)}%`} note={`baseline naif ${fmtFixed(naive.mape)}%`} tone="warn" /><Kpi icon={TrendingUp} label="R²" value={fmtFixed(s.forecast_r2, 3)} note={`baseline naif ${fmtFixed(naive.R2, 3)}`} />
    </div>
    <Callout tone="warn" title="Baca dengan hati-hati">Baseline naif (menyalin IKP tahun sebelumnya) lebih akurat daripada XGBoost pada validasi ini. Nilai tambah proyeksi terletak pada sinyal arah multi-tahun dan penjelasan SHAP, bukan pada akurasi yang mengalahkan baseline. Proyeksi 2026–2028 belum divalidasi multi-tahun.</Callout>

    <section className="grid-2">
      <Panel eyebrow="LINTASAN" title={prov ? `${prov.name} dibanding rata-rata nasional` : 'Rata-rata nasional 2021–2028'} actions={<ProvincePicker model={model} value={selected} onChange={setSelected} label="Hanya nasional" />} sub="Garis putus-putus = proyeksi.">
        <div className="chart-box" style={{ height: 330 }}><ResponsiveContainer width="100%" height="100%"><LineChart data={chart} margin={{ left: 0, right: 16, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} /><Tooltip formatter={(v) => fmtFixed(v)} /><Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine x={2025} stroke="#94a3b8" strokeDasharray="4 4" />
          <Line name="Nasional (aktual)" dataKey="nat" stroke="#64748b" strokeWidth={2.5} dot={{ r: 3 }} />
          <Line name="Nasional (proyeksi)" dataKey="natF" stroke="#64748b" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3, fill: '#fff' }} legendType="plainline" />
          {prov && <Line name={`${prov.name} (aktual)`} dataKey="prov" stroke="#0f766e" strokeWidth={3} dot={{ r: 3 }} />}
          {prov && <Line name={`${prov.name} (proyeksi)`} dataKey="provF" stroke="#0f766e" strokeWidth={3} strokeDasharray="6 4" dot={{ r: 3, fill: '#fff' }} legendType="plainline" />}
        </LineChart></ResponsiveContainer></div>
        <p className="muted small">Rata-rata nasional turun {fmtFixed(model.national[2].value - model.national[3].value)} poin dari 2023 ke 2024 sebelum pulih; penurunan itu dapat mencerminkan guncangan nyata maupun perubahan pengukuran, sehingga tren lebih bermakna daripada satu potret tahunan.</p>
      </Panel>
      <Panel eyebrow="BENCHMARK" title="Perbandingan model pada validasi 2025" sub="Semakin rendah MAPE, semakin baik.">
        <div className="table-wrap"><table><thead><tr><th>Model</th><th>MAE</th><th>RMSE</th><th>MAPE</th><th>R²</th></tr></thead><tbody>{models.map((r) => <tr key={r.model} className={r.model === 'XGBoost Tuned' ? 'highlight' : ''}><td>{r.model}</td><td>{fmtFixed(r.MAE)}</td><td>{fmtFixed(r.RMSE)}</td><td>{fmtFixed(r.mape)}%</td><td>{fmtFixed(r.R2, 3)}</td></tr>)}</tbody></table></div>
        <div className="hbars">{models.map((r) => <div key={r.model} className="hbar"><span>{r.model}</span><div><i style={{ width: `${(r.mape / maxMape) * 100}%`, background: r.model === 'Naive Lag-1' ? '#64748b' : r.model === 'XGBoost Tuned' ? '#0f766e' : '#94a3b8' }} /></div><b>{fmtFixed(r.mape)}%</b></div>)}</div>
        <Callout tone="info" title="Mengapa tetap memakai model">Baseline naif tidak menghasilkan sinyal arah (ia memprediksi tanpa perubahan) dan tidak dapat dijelaskan. CIVIC-FOOD AI membutuhkan keduanya untuk komponen penurunan proyeksi dan penjelasan per provinsi.</Callout>
      </Panel>
    </section>

    <section className="grid-2">
      <Panel eyebrow="XAI · SHAP" title="Fitur yang mendorong prediksi" sub="Rata-rata nilai absolut SHAP. IKP dua dan satu tahun sebelumnya mendominasi: momentum lebih menentukan daripada kondisi sesaat.">
        <div className="chart-box" style={{ height: 260 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={shap} layout="vertical" margin={{ left: 8, right: 24 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="feature" width={190} tick={{ fontSize: 11 }} /><Tooltip formatter={(v) => fmtFixed(v, 3)} /><Bar dataKey="impact" radius={[0, 5, 5, 0]}>{shap.map((r, i) => <Cell key={r.raw} fill={i < 3 ? '#1d4ed8' : '#94a3b8'} />)}</Bar></BarChart></ResponsiveContainer></div>
      </Panel>
      <Panel eyebrow="DIAGNOSTIK" title="Aktual vs prediksi (validasi 2025)" sub="Titik di dekat garis diagonal = prediksi tepat.">
        <div className="chart-box" style={{ height: 260 }}><ResponsiveContainer width="100%" height="100%"><ScatterChart margin={{ left: 0, right: 16, top: 8, bottom: 8 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" dataKey="actual" name="Aktual" domain={[30, 90]} tick={{ fontSize: 11 }} /><YAxis type="number" dataKey="pred" name="Prediksi" domain={[30, 90]} tick={{ fontSize: 11 }} /><ZAxis range={[40, 40]} /><ReferenceLine segment={[{ x: 30, y: 30 }, { x: 90, y: 90 }]} stroke="#94a3b8" strokeDasharray="5 4" /><Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => payload?.[0] ? <div className="tt"><b>{payload[0].payload.name}</b><br />Aktual {fmtFixed(payload[0].payload.actual)} · Prediksi {fmtFixed(payload[0].payload.pred)}<br />Galat {signed(payload[0].payload.err)}</div> : null} /><Scatter data={val} fill="#0f766e" /></ScatterChart></ResponsiveContainer></div>
        <p className="muted small">Galat terbesar: {worst.map((w) => `${model.byKey[w.name]?.name || w.name} (${signed(w.err)})`).join(', ')}.</p>
      </Panel>
    </section>

    <section className="grid-2">
      <Panel eyebrow="ARAH PERUBAHAN 2025→2028" title="Proyeksi naik dan turun terbesar">
        <div className="two-col">
          <div><h4 className="subh down">Turun terbesar</h4>{loss.map((r) => <div key={r.key} className="line-item" onClick={() => go('province', r.key)}><span>{r.name}</span><small>{fmtFixed(r.ikp)} → {fmtFixed(r.f28)}</small><b className="negative">{signed(r.delta)}</b></div>)}</div>
          <div><h4 className="subh up">Naik terbesar</h4>{gain.map((r) => <div key={r.key} className="line-item" onClick={() => go('province', r.key)}><span>{r.name}</span><small>{fmtFixed(r.ikp)} → {fmtFixed(r.f28)}</small><b className="positive">{signed(r.delta)}</b></div>)}</div>
        </div>
        <p className="muted small">Kenaikan besar pada provinsi ber-IKP rendah kemungkinan mencerminkan koreksi ke rata-rata dari data lima tahun, bukan jaminan perbaikan.</p>
      </Panel>
      <Panel eyebrow="KUALITAS PROYEKSI" title="Proyeksi yang mendatar">
        <p className="muted">Model berbasis pohon tidak mengekstrapolasi, sehingga beberapa provinsi memperoleh nilai proyeksi 2028 yang identik:</p>
        {flat.map((f) => <div key={f.value} className="flat-row"><b>{fmtFixed(f.value)}</b><span>{f.provinces.map((p) => model.byKey[p]?.name || p).join(' · ')}</span></div>)}
        <Callout tone="warn" title="Implikasi">Peringkat antarprovinsi yang berproyeksi identik sebaiknya tidak ditafsirkan terlalu halus. Uji model alternatif dan data lebih panjang ada di tahap 2 peta jalan.</Callout>
      </Panel>
    </section>
  </>;
}
