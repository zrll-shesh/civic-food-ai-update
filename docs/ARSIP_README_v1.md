> **ARSIP.** README versi 1. Sebagian klaim di dalamnya sudah tidak berlaku (periode tweet "2021–2026", "model confidence", tier dua tingkat, rujukan GEMASTIK). Gunakan `README.md` dan `docs/AUDIT_ANGKA.md` untuk informasi terkini.

# CIVIC-FOOD AI
## Penguatan Ketahanan Pangan Berbasis Multidimensional Decision Support System melalui Integrasi Data Spasiotemporal, Predictive Analytics, dan Public Voice Intelligence

**CIVIC-FOOD AI** adalah sistem pendukung keputusan berbasis kecerdasan buatan dan analitik multidimensional yang dirancang untuk membantu memahami, memetakan, memprediksi, dan memprioritaskan persoalan ketahanan pangan secara lebih komprehensif.

Proyek ini dibuat untuk **KTI GEMASTIK 2026**.

### Tim Pengembang

- **Nazril Ravi Pratama**, Ketua Tim
- **Nadia Kaila**, Anggota
- **Darista Wardhani**, Anggota

---

## 1. Ringkasan

Ketahanan pangan merupakan persoalan multidimensional. Kondisi suatu wilayah tidak cukup dijelaskan hanya oleh satu indikator, misalnya Indeks Ketahanan Pangan (IKP), tingkat kemiskinan, produksi pangan, atau harga pangan.

CIVIC-FOOD AI dikembangkan dengan gagasan bahwa keputusan kebijakan yang lebih baik membutuhkan integrasi beberapa perspektif sekaligus:

1. kondisi struktural wilayah;
2. dinamika spasial dan temporal;
3. kemampuan prediktif terhadap kondisi masa depan;
4. suara publik yang muncul di ruang digital;
5. hubungan antara topik pangan dan emosi publik;
6. identifikasi wilayah prioritas;
7. interpretasi model yang dapat diterjemahkan menjadi insight kebijakan.

Karena itu, sistem mengintegrasikan empat lapisan analitik utama:

- **Multidimensional Spatial Intelligence**
- **Predictive Analytics**
- **Public Voice Intelligence**
- **Decision Support**

Keempatnya tidak diposisikan sebagai analisis yang berdiri sendiri, tetapi sebagai komponen yang saling melengkapi dalam satu kerangka Decision Support System.

---

## 2. Tujuan Utama

CIVIC-FOOD AI memiliki beberapa tujuan utama.

### 2.1 Memetakan kondisi ketahanan pangan

Sistem mengidentifikasi karakteristik wilayah berdasarkan berbagai indikator sosial, ekonomi, pendidikan, ketenagakerjaan, pertanian, infrastruktur, dan ketahanan pangan.

### 2.2 Mengidentifikasi tipologi wilayah

Clustering digunakan untuk menemukan kelompok wilayah yang memiliki karakteristik struktural serupa.

Indeks Ketahanan Pangan (IKP) secara eksplisit dimasukkan sebagai salah satu fitur clustering.

### 2.3 Mengukur hubungan tipologi dengan outcome pangan

Hasil clustering tidak hanya digunakan sebagai label visual. Sistem mengevaluasi seberapa kuat perbedaan cluster berkaitan dengan indikator ketahanan pangan dan kerawanan pangan.

### 2.4 Memproyeksikan kondisi masa depan

Predictive Analytics digunakan untuk memproyeksikan IKP pada periode mendatang sehingga sistem tidak hanya bersifat deskriptif, tetapi juga bersifat antisipatif.

### 2.5 Memanfaatkan public voice

Data percakapan publik mengenai pangan digunakan sebagai lapisan informasi tambahan untuk menangkap isu yang sedang dibicarakan masyarakat.

### 2.6 Mengintegrasikan evidence

Hasil spasial, clustering, forecasting, topic modeling, dan emotion analysis diintegrasikan untuk menghasilkan prioritas wilayah yang lebih informatif.

---

## 3. Gagasan Besar CIVIC-FOOD AI

Arsitektur konseptual CIVIC-FOOD AI dapat diringkas sebagai:

**Data → Spatial Intelligence → Predictive Analytics → Public Voice Intelligence → Decision Support**

Alurnya tidak dimaksudkan sebagai pipeline linear sederhana.

Setiap lapisan memberikan evidence berbeda.

### Spatial Intelligence

Menjawab:

> Wilayah mana yang memiliki karakteristik struktural serupa?

### Predictive Analytics

Menjawab:

> Bagaimana kondisi ketahanan pangan berpotensi berkembang?

### Public Voice Intelligence

Menjawab:

> Isu pangan apa yang sedang muncul dalam percakapan publik dan bagaimana karakter emosionalnya?

### Decision Support

Menjawab:

> Wilayah mana yang perlu mendapat perhatian lebih dahulu dan mengapa?

---

# 4. Data dan Dimensi Analitik

CIVIC-FOOD AI menggunakan data panel wilayah dan waktu serta data public voice.

Dataset panel mencakup:

- **190 panel observations**
- **38 provinsi**
- periode **2021–2025**
- **19 fitur clustering**

Salah satu komponen penting adalah **Indeks Ketahanan Pangan (IKP)**.

