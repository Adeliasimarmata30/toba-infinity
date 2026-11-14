/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Destination, Hotel, Culinary, Culture } from '../types';

export const TOBA_DISTRICTS = [
  'Samosir',
  'Toba',
  'Karo',
  'Simalungun',
  'Humbang Hasundutan',
  'Dairi',
  'Pakpak Bharat',
  'North Tapanuli'
];

export const TOBA_DESTINATIONS: Destination[] = [
  {
    id: 'dest-sibodiala',
    name: 'Paralayang Puncak Sibodiala, Balige',
    description: 'Spot paralayang Puncak Sibodiala, Balige dibuka tahun 2024. Puncak Sibodiala memiliki pemandangan yang memukau mulai dari hutan pinus, deretan perbukitan, perkampungan dan perkebunan warga hingga pemandangan Danau Toba yang sangat luas. Dekat dengan Puncak Sibodiala terdapat Batu Basiha, formasi batuan vulkanik sisa ledakan maha dahsyat Toba 74.000 tahun silam. Pengunjung bisa mencoba paralayang dengan tarif Rp 550.000 (sudah termasuk asuransi kecelakaan).',
    district: 'Toba',
    category: 'Adventure',
    latitude: 2.3168,
    longitude: 99.0984,
    openingHours: '10:00 WIB - 17:00 WIB',
    ticketPrice: 550000,
    image: 'https://onetoba.com/wp-content/uploads/2025/10/u09ulfz7n7vj8bp.jpeg',
    rating: 4.8,
    facilities: ['Paragliding Equipment', 'Professional Instructor', 'Insurance', 'Safety Gear', 'Photo Spots', 'Parking Lot']
  },
  {
    id: 'dest-jumabulu',
    name: 'Juma Bulu River Side Ajibata',
    description: 'Juma Bulu River Side Ajibata menawarkan pesona sungai yang sejuk, jernih, dan dikelilingi oleh persawahan hijau nan asri di Desa Pardomuan Ajibata. Objek wisata ini sangat populer dengan aktivitas River Tubing, area berkemah (camping ground) di tepi sungai yang menenangkan, serta jalur tracking menantang menuju Air Terjun Batu Papan yang eksotis.',
    district: 'Toba',
    category: 'Nature',
    latitude: 2.6105,
    longitude: 98.9664,
    openingHours: '08:00 WIB - 18:00 WIB',
    ticketPrice: 50000,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop',
    rating: 4.6,
    facilities: ['River Tubing', 'Camping Ground', 'Trekking Guide', 'Waterfall Access', 'Toilets', 'Worship Room']
  },
  {
    id: 'dest-kano',
    name: 'Permainan Kano Pantai Bulbul',
    description: 'Aktivitas rekreasi air seru menggunakan perahu kano ringan berkapasitas maksimal dua orang di sepanjang pesisir Pantai Pasir Putih Lumban Bulbul, Balige. Mengayuh kano di atas jernihnya air Danau Toba yang tenang sambil menikmati tiupan angin sepoi-sepoi pegunungan adalah pengalaman santai yang ramah keluarga.',
    district: 'Toba',
    category: 'Adventure',
    latitude: 2.3486,
    longitude: 99.0851,
    openingHours: '08:00 WIB - 18:00 WIB',
    ticketPrice: 50000,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
    rating: 4.5,
    facilities: ['Canoe Rental', 'Life Jackets', 'Safety Instructors', 'Beach Gazebos', 'Toilets']
  },
  {
    id: 'dest-simarjarunjung',
    name: 'Bukit Indah Simarjarunjung',
    description: 'Menawarkan mahakarya lanskap alam spektakuler di mana Anda dapat memandangi bentangan luas perairan biru Danau Toba dari ketinggian puncak bukit yang sejuk. Destinasi ini dilengkapi dengan puluhan spot foto kreatif yang sangat instagramable, mulai dari rumah pohon, sepeda gantung yang memicu adrenalin, kursi layang, ayunan langit, hingga gardu pandang kayu berlatar kaldera.',
    district: 'Simalungun',
    category: 'Nature',
    latitude: 2.7667,
    longitude: 98.7833,
    openingHours: '07:00 WIB - 19:00 WIB',
    ticketPrice: 15000,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    facilities: ['Instagenic Photo Spots', 'Treehouses', 'Suspended Bicycle', 'Local Cafes', 'Restrooms', 'Parking Space']
  },
  {
    id: 'dest-flyboard',
    name: 'Flyboard di Parapat',
    description: 'Atraksi olahraga air modern terbaru yang sedang tren di perairan Parapat, Danau Toba. Menggunakan papan terbang bertenaga tekanan jet air tinggi, wisatawan dapat melayang bebas hingga beberapa meter di atas permukaan Danau Toba dan melakukan berbagai manuver akrobatik udara yang menantang.',
    district: 'Simalungun',
    category: 'Adventure',
    latitude: 2.6625,
    longitude: 98.9372,
    openingHours: '09:00 WIB - 17:00 WIB',
    ticketPrice: 250000,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcW_rFWaNYfONKwg6fLIVu8PLF7nw5USbDYWzFOFzZcYC-DWebxg6C-BU&s=10',
    rating: 4.8,
    facilities: ['Flyboard Apparatus', 'Safety Helmet', 'Life Jacket', 'Professional Instructor', 'Speedboat Support']
  },
  {
    id: 'dest-atvsidamanik',
    name: 'ATV di Kebun Teh Sidamanik',
    description: 'Menjelajahi keindahan hijau perkebunan teh legendaris Sidamanik menggunakan kendaraan motor tangguh ATV (All Terrain Vehicle). Wisatawan diajak berkendara menyusuri jalur tanah di tengah hamparan rumpun teh yang berundak-undak, ditemani udara pegunungan yang sangat bersih, sejuk, dan berkabut tipis.',
    district: 'Simalungun',
    category: 'Adventure',
    latitude: 2.9234,
    longitude: 99.0432,
    openingHours: '08:00 WIB - 17:00 WIB',
    ticketPrice: 50000,
    image: 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?q=80&w=800&auto=format&fit=crop',
    rating: 4.6,
    facilities: ['ATV Rental (30 Mins)', 'Safety Helmet', 'Guided Tea Trails', 'Refreshment Stalls', 'Parking Lot']
  },
  {
    id: 'dest-kulikiparalayang',
    name: 'Kuliki Paralayang di Tongging',
    description: 'Wisata olahraga udara prestisius di Desa Wisata Tongging, Kabupaten Karo. Lepas landas dari perbukitan tinggi menggunakan parasut tandem, wisatawan akan melayang bebas memanfaatkan hembusan angin pegunungan yang ideal, disuguhi pemandangan spektakuler Air Terjun Sipiso-piso dari udara, lembah subur Tongging, serta perairan utara Danau Toba yang berkilau.',
    district: 'Karo',
    category: 'Adventure',
    latitude: 2.9101,
    longitude: 98.5304,
    openingHours: '09:00 WIB - 17:00 WIB',
    ticketPrice: 900000,
    image: 'https://asset-2.tstatic.net/medan/foto/bank/images/kuliki_paralayang_club.jpg',
    rating: 4.9,
    facilities: ['Tandem Flight Pilots', 'Certified Safety Gear', 'Personal Insurance', 'GoPro Aerial Video', 'Rest Lounge']
  },
  {
    id: 'dest-canyoneeringsikulikap',
    name: 'Canyoneering di Air Terjun Sikulikap',
    description: 'Aktivitas petualangan ekstrem menantang di kawasan Penatapan Doulu, Berastagi. Canyoneering menggabungkan teknik trekking menyusuri ngarai sempit, rappelling menuruni tebing licin di samping derasnya guyuran Air Terjun Sikulikap, memanjat dinding batu, serta melompat dan meluncur ke dalam kolam alami air pegunungan yang sangat dingin.',
    district: 'Karo',
    category: 'Adventure',
    latitude: 3.1954,
    longitude: 98.5255,
    openingHours: '08:30 WIB - 16:00 WIB',
    ticketPrice: 150000,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    facilities: ['Rappelling Harness & Ropes', 'Safety Helmet', 'Wet Suits & Neoprene Socks', 'Professional Rescue Guides', 'First Aid Kit']
  },
  {
    id: 'dest-berkudagundaling',
    name: 'Berkuda di Gundaling',
    description: 'Menikmati udara dingin pegunungan Berastagi sambil menunggangi kuda sewaan menyusuri jalur rindang di puncak Bukit Gundaling. Pengunjung dapat memilih berkuda mandiri dengan pengawasan pemandu lokal, atau berkeliling santai menaiki delman (kereta kuda hias) bersama keluarga, menempuh rute asri dari puncak bukit menuju Pasar Buah Berastagi.',
    district: 'Karo',
    category: 'Family',
    latitude: 3.1894,
    longitude: 98.5042,
    openingHours: '08:00 WIB - 17:30 WIB',
    ticketPrice: 20000,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop',
    rating: 4.5,
    facilities: ['Horse Rental', 'Decorated Delman', 'Pemandu Kuda', 'Souvenir Stalls', 'Photo Spots']
  },
  {
    id: 'dest-pacuankuda',
    name: 'Pacuan Kuda Hoda Marsiadu Siborong-borong',
    description: 'Olahraga pacuan kuda tradisional Batak legendaris yang rutin diselenggarakan secara meriah di Siborong-borong, Tapanuli Utara. Event budaya sakral ini memadukan ketangkasan berkuda para joki muda setempat dengan ritual upacara adat, doa bersama memohon keselamatan, serta dentuman Gondang Sabangunan yang membakar semangat penonton sebagai wujud solidaritas persaudaraan Batak.',
    district: 'North Tapanuli',
    category: 'Culture',
    latitude: 2.2135,
    longitude: 98.9712,
    openingHours: 'Event-Based Schedule',
    ticketPrice: 25000,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZuqtjsUF84InxbHtYjSzhvkvZ1ZgUxkefIZUMH8YGHg&s=10',
    rating: 4.8,
    facilities: ['Race Track Arena', 'Tribun Penonton', 'Local Food Court', 'Gondang Live Music', 'Restrooms']
  },
  {
    id: 'dest-paralayanghutaginjang',
    name: 'Paralayang Huta Ginjang',
    description: 'Terletak di Kecamatan Muara, Tapanuli Utara pada ketinggian 1500 mdpl, Puncak Huta Ginjang diakui sebagai salah satu spot paralayang terbaik di Asia Tenggara karena memiliki kekuatan hembusan angin yang sangat ideal. Meluncur dari sini menyajikan sensasi terbang melintasi langit biru berlatar endapan vulkanik muda kaldera, Pulau Sibandang, dan jajaran bukit pinus.',
    district: 'North Tapanuli',
    category: 'Adventure',
    latitude: 2.2741,
    longitude: 98.8953,
    openingHours: '08:00 WIB - 18:00 WIB',
    ticketPrice: 500000,
    image: 'https://bisanews.id/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-04-at-08.00.58_7f256ca3.jpg',
    rating: 4.9,
    facilities: ['Tandem Flights', 'Professional Flight Instructors', 'Telescope Viewing Deck', 'Pine Forest Hiking Trails', 'Food Court', 'Worship Room']
  },
  {
    id: 'dest-waterfront',
    name: 'Waterfront City Pangururan',
    description: 'Mahakarya destinasi modern pertama di tepian Danau Toba, Pangururan, Samosir yang mengintegrasikan keindahan tata air dengan pertunjukan seni canggih. Menampilkan atraksi air mancur menari (musical dancing fountain) warna-warni megah diiringi musik etnik Batak, serta pemutaran film/kisah legenda terbentuknya Danau Toba melalui teknologi pantulan proyektor air yang memukau.',
    district: 'Samosir',
    category: 'Family',
    latitude: 2.6288,
    longitude: 98.7188,
    openingHours: 'Sesi I: 19:00 WIB, Sesi II: 21:00 WIB',
    ticketPrice: 0,
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    facilities: ['Musical Fountain Show', 'Interactive Water Screen Projection', 'Seaside Pedestrian Walkway', 'Aesthetic Bridges', 'Food Court', 'Toilets']
  },
  {
    id: 'dest-sigalegale',
    name: 'Situs Budaya Boneka Sigale-gale',
    description: 'Pertunjukan boneka kayu mistis legendaris di Desa Tomok, Samosir. Berasal dari kata "gale" yang berarti lemah gemulai, boneka seukuran manusia ini diletakkan di atas podium kayu dan dimainkan dengan sistem tali mekanis rahasia sehingga dapat menari Tor-Tor secara indah. Pertunjukan ini mengenang kisah haru Manggale, putra Raja Rahat penguasa Samosir kuno yang gugur di medan perang.',
    district: 'Samosir',
    category: 'Culture',
    latitude: 2.6611,
    longitude: 98.8622,
    openingHours: '08:00 WIB - 17:30 WIB',
    ticketPrice: 15000,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    facilities: ['Live Tor-Tor Performance', 'Traditional Gondang Musicians', 'Batak Traditional Cloths (Ulos)', 'Cultural Guides', 'Souvenir Outlets']
  },
  {
    id: 'dest-hutaraja',
    name: 'Kampung Ulos Hutaraja',
    description: 'Kampung Ulos Hutaraja di Simanindo, Samosir adalah salah satu desa adat terbaik yang melestarikan warisan seni tenun kain Ulos Batak secara turun-temurun sejak ratusan tahun silam. Wisatawan dapat menyaksikan langsung para perajin wanita menenun ulos menggunakan alat tenun gedogan kayu tradisional, berinteraksi di bawah bayang-bayang Ruma Bolon adat asli yang indah, dan membeli suvenir tenun otentik.',
    district: 'Samosir',
    category: 'Culture',
    latitude: 2.5954,
    longitude: 98.7423,
    openingHours: '08:00 WIB - 18:00 WIB',
    ticketPrice: 10000,
    image: 'https://tse1.mm.bing.net/th/id/OIP.WNwKIGYVeQBEcnHJGM7BPgHaEJ?r=0&pid=Api&h=220&P=0',
    rating: 4.9,
    facilities: ['Weaving Workshop Tour', 'Handicraft Souvenir Shops', 'Historic Ruma Bolon Houses', 'Local Home Guides', 'Worship Room', 'Clean Toilets']
  }
];

