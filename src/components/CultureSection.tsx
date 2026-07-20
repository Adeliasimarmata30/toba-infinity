/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TOBA_CULTURES } from '../data/tobaData';
import { BookOpen, Award, Compass, ChevronRight, Landmark, Music } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CULTURE_TRANSLATIONS: Record<string, {
  title: string;
  description: string;
  detailedContent: string;
  categoryLabel: string;
}> = {
  'cult-dalihan': {
    title: 'Dalihan Na Tolu',
    description: 'The supreme kinship philosophy of Batak society that regulates social relations, custom orders, rights, duties, and etiquette between clans fairly and democratically.',
    categoryLabel: 'Life Philosophy',
    detailedContent: `Dalihan Na Tolu literally means "Three-Legged Hearth". The three-legged hearth is the foundation of traditional Batak cooking; if one leg is broken or unbalanced, the cooking pot on top will fall and spill. This philosophy describes that Batak society relies firmly on three pillars of social kinship relations:

1. **Somba Marhula-hula** (Reverence to the Wife's Family/Clan): Hula-hula is the origin clan of our wife or mother. In Batak customs, they are viewed as the channel of physical blessings, custom guidance, and life force from God (Mula Jadi Na Bolon). They must be respected with utmost sincerity.
2. **Elek Marboru** (Caring and Gentle to the Women-Receiving Clan): Boru refers to the clan of the men who married daughters of our clan. The Boru group is the vanguard, the hard workers, and organizers of any custom ceremony. They must be embraced with love, gentleness, and deep gratitude.
3. **Manat Mardongan Tubu** (Careful and Prudent with Brothers/Same-Marga Clan): Dongan Tubu refers to biological brothers or relatives of the same paternal lineage. Since they have equal inheritance and custom status, disputes can easily be triggered. Therefore, communications must be handled with care, mutual support, politeness, and close cooperation.

This kinship system creates a highly dynamic and democratic social structure: there is no permanent class, as every Batak man can simultaneously act as a revered Hula-hula in one wedding, and serve as a hardworking Boru in another.`
  },
  'cult-script': {
    title: 'Surat Batak (The Batak Script)',
    description: 'An ancient pre-colonial abugida script used by the Batak people to record astronomical calendars, herbal medicine journals, and magical prophecies on bamboo and bark.',
    categoryLabel: 'Ancient Script',
    detailedContent: `The Batak script, locally known as "Surat Batak", is an ancient Indonesian writing system belonging to the abugida family. It is descended from Southern India's Pallava and Kawi scripts, adapted over hundreds of years to local dialects.

The script consists of 19 basic characters (Ina ni Surat) which carry an inherent 'a' vowel. To alter the vowel to 'i', 'u', 'e', or 'o', or to mute the vowel entirely (the pangolat sign), small diacritical marks (Anak ni Surat) are attached above, below, or to the sides of the basic character.

The uniqueness of Surat Batak lies in its sacred and intellectual applications. Rather than everyday administration, it was etched by the Datu (Batak spiritual priest-scholars) onto bamboo tubes or written in "Pustaha Laklak"—accordion-folded books made from the bark of the wild alim tree. Pustaha Laklak documented celestial astrology (Pranata Mangsa), auspicious days, secret herbal remedies, and protective war mantras, showing the advanced literacy of ancient Toba society.`
  },
  'cult-ulos': {
    title: 'Ulos (Ancestral Handwoven Fabric)',
    description: 'The sacred handwoven textile of the Batak people, symbolizing spiritual warmth, custom blessings, and the bond of love between families.',
    categoryLabel: 'Handwoven Textile',
    detailedContent: `Ulos is not mere decorative fabric; it is a medium of custom blessings, spiritual warmth, and protective affection. Handwoven traditionally on simple backstrap looms for weeks, Ulos blends the sacred Batak colors: red (symbolizing bravery and the blood of life), black (maturity and the earthly world), and white (purity and the spirit world), beautifully adorned with beads or gold/silver threads.

According to ancient cosmology, there are three primary sources of warmth in the universe: the Sun, Fire, and Ulos. Since the Toba highlands are very cold, ancestors bestowed Ulos as a physical shield and a spiritual armor against dark forces.

Each Ulos motif has a specific custom function:
- **Ulos Ragidup**: Meaning "pattern of life", the most valuable Ulos given by the bride's parents to the groom's mother to seal the union.
- **Ulos Sadum**: Brightly colored, worn in joyful events such as Tor-Tor dances, house dedications, or celebrating a birth.
- **Ulos Ragi Hotang**: Symbolizing the strong, flexible forest rattan, gifted to newlyweds so their marriage is resilient and unbreakable.

The process of placing an Ulos over someone's shoulders ("Mangulosi") can only be performed by elders of a higher kinship position to transmit prayers and blessings.`
  },
  'cult-tortor': {
    title: 'Tari Tor-Tor (Sacral Batak Dance)',
    description: 'The sacred ritual dance of Batak society, performed with calm, rhythmic, and solemn hand movements accompanied by the deep thud of Gondang Sabangunan.',
    categoryLabel: 'Sacral Dance',
    detailedContent: `Tari Tor-Tor is a sacred ancestral dance that predates animistic times. The name "Tor-Tor" imitates the thumping sound of dancers' feet stepping rhythmically on the wooden floorboards of traditional stilt houses (Ruma Bolon), producing a resonant "tor-tor-tor" sound.

Unlike modern dances emphasizing energetic jumps, Tor-Tor centers on calm, graceful, and deeply controlled movements of the fingers, wrists, shoulders, and gentle heel thumps. This must blend harmoniously with the melodies of the Sarune Bolon and the percussion of the Gondang Sabangunan ensemble.

Every hand posture carries spiritual meaning:
- Open palms facing down below the chest symbolize humility, requesting safety, and soothing the spirits.
- Hands raised to shoulder level with lightly clenched fingers symbolize deep reverence, calling upon ancestral spirits, and seeking blessings.

Tor-Tor is not danced for amusement, but as a communal custom where clans gather to pay respect, give thanks, and strengthen family ties.`
  },
  'cult-gondang': {
    title: 'Gondang Sabangunan (Sacred Orchestra)',
    description: 'A traditional Batak Toba orchestra combining pitched drum sets, large bronze gongs, and a high-pitched oboe used to summon ancestral spirits.',
    categoryLabel: 'Ritual Music',
    detailedContent: `Gondang Sabangunan is a highly complex sacred orchestra of the Batak Toba people, played specifically in major custom ceremonies to establish spiritual communication, solemnize weddings, and lead celebrations.

The primary instruments include:
1. **Gordang**: A giant single-headed wooden bass drum made from a hollow jackfruit tree trunk and dried cowhide, producing deep resonance.
2. **Taganing**: A set of five tuned drums hung horizontally, played with a pair of fine wooden sticks to carry the main melody.
3. **Ogung**: Four thick bronze gongs (Ogung Doal, Oloan, Sibatua, Panggora) struck in syncopated patterns, creating a mystical, polyrhythmic heartbeat.
4. **Sarune Bolon**: A double-reed oboe-like wind instrument that blows high-pitched, wailing melodies that initiate the Tor-Tor dance.

In ancient Batak spirituality, Gondang Sabangunan acts as a vibrating bridge between the earthly world (Banua Tonga) and the heavenly realm of ancestors (Banua Ginjand).`
  },
  'cult-houses': {
    title: 'Ruma Bolon (Batak Traditional House)',
    description: 'A magnificent boat-shaped stilt house built entirely without metal nails, representing the multi-layered cosmology of Batak universe.',
    categoryLabel: 'Traditional Architecture',
    detailedContent: `Ruma Bolon is the traditional palace of the Batak Toba. Characterized by its soaring roof curved like the hull of an upside-down ship, it represents a grand vessel navigating the ocean of life. Ruma Bolon was brilliantly engineered to resist severe earthquakes around the Toba caldera without using a single metal nail.

The entire structure rests on massive circular wooden pillars resting on flat stones, connected via mortise and tenon joints and tightly lashed with thick black forest rattan ropes.

Vertically, Ruma Bolon is divided into three levels representing the Batak cosmology (Banua):
1. **The Subfloor (Bara)**: The dark space beneath the stilt floor used for livestock and firewood storage. This represents "Banua Toru"—the unpredictable underworld.
2. **The Main Floor (Tonga)**: An open stilt room without partition walls where the family sleeps, cooks, and gathers. This represents "Banua Tonga"—the human world of harmony and social life.
3. **The Attic (Sabu)**: The high loft beneath the roof thatch used to store sacred heirloom seeds and clan treasures. This represents "Banua Ginjand"—the upper world of gods and guardian spirits.

The front façade is adorned with elaborate wooden carvings called "Gorga" in red, black, and white. These depict curling vines, geckos (symbols of adaptability), and water buffalo eyes to ward off misfortune.`
  }
};