IKP tidak dikeluarkan dari clustering karena indikator tersebut merupakan bagian penting dari karakteristik ketahanan pangan yang ingin dipetakan.

---

# 5. Fitur Clustering

Fitur yang digunakan untuk membentuk tipologi mencakup dimensi:

### Pendidikan

- APS 7–12
- APS 13–15
- APS 16–18
- APS 19–23
- Rata-rata Lama Sekolah
- Harapan Lama Sekolah

### Ketenagakerjaan

- Tingkat Pengangguran Terbuka
- TPAK

### Kemiskinan

- Garis Kemiskinan
- Penduduk Miskin

### Pembangunan

- Indeks Pembangunan Manusia

### Ketahanan Pangan

- **Indeks Ketahanan Pangan**

### Pertanian

- Luas Panen Tanaman Padi
- Produktivitas Tanaman Padi
- Produksi Padi

### Ekonomi

- PDRB per Kapita
- Rata-rata Pengeluaran per Kapita Sebulan untuk Makanan

### Infrastruktur dasar

- Akses terhadap sumber air minum layak
- Akses penerangan listrik

Dengan demikian, tipologi tidak hanya merepresentasikan kondisi pangan secara sempit, tetapi konteks struktural yang membentuk ketahanan pangan.

---

# 6. Spatial Intelligence

Spatial Intelligence merupakan fondasi utama sistem.

Data panel memungkinkan kondisi wilayah dianalisis berdasarkan dimensi ruang dan waktu.

CIVIC-FOOD AI menyediakan:

- peta choropleth;
- distribusi tipologi;
- profil cluster;
- perbandingan antarwilayah;
- analisis temporal;
- hubungan karakteristik wilayah dengan outcome pangan.

Peta provinsi menggunakan GeoJSON 38 provinsi sehingga seluruh provinsi Indonesia dapat direpresentasikan secara konsisten.

---

# 7. Clustering Multidimensional

Clustering digunakan untuk menemukan tipologi wilayah berdasarkan fitur multidimensional.

Pipeline clustering mengevaluasi kombinasi:

- embedding/dimensionality reduction;
- algoritma clustering;
- parameter clustering;
- validitas internal;
- stabilitas cluster;
- interpretabilitas hasil.

Konfigurasi terbaik dari analysis run tersimpan sebagai:

**UMAP_3 + HDBSCAN (5_8)**

Konfigurasi ini digunakan sebagai hasil utama pada artefak analysis run.

Namun, sistem tidak hanya menyimpan satu hasil.

Perbandingan konfigurasi tetap dipertahankan agar pemilihan model dapat diaudit.

---

# 8. Dimensionality Reduction

Dimensionality reduction digunakan untuk membantu menemukan struktur laten pada data berdimensi tinggi.

UMAP digunakan sebagai salah satu pendekatan utama.

Tujuannya bukan sekadar membuat visualisasi dua dimensi, tetapi membantu proses eksplorasi struktur data sebelum clustering.

Beberapa dimensi dapat dibandingkan untuk mencari representasi yang memberikan kualitas cluster terbaik.

---

# 9. HDBSCAN

HDBSCAN digunakan karena struktur wilayah tidak selalu dapat diasumsikan memiliki jumlah cluster tetap dan ukuran cluster yang seragam.

Keunggulan pendekatan ini dalam konteks CIVIC-FOOD AI adalah kemampuannya untuk:

- menemukan kelompok berdasarkan kepadatan;
- mengakomodasi cluster dengan ukuran berbeda;
- mengidentifikasi observasi yang sulit dikelompokkan;
- menghasilkan label noise/outlier.

Label `-1` diperlakukan sebagai noise/outlier dan tidak otomatis dipaksakan menjadi tipologi substantif.

---

# 10. Validasi Clustering

CIVIC-FOOD AI tidak memilih clustering hanya berdasarkan visualisasi.

Evaluasi mencakup:

- kualitas cluster;
- stabilitas;
- interpretabilitas;
- hubungan dengan outcome;
- perbandingan konfigurasi.

Salah satu ukuran interpretatif yang digunakan adalah eta-squared.

Hasil analysis run mencatat:

- **eta-squared IKP = 0.838795**
- **eta-squared PoU = 0.707440**

Nilai tersebut digunakan sebagai evidence mengenai kuatnya perbedaan outcome antar tipologi, bukan sebagai bukti kausalitas.

---

# 11. Cluster Profil

Setiap cluster dianalisis berdasarkan profil rata-rata seluruh fitur.

Tujuannya adalah menjawab:

> Apa yang sebenarnya membedakan satu tipologi wilayah dari tipologi lainnya?

Profil cluster memungkinkan identifikasi pola seperti kombinasi:

- ketahanan pangan;
- pendidikan;
- kemiskinan;
- pembangunan manusia;
- produktivitas;
- kapasitas ekonomi;
- akses infrastruktur.

Nama tipologi tidak dipaksakan oleh sistem.

Pengguna dapat memberikan nama substantif pada cluster setelah melihat profil empirisnya.

Hal ini menjaga interpretasi agar tetap berbasis data.

---

# 12. Decision Support dari Clustering

Cluster bukan tujuan akhir.

Cluster menjadi salah satu evidence dalam proses prioritisasi.

