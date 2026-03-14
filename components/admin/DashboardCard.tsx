import React from 'react';
import { LucideProps } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<LucideProps>;
  change?: string;
}

export const DashboardCard = ({ title, value, icon: Icon, change }: DashboardCardProps) => {
  return (
    <div className="card p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-base-content/60">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="p-3 bg-primary/10 text-primary rounded-lg">
          <Icon size={24} />
        </div>
      </div>
      {change && (
        <p className="text-xs text-green-500 mt-2">{change} from last month</p>
      )}
    </div>
  );
};
