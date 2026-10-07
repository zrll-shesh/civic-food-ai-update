"use client";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// styles: { [namaGeoJSON]: { fill, tip } } ; selected: nama GeoJSON terpilih
export default function LeafletMap({ geojson, styles, selected, onSelect, layerId }) {
  const style = (f) => { const n = f.properties?.PROVINSI; const s = styles[n]; const sel = n === selected;
    return { fillColor: s?.fill || '#e2e8f0', weight: sel ? 3 : 1, color: sel ? '#0f172a' : '#64748b', fillOpacity: s ? 0.9 : 0.4 }; };
  return <div className="map-shell">
    <MapContainer center={[-2.3, 118]} zoom={4.4} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" opacity={0.55} />
      <GeoJSON key={`${layerId}|${selected}`}
        data={geojson} style={style}
        onEachFeature={(f, l) => { const n = f.properties?.PROVINSI; l.bindTooltip(`<strong>${n}</strong><br/>${styles[n]?.tip || '—'}`, { sticky: true }); l.on('click', () => onSelect && onSelect(n)); }} />
    </MapContainer>
  </div>;
}