export const TOBA_HOTELS: Hotel[] = [
  {
    id: 'hotel-labersa',
    name: 'Labersa Hotel & Convention Balige',
    description: 'A 4-star premium luxury hotel in Balige featuring comprehensive convention centers, elegant architectural accents, a large themed waterpark, and dynamic views overlooking the southern shores of the lake.',
    rating: 4.7,
    facilities: ['Theme Waterpark', 'Free Wi-Fi', 'Swimming Pool', 'Meeting Rooms', 'Gym & Fitness Center', 'Restaurant & Lounge'],
    priceRange: 'Rp 900.000 - Rp 2.100.000',
    district: 'Toba',
    latitude: 2.3456,
    longitude: 99.0723,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'hotel-tiarabunga',
    name: 'Tiara Bunga Hotel & Villa',
    description: 'An idyllic, secluded resort accessible only by boat. Settled right on a private lakeshore peninsula, it provides ultimate tranquility, romantic lakeside dining, and lush mountain-backed villas.',
    rating: 4.5,
    facilities: ['Private Beach Side', 'Boat Transport Service', 'Lakeside Pool', 'Restaurant', 'Fishing Spots', 'Water Sports'],
    priceRange: 'Rp 650.000 - Rp 1.400.000',
    district: 'Toba',
    latitude: 2.4011,
    longitude: 99.0221,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'hotel-marianna',
    name: 'Marianna Resort & Convention',
    description: 'The first premium 5-star international standard resort on Samosir Island. Marianna features sprawling modern villas, a spectacular infinity pool overlooking the caldera, and comprehensive luxury spa treatments.',
    rating: 4.9,
    facilities: ['Infinity Pool', 'World-Class Spa', 'Lakeside Cabanas', 'Fitness Center', 'Kids Club', 'Fine Dining Restaurant', 'High-Speed Wi-Fi'],
    priceRange: 'Rp 1.800.000 - Rp 5.000.000',
    district: 'Samosir',
    latitude: 2.6712,
    longitude: 98.8541,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'hotel-atsari',
    name: 'Atsari Hotel Parapat',
    description: 'A cozy, exceptionally green plant-filled modern hotel located in the heart of Parapat town. Within minutes from transit harbors, it features beautiful garden courtyards and outstanding hospitality.',
    rating: 4.3,
    facilities: ['Lush Inner Gardens', 'Sky Cafe', 'Free Wi-Fi', 'Coffee Maker', 'Hot Shower', 'Conference Rooms'],
    priceRange: 'Rp 450.000 - Rp 850.000',
    district: 'Simalungun',
    latitude: 2.6587,
    longitude: 98.9391,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'hotel-niagara',
    name: 'Niagara Hotel & Resort Parapat',
    description: 'Perched high on a hilltop, Niagara Hotel offers arguably the most classic, majestic bird-eye panorama of the caldera. It is a massive legacy resort featuring expansive grounds, golf, and multiple pools.',
    rating: 4.5,
    facilities: ['Hilltop Pools', 'Golf Course Links', 'Tennis Courts', 'Jogging Track', 'Family playground', 'Traditional Buffet Restaurant'],
    priceRange: 'Rp 750.000 - Rp 1.900.000',
    district: 'Simalungun',
    latitude: 2.6701,
    longitude: 98.9412,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'hotel-tobavillage',
    name: 'Toba Village Inn Samosir',
    description: 'A quaint, highly charming German-Indonesian boutique lodge seated peacefully on Samosir Island shores. Known for its cozy home-like feel, gorgeous pool, and excellent organic fusion restaurant.',
    rating: 4.6,
    facilities: ['Lakeside Swim Pool', 'Direct Beach Access', 'Organic Garden Cafe', 'Free Wi-Fi', 'Bicycle Rentals'],
    priceRange: 'Rp 500.000 - Rp 1.100.000',
    district: 'Samosir',
    latitude: 2.6791,
    longitude: 98.8456,
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'hotel-zoes',
    name: "Zoe's Paradise Waterfront Hotel",
    description: 'A stellar, highly-rated waterfront boutique hotel on Samosir Island. Zoe’s focuses on personalized, eco-conscious hospitality, offering modern Swiss-style comfort infused with local Batak wooden arts.',
    rating: 4.8,
    facilities: ['Eco-friendly Amenities', 'Waterfront Pool', 'Lake Excursions', 'Fresh Bakery', 'Free Wi-Fi', 'Lakeside Balconies'],
    priceRange: 'Rp 600.000 - Rp 1.300.000',
    district: 'Samosir',
    latitude: 2.6841,
    longitude: 98.8312,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'hotel-samosirvilla',
    name: 'Samosir Villa Resort',
    description: 'A highly spacious, family-focused resort with modern hotel structures and traditional cottages set directly on Samosir’s Tuk-Tuk peninsula, offering three expansive pools and a vibrant marina.',
    rating: 4.4,
    facilities: ['Two Large Pools', 'Boat Jetty', 'Family Billiard Area', 'Lakeside Bar & Cafe', 'Spacious Gardens', 'Hot Showers'],
    priceRange: 'Rp 550.000 - Rp 1.250.000',
    district: 'Samosir',
    latitude: 2.6749,
    longitude: 98.8519,
    image: 'https://images.unsplash.com/photo-1611891404114-5090bc21c3b7?q=80&w=800&auto=format&fit=crop'
  }
];