Wilayah dengan karakteristik tertentu dapat diberi perhatian berbeda berdasarkan:

- posisi cluster;
- kondisi IKP;
- outcome kerawanan pangan;
- tren historis;
- forecast;
- sinyal public voice.

Dengan demikian, sistem bergerak dari:

**segmentation → diagnosis → prioritization**

---

# 13. Predictive Analytics

Lapisan predictive analytics digunakan untuk memproyeksikan IKP.

Forecasting dibuat agar sistem dapat menjawab:

> Jika pola historis berlanjut, bagaimana kondisi ketahanan pangan wilayah pada periode berikutnya?

Forecasting menggunakan informasi temporal, termasuk lag IKP.

Dataset dibagi berdasarkan waktu sehingga evaluasi tidak mencampurkan informasi masa depan ke masa lalu.

---

# 14. Validasi Forecasting

Forecasting tidak dievaluasi hanya menggunakan satu angka.

Metric yang digunakan meliputi:

- RMSE;
- MAE;
- MAPE;
- R².

Hasil validation run:

- **RMSE = 3.1023**
- **MAE = 2.3747**
- **MAPE = 4.0153%**
- **R² = 0.9135**

Hasil tersebut menunjukkan performa forecast yang kuat pada validation split yang digunakan.

---

# 15. Naive Baseline

CIVIC-FOOD AI juga menggunakan baseline naive berbasis lag.

Ini penting untuk menghindari kesimpulan bahwa model machine learning selalu lebih baik daripada baseline sederhana.

Pada analysis run, baseline naive memiliki error validasi yang lebih rendah daripada XGBoost tuned.

Karena itu, dashboard mempertahankan caveat tersebut.

Sistem tidak mengklaim XGBoost sebagai model paling akurat hanya karena menggunakan algoritma yang lebih kompleks.

---

# 16. XGBoost Tuned

XGBoost digunakan sebagai predictive model yang dituning.

Hyperparameter tuning digunakan untuk mencari konfigurasi model yang sesuai dengan data.

Tujuannya adalah mengurangi ketergantungan pada parameter default dan mengevaluasi performa model secara lebih sistematis.

Model tuned tetap penting karena:

- dapat menangkap hubungan non-linear;
- dapat menggunakan beberapa predictor;
- dapat memberikan feature importance;
- dapat digunakan untuk interpretasi model;
- dapat menghasilkan forecast 2026–2028 pada pipeline.

---

# 17. Forecast 2026–2028

Forecast digunakan sebagai layer antisipatif.

Output utama meliputi:

- historical IKP;
- validation prediction;
- forecast;
- forecast delta;
- perubahan relatif terhadap baseline;
- ranking wilayah berdasarkan sinyal perubahan.

Forecast tidak diperlakukan sebagai kepastian.

Ia merupakan estimasi berbasis pola data historis dan model yang digunakan.

---

# 18. SHAP Explainability

Predictive Analytics dilengkapi dengan explainability.

SHAP digunakan untuk memahami kontribusi fitur terhadap prediksi.

Pertanyaan yang dijawab:

> Faktor apa yang paling berkontribusi terhadap prediksi model?

Ini penting agar sistem tidak menjadi black box.

Dalam konteks DSS, hasil model harus dapat diterjemahkan menjadi evidence yang dapat diperiksa.

---

# 19. Paradoks Ketahanan Pangan

Salah satu insight yang ingin ditonjolkan CIVIC-FOOD AI adalah fenomena paradoks.

Paradoks dapat muncul ketika indikator agregat terlihat relatif baik tetapi terdapat indikator struktural atau sinyal lain yang menunjukkan kerentanan.

Contoh kerangka interpretasinya:

**IKP relatif baik + vulnerability signal tinggi**

atau

**produksi tinggi + akses/kemampuan ekonomi lemah**

atau

**indikator pembangunan baik + public voice pressure tinggi**

Paradoks tidak berarti model menyatakan hubungan sebab-akibat.

Paradoks adalah sinyal untuk melakukan pemeriksaan lebih lanjut.

---

# 20. Underdog Signal

CIVIC-FOOD AI juga dirancang untuk mencari wilayah yang mungkin tidak terlihat sebagai prioritas jika hanya menggunakan satu indikator.

Underdog signal dapat muncul ketika:

- skor agregat terlihat moderat;
- forecast menunjukkan penurunan;
- public voice menunjukkan tekanan;
- cluster menunjukkan structural vulnerability.

Dengan integrasi evidence tersebut, wilayah yang sebelumnya tidak terlihat dapat masuk radar kebijakan.

---

# 21. Public Voice Intelligence

Public Voice Intelligence menggunakan data percakapan publik yang berkaitan dengan pangan.

Data mencakup periode:

**2021–2026**

Dataset hasil seleksi NLP yang digunakan pada analysis run memiliki:

**1,735 record public voice**

Public voice digunakan sebagai lapisan complementary intelligence.

Ia bukan pengganti statistik resmi.

---

# 22. Relevance Filtering

Tweet disaring berdasarkan relevansinya terhadap konteks pangan.

Konteks mencakup antara lain:

- ketahanan pangan;
- kerawanan pangan;
- harga pangan;
- harga beras;
- bahan pokok;
- produksi pangan;
- distribusi pangan;
- pasokan;
- pertanian;
- petani;
- bantuan pangan;
- kebijakan pangan.

