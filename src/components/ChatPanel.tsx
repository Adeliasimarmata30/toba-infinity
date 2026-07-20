/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTravelStore } from '../store/travelStore';
import { Bot, User, Send, Trash2, ShieldAlert, Sparkles, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatPanel() {
  const { chatHistory, chatLoading, sendMessage, clearChat, user } = useTravelStore();
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Voice Assistant and Speech Synthesis States
  const [voiceInputActive, setVoiceInputActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [shouldSpeakNextResponse, setShouldSpeakNextResponse] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);

  const suggestionChips = [
    { text: 'Sejarah Danau Toba', label: '🌋 Sejarah Danau Toba' },
    { text: 'Apa itu filosofi Dalihan Na Tolu?', label: '🤝 Dalihan Na Tolu' },
    { text: 'Rekomendasi hotel terbaik di Samosir', label: '🏨 Hotel Samosir' },
    { text: 'Bagaimana resep membuat Arsik Ikan Mas?', label: '🐟 Resep Arsik' },
    { text: 'Cara membaca Aksara Batak kuno', label: '✍️ Aksara Batak' }
  ];

  // Cleanup speech synthesis on component unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error stopping speech recognition on unmount:', e);
        }
      }
    };
  }, []);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  // Handle auto-speak response if triggered by voice
  const lastMessage = chatHistory[chatHistory.length - 1];
  useEffect(() => {
    if (!chatLoading && lastMessage && lastMessage.sender === 'ai' && shouldSpeakNextResponse) {
      setShouldSpeakNextResponse(false);
      speakMessage(lastMessage.message, lastMessage.id);
    }
  }, [chatHistory, chatLoading, shouldSpeakNextResponse, lastMessage]);

  const handleSend = async (textToSend: string, isFromVoice: boolean = false) => {
    if (!textToSend.trim()) return;
    setInputText('');
    setVoiceStatus('');
    
    // Stop any active speaking before sending new query
    window.speechSynthesis.cancel();
    setCurrentlySpeakingId(null);

    if (isFromVoice) {
      setShouldSpeakNextResponse(true);
    }

    await sendMessage(textToSend);
  };

  // Synthesize text and read it out loud
  const speakMessage = (text: string, msgId: string) => {
    if (currentlySpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown characters before synthesizing
    const cleanText = text
      .replace(/\*\*|#|\*|`/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';

    utterance.onstart = () => {
      setCurrentlySpeakingId(msgId);
    };

    utterance.onend = () => {
      setCurrentlySpeakingId(null);
    };

    utterance.onerror = () => {
      setCurrentlySpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Trigger SpeechRecognition
  const handleTriggerMic = () => {
    if (voiceInputActive) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setVoiceInputActive(false);
      setVoiceStatus('');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("⚠️ Browser Anda tidak mendukung API Perekaman Suara (Speech Recognition). Silakan gunakan Google Chrome, Safari, atau Microsoft Edge.");
      return;
    }

    window.speechSynthesis.cancel();
    setCurrentlySpeakingId(null);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'id-ID';

    recognition.onstart = () => {
      setVoiceInputActive(true);
      setVoiceStatus('🎤 Mendengarkan... Bicara sekarang.');
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event);
      let errorMsg = 'Gagal merekam suara Anda.';
      if (event.error === 'not-allowed') {
        errorMsg = 'Akses mikrofon ditolak. Izinkan mikrofon di browser Anda.';
      } else if (event.error === 'no-speech') {
        errorMsg = 'Tidak terdengar suara. Silakan coba lagi.';
      }
      setVoiceStatus(`⚠️ ${errorMsg}`);
      setVoiceInputActive(false);
    };

    recognition.onend = () => {
      setVoiceInputActive(false);
    };

    recognition.onresult = async (event: any) => {
      const userSpeechQuery = event.results[0][0].transcript;
      if (userSpeechQuery && userSpeechQuery.trim()) {
        setVoiceStatus(`🗣️ Mendengar: "${userSpeechQuery}"`);
        handleSend(userSpeechQuery, true);
      } else {
        setVoiceStatus('⚠️ Suara tidak terbaca dengan jelas.');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div id="ai-chat-view" className="flex flex-col h-[calc(100vh-92px)] rounded-2xl overflow-hidden border border-slate-100 shadow-xl bg-white">
      {/* CHAT HEADER */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-display font-bold text-base leading-tight">Asisten AI Caldera</h2>
              <span className="text-[10px] bg-sky-500/20 text-sky-400 font-mono border border-sky-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wider">RAG Powered</span>
            </div>
            <p className="text-xs text-slate-400">Tanya tentang budaya Batak, sejarah, kuliner, & tips Geopark</p>
          </div>
        </div>
        
        {chatHistory.length > 0 && (
          <button
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
            title="Bersihkan riwayat percakapan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* DIALOG BOX CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-10 space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-sky-500/10 text-sky-500 mb-2">
              <Bot className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-slate-800">Horas! Selamat datang di Toba Infinity AI</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Asisten cerdas kami dilatih khusus dengan basis data Geopark dan kebudayaan suku Batak. Silakan ajukan pertanyaan seputar destinasi, kuliner, silsilah marga, tari Tor-Tor, hingga penginapan terdekat.
              </p>
            </div>

            {/* PRE-CONSTRUCTED CHIPS */}
            <div className="space-y-2">
              <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Pertanyaan Rekomendasi</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip.text)}
                    className="px-3.5 py-2 bg-white hover:bg-sky-50 border border-slate-100 hover:border-sky-300 text-xs font-semibold text-slate-700 rounded-xl shadow-sm transition-all text-left"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`flex gap-3 max-w-[85%] ${chat.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* ICON */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                  chat.sender === 'user' ? 'bg-sky-500 text-white' : 'bg-slate-950 text-white'
                }`}>
                  {chat.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* BUBBLE */}
                <div className={`p-4 rounded-2xl shadow-sm border ${
                  chat.sender === 'user' 
                    ? 'bg-sky-500 text-white border-sky-400 rounded-tr-none' 
                    : 'bg-white text-slate-800 border-slate-100 rounded-tl-none'
                }`}>
                  {chat.sender === 'user' ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{chat.message}</p>
                  ) : (
                    <div className="markdown-body text-sm leading-relaxed space-y-2 prose prose-slate max-w-none">
                      <ReactMarkdown>{chat.message}</ReactMarkdown>
                    </div>
                  )}
                  
                  {/* Speaker TTS Readout and Timestamp control panel */}
                  <div className="flex items-center justify-between gap-6 mt-3 pt-2 border-t border-slate-100/50">
                    {chat.sender === 'ai' ? (
                      <button
                        onClick={() => speakMessage(chat.message, chat.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer hover:scale-105 ${
                          currentlySpeakingId === chat.id
                            ? 'bg-red-500 text-white shadow-md shadow-red-500/15 animate-pulse'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800'
                        }`}
                        title={currentlySpeakingId === chat.id ? "Hentikan pembicaraan" : "Dengarkan Jawaban AI"}
                      >
                        {currentlySpeakingId === chat.id ? (
                          <>
                            <VolumeX className="w-3 h-3 animate-spin" />
                            <span>Hentikan Suara</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Dengarkan AI</span>
                          </>
                        )}
                      </button>
                    ) : <div />}
                    <span className={`text-[9px] font-mono ${chat.sender === 'user' ? 'text-sky-200' : 'text-slate-400'}`}>
                      {new Date(chat.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* TYPING LOADER */}
            {chatLoading && (
              <div className="flex gap-3 max-w-[80%] mr-auto items-center animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* INPUT CONTROL AREA */}
      <div className="p-4 bg-white border-t border-slate-100 shadow-sm space-y-3">
        {/* Dynamic Voice Recording Status Alert */}
        {voiceStatus && (
          <div className="max-w-4xl mx-auto p-2.5 bg-sky-50 border border-sky-100/80 rounded-xl flex items-center gap-2 text-xs font-semibold text-sky-700 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping shrink-0" />
            <span className="flex-1 text-slate-700 leading-relaxed font-sans">{voiceStatus}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="max-w-4xl mx-auto flex gap-2"
        >
          {/* MICROPHONE TRIGGER BUTTON */}
          <button
            type="button"
            onClick={handleTriggerMic}
            className={`px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm border ${
              voiceInputActive
                ? 'bg-red-500 border-red-500 text-white animate-pulse scale-105 shadow-red-500/20'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
            title={voiceInputActive ? "Hentikan Perekaman Suara" : "Tanya dengan Suara (Perekaman)"}
          >
            {voiceInputActive ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
          </button>

          <input
            type="text"
            placeholder={voiceInputActive ? "🎤 Silakan bicara dalam bahasa Indonesia..." : "Tanyakan sejarah ulos, marga, rute wisata, arsik ikan mas..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={chatLoading}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || chatLoading}
            className="px-5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 disabled:from-slate-100 disabled:to-slate-100 text-white disabled:text-slate-400 rounded-xl transition-all shadow-md shadow-sky-500/10 flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1 font-sans">
          <Sparkles className="w-3 h-3 text-sky-400" />
          Bahasa Indonesia • Klik mic untuk bertanya langsung via suara dan mendengar jawaban lisan AI.
        </p>
      </div>
    </div>
  );
}
