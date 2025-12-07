import React from 'react';
import { Award, Lock } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  color: string;
}

interface BadgeListProps {
  badges: Badge[];
}

const BadgeList: React.FC<BadgeListProps> = ({ badges }) => {
  return (
    <div className="mb-24">
      <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">Achievements</h3>
      <div className="grid grid-cols-3 gap-3">
        {badges.map(badge => (
          <div 
            key={badge.id}
            className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all ${
              badge.isUnlocked 
                ? 'bg-white border-slate-100 shadow-sm' 
                : 'bg-slate-50 border-transparent opacity-60 grayscale'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 text-2xl shadow-inner ${badge.isUnlocked ? badge.color : 'bg-slate-200'}`}>
              {badge.isUnlocked ? badge.icon : <Lock size={16} className="text-slate-400" />}
            </div>
            <h4 className="text-xs font-bold text-slate-700 leading-tight mb-1">{badge.name}</h4>
            <p className="text-[10px] text-slate-400 leading-tight">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeList;