Relevance filtering bertujuan mengurangi noise sebelum analisis NLP.

---

# 23. Text Preprocessing

Preprocessing NLP dilakukan untuk mempersiapkan data sebelum topic modeling dan emotion analysis.

Tahap dapat mencakup:

- normalisasi teks;
- lowercase;
- pembersihan URL;
- pembersihan mention;
- pembersihan karakter yang tidak diperlukan;
- normalisasi whitespace;
- deduplikasi;
- penyaringan teks kosong.

Preprocessing tidak boleh menghilangkan konteks semantik yang diperlukan untuk analisis.

---

# 24. Emotion Analysis

Emotion analysis digunakan untuk memahami karakter emosional public voice.

Pipeline menggunakan pseudo-labeling sebagai tahap awal.

Pseudo-label kemudian digunakan sebagai basis fine-tuning.

Analysis run menggunakan:

**5 kelas emosi**

Emotion analysis tidak diperlakukan sebagai ground truth survei.

Hasilnya digunakan sebagai sinyal tambahan untuk memahami pola percakapan publik.

---

# 25. Fine-Tuning Emotion Model

Model emotion fine-tuned digunakan agar representasi teks dapat menyesuaikan dengan karakter public voice dalam konteks pangan.

Fine-tuning membantu model belajar dari data yang telah diberi pseudo-label.

Namun, karena label awal merupakan pseudo-label, hasil tetap memiliki ketidakpastian.

Karena itu dashboard menampilkan caveat.

---

# 26. Topic Modeling

Topic modeling digunakan untuk menemukan tema yang muncul secara otomatis dalam public voice.

CIVIC-FOOD AI menggunakan BERTopic.

BERTopic membantu menemukan cluster topik berdasarkan representasi semantik dokumen.

Analysis run menghasilkan:

**8 topic non-outlier**

Topic `-1` diperlakukan sebagai outlier/noise.

---

# 27. Coherence dan Topic Quality

Topic modeling tidak hanya dilihat dari jumlah topic.

Evaluasi dapat mempertimbangkan:

- coherence;
- topic diversity;
- jumlah dokumen per topic;
- representasi kata;
- interpretabilitas topic.

Tujuannya adalah menghasilkan topic yang substantif, bukan sekadar topic yang secara matematis terpisah.

---

# 28. Manual Topic Naming

Nama topic tidak dipaksakan secara otomatis.

Dashboard menyediakan mapping manual.

Pengguna dapat memberikan nama topic setelah melihat:

- representative documents;
- top words;
- topic frequency;
- hubungan dengan emotion.

Dengan cara ini, penamaan topic tetap dapat disesuaikan dengan interpretasi substantif.

---

# 29. Topic × Emotion

Salah satu analisis utama CIVIC-FOOD AI adalah integrasi topic dan emotion.

Pertanyaan yang ingin dijawab:

> Topik pangan apa yang paling banyak dibicarakan dan emosi apa yang dominan di dalamnya?

Matriks topic × emotion membantu menemukan kombinasi seperti:

**topic → dominant emotion → public pressure**

Analisis ini lebih informatif daripada melihat topic atau emotion secara terpisah.

---

# 30. Public Voice sebagai Early Signal

Public voice dapat digunakan sebagai early signal.

Ketika suatu isu mulai banyak dibicarakan sebelum perubahan statistik resmi terlihat, sistem dapat menandainya sebagai sinyal yang perlu dipantau.

Namun, public voice tidak otomatis berarti kondisi populasi memburuk.

Ia merupakan evidence tambahan yang perlu ditriangulasi dengan data resmi.

---

# 31. Integrasi Empat Analisis

CIVIC-FOOD AI mengintegrasikan empat komponen:

### 1. Spatial Intelligence

Kondisi struktural dan geografis.

### 2. Predictive Analytics

Arah perubahan dan forecast.

### 3. Public Voice Intelligence

Topik serta emosi percakapan publik.

### 4. Decision Support

Prioritas wilayah berdasarkan gabungan evidence.

Integrasi tersebut menghasilkan perspektif yang lebih luas daripada satu model.

---

# 32. Decision Support Score

Sistem dapat menggabungkan berbagai evidence menjadi priority score.

Komponen dapat meliputi:

- vulnerability;
- forecast deterioration;
- public voice pressure;
- cluster risk;
- indicator gaps.

Priority score digunakan untuk membantu penyusunan ranking.

Score bukan probabilitas terjadinya krisis.

Score adalah alat prioritisasi analitik.

---

# 33. Tier Prioritas

Wilayah dapat dikelompokkan ke dalam tier prioritas.

Contoh kerangka:

- **Tier 1, Immediate Attention**
- **Tier 2, High Monitoring**
- **Tier 3, Preventive Monitoring**
- **Tier 4, Stable Monitoring**

Nama tier dapat disesuaikan berdasarkan desain kebijakan.

---

# 34. Triangulasi Evidence

Kekuatan utama CIVIC-FOOD AI berada pada triangulasi.

Satu wilayah dapat memiliki:

- cluster tertentu;
- forecast tertentu;
- public voice tertentu.

