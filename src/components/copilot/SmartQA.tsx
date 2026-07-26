import React, { useState } from 'react';
import { Sparkles, HelpCircle, Clock, Building } from 'lucide-react';

export const SmartQA: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const suggestedQuestions = [
    {
      q: 'How to apply for Bonafide Student Certificate?',
      answer: 'Bonafide Certificates can be requested directly via the Homi Bhabha Admin Block Portal or Single Window Counter 3.',
      steps: [
        'Log into Student Portal -> Academic Services -> Certificate Request',
        'Upload your current fee receipt and student ID card copy',
        'Admin verification takes 24 hours. Digital PDF certificate is issued with QR code',
        'Physical stamped copy can be collected from Admin Block Room 104 between 02:00 PM - 04:00 PM'
      ],
      office: 'Admin Block Room 104',
      eta: '24 Hours'
    },
    {
      q: 'How do I book a private 24/7 Library Study Pod?',
      answer: 'Quiet study pods in Aryabhata Central Library 3rd Floor can be reserved up to 48 hours in advance.',
      steps: [
        'Open SCE FIESTA -> Academics -> Library Pod Booking',
        'Select Pod # (Pod 1 to 12 available with dual monitor setups)',
        'Choose duration slot (Max 3 hours per student per day)',
        'Tap RFID Student Card at Pod door scanner to unlock'
      ],
      office: 'Library 3rd Floor Kiosk',
      eta: 'Instant Approval'
    },
    {
      q: 'What is the procedure for Hostel Leave Permission & Night Gate Pass?',
      answer: 'Outstation leave requests require parent OTP approval submitted before 06:00 PM on the departure date.',
      steps: [
        'Submit leave application in SCE FIESTA -> Freshers Guide -> Hostel Pass',
        'System sends SMS OTP to registered parent mobile number',
        'Once parent confirms via OTP, digital QR Gate Pass is generated',
        'Scan QR code at Hostel Main Security Gate during departure and entry'
      ],
      office: 'Warden Office (Hostel Block A/B)',
      eta: 'Same Day'
    }
  ];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            AI Smart Q&A & Procedures <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">Instant KB</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Ask any official university procedure question for verified step-by-step guidance.
          </p>
        </div>
      </div>

      {/* Suggested Questions List */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Frequently Asked Procedures
        </label>
        {suggestedQuestions.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer"
            onClick={() => setActiveQuestion(activeQuestion === item.q ? null : item.q)}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {item.q}
              </h4>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {activeQuestion === item.q ? 'Hide' : 'View Procedure'}
              </span>
            </div>

            {activeQuestion === item.q && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-150">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {item.answer}
                </p>

                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Step-by-step instructions:</p>
                  {item.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="font-medium">{step}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700/80 font-medium">
                  <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-emerald-600" /> {item.office}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-600" /> SLA: {item.eta}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
