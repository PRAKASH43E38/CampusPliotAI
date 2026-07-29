import React, { useState } from 'react';
import { Compass, CheckCircle2, ShieldAlert, Phone, Sparkles, ChevronDown, PhoneCall } from 'lucide-react';
import { freshersGuideItems } from '../data/staticData';

export const FreshersGuidePage: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('fr_1');

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F8FAF8] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4" /> Freshers Onboarding
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC] tracking-tight">
            Freshers Survival Guide & Handbook
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#CBD5E1] mt-1 max-w-xl">
            Everything a first-year student needs: RFID card setup, WiFi credentials, campus rules, and emergency support.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center shrink-0">
          <span className="text-xl font-extrabold text-red-600 dark:text-red-400">1800-180-5522</span>
          <span className="block text-[10px] text-red-700 dark:text-red-300 font-bold uppercase">24/7 Anti-Ragging Helpline</span>
        </div>
      </div>

      {/* Guide Accordions */}
      <div className="space-y-4">
        {freshersGuideItems.map((item) => {
          const isOpen = activeAccordion === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] overflow-hidden"
            >
              <button
                onClick={() => setActiveAccordion(isOpen ? null : item.id)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-white dark:hover:bg-[#162033] transition-colors cursor-pointer border-none bg-transparent"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center font-bold text-sm shrink-0">
                    {item.category === 'Checklist' && <CheckCircle2 className="w-5 h-5" />}
                    {item.category === 'Rules' && <ShieldAlert className="w-5 h-5 text-amber-600" />}
                    {item.category === 'Contacts' && <PhoneCall className="w-5 h-5 text-red-600" />}
                    {item.category === 'Navigation' && <Compass className="w-5 h-5 text-[#2E7D32]" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#1F2937] dark:text-[#F8FAFC]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] mt-0.5 font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ChevronDown className={`w-5 h-5 text-[#6B7280] dark:text-[#CBD5E1] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="p-5 border-t border-[#E5E7EB] dark:border-[#475569] bg-white dark:bg-[#162033] space-y-3">
                  {item.contactNumber && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 font-bold text-xs flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Direct Contact: {item.contactNumber}
                    </div>
                  )}

                  {item.details && (
                    <ul className="space-y-2">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#1F2937] dark:text-[#F8FAFC] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] dark:bg-[#4CAF50] shrink-0 mt-1.5" />
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
