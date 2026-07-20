import React, { useState, useEffect } from 'react';
import { useTravelStore } from '../store/travelStore';
import { TOBA_DISTRICTS } from '../data/tobaData';
import { 
  Calendar, Save, Printer, MapPin, RefreshCw, Compass, ShieldAlert, Sparkles,
  DollarSign, Sliders, Layers, TrendingUp, AlertCircle, CheckCircle
} from 'lucide-react';

export default function ItineraryPlanner() {
  const { user, saveItinerary } = useTravelStore();

  // Core Trip Parameters
  const [duration, setDuration] = useState<number>(3);
  const [transportation, setTransportation] = useState<string>('Mobil Pribadi');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(['Samosir', 'Toba']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Nature', 'Culture']);

  // --- SMART BUDGET PLANNER STATES ---
  const [totalBudget, setTotalBudget] = useState<number>(3500000); // Default Rp 3.5 Million
  const [hotelCost, setHotelCost] = useState<number>(1000000);
  const [transportCost, setTransportCost] = useState<number>(600000);
  const [culinaryCost, setCulinaryCost] = useState<number>(800000);
  const [ticketCost, setTicketCost] = useState<number>(300000);
  const [shoppingCost, setShoppingCost] = useState<number>(400000);
  const [reserveCost, setReserveCost] = useState<number>(400000); // Unallocated/Reserve

  // Auto-sync unallocated reserve whenever any cost allocation changes
  useEffect(() => {
    const allocated = hotelCost + transportCost + culinaryCost + ticketCost + shoppingCost;
    const remaining = totalBudget - allocated;
    setReserveCost(remaining);
  }, [totalBudget, hotelCost, transportCost, culinaryCost, ticketCost, shoppingCost]);

  // Loading & Generator state
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<any | null>(null);

  const interestOptions = ['Nature', 'Culture', 'Culinary', 'Adventure', 'Family'];

  const handleDistrictToggle = (district: string) => {
    setSelectedDistricts(prev =>
      prev.includes(district) ? prev.filter(d => d !== district) : [...prev, district]
    );
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const formatIDR = (num: number) => {
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  // Perform AI generation
  const handleGenerate = async () => {
    setLoading(true);
    
    // Convert numerical budget to standard string category for backend prompt mapping,
    // while sending the full numeric budget in metadata so the model can optimize perfectly.
    let budgetClass: 'Low' | 'Medium' | 'High' = 'Medium';
    if (totalBudget < 2000000) budgetClass = 'Low';
    else if (totalBudget > 7000000) budgetClass = 'High';

    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration,
          budget: `${budgetClass} (${formatIDR(totalBudget)})`,
          transportation,
          interests: selectedInterests,
          districts: selectedDistricts,
          budgetBreakdown: {
            hotel: hotelCost,
            transport: transportCost,
            culinary: culinaryCost,
            tickets: ticketCost,
            shopping: shoppingCost
          }
        })
      });

      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      setGeneratedItinerary(data);
    } catch (err) {
      console.error(err);
      // Fallback itinerary simulator if network timeouts occur
      simulateFallbackItinerary();
    } finally {
      setLoading(false);
    }
  };

  const simulateFallbackItinerary = () => {
    const activitiesList = [
      { time: '08:00 - 10:00', title: 'Perjalanan ke Danau Toba', description: 'Menikmati pemandangan asri jalan pegunungan', location: 'Sumatera Utara', cost: 0 },
      { time: '11:00 - 13:00', title: 'Makan Siang Kuliner Andaliman', description: 'Menikmati hidangan ikan mas arsik bumbu khas Batak', location: 'Restoran Lokal Toba', cost: 150000 },
      { time: '14:00 - 17:00', title: 'Eksplorasi Geosite Kaldera Toba', description: 'Belajar sejarah letusan supervolcano Toba yang megah', location: 'Samosir Geopark', cost: 30000 },
      { time: '18:00 - 21:00', title: 'Check-in Akomodasi & Makan Malam', description: 'Istirahat santai di tepi Danau Toba dengan angin sepoi', location: 'Hotel Pilihan', cost: 0 }
    ];

    const days = [];
    for (let d = 1; d <= duration; d++) {
      days.push({
        day: d,
        activities: activitiesList.map(a => ({
          ...a,
          cost: Math.round(a.cost * (totalBudget / 3500000)) // scale cost based on budget
        }))
      });
    }

    setGeneratedItinerary({
      days,
      tips: [
        'Bawa pakaian hangat karena malam hari di dataran tinggi Toba cenderung dingin.',
        'Sediakan uang tunai dalam pecahan kecil untuk tiket masuk objek wisata.',
        'Sewa pemandu lokal berlisensi untuk mendengar cerita sejarah ruma bolon lebih dalam.'
      ]
    });
  };

  const handleSave = async () => {
    if (!generatedItinerary) return;
    if (!user) {
      alert('Silakan masuk terlebih dahulu di menu Profil untuk menyimpan rencana perjalanan Anda.');
      return;
    }

    const name = `Eksplorasi Danau Toba ${duration} Hari (${selectedDistricts.join(', ')})`;
    
    let budgetClass: 'Low' | 'Medium' | 'High' = 'Medium';
    if (totalBudget < 2000000) budgetClass = 'Low';
    else if (totalBudget > 7000000) budgetClass = 'High';

    await saveItinerary({
      name,
      duration,
      budget: budgetClass,
      transportation,
      interests: selectedInterests,
      districts: selectedDistricts,
      days: generatedItinerary.days
    });
    alert('Itinerary berhasil disimpan ke akun Anda! Lihat di tab Profil.');
  };

  const handlePrint = () => {
    if (!generatedItinerary) return;
    
    // Create a new window for clean printing (works beautifully inside iframes and supports PDF generation)
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Fallback: If pop-ups are blocked, do a standard window.print()
      window.print();
      return;
    }
    
    // Build a beautifully designed print layout
    printWindow.document.write(`
      <html>
        <head>
          <title>Rencana Perjalanan Danau Toba - Toba Infinity</title>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: "Plus Jakarta Sans", "Inter", sans-serif;
              color: #0f172a;
              background-color: #ffffff;
              margin: 0;
              padding: 40px;
              line-height: 1.6;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .header {
              text-align: center;
              border-bottom: 3px double #cbd5e1;
              padding-bottom: 24px;
              margin-bottom: 32px;
            }
            .header h1 {
              font-family: "Playfair Display", serif;
              font-size: 32px;
              font-weight: 900;
              color: #0f4c81;
              margin: 0 0 6px 0;
              letter-spacing: -0.025em;
            }
            .header p {
              font-size: 13px;
              color: #64748b;
              margin: 0;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.1em;
            }
            .meta-grid {
              display: grid;
              grid-template-cols: repeat(4, 1fr);
              gap: 16px;
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 16px 24px;
              margin-bottom: 36px;
            }
            .meta-item {
              display: flex;
              flex-direction: column;
            }
            .meta-item span {
              font-size: 10px;
              font-weight: 700;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin-bottom: 4px;
            }
            .meta-item strong {
              font-size: 13px;
              color: #1e293b;
              font-weight: 700;
            }
            .day-card {
              border: 1px solid #e2e8f0;
              border-radius: 20px;
              padding: 24px;
              margin-bottom: 28px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
              page-break-inside: avoid;
            }
            .day-header {
              display: flex;
              align-items: center;
              gap: 12px;
              border-bottom: 1px solid #f1f5f9;
              padding-bottom: 14px;
              margin-bottom: 20px;
            }
            .day-badge {
              background: linear-gradient(135deg, #0f4c81, #0ea5e9);
              color: #ffffff;
              font-family: "JetBrains Mono", monospace;
              font-weight: 900;
              font-size: 12px;
              padding: 4px 12px;
              border-radius: 8px;
              letter-spacing: 0.05em;
            }
            .day-title {
              font-size: 16px;
              font-weight: 800;
              color: #0f172a;
              margin: 0;
              letter-spacing: -0.01em;
              text-transform: uppercase;
            }
            .activities {
              display: flex;
              flex-direction: column;
              gap: 16px;
              border-left: 2px solid #f1f5f9;
              margin-left: 12px;
              padding-left: 20px;
            }
            .activity {
              position: relative;
            }
            .activity-dot {
              position: absolute;
              left: -27px;
              top: 5px;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background-color: #0ea5e9;
              border: 2px solid #ffffff;
              box-shadow: 0 0 0 2px #0ea5e9;
            }
            .activity-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 4px;
            }
            .activity-time {
              font-family: "JetBrains Mono", monospace;
              font-size: 11px;
              font-weight: 700;
              color: #0ea5e9;
              background-color: #f0f9ff;
              padding: 2px 8px;
              border-radius: 6px;
            }
            .activity-cost {
              font-family: "JetBrains Mono", monospace;
              font-size: 12px;
              font-weight: 800;
              color: #10b981;
            }
            .activity-title {
              font-size: 14px;
              font-weight: 700;
              color: #0f172a;
              margin: 0 0 2px 0;
            }
            .activity-desc {
              font-size: 12px;
              color: #475569;
              margin: 0 0 4px 0;
            }
            .activity-loc {
              font-size: 11px;
              color: #94a3b8;
              font-weight: 500;
              margin: 0;
            }
            .tips-box {
              background-color: #fffbeb;
              border: 1px solid #fef3c7;
              border-radius: 20px;
              padding: 24px;
              margin-top: 36px;
              page-break-inside: avoid;
            }
            .tips-title {
              font-size: 15px;
              font-weight: 800;
              color: #b45309;
              margin: 0 0 12px 0;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .tips-list {
              margin: 0;
              padding-left: 20px;
              font-size: 12px;
              color: #78350f;
              line-height: 1.7;
            }
            .tips-list li {
              margin-bottom: 8px;
            }
            .tips-list li:last-child {
              margin-bottom: 0;
            }
            .footer-note {
              text-align: center;
              font-size: 10px;
              color: #94a3b8;
              margin-top: 48px;
              border-top: 1px dashed #cbd5e1;
              padding-top: 16px;
            }
            @media print {
              body {
                padding: 0;
              }
              .day-card {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TOBA INFINITY</h1>
            <p>Rencana Perjalanan Pintar Rekomendasi AI</p>
          </div>
          
          <div class="meta-grid">
            <div class="meta-item">
              <span>Durasi Rencana</span>
              <strong>${duration} Hari Eksplorasi</strong>
            </div>
            <div class="meta-item">
              <span>Kendaraan Utama</span>
              <strong>${transportation}</strong>
            </div>
            <div class="meta-item">
              <span>Kabupaten Rute</span>
              <strong>${selectedDistricts.join(', ')}</strong>
            </div>
            <div class="meta-item">
              <span>Anggaran Maksimal</span>
              <strong>${formatIDR(totalBudget)}</strong>
            </div>
          </div>

          <div class="itinerary-days">
            ${generatedItinerary.days.map((dayObj: any) => `
              <div class="day-card">
                <div class="day-header">
                  <span class="day-badge">HARI ${dayObj.day}</span>
                  <h2 class="day-title">Eksplorasi Kaldera Danau Toba</h2>
                </div>
                <div class="activities">
                  ${dayObj.activities.map((act: any) => `
                    <div class="activity">
                      <div class="activity-dot"></div>
                      <div class="activity-header">
                        <span class="activity-time">${act.time}</span>
                        ${act.cost > 0 ? `<span class="activity-cost">${formatIDR(act.cost)}</span>` : ''}
                      </div>
                      <h3 class="activity-title">${act.title}</h3>
                      <p class="activity-desc">${act.description}</p>
                      <p class="activity-loc">📍 ${act.location}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          ${generatedItinerary.tips && generatedItinerary.tips.length > 0 ? `
            <div class="tips-box">
              <h3 class="tips-title">💡 Panduan Perjalanan & Tips Tambahan AI</h3>
              <ul class="tips-list">
                ${generatedItinerary.tips.map((tip: string) => `<li>${tip}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <div class="footer-note">
            Dokumen ini dicetak secara dinamis menggunakan Toba Infinity AI Trip Planner. Nikmati petualangan tak terbatas di Geopark Global Kaldera Danau Toba!
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start p-1">
      
      {/* LEFT FORM / CONTROLLER (COL: 5) */}
      <div className="xl:col-span-5 space-y-6">
        
        {/* TRAVEL CONCIERGE SETTING CARD */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-black text-sm text-slate-800 tracking-wider">AI TRAVEL CONCIERGE</h2>
              <p className="text-[10px] font-mono text-slate-400">Atur kriteria dasar perjalanan Anda</p>
            </div>
          </div>

          {/* DURATION */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Durasi Perjalanan</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-1.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    duration === d 
                      ? 'border-sky-500 bg-sky-50 text-sky-600 font-extrabold shadow-sm' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {d} Hari
                </button>
              ))}
            </div>
          </div>

          {/* TRANSPORTATION */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Kendaraan Utama</label>
            <select
              value={transportation}
              onChange={(e) => setTransportation(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-700 font-medium focus:bg-white focus:outline-none"
            >
              <option value="Mobil Pribadi">🚗 Mobil Pribadi</option>
              <option value="Sepeda Motor">🏍️ Sepeda Motor</option>
              <option value="Sewa Mobil + Driver">🚐 Sewa Mobil & Driver</option>
              <option value="Transportasi Umum">🚌 Bus & Ferry Danau</option>
            </select>
          </div>

          {/* DISTRICT CHECKBOXES */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Rute Kabupaten Geopark</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {TOBA_DISTRICTS.map(d => {
                const isChecked = selectedDistricts.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDistrictToggle(d)}
                    className={`py-1.5 px-2 border rounded-xl text-[10px] text-left truncate transition-all cursor-pointer ${
                      isChecked 
                        ? 'border-sky-500 bg-sky-50/50 text-sky-600 font-bold' 
                        : 'border-slate-100 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {isChecked ? '✓ ' : ''}{d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* INTEREST CHECKBOXES */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Minat Utama Aktivitas</label>
            <div className="flex flex-wrap gap-1.5">
              {interestOptions.map(interest => {
                const isChecked = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-1 border rounded-full text-[10px] transition-all cursor-pointer ${
                      isChecked 
                        ? 'border-sky-500 bg-sky-50 text-sky-600 font-bold shadow-sm' 
                        : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {interest === 'Nature' ? '🏞️ Alam' : interest === 'Culture' ? '📜 Budaya' : interest === 'Culinary' ? '🍛 Kuliner' : interest === 'Adventure' ? '🧗 Petualangan' : '👪 Keluarga'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SMART BUDGET ALLOCATION PLANNER CARD */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-black text-sm text-slate-800 tracking-wider">SMART BUDGET PLANNER</h2>
              <p className="text-[10px] font-mono text-slate-400">Atur alokasi anggaran instan</p>
            </div>
          </div>

          {/* Total Budget Slider */}
          <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">Total Anggaran Maksimal</span>
              <span className="text-sm font-black font-mono text-emerald-600">{formatIDR(totalBudget)}</span>
            </div>
            <input
              type="range"
              min="1000000"
              max="15000000"
              step="500000"
              value={totalBudget}
              onChange={(e) => {
                const total = Number(e.target.value);
                setTotalBudget(total);
                // Dynamically scale defaults
                setHotelCost(Math.round(total * 0.3));
                setTransportCost(Math.round(total * 0.15));
                setCulinaryCost(Math.round(total * 0.25));
                setTicketCost(Math.round(total * 0.1));
                setShoppingCost(Math.round(total * 0.1));
              }}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Breakdown sliders */}
          <div className="space-y-3.5 pt-1">
            <h3 className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">ALOKASI POS PENGELUARAN</h3>
            
            {/* Hotel Cost */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>🏨 Penginapan & Hotel</span>
                <span className="font-mono">{formatIDR(hotelCost)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={totalBudget * 0.6}
                step="100000"
                value={hotelCost}
                onChange={(e) => setHotelCost(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded accent-sky-500"
              />
            </div>

            {/* Transport Cost */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>🚗 Transportasi & Bensin</span>
                <span className="font-mono">{formatIDR(transportCost)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={totalBudget * 0.4}
                step="50000"
                value={transportCost}
                onChange={(e) => setTransportCost(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded accent-orange-500"
              />
            </div>

            {/* Culinary Cost */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>🍛 Kuliner & Konsumsi</span>
                <span className="font-mono">{formatIDR(culinaryCost)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={totalBudget * 0.5}
                step="50000"
                value={culinaryCost}
                onChange={(e) => setCulinaryCost(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded accent-amber-500"
              />
            </div>

            {/* Ticket Cost */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>🎟️ Tiket Objek Wisata</span>
                <span className="font-mono">{formatIDR(ticketCost)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={totalBudget * 0.3}
                step="20000"
                value={ticketCost}
                onChange={(e) => setTicketCost(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded accent-indigo-500"
              />
            </div>

            {/* Shopping Cost */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>🛍️ Belanja Oleh-oleh & Ulos</span>
                <span className="font-mono">{formatIDR(shoppingCost)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={totalBudget * 0.3}
                step="50000"
                value={shoppingCost}
                onChange={(e) => setShoppingCost(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded accent-pink-500"
              />
            </div>
          </div>

          {/* Reserve Box Alert */}
          <div className={`p-3.5 rounded-2xl border text-xs flex justify-between items-center transition-colors ${
            reserveCost >= 0 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
              : 'bg-red-50 border-red-100 text-red-800'
          }`}>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Sisa Cadangan (Reserve):</span>
            </div>
            <span className="font-black font-mono">{formatIDR(reserveCost)}</span>
          </div>

          {reserveCost < 0 && (
            <p className="text-[10px] text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Alokasi pos melebihi total anggaran! Silakan turunkan alokasi cost di atas.
            </p>
          )}

          {/* EXECUTION BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={loading || selectedDistricts.length === 0 || reserveCost < 0}
            className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 hover:-translate-y-0.5 disabled:translate-y-0 disabled:from-slate-100 disabled:to-slate-100 text-white disabled:text-slate-400 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/15 hover:shadow-sky-500/25 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                AI Sedang Menghitung & Mengoptimasi...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-sky-100 animate-pulse" />
                Sesuaikan & Sinkronkan Itinerary AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT DISPLAY PANEL (COL: 7) */}
      <div className="xl:col-span-7">
        {!generatedItinerary ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center min-h-[480px] flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Compass className="w-8 h-8 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-slate-700 tracking-wider">REKLASIFIKASI RENCANA KOSONG</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed mx-auto">
                Atur durasi hari, preferensi kabupaten, dan alokasikan budget Anda di samping. AI akan menyinkronkan rute kunjungan agar pas dengan budget!
              </p>
            </div>
          </div>
        ) : (
          <div id="itinerary-print-area" className="space-y-6 animate-fade-in">
            
            {/* ACTION BANNER HEADER */}
            <div className="bg-slate-900 text-white p-4 rounded-3xl flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono text-emerald-400">RUTE AI TEROPTIMASI SINKRON</h3>
                  <p className="text-[10px] text-slate-400">Menghindari backtracking & over-budget</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:-translate-y-0.5 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Trip
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 hover:-translate-y-0.5 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak / PDF
                </button>
              </div>
            </div>

            {/* DYNAMIC SKELETON OR ITINERARY PLAN */}
            <div className="space-y-6">
              {generatedItinerary.days.map((dayObj: any) => (
                <div key={dayObj.day} className="bg-white rounded-3xl border border-slate-100 shadow-md p-5 space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-slate-50 pb-2.5">
                    <span className="w-8 h-8 rounded-2xl bg-sky-500 text-white font-mono font-black text-xs flex items-center justify-center shadow-lg shadow-sky-500/20">
                      {dayObj.day}
                    </span>
                    <h3 className="font-display font-black text-sm text-slate-800 tracking-wider">HARI KE-{dayObj.day}</h3>
                  </div>

                  {/* ACTIVITIES TIMELINE */}
                  <div className="space-y-4 pl-4 relative border-l-2 border-slate-100">
                    {dayObj.activities.map((act: any, idx: number) => (
                      <div key={idx} className="relative pl-5 space-y-1 group">
                        {/* Dot indicator */}
                        <div className="absolute left-[-24.5px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-sky-500 group-hover:scale-125 transition-transform" />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                          <span className="text-[9px] font-bold font-mono text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full w-max">
                            {act.time}
                          </span>
                          {act.cost > 0 && (
                            <span className="text-[10px] font-bold text-slate-500 font-mono">
                              Biaya: {formatIDR(act.cost)}
                            </span>
                          )}
                        </div>
                        
                        <h4 className="font-bold text-xs text-slate-800 leading-snug">{act.title}</h4>
                        <p className="text-xs text-slate-500 leading-normal">{act.description}</p>
                        
                        {act.location && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-red-400" />
                            {act.location}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* AI TRAVEL RECOMMENDATION TIPS */}
            {generatedItinerary.tips && (
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 space-y-3 shadow-sm">
                <h4 className="font-display font-bold text-xs text-amber-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Tips Keselamatan & Perjalanan Geopark
                </h4>
                <ul className="list-disc pl-5 text-xs text-amber-700 space-y-1.5 leading-relaxed">
                  {generatedItinerary.tips.map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
