import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Search, Loader2 } from 'lucide-react';

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

// Custom Red Icon for Drop-off
const RedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PointLocation {
    lat: number;
    lng: number;
    address?: string;
}

interface MultiPointMapPickerProps {
    pickup: PointLocation | null;
    dropoff: PointLocation | null;
    onLocationSelect: (type: 'pickup' | 'dropoff', lat: number, lng: number, address?: string) => void;
    height?: string;
}

interface SearchResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
}

// Map center for Naga City, Philippines
const DEFAULT_CENTER: [number, number] = [13.6218, 123.1948];

function LocationMarkers({
    pickup,
    dropoff,
    activeMode,
    onLocationSelect,
    setIsReverseGeocoding
}: {
    pickup: PointLocation | null,
    dropoff: PointLocation | null,
    activeMode: 'pickup' | 'dropoff' | null,
    onLocationSelect: (type: 'pickup' | 'dropoff', lat: number, lng: number, address?: string) => void,
    setIsReverseGeocoding: (val: boolean) => void
}) {
    const map = useMap();

    const handleReverseGeocode = async (type: 'pickup' | 'dropoff', lat: number, lng: number) => {
        setIsReverseGeocoding(true);
        let address = '';
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                { headers: { 'User-Agent': 'Easy-Buy-Delivery-App' } }
            );
            const data = await response.json();
            if (data && data.display_name) {
                address = data.display_name;
            }
        } catch (err) {
            console.error('Reverse geocoding error:', err);
        } finally {
            setIsReverseGeocoding(false);
            onLocationSelect(type, lat, lng, address);
        }
    };

    useMapEvents({
        click(e) {
            if (!activeMode) return;
            const { lat, lng } = e.latlng;
            handleReverseGeocode(activeMode, lat, lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return (
        <>
            {pickup && (
                <Marker
                    position={[pickup.lat, pickup.lng]}
                    draggable={activeMode === 'pickup'}
                    icon={DefaultIcon}
                    eventHandlers={{
                        dragend: (e) => {
                            const marker = e.target;
                            const pos = marker.getLatLng();
                            handleReverseGeocode('pickup', pos.lat, pos.lng);
                        },
                    }}
                />
            )}
            {dropoff && (
                <Marker
                    position={[dropoff.lat, dropoff.lng]}
                    draggable={activeMode === 'dropoff'}
                    icon={RedIcon}
                    eventHandlers={{
                        dragend: (e) => {
                            const marker = e.target;
                            const pos = marker.getLatLng();
                            handleReverseGeocode('dropoff', pos.lat, pos.lng);
                        },
                    }}
                />
            )}
        </>
    );
}

// Component to handle external position updates
function MapUpdater({ pickup, dropoff, activeMode, searchLocation }: { pickup: PointLocation | null, dropoff: PointLocation | null, activeMode: 'pickup' | 'dropoff' | null, searchLocation: { lat: number, lng: number } | null }) {
    const map = useMap();
    useEffect(() => {
        if (searchLocation) {
            map.flyTo([searchLocation.lat, searchLocation.lng], 16);
            return;
        }
        if (activeMode === 'pickup' && pickup) {
            map.flyTo([pickup.lat, pickup.lng], 15);
        } else if (activeMode === 'dropoff' && dropoff) {
            map.flyTo([dropoff.lat, dropoff.lng], 15);
        } else if (pickup && dropoff) {
            const bounds = L.latLngBounds([
                [pickup.lat, pickup.lng],
                [dropoff.lat, dropoff.lng]
            ]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [pickup, dropoff, activeMode, searchLocation, map]);
    return null;
}

const MultiPointMapPicker: React.FC<MultiPointMapPickerProps> = ({
    pickup,
    dropoff,
    onLocationSelect,
    height = '400px',
}) => {
    const [activeMode, setActiveMode] = useState<'pickup' | 'dropoff' | null>(null);
    const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

    // Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [searchLocation, setSearchLocation] = useState<{ lat: number, lng: number } | null>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout>();
    const searchRef = useRef<HTMLDivElement>(null);

    // Initial center logic
    let center = DEFAULT_CENTER;
    let zoom = 13;
    if (activeMode === 'pickup' && pickup) {
        center = [pickup.lat, pickup.lng];
        zoom = 15;
    } else if (activeMode === 'dropoff' && dropoff) {
        center = [dropoff.lat, dropoff.lng];
        zoom = 15;
    } else if (pickup) {
        center = [pickup.lat, pickup.lng];
        zoom = 15;
    }

    // Handle Search Input
    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (query.trim().length < 3) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        setShowResults(true);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                // Focus search around Naga City by default, but allow nationwide
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ph&limit=5`,
                    { headers: { 'User-Agent': 'Easy-Buy-Delivery-App' } }
                );
                const data = await response.json();
                setSearchResults(data);
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setIsSearching(false);
            }
        }, 500);
    };

    const handleSelectResult = (result: SearchResult) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        setSearchLocation({ lat, lng });
        setSearchQuery(result.display_name);
        setShowResults(false);

        // If a mode is active, place the pin there automatically
        if (activeMode) {
            onLocationSelect(activeMode, lat, lng, result.display_name);
        }
    };

    // Close search results on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col space-y-3">
            {/* Map Controls */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-full">
                <button
                    type="button"
                    onClick={() => setActiveMode('pickup')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeMode === 'pickup' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white"></div>
                    Set Pickup
                </button>
                <button
                    type="button"
                    onClick={() => setActiveMode('dropoff')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeMode === 'dropoff' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white"></div>
                    Set Drop-off
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative z-50" ref={searchRef}>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchInput}
                        onFocus={() => {
                            if (searchQuery.trim().length >= 3) {
                                setShowResults(true);
                            }
                        }}
                        placeholder="Search for an address or landmark..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all shadow-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    {isSearching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-primary animate-spin" />
                    )}
                </div>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto z-[2000] divide-y divide-gray-50">
                        {searchResults.map((result) => (
                            <button
                                key={result.place_id}
                                type="button"
                                onClick={() => handleSelectResult(result)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3"
                            >
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-700 font-medium line-clamp-2">{result.display_name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {showResults && !isSearching && searchResults.length === 0 && searchQuery.trim().length >= 3 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl p-4 text-center z-[2000]">
                        <p className="text-sm text-gray-500">No locations found</p>
                    </div>
                )}
            </div>

            {/* Map Container */}
            <div className="relative w-full rounded-2xl overflow-hidden border-2 border-gray-200 shadow-inner group" style={{ height }}>
                {isReverseGeocoding && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 px-4 py-2 rounded-full text-sm font-bold text-brand-charcoal shadow-lg border border-gray-100 flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                        Getting address...
                    </div>
                )}

                {!activeMode && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-brand-charcoal/90 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl border border-white/10 flex items-center gap-2 animate-bounce cursor-pointer" onClick={() => setActiveMode('pickup')}>
                        <MapPin size={16} className="text-brand-accent" />
                        Tap "Set Pickup" or "Set Drop-off" to place pin
                    </div>
                )}

                <MapContainer
                    center={center}
                    zoom={zoom}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarkers
                        pickup={pickup}
                        dropoff={dropoff}
                        activeMode={activeMode}
                        onLocationSelect={onLocationSelect}
                        setIsReverseGeocoding={setIsReverseGeocoding}
                    />
                    <MapUpdater pickup={pickup} dropoff={dropoff} activeMode={activeMode} searchLocation={searchLocation} />
                </MapContainer>
            </div>
            <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5 px-2">
                <span className="text-lg">💡</span>
                Tip: Select "Set Pickup" or "Set Drop-off" then tap the map to place pins.
            </p>
        </div>
    );
};

export default MultiPointMapPicker;
