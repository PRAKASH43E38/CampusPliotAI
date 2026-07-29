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
        'Open Student Portal -> Academics -> Library Pod Booking',
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
        'Submit leave application in Student Portal -> Freshers Guide -> Hostel Pass',
        'System sends SMS OTP to registered parent mobile number',
        'Once parent confirms via OTP, digital QR Gate Pass is generated',
        'Scan QR code at Hostel Main Security Gate during departure and entry'
      ],
      office: 'Warden Office (Hostel Block A/B)',
      eta: 'Same Day'
    }
  ];

  return (
    <div className="p-6 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2E7D32] dark:bg-[#4CAF50] flex items-center justify-center text-white shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2">
            AI Smart Q&A & Procedures <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#81C784] font-bold border border-[#DDE5DD] dark:border-[#334155]">Instant KB</span>
          </h3>
          <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] font-medium">
            Ask any official university procedure question for verified step-by-step guidance.
          </p>
        </div>
      </div>

      {/* Suggested Questions List */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-[#1F2937] dark:text-[#F8FAFC] uppercase tracking-wider mb-1">
          Frequently Asked Procedures
        </label>
        {suggestedQuestions.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] transition-colors cursor-pointer"
            onClick={() => setActiveQuestion(activeQuestion === item.q ? null : item.q)}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
                {item.q}
              </h4>
              <span className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                {activeQuestion === item.q ? 'Hide' : 'View Procedure'}
              </span>
            </div>

            {activeQuestion === item.q && (
              <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-[#475569] space-y-3">
                <p className="text-xs text-[#1F2937] dark:text-[#F8FAFC] font-medium leading-relaxed">
                  {item.answer}
                </p>

                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-[#6B7280] dark:text-[#CBD5E1] uppercase tracking-wider">Step-by-step instructions:</p>
                  {item.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#1F2937] dark:text-[#F8FAFC]">
                      <span className="w-5 h-5 rounded-full bg-[#E8F5E9] dark:bg-[#1E293B] text-[#2E7D32] dark:text-[#81C784] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="font-medium">{step}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 text-[11px] text-[#6B7280] dark:text-[#CBD5E1] border-t border-[#E5E7EB] dark:border-[#475569] font-medium">
                  <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" /> {item.office}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" /> SLA: {item.eta}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