Jika ketiga sinyal mengarah pada masalah yang sama, confidence untuk melakukan monitoring menjadi lebih kuat.

Jika sinyal bertentangan, wilayah tersebut justru dapat menjadi kandidat untuk investigasi lebih lanjut.

---

# 35. Mengapa Multidimensional?

Persoalan ketahanan pangan tidak hanya berkaitan dengan produksi.

Ia berhubungan dengan:

- akses;
- harga;
- daya beli;
- pendidikan;
- kemiskinan;
- pekerjaan;
- infrastruktur;
- produktivitas;
- pembangunan manusia;
- kondisi sosial;
- dinamika waktu;
- persepsi publik.

Karena itu CIVIC-FOOD AI menggunakan pendekatan multidimensional.

---

# 36. Mengapa Spasiotemporal?

Kondisi pangan memiliki dimensi lokasi dan waktu.

Wilayah yang memiliki kondisi serupa pada satu tahun belum tentu memiliki tren yang sama pada tahun berikutnya.

Analisis panel memungkinkan sistem mempertahankan kedua dimensi tersebut.

---

# 37. Mengapa Predictive Analytics?

DSS yang hanya menggambarkan kondisi masa lalu bersifat reaktif.

Forecasting membuat sistem lebih antisipatif.

Dengan forecast, pengguna dapat melihat kemungkinan arah perubahan sebelum menentukan prioritas intervensi.

---

# 38. Mengapa Public Voice?

Statistik resmi memiliki kekuatan sebagai evidence terukur.

Namun, statistik tidak selalu menangkap isu yang sedang dibicarakan masyarakat secara real time.

Public Voice Intelligence melengkapi perspektif tersebut.

---

# 39. Mengapa Decision Support?

Model tidak berhenti pada metric.

Hasil analisis perlu diterjemahkan menjadi keputusan.

Karena itu sistem menghasilkan:

**evidence → insight → priority**

bukan sekadar:

**data → model → score**

---

# 40. Dashboard Command Center

Command Center merupakan halaman utama.

Komponen utamanya:

- headline project;
- KPI;
- jumlah provinsi;
- periode analisis;
- jumlah fitur;
- hasil clustering;
- performa forecast;
- jumlah public voice;
- topic;
- emotion;
- priority regions.

Tujuannya agar juri dapat memahami keseluruhan sistem dengan cepat.

---

# 41. Spatial Intelligence Page

Halaman Spatial Intelligence menampilkan:

- choropleth Indonesia;
- cluster;
- cluster profile;
- IKP;
- outcome pangan;
- tipologi;
- comparison model.

Peta digunakan sebagai alat eksplorasi, bukan sekadar dekorasi.

---

# 42. Predictive Analytics Page

Halaman Predictive Analytics menampilkan:

- historical series;
- validation prediction;
- forecast;
- forecast uncertainty/context;
- model comparison;
- metric;
- SHAP importance.

Dengan demikian pengguna dapat melihat performa model dan interpretasinya.

---

# 43. Public Voice Page

Halaman Public Voice Intelligence menampilkan:

- jumlah tweet;
- distribusi waktu;
- topic;
- emotion;
- topic × emotion;
- representative public voice;
- caveat pseudo-label.

Halaman ini membantu memahami dinamika percakapan publik.

---

# 44. Decision Support Page

Decision Support menjadi halaman integrasi.

Komponen:

- priority ranking;
- priority score;
- cluster;
- forecast;
- public voice;
- underdog;
- paradox;
- recommendation.

Halaman ini dirancang sebagai jembatan dari analytics menuju kebijakan.

---

# 45. Evidence Library

Seluruh artefak analysis run dipertahankan.

Evidence Library digunakan agar:

- figure tidak hilang;
- table dapat diaudit;
- output model dapat dilacak;
- hasil penelitian mudah diperiksa.

Analysis artifacts yang tersedia mencakup figure dan table dari pipeline.

---

# 46. Reproducibility

Dashboard tidak melatih ulang model di browser.

Web menggunakan artefak hasil analysis run.

Keuntungan:

- loading lebih cepat;
- deployment lebih stabil;
- tidak membutuhkan GPU;
- hasil demo konsisten;
- risiko runtime error lebih rendah.

---

# 47. Model Artifacts

Model dan hasil analitik dapat disimpan sebagai artifact.

Struktur output mencakup:

```text
outputs/
├── figures/
├── models/
├── data/
└── tables/
```

Artifact digunakan untuk reproducibility dan audit.

---

# 48. Teknologi

Komponen analitik menggunakan ekosistem Python.

Antara lain:

- pandas;
- NumPy;
- scikit-learn;
- XGBoost;
- UMAP;
- HDBSCAN;
- GeoPandas;
- BERTopic;
- Transformers;
- SHAP;
- Matplotlib.

Dashboard web menggunakan:

- Next.js;
- React;
- Tailwind CSS;
- GeoJSON;
- Vercel.

---

# 49. Prinsip Design

Desain dashboard menggunakan pendekatan:

**editorial intelligence dashboard**

Prinsipnya:

- clean;
- modern;
- evidence-first;
- readable;
- responsive;
- interactive;
- presentation-ready.

Visual tidak dibuat untuk memenuhi halaman.

Setiap chart harus membantu menjawab pertanyaan analitik.

---

