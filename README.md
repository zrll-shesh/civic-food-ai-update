# CIVIC-FOOD AI

**Sistem pendukung keputusan ketahanan pangan berbasis *evidence fusion* dan *explainable AI***

*Cross-sector Intelligence for Vulnerability, Impact, and Coordination – Food Artificial Intelligence*

Demo: https://civic-food-ai-foodsecurity.vercel.app/

CIVIC-FOOD AI adalah lapisan triase di atas Indeks Ketahanan Pangan (IKP) untuk Badan Pangan Nasional, Bappenas, dan pemerintah daerah. IKP menjawab *seberapa rawan* suatu provinsi. CIVIC-FOOD AI menambahkan tiga jawaban lain: *ke mana arahnya*, *setipe dengan siapa*, dan *apa kata warga*, lalu memadukannya menjadi prioritas wilayah yang dapat ditelusuri dan dijelaskan.

Sistem ini melengkapi IKP dan FSVA, bukan menggantikannya.

## Cara kerja

| Lapisan | Teknik | Keluaran |
|---|---|---|
| Struktural | UMAP + HDBSCAN | Tipologi wilayah dari 19 fitur sosial-ekonomi, pertanian, dan akses dasar |
| Prediktif | XGBoost + SHAP | Proyeksi IKP 2026–2028 beserta fitur yang mendorong hasilnya |
| Suara publik | BERTopic + IndoBERT | Topik percakapan, emosi, dan skor tekanan sebagai konteks |
| Fusi bukti | Decision Support Score | Skor dan empat tingkat prioritas per provinsi |

### Decision Support Score

```
Skor = 45·R + 30·D + 15·U + 10·P
```

- **R**: risiko IKP 2025 (normalisasi min-maks terbalik; IKP lebih rendah, risiko lebih tinggi)
- **D**: besarnya penurunan IKP hasil proyeksi 2025→2028 (dinormalisasi 0–1)
- **U** (*underdog*): IKP di bawah median nasional tetapi di atas rata-rata kelompok sejenis
- **P** (*paradox*): IKP di atas median nasional tetapi di bawah rata-rata kelompok sejenis

Suara publik berfungsi sebagai konteks triangulasi dan tidak masuk ke skor.

### Tingkat prioritas

Skor dibagi menurut kuartil menjadi empat tingkat:

| Tingkat | Rentang skor | Arah penggunaan |
|---|---|---|
| Immediate Attention | > 33,22 | Masukan penajaman wilayah Prioritas 1 pada FSVA |
| Elevated Watch | 17,77 – 33,22 | Dasar penentuan lokasi Gerakan Pangan Murah |
| Monitoring | 10,81 – 17,77 | Pemantauan berkala |
| Stable Monitoring | ≤ 10,81 | Pemantauan rutin |

## Halaman dasbor

| Halaman | Isi |
|---|---|
| Command Center | Ringkasan sistem, pergeseran peringkat dibanding IKP saja, perbandingan model, sebaran tingkat prioritas |
| Profil Provinsi | Penjelasan skor, komposisi skor, lintasan IKP 2021–2028, pembanding sekelompok, tindak lanjut; dapat dicetak dan dibagikan lewat tautan |
| Spatial Intelligence | Peta enam lapisan (IKP, proyeksi, perubahan, skor, tingkat, tipologi) dan kartu tipologi wilayah |
| Predictive Analytics | Proyeksi 2026–2028, benchmark model, SHAP, aktual vs prediksi |
| Public Voice | Linimasa unggahan, volume × tekanan, heatmap topik × emosi |
| Decision Support | Kartu tingkat prioritas, simulator bobot, antrean 38 provinsi, ekspor CSV |
| Metodologi & Batasan | Rumus, definisi sinyal, dan sumber data |
| Evidence Library | 24 visual, 20 tabel analitik, dan berkas sumber |

## Data

- **Panel provinsi 2021–2025:** Badan Pusat Statistik dan Badan Pangan Nasional (38 provinsi, 22 variabel)
- **Percakapan publik:** 1.735 unggahan terkait pangan (18 Desember 2025 – 1 Januari 2026)
- **Seluruh artefak analisis** (CSV, JSON, GeoJSON, visual) tersedia di `public/` dan dapat diunduh dari halaman Evidence Library

## Struktur proyek

```
app/                  Next.js App Router (layout, halaman, gaya)
components/
  Dashboard.js        Kerangka, navigasi, pemuatan data
  LeafletMap.js       Peta choropleth
  ui.js               Komponen bersama
  lib/derive.mjs      Perhitungan turunan: skor, tingkat, peringkat, riwayat
  views/              Satu berkas per halaman
public/
  data/               Data olahan (JSON) dan GeoJSON
  source-data/        CSV sumber dan metadata analisis
  assets/             Visual hasil analisis
scripts/
  build_derived.py    Membuat data turunan (seed tetap)
  verify_numbers.mjs  Memeriksa angka kunci terhadap berkas hasil analisis
docs/                 Dokumentasi tambahan
```

## Menjalankan

```bash
npm ci
npm run dev        # http://localhost:3000
npm run verify     # memeriksa angka kunci
npm run build      # build produksi
```

Data turunan (kuartil, simulasi bobot dengan seed 42, konkordansi peringkat, linimasa) dibuat ulang dengan:

```bash
python scripts/build_derived.py
```

Skrip ini membutuhkan `numpy` dan `pandas`.

## Teknologi

Next.js 14 · React 18 · Recharts · Leaflet / react-leaflet · Lucide · Python (pembuatan data turunan) · Vercel

## Tim

Dikembangkan oleh Nazril Ravi Pratama, Nadia Kaila, Darista Wardhani, dan dosen pendamping Ulfa Siti Nuraini, S.Stat., M.Stat. (Program Studi S1 Sains Data, Universitas Negeri Surabaya).