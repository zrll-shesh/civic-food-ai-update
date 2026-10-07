# Changelog

## 2.0.0
- **Perbaikan angka:** bug sinyal underdog/paradox, "model confidence", tier empat tingkat, silhouette terpilih, public voice sebagai potret waktu (lihat `docs/AUDIT_ANGKA.md`).
- **Halaman baru:** Profil Provinsi (penjelasan skor, lintasan vs nasional, pembanding sekelompok, tindak lanjut, cetak/salin tautan) dan Metodologi & Batasan.
- **Command Center:** pergeseran peringkat vs IKP saja, konkordansi, transparansi model, sebaran tier.
- **Decision Support:** kartu tier yang dapat difilter, simulator bobot, komposisi skor, geser peringkat, pencarian/urut, ekspor CSV.
- **Spatial:** enam lapisan peta (IKP, proyeksi, Δ, skor, tier, tipologi), klik provinsi, kartu tipologi bernama, grafik eta² tanpa IKP.
- **Predictive:** riwayat + proyeksi per provinsi vs nasional, aktual vs prediksi, galat terbesar, peringatan proyeksi mendatar.
- **Public Voice:** linimasa harian, volume × tekanan, heatmap topik × emosi, tanda noise.
- **Teknis:** modul per halaman, rute `#/halaman/provinsi` yang dapat dibagikan, data turunan dibuat skrip (`scripts/build_derived.py`, seed 42), `npm run verify`, gaya cetak, aksesibilitas dasar.
