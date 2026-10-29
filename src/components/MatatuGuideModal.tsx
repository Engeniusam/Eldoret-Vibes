import React, { useState } from 'react';
import { faroService } from '../services/faro';

interface MatatuGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestinationById: (id: string) => void;
}

export const MatatuGuideModal: React.FC<MatatuGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectDestinationById,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<string>('route-kapsabet');

  if (!isOpen) return null;

  const routes = [
    {
      id: 'route-kapsabet',
      name: 'Line 4: Eldoret ⇄ Kapsabet Highway Express',
      stage: 'Eldoret Kapsabet Stage (Sosiani Basin) / Kapsabet Town Bus Park',
      fareRange: 'KES 100 – 140',
      destinations: [
        { name: 'Kingwal Swamp (Sitatunga Sanctuary)', id: 'kingwal-swamp', drop: 'Chemundu Stage + KES 50 Boda' },
        { name: 'Chepkiit Waterfalls', id: 'chepkiit-falls', drop: 'Mlango Junction + KES 50 Boda' },
        { name: 'Kapsabet Athletic Ground', id: 'kapsabet-athletics', drop: 'Kapsabet Town Post Office' },
      ],
      description: 'The primary commuter artery linking Eldoret CBD with Kapsabet town through lush rolling Nandi tea and dairy hills.',
    },
    {
      id: 'route-sergoit',
      name: 'Line 9: Chepkoilel & Sergoit Scenic Corridor',
      stage: 'Eldoret Central Stage (behind Paul\'s Bakery)',
      fareRange: 'KES 60 – 80',
      destinations: [
        { name: 'Koromosho Falls & Gorge', id: 'koromosho-falls', drop: 'Sergoit junction + KES 50 Boda' },
        { name: 'University of Eldoret (UoE)', id: 'eldoret-sports-club', drop: 'Chepkoilel Main Gate' },
      ],
      description: 'Runs past the University of Eldoret towards the basalt volcanic gorges and northern farm outposts.',
    },
    {
      id: 'route-nandi-hills',
      name: 'Line 7: Nandi Hills & Escarpment Shuttle',
      stage: 'Eldoret KVDA Plaza Stage',
      fareRange: 'KES 120 – 150',
      destinations: [
        { name: 'Nandi Hills Escarpment', id: 'nandi-hills-escarpment', drop: 'Kapsasur Viewpoint' },
        { name: 'Chemomi Tea Estate', id: 'chemomi-tea', drop: 'Chemomi Factory Ridge' },
        { name: 'Nandi Rock (Sheu Morobi)', id: 'nandi-rock', drop: 'Chepterit junction' },
      ],
      description: 'Climbs into high-altitude cloud forests and tea estates with spectacular Rift Valley drop-off views.',
    },
    {
      id: 'route-town-circuit',
      name: 'Town Circuit: Elgon View & Kapsoya',
      stage: 'Barngetuny Plaza & Central Roundabout',
      fareRange: 'KES 40 – 50',
      destinations: [
        { name: 'Eldoret Sports Club', id: 'eldoret-sports-club', drop: 'Elgon View Gate' },
        { name: 'Two Rivers Dam', id: 'two-rivers-dam', drop: 'Kapsoya Terminus + 5 min walk' },
      ],
      description: 'Fast, budget-friendly town shuttles connecting campus hostels with central recreational green zones.',
    },
  ];

  const current = routes.find((r) => r.id === selectedRoute) || routes[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#1b1c1c] text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#004ccd] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-2xl">directions_bus</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Rift Valley &amp; Kapsabet Matatu Guide
              </h3>
              <p className="text-xs text-slate-400">
                Official student stages, verified fares, and local Boda connections
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Route selector buttons */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {routes.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRoute(r.id);
                  faroService.trackEvent('route_selected', { route_id: r.id });
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedRoute === r.id
                    ? 'bg-[#004ccd] text-white shadow-sm'
                    : 'bg-[#f5f3f3] text-slate-700 hover:bg-[#efeded]'
                }`}
              >
                {r.name.split(':')[0]}
              </button>
            ))}
          </div>

          {/* Details Card */}
          <div className="bg-[#f5f3f3] p-4 rounded-xl space-y-3 border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#1b1c1c]">{current.name}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{current.description}</p>
              </div>
              <span className="bg-[#dbe1ff] text-[#00174c] px-2.5 py-1 rounded-lg font-bold text-xs shrink-0">
                {current.fareRange}
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">
                Boarding Stage in CBD
              </span>
              <p className="font-semibold text-[#1b1c1c]">{current.stage}</p>
            </div>

            {/* Destinations reachable */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">
                Top Hangouts on this route
              </span>
              <div className="space-y-1.5">
                {current.destinations.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200"
                  >
                    <div>
                      <span className="font-bold text-[#1b1c1c] block">{d.name}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#004ccd]">
                          directions_walk
                        </span>
                        {d.drop}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectDestinationById(d.id);
                      }}
                      className="bg-[#004ccd] hover:bg-[#0f62fe] text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Spot</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#f5f3f3] border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Student Tip: Always confirm fare before boarding during peak hours</span>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#1b1c1c] hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
