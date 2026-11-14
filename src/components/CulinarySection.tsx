/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TOBA_CULINARY } from '../data/tobaData';
import { ChefHat, History, List, BookOpen, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CULINARY_TRANSLATIONS: Record<string, {
  description: string;
  history: string;
  ingredients: string[];
  preparation: string[];
}> = {
  'cul-arsik': {
    description: 'Arsik is a traditional Batak culinary masterpiece featuring carp cooked in a vibrant yellow sauce rich in endemic spices such as andaliman (Sichuan-like pepper) and asam cikala. The citrusy, tingling sensation blends perfectly with fresh fish caught from the clear waters of Lake Toba.',
    history: 'In Batak Toba tradition, Arsik is not just food; it is a sacred symbol of prayer, blessing, and familial bonds. It is served in major life cycles: weddings, births, and milestones. The number of carp served carries meaning: one carp for newlyweds, three for a newborn, five for a harmonious family, and nine for longevity and infinite prosperity.',
    ingredients: [
      'Fresh Carp (Dengke Mas), scales left intact to symbolize shield & protection',
      'Andaliman (Highland Batak pepper)',
      'Asam Cikala (Wild torch ginger fruit for fresh acidity)',
      'Rias / Torch Ginger Buds (Aromatic local flower)',
      'Bawang Batak / Lokio (Mini wild scallions endemic to North Sumatra)',
      'Toasted Candlenuts',
      'Turmeric, Ginger, Galangal, Lemongrass, Red Chili, Shallots, Garlic'
    ],
    preparation: [
      'Gently clean the carp cavity, leaving scales intact so the meat does not break during hours of slow cooking.',
      'Finely grind turmeric, ginger, chili, shallots, garlic, candlenuts, and fresh andaliman into a golden paste.',
      'Layer lemongrass stalks, bruised galangal, torch ginger buds, and asam cikala at the bottom of the pan to prevent burning.',
      'Place the carp on top of this herbal bed, coating it evenly with the golden yellow spice paste.',
      'Add water to submerge, scatter Batak wild scallions on top, and slow-cook on low heat for 3-5 hours until bones soften and the sauce reduces into a rich, aromatic glaze.'
    ]
  },
  'cul-naniura': {
    description: 'Naniura is often dubbed as "Batak Sashimi" or Batak Sushi. This legendary dish features raw fresh carp cured with pure wild citrus juice (asam jungga) and coated in a fiery, raw paste of andaliman and local herbs.',
    history: 'In the ancient kingdoms of Batak, Dengke Mas Na Niura was an exclusive delicacy reserved for kings and nobles. Only selected palace chefs were permitted to prepare it using the first catch of the day from the sacred Lake Toba. Today, Naniura remains a prestigious dish to honor esteemed guests.',
    ingredients: [
      'Ultra-fresh Carp or Tilapia fillets',
      'Asam Jungga (Special kaffir lime with extremely high acidity)',
      'Raw ground Andaliman pepper',
      'Toasted ground Candlenuts (For rich texture)',
      'Ginger, toasted Turmeric, Shallots, fresh Bird\'s Eye Chili, Salt'
    ],
    preparation: [
      'Fillet fresh carp or tilapia, de-bone, and wipe dry with a clean cloth.',
      'Squeeze fresh Asam Jungga juice over the fish fillets. The high acidity chemically cures (denatures) the raw flesh, rendering it cooked, firm, and sterile without heat.',
      'Let the fish marinate in the citrus juice for 4 to 6 hours in a cool place until the texture becomes white, firm, and fully cured.',
      'Grind candlenuts, andaliman, turmeric, ginger, onions, and chili. Coat the cured fillets with this rich paste, let it absorb for 1 hour, and serve chilled.'
    ]
  },
  'cul-miegomak': {
    description: 'Mie Gomak is the iconic noodle soup or stir-fry of the Toba highlands, made from thick wheat noodles. It is served with a rich, spicy, and deeply aromatic yellow coconut broth infused with andaliman.',
    history: 'The name "Gomak" translates to "grabbed by hand." Historically, before spoons became common, vendors prepared these thick noodles by hand to mix the ingredients thoroughly. Today, it remains the ultimate warm breakfast comfort food in the chilly highlands.',
    ingredients: [
      'Dry yellow thick wheat noodles (Mie Lidi)',
      'Fresh rich coconut milk',
      'Bruised Andaliman pepper',
      'Traditional red crackers (as a crunchy topping)',
      'Ground spice paste: Red chili, shallots, garlic, turmeric, candlenut, lemongrass, ginger, lime leaves',
      'Vegetables: Sliced cabbage and mustard greens'
    ],
    preparation: [
      'Boil the noodles until al dente. Drain and toss with a touch of coconut oil to prevent sticking.',
      'Sauté the ground spice paste until aromatic and oil separates.',
      'Pour in the coconut milk, stirring constantly on medium-low heat to prevent curdling.',
      'Add bruised andaliman, lemongrass, lime leaves, and sliced cabbage.',
      'Once the broth is boiling, place the noodles in a bowl, ladle the hot coconut-andaliman broth over them, and top with fried shallots and red crackers.'
    ]
  },
  'cul-saksang': {
    description: 'Saksang is a legendary Batak savory stew of finely minced meat (commonly beef or pork) slow-cooked with lemongrass, lime leaves, andaliman, and glazed in a rich, dark sauce made from fresh juice/gota (or toasted coconut paste for non-gota version).',
    history: 'Saksang holds a high status in Batak custom. This heavily spiced stew is a mandatory menu symbolizing unity and brotherhood, served in wedding feasts (Ulaon Unjuk), traditional funerals, and large family reunions.',
    ingredients: [
      'Mincemeat (Beef or Pork) with fat, finely chopped',
      'Andaliman pepper powder',
      'Toasted grated coconut, ground until oily (non-gota alternative)',
      'Filtered gota/fresh juice (for traditional goth-style gravy)',
      'Spice paste: Coriander, ginger, galangal, turmeric, shallots, garlic, bird\'s eye chili',
      'Bruised lemongrass, Kaffir lime leaves, Turmeric leaf'
    ],
    preparation: [
      'Finely chop or mince the fresh meat.',
      'Sauté the ground spice paste with lemongrass, lime leaves, and turmeric leaf until fragrant.',
      'Add the minced meat, stirring until it changes color and releases its natural juices.',
      'Add a splash of water, simmer on medium heat until the meat is tender and gravy reduces.',
      'Just before serving, slowly pour in the gota or ground toasted coconut, stirring rapidly until it forms a dark, thick, luxurious glaze.'
    ]
  },
  'cul-ombusombus': {
    description: 'Ombus-Ombus is a legendary sweet snack made from premium rice flour mixed with grated coconut, filled with sweet palm sugar in the center, wrapped into a cone shape with banana leaves, and steamed hot.',
    history: 'Hailing from the town of Siborongborong, "Ombus" translates to "blowing breath." It is named so because this cake must be blown on to cool down as it is eaten piping hot. First popularized in the 1940s, it represents cozy hospitality alongside Lintong coffee.',
    ingredients: [
      'Premium rice flour',
      'Grated young coconut',
      'Finely sliced palm sugar / gula aren',
      'Lightly salted pandan-infused water',
      'Fresh banana leaves, cleaned and cut'
    ],
    preparation: [
      'Gently mix rice flour with grated coconut and a pinch of salt by hand, keeping the mixture light and crumbly.',
      'Sprinkle pandan water gradually to moisten the flour without making it a dense dough.',
      'Roll a banana leaf into a sharp cone shape.',
      'Place a spoonful of the flour-coconut mixture in, add palm sugar in the center, and cover with more flour mixture.',
      'Fold the leaf securely, steam for 20-30 minutes until the palm sugar melts into a luscious syrup inside.'
    ]
  }
};

export default function CulinarySection() {
  const [selectedDish, setSelectedDish] = useState(TOBA_CULINARY[0]);
  const { t, language } = useLanguage();

  // Get active translation record or fall back to Indonesian dataset
  const translation = language === 'en' ? CULINARY_TRANSLATIONS[selectedDish.id] : null;

  const activeDescription = translation?.description || selectedDish.description;
  const activeHistory = translation?.history || selectedDish.history;
  const activeIngredients = translation?.ingredients || selectedDish.ingredients;
  const activePreparation = translation?.preparation || selectedDish.preparation;

  return (
    <div className="space-y-8 p-1">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-br from-[#E0F2FE]/50 to-[#F8FAFC]/50 rounded-[18px] p-6 md:p-8 border border-[#0EA5E9]/20 shadow-xs flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-mono font-bold text-[#0F4C81] uppercase tracking-widest">
            {language === 'en' ? 'Explore Caldera Flavors' : 'Eksplorasi Rasa Caldera'}
          </span>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#0F172A] leading-tight">
            {language === 'en' ? 'Traditional Toba Culinary Tour' : 'Wisata Kuliner Tradisional Toba'}
          </h1>
          <p className="text-xs text-[#64748B] leading-relaxed">
            {language === 'en' 
              ? 'Batak cuisine is renowned for its utilization of endemic wild forest spices like **Andaliman** (Batak pepper that offers a refreshing, tingling sensation on the tongue), asam jungga, and torch ginger flower. Indulge in legendary flavors around the volcanic caldera.'
              : 'Kuliner Batak terkenal dengan penggunaan bumbu khas rempah liar hutan seperti **Andaliman** (merica Batak yang memberi sensasi getir getir segar di lidah), asam jungga, dan bunga rias. Nikmati cita rasa kuliner legendaris di sekeliling kaldera.'}
          </p>
        </div>
        <img
          src="https://i0.wp.com/blog.duniamasak.com/wp-content/uploads/ikan-arsik-kuliner-khas-batak.jpg?w=900&ssl=1"
          alt="Culinary Arts"
          className="w-full md:w-56 h-36 object-cover rounded-[18px] shadow-md border border-white"
        />
      </div>

      {/* DETAILED INTERACTIVE STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LIST COLUMN (COL: 4) */}
        <div className="lg:col-span-4 space-y-3">
          <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pl-1">
            {language === 'en' ? 'Legendary Culinary List' : 'Daftar Kuliner Legendaris'}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {TOBA_CULINARY.map(dish => {
              const isSelected = dish.id === selectedDish.id;
              const dishTrans = language === 'en' ? CULINARY_TRANSLATIONS[dish.id] : null;
              return (
                <button
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  className={`w-full text-left p-3.5 rounded-[18px] border flex items-center gap-4 transition-all group cursor-pointer hover:-translate-y-0.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0F4C81] to-[#0EA5E9] border-transparent text-white shadow-md shadow-[#0EA5E9]/15'
                      : 'bg-white border-slate-100 hover:border-[#0EA5E9]/40 text-[#0F172A] shadow-sm'
                  }`}
                >
                  <img src={dish.image} alt={dish.name} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm leading-tight truncate">{dish.name}</h3>
                    <p className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                      {dishTrans?.description || dish.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* DETAILS PANEL (COL: 8) */}
        <div className="lg:col-span-8 bg-white rounded-[18px] border border-[#E0F2FE]/60 shadow-lg overflow-hidden flex flex-col">
          <div className="h-56 relative">
            <img src={selectedDish.image} alt={selectedDish.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            <h2 className="absolute bottom-4 left-6 font-display font-bold text-xl md:text-2xl text-white">{selectedDish.name}</h2>
          </div>

          <div className="p-6 md:p-8 space-y-6 flex-1 font-sans">
            
            {/* DESC AND HIST */}
            <div className="space-y-4">
              <p className="text-xs text-[#0F172A] leading-relaxed italic border-l-4 border-[#0EA5E9] pl-3">
                "{activeDescription}"
              </p>

              <div className="bg-[#F8FAFC] rounded-[18px] p-4.5 space-y-2 border border-slate-100">
                <span className="text-[10px] font-bold text-[#0F4C81] uppercase flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  {t('label.history')}
                </span>
                <p className="text-xs text-[#64748B] leading-relaxed">{activeHistory}</p>
              </div>
            </div>

            {/* YOUTUBE VIDEO GUIDE */}
            {selectedDish.youtubeUrl && (
              <div className="bg-[#F8FAFC] rounded-[18px] p-4.5 space-y-3 border border-slate-100">
                <span className="text-[10px] font-bold text-[#0F4C81] uppercase flex items-center gap-1.5 font-mono tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {t('label.video_guide')}
                </span>
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-sm border border-slate-200">
                  <iframe
                    className="w-full h-full"
                    src={selectedDish.youtubeUrl}
                    title={`Video Panduan ${selectedDish.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}

            {/* INGREDIENTS AND PREP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1 border-b border-slate-100 pb-1.5">
                  <List className="w-4 h-4 text-[#0EA5E9]" />
                  {t('label.ingredients')}
                </span>
                <ul className="space-y-1.5 text-xs text-[#64748B]">
                  {activeIngredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1 border-b border-slate-100 pb-1.5">
                  <ChefHat className="w-4 h-4 text-[#0EA5E9]" />
                  {t('label.preparation')}
                </span>
                <ol className="space-y-2 text-xs text-[#64748B] list-decimal pl-4">
                  {activePreparation.map((step, idx) => (
                    <li key={idx} className="leading-relaxed pl-1">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* RECOMMENDED RM */}
            <div className="border-t border-slate-100 pt-5 space-y-2.5">
              <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#10B981]" />
                {t('label.recommended_locations')}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {selectedDish.recommendedLocations.map((loc, idx) => {
                  const mapLink = loc.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + loc.address)}`;
                  return (
                    <a
                      key={idx}
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 border border-slate-100 rounded-[14px] bg-[#F8FAFC] hover:bg-[#E0F2FE]/30 hover:border-[#0EA5E9]/30 flex flex-row items-center justify-between transition-all group shadow-xs hover:shadow-md cursor-pointer"
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-bold text-xs text-[#0F172A] group-hover:text-[#0F4C81] transition-colors">{loc.name}</span>
                        <span className="text-[10px] text-[#64748B] mt-1 truncate">{loc.address}</span>
                      </div>
                      <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#0EA5E9] text-slate-400 group-hover:text-white transition-all shadow-xs">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
