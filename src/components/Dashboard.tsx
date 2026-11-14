import React, { useState, useEffect } from 'react';
import { TOBA_DESTINATIONS, TOBA_HOTELS } from '../data/tobaData';
import { Destination, Review } from '../types';
import { useTravelStore } from '../store/travelStore';
import { reviewsService } from '../services/database';
import { 
  Star, MapPin, Sparkles, MessageSquare, Heart, Compass, Eye, ShieldAlert, Award, 
  ChevronRight, Calendar, Bell, Flame, CloudSun, UserCheck, Sliders, Check, Volume2,
  Map, BookOpen, Coffee, User, Search, Wind, Droplets, ArrowRight, ShieldCheck, HelpCircle,
  Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

// Custom Animated Counter Component
function AnimatedCounter({ value, duration = 1500 }: { value: string; duration?: number }) {
  const numericString = value.replace(/[^0-9]/g, '');
  const numericValue = parseInt(numericString, 10) || 0;
  const suffix = value.replace(/[0-9,\s]/g, '');
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    if (end === 0) {
      setCount(0);
      return;
    }
    const step = Math.ceil(end / 40);
    const intervalTime = Math.max(Math.floor(duration / 40), 16);
    
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [numericValue, duration]);

  // Format with thousands separator if needed
  const formattedCount = value.includes(',') 
    ? count.toLocaleString('id-ID') 
    : count.toString();

  return (
    <span>{formattedCount}{suffix}</span>
  );
}

