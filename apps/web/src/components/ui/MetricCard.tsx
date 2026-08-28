import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  icon,
  trend,
  className = '',
}) => {
  return (
    <div className={`bg-[#1c2541] border border-[#3a506b] rounded-lg p-4 flex flex-col justify-between shadow-sm ${className}`}>
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
        <span className="flex items-center gap-1.5 uppercase tracking-wider">{icon}{title}</span>
        {badge}
      </div>
      <div className="my-1">
        <div className="text-2xl font-bold text-slate-100 font-mono">{value}</div>
      </div>
      {(subtitle || trend) && (
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-700/50">
          <span>{subtitle}</span>
          {trend && <span className="text-amber-400 font-mono">{trend}</span>}
        </div>
      )}
    </div>
  );
};
