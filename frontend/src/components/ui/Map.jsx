import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet + React
const customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.5)] border-2 border-white scale-100 transition-transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><circle cx="12" cy="12" r="3"/><path d="m16 16-3.4-3.4"/></svg>
        </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

// Component to handle viewport updates
function MapUpdater({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function Map({ center, zoom, markers, onMarkerClick, height = '100%' }) {
    return (
        <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group" style={{ height }}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={[marker.latitude, marker.longitude]}
                        icon={customIcon}
                        eventHandlers={{
                            click: () => onMarkerClick?.(marker.id),
                        }}
                    >
                        <Popup className="premium-popup">
                            <div className="p-1 min-w-[150px]">
                                <h3 className="font-bold text-base text-white mb-0.5">{marker.title}</h3>
                                <p className="text-gray-400 text-xs mb-2 line-clamp-1">{marker.address}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-primary-400 font-bold font-mono text-sm">
                                        ${marker.pricePerHour}/hr
                                    </span>
                                    <Link
                                        to={`/spaces/${marker.id}`}
                                        className="text-xs text-primary-400 hover:text-white transition-colors"
                                    >
                                        View →
                                    </Link>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <MapUpdater center={center} zoom={zoom} />
            </MapContainer>

            {/* Dynamic Overlay Gradient for "Rich" feel */}
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
        </div>
    );
}
