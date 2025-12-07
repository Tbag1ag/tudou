import React from 'react';

interface PotatoStageProps {
  stage: number; // 0, 1, 2, or 3 (Harvest)
}

const PotatoStage: React.FC<PotatoStageProps> = ({ stage }) => {
  const width = 160;
  const height = 160;

  // Colors
  const soilColor = "#854d0e"; // Brown-800
  const soilLight = "#a16207"; // Brown-700
  const plantColor = "#22c55e"; // Green-500
  const potColor = "#FDE68A"; // Amber-200
  
  // Stage 3 is the "Big Potato" for harvest visual
  const isBigPotato = stage === 3;

  return (
    <div className="relative flex items-center justify-center" style={{ width, height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* Soil Mound */}
        <path d="M20 90 Q50 70 80 90" fill={soilColor} />
        <ellipse cx="50" cy="90" rx="35" ry="12" fill={soilLight} />
        
        {/* Stage 0: Just the mound, maybe a tiny hint of life */}
        {stage === 0 && (
            <circle cx="50" cy="85" r="2" fill="#4ade80" className="animate-pulse"/>
        )}

        {/* Stage 1: Sprout */}
        {(stage >= 1 && !isBigPotato) && (
          <g className="animate-in fade-in zoom-in duration-700 origin-bottom">
             <path d="M50 85 C50 75 50 70 50 60" stroke={plantColor} strokeWidth="4" strokeLinecap="round"/>
             <path d="M50 65 Q40 60 35 65" stroke={plantColor} strokeWidth="4" strokeLinecap="round"/>
             <path d="M50 60 Q60 55 65 60" stroke={plantColor} strokeWidth="4" strokeLinecap="round"/>
             <ellipse cx="35" cy="65" rx="5" ry="3" fill={plantColor} transform="rotate(-20 35 65)"/>
             <ellipse cx="65" cy="60" rx="5" ry="3" fill={plantColor} transform="rotate(20 65 60)"/>
          </g>
        )}

        {/* Stage 2: Bushier */}
        {(stage >= 2 && !isBigPotato) && (
          <g className="animate-in fade-in slide-in-from-bottom-2 duration-700 origin-bottom">
             {/* Extra height */}
             <path d="M50 60 C50 50 52 40 50 35" stroke={plantColor} strokeWidth="4" strokeLinecap="round"/>
             {/* Top leaves */}
             <path d="M50 45 Q35 40 30 45" stroke={plantColor} strokeWidth="3" strokeLinecap="round"/>
             <ellipse cx="30" cy="45" rx="6" ry="4" fill={plantColor} transform="rotate(-30 30 45)"/>
             <path d="M50 40 Q65 35 70 40" stroke={plantColor} strokeWidth="3" strokeLinecap="round"/>
             <ellipse cx="70" cy="40" rx="6" ry="4" fill={plantColor} transform="rotate(30 70 40)"/>
             {/* Small flower bud? */}
             <circle cx="50" cy="30" r="4" fill="#FCA5A5" />
          </g>
        )}

        {/* Stage 3: THE BIG POTATO (Harvest Mode) */}
        {isBigPotato && (
          <g className="animate-in zoom-in duration-500 origin-center">
             {/* The Potato Body */}
             <ellipse cx="50" cy="60" rx="35" ry="28" fill="#eab308" stroke="#a16207" strokeWidth="2" />
             {/* Spots */}
             <circle cx="40" cy="55" r="2" fill="#ca8a04" opacity="0.5"/>
             <circle cx="65" cy="65" r="3" fill="#ca8a04" opacity="0.5"/>
             <circle cx="55" cy="45" r="2" fill="#ca8a04" opacity="0.5"/>
             
             {/* Face */}
             <circle cx="40" cy="60" r="3" fill="#1e293b"/>
             <circle cx="60" cy="60" r="3" fill="#1e293b"/>
             <path d="M45 70 Q50 75 55 70" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
             
             {/* Sparkles */}
             <path d="M20 30L22 35L20 40L18 35Z" fill="#FCD34D" className="animate-spin" style={{transformOrigin: '20px 35px'}} />
             <path d="M80 30L82 35L80 40L78 35Z" fill="#FCD34D" className="animate-spin" style={{transformOrigin: '80px 35px'}} />
          </g>
        )}
      </svg>
    </div>
  );
};

export default PotatoStage;