# 50. Design Hierarchy

Hierarki informasi dibuat dari:

**Problem → Evidence → Model → Insight → Priority**

Juri dapat mengikuti alur tersebut tanpa harus memahami seluruh kode Python.

---

# 51. Auditability

Setiap insight utama idealnya dapat ditelusuri kembali ke:

- data;
- metric;
- figure;
- table;
- model;
- konfigurasi.

Dengan pendekatan ini, sistem tidak hanya menarik secara visual tetapi juga defensible secara akademik.

---

# 52. Caveat Data

CIVIC-FOOD AI memiliki beberapa batasan.

Data panel merepresentasikan indikator agregat wilayah.

Karena itu hasil tidak boleh langsung ditafsirkan sebagai kondisi setiap individu.

---

# 53. Caveat Forecast

Forecast adalah estimasi model.

Perubahan kebijakan, bencana, perubahan harga, perubahan produksi, dan shock eksternal dapat menyebabkan realisasi berbeda dari forecast.

Forecast harus digunakan untuk monitoring dan scenario planning.

---

# 54. Caveat Public Voice

Public voice bukan survei probabilistik.

Distribusi pengguna media sosial tidak identik dengan distribusi penduduk.

Karena itu hasil public voice tidak boleh dipakai untuk menyatakan:

> sekian persen masyarakat Indonesia memiliki emosi tertentu.

Interpretasi yang benar adalah:

> sekian proporsi dari public voice yang dianalisis menunjukkan pola tertentu.

---

# 55. Caveat Pseudo-Label

Emotion analysis menggunakan pseudo-label sebagai bagian dari pipeline.

Karena label awal bukan gold-standard annotation, terdapat potensi label noise.

Fine-tuning tidak otomatis menghilangkan seluruh bias tersebut.

Karena itu emotion analysis digunakan sebagai complementary signal.

---

# 56. Caveat Causal Interpretation

Clustering, forecasting, topic modeling, dan association analysis tidak secara otomatis membuktikan hubungan sebab-akibat.

CIVIC-FOOD AI dirancang sebagai DSS analitik.

Bukan sebagai mesin pembuktian kausal.

---

# 57. Interpretasi Eta-Squared

Eta-squared digunakan untuk mengukur proporsi variasi outcome yang berkaitan dengan perbedaan kelompok.

Nilai tinggi menunjukkan adanya perbedaan antar kelompok yang kuat pada outcome yang diuji.

Namun, nilai tersebut tidak berarti cluster menyebabkan outcome.

---

# 58. Interpretasi Cluster

Cluster harus dibaca sebagai:

> kelompok wilayah dengan karakteristik data yang relatif serupa.

Cluster bukan label resmi pemerintah.

Nama tipologi adalah interpretasi analitik.

---

# 59. Interpretasi Underdog

Underdog bukan berarti wilayah tersebut pasti mengalami krisis.

Underdog adalah wilayah yang menjadi lebih terlihat setelah evidence dari beberapa layer digabungkan.

---

# 60. Interpretasi Paradoks

Paradoks digunakan untuk menunjukkan ketidaksesuaian antara indikator.

Ketidaksesuaian tersebut merupakan sinyal analitik.

Ia membutuhkan pemeriksaan lanjutan sebelum menjadi rekomendasi kebijakan spesifik.

---

# 61. Keunggulan Konseptual

CIVIC-FOOD AI memiliki beberapa pembeda utama.

### Multidimensional

Tidak hanya satu indikator.

### Spasiotemporal

Tidak hanya satu waktu.

### Predictive

Tidak hanya menjelaskan masa lalu.

### Civic intelligence

Tidak hanya menggunakan data statistik.

### Explainable

Tidak hanya memberikan output model.

### Decision-oriented

Tidak berhenti pada visualisasi.

---

# 62. Novelty

Novelty CIVIC-FOOD AI berada pada integrasi evidence.

Alih-alih membuat beberapa model yang berdiri sendiri, sistem menghubungkan:

**structural typology + spatial context + forecast + public voice**

untuk menghasilkan decision support.

---

# 63. Nilai untuk Pembuat Kebijakan

Sistem dapat membantu pengguna menjawab:

- wilayah mana yang perlu dipantau;
- apa karakteristik wilayah tersebut;
- apakah kondisinya membaik atau memburuk;
- bagaimana arah forecast;
- isu apa yang muncul dalam public voice;
- bagaimana emosi dominan;
- apakah terdapat paradox;
- apakah terdapat underdog signal.

---

# 64. Nilai untuk Peneliti

CIVIC-FOOD AI menyediakan kerangka yang dapat dikembangkan menjadi:

- spatial machine learning;
- spatiotemporal forecasting;
- multimodal public intelligence;
- explainable AI;
- policy simulation;
- causal analysis;
- early warning system.

---

# 65. Nilai untuk Masyarakat

Sistem dapat menjadi jembatan antara data teknis dan informasi yang lebih mudah dipahami.

Masyarakat dapat melihat bahwa kebijakan pangan dapat dianalisis melalui evidence yang terukur dan dapat diaudit.

---

# 66. Pengembangan Masa Depan

Pengembangan berikutnya dapat mencakup:

