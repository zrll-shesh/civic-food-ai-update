"use client";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis, Cell, ReferenceArea } from 'recharts';
import { MessageSquare } from 'lucide-react';
import { Kpi, Panel, Intro, Callout } from '../ui';
import { fmtFixed } from '../lib/derive.mjs';

const EMO = [['anger', 'Marah', '#b91c1c'], ['fear', 'Takut', '#6d28d9'], ['sadness', 'Sedih', '#1d4ed8'], ['happy', 'Senang', '#15803d'], ['love', 'Cinta', '#be185d']];
const NOISE = (n) => /Non-Food|Outlier/i.test(n);

export default function Voice({ model, data, topic, setTopic }) {
  const d = data.derived.voice; const total = data.summary.n_nlp_tweets;
  const emoBy = Object.fromEntries(data.topics.map((r) => [r.topic_name, r]));
  const topics = data.topicPressure.map((t) => { const e = emoBy[t.topic_name] || {}; const dom = EMO.reduce((a, b) => (Number(e[a[0]]) >= Number(e[b[0]]) ? a : b)); return { name: t.topic_name, n: Number(t.tweet_count), share: Number(t.tweet_count) / total * 100, neg: Number(t.negative_share) * 100, pos: Number(t.positive_share) * 100, pressure: Number(t.pressure_score), dom, e, noise: NOISE(t.topic_name) }; }).sort((a, b) => b.pressure - a.pressure);
  const real = topics.filter((t) => !t.noise); const sel = topics.find((t) => t.name === topic);
  const daily = d.daily.map((r) => ({ date: r.date.slice(5).replace('-', '/'), disaster: r.disaster, other: r.count - r.disaster, neg: Math.round((r.negative / r.count) * 1000) / 10 }));
  const hi = real[0]; const routine = real.find((t) => t.n === Math.max(...real.map((x) => x.n)));
  return <>
    <Intro badge="PUBLIC VOICE INTELLIGENCE" title="Apa yang dibicarakan publik, dan seberapa besar tekanannya?">Lapisan ini membaca <strong>{total.toLocaleString('id-ID')} unggahan</strong> (8 topik non-outlier, 5 kelas emosi) sebagai <strong>konteks pelengkap</strong>. Ia tidak dimasukkan ke skor prioritas karena lokasi unggahan belum andal di tingkat provinsi.</Intro>
    <Callout tone="warn" title="Potret waktu, bukan tren">Seluruh unggahan dikumpulkan pada <b>{d.start.replace(' UTC', '')}</b> sampai <b>{d.end.replace(' UTC', '')} UTC</b> ({d.days} hari). Temuan di bawah menunjukkan <i>cara membaca</i> tekanan emosi, bukan perkembangan dari tahun ke tahun. Label emosi hasil pseudo-labeling dan fine-tuning IndoBERT yang belum divalidasi manusia.</Callout>
    <div className="kpi-grid">
      <Kpi icon={MessageSquare} label="Unggahan analisis" value={total.toLocaleString('id-ID')} note={`${d.days} hari pengamatan`} />
      <Kpi label="Topik terbesar" value={`${fmtFixed(routine.share, 1)}%`} note={`${routine.name} · skor tekanan ${fmtFixed(routine.pressure, 1)}`} />
      <Kpi label="Tekanan tertinggi" value={fmtFixed(hi.pressure, 1)} note={`${hi.name} · ${fmtFixed(hi.share, 1)}% volume`} tone="danger" />
      <Kpi label="Rasio volume" value={`${fmtFixed(routine.n / hi.n, 1)}×`} note="topik rutin vs topik bencana: volume besar belum tentu tekanan besar" />
    </div>

    <section className="grid-2">
      <Panel eyebrow="LINIMASA" title="Volume harian dan porsi bernada negatif" sub="Batang = jumlah unggahan; garis = % unggahan bernada negatif per hari.">
        <div className="chart-box" style={{ height: 300 }}><ResponsiveContainer width="100%" height="100%"><ComposedChart data={daily} margin={{ left: 0, right: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" tick={{ fontSize: 10 }} /><YAxis yAxisId="l" tick={{ fontSize: 11 }} /><YAxis yAxisId="r" orientation="right" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
          <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar yAxisId="l" name="Topik bencana (kelaparan)" dataKey="disaster" stackId="a" fill="#b91c1c" /><Bar yAxisId="l" name="Topik lain" dataKey="other" stackId="a" fill="#94a3b8" />
          <Line yAxisId="r" name="% negatif" dataKey="neg" stroke="#0f172a" strokeWidth={2} dot={{ r: 2 }} />
        </ComposedChart></ResponsiveContainer></div>
      </Panel>
      <Panel eyebrow="VOLUME × TEKANAN" title="Topik kecil bisa bertekanan tinggi" sub="Sumbu X = jumlah unggahan (skala log). Sumbu Y = skor tekanan (% negatif − % positif).">
        <div className="chart-box" style={{ height: 300 }}><ResponsiveContainer width="100%" height="100%"><ScatterChart margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" dataKey="n" scale="log" domain={[15, 1200]} ticks={[20, 50, 100, 200, 500, 1000]} name="Unggahan" tick={{ fontSize: 11 }} /><YAxis type="number" dataKey="pressure" domain={[0, 100]} name="Tekanan" tick={{ fontSize: 11 }} /><ZAxis range={[90, 90]} />
          <ReferenceArea x1={15} x2={600} y1={70} y2={100} fill="#fee2e2" fillOpacity={0.5} />
          <Tooltip content={({ payload }) => payload?.[0] ? <div className="tt"><b>{payload[0].payload.name}</b><br />{payload[0].payload.n} unggahan · tekanan {fmtFixed(payload[0].payload.pressure, 1)}</div> : null} />
          <Scatter data={topics} onClick={(p) => setTopic(p.name === topic ? null : p.name)}>{topics.map((t) => <Cell key={t.name} fill={t.noise ? '#cbd5e1' : t.pressure >= 70 ? '#b91c1c' : '#0f766e'} stroke={t.name === topic ? '#0f172a' : 'none'} strokeWidth={2} />)}</Scatter>
        </ScatterChart></ResponsiveContainer></div>
        <p className="muted small">Area merah muda: volume kecil, tekanan tinggi. Titik abu-abu = topik noise/outlier.</p>
      </Panel>
    </section>

    <Panel eyebrow="TOPIK × EMOSI" title="Ringkasan seluruh topik" sub="Klik baris untuk menyorot topik. Warna sel = persentase emosi dalam topik tersebut.">
      <div className="table-wrap"><table className="topic-table"><thead><tr><th>Topik</th><th>Unggahan</th><th>% negatif</th><th>Tekanan</th>{EMO.map((e) => <th key={e[0]}>{e[1]}</th>)}</tr></thead><tbody>
        {topics.map((t) => <tr key={t.name} className={`clickable ${t.name === topic ? 'highlight' : ''}`} onClick={() => setTopic(t.name === topic ? null : t.name)}>
          <td><strong>{t.name}</strong>{t.noise && <span className="pill slate">NOISE</span>}</td><td>{t.n} <small className="muted">({fmtFixed(t.share, 1)}%)</small></td><td>{fmtFixed(t.neg, 1)}%</td><td><b>{fmtFixed(t.pressure, 1)}</b></td>
          {EMO.map((e) => { const v = Number(t.e[e[0]]) || 0; return <td key={e[0]} className="heat" style={{ background: `${e[2]}${Math.round(Math.min(v, 100) / 100 * 200 + 12).toString(16).padStart(2, '0')}`, color: v > 55 ? '#fff' : '#0f172a' }}>{fmtFixed(v, 1)}%</td>; })}</tr>)}
      </tbody></table></div>
      {sel && <Callout tone="info" title={sel.name}>{sel.n} unggahan ({fmtFixed(sel.share, 1)}% korpus) · {fmtFixed(sel.neg, 1)}% bernada negatif · emosi dominan: <b>{sel.dom[1]}</b> ({fmtFixed(Number(sel.e[sel.dom[0]]), 1)}%).{sel.noise ? ' Topik ini mengandung noise non-pangan (mis. pencocokan kata kunci pada nama tempat) dan tidak diinterpretasikan.' : ''}</Callout>}
    </Panel>
    <section className="grid-2">
      <Panel eyebrow="KETERBATASAN" title="Cara memakai sinyal ini dengan benar">
        <ul className="why"><li>Cakupan {d.days} hari dan satu platform; tidak mewakili seluruh populasi.</li><li>Label emosi berasal dari pseudo-labeling lalu fine-tuning IndoBERT; template validasi manual tersedia tetapi belum diisi anotator.</li><li>Skor tekanan = proporsi negatif − proporsi positif, tanpa memasukkan volume; topik berukuran kecil lebih mudah mencapai nilai ekstrem.</li><li>Informasi lokasi unggahan belum andal sehingga sinyal tidak dibagi per provinsi dan tidak masuk ke skor prioritas.</li></ul>
      </Panel>
      <Panel eyebrow="PEMBACAAN KEBIJAKAN" title="Bagaimana digunakan">
        <Callout tone="info" title="Triangulasi, bukan pengganti">Jika lonjakan topik bertekanan tinggi bertepatan dengan sinyal penurunan pada proyeksi suatu wilayah, urgensi pemeriksaan lapangan menguat. Ketidaksesuaian antarsinyal ditandai untuk ditelaah lebih lanjut, bukan diabaikan.</Callout>
      </Panel>
    </section>
  </>;
}
