import React, { useState } from 'react';
import { Compass, CheckCircle2, ShieldAlert, Phone, MapPin, HelpCircle, Sparkles, ChevronDown, PhoneCall } from 'lucide-react';
import { freshersGuideItems } from '../data/mockData';

export const FreshersGuidePage: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('fr_1');

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950 border border-emerald-800 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4" /> Freshers Onboarding
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Freshers Survival Guide & Handbook
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 font-medium max-w-xl">
            Everything a first-year student needs: RFID card setup, WiFi credentials, campus rules, and emergency support.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center shrink-0">
          <span className="text-xl font-black text-rose-400">1800-180-5522</span>
          <span className="block text-[10px] text-slate-300 font-bold uppercase">24/7 Anti-Ragging Helpline</span>
        </div>
      </div>

      {/* Guide Accordions */}
      <div className="space-y-4">
        {freshersGuideItems.map((item) => {
          const isOpen = activeAccordion === item.id;

          return (
            <div
              key={item.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveAccordion(isOpen ? null : item.id)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {item.category === 'Checklist' && <CheckCircle2 className="w-5 h-5" />}
                    {item.category === 'Rules' && <ShieldAlert className="w-5 h-5 text-amber-500" />}
                    {item.category === 'Contacts' && <PhoneCall className="w-5 h-5 text-rose-500" />}
                    {item.category === 'Navigation' && <Compass className="w-5 h-5 text-emerald-500" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 space-y-3 animate-in fade-in duration-150">
                  {item.contactNumber && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Direct Contact: {item.contactNumber}
                    </div>
                  )}

                  {item.details && (
                    <ul className="space-y-2">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