- real-time public voice ingestion;
- streaming sentiment/emotion;
- probabilistic forecasting;
- uncertainty quantification;
- spatial graph neural network;
- causal inference;
- policy simulation;
- intervention optimization;
- alert system;
- integration dengan dashboard pemerintah.

---

# 67. Arsitektur Masa Depan

Pengembangan lanjutan dapat diarahkan menjadi:

```text
Official Statistics
        +
Satellite / Spatial Data
        +
Market Data
        +
Public Voice
        ↓
Data Integration Layer
        ↓
Spatial Intelligence
        ↓
Predictive Intelligence
        ↓
Public Voice Intelligence
        ↓
Explainable Decision Engine
        ↓
Priority & Early Warning
        ↓
Policy Dashboard
```

---

# 68. Early Warning Potential

CIVIC-FOOD AI memiliki potensi dikembangkan menjadi early warning system.

Sinyal dapat berasal dari:

- penurunan forecast;
- perubahan cluster;
- perubahan IKP;
- peningkatan public voice;
- perubahan topic;
- perubahan emotion.

Jika beberapa sinyal muncul bersamaan, wilayah dapat dinaikkan ke level monitoring yang lebih tinggi.

---

# 69. Policy Translation

Output analitik harus diterjemahkan menjadi action.

Contoh kerangka:

**High vulnerability + forecast deterioration**

→ preventive intervention.

**Stable aggregate + high public pressure**

→ investigate issue.

**Good aggregate + hidden structural weakness**

→ underdog monitoring.

**High production + low access**

→ access/distribution investigation.

Kerangka tersebut bukan rekomendasi otomatis.

Ia merupakan decision aid.

---

# 70. Data-to-Decision Philosophy

CIVIC-FOOD AI dibangun dengan prinsip:

> Data should not only describe the problem. Data should help reveal where, why, when, and what to monitor next.

Karena itu dashboard mengutamakan interpretasi.

---

# 71. Evidence-First Philosophy

Setiap insight harus memiliki evidence.

Misalnya:

**Priority tinggi**

harus dapat ditelusuri ke:

- cluster;
- IKP;
- forecast;
- public voice;
- atau kombinasi indikator.

---

# 72. Human-in-the-Loop

CIVIC-FOOD AI tidak menggantikan pengambil keputusan.

Sistem memberikan:

- evidence;
- ranking;
- warning;
- pattern;
- explanation.

Keputusan akhir tetap membutuhkan validasi manusia dan konteks lapangan.

---

# 73. Manual Naming

Cluster dan topic sengaja memiliki mekanisme manual naming.

Hal tersebut membuat pengguna dapat menerjemahkan hasil statistik menjadi terminology substantif setelah memeriksa evidence.

---

# 74. Why Vercel?

Vercel digunakan untuk deployment dashboard karena cocok untuk aplikasi Next.js yang membutuhkan:

- deployment cepat;
- static assets;
- responsive frontend;
- preview deployment;
- production deployment.

Model tidak dijalankan ulang di frontend sehingga kebutuhan komputasi relatif ringan.

---

# 75. Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Kemudian buka:

```text
http://localhost:3000
```

---

# 76. Production Build

Untuk memastikan project dapat dibangun:

```bash
npm run build
```

Kemudian:

```bash
npm start
```

---

# 77. Vercel Deployment

Project dapat dihubungkan dengan repository GitHub.

Kemudian repository dapat di-import ke Vercel.

Framework yang digunakan:

**Next.js**

Vercel akan menjalankan build berdasarkan konfigurasi project.

---

# 78. Vercel CLI

Alternatif deployment:

```bash
npm install -g vercel
vercel
```

Production:

```bash
vercel --prod
```

---

# 79. Struktur Project

Struktur utama:

```text
app/
components/
public/
├── assets/
├── data/
└── source-data/
README.md
package.json
next.config.*
tailwind.config.*
```

---

# 80. Assets

Folder assets berisi visualisasi dari analysis run.

Visual tersebut digunakan untuk mempertahankan hubungan antara dashboard dan hasil penelitian.

---

# 81. Data Dashboard

Data JSON digunakan agar frontend dapat membaca hasil analisis tanpa melatih ulang model.

Data tersebut dapat berisi:

- province;
- cluster;
- cluster name;
- IKP;
- forecast;
- priority;
- public voice;
- topic;
- emotion.

---

# 82. Source Data

Source data mempertahankan artifact hasil analisis.

Tujuannya agar project dapat diperiksa dan dikembangkan kembali.

---

# 83. Performance

Dashboard dirancang agar:

- tidak melakukan training di browser;
- menggunakan precomputed artifacts;
- meminimalkan request;
- menggunakan static assets;
- menjaga visual tetap ringan.

---

# 84. Reliability

Reliability dijaga dengan:

- fixed analysis artifacts;
- deterministic seed;
- saved outputs;
- validation metrics;
- baseline comparison;
- explicit caveats.

---

# 85. Reproducible Seed

Analysis pipeline menggunakan seed:

**42**

Seed membantu membuat beberapa proses stochastic lebih konsisten.

---

# 86. Model Selection Philosophy

Model dipilih berdasarkan evidence.

Bukan berdasarkan kompleksitas.

Model yang lebih kompleks tidak otomatis lebih baik.

Karena itu baseline tetap digunakan.

---

# 87. Evaluation Philosophy

