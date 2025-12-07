import React from 'react';

interface PotatoMascotProps {
  progress: number;
  isTalking: boolean;
}

const PotatoMascot: React.FC<PotatoMascotProps> = ({ progress, isTalking }) => {
  let mood = 'neutral';
  if (progress === 0) mood = 'sleepy';
  else if (progress < 50) mood = 'neutral';
  else if (progress < 100) mood = 'happy';
  else mood = 'excited';

  return (
    <div className={`relative w-full h-full flex items-center justify-center transition-all duration-500 ease-in-out
      ${isTalking ? 'animate-bounce' : ''}
      ${mood === 'excited' ? 'animate-[wiggle_1s_ease-in-out_infinite]' : ''}
    `}>
      <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
        className={`transition-all duration-500 ${mood === 'happy' || mood === 'excited' ? 'scale-110' : 'scale-100'}`}
      >
        {/* Body */}
        <path d="M50 85C75 85 90 70 90 50C90 30 75 15 50 15C25 15 10 30 10 50C10 70 25 85 50 85Z" fill="#FDE68A" stroke="#475569" strokeWidth="4"/>

        {/* Sprout - animating leaf */}
        <g className={`origin-bottom ${mood === 'excited' || mood === 'happy' ? 'animate-[wave_2s_ease-in-out_infinite]' : ''}`} style={{transformBox: 'fill-box'}}>
            <path d="M50 15V8" stroke="#166534" strokeWidth="4" strokeLinecap="round"/>
            <path d="M50 8C50 8 35 2 35 15" stroke="#166534" strokeWidth="4" strokeLinecap="round"/>
        </g>

        {/* Face */}
        {mood === 'sleepy' && (
            <>
                {/* Sleeping Eyes */}
                <path d="M30 45C30 45 34 40 38 45" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
                <path d="M62 45C62 45 66 40 70 45" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
                {/* Zzz - represented as small mouth */}
                <circle cx="50" cy="58" r="2" fill="#1E293B" opacity="0.4"/>
            </>
        )}

        {mood === 'neutral' && (
            <>
                <circle cx="35" cy="45" r="4" fill="#1E293B"/>
                <circle cx="65" cy="45" r="4" fill="#1E293B"/>
                <path d="M45 60Q50 63 55 60" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
            </>
        )}

        {mood === 'happy' && (
            <>
                 <circle cx="35" cy="45" r="4" fill="#1E293B"/>
                 <circle cx="65" cy="45" r="4" fill="#1E293B"/>
                 <path d="M35 60Q50 70 65 60" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
                 <circle cx="25" cy="55" r="3" fill="#FCA5A5" opacity="0.5"/>
                 <circle cx="75" cy="55" r="3" fill="#FCA5A5" opacity="0.5"/>
            </>
        )}

        {mood === 'excited' && (
            <>
                {/* Happy closed eyes */}
                <path d="M32 45Q35 40 38 45" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
                <path d="M62 45Q65 40 68 45" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
                {/* Big open mouth */}
                <path d="M35 60Q50 75 65 60" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="#FFF1F2" />
                 <circle cx="22" cy="55" r="4" fill="#FCA5A5" opacity="0.7"/>
                 <circle cx="78" cy="55" r="4" fill="#FCA5A5" opacity="0.7"/>
            </>
        )}
      </svg>
    </div>
  );
};

export default PotatoMascot;