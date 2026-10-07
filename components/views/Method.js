"use client";
import { Panel, Intro, Callout } from '../ui';
import { fmtFixed } from '../lib/derive.mjs';

export default function Method({ model, data }) {
  const s = data.summary; const d = data.derived;
  const lim = [
    ['Data pendek', `Panel hanya ${s.years.length} tahun (${s.years[0]}–${s.years[s.years.length - 1]}) × 38 provinsi = ${s.n_panel_rows} observasi; proyeksi belum diuji multi-tahun.`],
    ['Validasi satu langkah', `Validasi hanya pada ${s.forecast_validation_year} (38 provinsi). Baseline naif lebih akurat (MAPE ${fmtFixed(data.forecastModels.find((m) => m.model === 'Naive Lag-1')['MAPE (%)'])}% vs ${fmtFixed(s.forecast_mape_percent)}%).`],
    ['Proyeksi mendatar', `Model berbasis pohon tidak mengekstrapolasi: ${d.flat_forecast.length} kelompok provinsi memperoleh nilai 2028 identik (terbesar: ${d.flat_forecast[0].provinces.length} provinsi pada ${fmtFixed(d.flat_forecast[0].value)}).`],
    ['Public voice berupa potret', `${s.n_nlp_tweets.toLocaleString('id-ID')} unggahan dalam ${d.voice.days} hari; label emosi belum divalidasi manusia; lokasi tidak andal sehingga tidak masuk skor.`],
    ['Stabilitas klaster', 'Adjusted Rand Index antarpengulangan bootstrap belum diuji (cluster_stability_ari_mean kosong pada run ini). Satu provinsi pencilan (mis. Nusa Tenggara Timur) belum bertipologi.'],
    ['Bobot berbasis penalaran', 'Bobot 45/30/15/10 ditetapkan berdasarkan penalaran (dua komponen kontinu lebih berat daripada dua sinyal biner), bukan optimasi. Uji sensitivitas tersedia pada halaman profil dan simulator.'],
    ['Tingkat prioritas bersifat relatif', 'Pembagian kuartil selalu menandai sekitar 25% provinsi sebagai prioritas tertinggi, apa pun kondisi absolutnya.'],
    ['Sinyal agak sirkuler', 'IKP menjadi salah satu dari 19 fitur klasterisasi sehingga selisih terhadap rata-rata kelompok (underdog/paradox) agak sirkuler; eta² tanpa IKP tetap kuat tetapi bukan hubungan sebab-akibat.'],
  ];
  return <>
    <Intro badge="METODOLOGI & BATASAN" title="Bagaimana angka-angka ini dihasilkan, dan apa batasnya">Halaman ini merangkum rumus, definisi, sumber data, dan keterbatasan agar setiap angka di dasbor dapat ditelusuri dan diperdebatkan.</Intro>
    <section className="grid-2">
      <Panel eyebrow="RUMUS" title="Decision Support Score">
        <div className="formula">Skor = 45·R + 30·D + 15·U + 10·P</div>
        <ul className="why"><li><b>R</b> (risiko): normalisasi min-maks terbalik atas IKP 2025; IKP lebih rendah → R lebih tinggi.</li><li><b>D</b> (penurunan): penurunan IKP hasil proyeksi 2025→2028, dinormalisasi ke [0,1].</li><li><b>U</b> (underdog, biner): IKP di bawah median nasional ({fmtFixed(model.medianIkp)}) tetapi di atas rata-rata kelompok sejenis.</li><li><b>P</b> (paradox, biner): IKP di atas median nasional tetapi di bawah rata-rata kelompok sejenis.</li></ul>
        <p className="muted small">Suara publik tidak masuk ke skor. Skor dihitung ulang dari komponen di dasbor dan identik dengan nilai pada berkas hasil analisis.</p>
      </Panel>
      <Panel eyebrow="TINGKAT" title="Empat tingkat prioritas (kuartil)">
        <div className="table-wrap"><table><thead><tr><th>Tingkat</th><th>Rentang skor</th><th>Provinsi</th></tr></thead><tbody>
          <tr><td>Immediate Attention</td><td>&gt; {fmtFixed(model.q.q75)}</td><td>{model.tierCounts[0].count}</td></tr><tr><td>Elevated Watch</td><td>{fmtFixed(model.q.q50)} – {fmtFixed(model.q.q75)}</td><td>{model.tierCounts[1].count}</td></tr>
          <tr><td>Monitoring</td><td>{fmtFixed(model.q.q25)} – {fmtFixed(model.q.q50)}</td><td>{model.tierCounts[2].count}</td></tr><tr><td>Stable Monitoring</td><td>≤ {fmtFixed(model.q.q25)}</td><td>{model.tierCounts[3].count}</td></tr></tbody></table></div>
        <p className="muted small">Ambang adalah persentil ke-25, 50, dan 75 dari sebaran skor 38 provinsi.</p>
      </Panel>
    </section>
    <section className="grid-2">
      <Panel eyebrow="PIPELINE" title="Empat lapisan analitik"><ul className="why">
        <li><b>Struktural:</b> UMAP (3 dimensi) + HDBSCAN (parameter {s.best_clustering_param}) pada 19 fitur; {s.cluster_count - 1} tipologi + 1 kelompok pencilan; eta² IKP {fmtFixed(s.eta_squared_ikp, 3)}, PoU {fmtFixed(s.eta_squared_pou, 3)}.</li>
        <li><b>Prediktif:</b> XGBoost (hasil penyetelan) dengan lag 1 dan 2, delta, dan rata-rata bergerak 2 tahun; validasi {s.forecast_validation_year}; penjelasan SHAP.</li>
        <li><b>Suara publik:</b> BERTopic (8 topik non-outlier) dan IndoBERT (5 emosi) pada {s.n_nlp_tweets.toLocaleString('id-ID')} unggahan.</li>
        <li><b>Fusi bukti:</b> skor prioritas dan tingkat kuartil.</li></ul></Panel>
      <Panel eyebrow="SUMBER DATA" title="Asal data"><ul className="why"><li>Panel provinsi 2021–2025: Badan Pusat Statistik dan Badan Pangan Nasional (22 variabel; 19 dipakai klasterisasi).</li><li>Unggahan publik: pengumpulan mandiri (Tweet Harvest), jendela {d.voice.start} sampai {d.voice.end}.</li><li>Seluruh data olahan dan CSV asli tersedia di Evidence Library.</li></ul>
        <Callout tone="info" title="Reproduksibilitas">Angka turunan (kuartil, peringkat, simulasi bobot seed 42, proyeksi mendatar) dibuat oleh <code>scripts/build_derived.py</code> dan diuji ulang terhadap berkas hasil analisis.</Callout></Panel>
    </section>
    <Panel eyebrow="KETERBATASAN" title="Hal yang harus diingat saat memakai dasbor ini">
      <div className="lim-grid">{lim.map(([t, x], i) => <div key={t} className="lim"><span>{String(i + 1).padStart(2, '0')}</span><div><b>{t}</b><p>{x}</p></div></div>)}</div>
    </Panel>
  </>;
}