Evaluasi harus melihat:

- predictive performance;
- robustness;
- interpretability;
- stability;
- baseline comparison;
- substantive usefulness.

Satu metric saja tidak cukup untuk menyatakan model unggul.

---

# 88. Clustering Evaluation

Clustering dievaluasi melalui kombinasi:

- internal validation;
- stability;
- external association;
- profile interpretability.

Ini membantu menghindari cluster yang hanya bagus secara visual.

---

# 89. Forecast Evaluation

Forecast dievaluasi pada validation period yang dipisahkan berdasarkan waktu.

Metric utama:

- RMSE;
- MAE;
- MAPE;
- R².

Baseline naive juga digunakan.

---

# 90. NLP Evaluation

Emotion analysis dan topic modeling memiliki karakter evaluasi berbeda.

Emotion:

- classification metrics;
- confusion matrix;
- per-class performance;
- pseudo-label caveat.

Topic:

- coherence;
- diversity;
- topic size;
- semantic interpretability.

---

# 91. Integration Evaluation

Integrasi tidak dinilai hanya dari satu accuracy.

Kualitas sistem dinilai dari:

- konsistensi evidence;
- interpretability;
- auditability;
- usefulness untuk prioritization;
- ability to surface hidden signals.

---

# 92. Dashboard Storyline

Storyline dashboard:

**01, Understand**

Apa kondisi pangan?

**02, Segment**

Wilayah mana yang memiliki karakteristik serupa?

**03, Predict**

Bagaimana arahnya?

**04, Listen**

Apa yang sedang dibicarakan publik?

**05, Integrate**

Apakah sinyal tersebut konsisten?

**06, Prioritize**

Wilayah mana yang perlu diperhatikan?

---

# 93. Judging Experience

Dashboard dirancang agar juri dapat mengikuti alur:

**Problem → Data → Method → Result → Insight → Impact**

tanpa harus membuka notebook.

---

# 94. Research Artifact

Web bukan pengganti KTI.

Web adalah research communication layer.

Ia mengubah hasil penelitian menjadi sistem interaktif yang lebih mudah dipahami.

---

# 95. Keterkaitan dengan KTI GEMASTIK 2026

CIVIC-FOOD AI dikembangkan sebagai bagian dari karya **KTI GEMASTIK 2026**.

Tujuan utamanya adalah menunjukkan bagaimana data science, machine learning, spatial analytics, NLP, dan decision support dapat digabungkan untuk menangani persoalan ketahanan pangan.

---

# 96. Peran Ketua Tim

**Nazril Ravi Pratama** bertindak sebagai **Ketua Tim** dalam pengembangan CIVIC-FOOD AI.

Kontribusi project mencakup pengembangan konsep, integrasi analitik, pipeline data science, predictive analytics, public voice intelligence, serta pengembangan decision support dashboard.

---

# 97. Anggota Tim

**Nadia Kaila** merupakan anggota tim dalam pengembangan CIVIC-FOOD AI.

**Darista Wardhani** merupakan anggota tim dalam pengembangan CIVIC-FOOD AI.

Project dikembangkan sebagai kerja kolaboratif tim.

---

# 98. Research Communication

README ini berfungsi sebagai dokumentasi tingkat tinggi.

Dokumentasi teknis dapat dilengkapi dengan notebook dan artifact analysis run.

---

# 99. Reuse

Kerangka CIVIC-FOOD AI dapat diadaptasi untuk:

- stunting;
- kemiskinan;
- kesehatan;
- pendidikan;
- ketahanan energi;
- disaster resilience.

Dengan mengganti domain indicators dan target, architecture dapat digunakan kembali.

---

# 100. Kesimpulan

CIVIC-FOOD AI dirancang sebagai lebih dari sekadar dashboard.

Ia merupakan kerangka **multidimensional Decision Support System** yang menghubungkan:

**spatial structure**

+

**temporal dynamics**

+

**predictive analytics**

+

**public voice intelligence**

+

**explainable prioritization**

menjadi satu alur pengambilan keputusan.

Kekuatan utamanya bukan pada satu algoritma tunggal, melainkan pada integrasi evidence.

Sistem berusaha menjawab empat pertanyaan penting:

> **Where is the problem?**

> **How is it evolving?**

> **What is the public saying?**

> **Where should attention go first?**

Dengan pendekatan tersebut, CIVIC-FOOD AI menempatkan artificial intelligence bukan hanya sebagai alat prediksi, tetapi sebagai instrumen untuk membantu manusia memahami masalah, menemukan hidden signals, dan membuat keputusan berbasis evidence.

---

## Final Project Statement

**CIVIC-FOOD AI**

**Penguatan Ketahanan Pangan Berbasis Multidimensional Decision Support System melalui Integrasi Data Spasiotemporal, Predictive Analytics, dan Public Voice Intelligence**

**KTI GEMASTIK 2026**

**Nazril Ravi Pratama, Ketua Tim**

**Nadia Kaila, Anggota**

**Darista Wardhani, Anggota**

---

## License / Usage

Project ini dikembangkan untuk kebutuhan KTI GEMASTIK 2026 dan dokumentasi penelitian tim.

Silakan pertahankan attribution dan konteks penelitian ketika menggunakan kembali struktur atau artefaknya.
