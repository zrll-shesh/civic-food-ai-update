import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'CIVIC-FOOD AI (Sistem Pendukung Keputusan Ketahanan Pangan) By Nazril Ravi Pratama',
  description: 'Lapisan triase di atas IKP: tipologi wilayah, proyeksi IKP 2026–2028 yang dapat dijelaskan, dan konteks suara publik menjadi prioritas wilayah yang dapat ditelusuri.',
  openGraph: { title: 'CIVIC-FOOD AI', description: 'Decision support system ketahanan pangan berbasis evidence fusion dan explainable AI.', type: 'website', locale: 'id_ID' },
  icons: { icon: '/favicon.svg' },
};
export const viewport = { width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }) { return <html lang="id"><body>{children}<Analytics /></body></html>; }
