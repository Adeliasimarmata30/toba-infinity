import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'id' | 'en';

export const translations = {
  id: {
    // Navigation & General
    'brand.sub': 'SMART TOURISM PORTAL',
    'nav.home': 'Beranda',
    'nav.map': 'Peta GIS',
    'nav.recommendation': 'AI Rekomendasi',
    'nav.planner': 'AI Trip Planner',
    'nav.culture': 'Seni Budaya',
    'nav.culinary': 'Kuliner',
    'nav.profile': 'Profil Saya',
    'nav.chat': 'Asisten AI',
    'button.ask_ai': 'Tanya Asisten AI',
    'button.login_session': 'Sesi masuk:',
    'button.close': 'Tutup',
    'button.active': 'AKTIF',
    'footer.description': 'Platform Informasi & Asisten AI Pariwisata Geopark Global Kaldera Toba UNESCO',
    'footer.credit': 'Aplikasi ini didesain khusus untuk mendukung konservasi warisan bumi, pemberdayaan ekonomi kreatif lokal, dan digitalisasi pariwisata Toba.',

    // Dashboard
    'dash.title.default': 'Jelajahi Keabadian Toba Caldera',
    'dash.title.culture_nature': 'Eksplorasi Keajaiban Budaya & Alam Toba',
    'dash.title.culture': 'Telusuri Warisan Luhur Adat Batak Toba',
    'dash.title.nature': 'Nikmati Panorama Hijau & Geosite Megah Toba',
    'dash.title.culinary': 'Sajian Kuliner Andaliman Autentik Toba',
    'dash.hero_desc': 'Portal pariwisata pintar Anda yang memadukan navigasi GIS berpresisi tinggi dengan asisten AI RAG untuk membongkar kebudayaan suku Batak, letusan supervolcano kuno, dan menyusun trip budget teroptimasi.',
    'dash.button.map': 'Buka Peta GIS',
    'dash.button.planner': 'Trip Planner & Budget',
    'dash.button.pref': 'Sesuaikan Minat',
    'dash.pref.title': 'Personalisasi Kontrol Beranda Anda',
    'dash.pref.sub': 'Pilih minat Anda untuk menyesuaikan urutan geosite teratas dan menu rekomendasi otomatis.',
    'dash.pref.save_close': 'Simpan & Tutup',
    'dash.pref.nature': 'Wisata Alam & Geosite',
    'dash.pref.culture': 'Sejarah & Kebudayaan Batak',
    'dash.pref.culinary': 'Kuliner Andaliman Autentik',
    'dash.pref.family': 'Rekreasi & Hiburan Keluarga',
    'dash.pref.saved': 'Preferensi Anda disimpan secara permanen pada database profil Supabase Anda.',
    'dash.pref.guest': 'Anda berjelajah sebagai tamu. Preferensi disimpan sementara di saringan memori beranda.',
    'dash.stats.lake': 'Luas Danau',
    'dash.stats.districts': 'Kabupaten Caldera',
    'dash.stats.geosites': 'Geosite UNESCO',
    'dash.stats.elevation': 'Rata-rata Ketinggian',
    'dash.nav_title': 'NAVIGASI FITUR UTAMA',
    'dash.nav_desc': 'Akses cepat seluruh layanan pintar Toba Infinity dalam jangkauan satu ketukan presisi.',
    'dash.nav.map_title': 'Peta GIS Interaktif',
    'dash.nav.map_desc': 'Navigasi geosite & rute geopark terintegrasi',
    'dash.nav.rec_title': 'AI Rekomendasi',
    'dash.nav.rec_desc': 'Rencana cerdas objek wisata personal',
    'dash.nav.plan_title': 'AI Trip Planner',
    'dash.nav.plan_desc': 'Rencana perjalanan & estimasi biaya otomatis',
    'dash.nav.cult_title': 'Seni Budaya Batak',
    'dash.nav.cult_desc': 'Edukasi sejarah, aksara & dokumentasi video',
    'dash.nav.cul_title': 'Kuliner Autentik',
    'dash.nav.cul_desc': 'Panduan resep video & lapo bersertifikat maps',
    'dash.nav.prof_title': 'Profil Saya',
    'dash.nav.prof_desc': 'Manajemen akun & saringan preferensi Supabase',

    // Weather & Notification
    'dash.weather.title': 'Cuaca & Rekomendasi Aktivitas',
    'dash.weather.desc': 'Kondisi atmosfer aktual di sekitar kaldera, terhubung dengan rekomendasi aktivitas geosite aman.',
    'dash.weather.temp_sub': 'Suhu rata-rata Samosir - Cerah Berawan',
    'dash.weather.tip': 'Rekomendasi Hari Ini:',
    'dash.weather.tip_desc': 'Cuaca sangat ideal untuk trekking Bukit Holbung atau berlayar ke Pulau Samosir. Gunakan tabir surya dan pelindung kepala.',
    'dash.notif.title': 'Notifikasi Pintar & Festival',
    'dash.notif.desc': 'Ikuti rangkaian agenda budaya dan informasi penting keamanan rute geopark Toba.',
    'dash.notif.status_upcoming': 'Segera Hadir',
    'dash.notif.status_popular': 'Populer',

    // Personal recommendation
    'dash.rec.title': 'REKOMENDASI PERSONALISASI ANDA',
    'dash.rec.desc': 'Geosite dan objek wisata yang dikurasi khusus berdasarkan saringan minat Anda saat ini.',
    'dash.rec.favorite_tooltip': 'Sukai',
    'dash.rec.rating': 'Rating',
    'dash.rec.explore': 'Lihat Detail Peta',

    // Review Feed
    'dash.review.title': 'UMPAN BALIK & ULASAN KOMUNITAS',
    'dash.review.desc': 'Bagikan pengalaman petualangan Anda atau baca cerita inspiratif dari wisatawan lain di Danau Toba.',
    'dash.review.write': 'Tulis Ulasan Perjalanan',
    'dash.review.dest_select': 'Pilih Objek Wisata',
    'dash.review.rating_label': 'Skor Penilaian',
    'dash.review.placeholder': 'Tulis ulasan jujur Anda di sini... (misal: Keindahan pemandangan, keramahan lokal, kebersihan jalur trekking)',
    'dash.review.submit': 'Kirim Ulasan Publik',
    'dash.review.guest_warning': 'Anda sedang menulis sebagai tamu. Masuk untuk menautkan ulasan dengan profil permanen Anda.',
    'dash.review.recent': 'Ulasan Perjalanan Terbaru',

    // Chat
    'chat.welcome': 'Asisten AI Caldera (RAG)',
    'chat.close': 'Tutup',
    'chat.ask_placeholder': 'Ketik pertanyaan tentang Danau Toba...',
    'chat.send': 'Kirim',

    // Shared labels
    'label.history': 'Sejarah & Makna Budaya',
    'label.ingredients': 'Bahan Utama',
    'label.preparation': 'Langkah Pembuatan',
    'label.recommended_locations': 'Rekomendasi Lapo & Tempat Makan Terdekat (Klik untuk Navigasi Google Maps)',
    'label.video_guide': 'Video Panduan Pembuatan & Liputan Kuliner',
    'label.video_culture': 'Video Penjelasan & Dokumentasi Kebudayaan Batak'
  },
  en: {
    // Navigation & General
    'brand.sub': 'SMART TOURISM PORTAL',
    'nav.home': 'Home',
    'nav.map': 'GIS Map',
    'nav.recommendation': 'AI Recommendation',
    'nav.planner': 'AI Trip Planner',
    'nav.culture': 'Art & Culture',
    'nav.culinary': 'Culinary',
    'nav.profile': 'My Profile',
    'nav.chat': 'AI Assistant',
    'button.ask_ai': 'Ask AI Assistant',
    'button.login_session': 'Signed in as:',
    'button.close': 'Close',
    'button.active': 'ACTIVE',
    'footer.description': 'Information Platform & AI Assistant for UNESCO Global Geopark Lake Toba Caldera',
    'footer.credit': 'This application is specifically designed to support Earth heritage conservation, local creative economy empowerment, and Toba tourism digitalization.',

    // Dashboard
    'dash.title.default': 'Explore the Eternity of Toba Caldera',
    'dash.title.culture_nature': 'Explore the Wonders of Toba Culture & Nature',
    'dash.title.culture': 'Explore the Noble Heritage of Batak Toba',
    'dash.title.nature': 'Enjoy the Green Panorama & Majestic Toba Geosites',
    'dash.title.culinary': 'Authentic Toba Andaliman Culinary Offerings',
    'dash.hero_desc': 'Your smart tourism portal blending high-precision GIS navigation with a RAG AI assistant to explore Batak culture, ancient supervolcano eruptions, and compile optimized trip budgets.',
    'dash.button.map': 'Open GIS Map',
    'dash.button.planner': 'Trip Planner & Budget',
    'dash.button.pref': 'Customize Interests',
    'dash.pref.title': 'Personalize Your Home Experience',
    'dash.pref.sub': 'Choose your interests to customize the order of top geosites and automatic recommendation menus.',
    'dash.pref.save_close': 'Save & Close',
    'dash.pref.nature': 'Nature & Geosites',
    'dash.pref.culture': 'Batak History & Culture',
    'dash.pref.culinary': 'Authentic Andaliman Culinary',
    'dash.pref.family': 'Family Recreation & Leisure',
    'dash.pref.saved': 'Your preferences are saved permanently in your profile database.',
    'dash.pref.guest': 'You are exploring as a guest. Preferences are temporarily saved in local home memory.',
    'dash.stats.lake': 'Lake Area',
    'dash.stats.districts': 'Caldera Districts',
    'dash.stats.geosites': 'UNESCO Geosites',
    'dash.stats.elevation': 'Average Elevation',
    'dash.nav_title': 'MAIN FEATURE NAVIGATION',
    'dash.nav_desc': 'Quick access to all Toba Infinity smart services within a single precise tap.',
    'dash.nav.map_title': 'Interactive GIS Map',
    'dash.nav.map_desc': 'Navigate integrated geosites & geopark routes',
    'dash.nav.rec_title': 'AI Recommendation',
    'dash.nav.rec_desc': 'Smart personalized travel recommendations',
    'dash.nav.plan_title': 'AI Trip Planner',
    'dash.nav.plan_desc': 'Automated travel planning & cost estimation',
    'dash.nav.cult_title': 'Batak Arts & Culture',
    'dash.nav.cult_desc': 'Educational history, scripts & video documentation',
    'dash.nav.cul_title': 'Authentic Culinary',
    'dash.nav.cul_desc': 'Recipe video guides & maps-certified lapo listings',
    'dash.nav.prof_title': 'My Profile',
    'dash.nav.prof_desc': 'Manage accounts & customize preferences',

    // Weather & Notification
    'dash.weather.title': 'Weather & Activity Guidance',
    'dash.weather.desc': 'Current atmospheric conditions around the caldera, connected to safe geosite activity guidance.',
    'dash.weather.temp_sub': 'Average Samosir Temperature - Partly Cloudy',
    'dash.weather.tip': 'Today\'s Recommendation:',
    'dash.weather.tip_desc': 'The weather is ideal for trekking Bukit Holbung or sailing to Samosir Island. Remember to wear sunscreen and a hat.',
    'dash.notif.title': 'Smart Notifications & Festivals',
    'dash.notif.desc': 'Follow cultural event agendas and stay updated on important Toba geopark route safety notifications.',
    'dash.notif.status_upcoming': 'Upcoming',
    'dash.notif.status_popular': 'Popular',

    // Personal recommendation
    'dash.rec.title': 'YOUR PERSONAL RECOMMENDATIONS',
    'dash.rec.desc': 'Geosites and attractions curated based on your current interest profile.',
    'dash.rec.favorite_tooltip': 'Favorite',
    'dash.rec.rating': 'Rating',
    'dash.rec.explore': 'View on Map',

    // Review Feed
    'dash.review.title': 'COMMUNITY FEEDBACK & REVIEWS',
    'dash.review.desc': 'Share your adventure experiences or read inspiring stories from other travelers at Lake Toba.',
    'dash.review.write': 'Write a Travel Review',
    'dash.review.dest_select': 'Select Attraction',
    'dash.review.rating_label': 'Rating Score',
    'dash.review.placeholder': 'Write your honest review here... (e.g., beautiful scenery, warm locals, clean trekking paths)',
    'dash.review.submit': 'Submit Public Review',
    'dash.review.guest_warning': 'You are writing as a guest. Log in to link reviews with your permanent profile.',
    'dash.review.recent': 'Recent Travel Reviews',

    // Chat
    'chat.welcome': 'Caldera AI Assistant (RAG)',
    'chat.close': 'Close',
    'chat.ask_placeholder': 'Type your question about Lake Toba...',
    'chat.send': 'Send',

    // Shared labels
    'label.history': 'History & Cultural Significance',
    'label.ingredients': 'Key Ingredients',
    'label.preparation': 'Preparation Steps',
    'label.recommended_locations': 'Recommended Nearby Lapo & Food Places (Click to Open Google Maps)',
    'label.video_guide': 'Recipe Video Guide & Culinary Coverage',
    'label.video_culture': 'Explanation Video & Batak Cultural Documentation'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['id'] | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('toba_lang');
    return (saved === 'id' || saved === 'en') ? saved : 'id';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('toba_lang', lang);
  };

  const t = (key: string): string => {
    const dict = translations[language] || translations['id'];
    return (dict as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
