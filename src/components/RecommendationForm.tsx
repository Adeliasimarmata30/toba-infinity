/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RecommendationRequest, RecommendationResponse } from '../types';
import { TOBA_DISTRICTS } from '../data/tobaData';
import { HelpCircle, Star, Sparkles, Sliders, DollarSign, Wallet, Compass, Landmark, Coffee, Check, RefreshCw } from 'lucide-react';
import { useTravelStore } from '../store/travelStore';

export default function RecommendationForm() {
  const { user, toggleFavorite, isFavorite } = useTravelStore();
  
  // Form State
  const [budget, setBudget] = useState<RecommendationRequest['budget']>('Medium');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Nature', 'Culture']);
  const [travelStyle, setTravelStyle] = useState<RecommendationRequest['travelStyle']>('Balanced');
  const [preferredDistrict, setPreferredDistrict] = useState<string>('Samosir');
  const [duration, setDuration] = useState<number>(3);
  
  // Response State
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  const interestOptions = [
    { value: 'Nature', label: '🌲 Wisata Alam', desc: 'Air terjun, perbukitan, pine forest' },
    { value: 'Culture', label: '🏛️ Seni & Budaya', desc: 'Kampung adat, kain ulos, tarian tortor' },
    { value: 'Culinary', label: '🍛 Eksplorasi Kuliner', desc: 'Arsik mas, mie gomak, ombus-ombus' },
    { value: 'Family', label: '👨‍👩‍👧‍👦 Wisata Keluarga', desc: 'Pantai landai, taman bermain, wahana air' },
    { value: 'Adventure', label: '🧗 Petualangan', desc: 'Trekking perbukitan, camping, jelajah gua' }
  ];

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleFetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          interests: selectedInterests,
          travelStyle,
          preferredDistrict,
          duration
        })
      });

      if (!response.ok) throw new Error('Failed to fetch recommendation package.');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Maaf, asisten rekomendasi tidak merespon saat ini. Silakan coba sesaat lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-1">
      
      {/* CARD LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* INPUT WIZARD PANEL (COL: 5) */}
        <div className="lg:col-span-5 bg-white rounded-[18px] border border-[#E0F2FE]/60 shadow-lg p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Sliders className="w-5 h-5 text-[#0EA5E9]" />
            <h2 className="font-display font-bold text-base text-[#0F172A]">Kurator Wisata Pintar</h2>
          </div>

          {/* DURATION */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#0F172A]">Durasi Kunjungan</label>
              <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-lg bg-[#E0F2FE]/50 text-[#0F4C81]">{duration} Hari</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0EA5E9]"
            />
          </div>

          {/* BUDGET PROFILE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0F172A] block">Profil Anggaran Wisata</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as const).map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`py-2 px-3 rounded-[14px] border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    budget === b
                      ? 'border-[#0EA5E9] bg-[#E0F2FE]/40 text-[#0F4C81] font-extrabold shadow-sm'
                      : 'border-slate-100 hover:bg-[#F8FAFC] text-[#64748B]'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-[#0EA5E9]" />
                  {b === 'Low' ? 'Backpacker' : b === 'Medium' ? 'Standar' : 'Premium'}
                </button>
              ))}
            </div>
          </div>

          {/* DISTRICT PREFERENCE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0F172A] block">Fokus Kabupaten</label>
            <select
              value={preferredDistrict}
              onChange={(e) => setPreferredDistrict(e.target.value)}
              className="w-full p-2.5 border border-[#E0F2FE] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 rounded-xl text-xs text-[#0F172A]"
            >
              <option value="Semua Kabupaten">Semua Kabupaten (Acak)</option>
              {TOBA_DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* TRAVEL STYLE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0F172A] block">Gaya Perjalanan</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Relaxed', 'Balanced', 'Active'] as const).map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTravelStyle(style)}
                  className={`py-2 px-3 rounded-[14px] border text-center text-xs font-semibold transition-all cursor-pointer ${
                    travelStyle === style
                      ? 'border-[#0EA5E9] bg-[#E0F2FE]/40 text-[#0F4C81] font-extrabold shadow-sm'
                      : 'border-slate-100 hover:bg-[#F8FAFC] text-[#64748B]'
                  }`}
                >
                  {style === 'Relaxed' ? 'Santai' : style === 'Balanced' ? 'Seimbang' : 'Padat'}
                </button>
              ))}
            </div>
          </div>

          {/* INTEREST SELECTION */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0F172A] block">Kategori Minat Wisata</label>
            <div className="space-y-2">
              {interestOptions.map(option => {
                const isSelected = selectedInterests.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInterestToggle(option.value)}
                    className={`w-full text-left p-3 border rounded-[14px] flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0EA5E9] bg-[#E0F2FE]/25 shadow-xs'
                        : 'border-slate-100 hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">{option.label}</p>
                      <p className="text-[10px] text-[#64748B] mt-0.5">{option.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleFetchRecommendations}
            disabled={loading || selectedInterests.length === 0}
            className="w-full py-3.5 bg-gradient-to-r from-[#0F4C81] to-[#0EA5E9] hover:from-[#2563EB] hover:to-[#0EA5E9] disabled:from-slate-100 disabled:to-slate-100 text-white disabled:text-slate-400 font-bold rounded-[14px] text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0EA5E9]/15 hover:shadow-[#0EA5E9]/25 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Menganalisis Kebutuhan...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
                Dapatkan Rekomendasi Pintar
              </>
            )}
          </button>
        </div>

        {/* OUTPUT ANALYSIS PANEL (COL: 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {!result ? (
            <div className="bg-[#F8FAFC] rounded-[18px] border-2 border-dashed border-[#E0F2FE] p-12 text-center flex flex-col items-center justify-center h-full min-h-[450px]">
              <Compass className="w-16 h-16 text-slate-300 mb-4 animate-bounce" style={{ animationDuration: '3s' }} />
              <h3 className="font-display font-bold text-lg text-[#0F172A]">Rencana Perjalanan Menunggu</h3>
              <p className="text-xs text-[#64748B] mt-2 max-w-sm leading-relaxed">
                Konfigurasikan preferensi Anda di panel kiri dan klik tombol untuk menghasilkan kurasi destinasi, penginapan rujukan, kuliner khas, beserta rincian estimasi biaya secara otomatis.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              
              {/* AI SUMMARIZED INTELLECT */}
              {result.aiSummary && (
                <div className="bg-gradient-to-r from-[#081B33] to-[#0F4C81] text-white p-5 rounded-[18px] shadow-xl space-y-3 border border-white/10 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10">
                    <Sparkles className="w-48 h-48" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
                    <span className="text-xs font-mono tracking-wider font-semibold uppercase text-sky-400">Analisis Asisten AI</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-200 whitespace-pre-line italic">
                    "{result.aiSummary}"
                  </p>
                </div>
              )}

              {/* ESTIMATED BUDGET PANEL */}
              <div className="bg-white rounded-[18px] border border-[#E0F2FE]/60 p-5 shadow-md space-y-4">
                <h3 className="font-display font-bold text-base text-[#0F172A] flex items-center gap-1.5">
                  <DollarSign className="w-5 h-5 text-[#10B981]" />
                  Rincian Estimasi Biaya Perjalanan
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-100">
                    <span className="text-[10px] text-[#64748B] block font-mono">PENGINAPAN</span>
                    <span className="text-sm font-extrabold text-[#0F172A]">Rp {result.estimatedCosts.accommodation.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-100">
                    <span className="text-[10px] text-[#64748B] block font-mono">TRANSPORTASI</span>
                    <span className="text-sm font-extrabold text-[#0F172A]">Rp {result.estimatedCosts.transportation.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-100">
                    <span className="text-[10px] text-[#64748B] block font-mono">MAKAN & MINUM</span>
                    <span className="text-sm font-extrabold text-[#0F172A]">Rp {result.estimatedCosts.meals.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-100">
                    <span className="text-[10px] text-[#64748B] block font-mono">TIKET MASUK</span>
                    <span className="text-sm font-extrabold text-[#0F172A]">Rp {result.estimatedCosts.tickets.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-[#E0F2FE]/30 border border-[#E0F2FE]/60 p-3.5 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-[#0F4C81]">Total Perkiraan Biaya ({duration} Hari)</span>
                    <p className="text-[10px] text-[#64748B]">Berdasarkan profil {budget === 'Low' ? 'Backpacker' : budget === 'Medium' ? 'Standar' : 'Premium'}</p>
                  </div>
                  <span className="text-xl font-extrabold text-[#10B981] font-mono">Rp {result.estimatedCosts.total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* RECOMMENDED DESTINATIONS */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#0F172A] flex items-center gap-1.5">
                  <Landmark className="w-5 h-5 text-[#0EA5E9]" />
                  Rekomendasi Objek Wisata Terkurasi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.destinations.map(dest => (
                    <div key={dest.id} className="bg-white rounded-[14px] border border-slate-100 overflow-hidden shadow-sm flex flex-col justify-between group">
                      <div className="relative h-32 overflow-hidden">
                        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-2 right-2 text-[9px] bg-[#0EA5E9]/80 backdrop-blur-sm text-white font-mono uppercase px-2 py-0.5 rounded-full font-bold">{dest.category}</span>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2 font-sans">
                        <div>
                          <span className="text-[10px] font-mono text-[#64748B]">{dest.district}</span>
                          <h4 className="font-bold text-sm text-[#0F172A]">{dest.name}</h4>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                          <span className="font-bold text-[#0F4C81]">{dest.ticketPrice === 0 ? 'Gratis' : `Rp ${dest.ticketPrice.toLocaleString('id-ID')}`}</span>
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                            <span className="font-bold text-[#0F172A]">{dest.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECOMMENDED HOTELS */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#0F172A] flex items-center gap-1.5">
                  <Landmark className="w-5 h-5 text-[#0EA5E9]" />
                  Rujukan Akomodasi & Hotel
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.hotels.map(hotel => (
                    <div key={hotel.id} className="bg-white rounded-[14px] border border-slate-100 overflow-hidden shadow-sm flex flex-col justify-between group">
                      <div className="relative h-32 overflow-hidden">
                        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2 font-sans">
                        <div>
                          <span className="text-[10px] font-mono text-[#64748B]">{hotel.district}</span>
                          <h4 className="font-bold text-sm text-[#0F172A]">{hotel.name}</h4>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                          <span className="font-bold text-[#0EA5E9] font-mono text-[10px]">{hotel.priceRange.split('-')[0].trim()}</span>
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                            <span className="font-bold text-[#0F172A]">{hotel.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECOMMENDED CULINARY */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#0F172A] flex items-center gap-1.5">
                  <Coffee className="w-5 h-5 text-[#0EA5E9]" />
                  Kuliner Tradisional Wajib Coba
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.culinary.map(cul => (
                    <div key={cul.id} className="bg-white p-3 rounded-[14px] border border-slate-100 flex gap-3 shadow-sm font-sans">
                      <img src={cul.image} alt={cul.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-[#0F172A] leading-tight">{cul.name}</h4>
                        <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">{cul.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
