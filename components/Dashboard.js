"use client";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronRight, Database, Map, Menu, MessageSquare, Search, ShieldCheck, Target, TrendingUp, User, X } from 'lucide-react';
import { buildModel } from './lib/derive.mjs';
import { ProvincePicker } from './ui';
import Overview from './views/Overview';
import Province from './views/Province';
import Spatial from './views/Spatial';
import Forecast from './views/Forecast';
import Voice from './views/Voice';
import Decision from './views/Decision';
import Method from './views/Method';
import Evidence from './views/Evidence';

const FILES = [['summary', 'analysis_summary.json'], ['integrated', 'integrated_decision_support.json'], ['forecast', 'forecast_2026_2028.json'], ['topics', 'topic_emotion_matrix.json'], ['topicPressure', 'topic_pressure.json'],
  ['clusters', 'cluster_profile_mean.json'], ['clusterAssign', 'cluster_assignments.json'], ['clusterCompare', 'clustering_model_comparison.json'], ['sensitivity', 'clustering_sensitivity_no_ikp.json'], ['forecastModels', 'forecast_model_comparison.json'],
  ['shap', 'forecast_shap_importance.json'], ['validation', 'forecast_validation_predictions.json'], ['figureCatalog', 'figure_catalog.json'], ['tableCatalog', 'table_catalog.json'], ['geo', 'indonesia_provinces.geojson'], ['derived', 'derived.json']];
const NAV = [['overview', 'Command Center', Target], ['province', 'Profil Provinsi', User], ['spatial', 'Spatial Intelligence', Map], ['forecast', 'Predictive Analytics', TrendingUp], ['voice', 'Public Voice', MessageSquare], ['decision', 'Decision Support', ShieldCheck], ['method', 'Metodologi & Batasan', BookOpen], ['evidence', 'Evidence Library', Database]];

function parseHash() {
  if (typeof window === 'undefined') return ['overview', null];
  const m = window.location.hash.replace(/^#\/?/, '').split('/'); const sec = NAV.find((n) => n[0] === m[0]) ? m[0] : 'overview';
  return [sec, m[1] ? decodeURIComponent(m[1]) : null];
}

export default function Dashboard() {
  const [data, setData] = useState(null); const [error, setError] = useState(null);
  const [section, setSection] = useState('overview'); const [selected, setSelectedState] = useState('ALL');
  const [query, setQuery] = useState(''); const [topic, setTopic] = useState(null); const [mobile, setMobile] = useState(false);

  useEffect(() => {
    Promise.all(FILES.map(async ([k, f]) => { const r = await fetch('/data/' + f); if (!r.ok) throw new Error(f); return [k, await r.json()]; }))
      .then((x) => setData(Object.fromEntries(x))).catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    const apply = () => { const [s, p] = parseHash(); setSection(s); if (p) setSelectedState(p); };
    apply(); window.addEventListener('hashchange', apply); return () => window.removeEventListener('hashchange', apply);
  }, []);
  const model = useMemo(() => (data ? buildModel(data) : null), [data]);

  const go = useCallback((id, province) => {
    const prov = province || (id === 'province' ? (selected !== 'ALL' ? selected : null) : null);
    if (province) setSelectedState(province);
    window.location.hash = `/${id}${prov ? '/' + encodeURIComponent(prov) : ''}`; setMobile(false); window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selected]);
  const setSelected = useCallback((v) => { setSelectedState(v); if (section === 'province' && v !== 'ALL') window.location.hash = `/province/${encodeURIComponent(v)}`; }, [section]);

  if (error) return <div className="loading"><div className="loading-mark">!</div><h2>Gagal memuat data</h2><p>Berkas {error} tidak dapat dimuat. Muat ulang halaman.</p></div>;
  if (!model) return <div className="loading"><div className="loading-mark">CF</div><h2>Memuat CIVIC-FOOD AI</h2><p>Menyiapkan evidence, peta, proyeksi, dan suara publik.</p></div>;
  const title = NAV.find((n) => n[0] === section)[1]; const s = data.summary;
  const search = () => { const q = query.trim().toLowerCase(); const r = model.rows.find((x) => x.name.toLowerCase().includes(q)); if (r) { setQuery(''); go('province', r.key); } };
  const props = { model, data, go, selected, setSelected };
  return <div className="app">
    <a className="skip" href="#main">Lewati ke konten</a>
    <aside className={mobile ? 'sidebar open' : 'sidebar'} aria-label="Navigasi">
      <div className="brand"><div className="brand-mark">CF</div><div><div className="brand-name">CIVIC-FOOD AI</div><div className="brand-sub">Decision Support System</div></div></div>
      <div className="side-label">LAPISAN ANALITIK</div>
      {NAV.map(([id, label, Icon]) => <button key={id} className={section === id ? 'nav active' : 'nav'} onClick={() => go(id)} aria-current={section === id ? 'page' : undefined}><Icon size={18} /><span>{label}</span>{section === id && <ChevronRight size={15} className="nav-arrow" />}</button>)}
      <div className="side-foot"><div className="status-dot" /><span>Angka diverifikasi terhadap berkas hasil analisis</span></div>
    </aside>
    <main className="main" id="main">
      <header className="topbar no-print">
        <button className="mobile-menu" onClick={() => setMobile(!mobile)} aria-label="Menu">{mobile ? <X /> : <Menu />}</button>
        <div><div className="eyebrow">CIVIC-FOOD AI / {title.toUpperCase()}</div><h1>{section === 'overview' ? 'Penguatan Ketahanan Pangan Berbasis Bukti' : title}</h1></div>
        <div className="top-actions">
          <label className="search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari provinsi lalu Enter…" onKeyDown={(e) => e.key === 'Enter' && search()} aria-label="Cari provinsi" /></label>
          <ProvincePicker model={model} value={selected} onChange={(v) => (v === 'ALL' ? setSelectedState('ALL') : section === 'province' ? setSelected(v) : setSelectedState(v))} />
        </div>
      </header>
      <div className="content">
        {section === 'overview' && <Overview {...props} />}
        {section === 'province' && <Province {...props} />}
        {section === 'spatial' && <Spatial {...props} />}
        {section === 'forecast' && <Forecast {...props} />}
        {section === 'voice' && <Voice {...props} topic={topic} setTopic={setTopic} />}
        {section === 'decision' && <Decision {...props} />}
        {section === 'method' && <Method {...props} />}
        {section === 'evidence' && <Evidence {...props} />}
      </div>
      <footer className="no-print"><span>CIVIC-FOOD AI · Prototipe sistem pendukung keputusan · Hasil analisis bersifat pendukung, bukan pengganti IKP atau keputusan pemangku kebijakan</span><span>Panel {s.years[0]}–{s.years[s.years.length - 1]} · {s.n_provinces} provinsi · {s.n_panel_rows} observasi · {s.n_nlp_tweets.toLocaleString('id-ID')} unggahan ({data.derived.voice.start.slice(0, 10)} – {data.derived.voice.end.slice(0, 10)})</span></footer>
    </main>
  </div>;
}
