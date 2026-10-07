"use client";
import { useEffect, useState } from 'react';
import { Download, FileText, Search } from 'lucide-react';
import { Panel, Intro } from '../ui';
import { fmt } from '../lib/derive.mjs';

function DataPreview({ file }) {
  const [rows, setRows] = useState(null);
  useEffect(() => { setRows(null); fetch('/data/' + file).then((r) => r.json()).then(setRows).catch(() => setRows([])); }, [file]);
  if (!rows) return <div className="preview">Memuat tabel…</div>;
  const cols = Object.keys(rows[0] || {}).slice(0, 8);
  return <div className="preview"><div className="preview-head">Pratinjau 12 baris pertama dari {rows.length} baris (maksimal 8 kolom pertama)</div><div className="table-wrap"><table><thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.slice(0, 12).map((r, i) => <tr key={i}>{cols.map((c) => <td key={c}>{typeof r[c] === 'number' ? fmt(r[c], 3) : String(r[c] ?? '').slice(0, 60)}</td>)}</tr>)}</tbody></table></div></div>;
}

export default function Evidence({ data }) {
  const [q, setQ] = useState(''); const [table, setTable] = useState(null);
  const figs = data.figureCatalog.filter((f) => (f.title + f.file).toLowerCase().includes(q.toLowerCase()));
  const tabs = data.tableCatalog.filter((t) => (t.title + t.csv).toLowerCase().includes(q.toLowerCase()));
  const dl = [['/source-data/data/integrated_decision_support.csv', 'Integrated DSS (CSV)'], ['/source-data/data/forecast_2026_2028.csv', 'Proyeksi 2026–2028 (CSV)'], ['/source-data/data/panel_cleaned.csv', 'Panel IKP bersih (CSV)'], ['/source-data/data/public_voice_nlp_final.csv', 'Public voice NLP (CSV)'], ['/data/derived.json', 'Data turunan: sensitivitas, konkordansi, linimasa (JSON)'], ['/source-data/data/indonesia_provinces.geojson', 'GeoJSON 38 provinsi']];
  return <>
    <Intro badge="EVIDENCE LIBRARY" title="Seluruh artefak analitik terbuka untuk diaudit">Visualisasi, tabel evaluasi, dataset olahan, dan GeoJSON dari analysis run. Gunakan untuk audit, presentasi, atau reproduksi.</Intro>
    <label className="search light wide"><Search size={15} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari visual atau tabel…" /></label>
    <Panel eyebrow="FIGURES" title={`${figs.length} visual evidence`}><div className="figure-grid">{figs.map((f) => <a className="figure-card" href={`/assets/${f.file}`} target="_blank" rel="noreferrer" key={f.file}><img loading="lazy" src={`/assets/${f.file}`} alt={f.title} /><div><strong>{f.title}</strong><small>{f.file}</small></div></a>)}</div></Panel>
    <Panel eyebrow="TABLES" title={`${tabs.length} tabel analitik`}><div className="table-index">{tabs.map((t) => <button className={table === t.json ? 'data-card selected' : 'data-card'} key={t.json} onClick={() => setTable(table === t.json ? null : t.json)}><FileText size={17} /><div><strong>{t.title}</strong><small>{t.csv}</small></div></button>)}</div>{table && <DataPreview file={table} />}</Panel>
    <Panel eyebrow="DOWNLOAD" title="Berkas sumber"><div className="download-grid">{dl.map(([h, l]) => <a key={h} href={h} download>{l} <Download size={15} /></a>)}</div></Panel>
  </>;
}