export const TOBA_CULINARY: Culinary[] = [
  {
    id: 'cul-arsik',
    name: 'Arsik Dengke Mas',
    description: 'Arsik adalah mahakarya kuliner tradisional Batak berupa hidangan ikan mas yang dimasak dengan bumbu kuning khas yang kaya akan rempah endemik seperti andaliman dan asam cikala. Rasa getir-getir segar berpadu dengan gurihnya ikan segar dari perairan jernih Danau Toba.',
    history: 'Dalam adat Batak Toba, Arsik Dengke Mas bukan sekadar makanan biasa, melainkan simbol doa, berkat, dan ikatan kekeluargaan yang sakral. Sajian ini selalu hadir dalam upacara lingkaran kehidupan krusial—mulai dari pernikahan (pemberian ulos dan arsik oleh pihak Hula-hula kepada pengantin), kelahiran bayi, hingga syukuran pencapaian hidup. Jumlah ikan mas yang disajikan pun memiliki makna tersendiri: satu ekor melambangkan pasangan baru, tiga ekor melambangkan kelahiran anak, lima ekor melambangkan keluarga besar yang rukun, dan sembilan ekor melambangkan doa umur panjang serta kemakmuran tanpa batas.',
    ingredients: [
      'Ikan Mas Segar (Dengke Mas), biarkan sisiknya utuh melambangkan perlindungan/perisai diri',
      'Andaliman (Merica Batak liar khas dataran tinggi)',
      'Asam Cikala (Buah Kecombrang muda pemberi rasa asam segar)',
      'Bunga Kecombrang / Rias (Kuncup bunga wangi khas)',
      'Bawang Batak / Lokio (Bawang daun mini khas Sumatera Utara)',
      'Kacang Tanah sangrai (opsional pengganti kemiri)',
      'Kunyit, Jahe, Lengkuas, Serai, Cabai Merah, Bawang Merah, Bawang Putih'
    ],
    preparation: [
      'Bersihkan isi perut ikan mas secara hati-hati, biarkan sisiknya tetap utuh agar daging ikan tidak mudah hancur saat direbus berjam-jam.',
      'Giling halus kunyit, jahe, cabai, bawang merah, bawang putih, kemiri, serta andaliman segar hingga membentuk pasta kuning keemasan yang beraroma harum.',
      'Susun batang serai, lengkuas memar, bunga rias, dan asam cikala di dasar wajan sebagai alas pelindung agar ikan tidak gosong.',
      'Letakkan ikan mas di atas alas rempah tersebut, lalu balurkan bumbu halus kuning secara merata ke seluruh permukaan tubuh ikan.',
      'Tambahkan air hingga ikan terendam, taburkan bawang Batak di atasnya, lalu masak dengan api kecil (slow cook) selama 3-5 jam hingga seluruh duri melunak dan kuahnya menyusut menjadi glasir kuning yang kental, pekat, dan meresap sempurna.'
    ],
    recommendedLocations: [
      { name: 'Rumah Makan Nasional Balige', address: 'Jl. Sisingamangaraja No. 22, Balige, Toba', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rumah+Makan+Nasional+Balige' },
      { name: 'RM Silindung Samosir', address: 'Jl. Tuk Tuk, Tuk Tuk Siadong, Samosir', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=RM+Silindung+Samosir+Tuk+Tuk' }
    ],
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj-FqELj7oPLOEDAJdaEIX6t6Hgh5HE78e4wCiBXacq7HrMP0u654LAb1ylonVSmKBNXl7hJLtctIdCGQnyfKg-30yvrSrxdS-ZRaCtpZz6m0AblIWiPitSgUIoNyBSKciPYLAmrq9H5iRfX6D8iOiM_VtavcGDLq1bz-yYNufM77ONBDdiuE0gK8F12ELA/s1200/Makanan-khas-batak.jpg',
    youtubeUrl: 'https://www.youtube.com/embed/Sshx904Yg0o'
  },
  {
    id: 'cul-naniura',
    name: 'Dengke Mas Na Niura',
    description: 'Naniura sering dijuluki sebagai "Sashimi Khas Batak" atau Batak Sushi. Kuliner legendaris ini menyajikan ikan segar mentah yang dimasak murni tanpa api, melainkan melalui proses pengasaman asam jungga berpadu dengan balutan bumbu rempah mentah andaliman yang kuat.',
    history: 'Pada zaman kerajaan kuno Batak, Dengke Mas Na Niura adalah hidangan eksklusif para raja dan bangsawan. Hanya juru masak istana terpilih yang boleh meraciknya menggunakan ikan mas tangkapan pertama dari danau suci Toba. Keahlian mengolah Naniura diwariskan secara rahasia untuk menjaga kehormatan rasa. Kini, Naniura bertransformasi menjadi kuliner prestisius dalam menjamu tamu agung, melambangkan penghormatan tertinggi dari tuan rumah kepada sang pengembara.',
    ingredients: [
      'Ikan Mas atau Nila (Dengke Nila) yang sangat segar',
      'Asam Jungga (Jeruk purut khusus berkadar asam super tinggi)',
      'Andaliman mentah giling (Rempah getir khas Batak)',
      'Kemiri sangrai tumbuk halus (Pemberi rasa gurih kental)',
      'Jahe, Kunyit bakar, Shallots, Cabai rawit segar, Garam secukupnya'
    ],
    preparation: [
      'Fillet ikan mas atau nila segar secara presisi, buang duri-durinya, dan bersihkan darahnya hingga benar-benar bersih dan kesat.',
      'Seka fillet ikan dengan kain bersih hingga kering sempurna tanpa sisa air.',
      'Peras jeruk Asam Jungga murni di atas fillet ikan. Kadar asam tinggi jeruk ini akan mengubah struktur protein daging ikan secara kimiawi (proses denaturasi), membunuh bakteri sekaligus mematangkan daging secara alami tanpa panas.',
      'Diamkan ikan dalam rendaman asam selama 4 hingga 6 jam di tempat sejuk sampai tekstur daging mengeras, kenyal, dan berwarna putih susu matang.',
      'Giling kemiri sangrai, andaliman, kunyit bakar, jahe, bawang, dan cabai rawit hingga halus. Oleskan saus bumbu kental mentah ini ke seluruh permukaan fillet ikan yang telah "matang" asam, diamkan 1 jam agar meresap, lalu sajikan dingin.'
    ],
    recommendedLocations: [
      { name: 'RM Lapo Batak Tipang', address: 'Geosite Tipang Lakeside, Bakkara, Humbang Hasundutan', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=RM+Lapo+Batak+Tipang+Lakeside' },
      { name: 'RM Na Niura Balige', address: 'Jl. Patuan Nagari, Balige, Toba', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=RM+Na+Niura+Balige' }
    ],
    image: 'https://ik.imagekit.io/goodid/gnfi/uploads/articles/large-1560768797-800px-dengke-mas-na-n-2-05d18fe5af2522cd54f2823a9a854f95.jpg',
    youtubeUrl: 'https://www.youtube.com/embed/W9m0Tz_oNis'
  },
  {
    id: 'cul-miegomak',
    name: 'Mie Gomak',
    description: 'Mie Gomak adalah mie kuah atau mie goreng ikonik khas tanah Toba yang dibuat dari mie lidi berukuran tebal. Disajikan dengan siraman kuah santan kuning yang pedas, gurih, dan sangat harum aroma andaliman.',
    history: 'Nama "Gomak" dalam bahasa Batak berarti "digenggam" atau "diambil dengan tangan". Konon, di masa lampau sebelum sendok populer, para pedagang tradisional menyajikan mie ini dengan cara menjumput dan mengaduknya langsung menggunakan tangan kosong yang bersih untuk mencampur kuah dan mie lidi tebal tersebut. Hingga kini, Mie Gomak tetap menjadi menu sarapan wajib nomor satu yang menghangatkan tubuh masyarakat dataran tinggi Toba di pagi hari yang dingin.',
    ingredients: [
      'Mie Lidi Kuning kering (Mie gandum khas Sumatera Utara)',
      'Santan kelapa segar berlemak',
      'Andaliman memar (rempah getir lidah)',
      'Kerupuk merah tradisional sebagai pelengkap',
      'Bumbu halus: Cabai merah, bawang merah, bawang putih, kunyit, kemiri, serai, jahe, dan daun jeruk',
      'Sayuran pendukung: Kol iris dan sawi hijau'
    ],
    preparation: [
      'Rebus mie lidi dalam air mendidih yang diberi sedikit minyak hingga matang kenyal (al dente). Tiriskan dan lumuri minyak kelapa tipis agar tidak lengket.',
      'Tumis bumbu halus kuning sampai harum dan mengeluarkan minyak alami.',
      'Tuangkan santan sedang, aduk perlahan secara terus menerus agar santan tidak pecah.',
      'Masukkan andaliman yang telah dimemarkan kasar, serai, daun jeruk, dan sayur kol iris.',
      'Setelah kuah mendidih dan matang merata, letakkan mie lidi di dalam piring saji, siram dengan kuah santan kuning andaliman yang panas berlimpah, lalu beri taburan bawang goreng dan kerupuk merah renyah.'
    ],
    recommendedLocations: [
      { name: 'Warung Mie Gomak Mak Tina', address: 'Pusat Pasar Balige, Balige, Toba', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Warung+Mie+Gomak+Mak+Tina+Balige' },
      { name: 'Mie Gomak Tuk Tuk', address: 'Jl. Ring Road Samosir, Tuk Tuk, Samosir', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mie+Gomak+Tuk+Tuk+Samosir' }
    ],
    image: 'https://tse4.mm.bing.net/th/id/OIP.b5C10oKVTHwZoDDaTRgp4QHaEK?r=0&pid=Api&h=220&P=0',
    youtubeUrl: 'https://www.youtube.com/embed/fO0hP-iGZ5g'
  },
  {
    id: 'cul-saksang',
    name: 'Saksang Batak',
    description: 'Saksang adalah kuliner legendaris Batak berupa olahan daging (umumnya babi atau sapi) yang dicincang kecil, dimasak perlahan dengan paduan serai, daun jeruk, rempah andaliman, serta dibalut glazir kuah darah segar (atau kelapa gongseng sebagai opsi non-darah).',
    history: 'Saksang memiliki kedudukan tinggi dalam khazanah adat Batak Toba. Hidangan berempah kuat ini adalah menu wajib yang melambangkan kekompakan, kerja sama, dan persaudaraan erat. Sajian ini selalu dihidangkan dalam pesta adat pernikahan (Ulaon Unjuk), upacara adat kematian, dan pertemuan kekerabatan marga besar sebagai bentuk penghormatan bagi seluruh sanak saudara yang berkumpul.',
    ingredients: [
      'Daging Sapi atau Pork berlemak, cincang kasar/dadu kecil',
      'Andaliman bubuk kasar',
      'Kelapa parut gongseng, tumbuk halus hingga berminyak (opsi non-darah)',
      'Sari darah segar yang telah disaring (untuk varian gota tradisional)',
      'Bumbu halus ketumbar, jahe, lengkuas, kunyit, bawang merah, bawang putih, cabai rawit pedas',
      'Serai memar, Daun jeruk purut, Daun kunyit'
    ],
    preparation: [
      'Potong dadu kecil atau cincang kasar daging sapi/pork segar.',
      'Tumis bumbu halus bersama serai, daun jeruk, dan daun kunyit hingga layu dan harum.',
      'Masukkan daging cincang, aduk hingga berubah warna dan mengeluarkan kaldu alami daging.',
      'Tambahkan air secukupnya, rebus dengan api sedang sampai daging empuk dan kuahnya menyusut.',
      'Sesaat sebelum diangkat, tuangkan saringan gota (darah segar) atau kelapa gongseng tumbuk halus secara perlahan sembari diaduk cepat agar kuah menyatu, mengental, berwarna cokelat gelap eksotis, dan matang sempurna.'
    ],
    recommendedLocations: [
      { name: 'Lapo Niagara Parapat', address: 'Jl. Niagara No. 12, Parapat, Simalungun', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lapo+Niagara+Parapat' },
      { name: 'RM Sinar Tuk Tuk', address: 'Jl. Tuk Tuk, Tuk Tuk, Samosir', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=RM+Sinar+Tuk+Tuk+Samosir' }
    ],
    image: 'https://3.bp.blogspot.com/-OLjKben7XKc/WWb9ojyXT3I/AAAAAAAAAEw/sIilOsFOso83_y9CjAiHsolqcmp-5C5RACLcBGAs/w1200-h630-p-k-no-nu/Saksang.jpg',
    youtubeUrl: 'https://www.youtube.com/embed/nUvGf0_K678'
  },
  {
    id: 'cul-ombusombus',
    name: 'Kue Ombus-Ombus',
    description: 'Ombus-Ombus adalah kudapan manis legendaris berupa kue tepung beras yang dicampur dengan kelapa parut kasar, berisikan parutan gula merah manis di tengahnya, kemudian dibungkus mengerucut menggunakan daun pisang dan dikukus panas.',
    history: 'Berasal dari kota kecil Siborongborong di Tapanuli Utara, nama "Ombus" berasal dari bahasa Batak yang berarti "hembusan nafas". Dinamakan demikian karena kue ini harus dihembus atau ditiup terlebih dahulu saat dimakan selagi mengepul panas. Kue ini pertama kali dipopulerkan pada tahun 1940-an oleh seorang pelopor kuliner lokal dan sejak itu menjadi simbol kehangatan camilan bersanding dengan kopi Lintong atau teh hangat di sela obrolan santai masyarakat.',
    ingredients: [
      'Tepung beras kualitas premium',
      'Kelapa muda parut memanjang (kelapa agak mengkal)',
      'Gula aren atau gula merah premium, sisir halus',
      'Air garam encer aromatik pandan',
      'Daun pisang segar, bersihkan dan potong persegi'
    ],
    preparation: [
      'Campur tepung beras kering dengan kelapa muda parut dan sejumput garam halus dalam wadah besar secara perlahan menggunakan tangan agar adonan tetap gembur.',
      'Percikkan air pandan sedikit demi sedikit ke adonan tepung hingga adonan terasa lembab berbutir namun tidak sampai menggumpal pulen.',
      'Ambil daun pisang, gulung membentuk kerucut lancip (trompet).',
      'Masukkan satu sendok adonan tepung kelapa ke dasar kerucut, beri isian parutan gula aren di tengahnya, lalu tutup kembali dengan adonan tepung kelapa di atasnya.',
      'Lipat pangkal daun pisang hingga rapat berwujud limas segitiga, tata berdiri dalam kukusan panas, lalu kukus selama 20-30 menit hingga gula aren mencair membentuk sirop manis di dalam kue.'
    ],
    recommendedLocations: [
      { name: 'Kue Ombus-Ombus No. 1 Noer Siborongborong', address: 'Jl. Sisingamangaraja, Siborong-Borong, Tapanuli Utara', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kue+Ombus-Ombus+No.+1+Noer+Siborongborong' }
    ],
    image: 'https://thumb.viva.id/vivawisata/665x374/2025/04/18/68027ba9bebea-kue-ombus-ombus_wisata.jpg',
    youtubeUrl: 'https://www.youtube.com/embed/WbLzY4jZ-tQ'
  }
];

export const TOBA_CULTURES: Culture[] = [
  {
    id: 'cult-dalihan',
    title: 'Dalihan Na Tolu',
    description: 'Falsafah kekerabatan luhur masyarakat Batak yang mengatur sistem relasi sosial, tatanan adat, hak, kewajiban, dan tata krama antar-marga secara adil dan demokratis.',
    detailedContent: `Dalihan Na Tolu secara harfiah berarti "Tungku Berkaki Tiga". Tungku berkaki tiga adalah fondasi memasak tradisional Batak; jika salah satu kaki tungku patah atau tidak seimbang, maka kuali memasak di atasnya akan jatuh dan tumpah. Filosofi ini menggambarkan bahwa masyarakat Batak bertumpu secara kokoh pada tiga pilar relasi kekerabatan sosial:

1. **Somba Marhula-hula** (Hormat kepada Keluarga Pihak Istri): Hula-hula adalah marga asal dari mana istri/ibu kita berasal. Dalam spiritual adat Batak, Hula-hula dipandang sebagai pembawa berkat jasmani, petunjuk adat, dan perantara kekuatan kehidupan dari Tuhan (Mula Jadi Na Bolon). Mereka wajib dihormati dengan tulus dalam setiap kesempatan.
2. **Elek Marboru** (Mengayomi dan Lemah Lembut kepada Pihak Penerima Perempuan): Boru adalah marga laki-laki yang menikahi anak perempuan dari marga kita. Kelompok Boru adalah garda terdepan, pelaksana kerja keras, dan penyelenggara utama dari setiap acara adat keluarga. Mereka harus dirangkul dengan penuh kasih sayang, kelembutan, serta rasa terima kasih.
3. **Manat Mardongan Tubu** (Hati-hati dan Bijaksana dengan Saudara Semarga): Dongan Tubu adalah saudara laki-laki kandung maupun saudara satu garis keturunan marga paternal. Karena memiliki status waris dan kedudukan adat yang setara, konflik atau persaingan mudah sekali tersulut. Oleh karena itu, komunikasi antar-saudara semarga wajib dijaga dengan kehati-hatian tinggi, saling menopang, sopan santun, dan kerja sama yang erat.

Sistem kekerabatan Dalihan Na Tolu menciptakan struktur sosial yang sangat dinamis dan demokratis: tidak ada kasta yang menetap, karena setiap pria Batak dalam waktu bersamaan dapat berperan sebagai Hula-hula yang dihormati di satu pesta pernikahan, sekaligus bertindak sebagai Boru yang bekerja keras melayani tamu di pesta kerabat lainnya.`,
    image: 'https://1.bp.blogspot.com/-nrKX7CXvXjM/XVrPnBu-P2I/AAAAAAAACWY/3EgwSJtJ4VsUKUdf-NJeuroamLCLhQLBgCLcBGAs/w1200-h630-p-k-no-nu/Pejuang%2BSuku%2BBatak%2BToba.jpg',
    category: 'philosophy',
    youtubeUrl: 'https://youtu.be/2XBPAxqUHLY?si=sC4DN3xow4t2N9nc'
  },
  {
    id: 'cult-script',
    title: 'Surat Batak (The Batak Script)',
    description: 'Sistem aksara kuno pra-kolonial berjenis abugida yang digunakan suku Batak untuk menulis kalender astronomi, kitab pengobatan herba, dan ramalan magis pada bambu serta kulit kayu alim.',
    detailedContent: `Aksara Batak, yang secara lokal dikenal sebagai "Surat Batak", merupakan salah satu sistem tulisan kuno Indonesia yang berjenis abugida (aksara suku kata) turunan dari aksara Pallava dan Kawi India Selatan yang telah dimodifikasi selama ratusan tahun secara lokal.

Aksara ini terdiri dari 19 karakter dasar (Ina ni Surat) yang secara bawaan mengandung vokal 'a'. Untuk merubah bunyi vokal menjadi 'i', 'u', 'e', atau 'o', atau untuk mematikan vokal sama sekali (tanda pangolat), tanda diakritik kecil (Anak ni Surat) ditempelkan di atas, bawah, atau di samping karakter dasar.

Keunikan Surat Batak terletak pada penggunaannya yang bersifat sakral dan intelektual. Aksara ini tidak digunakan untuk urusan administrasi pemerintahan biasa, melainkan dipahat oleh para Datu (pendeta spiritual/dukun Batak) pada tabung bambu atau ditulis pada "Pustaha Laklak"—buku lipat akordeon legendaris yang terbuat dari serat kulit pohon alim liar. Pustaha Laklak ini mendokumentasikan ilmu perbintangan kuno (Pranata Mangsa), ramalan hari baik, resep rahasia jamu herbal penyembuh penyakit, hingga mantra perlindungan perang suku. Surat Batak adalah bukti nyata tingginya literasi dan peradaban ilmiah nenek moyang Toba.`,
    image: 'https://siplahtelkom.com/public/products/201255/4497851/285800.edba6329-1a3a-4cf4-b15d-d51b598693be.PAPAN-AKSA.jpg',
    category: 'script',
    youtubeUrl: 'https://www.youtube.com/embed/v9qI2P1A-mU'
  },
  {
    id: 'cult-ulos',
    title: 'Ulos (Ancestral Handwoven Fabric)',
    description: 'Kain tenun sakral suku Batak yang melambangkan kehangatan spiritual, restu restu adat, dan pengikat kasih sayang antar-keluarga.',
    detailedContent: `Ulos bukan sekadar kain hias biasa; ia adalah media restu, restu spiritual, dan simbol perlindungan kasih sayang dalam peradaban Batak Toba. Ditenun secara tradisional menggunakan alat tenun gedogan sederhana selama berminggu-minggu, Ulos memadukan dominasi warna sakral Batak: merah (melambangkan keberanian dan darah kehidupan), hitam (melambangkan kedewasaan dan dunia nyata), dan putih (melambangkan kesucian dan dunia roh), yang dihiasi manik-manik indah atau benang emas-perak.

Menurut kosmologi kuno Batak, ada tiga sumber kehangatan utama di alam semesta: Matahari, Api, dan Ulos. Karena dataran tinggi Toba beriklim pegunungan yang sangat dingin, nenek moyang menganugerahkan Ulos sebagai pelindung fisik sekaligus tameng rohani dari gangguan kekuatan gelap.

Setiap motif kain Ulos memiliki fungsi adat yang sangat spesifik dan sakral:
- **Ulos Ragidup**: Berarti "pola kehidupan", merupakan Ulos paling bernilai tinggi yang wajib diberikan oleh orang tua pengantin wanita kepada ibu pengantin pria sebagai lambang pengikat takdir dua keluarga besar.
- **Ulos Sadum**: Kain Ulos berwarna cerah penuh kegembiraan, dikenakan dalam acara sukacita seperti menari Tor-Tor, meresmikan rumah, atau menyambut kelahiran anak.
- **Ulos Ragi Hotang**: Melambangkan rotan yang kuat dan ulet, diberikan kepada pasangan pengantin baru agar pernikahan mereka kokoh, fleksibel, dan tak terpisahkan bagai jalinan rotan hutan.

Prosesi mengalungkan kain Ulos di pundak seseorang ("Mangulosi") hanya boleh dilakukan oleh kerabat yang memiliki posisi kekerabatan lebih tinggi dalam tatanan Dalihan Na Tolu (seperti paman/Hula-hula kepada keponakan) untuk mengalirkan doa keberkatan hidup.`,
    image: 'https://tse3.mm.bing.net/th/id/OIP.q2uVep_tZv5pkou05ZPrewHaFj?r=0&pid=Api&h=220&P=0',
    category: 'craft',
    youtubeUrl: 'https://www.youtube.com/embed/S2pE_TjU6Lg'
  },
  {
    id: 'cult-tortor',
    title: 'Tari Tor-Tor',
    description: 'Tari upacara ritual sakral masyarakat Batak yang dibawakan dengan gerakan tangan yang tenang, ritmis, dan khidmat diiringi dentuman Gondang Sabangunan.',
    detailedContent: `Tari Tor-Tor adalah tarian adat sakral suku Batak yang telah ada sejak zaman animisme kuno pra-Hindu. Nama "Tor-Tor" diambil dari suara thumping kaki para penari yang menghentak papan kayu rumah adat panggung Batak (Ruma Bolon), menghasilkan bunyi "tor-tor-tor" yang ritmis merdu.

Berbeda dengan tarian modern yang menonjolkan keaktifan fisik atau lompatan tinggi, Tor-Tor berfokus pada gerakan yang sangat tenang, anggun, dan penuh kontrol diri pada jemari tangan, pergelangan tangan, bahu, dan hentakan halus tumit kaki. Gerakan ini harus berpadu harmonis dengan tiupan Sarune Bolon dan pukulan perkusi ansambel musik Gondang Sabangunan.

Setiap gerakan jari dan telapak tangan penari membawa makna komunikasi spiritual yang mendalam:
- Telapak tangan terbuka menghadap ke bawah di bawah dada melambangkan sikap merendahkan diri, memohon berkat keselamatan, serta menenangkan jiwa-jiwa yang hadir.
- Tangan yang diangkat setinggi pundak dengan jari mengepal halus melambangkan penghormatan mendalam dan pemanggilan roh para leluhur suci serta permohonan restu.

Tor-Tor ditarikan bukan sebagai hiburan semata, melainkan bagian dari peribadatan adat komunal di mana marga-marga berkumpul untuk saling memberi hormat, menghaturkan syukur, dan meneguhkan jalinan kasih kekeluargaan.`,
    image: 'https://tse1.mm.bing.net/th/id/OIP.SGQ6rUUgwXF9KMBaXjRnGwHaD4?r=0&pid=Api&h=220&P=0',
    category: 'art',
    youtubeUrl: 'https://www.youtube.com/embed/qsh3N6O6vD8'
  },
  {
    id: 'cult-gondang',
    title: 'Gondang Sabangunan',
    description: 'Ansambel musik tradisional Batak Toba yang mengombinasikan pukulan set gendang bernada, gong perunggu besar, dan tiupan oboe tradisional pemanggil roh.',
    detailedContent: `Gondang Sabangunan adalah ansambel orkestra sakral berstruktur sangat kompleks milik suku Batak Toba. Ansambel ini dimainkan khusus dalam upacara adat besar untuk membuka komunikasi spiritual, meresmikan ikatan perkawinan, serta memimpin pesta sukacita masyarakat kaldera.

Instrumen utama pembentuk orkestra ini meliputi:
1. **Gordang**: Gendang kayu tunggal berukuran raksasa yang dibuat dari batang pohon nangka berongga dan kulit sapi kering, menghasilkan dentuman bass dalam pembuka irama.
2. **Taganing**: Seperangkat lima buah kendang berukuran berbeda yang digantung sejajar pada rak kayu, ditalisecara bernada, dan dimainkan menggunakan sepasang stik kayu halus untuk membawakan melodi utama irama musik.
3. **Ogung**: Empat buah gong perunggu berukuran tebal (Ogung Doal, Oloan, Sibatua, Panggora) yang dipukul bersahut-sahutan menghasilkan ketukan sinkopasi mikrotonal yang mistis.
4. **Sarune Bolon**: Alat musik tiup sejenis oboe berlubang ganda berkekuatan suara melengking tinggi, yang meniupkan melodi ratapan suci pembuka tarian Tor-Tor.

Dalam spiritualitas kuno Batak, Gondang Sabangunan dipercaya sebagai jembatan getaran antara dunia fana manusia (Banua Tonga) dengan dimensi surgawi kediaman para dewa dan roh leluhur (Banua Ginjand). Harmoni poliritmik hipnotis dari Gondang dirancang untuk memfokuskan energi persatuan komunal klan.`,
    image: 'https://batakbercerita.com/images/gondang-music.jpg',
    category: 'art',
    youtubeUrl: 'https://www.youtube.com/embed/8v_CjV55x2E'
  },
  {
    id: 'cult-houses',
    title: 'Ruma Bolon',
    description: 'Arsitektur rumah adat panggung Batak berbentuk kapal terbalik yang dibangun tanpa paku besi, merepresentasikan pembagian jagat raya kosmologi suku Batak.',
    detailedContent: `Ruma Bolon adalah istana adat suku Batak Toba yang megah. Dicirikan oleh bentuk atapnya yang menjulang tinggi melengkung menyerupai lambung kapal terbalik, rumah adat ini menggambarkan kapal besar penyelamat yang siap mengarungi samudra kehidupan. Ruma Bolon dirancang dengan kecerdasan teknik tinggi agar elastis menahan getaran gempa tektonik hebat di sekitar kaldera Toba tanpa menggunakan paku logam tunggal pun.

Keseluruhan struktur rumah panggung ini bertumpu pada tiang-tiang kayu bulat masif yang diletakkan di atas batu datar, yang disambung menggunakan teknik pasak kayu (mortise and tenon) serta diikat kencang menggunakan anyaman tali rotan hutan hitam tebal.

Secara vertikal, Ruma Bolon dibagi secara filosofis menjadi tiga tingkat utama yang melambangkan pembagian dimensi alam semesta (Banua):
1. **Bagian Kolong (Bara)**: Ruang gelap di bawah lantai panggung yang digunakan untuk kandang ternak kerbau dan penyimpanan kayu bakar. Ini melambangkan "Banua Toru"—dunia bawah yang penuh ketidakpastian.
2. **Ruang Utama (Tonga)**: Ruang panggung terbuka tanpa sekat dinding tempat keluarga tidur, memasak, dan bermusyawarah. Ini melambangkan "Banua Tonga"—dunia tengah, dimensi hidup manusia yang rukun bersosialisasi.
3. **Bagian Atap (Sabu)**: Ruang loteng tinggi beratap rumbia tempat menyimpan benih padi pusaka serta pusaka adat leluhur. Ini melambangkan "Banua Ginjand"—dunia atas, takhta roh-roh suci pembawa berkah.

Bagian depan rumah dihiasi dengan ukiran kayu bernilai seni tinggi yang disebut "Gorga". Gorga Batak didominasi warna merah, hitam, dan putih yang digambar membentuk sulur tanaman melingkar, gambar cicak (simbol kesabaran/adaptasi tinggi), dan sepasang mata kerbau besar sebagai penangkal petaka rohani.`,
    image: 'https://pagaralampos.disway.id/upload/9e7ed0a6e3f6e6535c0f14325c240211.jpg',
    category: 'craft',
    youtubeUrl: 'https://www.youtube.com/embed/i0pTAtg96jI'
  }
];
