import React, { useState } from 'react';
import { Destination } from '../data/destinations';
import { faroService } from '../services/faro';

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
  onSelectAnother: (id: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'transport' | 'telemetry'>('overview');

  if (!destination) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(`Link to ${destination.name} copied to clipboard! Share with your campus crew.`);
    } else {
      showToast(`Sharing: ${destination.name}`);
    }
    faroService.trackEvent('spot_shared', {
      spot_id: destination.id,
      spot_name: destination.name,
      region: destination.region
    });
  };

  const handleDirections = () => {
    showToast(`Route plotted for ${destination.name}: ${destination.transportDetails.instructions}`);
    faroService.trackEvent('directions_requested', {
      spot_id: destination.id,
      coordinates: destination.coordinates
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#ffffff] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 border border-slate-200/80">
        {/* Modal Header with Image Backdrop */}
        <div className="relative w-full h-52 sm:h-64 shrink-0 bg-slate-900">
          <img
            src={destination.imageUrl}
            alt={destination.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c] via-[#1b1c1c]/40 to-transparent"></div>

          {/* Dismiss Button */}
          <button
            aria-label="Close modal"
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1b1c1c] flex items-center justify-center backdrop-blur shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          {/* Header Badges & Title */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 bg-[#004ccd] text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                {destination.county}
              </span>
              {destination.trending && (
                <span className="bg-[#96f8a1] text-[#002108] text-xs px-2.5 py-0.5 rounded-full font-bold">
                  🔥 Trending Spot
                </span>
              )}
              <span className="bg-white/20 backdrop-blur text-white text-xs px-2 py-0.5 rounded-full">
                {destination.category.toUpperCase()}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">
              {destination.name}
            </h3>
            <p className="text-sm text-slate-200 flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-sm text-[#b4c5ff]">location_on</span>
              <span>{destination.locationDetails}</span>
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-5 pt-2 bg-[#fbf9f8] shrink-0 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-[#004ccd] text-[#004ccd] font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">info</span>
            Overview &amp; Highlights
          </button>
          <button
            onClick={() => setActiveTab('transport')}
            className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'transport'
                ? 'border-[#004ccd] text-[#004ccd] font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">directions_bus</span>
            Matatu &amp; Boda Guide
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'telemetry'
                ? 'border-[#004ccd] text-[#004ccd] font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">speed</span>
            Grafana RUM Span
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3 bg-[#004ccd] text-white text-sm rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                {toastMessage}
              </span>
              <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {activeTab === 'overview' && (
            <>
              {/* Quick Meta Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f5f3f3] p-3.5 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#004ccd] text-2xl">distance</span>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase block tracking-wider">
                      Distance
                    </span>
                    <span className="text-sm font-semibold text-[#1b1c1c]">
                      {destination.distance}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#004ccd] text-2xl">schedule</span>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase block tracking-wider">
                      Operating Hours
                    </span>
                    <span className="text-sm font-semibold text-[#1b1c1c]">
                      {destination.operatingHours.split('(')[0]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#006527] text-2xl">payments</span>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase block tracking-wider">
                      Entry &amp; Rates
                    </span>
                    <span className="text-sm font-bold text-[#004ccd]">
                      {destination.studentPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Perks Banner */}
              <div className="bg-[#dbe1ff]/40 border border-[#b4c5ff]/60 p-4 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-[#004ccd] text-2xl shrink-0 mt-0.5">
                  school
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-[#00174c]">
                      {destination.studentPerks.title}
                    </h5>
                    <span className="text-[10px] bg-[#96f8a1] text-[#002108] font-bold px-1.5 py-0.2 rounded">
                      Verified ID
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {destination.studentPerks.description}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h5 className="text-sm font-bold text-[#1b1c1c]">About this Spot</h5>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {destination.description}
                </p>
              </div>

              {/* Highlights & Amenities */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Highlights &amp; Amenities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {destination.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#efeded] text-[#424656] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#004ccd]"></span>
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Insider Tips */}
              <div className="bg-[#efeded] p-3.5 rounded-xl space-y-1.5">
                <span className="text-xs font-bold text-[#1b1c1c] uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#004ccd]">lightbulb</span>
                  Campus Explorer Tips
                </span>
                <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                  {destination.tips.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                  <li>Best lighting window: {destination.bestTime}</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onToggleWishlist(destination.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-[#dbe1ff] text-[#00174c]'
                      : 'bg-[#efeded] hover:bg-[#eae8e7] text-[#1b1c1c]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-base ${
                      isWishlisted ? 'text-[#004ccd]' : ''
                    }`}
                    style={isWishlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {isWishlisted ? 'favorite' : 'favorite_border'}
                  </span>
                  <span>{isWishlisted ? 'Saved to Weekend Wishlist' : 'Save to Weekend Wishlist'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 bg-[#efeded] hover:bg-[#eae8e7] text-[#1b1c1c] text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">share</span>
                  <span>Share Spot</span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'transport' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#004ccd]/10 to-transparent p-4 rounded-xl border border-[#004ccd]/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[#004ccd]">directions_bus</span>
                  <h4 className="font-bold text-sm text-[#1b1c1c]">Direct Transit Itinerary</h4>
                </div>
                <p className="text-xs text-slate-600">
                  {destination.transportDetails.instructions}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#f5f3f3] p-3 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">
                    Boarding Stage / Terminal
                  </span>
                  <p className="font-medium text-[#1b1c1c]">
                    {destination.transportDetails.stageLocation}
                  </p>
                </div>
                <div className="bg-[#f5f3f3] p-3 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">
                    Matatu Line &amp; Operator
                  </span>
                  <p className="font-medium text-[#1b1c1c]">
                    {destination.transportDetails.matatuLine}
                  </p>
                </div>
                <div className="bg-[#f5f3f3] p-3 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">
                    Estimated Matatu Fare
                  </span>
                  <p className="font-bold text-[#004ccd] text-sm">
                    KES {destination.transportDetails.matatuFareKES} one-way
                  </p>
                </div>
                <div className="bg-[#f5f3f3] p-3 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">
                    Local Boda Boda Transfer
                  </span>
                  <p className="font-bold text-[#006527] text-sm">
                    KES {destination.transportDetails.bodaBodaFareKES}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-600 text-lg shrink-0">info</span>
                <span>
                  <strong>Student Transit Tip:</strong> Traveling with campus peers? Standard 14-seater matatus will often give group charter discounts if you book in advance at the central stage.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-900 text-slate-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <span>OpenTelemetry Span Event</span>
                  <span className="text-emerald-400">faro.api.pushEvent()</span>
                </div>
                <pre className="text-[11px] overflow-x-auto text-emerald-300">
{JSON.stringify(
  {
    event: 'destination_modal_opened',
    destination_id: destination.id,
    destination_name: destination.name,
    region: destination.region,
    county: destination.county,
    category: destination.category,
    price_kes: destination.priceValue,
    coordinates: destination.coordinates,
    sdk_status: faroService.isSdkLoaded() ? 'live_faro_cdn' : 'ready_for_cdn'
  },
  null,
  2
)}
                </pre>
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                This event is automatically pushed to your configured Grafana Cloud Faro RUM collector when you inject the CDN script.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f5f3f3] border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[#004ccd]">explore</span>
            <span>{destination.coordinates.formatted}</span>
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto text-xs font-semibold text-[#1b1c1c] px-4 py-2.5 rounded-xl hover:bg-[#eae8e7] transition-colors text-center cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDirections}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#004ccd] hover:bg-[#0f62fe] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">directions</span>
              <span>Get Directions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
