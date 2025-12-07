import React, { useState } from 'react';
import { Droplets } from 'lucide-react';
import PotatoStage from './PotatoStage';

interface PotatoFieldProps {
  harvestCount: number;
  currentStage: number; // 0, 1, 2
  canWater: boolean;
  hasWateredToday: boolean;
  onWater: (isHarvest: boolean) => void;
}

const PotatoField: React.FC<PotatoFieldProps> = ({ harvestCount, currentStage, canWater, hasWateredToday, onWater }) => {
  const [isWatering, setIsWatering] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [showMessage, setShowMessage] = useState('');

  // 0 -> 1 -> 2 -> (Harvest) -> 0
  
  const handleWaterClick = () => {
    if (!canWater || isWatering || isHarvesting) return;

    setIsWatering(true);
    
    // Determine if this watering leads to a harvest (Stage 2 -> 3)
    const willHarvest = currentStage === 2;

    setTimeout(() => {
        // Water hits the ground
        
        if (willHarvest) {
            setShowMessage('Big Potato Unlocked! You harvested 1 potato.');
            setIsHarvesting(true);
            setTimeout(() => {
                onWater(true); // Increment harvest, reset stage
                setIsHarvesting(false);
                setIsWatering(false);
                setShowMessage('');
            }, 1500); // Time for jump animation
        } else {
            if (currentStage === 0) setShowMessage('First sprinkle! Your potato woke up.');
            if (currentStage === 1) setShowMessage('Nice! Your potato is growing.');
            
            onWater(false); // Just increment stage
            
            setTimeout(() => {
                setIsWatering(false);
                setShowMessage('');
            }, 1000); // Read time
        }
    }, 1000); // Pouring time
  };

  return (
    <div className="flex flex-col h-full">
        {/* Sky / Scene */}
        <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-3xl p-6 shadow-sm border border-blue-100 relative overflow-hidden min-h-[400px] flex flex-col items-center justify-end mb-6">
            
            {/* Status Message */}
            {showMessage && (
                <div className="absolute top-8 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-teal-800 font-bold text-center shadow-md animate-in zoom-in slide-in-from-bottom-4">
                    {showMessage}
                </div>
            )}

            {!showMessage && !isHarvesting && (
                <div className="absolute top-8 flex flex-col items-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Growth Progress</span>
                    <div className="flex gap-1">
                        <div className={`w-3 h-3 rounded-full ${currentStage >= 0 ? 'bg-teal-500' : 'bg-slate-300'}`} />
                        <div className={`w-3 h-3 rounded-full ${currentStage >= 1 ? 'bg-teal-500' : 'bg-slate-300'}`} />
                        <div className={`w-3 h-3 rounded-full ${currentStage >= 2 ? 'bg-teal-500' : 'bg-slate-300'}`} />
                    </div>
                </div>
            )}

            {/* Sun */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-60 blur-xl" />

            {/* Main Potato Area */}
            <div className="relative w-full h-64 flex items-end justify-center z-10">
                <div className={`transition-all duration-700 ${isHarvesting ? 'animate-harvest-bounce' : ''}`}>
                    {/* Render Stage 3 momentarily during harvest */}
                    <PotatoStage stage={isHarvesting ? 3 : currentStage} />
                </div>
            </div>

            {/* Watering Can Animation */}
            {isWatering && (
                 <div className="absolute top-1/4 right-1/4 z-20 animate-pour pointer-events-none">
                    <div className="text-6xl filter drop-shadow-lg">🚿</div>
                    <div className="absolute top-10 left-2 text-blue-400 animate-rain">
                        💧
                    </div>
                 </div>
            )}

            {/* Controls */}
            <div className="w-full mt-8 z-20">
                <button
                  onClick={handleWaterClick}
                  disabled={!canWater || isWatering || isHarvesting}
                  className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                    canWater 
                      ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95 shadow-blue-200' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Droplets size={24} className={canWater ? 'animate-bounce' : ''} />
                  {hasWateredToday 
                    ? 'Come back tomorrow!' 
                    : canWater 
                        ? 'Water Potato!' 
                        : 'Finish habits to get water'}
                </button>
            </div>
        </div>

        {/* Harvest Counter */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white flex items-center justify-between shadow-xl">
             <div>
                <h3 className="text-sm font-bold text-slate-400 mb-1">Total Harvest</h3>
                <div className="flex items-end gap-2">
                    <span key={harvestCount} className="text-4xl font-black animate-in zoom-in spin-in-3 duration-500">{harvestCount}</span>
                    <span className="text-sm font-bold mb-2 text-slate-500">potatoes</span>
                </div>
             </div>
             <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                🥔
             </div>
        </div>
    </div>
  );
};

export default PotatoField;