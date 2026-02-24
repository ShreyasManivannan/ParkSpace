import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search as SearchIcon, MapPin, Filter, ArrowRight, SlidersHorizontal, Navigation, Zap, X, Grid3x3, List, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../lib/api';

// Fix Leaflet default marker icon issue
if (typeof window !== 'undefined') {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

// Custom marker icon
const customIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMiA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTYgMEMxMC40NzcgMCA2IDQuNDc3IDYgMTBDNiAxNy41IDE2IDMyIDE2IDMyQzE2IDMyIDI2IDE3LjUgMjYgMTBDMjYgNC40NzcgMjEuNTIzIDAgMTYgMFoiIGZpbGw9IiMwMEZGQTMiLz4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjEwIiByPSI0IiBmaWxsPSIjMDAwMDAwIi8+Cjwvc3ZnPg==',
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48],
});

// Component to update map view
function MapController({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

// Mock data for demonstration
const MOCK_SPACES = [
    {
        id: 1,
        title: 'ALPHA NEXUS',
        address: '123 Broadway, New York, NY',
        pricePerHour: 45,
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop',
        amenities: ['WiFi', 'Coffee', 'Whiteboard'],
        capacity: 8
    },
    {
        id: 2,
        title: 'BETA STATION',
        address: '456 5th Avenue, New York, NY',
        pricePerHour: 65,
        imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=400&fit=crop',
        amenities: ['WiFi', 'Projector', 'Kitchen'],
        capacity: 12
    },
    {
        id: 3,
        title: 'GAMMA POINT',
        address: '789 Madison Ave, New York, NY',
        pricePerHour: 35,
        imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=400&fit=crop',
        amenities: ['WiFi', 'Printer'],
        capacity: 6
    },
    {
        id: 4,
        title: 'DELTA HUB',
        address: '321 Park Ave, New York, NY',
        pricePerHour: 55,
        imageUrl: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400&h=400&fit=crop',
        amenities: ['WiFi', 'Meeting Rooms', 'Lounge'],
        capacity: 15
    },
    {
        id: 5,
        title: 'EPSILON LABS',
        address: '555 Lexington Ave, New York, NY',
        pricePerHour: 75,
        imageUrl: 'https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?w=400&h=400&fit=crop',
        amenities: ['WiFi', 'Tech Lab', 'Podcast Studio'],
        capacity: 20
    },
    {
        id: 6,
        title: 'ZETA SPACE',
        address: '890 Wall Street, New York, NY',
        pricePerHour: 50,
        imageUrl: 'https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?w=400&h=400&fit=crop',
        amenities: ['WiFi', 'Kitchen', 'Terrace'],
        capacity: 10
    }
];

export default function Search() {
    const [spaces, setSpaces] = useState(MOCK_SPACES);
    const [filteredSpaces, setFilteredSpaces] = useState(MOCK_SPACES);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [sortBy, setSortBy] = useState('price-low');
    const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);
    const [mapZoom, setMapZoom] = useState(13);

    const fetchSpaces = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery.trim()) params.append('search', searchQuery.trim());
            params.append('minPrice', priceRange.min.toString());
            params.append('maxPrice', priceRange.max.toString());

            // For demonstration, we'll filter MOCK_SPACES locally
            let fetched = MOCK_SPACES.filter(space =>
                space.pricePerHour >= priceRange.min && space.pricePerHour <= priceRange.max
            );
            if (searchQuery.trim()) {
                fetched = fetched.filter(space =>
                    space.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    space.address.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            setSpaces(fetched); // Update base spaces
            setFilteredSpaces(fetched); // Initial filtered spaces before sorting

            if (fetched.length > 0) {
                // Assuming MOCK_SPACES have latitude/longitude, adding them for map functionality
                // For now, using a fixed center or first space's location if available
                // In a real app, you'd get lat/lng from API
                const firstSpace = fetched[0];
                if (firstSpace.latitude && firstSpace.longitude) {
                    setMapCenter([firstSpace.latitude, firstSpace.longitude]);
                } else {
                    // Fallback for mock data without lat/lng
                    setMapCenter([40.7128, -74.0060]); // New York City
                }
            } else {
                setMapCenter([40.7128, -74.0060]); // Default to NYC if no spaces
            }
        } catch (error) {
            console.error('Failed to fetch spaces:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSpaces();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, priceRange]);

    // Sorting logic
    useEffect(() => {
        if (!spaces.length) {
            setFilteredSpaces([]);
            return;
        }

        let sorted = [...spaces].sort((a, b) => { // Sort from the base 'spaces' after filtering
            switch (sortBy) {
                case 'price-low': return a.pricePerHour - b.pricePerHour;
                case 'price-high': return b.pricePerHour - a.pricePerHour;
                case 'capacity-high': return (b.capacity || 0) - (a.capacity || 0);
                case 'name': return a.title.localeCompare(b.title);
                default: return 0;
            }
        });
        setFilteredSpaces(sorted);
    }, [sortBy, spaces]); // Depend on 'spaces' to re-sort when base data changes

    const handleSpaceClick = (space) => {
        setSelectedSpace(space);
        // Assuming mock spaces have latitude/longitude for map interaction
        if (space.latitude && space.longitude) {
            setMapCenter([space.latitude, space.longitude]);
            setMapZoom(16);
        }

        if (window.innerWidth < 1024) {
            document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleMarkerClick = (space) => {
        setSelectedSpace(space);
        if (space.latitude && space.longitude) {
            setMapCenter([space.latitude, space.longitude]);
            setMapZoom(16);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchSpaces();
    };

    const resetFilters = () => {
        setSearchQuery('');
        setPriceRange({ min: 0, max: 100 });
        setSortBy('price-low');
        setShowFilters(false);
    };

    return (
        <div className="min-h-screen bg-black selection:bg-primary-500/30">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700&display=swap');
                
                * {
                    font-family: 'Rajdhani', sans-serif;
                }
                
                .font-display {
                    font-family: 'Orbitron', monospace;
                }
                
                .glass {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .glass-shine {
                    position: relative;
                    overflow: hidden;
                }
                
                .glass-shine::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(0, 255, 163, 0.1), transparent);
                    animation: shine 3s infinite;
                }
                
                @keyframes shine {
                    to { left: 100%; }
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #00FFA3 0%, #00CC82 100%);
                    color: #000;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    transition: all 0.3s ease;
                }
                
                .btn-primary:hover {
                    box-shadow: 0 0 30px rgba(0, 255, 163, 0.5);
                    transform: translateY(-2px);
                }
                
                .shadow-neon {
                    box-shadow: 0 0 20px rgba(0, 255, 163, 0.3);
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 255, 163, 0.3);
                    border-radius: 4px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 255, 163, 0.5);
                }
                
                .bg-scanline {
                    background: repeating-linear-gradient(
                        0deg,
                        rgba(0, 255, 163, 0.03),
                        rgba(0, 255, 163, 0.03) 1px,
                        transparent 1px,
                        transparent 2px
                    );
                }
                
                .animate-pulse-slow {
                    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .space-card {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .space-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(0, 255, 163, 0.3) !important;
                }
                
                .space-card.selected {
                    border-color: rgba(0, 255, 163, 0.5) !important;
                    background: rgba(0, 255, 163, 0.05) !important;
                }

                .amenity-tag {
                    display: inline-block;
                    padding: 4px 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: rgba(255, 255, 255, 0.6);
                }
            `}</style>

            {/* Search Header */}
            <div className="fixed top-0 left-0 right-0 z-50 pt-6 px-4 pb-4 bg-gradient-to-b from-black via-black to-transparent pointer-events-none">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 pointer-events-auto">
                    <form
                        onSubmit={handleSearch}
                        className="flex-1 flex gap-2 p-2 glass glass-shine rounded-3xl shadow-2xl"
                    >
                        <div className="flex-1 flex items-center gap-3 px-4">
                            <SearchIcon className="w-5 h-5 text-primary-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by location, title, or network node..."
                                className="w-full bg-transparent border-none text-white placeholder-gray-500 font-medium focus:ring-0 text-sm py-3 outline-none"
                            />
                        </div>
                        <button type="submit" className="btn-primary py-3 px-8 rounded-2xl shadow-neon text-xs">
                            SCAN
                        </button>
                    </form>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-4 rounded-2xl border backdrop-blur-2xl transition-all duration-300 flex items-center gap-3 ${showFilters
                                ? 'bg-primary-500 text-black border-primary-500'
                                : 'glass text-white hover:border-white/30'
                                }`}
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            <span className="text-xs font-black uppercase tracking-widest hidden md:block">
                                Filters
                            </span>
                        </button>

                        <button
                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                            className="p-4 rounded-2xl border glass text-white hover:border-white/30 transition-all duration-300"
                            title="Toggle view"
                        >
                            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Filters Dropdown */}
                {showFilters && (
                    <div className="max-w-md mx-auto md:ml-auto md:mr-0 mt-4 pointer-events-auto">
                        <div className="glass bg-black/90 p-8 rounded-3xl shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-black text-primary-500 uppercase tracking-widest flex items-center gap-2">
                                    <Filter className="w-4 h-4" /> Filter Parameters
                                </h3>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="text-gray-500 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-xs font-black text-gray-500 uppercase">
                                        <span>Price Range</span>
                                        <span className="text-white">${priceRange.min} - ${priceRange.max}/HR</span>
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                                            className="w-full accent-primary-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                                            className="w-full accent-primary-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-xs font-black text-gray-500 uppercase">Sort By</div>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-primary-500 cursor-pointer"
                                    >
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="capacity-high">Capacity: High to Low</option>
                                        <option value="name">Name: A to Z</option>
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={resetFilters}
                                        className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black text-white uppercase tracking-widest transition-all"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="flex-1 py-4 btn-primary rounded-xl text-xs"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row h-screen pt-24 lg:pt-20">
                {/* List Section */}
                <div className="w-full lg:w-[480px] p-4 lg:p-6 overflow-y-auto custom-scrollbar bg-black">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">
                                Available <span className="text-primary-500">Nodes</span>
                            </h2>
                            <span className="text-xs font-black text-gray-500 tracking-widest glass px-4 py-2 rounded-full uppercase">
                                {filteredSpaces.length} Results
                            </span>
                        </div>

                        {isLoading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="glass rounded-3xl p-6 h-48 animate-pulse" />
                            ))
                        ) : filteredSpaces.length === 0 ? (
                            <div className="text-center py-20 glass rounded-3xl border-dashed">
                                <Navigation className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                                <p className="text-sm font-black text-gray-500 uppercase tracking-widest">
                                    No nodes found in this sector
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="mt-4 btn-primary py-2 px-6 rounded-xl text-xs"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <motion.div
                                layout
                                className={viewMode === 'grid' ? 'grid grid-cols-1 gap-4' : 'space-y-4'}
                            >
                                {filteredSpaces.map((space) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={space.id}
                                        onClick={() => handleSpaceClick(space)}
                                        className={`space-card glass cursor-pointer rounded-2xl overflow-hidden ${selectedSpace?.id === space.id ? 'selected' : ''
                                            }`}
                                    >
                                        <div className="flex gap-4 p-5">
                                            <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                                                {space.imageUrl ? (
                                                    <img
                                                        src={space.imageUrl}
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                                        alt={space.title}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <MapPin className="w-8 h-8 text-gray-700" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-lg font-black text-white truncate font-display uppercase tracking-tight">
                                                        {space.title}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold uppercase tracking-wide mt-1">
                                                        <MapPin className="w-3 h-3 text-primary-500/60" />
                                                        <span className="truncate">{space.address}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-end justify-between mt-2">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-black text-primary-500 font-display">
                                                            ${space.pricePerHour}
                                                        </span>
                                                        <span className="text-gray-600 text-xs font-black uppercase">/HR</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-scanline opacity-50 h-px" />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Map Section */}
                <div id="map-section" className="flex-1 relative bg-gray-900 border-l border-white/5">
                    <MapContainer
                        center={mapCenter}
                        zoom={mapZoom}
                        className="w-full h-full"
                        zoomControl={true}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        <MapController center={mapCenter} zoom={mapZoom} />

                        {filteredSpaces.map((space) => (
                            <Marker
                                key={space.id}
                                position={[space.latitude, space.longitude]}
                                icon={customIcon}
                                eventHandlers={{
                                    click: () => handleMarkerClick(space),
                                }}
                            >
                                <Popup className="premium-popup">
                                    <div className="p-2 min-w-[150px]">
                                        <h3 className="font-bold text-sm text-primary-500">{space.title}</h3>
                                        <p className="text-xs text-gray-300 mb-2">{space.address}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-black">${space.pricePerHour}/hr</span>
                                            <button
                                                onClick={() => alert(`Booking ${space.title}`)}
                                                className="bg-primary-500 text-black px-3 py-1 rounded text-[10px] font-black"
                                            >
                                                BOOK
                                            </button>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Selected Space Overlay */}
                    <AnimatePresence>
                        {selectedSpace && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="absolute top-6 right-6 z-[1000] w-72"
                            >
                                <div className="glass bg-black/90 p-5 rounded-2xl shadow-2xl backdrop-blur-3xl border-primary-500/30 border">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-black text-white font-display uppercase leading-tight">
                                            {selectedSpace.title}
                                        </h3>
                                        <button onClick={() => setSelectedSpace(null)} className="text-gray-500 hover:text-white">
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <MapPin size={14} className="text-primary-500" />
                                            <span className="truncate">{selectedSpace.address}</span>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-primary-500 font-display">${selectedSpace.pricePerHour}</span>
                                            <span className="text-gray-500 text-xs font-bold uppercase">/hour</span>
                                        </div>
                                        <button
                                            onClick={() => alert(`Booking ${selectedSpace.title}`)}
                                            className="w-full btn-primary py-3 rounded-xl text-xs"
                                        >
                                            RESERVE NODE
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Network Status */}
            <div className="fixed bottom-6 right-6 z-[1000]">
                <div className="glass bg-black/80 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl backdrop-blur-3xl border border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-slow shadow-neon" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">
                            Network Online
                        </span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary-500" />
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                            {filteredSpaces.length} NODES
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}