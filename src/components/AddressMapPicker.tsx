import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconRetinaUrl: iconRetina,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface AddressMapPickerProps {
    lat?: number;
    lng?: number;
    onLocationSelect: (lat: number, lng: number, address?: string) => void;
    height?: string;
    placeholder?: string;
}

// Map center for Calinan, Davao City
const DEFAULT_CENTER: [number, number] = [7.2906, 125.3764];

function LocationMarker({ position, setPosition, onLocationSelect }: {
    position: [number, number] | null,
    setPosition: (pos: [number, number]) => void,
    onLocationSelect: (lat: number, lng: number, address?: string) => void
}) {
    const map = useMap();

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onLocationSelect(lat, lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker
            position={position}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    setPosition([position.lat, position.lng]);
                    onLocationSelect(position.lat, position.lng);
                },
            }}
        />
    );
}

// Component to handle external position updates
function MapUpdater({ position }: { position: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 15);
        }
    }, [position, map]);
    return null;
}

const AddressMapPicker: React.FC<AddressMapPickerProps> = ({
    lat,
    lng,
    onLocationSelect,
    height = '300px',
    placeholder = 'Click on map to pick location'
}) => {
    const [position, setPosition] = useState<[number, number] | null>(
        lat && lng ? [lat, lng] : null
    );

    const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

    useEffect(() => {
        if (lat && lng) {
            setPosition([lat, lng]);
            handleLocationSelect(lat, lng); // Trigger reverse geocoding for initial lat/lng
        }
    }, [lat, lng]);

    const handleLocationSelect = async (newLat: number, newLng: number) => {
        setIsReverseGeocoding(true);
        let address = '';

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'Easy-Buy-Delivery-App'
                    }
                }
            );
            const data = await response.json();
            if (data && data.display_name) {
                address = data.display_name;
            }
        } catch (err) {
            console.error('Reverse geocoding error:', err);
        } finally {
            setIsReverseGeocoding(false);
            onLocationSelect(newLat, newLng, address);
        }
    };

    return (
        <div className="relative w-full rounded-lg overflow-hidden border border-gray-300 shadow-sm" style={{ height }}>
            {(!position || isReverseGeocoding) && (
                <div className="absolute inset-0 z-[1000] bg-black/5 flex items-center justify-center pointer-events-none">
                    <span className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        {isReverseGeocoding ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                Getting address...
                            </span>
                        ) : placeholder}
                    </span>
                </div>
            )}
            <MapContainer
                center={position || DEFAULT_CENTER}
                zoom={position ? 15 : 13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} onLocationSelect={handleLocationSelect} />
                <MapUpdater position={position} />
            </MapContainer>
        </div>
    );
};

export default AddressMapPicker;