export default function Dashboard() {
  const { user, toggleFavorite, isFavorite, setActiveTab, updateUserPreferences } = useTravelStore();
  const { t, language } = useLanguage();

  // 3D Volumetric Parallax States
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [active3DMode, setActive3DMode] = useState<'panoramic' | '3d-caldera'>('3d-caldera');

  // Search filter term for live geosite searching
  const [searchTerm, setSearchTerm] = useState('');

  // Local/Guest preferences in case not logged in
  const [localInterests, setLocalInterests] = useState<string[]>(['Nature', 'Culture']);
  const [showPreferencesPanel, setShowPreferencesPanel] = useState(false);

  // Read preferences from user profile if available
  useEffect(() => {
    if (user && user.interestPref && user.interestPref.length > 0) {
      setLocalInterests(user.interestPref);
    }
  }, [user]);

  // Handle Interest Toggle
  const toggleInterest = async (interest: string) => {
    let updated: string[];
    if (localInterests.includes(interest)) {
      updated = localInterests.filter(x => x !== interest);
    } else {
      updated = [...localInterests, interest];
    }
    setLocalInterests(updated);

    // Save to user database profile if logged in
    if (user) {
      await updateUserPreferences(user.districtPref || 'Samosir', updated);
    }
  };

  // Sort and filter destinations based on interests and search query
  const getPersonalizedDestinations = (): Destination[] => {
    let list = TOBA_DESTINATIONS;

    // Filter by search query if user typed something
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      list = list.filter(dest => 
        dest.name.toLowerCase().includes(q) ||
        dest.description.toLowerCase().includes(q) ||
        dest.district.toLowerCase().includes(q) ||
        dest.category.toLowerCase().includes(q)
      );
    }

    // Score destinations based on interest overlap
    const scored = list.map(dest => {
      let score = 0;
      if (localInterests.includes(dest.category)) {
        score += 5; // higher weight for exact category match
      }
      // Boost based on ratings
      score += dest.rating * 1.5;
      return { dest, score };
    });

    // Sort by score descending
    return scored.sort((a, b) => b.score - a.score).map(x => x.dest);
  };

  const personalizedDestinations = getPersonalizedDestinations();
  const topAIRecommendation = personalizedDestinations[0] || TOBA_DESTINATIONS[0];

  // Smart notifications data
  const upcomingFestivals = [
    { 
      id: 'fest-1', 
      title: 'Samosir Music International', 
      date: '12-14 Aug 2026', 
      location: 'Open Air Stage Tuk Tuk Samosir', 
      desc: language === 'en' 
        ? 'Spectacular concert collaboration between international musicians and traditional Batak Gondang Sabangunan orchestra.' 
        : 'Konser musik spektakuler kolaborasi musisi mancanegara dengan orkestra Gondang Sabangunan tradisional Batak.', 
      status: t('dash.notif.status_upcoming'),
      tagColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
    },
    { 
      id: 'fest-2', 
      title: language === 'en' ? 'Lake Toba Festival (FDT)' : 'Festival Danau Toba (FDT)', 
      date: '20-24 Sep 2026', 
      location: 'Pantai Bebas Parapat', 
      desc: language === 'en'
        ? 'Solu Bolon boat races, exhibition of the longest Ulos handwoven textile, and massive nature heritage Tor-Tor dances.'
        : 'Perlombaan perahu Solu Bolon, pameran kain tenun Ulos terpanjang, dan tarian massal Tor-Tor cagar alam.', 
      status: t('dash.notif.status_popular'),
      tagColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    }
  ];

  // Reviews Local Feed
  const [selectedDestId, setSelectedDestId] = useState<string>(TOBA_DESTINATIONS[0].id);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [localFeed, setLocalFeed] = useState<Review[]>([
    {
      id: 'rev-sample-1',
      userId: 'usr-1',
      userName: 'Delia Simarmata',
      destinationId: 'dest-holbung',
      rating: 5,
      comment: language === 'en'
        ? 'Seeing the green grass hills of Holbung in the morning feels like a slice of heaven. The light fog hovering over Lake Toba is absolute magic!'
        : 'Melihat pemandangan bukit hijau Holbung di pagi hari bagaikan serpihan surga. Kabut tipis di atas Danau Toba sangat magis!',
      createdAt: new Date().toISOString()
    },
    {
      id: 'rev-sample-2',
      userId: 'usr-2',
      userName: 'Garry Sianipar',
      destinationId: 'dest-sipisopiso',
      rating: 5,
      comment: language === 'en'
        ? 'Sipiso-piso Waterfall is amazing. The stairs path is challenging but totally worth the stunning view from below.'
        : 'Air Terjun Sipiso-piso sangat menakjubkan. Jalur tangganya menantang tapi sepadan dengan pemandangan di bawah.',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    }
  ]);

  const stats = [
    { 
      value: '1,130', 
      suffix: ' km²', 
      label: t('dash.stats.lake'), 
      desc: language === 'en' ? 'Formed by a mega volcanic eruption 74,000 years ago.' : 'Terbentuk akibat letusan supervolcano kolosal 74.000 tahun lalu.', 
      icon: Globe, 
      color: 'text-sky-500 bg-sky-50' 
    },
    { 
      value: '8', 
      suffix: '', 
      label: t('dash.stats.districts'), 
      desc: language === 'en' ? 'Charming regencies surrounding the sacred Batak lake.' : 'Kabupaten menawan yang melingkari kawasan cagar budaya Toba.', 
      icon: MapPin, 
      color: 'text-emerald-500 bg-emerald-50' 
    },
    { 
      value: '17', 
      suffix: '+', 
      label: t('dash.stats.geosites'), 
      desc: language === 'en' ? 'UNESCO heritage sites of supreme geological value.' : 'Situs geopark bernilai sejarah dan warisan geologi tinggi.', 
      icon: Award, 
      color: 'text-amber-500 bg-amber-50' 
    },
    { 
      value: '905', 
      suffix: ' m', 
      label: t('dash.stats.elevation'), 
      desc: language === 'en' ? 'Above sea level, generating perfect cool breeze all day.' : 'Di atas permukaan laut, menyajikan hawa sejuk sepanjang hari.', 
      icon: CloudSun, 
      color: 'text-indigo-500 bg-indigo-50' 
    }
  ];

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev = await reviewsService.addReview({
      userId: user?.id || 'guest',
      userName: user?.fullName || (language === 'en' ? 'Anonymous Traveler' : 'Wisatawan Anonim'),
      destinationId: selectedDestId,
      rating: reviewRating,
      comment: reviewComment
    });

    setLocalFeed([newRev, ...localFeed]);
    setReviewComment('');
    alert(language === 'en' ? 'Your review has been published! Thank you for your contribution.' : 'Ulasan Anda berhasil diterbitkan! Terima kasih atas kontribusi Anda.');
  };

  const getDestName = (id: string) => {
    return TOBA_DESTINATIONS.find(d => d.id === id)?.name || (language === 'en' ? 'Attraction' : 'Objek Wisata');
  };

  // Greeting based on interest profile
  const getPersonalizedGreeting = () => {
    if (localInterests.includes('Culture') && localInterests.includes('Nature')) {
      return t('dash.title.culture_nature');
    }
    if (localInterests.includes('Culture')) {
      return t('dash.title.culture');
    }
    if (localInterests.includes('Nature')) {
      return t('dash.title.nature');
    }
    if (localInterests.includes('Culinary')) {
      return t('dash.title.culinary');
    }
    return t('dash.title.default');
  };

  // 3D Parallax Tilt Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Smooth 3D tilt coordinates
    const rX = -(y / (box.height / 2)) * 14;
    const rY = (x / (box.width / 2)) * 14;
    setRotateX(rX);
    setRotateY(rY);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  // Common motion layout definitions
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as any } }
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardItemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as any, stiffness: 350, damping: 25 } }
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* PREMIUM TWO-COLUMN HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-4">
        
        {/* LEFT COLUMN: HERO HEADLINE & SEARCH PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' as any }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-[#E0F2FE]/50 border border-[#0EA5E9]/20 px-3.5 py-1.5 rounded-full text-[11px] text-[#0F4C81] font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>UNESCO Global Geopark • Smart Portal</span>
          </div>

          <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-[#0F172A] leading-[1.1] tracking-tight">
            {getPersonalizedGreeting()}
          </h1>

          <p className="text-sm md:text-base text-[#64748B] leading-relaxed max-w-xl">
            {user ? `Horas, ${user.fullName.split(' ')[0]}! ` : ''}{t('dash.hero_desc')}
          </p>

          {/* PRIMARY & SECONDARY ACTION CTAs */}
          <div className="flex flex-wrap gap-4 pt-1">
            <button
              onClick={() => setActiveTab('map')}
              className="px-6 py-3.5 bg-gradient-to-r from-[#0F4C81] to-[#0EA5E9] hover:from-[#2563EB] hover:to-[#0EA5E9] text-white rounded-[18px] text-xs font-bold shadow-lg shadow-[#0EA5E9]/20 hover:-translate-y-0.5 hover:shadow-[#0EA5E9]/30 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Map className="w-4 h-4" />
              <span>{t('dash.button.map')}</span>
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className="px-6 py-3.5 bg-white hover:bg-[#F8FAFC] border border-[#0EA5E9]/30 text-[#0F4C81] rounded-[18px] text-xs font-bold shadow-sm hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500/10" />
              <span>{t('dash.button.planner')}</span>
            </button>
            <button
              onClick={() => setShowPreferencesPanel(!showPreferencesPanel)}
              className="px-5 py-3.5 bg-[#E0F2FE]/60 hover:bg-[#E0F2FE]/90 text-[#0F4C81] rounded-[18px] text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Sliders className="w-4 h-4 text-[#0EA5E9]" />
              <span>{t('dash.button.pref')}</span>
            </button>
          </div>

          {/* QUICK SEARCH WIDGET */}
          <div className="space-y-2 max-w-md">
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#64748B] block uppercase">
              {language === 'en' ? 'Instant Geosite Search' : 'Pencarian Instan Geosite'}
            </span>
            <div className="relative bg-white border border-[#E0F2FE] rounded-[18px] p-1 shadow-sm flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#0EA5E9]/20 transition-all duration-300">
              <div className="pl-3 text-slate-400 shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder={language === 'en' ? 'Search geosites, culture, or district...' : 'Cari geosite, sejarah, atau kabupaten...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-xs text-[#0F172A] py-2"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="text-[9px] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-[10px] text-slate-500 font-bold mr-1 shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* POPULAR CATEGORY QUICK CHIPS */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#64748B] block uppercase">
              {language === 'en' ? 'Quick Interest Filters' : 'Saringan Minat Cepat'}
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'Nature', label: '🏞️ ' + t('dash.pref.nature') },
                { id: 'Culture', label: '📜 ' + t('dash.pref.culture') },
                { id: 'Culinary', label: '🍛 ' + t('dash.pref.culinary') },
                { id: 'Family', label: '👪 ' + t('dash.pref.family') }
              ].map(pref => {
                const selected = localInterests.includes(pref.id);
                return (
                  <button
                    key={pref.id}
                    onClick={() => toggleInterest(pref.id)}
                    className={`px-3.5 py-2 border rounded-full text-[11px] font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      selected 
                        ? 'border-[#0EA5E9] bg-[#E0F2FE]/50 text-[#0F4C81] shadow-xs' 
                        : 'border-slate-200 text-[#64748B] hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${
                      selected ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white' : 'border-slate-300'
                    }`}>
                      {selected && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                    </div>
                    <span>{pref.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: PREMIUM LAKE TOBA 3D SIMULATOR & SCENIC OVERLAYS */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' as any }}
          className="lg:col-span-5 flex flex-col gap-4"
        >
          {/* Mode Switch Controller with luxury styling */}
          <div className="flex bg-white/60 backdrop-blur-md border border-[#E0F2FE] p-1 rounded-2xl shadow-xs self-end gap-1 z-20">
            <button
              onClick={() => setActive3DMode('panoramic')}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                active3DMode === 'panoramic'
                  ? 'bg-gradient-to-r from-[#0F4C81] to-[#0EA5E9] text-white shadow-md shadow-[#0EA5E9]/15'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span>🖼️ {language === 'en' ? 'Panorama' : 'Panorama'}</span>
            </button>
            <button
              onClick={() => setActive3DMode('3d-caldera')}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                active3DMode === '3d-caldera'
                  ? 'bg-gradient-to-r from-[#0F4C81] to-[#0EA5E9] text-white shadow-md shadow-[#0EA5E9]/15'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </span>
              <span>📐 {language === 'en' ? '3D Caldera' : '3D Kaldera'}</span>
            </button>
          </div>

          {/* Core 3D Tilt Container */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-[380px] md:h-[480px] rounded-[32px] overflow-hidden shadow-2xl bg-gradient-to-b from-[#081B33] via-[#0F4C81] to-[#0D1F2D] border border-white/15 cursor-grab active:cursor-grabbing"
            style={{
              perspective: 1000,
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transition: isHovered ? 'none' : 'transform 0.5s ease-out'
            }}
          >
            {active3DMode === 'panoramic' ? (
              /* PANORAMIC 3D PARALLAX VIEW MODE */
              <div className="absolute inset-0 w-full h-full" style={{ transform: 'translateZ(-10px)' }}>
                {/* Background lake scenery */}
                <motion.img
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200"
                  alt="Lake Toba Scenery"
                  className="absolute inset-0 w-full h-full object-cover scale-105"
                  style={{
                    transform: `translate(${rotateY * 0.4}px, ${-rotateX * 0.4}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081B33]/85 via-transparent to-black/10" />
              </div>
            ) : (
              /* ACTIVE VOLUMETRIC 3D MAP MODE (Interactive Lake Toba & Samosir) */
              <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                
                {/* 3D Grid floor representing scientific geopark coordinate plane */}
                <div 
                  className="absolute inset-0 opacity-[0.08] pointer-events-none" 
                  style={{ 
                    backgroundImage: 'radial-gradient(#0EA5E9 1.5px, transparent 1.5px), linear-gradient(to right, rgba(14,165,233,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(14,165,233,0.1) 1px, transparent 1px)',
                    backgroundSize: '24px 24px, 24px 24px, 24px 24px',
                    transform: 'rotateX(60deg) translateY(20px) translateZ(-60px)',
                  }}
                />

                {/* Simulated Deep Ocean Bed ring */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-[#0EA5E9]/15 animate-pulse pointer-events-none" 
                  style={{ transform: 'rotateX(65deg) translateZ(-50px)' }}
                />

                {/* Samosir Island Volumetric Layers */}
                <div 
                  className="absolute top-[38%] left-[28%] w-[44%] h-[28%] transition-transform duration-300"
                  style={{ 
                    transform: `rotateX(62deg) rotateY(-8deg) rotateZ(${isHovered ? rotateY * 0.3 : 0}deg) translateZ(-20px)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Layer 1 - Deep Water Shelf (Contour 1) */}
                  <div className="absolute inset-0 bg-[#0F4C81]/30 rounded-full border border-sky-400/30 blur-[2px] scale-125" />

                  {/* Layer 2 - Base Island Coast (Samosir coastline) */}
                  <div className="absolute inset-2 bg-gradient-to-tr from-[#10B981]/50 to-[#0EA5E9]/50 rounded-full border border-emerald-400/40 shadow-xl" style={{ transform: 'translateZ(10px)' }}>
                    {/* Tiny lake on island (Lake Sidihoni) */}
                    <div className="absolute top-[35%] left-[45%] w-5 h-3 rounded-full bg-[#E0F2FE] border border-sky-300 shadow-inner animate-pulse" />
                  </div>

                  {/* Layer 3 - Highlands & Mountains (Pusuk Buhit & Volcanic Peaks) */}
                  <div className="absolute inset-6 bg-gradient-to-tr from-[#059669] to-[#10B981] rounded-full border border-emerald-300/40 shadow-lg" style={{ transform: 'translateZ(25px)' }}>
                    {/* Glowing Caldera Peak Vent */}
                    <div className="absolute top-[20%] left-[30%] w-3 h-3 rounded-full bg-amber-400/80 blur-[1px] animate-ping" />
                    <div className="absolute top-[20%] left-[30%] w-3 h-3 rounded-full bg-amber-500 border border-white shadow-sm" />
                    <span className="absolute top-[-10px] left-[-20px] text-[7px] font-mono font-bold text-emerald-200 tracking-wider">PUSUK BUHIT</span>
                  </div>

                  {/* Layer 4 - Samosir Settle Hotspots */}
                  <div className="absolute top-[40%] right-[15%] w-3 h-3 rounded-full bg-sky-400 border border-white shadow-md animate-bounce" style={{ transform: 'translateZ(35px)' }} title="Tuk Tuk Resort">
                    <span className="absolute bottom-[-10px] right-[-20px] text-[7px] font-mono font-bold text-sky-200 tracking-widest uppercase">TUK-TUK</span>
                  </div>
                  
                  {/* Miniature Interactive Destination Hotspots */}
                  <div className="absolute bottom-[20%] left-[25%] w-3.5 h-3.5 rounded-full bg-amber-400 border border-white shadow-md animate-pulse" style={{ transform: 'translateZ(35px)' }}>
                    <span className="absolute bottom-[-10px] left-[-20px] text-[7px] font-mono font-bold text-amber-200 tracking-widest uppercase">HOLBUNG</span>
                  </div>
                </div>

                {/* Interactive Compass HUD element */}
                <div className="absolute top-6 right-6 flex flex-col items-center gap-1 opacity-80 pointer-events-none" style={{ transform: 'translateZ(40px)' }}>
                  <div className="w-8 h-8 rounded-full border border-[#0EA5E9]/30 flex items-center justify-center animate-spin-slow">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-[#EF4444] to-[#0EA5E9]" />
                  </div>
                  <span className="text-[7px] font-mono font-bold text-sky-300 tracking-widest">CALDERA N</span>
                </div>

                {/* Sailing ship: Solu Bolon that floats smoothly in circles */}
                <motion.div
                  className="absolute top-[50%] left-[5%] text-sky-300 flex items-center gap-1 pointer-events-none"
                  style={{ transformStyle: 'preserve-3d', transform: 'translateZ(5px)' }}
                  animate={{
                    x: [0, 180, 260, 100, 0],
                    y: [0, -40, 20, 80, 0],
                    rotate: [0, 15, -15, 30, 0]
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                >
                  <span className="text-sm">⛵</span>
                  <span className="text-[6px] font-mono text-sky-200 uppercase tracking-widest">Solu Bolon</span>
                </motion.div>

                {/* Floating Clouds Layer */}
                <div className="absolute inset-x-0 top-1/4 h-20 opacity-25 pointer-events-none" style={{ transform: 'translateZ(80px)' }}>
                  <div className="w-24 h-6 rounded-full bg-white blur-md absolute top-0 animate-float-slow left-[10%]" />
                  <div className="w-32 h-8 rounded-full bg-white blur-lg absolute top-4 animate-float-reverse right-[15%]" />
                </div>
              </div>
            )}

            {/* FLOATING WEATHER WIDGET OVERLAY */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/10 max-w-[170px]"
              style={{ transform: 'translateZ(60px)', transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center gap-1.5 text-sky-300">
                <CloudSun className="w-4 h-4 text-[#0EA5E9]" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider">TUK-TUK WEATHER</span>
              </div>
              <div className="mt-1">
                <span className="text-3xl font-extrabold font-display text-white block leading-none">24°C</span>
                <span className="text-[9px] text-emerald-400 font-bold mt-1 block leading-none">⛅ {language === 'en' ? 'PARTLY CLOUDY' : 'CERAH BERAWAN'}</span>
              </div>
            </motion.div>

            {/* AI RECOMMENDATION CARD OVERLAY */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 max-w-[220px]"
              style={{ transform: 'translateZ(75px)', transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[8px] font-bold bg-[#0EA5E9]/10 text-[#0F4C81] px-2 py-0.5 rounded-lg uppercase tracking-wider font-mono">TOP AI PICK</span>
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-[10px] font-bold">4.9</span>
                </div>
              </div>
              <h4 className="text-xs font-bold text-[#0F172A] mt-2 leading-tight">Bukit Holbung Geosite</h4>
              <p className="text-[9px] text-[#64748B] mt-0.5 line-clamp-2 leading-relaxed">
                {language === 'en' 
                  ? 'Spectacular savanna hills offering 360 views of the majestic volcanic caldera.' 
                  : 'Bukit sabana hijau menyajikan lanskap 360 kaldera vulkanik yang menawan.'}
              </p>
              <button 
                onClick={() => setActiveTab('map')}
                className="text-[9px] font-black text-[#0EA5E9] flex items-center gap-0.5 mt-2 hover:underline cursor-pointer uppercase tracking-wider"
              >
                <span>{language === 'en' ? 'View on Map' : 'Buka Peta'}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </motion.div>

            {/* FLOATING UNESCO PIN OVERLAY */}
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-xl shadow-md border border-white/10 max-w-[150px]"
              style={{ transform: 'translateZ(50px)', transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#0EA5E9] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white stroke-[3.5]" />
                </div>
                <div className="leading-tight">
                  <span className="text-[8px] text-slate-300 font-bold uppercase block tracking-wider font-mono">UNESCO</span>
                  <span className="text-[10px] font-bold block leading-none">Global Geopark</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </section>

      {/* INTERACTIVE EXPANDABLE PREFERENCES PANEL */}
      <AnimatePresence>
        {showPreferencesPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' as any }}
            className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xl space-y-4 overflow-hidden"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-base text-[#0F172A]">{t('dash.pref.title')}</h3>
                <p className="text-xs text-[#64748B]">{t('dash.pref.sub')}</p>
              </div>
              <button 
                onClick={() => setShowPreferencesPanel(false)} 
                className="text-xs font-bold bg-gradient-to-r from-[#0F4C81] to-[#0EA5E9] hover:opacity-95 px-5 py-2.5 rounded-[18px] text-white shadow-sm transition-all duration-300 cursor-pointer"
              >
                {t('dash.pref.save_close')}
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {[
                { id: 'Nature', label: '🏞️ ' + t('dash.pref.nature') },
                { id: 'Culture', label: '📜 ' + t('dash.pref.culture') },
                { id: 'Culinary', label: '🍛 ' + t('dash.pref.culinary') },
                { id: 'Family', label: '👪 ' + t('dash.pref.family') }
              ].map(pref => {
                const selected = localInterests.includes(pref.id);
                return (
                  <button
                    key={pref.id}
                    onClick={() => toggleInterest(pref.id)}
                    className={`px-4 py-2 border rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      selected 
                        ? 'border-[#0EA5E9] bg-[#E0F2FE]/50 text-[#0F4C81]' 
                        : 'border-slate-200 text-[#64748B] hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] ${
                      selected ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white' : 'border-slate-300'
                    }`}>
                      {selected && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                    </div>
                    {pref.label}
                  </button>
                );
              })}
            </div>

            {user ? (
              <p className="text-[11px] text-emerald-600 flex items-center gap-1.5 font-semibold">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                {t('dash.pref.saved')}
              </p>
            ) : (
              <p className="text-[11px] text-[#64748B] italic">
                {t('dash.pref.guest')}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATISTICS SECTION WITH ANIMATED COUNTERS */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div 
              key={idx} 
              className="group bg-white border border-[#E0F2FE]/40 rounded-[18px] p-6 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono tracking-wider text-[#64748B] uppercase font-bold">{st.label}</p>
                <div className={`w-8 h-8 rounded-lg ${st.color} flex items-center justify-center transition-colors duration-300`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-display font-bold text-[#0F172A] tracking-tight">
                  <AnimatedCounter value={st.value} />
                  <span className="text-2xl font-bold">{st.suffix}</span>
                </p>
                <p className="text-[11px] text-[#64748B] mt-1.5 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* MAIN FEATURES BENTO GRID */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-6"
      >
        <div>
          <h2 className="font-display font-bold text-xl md:text-2xl text-[#0F172A] tracking-tight">{t('dash.nav_title')}</h2>
          <p className="text-xs text-[#64748B] mt-0.5">{t('dash.nav_desc')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {[
            { id: 'map', label: t('dash.nav.map_title'), desc: t('dash.nav.map_desc'), icon: Map, color: 'hover:bg-sky-50 text-[#0EA5E9] hover:border-[#0EA5E9]/30' },
            { id: 'recommendation', label: t('dash.nav.rec_title'), desc: t('dash.nav.rec_desc'), icon: Sparkles, color: 'hover:bg-amber-50 text-amber-600 hover:border-amber-200' },
            { id: 'planner', label: t('dash.nav.plan_title'), desc: t('dash.nav.plan_desc'), icon: Calendar, color: 'hover:bg-indigo-50 text-[#0F4C81] hover:border-[#0F4C81]/20' },
            { id: 'culture', label: t('dash.nav.cult_title'), desc: t('dash.nav.cult_desc'), icon: BookOpen, color: 'hover:bg-emerald-50 text-emerald-600 hover:border-emerald-200' },
            { id: 'culinary', label: t('dash.nav.cul_title'), desc: t('dash.nav.cul_desc'), icon: Coffee, color: 'hover:bg-rose-50 text-rose-600 hover:border-rose-200' },
            
          ].map(menuItem => {
            const Icon = menuItem.icon;
            return (
              <button
                key={menuItem.id}
                onClick={() => setActiveTab(menuItem.id as any)}
                className={`p-5 rounded-[18px] border border-slate-100 text-left flex flex-col justify-between h-41 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md cursor-pointer group bg-white ${menuItem.color}`}
              >
                <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-white shadow-xs w-11 h-11 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-[#0F172A] leading-tight group-hover:text-black transition-colors">{menuItem.label}</h4>
                  <p className="text-[10px] text-[#64748B] line-clamp-2 leading-relaxed">{menuItem.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* SMART NOTIFICATIONS & WEATHER WIDGET PANEL */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        
        {/* FESTIVAL NOTIFIER BANNER - COL-SPAN: 8 (DEEP DARK CONTAINER) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#081B33] to-[#0F4C81] text-white rounded-[18px] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between border border-white/10">
          <div className="absolute right-[-30px] top-[-30px] w-48 h-48 bg-[#0EA5E9]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-400 animate-bounce" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">{t('dash.notif.title')}</h3>
            </div>

            <p className="text-xs text-slate-300 max-w-xl">{t('dash.notif.desc')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {upcomingFestivals.map(fest => (
                <div key={fest.id} className="p-4 bg-slate-950/40 rounded-2xl border border-white/10 space-y-2 hover:border-[#0EA5E9]/40 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${fest.tagColor}`}>
                      {fest.status}
                    </span>
                    <span className="text-[9px] text-slate-300 font-mono font-bold">{fest.date}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white leading-snug">{fest.title}</h4>
                  <p className="text-[10px] text-slate-300 leading-relaxed">{fest.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
            <p className="text-[10px] text-slate-200">
              🌊 <b>Lake Toba Crossing Safety Status</b>: Ajibata - Ambarita and Muara - Samosir ferry lanes are operating smoothly under clean skies.
            </p>
          </div>
        </div>

        {/* WEATHER & CURRENT ADVISORY COMPACT BOX - COL-SPAN: 4 */}
        <div className="lg:col-span-4 bg-white rounded-[18px] border border-[#E0F2FE] shadow-md p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <CloudSun className="w-4 h-4 text-[#0EA5E9]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">{t('dash.weather.title')}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-5xl font-extrabold font-display text-[#0F172A]">24°C</span>
              <div>
                <span className="text-xs font-bold text-[#0F172A] block">Tuk-Tuk Siadong</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">⛅ {language === 'en' ? 'PARTLY CLOUDY • COOL' : 'CERAH BERAWAN • SEJUK'}</span>
              </div>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed">
              {t('dash.weather.desc')}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[9px] text-[#64748B] uppercase font-mono block">Wind Speed</span>
                <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1 mt-0.5">
                  <Wind className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  12 km/h
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[9px] text-[#64748B] uppercase font-mono block">Humidity</span>
                <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1 mt-0.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  78%
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-[#E0F2FE]/40 rounded-[18px] border border-[#E0F2FE] space-y-1">
            <span className="text-[9px] font-bold text-[#0F4C81] uppercase tracking-wider font-mono block">{t('dash.weather.tip')}</span>
            <p className="text-[10px] text-sky-950 leading-relaxed font-semibold">
              {t('dash.weather.tip_desc')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* AIRBNB-INSPIRED AI RECOMMENDATIONS SECTION */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-6"
      >
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-display font-bold text-xl md:text-2xl text-[#0F172A] tracking-tight">{t('dash.rec.title')}</h2>
            <p className="text-xs text-[#64748B] mt-0.5">{t('dash.rec.desc')}</p>
          </div>
          <button
            onClick={() => setActiveTab('map')}
            className="text-xs font-bold text-[#0EA5E9] hover:underline flex items-center gap-0.5 cursor-pointer font-sans"
          >
            <span>{t('dash.rec.explore')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {personalizedDestinations.length === 0 ? (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center text-slate-400 text-xs">
            {language === 'en' ? 'No geosites found matching your search term. Try another search query.' : 'Tidak ditemukan geosite yang cocok dengan kata pencarian Anda. Coba pencarian lain.'}
          </div>
        ) : (
          <motion.div 
            variants={cardContainerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {personalizedDestinations.slice(0, 6).map((dest, idx) => {
              const isTopPick = idx === 0 && searchTerm === '';
              return (
                <motion.div 
                   key={dest.id}
                   variants={cardItemVariants}
                   className="bg-white rounded-[18px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between border border-[#E0F2FE]/50 hover:-translate-y-1"
                >
                  {/* Card Image Frame */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Dark gradient visual tint on bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                    {/* Favorite Heart trigger */}
                    <button
                      onClick={() => toggleFavorite(dest.id, 'destination')}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#0F172A] flex items-center justify-center shadow-md backdrop-blur-xs transition-colors cursor-pointer"
                      title={t('dash.rec.favorite_tooltip')}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite(dest.id) ? 'fill-red-500 stroke-red-500' : 'stroke-[#0F172A]'}`} />
                    </button>

                    {/* Badge Stack */}
                    <div className="absolute bottom-4 left-4 flex gap-1.5 items-center">
                      <div className="bg-black/60 backdrop-blur-xs px-3 py-1 rounded-lg">
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider font-mono">
                          {language === 'en' ? dest.category : dest.category === 'Nature' ? 'Alam' : dest.category === 'Culture' ? 'Budaya' : dest.category}
                        </span>
                      </div>
                      {isTopPick && (
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                          <Sparkles className="w-3 h-3 fill-white" />
                          <span className="text-[9px] font-extrabold uppercase tracking-wider font-mono">{language === 'en' ? 'AI PICK' : 'PILIHAN AI'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Body Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#0EA5E9] uppercase tracking-wider">{dest.district}</span>
                      <h3 className="font-display font-bold text-base text-[#0F172A] leading-tight mt-1 group-hover:text-[#0EA5E9] transition-colors">{dest.name}</h3>
                      <p className="text-xs text-[#64748B] line-clamp-2 mt-2 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>

                    {/* Card Pricing and Star Ratings */}
                    <div className="flex items-center justify-between text-xs pt-3.5 border-t border-slate-50">
                      <div>
                        <span className="text-[9px] text-[#64748B] block uppercase tracking-wider font-mono">{language === 'en' ? 'ENTRY FEE' : 'TIKET MASUK'}</span>
                        <span className="font-extrabold text-[#0F172A] text-[13px]">{dest.ticketPrice === 0 ? (language === 'en' ? 'Free' : 'Gratis') : `Rp ${dest.ticketPrice.toLocaleString('id-ID')}`}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        <span className="font-bold text-amber-800 text-[11px]">{dest.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* REVIEWS SECTION SPLIT INTO TWO COLUMNS */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-6 pt-4"
      >
        <div>
          <h2 className="font-display font-bold text-xl md:text-2xl text-[#0F172A] tracking-tight">{t('dash.review.title')}</h2>
          <p className="text-xs text-[#64748B] mt-0.5">{t('dash.review.desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: RECENT REVIEWS FEED (COL-SPAN: 7) */}
          <div className="lg:col-span-7 bg-white rounded-[18px] border border-[#E0F2FE] shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#0EA5E9]" />
                <h3 className="font-bold text-sm text-[#0F172A]">{t('dash.review.recent')}</h3>
              </div>
              <span className="text-[10px] font-mono text-[#64748B] font-bold">{localFeed.length} Reviews</span>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
              {localFeed.map(rev => (
                <div key={rev.id} className="p-4 rounded-[14px] bg-[#F8FAFC] border border-slate-100 space-y-2 hover:bg-slate-100/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-extrabold text-xs text-[#0F172A] block">{rev.userName}</span>
                      <span className="text-[9px] font-mono text-[#0EA5E9] uppercase tracking-wider block mt-0.5 font-bold">📍 {getDestName(rev.destinationId || '')}</span>
                    </div>
                    
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-300'}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                  
                  <div className="flex justify-between items-center pt-1 text-[8px] text-[#64748B] font-mono">
                    <span className="flex items-center gap-1 font-bold text-emerald-600 uppercase">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified Traveler
                    </span>
                    <span>{new Date(rev.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 2: WRITE REVIEW FORM (COL-SPAN: 5) */}
          <div className="lg:col-span-5 bg-white rounded-[18px] border border-[#E0F2FE] shadow-md p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#0F172A]">{t('dash.review.write')}</h3>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                {language === 'en' 
                  ? 'Share your genuine experiences to guide fellow travelers across the majestic Lake Toba Geopark.' 
                  : 'Bagikan petualangan nyata Anda untuk menginspirasi petualang lain menjelajah kawasan pusaka Kaldera Toba.'}
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              
              {/* SELECT DESTINATION */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">{t('dash.review.dest_select')}</label>
                <select
                  value={selectedDestId}
                  onChange={(e) => setSelectedDestId(e.target.value)}
                  className="w-full p-3 border border-[#E0F2FE] rounded-xl text-xs bg-[#F8FAFC] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/10 focus:border-[#0EA5E9] transition-all cursor-pointer"
                >
                  {TOBA_DESTINATIONS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* RATING SLIDER */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">{t('dash.review.rating_label')}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(stars => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setReviewRating(stars)}
                      className={`flex-1 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        reviewRating === stars 
                          ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-xs' 
                          : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                      }`}
                    >
                      ⭐ {stars}
                    </button>
                  ))}
                </div>
              </div>

              {/* COMMENT */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">{language === 'en' ? 'Your Feedback' : 'Ulasan Anda'}</label>
                <textarea
                  rows={4}
                  placeholder={language === 'en' ? 'Share your feedback on facility comfort, scenery, and local friendliness...' : 'Bagikan kenyamanan fasilitas, keindahan alam, kebersihan jalur trekking, serta keramahan lokal...'}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-3 border border-[#E0F2FE] rounded-xl text-xs bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/10 focus:border-[#0EA5E9] resize-none text-slate-700 transition-all leading-relaxed"
                  required
                />
              </div>

              {/* COMPOSER SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#0F4C81] to-[#0EA5E9] hover:from-[#2563EB] hover:to-[#0EA5E9] text-white rounded-[18px] text-xs font-bold shadow-md shadow-[#0EA5E9]/10 hover:shadow-[#0EA5E9]/20 hover:-translate-y-0.5 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300/20" />
                <span>{t('dash.review.submit')}</span>
              </button>
            </form>
          </div>

        </div>
      </motion.div>

    </div>
  );
}
