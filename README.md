# CIVIC-FOOD AI — Sistem Pendukung Keputusan Ketahanan Pangan

*Cross-sector Intelligence for Vulnerability, Impact, and Coordination – Food Artificial Intelligence.*

Lapisan triase di atas Indeks Ketahanan Pangan (IKP) untuk Badan Pangan Nasional, Bappenas, dan pemerintah daerah. IKP menjawab *seberapa rawan*; CIVIC-FOOD AI menambah *ke mana arahnya*, *setipe dengan siapa*, dan *apa kata warga*. Bukan pengganti IKP dan bukan keputusan otomatis.

## Halaman
| Halaman | Isi |
|---|---|
| Command Center | Ringkasan, pergeseran peringkat vs IKP saja, transparansi model, sebaran tingkat prioritas |
| Profil Provinsi | Penjelasan skor, komposisi, lintasan 2021–2028, pembanding sekelompok, tindak lanjut (dapat dicetak/dibagikan) |
| Spatial Intelligence | Peta enam lapisan, tipologi bernama, validitas klasterisasi |
| Predictive Analytics | Proyeksi 2026–2028, benchmark vs baseline naif, SHAP, diagnostik, kualitas proyeksi |
| Public Voice | Linimasa, volume × tekanan, topik × emosi (potret 18 Des 2025 – 1 Jan 2026) |
| Decision Support | Tingkat prioritas, simulator bobot, antrean 38 provinsi, ekspor CSV |
| Metodologi & Batasan | Rumus, definisi sinyal, sumber, keterbatasan |
| Evidence Library | 24 visual, 20 tabel, berkas sumber |

## Cara menjalankan
```bash
npm ci
npm run dev        # http://localhost:3000
npm run verify     # memeriksa angka kunci terhadap berkas hasil analisis
npm run build
```
Data turunan (kuartil, simulasi bobot seed 42, konkordansi, proyeksi mendatar, linimasa) dibuat ulang dengan `python scripts/build_derived.py` (butuh `numpy` dan `pandas`).

## Angka dan reproduksibilitas
Seluruh angka berasal dari `public/data` (identik dengan keluaran notebook) atau dihitung ulang dari komponennya; skor yang direkonstruksi identik dengan berkas hasil analisis. Hasil audit v1 → v2 ada di `docs/AUDIT_ANGKA.md`.

## Keterbatasan utama
Data panel 5 tahun; validasi satu langkah dan baseline naif lebih akurat; proyeksi mendatar pada model berbasis pohon; public voice berupa potret 15 hari dengan label emosi belum divalidasi manusia; stabilitas klaster belum diuji; bobot skor berbasis penalaran; tingkat kuartil bersifat relatif. Rincian di halaman *Metodologi & Batasan*.

## Teknologi
Next.js 14, React 18, Recharts, Leaflet/react-leaflet, Lucide. Dideploy di Vercel (`vercel.json`).