export default function CultureSection() {
  const [activeCulture, setActiveCulture] = useState(TOBA_CULTURES[0]);
  const { t, language } = useLanguage();

  const translation = language === 'en' ? CULTURE_TRANSLATIONS[activeCulture.id] : null;

  const activeTitle = translation?.title || activeCulture.title;
  const activeDescription = translation?.description || activeCulture.description;
  const activeDetailedContent = translation?.detailedContent || activeCulture.detailedContent;

  const getCategoryLabel = (category: string, id: string) => {
    if (language === 'en') {
      return CULTURE_TRANSLATIONS[id]?.categoryLabel || category;
    }
    return category === 'philosophy' ? 'Falsafah Hidup' : category === 'script' ? 'Aksara Kuno' : category === 'craft' ? 'Kain Tenun' : 'Seni Tari / Musik';
  };

  return (
    <div className="space-y-8 p-1">
      {/* CULTURAL TOP HERO HEADER */}
      <div className="bg-gradient-to-br from-[#081B33] via-[#0F4C81] to-[#0EA5E9] text-white rounded-[18px] p-6 md:p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden border border-white/10">
        <div className="absolute right-[-30px] top-[-30px] w-48 h-48 bg-[#0EA5E9]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 max-w-xl z-10">
          <span className="text-xs font-mono font-bold text-sky-200 uppercase tracking-widest">
            {language === 'en' ? 'Digital Learning Center' : 'Pusat Pembelajaran Digital'}
          </span>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl leading-tight">
            {language === 'en' ? 'Batak Caldera Cultural Heritage' : 'Warisan Kebudayaan Batak Caldera'}
          </h1>
          <p className="text-xs text-sky-100/90 leading-relaxed">
            {language === 'en'
              ? 'Explore the local ancestral wisdom of Lake Toba society, preserved across generations. Learn about life philosophy, sacred dances, Ruma Bolon architecture, and world-renowned ancient scripts.'
              : 'Telusuri kearifan lokal leluhur masyarakat Danau Toba yang diwariskan turun-temurun. Pelajari falsafah hidup, tarian sakral, arsitektur Ruma Bolon, hingga aksara kuno yang mendunia.'}
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop"
          alt="Traditional Batak"
          className="w-full md:w-64 h-40 object-cover rounded-[18px] shadow-lg border border-white/20 shrink-0 z-10"
        />
      </div>

      {/* DETAILED INTERACTIVE STUDY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR TABS (COL: 4) */}
        <div className="lg:col-span-4 space-y-3">
          <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pl-1">
            {language === 'en' ? 'Learning Materials' : 'Materi Pembelajaran'}
          </p>
          <div className="space-y-2">
            {TOBA_CULTURES.map(cult => {
              const isActive = cult.id === activeCulture.id;
              const trans = language === 'en' ? CULTURE_TRANSLATIONS[cult.id] : null;
              return (
                <button
                  key={cult.id}
                  onClick={() => setActiveCulture(cult)}
                  className={`w-full text-left p-4 rounded-[18px] border flex items-center justify-between transition-all group cursor-pointer hover:-translate-y-0.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0F4C81] to-[#0EA5E9] border-transparent text-white shadow-md shadow-[#0EA5E9]/15'
                      : 'bg-white border-slate-100 hover:border-[#0EA5E9]/30 text-slate-700 shadow-sm'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className={`text-[9px] font-mono uppercase tracking-wider ${isActive ? 'text-sky-200 font-bold' : 'text-slate-400'}`}>
                      {getCategoryLabel(cult.category, cult.id)}
                    </span>
                    <h3 className="font-bold text-sm truncate max-w-[200px]">{trans?.title || cult.title}</h3>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-sky-200 translate-x-1' : 'text-slate-300 group-hover:translate-x-1'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* STUDY CONTENT STAGE (COL: 8) */}
        <div className="lg:col-span-8 bg-white rounded-[18px] border border-[#E0F2FE]/60 shadow-lg p-6 md:p-8 space-y-6">
          <div className="relative h-64 rounded-[18px] overflow-hidden shadow-sm">
            <img src={activeCulture.image} alt={activeTitle} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5">
              <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-widest">
                {language === 'en' ? 'Educational Content' : 'Materi Edukasi'}
              </span>
              <h2 className="font-display font-bold text-xl md:text-2xl text-white leading-tight mt-1">{activeTitle}</h2>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-[#0F172A] leading-relaxed border-l-4 border-[#0EA5E9] pl-3">
              "{activeDescription}"
            </p>

            <div className="border-t border-slate-50 pt-5 text-xs text-[#64748B] leading-relaxed whitespace-pre-wrap space-y-3 font-sans">
              {activeDetailedContent}
            </div>
          </div>

          {/* YOUTUBE CULTURE EXPLANATION VIDEO */}
          {activeCulture.youtubeUrl && (
            <div className="bg-[#F8FAFC] rounded-[18px] p-4.5 space-y-3 border border-slate-100">
              <span className="text-[10px] font-bold text-[#0F4C81] uppercase flex items-center gap-1.5 font-mono tracking-wider">
                <Music className="w-3.5 h-3.5 text-[#0EA5E9] animate-pulse" />
                {t('label.video_culture')}
              </span>
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-sm border border-slate-200">
                <iframe
                  className="w-full h-full"
                  src={activeCulture.youtubeUrl}
                  title={`Video Penjelasan ${activeTitle}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}

          {/* Batak Custom Clannish Knowledge Snippet */}
          {activeCulture.category === 'philosophy' && (
            <div className="bg-[#E0F2FE]/20 border border-[#E0F2FE] rounded-[14px] p-4 space-y-2 mt-4 text-xs text-sky-900 leading-relaxed font-sans">
              <span className="font-bold block text-[#0F4C81]">
                {language === 'en' ? '💡 Cultural Insight: The Clan System (Tarombo)' : '💡 Pengetahuan Budaya: Sistem Marga (Tarombo)'}
              </span>
              {language === 'en'
                ? 'The Batak society strictly adheres to a patrilineal lineage (marga). Members of the same clan/marga are forbidden from marrying each other because they are considered siblings of the same blood. Lineages are meticulously recorded in a sacred lineage tree called Tarombo.'
                : 'Suku Batak menganut garis keturunan patrilineal yang kental (marga). Anggota marga yang sama dilarang saling menikah karena dianggap saudara sedarah. Silsilah garis keturunan dicatat dalam silsilah sakral yang dinamakan Tarombo.'}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
