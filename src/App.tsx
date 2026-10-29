import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DESTINATIONS, Destination } from './data/destinations';
import { DestinationModal } from './components/DestinationModal';
import { FaroConfigModal } from './components/FaroConfigModal';
import { MatatuGuideModal } from './components/MatatuGuideModal';
import { faroService } from './services/faro';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedDistance, setSelectedDistance] = useState<string>('all');
  const [isDistanceOpen, setIsDistanceOpen] = useState(false);
  const [sortOption, setSortOption] = useState<'rating' | 'price' | 'distance'>('rating');

  // Modal states
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isFaroModalOpen, setIsFaroModalOpen] = useState(false);
  const [isMatatuModalOpen, setIsMatatuModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(['kingwal-swamp', 'koromosho-falls']);

  // Telemetry Dock states
  const [ttfb, setTtfb] = useState('38ms');
  const [domReady, setDomReady] = useState('142ms');
  const [traceId, setTraceId] = useState('0a8f9c2d1b74e...');
  const [isSimulating, setIsSimulating] = useState(false);
  const [traceBadgeStatus, setTraceBadgeStatus] = useState<string>('🟢 Telemetry Agent Active');
  const [faroActive, setFaroActive] = useState(faroService.isSdkLoaded());

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setSelectedDestination(null);
        setIsFaroModalOpen(false);
        setIsMatatuModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update trace and faro state on mount
  useEffect(() => {
    setTraceId('trace_' + Math.random().toString(36).substring(2, 9));
    faroService.trackEvent('app_initialized', {
      view: 'home_directory',
      total_destinations: DESTINATIONS.length,
      kapsabet_spots: DESTINATIONS.filter(d => d.region === 'kapsabet').length
    });
    setFaroActive(faroService.isSdkLoaded());
  }, []);

  // Filter and sort destinations
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((item) => {
      // Search text match
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCounty = item.county.toLowerCase().includes(query);
        const matchesLocation = item.locationDetails.toLowerCase().includes(query);
        const matchesHighlights = item.highlights.some((h) => h.toLowerCase().includes(query));
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesCounty && !matchesLocation && !matchesHighlights && !matchesTags) {
          return false;
        }
      }

      // Filter pills
      if (selectedFilter === 'kapsabet' && item.region !== 'kapsabet') return false;
      if (selectedFilter === 'eldoret' && item.region !== 'eldoret') return false;
      if (selectedFilter === 'chill' && item.category !== 'chill') return false;
      if (selectedFilter === 'waterfalls' && item.category !== 'waterfalls') return false;
      if (selectedFilter === 'sports' && item.category !== 'sports') return false;
      if (selectedFilter === 'budget' && item.priceValue > 200) return false;
      if (selectedFilter === 'open-weekend' && !item.operatingHours.includes('06:') && !item.operatingHours.includes('07:')) return false;

      // Distance filter
      if (selectedDistance === 'town' && item.distanceKm > 5) return false;
      if (selectedDistance === '15km' && item.distanceKm > 15) return false;
      if (selectedDistance === '35km' && item.distanceKm > 35) return false;
      if (selectedDistance === 'kapsabet' && item.region !== 'kapsabet') return false;

      return true;
    }).sort((a, b) => {
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'price') return a.priceValue - b.priceValue;
      if (sortOption === 'distance') return a.distanceKm - b.distanceKm;
      return 0;
    });
  }, [searchQuery, selectedFilter, selectedDistance, sortOption]);

  const handleOpenDetail = (dest: Destination) => {
    setSelectedDestination(dest);
    const trace = 'trace_' + Math.random().toString(36).substring(2, 9);
    setTraceId(trace);
    faroService.trackEvent('view_destination', {
      id: dest.id,
      name: dest.name,
      region: dest.region,
      category: dest.category,
      price_kes: dest.priceValue
    });
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      faroService.trackEvent('wishlist_updated', {
        spot_id: id,
        action: exists ? 'removed' : 'added',
        total_saved: next.length
      });
      return next;
    });
  };

  const runSyntheticTrafficTest = () => {
    setIsSimulating(true);
    setTraceBadgeStatus('⚡ Transmitting RUM Spans...');

    setTimeout(() => {
      const randLatency = Math.floor(Math.random() * 22) + 16;
      const randDom = Math.floor(Math.random() * 45) + 90;
      const newTrace = '0a8f' + Math.random().toString(16).substring(2, 12);

      setTtfb(randLatency + 'ms');
      setDomReady(randDom + 'ms');
      setTraceId(newTrace);
      setIsSimulating(false);

      faroService.trackMeasurement('ttfb', randLatency);
      faroService.trackMeasurement('dom_ready', randDom);
      faroService.trackEvent('synthetic_test_completed', {
        ttfb_ms: randLatency,
        dom_ready_ms: randDom,
        trace_id: newTrace
      });

      setTraceBadgeStatus('✅ 200 OK Trace Emitted');
      setTimeout(() => {
        setTraceBadgeStatus('🟢 Telemetry Agent Active');
      }, 2500);
    }, 650);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c] antialiased flex flex-col font-sans">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 bg-[#fbf9f8]/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="h-20 w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#004ccd] to-[#0f62fe] flex items-center justify-center text-white shadow-sm font-bold text-lg">
              EV
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-[#1b1c1c]">
                Eldoret Vibes
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#004ccd]">
                Uasin Gishu &amp; Kapsabet Explorer
              </span>
            </div>
          </div>

          {/* Quick Search Shortcut in Navbar (Desktop) */}
          <div className="hidden xl:flex items-center flex-1 max-w-md mx-2">
            <div className="relative w-full flex items-center bg-[#f5f3f3] hover:bg-[#efeded] transition-colors rounded-xl px-3 py-1.5 border border-slate-200/60">
              <span className="material-symbols-outlined text-slate-400 mr-2 text-lg">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search waterfalls, Kapsabet spots, tea ridges..."
                className="w-full bg-transparent text-xs text-[#1b1c1c] placeholder:text-slate-400 focus:outline-none"
              />
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('kapsabet');
                    faroService.trackEvent('navbar_tag_clicked', { tag: 'kapsabet' });
                  }}
                  className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full hover:bg-emerald-200 transition-colors"
                >
                  Kapsabet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('Town Center');
                  }}
                  className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-full hover:bg-slate-300 transition-colors"
                >
                  Town
                </button>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setSelectedFilter('all');
                setSelectedDistance('all');
                setSearchQuery('');
              }}
              className={`px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-[#0f62fe] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#eae8e7]'
              }`}
            >
              Discover
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedFilter('kapsabet');
                faroService.trackEvent('nav_filter_kapsabet');
              }}
              className={`px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 ${
                selectedFilter === 'kapsabet'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#eae8e7]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Kapsabet Spots
            </button>
            <button
              type="button"
              onClick={() => setIsMatatuModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 hover:bg-[#eae8e7] px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm text-[#004ccd]">directions_bus</span>
              Matatu Guide
            </button>
            <button
              type="button"
              onClick={() => setIsFaroModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 hover:bg-[#eae8e7] px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm text-[#006527]">monitoring</span>
              Grafana Faro RUM
            </button>
          </nav>

          {/* Action CTAs & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('destinationsSection');
                el?.scrollIntoView({ behavior: 'smooth' });
                faroService.trackEvent('explore_now_clicked');
              }}
              className="inline-flex items-center gap-1.5 bg-[#004ccd] hover:bg-[#0f62fe] text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">explore</span>
              <span>Explore Now</span>
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-primary-container flex items-center justify-center text-white text-xs font-bold ring-2 ring-[#004ccd]/20">
                MU
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-[#1b1c1c] leading-tight">Student ID</span>
                <span className="text-[10px] text-slate-500 leading-tight">Moi Univ / UoE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full pt-24 pb-16 flex-1">
        {/* Glow decorative ambient shapes */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-[#dbe1ff]/30 blur-3xl pointer-events-none"></div>
          <div className="absolute top-48 -right-20 w-96 h-96 rounded-full bg-[#96f8a1]/25 blur-3xl pointer-events-none"></div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-6 relative z-10">
            {/* SECTION 1: SEARCH & FILTER CONTROL BAR */}
            <section className="w-full flex flex-col gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80">
              {/* Top Row: Search Input + Distance Filter + Sort */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1 flex items-center bg-[#f5f3f3] hover:bg-[#efeded] focus-within:bg-white rounded-xl px-3.5 py-2 transition-all border border-slate-200/60 focus-within:ring-2 focus-within:ring-[#004ccd]/30">
                  <span className="material-symbols-outlined text-slate-400 mr-2 text-lg">search</span>
                  <input
                    ref={searchInputRef}
                    id="vibesSearchInput"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      faroService.trackEvent('search_query_changed', { query: e.target.value });
                    }}
                    placeholder="Search waterfalls, Kapsabet tea hills, student sports, Kingwal swamp..."
                    className="w-full bg-transparent text-sm text-[#1b1c1c] placeholder:text-slate-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-slate-600 mr-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">cancel</span>
                    </button>
                  )}
                  <div className="hidden sm:flex items-center gap-1 shrink-0 pl-1">
                    <kbd className="text-[10px] bg-[#eae8e7] text-slate-600 font-mono px-1.5 py-0.5 rounded shadow-xs border border-slate-300">
                      ⌘K
                    </kbd>
                  </div>
                </div>

                {/* Filter Dropdown & Sorter */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Distance Filter Popover */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDistanceOpen(!isDistanceOpen)}
                      className="flex items-center gap-1.5 bg-[#efeded] hover:bg-[#eae8e7] text-[#1b1c1c] font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm text-[#004ccd]">near_me</span>
                      <span>
                        {selectedDistance === 'town'
                          ? 'Town Center (<5 km)'
                          : selectedDistance === '15km'
                          ? 'Within 15 km of CBD'
                          : selectedDistance === '35km'
                          ? 'Greater Uasin Gishu (<35 km)'
                          : selectedDistance === 'kapsabet'
                          ? 'Kapsabet & Nandi Corridor'
                          : 'All Distances & Regions'}
                      </span>
                      <span className="material-symbols-outlined text-sm">expand_more</span>
                    </button>

                    {isDistanceOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl z-30 p-1.5 border border-slate-200 space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDistance('all');
                            setIsDistanceOpen(false);
                          }}
                          className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                            selectedDistance === 'all'
                              ? 'bg-[#dbe1ff] text-[#00174c] font-bold'
                              : 'text-slate-700 hover:bg-[#f5f3f3]'
                          }`}
                        >
                          All Distances &amp; Regions
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDistance('town');
                            setIsDistanceOpen(false);
                          }}
                          className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                            selectedDistance === 'town'
                              ? 'bg-[#dbe1ff] text-[#00174c] font-bold'
                              : 'text-slate-700 hover:bg-[#f5f3f3]'
                          }`}
                        >
                          Town Center (&lt;5 km)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDistance('15km');
                            setIsDistanceOpen(false);
                          }}
                          className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                            selectedDistance === '15km'
                              ? 'bg-[#dbe1ff] text-[#00174c] font-bold'
                              : 'text-slate-700 hover:bg-[#f5f3f3]'
                          }`}
                        >
                          Within 15 km of CBD
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDistance('kapsabet');
                            setIsDistanceOpen(false);
                          }}
                          className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                            selectedDistance === 'kapsabet'
                              ? 'bg-emerald-100 text-emerald-900 font-bold'
                              : 'text-slate-700 hover:bg-[#f5f3f3]'
                          }`}
                        >
                          🌿 Kapsabet &amp; Nandi Corridor
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDistance('35km');
                            setIsDistanceOpen(false);
                          }}
                          className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                            selectedDistance === '35km'
                              ? 'bg-[#dbe1ff] text-[#00174c] font-bold'
                              : 'text-slate-700 hover:bg-[#f5f3f3]'
                          }`}
                        >
                          Greater Rift Valley (&lt;35 km)
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Sorter */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = sortOption === 'rating' ? 'price' : sortOption === 'price' ? 'distance' : 'rating';
                      setSortOption(next);
                      faroService.trackEvent('sort_changed', { sort: next });
                    }}
                    className="flex items-center gap-1.5 bg-[#f5f3f3] hover:bg-[#efeded] text-[#1b1c1c] font-semibold text-xs px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-[#006527]">tune</span>
                    <span>
                      {sortOption === 'rating'
                        ? 'Highest Rated'
                        : sortOption === 'price'
                        ? 'Student Budget'
                        : 'Nearest Distance'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Bottom Row: Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedFilter('all')}
                  className={`shrink-0 font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    selectedFilter === 'all'
                      ? 'bg-[#004ccd] text-white shadow-sm'
                      : 'bg-[#f5f3f3] text-slate-600 hover:text-[#1b1c1c] hover:bg-[#efeded]'
                  }`}
                >
                  All Vibes
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('kapsabet');
                    faroService.trackEvent('filter_pills_kapsabet_clicked');
                  }}
                  className={`shrink-0 font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                    selectedFilter === 'kapsabet'
                      ? 'bg-[#006527] text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">forest</span>
                  <span>Kapsabet &amp; Nandi Spots (6)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFilter('chill')}
                  className={`shrink-0 font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    selectedFilter === 'chill'
                      ? 'bg-[#004ccd] text-white shadow-sm'
                      : 'bg-[#f5f3f3] text-slate-600 hover:text-[#1b1c1c] hover:bg-[#efeded]'
                  }`}
                >
                  Chilling Spots
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFilter('waterfalls')}
                  className={`shrink-0 font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    selectedFilter === 'waterfalls'
                      ? 'bg-[#004ccd] text-white shadow-sm'
                      : 'bg-[#f5f3f3] text-slate-600 hover:text-[#1b1c1c] hover:bg-[#efeded]'
                  }`}
                >
                  Waterfalls &amp; Hiking
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFilter('sports')}
                  className={`shrink-0 font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    selectedFilter === 'sports'
                      ? 'bg-[#004ccd] text-white shadow-sm'
                      : 'bg-[#f5f3f3] text-slate-600 hover:text-[#1b1c1c] hover:bg-[#efeded]'
                  }`}
                >
                  Sports &amp; Athletics
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFilter('budget')}
                  className={`shrink-0 font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                    selectedFilter === 'budget'
                      ? 'bg-[#96f8a1] text-[#002108] font-bold shadow-sm'
                      : 'bg-[#f5f3f3] text-slate-600 hover:text-[#1b1c1c] hover:bg-[#efeded]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">savings</span>
                  <span>Student Budget (Under KES 200)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFilter('open-weekend')}
                  className={`shrink-0 font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedFilter === 'open-weekend'
                      ? 'bg-[#004ccd] text-white shadow-sm'
                      : 'bg-[#f5f3f3] text-slate-600 hover:text-[#1b1c1c] hover:bg-[#efeded]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Open Early Weekend</span>
                </button>
              </div>
            </section>

            {/* SECTION 2: HERO BANNER CALLOUT (Highland Escapes) */}
            <section className="relative w-full rounded-2xl overflow-hidden bg-[#1b1c1c] text-white p-6 sm:p-8 shadow-lg border border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f62fe]/85 via-[#1b1c1c]/95 to-[#1b1c1c] pointer-events-none"></div>

              {/* Decorative SVG curves */}
              <svg
                className="absolute right-0 top-0 h-full w-2/3 opacity-15 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 600 400"
              >
                <path d="M0 100 Q 150 50 300 150 T 600 80" strokeWidth="2" />
                <path d="M0 160 Q 200 80 400 220 T 600 140" strokeWidth="2" />
                <path d="M0 220 Q 250 140 450 300 T 600 200" strokeWidth="2" />
                <path d="M0 280 Q 200 220 380 340 T 600 280" strokeWidth="2" />
                <path d="M0 340 Q 220 280 420 380 T 600 320" strokeWidth="2" />
              </svg>

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-1.5 bg-[#004ccd]/40 backdrop-blur-md text-[#dbe1ff] text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                    <span className="material-symbols-outlined text-xs">hiking</span>
                    <span>HIGHLAND ESCAPES • UASIN GISHU &amp; NANDI COUNTY</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Looking for a chill spot around Eldoret &amp; Kapsabet?
                  </h2>

                  <p className="text-sm sm:text-base text-slate-200/90 max-w-xl leading-relaxed">
                    From the rare Sitatunga antelopes of Kingwal Swamp and thunderous Chepkiit waterfalls to budget-friendly campus hangouts and tea escarpments. Curated for Moi University &amp; UoE students.
                  </p>

                  {/* Micro Stats Ribbon */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur text-white px-2.5 py-1 rounded-lg">
                      <span>⚡ 12 Curated Spots</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur text-white px-2.5 py-1 rounded-lg">
                      <span>🎓 Verified Student Discounts</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur text-white px-2.5 py-1 rounded-lg">
                      <span>📍 Accurate Distance from CBD</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-lg font-semibold">
                      <span>🌿 Kapsabet Trails Included</span>
                    </span>
                  </div>
                </div>

                {/* Banner Action CTAs */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('destinationsSection');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-[#004ccd] hover:bg-[#0f62fe] text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer text-center"
                  >
                    <span>Explore Top Weekend Escapes</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMatatuModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs px-5 py-3 rounded-xl backdrop-blur transition-all active:scale-95 cursor-pointer text-center"
                  >
                    <span className="material-symbols-outlined text-base">directions_bus</span>
                    <span>Spin Matatu Route Guide</span>
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 3: AUTHENTIC DESTINATIONS GRID */}
            <section className="w-full flex flex-col gap-4" id="destinationsSection">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#004ccd] block">
                    Curated Directory
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1b1c1c]">
                    Verified Local Hangouts ({filteredDestinations.length} spots)
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 bg-[#efeded] px-3 py-1 rounded-full font-medium">
                    Showing {filteredDestinations.length} of {DESTINATIONS.length} spots
                  </span>
                  {selectedFilter === 'kapsabet' && (
                    <button
                      type="button"
                      onClick={() => setSelectedFilter('all')}
                      className="text-[#004ccd] hover:underline font-semibold"
                    >
                      Reset filter
                    </button>
                  )}
                </div>
              </div>

              {filteredDestinations.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 space-y-3">
                  <span className="material-symbols-outlined text-5xl text-slate-300">search_off</span>
                  <p className="text-sm font-semibold text-[#1b1c1c]">No destinations match your search or filter.</p>
                  <p className="text-xs text-slate-500">Try clearing your filters or searching for "Kapsabet", "waterfalls", or "hiking".</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('all');
                      setSelectedDistance('all');
                    }}
                    className="mt-2 inline-flex items-center gap-1 bg-[#004ccd] text-white text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredDestinations.map((spot) => (
                    <article
                      key={spot.id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border border-slate-200/80 hover:border-slate-300"
                    >
                      {/* Card Image */}
                      <div className="relative w-full h-52 overflow-hidden bg-slate-900">
                        <img
                          src={spot.imageUrl}
                          alt={spot.imageAlt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c]/90 via-[#1b1c1c]/20 to-transparent"></div>

                        {/* Floating Tags */}
                        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                          {spot.region === 'kapsabet' && (
                            <span className="bg-[#006527] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                              🌿 Kapsabet Spot
                            </span>
                          )}
                          <span className="bg-white/95 backdrop-blur text-[10px] text-[#1b1c1c] px-2.5 py-0.5 rounded-full font-semibold shadow-xs">
                            {spot.tags[0] || 'Highland Spot'}
                          </span>
                          {spot.trending && (
                            <span className="bg-[#96f8a1] text-[#002108] text-[10px] px-2 py-0.5 rounded-full font-bold">
                              🔥 Trending
                            </span>
                          )}
                        </div>

                        {/* Title and Distance on Image */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h4 className="text-lg font-bold leading-tight text-white drop-shadow">
                            {spot.name}
                          </h4>
                          <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-xs text-[#b4c5ff]">
                              distance
                            </span>
                            <span className="truncate">{spot.distance}</span>
                          </p>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <span
                                className="material-symbols-outlined text-sm text-[#006527]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                star
                              </span>
                              <span className="font-bold text-[#1b1c1c]">{spot.rating}</span>
                              <span className="text-slate-400">({spot.reviewsCount})</span>
                            </div>
                            <div className="text-[11px] text-[#004ccd] font-bold bg-[#dbe1ff]/40 px-2 py-0.5 rounded">
                              {spot.studentPrice}
                            </div>
                          </div>

                          {/* Highlights pills */}
                          <div className="pt-1">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-bold">
                              Highlights &amp; Amenities
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {spot.highlights.slice(0, 3).map((h, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-[#f5f3f3] text-[#424656] px-2 py-0.5 rounded font-medium"
                                >
                                  {h}
                                </span>
                              ))}
                              {spot.highlights.length > 3 && (
                                <span className="text-[10px] bg-[#f5f3f3] text-slate-500 px-1.5 py-0.5 rounded">
                                  +{spot.highlights.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Footer row with View Details Button */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <span className="text-slate-500 flex items-center gap-1 truncate max-w-[170px]">
                            <span className="material-symbols-outlined text-sm text-[#004ccd]">
                              directions_bus
                            </span>
                            <span className="truncate">{spot.transportMode}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleOpenDetail(spot)}
                            className="bg-[#004ccd] hover:bg-[#0f62fe] text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 active:scale-95 shadow-sm cursor-pointer shrink-0"
                          >
                            <span>View Details</span>
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* SECTION 4: TELEMETRY & GRAFANA SIMULATION LIVE DOCK */}
            <section className="w-full bg-[#efeded] rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#004ccd] animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Grafana &amp; Friends Kenya: Eldoret Edition • Real User Monitoring (RUM)
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#1b1c1c]">
                    Community Telemetry &amp; OpenTelemetry Bridge
                  </h4>
                  <p className="text-xs text-slate-600">
                    Simulate high concurrency matatu route queries, test frontend core web vitals, and measure synthetic trace latency from local Eldoret and Kapsabet edge nodes.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsFaroModalOpen(true)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-[#1b1c1c] font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-300 shadow-xs transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-[#006527]">settings</span>
                    <span>Configure Grafana Faro</span>
                  </button>
                  <button
                    id="simulateLatencyBtn"
                    type="button"
                    disabled={isSimulating}
                    onClick={runSyntheticTrafficTest}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#1b1c1c] hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isSimulating ? (
                      <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                    ) : (
                      <span className="material-symbols-outlined text-sm">speed</span>
                    )}
                    <span>Test Frontend Latency / Simulate Traffic</span>
                  </button>
                </div>
              </div>

              {/* Live Telemetry Feedback Panel */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex flex-col p-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Synthetic TTFB
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-sm font-bold text-[#1b1c1c]" id="rumTtfb">
                      {ttfb}
                    </span>
                    <span className="text-[10px] text-[#004ccd] bg-[#dbe1ff]/50 px-1 py-0.2 rounded font-semibold">
                      Fast
                    </span>
                  </div>
                </div>

                <div className="flex flex-col p-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    DOM Ready
                  </span>
                  <span className="text-sm font-bold text-[#1b1c1c] mt-0.5" id="rumDomReady">
                    {domReady}
                  </span>
                </div>

                <div className="col-span-2 md:col-span-1 flex flex-col p-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    OTel Ingest
                  </span>
                  <span className="text-xs font-mono text-[#1b1c1c] truncate mt-0.5">
                    otel-gateway:4318 [OK]
                  </span>
                </div>

                <div className="col-span-2 md:col-span-1 flex flex-col p-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Active Trace ID
                  </span>
                  <span className="text-xs font-mono text-slate-600 truncate mt-0.5" id="rumTraceId">
                    {traceId}
                  </span>
                </div>

                <div className="col-span-2 md:col-span-1 flex items-center justify-end p-1.5">
                  <button
                    type="button"
                    onClick={() => setIsFaroModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#004ccd] bg-[#dbe1ff]/50 hover:bg-[#dbe1ff] px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004ccd] animate-ping"></span>
                    <span>{faroActive ? '🟢 Live Faro Active' : traceBadgeStatus}</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#f5f3f3] border-t border-slate-200 mt-auto">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#1b1c1c]">Eldoret &amp; Kapsabet Vibes</span>
                <span className="inline-flex items-center gap-1 bg-[#96f8a1] text-[#002108] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006527]"></span>
                  Rift Valley Edition
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-lg">
                Hyper-local town companion and curated hangouts for students and young creators across Eldoret, Kapsabet, Chepkoilel, Kesses, and Annex.
              </p>
              <p className="text-xs text-[#004ccd] font-semibold">
                Engineered in partnership with Grafana &amp; Friends Kenya: Eldoret Edition
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Community &amp; Code
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsFaroModalOpen(true)}
                    className="text-[#1b1c1c] hover:text-[#004ccd] transition-colors flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">code</span>
                    Grafana Faro Hook
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMatatuModalOpen(true)}
                    className="text-[#1b1c1c] hover:text-[#004ccd] transition-colors flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">directions_bus</span>
                    Matatu Stages
                  </button>
                </div>
              </div>

              {/* Live RUM Badge in footer */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Live RUM Latency</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#004ccd] animate-pulse"></span>
                    <span className="text-sm font-bold text-[#1b1c1c]">24ms</span>
                    <span className="text-[10px] text-[#004ccd] bg-[#dbe1ff] px-1.5 py-0.2 rounded font-semibold">
                      p95 Good
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={runSyntheticTrafficTest}
                  className="bg-[#1b1c1c] hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">speed</span>
                  <span>Test Latency</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
            <span>© 2025 Eldoret &amp; Kapsabet Vibes. Built for students, explorers &amp; community builders.</span>
            <div className="flex items-center gap-4">
              <span>Cloud Run Container Ready (Port 8080)</span>
              <span>OpenTelemetry RUM Ingest</span>
            </div>
          </div>
        </div>
      </footer>

      {/* DETAIL MODAL (for any destination, including Kapsabet) */}
      <DestinationModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        isWishlisted={selectedDestination ? wishlist.includes(selectedDestination.id) : false}
        onToggleWishlist={toggleWishlist}
        onSelectAnother={(id) => {
          const found = DESTINATIONS.find((d) => d.id === id);
          if (found) setSelectedDestination(found);
        }}
      />

      {/* GRAFANA FARO WEB SDK CONFIGURATION MODAL */}
      <FaroConfigModal
        isOpen={isFaroModalOpen}
        onClose={() => {
          setIsFaroModalOpen(false);
          setFaroActive(faroService.isSdkLoaded());
        }}
      />

      {/* MATATU ROUTE GUIDE MODAL */}
      <MatatuGuideModal
        isOpen={isMatatuModalOpen}
        onClose={() => setIsMatatuModalOpen(false)}
        onSelectDestinationById={(id) => {
          const found = DESTINATIONS.find((d) => d.id === id);
          if (found) {
            setSelectedDestination(found);
          }
        }}
      />
    </div>
  );
}
