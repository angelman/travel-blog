import L from 'leaflet';
import './map-style.css';

export const routeStyle = { color: '#2c76b8', weight: 4, opacity: .8 };

export function stopMarker(feature, latlng) {
  return L.marker(latlng, {
    title: feature.properties.name,
    alt: feature.properties.name,
    icon: L.divIcon({
      className: 'roadtrip-pin',
      html: '<span class="roadtrip-pin-shape" aria-hidden="true"></span>',
      iconSize: [30, 38],
      iconAnchor: [15, 32],
      popupAnchor: [0, -30],
    }),
  });
}
