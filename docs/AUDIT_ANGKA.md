# Audit angka dasbor CIVIC-FOOD AI (v1 → v2)

Metode: setiap berkas JSON di `public/data` dibandingkan dengan CSV asli di `public/source-data/tables` (bentuk dan nilai numerik), lalu setiap angka yang **dihitung oleh kode dasbor** diperiksa terhadap artefak analisis. Pemeriksaan ulang otomatis: `npm run verify`.

## Yang sudah benar
- 20 tabel JSON identik dengan CSV-nya; `integrated_decision_support`, `forecast_2026_2028` identik dengan berkas data.
- Metrik model, SHAP, eta², klaster, topik, dan skor prioritas yang ditampilkan langsung dari berkas sudah sesuai.

## Masalah yang ditemukan di v1 dan perbaikannya
| # | Masalah di v1 | Dampak | Perbaikan di v2 |
|---|---|---|---|
| 1 | `underdog` dan `paradox_candidate` bertipe teks `"True"/"False"` di JSON, sedangkan kode memakai `r.underdog && …`. Di JavaScript `"False"` bernilai true. | Pill UNDERDOG dan PARADOX tampil di **semua 38 provinsi**; panel "wilayah underdog/paradox" menampilkan 8 provinsi pertama tanpa penyaringan. | Sinyal dibaca dari `underdog_signal` / `paradox_signal` (0/1) melalui `truthy()`. Hasil benar: 6 underdog, 10 paradox. |
| 2 | "Model confidence 96%" dihitung sebagai 100 − MAPE. | Menyesatkan: bukan ukuran keyakinan, dan baseline naif (MAPE 2,74%) lebih baik dari XGBoost (4,02%). | Diganti panel "Transparansi model" yang menampilkan MAPE XGBoost dan baseline naif berdampingan. |
| 3 | Tingkat prioritas hanya dua nilai ("Priority"/"Monitoring"). | Tidak sama dengan empat tingkat kuartil di esai/paper. | Empat tingkat dihitung dari persentil 25/50/75 skor (10,81 / 17,77 / 33,22) → 10/9/9/10 provinsi. |
| 4 | KPI "Silhouette terbaik" memakai nilai maksimum seluruh konfigurasi (0,873, K-Means 2 klaster). | Tidak sesuai konfigurasi terpilih (UMAP 3 + HDBSCAN, 0,758). | Menampilkan 0,758 dan menjelaskan bahwa 0,873 berasal dari K-Means 2 klaster yang terlalu kasar. |
| 5 | "Public voice yearly": batang 2025 (1.658) vs 2026 (77). | Tampak seperti tren tahunan; padahal seluruh data hanya 18 Des 2025 – 1 Jan 2026 (15 hari). | Diganti linimasa harian dan banner "potret waktu, bukan tren". Lokasi unggahan tidak masuk ke skor. |
| 6 | Jumlah konfigurasi klasterisasi memakai 116 baris. | Mengandung duplikat (±93 konfigurasi unik). | Memakai konfigurasi unik. |
| 7 | Berkas NLP 2,2 MB dimuat saat pembukaan, tidak dipakai. | Pemuatan awal lambat. | Tidak dimuat; linimasa dihitung sekali di `scripts/build_derived.py`. |
| 8 | Footer/README menyebut GEMASTIK XIX dan README menulis periode tweet "2021–2026". | Tidak sesuai data dan konteks terbaru. | Footer netral; README lama diarsipkan di `docs/`. |

## Catatan keterbatasan yang kini ditampilkan di dasbor
Data lima tahun; validasi satu langkah; baseline naif lebih akurat; empat provinsi (Maluku, Maluku Utara, NTT, Papua) berproyeksi identik 55,02 pada 2028 (model berbasis pohon); label emosi belum divalidasi manusia; ARI klaster belum diuji; bobot 45/30/15/10 berbasis penalaran; kuartil bersifat relatif; sinyal underdog/paradox agak sirkuler karena IKP ikut menjadi fitur klasterisasi.

## Definisi sinyal (penting)
`underdog_signal` dan `paradox_signal` pada berkas skor dihitung dari **perbandingan terhadap rata-rata kelompok sejenis** (notebook sel 127), bukan dari arah proyeksi (sel 169). Dasbor menampilkan definisi yang benar-benar dipakai skor.
