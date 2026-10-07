"""Menghasilkan public/data/derived.json dari artefak analisis.

Semua angka berasal dari file di public/data (identik dengan keluaran notebook).
Simulasi bobot memakai seed tetap (42) agar dapat direproduksi:
  - skenario A: tiap bobot (45/30/15/10) dikalikan U(0,7; 1,3) lalu dinormalisasi ke 100, 10.000 kali
  - skenario B: bobot acak Dirichlet(1,1,1,1) x 100, 10.000 kali
Jalankan:  python scripts/build_derived.py
"""
import json, os
import numpy as np
import pandas as pd

ROOT = os.path.join(os.path.dirname(__file__), '..')
D = lambda f: os.path.join(ROOT, 'public', 'data', f)
IKP = 'Indeks Ketahanan Pangan'

ids = pd.DataFrame(json.load(open(D('integrated_decision_support.json'))))
fc = pd.DataFrame(json.load(open(D('forecast_2026_2028.json'))))
nlp = pd.DataFrame(json.load(open(D('public_voice_nlp_final.json'))))

# ---------- 1. Sensitivitas bobot ----------
X = ids[['risk_level_score', 'decline_score', 'underdog_signal', 'paradox_signal']].astype(float).values
base = np.array([45, 30, 15, 10.0])
N = 10000
rng = np.random.default_rng(42)
ranksA = np.empty((N, len(ids)), dtype=int)
for i in range(N):
    w = base * rng.uniform(0.7, 1.3, 4); w = w / w.sum() * 100
    s = X @ w; ranksA[i] = (-s).argsort().argsort() + 1
ranksB = np.empty((N, len(ids)), dtype=int)
for i in range(N):
    w = rng.dirichlet(np.ones(4)) * 100
    s = X @ w; ranksB[i] = (-s).argsort().argsort() + 1
sens = {}
nop = (X @ np.array([45, 30, 15, 0.0]))
nop_rank = (-nop).argsort().argsort() + 1
for j, p in enumerate(ids.Provinsi):
    a, b = ranksA[:, j], ranksB[:, j]
    sens[p] = dict(
        top10_pct=round(float((a <= 10).mean() * 100), 1), top5_pct=round(float((a <= 5).mean() * 100), 1),
        rank_min=int(a.min()), rank_max=int(a.max()), rank_median=int(np.median(a)),
        random_top10_pct=round(float((b <= 10).mean() * 100), 1), random_top5_pct=round(float((b <= 5).mean() * 100), 1),
        no_paradox_rank=int(nop_rank[j]), no_paradox_score=round(float(nop[j]), 2))

# ---------- 2. Konkordansi dengan IKP saja ----------
rank_ikp = ids[IKP].rank(method='min').astype(int)
rank_ps = ids.priority_score.rank(ascending=False, method='min').astype(int)
t_ikp = set(ids[rank_ikp <= 10].Provinsi); t_ps = set(ids[rank_ps <= 10].Provinsi)
conc = dict(spearman=round(float(rank_ikp.corr(rank_ps, method='spearman')), 2), overlap_top10=len(t_ikp & t_ps),
            entered=sorted(t_ps - t_ikp), left=sorted(t_ikp - t_ps))

# ---------- 3. Proyeksi yang mendatar (nilai identik) ----------
f28 = (ids[IKP] + ids.forecast_delta).round(2)
flat = [dict(value=float(v), provinces=sorted(ids.Provinsi[f28 == v].tolist())) for v, c in f28.value_counts().items() if c >= 2]
flat.sort(key=lambda x: -len(x['provinces']))

# ---------- 4. Jendela waktu dan linimasa public voice ----------
ts = pd.to_datetime(nlp.created_at, utc=True)
nlp['date'] = ts.dt.strftime('%Y-%m-%d')
nlp['neg'] = nlp.negative_signal.astype(int)
dis = nlp.topic_name.eq('Kelaparan dan Krisis Pangan akibat Bencana')
daily = (nlp.assign(dis=dis.astype(int)).groupby('date').agg(count=('date', 'size'), negative=('neg', 'sum'), disaster=('dis', 'sum')).reset_index())
voice = dict(start=ts.min().strftime('%Y-%m-%d %H:%M UTC'), end=ts.max().strftime('%Y-%m-%d %H:%M UTC'), n=int(len(nlp)),
             days=int(daily.shape[0]), daily=daily.to_dict('records'))

out = dict(sensitivity=sens, sensitivity_params=dict(n=N, seed=42, perturbation='±30%'), concordance=conc, flat_forecast=flat, voice=voice)
json.dump(out, open(D('derived.json'), 'w'), ensure_ascii=False)
n = sens['NUSA TENGGARA BARAT']
print('NTB', n); print(conc); print('flat', flat); print('voice', voice['start'], voice['end'], voice['days'])
