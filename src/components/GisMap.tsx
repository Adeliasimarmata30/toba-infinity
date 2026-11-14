import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { TOBA_DESTINATIONS, TOBA_HOTELS } from '../data/tobaData';
import { searchTobaDocuments } from '../services/database';
import {
  Search, MapPin, Filter, Star, Navigation, Compass, Volume2, VolumeX, Mic, MicOff,
  Layers, Shuffle, Activity, Calendar, ShieldAlert, CheckSquare, Trash2, HelpCircle,
  Award, Sparkles, BookOpen, Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface MapItem {
  id: string;
  name: string;
  type: 'destination' | 'hotel' | 'culinary';
  latitude: number;
  longitude: number;
  district: string;
  category: string;
  image: string;
  priceOrTicket: string;
  rating: number;
  facilities: string[];
  description: string;
}

// Simulated Nearby Amenities (ATM, Hospital, Fuel, etc.)
interface Amenity {
  id: string;
  name: string;
  type: 'atm' | 'hospital' | 'fuel' | 'cafe';
  latitude: number;
  longitude: number;
}

// Simulated Current Locations
const CURRENT_LOCATIONS = [
  { id: 'loc-balige', name: '📍 Balige (Selatan Danau Toba)', lat: 2.3344, lng: 99.0645 },
  { id: 'loc-parapat', name: '📍 Parapat (Gerbang Utama)', lat: 2.6625, lng: 98.9372 },
  { id: 'loc-medan', name: '📍 Bandara Kualanamu (Medan)', lat: 3.6422, lng: 98.8852 }
];

export default function GisMap() {
  const { language, t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const amenityMarkersRef = useRef<L.Marker[]>([]);
  const currentLocMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // General States
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Semua Kabupaten');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [supabaseSearchResults, setSupabaseSearchResults] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<MapItem | null>(null);

  // --- NEW ADVANCED GIS FEATURES STATES ---
  const [userLocation, setUserLocation] = useState({ lat: 2.6625, lng: 98.9372, name: 'Parapat' });
  const [selectedLocationId, setSelectedLocationId] = useState('loc-parapat');

  // Radius Search
  const [enableRadiusFilter, setEnableRadiusFilter] = useState(false);
  const [searchRadiusKm, setSearchRadiusKm] = useState(15);

  // Heatmap layer active
  const [enableHeatmap, setEnableHeatmap] = useState(false);
  const [heatmapCircles, setHeatmapCircles] = useState<L.Circle[]>([]);

  // Nearby amenities active
  const [showAmenities, setShowAmenities] = useState<string[]>([]); // 'atm', 'hospital', 'fuel', 'cafe'

  // AI Route Optimizer Checklist
  const [selectedRouteIds, setSelectedRouteIds] = useState<string[]>([]);
  const [optimizedRoutePath, setOptimizedRoutePath] = useState<MapItem[]>([]);
  const [routeDistanceText, setRouteDistanceText] = useState('');
  const [routeDurationText, setRouteDurationText] = useState('');

  // AI Story Mode (TTS)
  const [isSpeakingStory, setIsSpeakingStory] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Destination Comparison
  const [compareItemA, setCompareItemA] = useState<string>('');
  const [compareItemB, setCompareItemB] = useState<string>('');

  // Travel Risk Assistant Panel details
  const [showRiskAlert, setShowRiskAlert] = useState(true);

  // Geopark Explorer Badge System States
  const [activeSidebarTab, setActiveSidebarTab] = useState<'controls' | 'badges'>('controls');
  const [visitedSpotIds, setVisitedSpotIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toba_geopark_visited_locations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [celebrationBadge, setCelebrationBadge] = useState<any | null>(null);
  const [checkInNotification, setCheckInNotification] = useState<string | null>(null);

  // Define Geopark Badges Definition
  const GEOPARK_BADGES = [
    {
      id: 'caldera-pioneer',
      title: { id: 'Perintis Kaldera', en: 'Caldera Pioneer' },
      description: { id: 'Ambil langkah pertama Anda dengan mengunjungi geosite apa pun di peta.', en: 'Take your first step by visiting any geosite on the map.' },
      iconName: 'Compass' as const,
      colorClass: 'text-sky-600',
      bgClass: 'bg-sky-50',
      borderClass: 'border-sky-200',
      checkUnlocked: (visitedIds: string[]) => visitedIds.length >= 1,
      getProgress: (visitedIds: string[]) => ({
        current: Math.min(visitedIds.length, 1),
        total: 1
      })
    },
    {
      id: 'cultural-sage',
      title: { id: 'Bijak Budaya Batak', en: 'Cultural Sage' },
      description: { id: 'Mendalami sejarah luhur Batak di 2 situs budaya (Huta Siallagan, Desa Tomok, atau Batu Kursi).', en: 'Deepen your knowledge of Batak legacy at 2 cultural sites (Huta Siallagan, Tomok Village, or Batu Kursi).' },
      iconName: 'BookOpen' as const,
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-200',
      checkUnlocked: (visitedIds: string[]) => {
        const cultureSites = ['dest-siallagan', 'dest-tomok', 'dest-batukursi', 'dest-simanindo', 'dest-tbsilalahi'];
        const visitedCount = visitedIds.filter(id => cultureSites.includes(id)).length;
        return visitedCount >= 2;
      },
      getProgress: (visitedIds: string[]) => {
        const cultureSites = ['dest-siallagan', 'dest-tomok', 'dest-batukursi', 'dest-simanindo', 'dest-tbsilalahi'];
        const visitedCount = visitedIds.filter(id => cultureSites.includes(id)).length;
        return {
          current: Math.min(visitedCount, 2),
          total: 2
        };
      }
    },
    {
      id: 'summit-master',
      title: { id: 'Penakluk Puncak', en: 'Summit Master' },
      description: { id: 'Daki titik ketinggian spektakuler di 2 bukit terindah (Bukit Holbung, Menara Tele, Bukit Sibea-bea, atau Sipinsur).', en: 'Climb high and enjoy spectacular views at 2 majestic viewpoints (Bukit Holbung, Menara Tele, Bukit Sibea-bea, or Sipinsur).' },
      iconName: 'Award' as const,
      colorClass: 'text-indigo-600',
      bgClass: 'bg-indigo-50',
      borderClass: 'border-indigo-200',
      checkUnlocked: (visitedIds: string[]) => {
        const summits = ['dest-holbung', 'dest-tele', 'dest-sibeabea', 'dest-sipinsur'];
        const visitedCount = visitedIds.filter(id => summits.includes(id)).length;
        return visitedCount >= 2;
      },
      getProgress: (visitedIds: string[]) => {
        const summits = ['dest-holbung', 'dest-tele', 'dest-sibeabea', 'dest-sipinsur'];
        const visitedCount = visitedIds.filter(id => summits.includes(id)).length;
        return {
          current: Math.min(visitedCount, 2),
          total: 2
        };
      }
    },
    {
      id: 'waterfalls-seeker',
      title: { id: 'Pemburu Air Terjun', en: 'Waterfalls Seeker' },
      description: { id: 'Kunjungi 2 geosite air terjun atau pantai eksotis (Air Terjun Sipiso-piso, Air Terjun Efrata, atau Pantai Parbaba).', en: 'Visit 2 majestic waterfalls or exotic beaches (Sipiso-piso Waterfall, Efrata Waterfall, or Parbaba Beach).' },
      iconName: 'Activity' as const,
      colorClass: 'text-rose-600',
      bgClass: 'bg-rose-50',
      borderClass: 'border-rose-200',
      checkUnlocked: (visitedIds: string[]) => {
        const waters = ['dest-sipisopiso', 'dest-efrata', 'dest-parbaba', 'dest-bulbul'];
        const visitedCount = visitedIds.filter(id => waters.includes(id)).length;
        return visitedCount >= 2;
      },
      getProgress: (visitedIds: string[]) => {
        const waters = ['dest-sipisopiso', 'dest-efrata', 'dest-parbaba', 'dest-bulbul'];
        const visitedCount = visitedIds.filter(id => waters.includes(id)).length;
        return {
          current: Math.min(visitedCount, 2),
          total: 2
        };
      }
    },
    {
      id: 'grand-geopark-legend',
      title: { id: 'Legenda Geopark Agung', en: 'Grand Geopark Legend' },
      description: { id: 'Menjadi legenda penjelajah sejati dengan mengunjungi minimal 5 lokasi geosite apa pun di peta.', en: 'Become a true explorer legend by visiting at least 5 geosite locations of any category.' },
      iconName: 'Sparkles' as const,
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50 border-emerald-500/10 shadow-emerald-500/10',
      borderClass: 'border-emerald-200',
      checkUnlocked: (visitedIds: string[]) => visitedIds.length >= 5,
      getProgress: (visitedIds: string[]) => ({
        current: Math.min(visitedIds.length, 5),
        total: 5
      })
    }
  ];

  const getBadgeIcon = (name: string, className: string) => {
    switch (name) {
      case 'Compass':
        return <Compass className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'Activity':
        return <Activity className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      default:
        return <Compass className={className} />;
    }
  };

  const handleCheckIn = (id: string) => {
    if (visitedSpotIds.includes(id)) return;

    const updated = [...visitedSpotIds, id];
    setVisitedSpotIds(updated);
    localStorage.setItem('toba_geopark_visited_locations', JSON.stringify(updated));

    // Find newly unlocked badges
    const newlyUnlocked = GEOPARK_BADGES.filter(badge => {
      const wasLocked = !badge.checkUnlocked(visitedSpotIds);
      const isUnlockedNow = badge.checkUnlocked(updated);
      return wasLocked && isUnlockedNow;
    });

    if (newlyUnlocked.length > 0) {
      setCelebrationBadge(newlyUnlocked[0]);
    } else {
      setCheckInNotification(`Berhasil check-in! Kemajuan Anda di geosite dicatat.`);
      setTimeout(() => {
        setCheckInNotification(null);
      }, 4000);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat petualangan dan lencana Geopark Anda?')) {
      setVisitedSpotIds([]);
      localStorage.removeItem('toba_geopark_visited_locations');
    }
  };

  // Prepare normalized map items
  const mapItems: MapItem[] = [
    ...TOBA_DESTINATIONS.map(d => ({
      id: d.id,
      name: d.name,
      type: 'destination' as const,
      latitude: d.latitude,
      longitude: d.longitude,
      district: d.district,
      category: d.category,
      image: d.image,
      priceOrTicket: d.ticketPrice === 0 ? 'Gratis' : `Rp ${d.ticketPrice.toLocaleString('id-ID')}`,
      rating: d.rating,
      facilities: d.facilities,
      description: d.description
    })),
    ...TOBA_HOTELS.map(h => ({
      id: h.id,
      name: h.name,
      type: 'hotel' as const,
      latitude: h.latitude,
      longitude: h.longitude,
      district: h.district,
      category: 'Akomodasi',
      image: h.image,
      priceOrTicket: h.priceRange.split('-')[0].trim(),
      rating: h.rating,
      facilities: h.facilities,
      description: h.description
    }))
  ];
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSupabaseSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await searchTobaDocuments(searchQuery, 20);
      setSupabaseSearchResults(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Convert hasil Supabase menjadi MapItem
const supabaseMapItems: MapItem[] = supabaseSearchResults.map((doc: any) => {
  const metadata = doc.metadata || {};
  const content = doc.content || '';

  // Ambil koordinat dari content:
  // lat-long: 2.5305337914347272, 98.69783122383308
  const latLongMatch = content.match(
    /lat-long:\s*([-\d.]+)\s*,\s*([-\d.]+)/i
  );

  const latitude = latLongMatch
    ? Number(latLongMatch[1])
    : Number(metadata.latitude || 0);

  const longitude = latLongMatch
    ? Number(latLongMatch[2])
    : Number(metadata.longitude || 0);

  // Rating
  const ratingMatch = content.match(
    /(?:rating|place-rating):\s*([\d.,]+)/i
  );

  const rating = Number(
    metadata.rating ??
      metadata['place-rating'] ??
      ratingMatch?.[1]?.replace(',', '.') ??
      0
  );

  // Nama tempat
  const name =
    metadata.place ||
    metadata['place-name'] ||
    content.match(/place-name:\s*(.+)/i)?.[1]?.trim() ||
    'Destinasi Toba';

  // Alamat
  const address =
    metadata.address ||
    content.match(/address:\s*(.+)/i)?.[1]?.trim() ||
    '';

  // Kabupaten
  let district = 'Toba';

  if (/samosir/i.test(address)) {
    district = 'Samosir';
  } else if (/toba/i.test(address)) {
    district = 'Toba';
  } else if (/simalungun/i.test(address)) {
    district = 'Simalungun';
  } else if (/karo/i.test(address)) {
    district = 'Karo';
  } else if (/dairi/i.test(address)) {
    district = 'Dairi';
  } else if (/hum|humbang/i.test(address)) {
    district = 'Humbang Hasundutan';
  } else if (/pakpak/i.test(address)) {
    district = 'Pakpak Bharat';
  } else if (/tapanuli utara/i.test(address)) {
    district = 'North Tapanuli';
  }

  return {
    id: `supabase-${doc.id}`,
    name,
    type: 'destination' as const,
    latitude,
    longitude,
    district,
    category: metadata.category === 'wisata'
      ? 'Nature'
      : 'Akomodasi',
    image: '',
    priceOrTicket: metadata.price_from
      ? `Rp ${Number(metadata.price_from).toLocaleString('id-ID')}`
      : 'Lihat detail',
    rating,
    facilities: [],
    description: content
  };
});

// Gabungkan data lokal + Supabase
const allMapItems: MapItem[] = [
  ...mapItems,
  ...supabaseMapItems
];

  // Districts and categories
  const districts = ['Semua Kabupaten', ...Array.from(new Set(mapItems.map(item => item.district)))];
  const categories = ['Semua Kategori', 'Nature', 'Culture', 'Family', 'Akomodasi'];

  // Helper: Haversine distance calculator
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter items (incorporates search query, category, district AND optional radius)
  const filteredItems = allMapItems.filter(item => {
    const matchesDistrict = selectedDistrict === 'Semua Kabupaten' || item.district === selectedDistrict;
    const matchesCategory = selectedCategory === 'Semua Kategori' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesRadius = true;
    if (enableRadiusFilter) {
      const dist = calculateDistance(userLocation.lat, userLocation.lng, item.latitude, item.longitude);
      matchesRadius = dist <= searchRadiusKm;
    }

    return matchesDistrict && matchesCategory && matchesSearch && matchesRadius;
  });

  // Handle change of user location simulation
  const handleUserLocationChange = (locId: string) => {
    const found = CURRENT_LOCATIONS.find(l => l.id === locId);
    if (found) {
      setSelectedLocationId(locId);
      setUserLocation({ lat: found.lat, lng: found.lng, name: found.name });
      if (mapRef.current) {
        mapRef.current.setView([found.lat, found.lng], 11);
      }
    }
  };

  // Find nearest destination
  const handleFindNearest = () => {
    let nearestItem: MapItem | null = null;
    let minDistance = Infinity;

    filteredItems.forEach(item => {
      const d = calculateDistance(userLocation.lat, userLocation.lng, item.latitude, item.longitude);
      if (d < minDistance) {
        minDistance = d;
        nearestItem = item;
      }
    });

    if (nearestItem) {
      setActiveItem(nearestItem);
      mapRef.current?.setView([nearestItem.latitude, nearestItem.longitude], 13);
      alert(`🎉 Destinasi Terdekat dari posisi Anda adalah: ${nearestItem.name} (${minDistance.toFixed(1)} km)`);
    }
  };

  // Toggle amenities display
  const toggleAmenityType = (type: string) => {
    if (showAmenities.includes(type)) {
      setShowAmenities(showAmenities.filter(t => t !== type));
    } else {
      setShowAmenities([...showAmenities, type]);
    }
  };

  // Render simulated amenities dynamically on active item or map view change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing amenity markers
    amenityMarkersRef.current.forEach(m => m.remove());
    amenityMarkersRef.current = [];

    if (showAmenities.length === 0) return;

    // Generate simulated nearby amenities around current map center or active item
    const centerLat = activeItem ? activeItem.latitude : map.getCenter().lat;
    const centerLng = activeItem ? activeItem.longitude : map.getCenter().lng;

    // Generate deterministic amenities based on coordinates
    const types: ('atm' | 'hospital' | 'fuel' | 'cafe')[] = ['atm', 'hospital', 'fuel', 'cafe'];
    const amenitiesList: Amenity[] = [];

    showAmenities.forEach((t) => {
      // Create 3 mock locations for each requested type
      for (let i = 1; i <= 3; i++) {
        const offsetLat = (Math.sin(centerLat * i * 10) * 0.015);
        const offsetLng = (Math.cos(centerLng * i * 10) * 0.015);
        amenitiesList.push({
          id: `amenity-${t}-${i}`,
          name: `${t.toUpperCase()} Terdekat #${i}`,
          type: t as any,
          latitude: centerLat + offsetLat,
          longitude: centerLng + offsetLng
        });
      }
    });

    // Place markers
    amenitiesList.forEach(am => {
      let iconColor = '#10b981'; // green for cafe/misc
      if (am.type === 'hospital') iconColor = '#ef4444'; // red
      if (am.type === 'atm') iconColor = '#3b82f6'; // blue
      if (am.type === 'fuel') iconColor = '#f59e0b'; // amber

      const customHtml = `
        <div class="flex items-center justify-center w-6 h-6 rounded-full border border-white shadow-md text-white text-[10px] font-black" style="background-color: ${iconColor};">
          ${am.type.substring(0, 1).toUpperCase()}
        </div>
      `;

      const icon = L.divIcon({
        html: customHtml,
        className: 'amenity-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const m = L.marker([am.latitude, am.longitude], { icon })
        .addTo(map)
        .bindPopup(`<b>${am.name}</b><br/>Amenitas Sekitar Pariwisata`);

      amenityMarkersRef.current.push(m);
    });

  }, [showAmenities, activeItem]);

  // AI Story Mode (TTS and audio visualization waves)
  const handleToggleStorySpeech = (storyText: string) => {
    if (isSpeakingStory) {
      window.speechSynthesis.cancel();
      setIsSpeakingStory(false);
      return;
    }

    if (!storyText) return;

    window.speechSynthesis.cancel(); // safety reset
    const utterance = new SpeechSynthesisUtterance(storyText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsSpeakingStory(false);
    };

    utterance.onerror = () => {
      setIsSpeakingStory(false);
    };

    speechUtteranceRef.current = utterance;
    setIsSpeakingStory(true);
    window.speechSynthesis.speak(utterance);
  };

  // Pre-compiled Story Modes for top destinations
  const getStoryText = (item: MapItem) => {
    if (item.id === 'dest-holbung') {
      return "Legenda perbukitan Sabana Bukit Holbung berakar dari mitologi suku Batak purba. Dipercaya bukit indah ini dahulu kala adalah altar raksasa tempat berteduh para naga sakti penjaga kaldera Toba sebelum melesat kembali ke Banua Ginjand atau khayangan. Menatap fajar merah di sabana Holbung dipercaya membawa kedamaian batin tak terhingga.";
    }
    if (item.id === 'dest-siallagan') {
      return "Huta Siallagan adalah saksi bisu penegakan hukum adat Batak kuno yang sangat tegas. Kursi persidangan batu berumur lebih dari 200 tahun ini digunakan Raja Siallagan untuk merundingkan hukuman bagi pelanggar adat berat. Pelaku kejahatan sihir hitam sebelum dieksekusi pancung akan diuji ilmunya oleh datu sakti dan diberi racun pelemah.";
    }
    return `Destinasi ${item.name} merupakan bagian dari keajaiban Geopark Global Kaldera Toba UNESCO. Situs bersejarah ini menawarkan kombinasi kekayaan geologi letusan supervolcano masa lampau dengan pelestarian tradisi budaya leluhur suku Batak yang terus lestari hingga generasi infinity saat ini.`;
  };

  // AI Route Optimizer Algorithm (Nearest Neighbor TSP)
  const handleOptimizeRoute = () => {
    if (selectedRouteIds.length < 2) {
      alert("⚠️ Silakan pilih minimal 2 destinasi di daftar checklist untuk dioptimasi rutenya.");
      return;
    }

    const itemsToOptimize = mapItems.filter(i => selectedRouteIds.includes(i.id));

    // Start optimization from current user simulated location
    let currentLat = userLocation.lat;
    let currentLng = userLocation.lng;

    const unvisited = [...itemsToOptimize];
    const optimizedPath: MapItem[] = [];
    let totalDistance = 0;

    while (unvisited.length > 0) {
      let nearestIndex = -1;
      let minD = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const d = calculateDistance(currentLat, currentLng, unvisited[i].latitude, unvisited[i].longitude);
        if (d < minD) {
          minD = d;
          nearestIndex = i;
        }
      }

      if (nearestIndex !== -1) {
        totalDistance += minD;
        const nextItem = unvisited.splice(nearestIndex, 1)[0];
        optimizedPath.push(nextItem);
        currentLat = nextItem.latitude;
        currentLng = nextItem.longitude;
      }
    }

    setOptimizedRoutePath(optimizedPath);
    setRouteDistanceText(`${totalDistance.toFixed(1)} km`);
    // Estimate speed of driving on mountainous lake terrain (avg 35 km/h)
    const hours = totalDistance / 35;
    const mins = Math.round(hours * 60);
    setRouteDurationText(`${mins} Menit`);

    // Draw routing line on Leaflet map
    const map = mapRef.current;
    if (map) {
      // Clear old polyline
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
      }

      const points: L.LatLngTuple[] = [
        [userLocation.lat, userLocation.lng],
        ...optimizedPath.map(item => [item.latitude, item.longitude] as L.LatLngTuple)
      ];

      const poly = L.polyline(points, {
        color: '#f59e0b',
        weight: 5,
        opacity: 0.85,
        dashArray: '10, 10',
        lineCap: 'round'
      }).addTo(map);

      routePolylineRef.current = poly;

      // Auto-fit to route bounds
      map.fitBounds(poly.getBounds().pad(0.1));
    }
  };

  // Toggle item in route checklist
  const toggleRouteSelection = (id: string) => {
    if (selectedRouteIds.includes(id)) {
      setSelectedRouteIds(selectedRouteIds.filter(x => x !== id));
    } else {
      setSelectedRouteIds([...selectedRouteIds, id]);
    }
  };

  const handleClearRouteSelections = () => {
    setSelectedRouteIds([]);
    setOptimizedRoutePath([]);
    setRouteDistanceText('');
    setRouteDurationText('');
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
  };

  // Cleanup speech synthesizers on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Initialize Map canvas
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Samosir / Lake Toba center coordinate
    const map = L.map(mapContainerRef.current, {
      center: [2.62, 98.80],
      zoom: 10,
      zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync Markers and Radius/Heatmap overlays
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing core markers & current loc marker
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (currentLocMarkerRef.current) {
      currentLocMarkerRef.current.remove();
      currentLocMarkerRef.current = null;
    }

    // Clean up heatmap circles
    heatmapCircles.forEach(c => c.remove());

    // 1. Draw Simulated Current Location Marker
    const currentLocIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-10 h-10 animate-pulse">
          <div class="absolute w-8 h-8 rounded-full bg-emerald-500 opacity-30 animate-ping"></div>
          <div class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center shadow-lg">
            <span class="text-[9px] text-white font-bold">POS</span>
          </div>
        </div>
      `,
      className: 'user-pos-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    currentLocMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: currentLocIcon })
      .addTo(map)
      .bindPopup(`<b>Posisi Saya (Simulasi)</b><br/>${userLocation.name}`);

    // 2. Draw Heatmap overlay circles if enabled
    const newHeatmapCircles: L.Circle[] = [];
    if (enableHeatmap) {
      mapItems.forEach(item => {
        // High dense visual representation
        const radius = 1800 + (item.rating * 500);
        const circle = L.circle([item.latitude, item.longitude], {
          color: '#ef4444',
          fillColor: '#f87171',
          fillOpacity: 0.35,
          radius: radius,
          weight: 1
        }).addTo(map);
        newHeatmapCircles.push(circle);
      });
      setHeatmapCircles(newHeatmapCircles);
    }

    // 3. Draw filtered regular items
    filteredItems.forEach(item => {
      let markerColor = '#0ea5e9'; // Blue for Nature/Family
      if (item.type === 'hotel') markerColor = '#ec4899'; // Pink for Hotels
      if (item.category === 'Culture') markerColor = '#f59e0b'; // Gold for Culture

      const customSvg = `
        <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg group hover:scale-110 transition-transform" style="background-color: ${markerColor};">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `;

      const icon = L.divIcon({
        html: customSvg,
        className: 'custom-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([item.latitude, item.longitude], { icon })
        .addTo(map)
        .on('click', () => {
          setActiveItem(item);
          map.setView([item.latitude, item.longitude], 13);
        });

      const distanceText = calculateDistance(userLocation.lat, userLocation.lng, item.latitude, item.longitude).toFixed(1);

      marker.bindPopup(`
        <div style="width: 180px;">
          <p style="font-weight: 700; font-size: 14px; margin: 0 0 4px 0; color: #1e293b;">${item.name}</p>
          <p style="font-size: 11px; margin: 0 0 6px 0; color: #64748b;">${item.district} (${item.category})</p>
          <p style="font-size: 11px; margin: 0; font-weight: 600; color: #10b981;">🚗 Jarak: ${distanceText} km</p>
        </div>
      `);

      markersRef.current.push(marker);
    });

  }, [selectedDistrict, selectedCategory, searchQuery, enableRadiusFilter, searchRadiusKm, userLocation, enableHeatmap]);

  const handleSelectItem = (item: MapItem) => {
    setActiveItem(item);
    if (mapRef.current) {
      mapRef.current.setView([item.latitude, item.longitude], 14);
    }
  };

  // Comparation grid variables
  const itemAData = mapItems.find(i => i.id === compareItemA);
  const itemBData = mapItems.find(i => i.id === compareItemB);

  return (
    <div id="advanced-gis-view" className="flex flex-col lg:flex-row h-[calc(110vh-92px)] rounded-3xl overflow-hidden border border-slate-100 shadow-2xl bg-white">

      {/* SIDEBAR PANELS CONTROLS */}
      <div className="w-full lg:w-[420px] border-r border-slate-100 flex flex-col bg-slate-50/50 overflow-y-auto">

        {/* UPPER BRAND & SEARCH */}
        <div className="p-4 bg-slate-900 text-white space-y-3.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-sky-400 animate-spin-slow" />
              <div>
                <h2 className="font-display font-black text-sm tracking-wider">GEOSPATIAL INTEL</h2>
                <p className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">Toba Caldera Smart GIS</p>
              </div>
            </div>
            <span className="text-[9px] bg-sky-500/20 text-sky-400 font-mono border border-sky-500/30 px-2 py-0.5 rounded-full uppercase">Engine v3.0</span>
          </div>

          {/* SIMULATED LOCATION LAUNCHER */}
          <div className="space-y-1">
            <label className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">Titik Awal Sesi (Simulasi GPS Anda)</label>
            <div className="flex gap-1">
              <select
                value={selectedLocationId}
                onChange={(e) => handleUserLocationChange(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-800 text-slate-100 rounded-lg border border-slate-700 outline-none"
              >
                {CURRENT_LOCATIONS.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
              <button
                onClick={handleFindNearest}
                className="px-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 hover:-translate-y-0.5 text-white text-xs font-bold rounded-lg shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                title="Temukan Destinasi Terdekat dari Posisi GPS"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Terdekat
              </button>
            </div>
          </div>

          {/* GLOBAL SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari bukit, air terjun, hotel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-slate-700 rounded-lg text-xs bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:bg-slate-800/80 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* TAB SELECTION FOR SIDEBAR */}
        <div className="flex bg-slate-100 border-b border-slate-200">
          <button
            onClick={() => setActiveSidebarTab('controls')}
            className={`flex-1 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-2 ${activeSidebarTab === 'controls'
                ? 'bg-white text-slate-900 border-sky-500'
                : 'text-slate-500 hover:text-slate-800 border-transparent bg-slate-50/50'
              }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Peta & Analisis
          </button>
          <button
            onClick={() => setActiveSidebarTab('badges')}
            className={`flex-1 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-2 ${activeSidebarTab === 'badges'
                ? 'bg-white text-slate-900 border-sky-500'
                : 'text-slate-500 hover:text-slate-800 border-transparent bg-slate-50/50'
              }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Lencana Penjelajah
            {visitedSpotIds.length > 0 && (
              <span className="bg-amber-500 text-slate-950 font-mono text-[9px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                {visitedSpotIds.length}
              </span>
            )}
          </button>
        </div>

        {activeSidebarTab === 'controls' ? (
          <>
            {/* MIDDLE CONTROLS: LAYER & RADIUS SEARCH */}
            <div className="p-4 border-b border-slate-200 bg-white space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-500 font-mono flex items-center gap-1">
                  <Layers className="w-4 h-4 text-slate-400" />
                  OVERLAYS & ANALISIS GEOSPATIAL
                </h3>
              </div>

              {/* Toggle Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setEnableRadiusFilter(!enableRadiusFilter)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${enableRadiusFilter
                      ? 'bg-sky-50 border-sky-300 text-sky-700 ring-2 ring-sky-500/10'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  Radius Filter: {enableRadiusFilter ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => setEnableHeatmap(!enableHeatmap)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${enableHeatmap
                      ? 'bg-red-50 border-red-300 text-red-700 ring-2 ring-red-500/10'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Kepadatan (Heatmap)
                </button>
              </div>

              {/* Radius Slider */}
              {enableRadiusFilter && (
                <div className="space-y-1.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                  <div className="flex justify-between items-center text-xs text-sky-800 font-bold">
                    <span>Jangkauan Radius</span>
                    <span className="font-mono">{searchRadiusKm} km</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={searchRadiusKm}
                    onChange={(e) => setSearchRadiusKm(Number(e.target.value))}
                    className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                  <p className="text-[10px] text-sky-600 leading-normal">
                    Hanya menampilkan destinasi yang berjarak kurang dari <b>{searchRadiusKm} km</b> dari titik awal Anda.
                  </p>
                </div>
              )}

              {/* Amenitas Sekitar toggles */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Fasilitas & Amenitas Sekitar (Simulasi GIS)</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'hospital', label: '🏥 RS/Klinik' },
                    { id: 'atm', label: '🏧 ATM' },
                    { id: 'fuel', label: '⛽ SPBU' },
                    { id: 'cafe', label: '☕ Cafe Kuliner' }
                  ].map(am => {
                    const isActive = showAmenities.includes(am.id);
                    return (
                      <button
                        key={am.id}
                        onClick={() => toggleAmenityType(am.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${isActive
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        {am.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CONTROLS: COMPASS ROUTE CHECKBOXES & TSP OPTIMIZER */}
            <div className="p-4 border-b border-slate-200 bg-white space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-500 font-mono flex items-center gap-1">
                  <Shuffle className="w-4 h-4 text-amber-500" />
                  AI ROUTE OPTIMIZER (ANTI-BACKTRACKING)
                </h3>
                {selectedRouteIds.length > 0 && (
                  <button onClick={handleClearRouteSelections} className="text-[10px] font-bold text-red-500 hover:underline">
                    Hapus
                  </button>
                )}
              </div>

              <p className="text-[10px] text-slate-400 leading-normal">
                Pilih destinasi yang ingin dikunjungi di bawah, AI akan menata urutan terbaik berdasarkan rute geografis terpendek untuk menghemat bensin & waktu.
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOptimizeRoute}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:-translate-y-0.5 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 transition-all cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-slate-950 animate-pulse" />
                  Kalkulasi Optimasi Rute AI ({selectedRouteIds.length} Terpilih)
                </button>
              </div>

              {/* Optimasi results details */}
              {optimizedRoutePath.length > 0 && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-amber-800 font-bold">
                    <span>Rekomendasi Rute Terbaik:</span>
                    <span className="font-mono bg-white border border-amber-300 px-1.5 py-0.5 rounded text-[10px] text-amber-700">
                      Total Jarak: {routeDistanceText}
                    </span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700 font-medium">
                    <li>Titik Mulai Sesi: <b>{userLocation.name}</b></li>
                    {optimizedRoutePath.map((item, idx) => (
                      <li key={item.id} className="text-slate-800">
                        {item.name} <span className="text-[10px] text-slate-400 font-mono">({item.district})</span>
                      </li>
                    ))}
                  </ol>
                  <p className="text-[10px] text-amber-700 leading-normal">
                    ⏱️ Estimasi total waktu perjalanan darat: <b>{routeDurationText}</b> (Dengan kecepatan rata-rata pegunungan 35km/jam).
                  </p>
                </div>
              )}
            </div>

            {/* COMPONENT: COMPASS DESTINATION COMPARATOR */}
            <div className="p-4 border-b border-slate-200 bg-white space-y-4">
              <h3 className="text-xs font-bold text-slate-500 font-mono flex items-center gap-1">
                <Shuffle className="w-4 h-4 text-sky-500" />
                AI COMPASS: COMPARISON MATRIX
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={compareItemA}
                  onChange={(e) => setCompareItemA(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 outline-none"
                >
                  <option value="">-- Pilih Objek A --</option>
                  {mapItems.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>

                <select
                  value={compareItemB}
                  onChange={(e) => setCompareItemB(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 outline-none"
                >
                  <option value="">-- Pilih Objek B --</option>
                  {mapItems.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              {/* Comparison Table */}
              {itemAData && itemBData ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono font-bold text-[10px]">
                        <th className="p-2">Fitur / Data</th>
                        <th className="p-2 text-sky-600 truncate max-w-[80px]">{itemAData.name}</th>
                        <th className="p-2 text-pink-600 truncate max-w-[80px]">{itemBData.name}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-2 font-semibold bg-slate-50 text-slate-400">Kategori</td>
                        <td className="p-2">{itemAData.category}</td>
                        <td className="p-2">{itemBData.category}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold bg-slate-50 text-slate-400">Kabupaten</td>
                        <td className="p-2">{itemAData.district}</td>
                        <td className="p-2">{itemBData.district}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold bg-slate-50 text-slate-400">Peringkat</td>
                        <td className="p-2 flex items-center gap-0.5 text-amber-500 font-bold">
                          ⭐ {itemAData.rating}
                        </td>
                        <td className="p-2 text-amber-500 font-bold">
                          ⭐ {itemBData.rating}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold bg-slate-50 text-slate-400">Tarif / Harga</td>
                        <td className="p-2">{itemAData.priceOrTicket}</td>
                        <td className="p-2">{itemBData.priceOrTicket}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold bg-slate-50 text-slate-400">Fasilitas Utama</td>
                        <td className="p-2">{itemAData.facilities.slice(0, 2).join(', ')}</td>
                        <td className="p-2">{itemBData.facilities.slice(0, 2).join(', ')}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold bg-slate-50 text-slate-400">Camping Ground?</td>
                        <td className="p-2">
                          {itemAData.facilities.some(f => f.toLowerCase().includes('camp')) ? '✅ Tersedia' : '❌ Tidak'}
                        </td>
                        <td className="p-2">
                          {itemBData.facilities.some(f => f.toLowerCase().includes('camp')) ? '✅ Tersedia' : '❌ Tidak'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 italic text-center py-2">
                  Pilih dua tempat di atas untuk melihat matriks komparasi instan.
                </p>
              )}
            </div>

            {/* SEARCH RESULTS LIST */}
            <div className="p-4 space-y-3">

              {/* hasil Supabase */}
              {supabaseSearchResults.map(doc => {
                const metadata = doc.metadata || {};

                return (
<div
  key={`supabase-${doc.id}`}
  onClick={() => {
    const item = supabaseMapItems.find(
      item => item.id === `supabase-${doc.id}`
    );

    if (item) {
      handleSelectItem(item);
    }
  }}
  className="w-full bg-white border border-sky-100 rounded-2xl p-3 shadow-sm cursor-pointer hover:shadow-md hover:border-sky-400 transition-all"
>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-xs text-slate-800">
                          {metadata.place || 'Tempat Wisata'}
                        </h3>

                        <p className="text-[10px] text-slate-400 mt-1">
                          {metadata.address || 'Alamat tidak tersedia'}
                        </p>

                        <span className="text-[9px] font-bold text-amber-500">
                          ⭐ {metadata.rating ?? '-'}
                        </span>
                      </div>

                      <span className="text-[8px] font-bold text-emerald-600">
                        SUPABASE
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 mt-2">
                      {doc.content}
                    </p>
                  </div>
                );
              })}

              {/* hasil lokal */}
              {filteredItems.map(item => {
                const isCheckedInRoute = selectedRouteIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="w-full bg-white border border-slate-100 rounded-2xl overflow-hidden flex shadow-sm"
                  >
                    <div className="p-2 flex items-center">
                      <input
                        type="checkbox"
                        checked={isCheckedInRoute}
                        onChange={() => toggleRouteSelection(item.id)}
                        className="w-4 h-4"
                      />
                    </div>

                    <button
                      onClick={() => handleSelectItem(item)}
                      className="flex-1 text-left flex"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover"
                      />

                      <div className="p-3">
                        <h3 className="font-bold text-xs text-slate-800">
                          {item.name}
                        </h3>

                        <p className="text-[10px] text-slate-400">
                          {item.district}
                        </p>

                        <span className="text-[10px] font-bold">
                          ⭐ {item.rating}
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}

              {/* tidak ada hasil */}
              {filteredItems.length === 0 &&
                supabaseSearchResults.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-xs text-slate-400">
                      Tidak ada objek yang ditemukan.
                    </p>
                  </div>
                )}

            </div>
          </>
        ) : (
          /* GEOPARK EXPLORER BADGE TAB */
          <div className="p-4 space-y-5 animate-fade-in bg-white flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {/* HEADER INFORMATION CARD */}
              <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-800 shadow-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400 animate-bounce" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">UNESCO Geopark Explorer Club</span>
                </div>
                <h3 className="text-sm font-display font-black leading-tight">
                  {language === 'en' ? 'Earn Rewards Exploring the Beauty of Toba' : 'Dapatkan Penghargaan Menjelajahi Keindahan Toba'}
                </h3>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  {language === 'en'
                    ? 'Visit historic Batak geosites, ancient supervolcano peaks, and magical waterfalls to unlock legendary badges!'
                    : 'Kunjungi geosite bersejarah, puncak bukit sisa letusan purba, dan air terjun magis untuk membuka lencana legenda!'}
                </p>

                {/* GLOBAL PROGRESS BAR */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-300 font-bold">
                    <span>{language === 'en' ? 'Geosites Visited' : 'Spot Terkunjungi'}</span>
                    <span>{visitedSpotIds.length} / {mapItems.filter(i => i.type === 'destination').length}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, (visitedSpotIds.length / Math.max(1, mapItems.filter(i => i.type === 'destination').length)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* LIST OF BADGES */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'en' ? 'Award Badges Collection' : 'Koleksi Lencana Penghargaan'}
                </p>
                <div className="space-y-2.5">
                  {GEOPARK_BADGES.map(badge => {
                    const isUnlocked = badge.checkUnlocked(visitedSpotIds);
                    const progress = badge.getProgress(visitedSpotIds);
                    return (
                      <div
                        key={badge.id}
                        className={`p-3 border rounded-2xl flex gap-3 items-start transition-all ${isUnlocked
                            ? `${badge.bgClass} ${badge.borderClass} shadow-xs ring-1 ring-black/5`
                            : 'bg-slate-50/50 border-slate-100 grayscale opacity-60'
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isUnlocked
                            ? 'bg-white shadow-xs border-slate-200/50'
                            : 'bg-slate-100 border-slate-200'
                          }`}>
                          {getBadgeIcon(badge.iconName, `w-5.5 h-5.5 ${isUnlocked ? badge.colorClass : 'text-slate-400'}`)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-xs text-slate-800 truncate">{badge.title[language] || badge.title.id}</h4>
                            {isUnlocked ? (
                              <span className="text-[9px] font-mono font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse shrink-0">
                                Unlocked 🎉
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 border border-slate-200/60 px-1.5 py-0.2 rounded-full uppercase tracking-wider shrink-0">
                                {progress.current}/{progress.total}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                            {badge.description[language] || badge.description.id}
                          </p>

                          {/* Progress Line for locked/in-progress badges */}
                          {!isUnlocked && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-slate-400 rounded-full"
                                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                />
                              </div>
                              <span className="text-[9px] font-mono text-slate-400 font-bold">{Math.round((progress.current / progress.total) * 100)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RESET BUTTON */}
            {visitedSpotIds.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleResetProgress}
                  className="w-full py-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 hover:-translate-y-0.5 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {language === 'en' ? 'Reset Progress History' : 'Reset Seluruh Kemajuan'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT CONTAINER: MAP & DETAIL CARD PORTAL */}
      <div id="gis-stage" className="flex-1 relative flex flex-col min-h-[400px]">
        {/* LEAFLET CANVAS */}
        <div ref={mapContainerRef} className="flex-1 w-full h-full z-0 bg-slate-100" />

        {/* FLOATING TRAVEL RISK WARNING CARD */}
        {showRiskAlert && (
          <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-xl border border-slate-800 p-4 max-w-sm z-10 animate-fade-in space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />
                <span className="text-xs font-bold font-mono tracking-wide uppercase">TRAVEL RISK ASSISTANT</span>
              </div>
              <button onClick={() => setShowRiskAlert(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
              <p>⛅ <b>Cuaca Kawasan</b>: Cerah Berawan di Tuk Tuk, Potensi Hujan Ringan di Balige sore hari.</p>
              <p>📈 <b>Kepadatan Wisata</b>: Normal. Bukit Sibea-bea dan Holbung cukup ramai saat fajar weekend.</p>
              <p>🚧 <b>Rekayasa Jalan</b>: Arus lalu lintas Parapat - Tomok Feri lancar tanpa hambatan.</p>
              <div className="text-[10px] bg-slate-800 p-2 rounded text-slate-400 font-mono">
                📞 Basarnas Danau Toba: +62-625-41221
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE ITEM DETAILS OVERLAY CARD */}
        {activeItem && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[460px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-fade-in">
            <div className="relative h-44">
              <img src={activeItem.image} alt={activeItem.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg">
                <span className="text-xs font-bold text-white uppercase">{activeItem.category}</span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <span className="text-xs font-mono font-bold text-sky-500">{activeItem.district}</span>
                <h3 className="font-display font-black text-xl text-slate-800 leading-tight">{activeItem.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">{activeItem.description}</p>
              </div>

              {/* RAG COORDINATES DETAIL */}
              <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-3">
                <div>
                  <span className="text-slate-400 block font-mono">Koordinat GPS</span>
                  <span className="font-mono text-slate-700 font-semibold">{activeItem.latitude.toFixed(4)}, {activeItem.longitude.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Tarif Tiket / Biaya</span>
                  <span className="font-bold text-emerald-600">{activeItem.priceOrTicket}</span>
                </div>
              </div>

              {/* DYNAMIC STORY MODE AUDIO PANEL */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between gap-2.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                    <Volume2 className="w-4 h-4 text-sky-500" />
                    <span>AI Story Mode: Legenda Dan Sejarah</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal truncate mt-0.5">
                    Dengarkan audio suara legenda rakyat batak setempat seputar objek ini.
                  </p>
                </div>

                <button
                  onClick={() => handleToggleStorySpeech(getStoryText(activeItem))}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 flex items-center gap-1 cursor-pointer ${isSpeakingStory
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/10'
                      : 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20'
                    }`}
                >
                  {isSpeakingStory ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" /> Stop
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" /> Dengarkan
                    </>
                  )}
                </button>
              </div>

              {/* Story visualizer waves */}
              {isSpeakingStory && (
                <div className="flex items-center justify-center gap-1 bg-slate-900 py-2 rounded-xl text-white font-mono text-[10px] animate-pulse">
                  <span className="w-1.5 h-3 rounded bg-sky-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-5 rounded bg-sky-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-2 rounded bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="w-1.5 h-4 rounded bg-sky-400 animate-bounce" style={{ animationDelay: '450ms' }} />
                  <span className="text-[10px] text-sky-400 font-bold font-mono tracking-widest ml-1 uppercase">AUDIO STORY MODE AKTIF</span>
                </div>
              )}

              {/* ACTION BUTTONS WITH GAMIFIED CHECK-IN */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                {activeItem.type === 'destination' && (
                  visitedSpotIds.includes(activeItem.id) ? (
                    <div className="flex-1 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      {language === 'en' ? 'Visited ✓' : 'Sudah Dikunjungi ✓'}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCheckIn(activeItem.id)}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:-translate-y-0.5 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all cursor-pointer font-sans"
                    >
                      <MapPin className="w-4 h-4 text-emerald-200 animate-pulse" />
                      {language === 'en' ? 'Check-In Here' : 'Catat Kunjungan'}
                    </button>
                  )
                )}

                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${activeItem.latitude},${activeItem.longitude}`;
                    window.open(url, '_blank');
                  }}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 hover:-translate-y-0.5 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  {language === 'en' ? 'Google Maps Directions' : 'Petunjuk Rute Google Maps'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* INLINE TEMP NOTIFICATION BANNER */}
        <AnimatePresence>
          {checkInNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 bg-slate-900 text-white px-4 py-3 rounded-2xl border border-slate-800 shadow-2xl flex items-center gap-2 z-50 text-xs font-semibold"
            >
              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{checkInNotification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CELEBRATION BADGE MODAL OVERLAY */}
        <AnimatePresence>
          {celebrationBadge && (
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-5 border border-slate-100 shadow-2xl relative overflow-hidden"
              >
                {/* Decorative glow background */}
                <div className="absolute -inset-10 bg-gradient-to-tr from-amber-500/10 via-transparent to-sky-500/10 blur-2xl rounded-full" />
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400" />

                <div className="relative space-y-4">
                  <div className="inline-flex p-4 rounded-3xl bg-amber-50 border border-amber-200 shadow-lg shadow-amber-500/10 animate-bounce">
                    {getBadgeIcon(celebrationBadge.iconName, `w-12 h-12 ${celebrationBadge.colorClass}`)}
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono tracking-widest text-amber-500 font-black uppercase">
                      {language === 'en' ? 'NEW BADGE UNLOCKED!' : 'LENCANA BARU TERBUKA!'}
                    </p>
                    <h3 className="font-display font-black text-xl text-slate-800 leading-tight">
                      {celebrationBadge.title[language] || celebrationBadge.title.id}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {celebrationBadge.description[language] || celebrationBadge.description.id}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setCelebrationBadge(null)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-sky-400" />
                      {language === 'en' ? 'Claim Badge & Continue' : 'Klaim Lencana & Lanjutkan'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
