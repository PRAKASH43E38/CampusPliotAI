import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B7280] dark:text-[#CBD5E1] uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#4CAF50] border border-[#DDE5DD] dark:border-[#334155]">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC] tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`text-xs font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
              isPositive
                ? 'bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#4CAF50]'
                : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-[#6B7280] dark:text-[#CBD5E1]">
          {subtitle}
        </p>
      )}
    </div>
  );
};
