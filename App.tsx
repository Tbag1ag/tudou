import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Check, Link as LinkIcon, ListTodo, Droplets, LayoutGrid } from 'lucide-react';
import { Habit } from './types';
import ProgressBar from './components/ProgressBar';
import DateStrip from './components/DateStrip';
import AddHabitModal from './components/AddHabitModal';
import PotatoMascot from './components/PotatoMascot';
import PotatoField from './components/PotatoField';
import InstallPrompt from './components/InstallPrompt';
import { getMotivation } from './services/geminiService';

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'habits' | 'growth'>('habits');
  
  // Data State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [motivation, setMotivation] = useState<string>("Let's get started!");
  const [isRefreshingMotivation, setIsRefreshingMotivation] = useState(false);
  
  // Growth Game State
  const [harvestCount, setHarvestCount] = useState(0);
  const [growthStage, setGrowthStage] = useState(0); // 0, 1, 2. (3 is visual trigger for harvest)
  const [lastWateredDate, setLastWateredDate] = useState('');

  // Helper for Local Date String (YYYY-MM-DD) to avoid timezone issues
  const getLocalDateString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
  };

  // Load from local storage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('potatoHabits');
    const savedGame = localStorage.getItem('potatoGameStats');
    
    // Default sample data
    const todayStr = getLocalDateString(new Date());

    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (e) {
        console.error("Failed to load habits", e);
        setHabits([]);
      }
    } else {
      const initialHabits = [
        { id: '1', title: 'Read for 30 mins', completed: false, date: todayStr, category: '学习' },
        { id: '2', title: 'Meditate', completed: false, date: todayStr, category: '日常' },
        { id: '3', title: 'Drink 8 cups of water', completed: true, date: todayStr, category: '生活' },
        { id: '4', title: 'Morning Run 5km', completed: false, date: todayStr, link: 'Strava', category: '生活' },
        { id: '5', title: 'Complete project report', completed: false, date: todayStr, category: '工作' },
      ];
      setHabits(initialHabits);
    }

    if (savedGame) {
      try {
        const stats = JSON.parse(savedGame);
        setHarvestCount(stats.harvestCount || 0);
        setGrowthStage(stats.growthStage || 0);
        setLastWateredDate(stats.lastWateredDate || '');
      } catch (e) { console.error(e); }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('potatoHabits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('potatoGameStats', JSON.stringify({
      harvestCount,
      growthStage,
      lastWateredDate
    }));
  }, [harvestCount, growthStage, lastWateredDate]);

  // Derived Data
  const dateKey = getLocalDateString(selectedDate);
  const todayStr = getLocalDateString(new Date());
  
  const daysHabits = useMemo(() => habits.filter(h => h.date === dateKey), [habits, dateKey]);
  const completedCount = daysHabits.filter(h => h.completed).length;
  const totalCount = daysHabits.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Game Logic
  // Can water if: Progress is 100% AND haven't watered today.
  const isToday = dateKey === todayStr;
  const hasWateredToday = lastWateredDate === todayStr;
  const canWater = isToday && progress === 100 && !hasWateredToday;

  // Group habits by category
  const groupedHabits = useMemo(() => {
    const groups: Record<string, Habit[]> = {};
    daysHabits.forEach(habit => {
      const cat = habit.category || '其他';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(habit);
    });
    return groups;
  }, [daysHabits]);

  // Fetch motivation with DEBOUNCE
  useEffect(() => {
    if (totalCount === 0 || activeTab !== 'habits') return;

    // Debounce the call to avoid hitting rate limits (429) when toggling multiple items quickly
    const timer = setTimeout(async () => {
      setIsRefreshingMotivation(true);
      const text = await getMotivation(progress);
      setMotivation(text);
      setIsRefreshingMotivation(false);
    }, 1500); // Wait 1.5s after last change before fetching

    return () => clearTimeout(timer);
  }, [progress, totalCount, activeTab]);

  const addHabit = (title: string, category: string, link?: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      completed: false,
      date: dateKey,
      link,
      category: category || '其他',
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h =>
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const handleWater = (isHarvest: boolean) => {
    setLastWateredDate(todayStr);
    
    if (isHarvest) {
      setHarvestCount(prev => prev + 1);
      setGrowthStage(0);
    } else {
      setGrowthStage(prev => prev + 1);
    }
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(selectedDate);

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center text-slate-800 font-sans">
      <div className="w-full max-w-md bg-white sm:bg-slate-50 min-h-screen flex flex-col relative shadow-2xl sm:my-8 sm:rounded-[3rem] sm:h-[90vh] sm:overflow-hidden sm:border-4 border-slate-100">
        
        {/* Main Content Area with Scroll */}
        <div className={`flex-1 ${activeTab === 'habits' ? 'overflow-y-auto' : 'overflow-hidden h-full'} no-scrollbar pb-24`}>
          <div className="p-6 h-full flex flex-col">
            
            {/* Header */}
            <header className="flex justify-between items-center mb-6 pt-2 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 overflow-hidden">
                  <PotatoMascot progress={activeTab === 'habits' ? progress : 100} isTalking={isRefreshingMotivation} />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                  {activeTab === 'habits' ? 'Potato Habits' : 'Potato Garden'}
                </h1>
              </div>
              {activeTab === 'habits' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-10 h-10 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-teal-200 transition-all active:scale-95"
                >
                  <Plus size={24} strokeWidth={3} />
                </button>
              )}
            </header>

            {/* View: HABITS */}
            {activeTab === 'habits' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

                {/* Progress Card */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-6 relative overflow-hidden flex-shrink-0">
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <p className="text-slate-400 font-bold text-xs mb-1 uppercase tracking-wide">Daily Progress</p>
                      <h2 className="text-4xl font-black text-slate-800">{progress}%</h2>
                      
                      {/* Interaction hint for watering */}
                      {canWater && (
                        <button 
                          onClick={() => setActiveTab('growth')}
                          className="mt-3 flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold animate-bounce shadow-lg shadow-blue-200"
                        >
                          <Droplets size={12} fill="white" />
                          Water Available!
                        </button>
                      )}
                    </div>
                    <div className="relative">
                        <ProgressBar percentage={progress} />
                        {progress === 100 && (
                          <div className="absolute inset-0 flex items-center justify-center text-teal-500">
                            <Check size={28} strokeWidth={4} />
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* To Do List */}
                <div className="flex justify-between items-end mb-2 px-2 flex-shrink-0">
                  <h3 className="text-xl font-bold text-teal-700">To Do</h3>
                  <span className="text-sm font-bold text-slate-400">{formattedDate}</span>
                </div>

                {daysHabits.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-300 mt-8">
                    <div className="w-16 h-16 mb-4 opacity-50 grayscale">
                        <PotatoMascot progress={0} isTalking={false} />
                    </div>
                    <p>No habits for today.</p>
                    <button onClick={() => setIsModalOpen(true)} className="mt-4 text-teal-600 font-bold text-lg hover:underline">Add one?</button>
                  </div>
                ) : (
                  Object.entries(groupedHabits).map(([category, categoryHabits]) => (
                    <div key={category} className="mb-6">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">{category}</h4>
                      <div className="space-y-3">
                        {(categoryHabits as Habit[]).map((habit) => (
                          <div
                            key={habit.id}
                            className={`group bg-white rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 border border-transparent hover:border-slate-100 hover:shadow-sm ${
                              habit.completed ? 'opacity-60' : ''
                            }`}
                          >
                            <button
                              onClick={() => toggleHabit(habit.id)}
                              className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                habit.completed
                                  ? 'bg-teal-500 border-teal-500 text-white'
                                  : 'border-slate-200 text-transparent hover:border-teal-400'
                              }`}
                            >
                              <Check size={16} strokeWidth={4} />
                            </button>

                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-lg font-bold truncate transition-all ${
                                  habit.completed ? 'text-slate-400 line-through decoration-2' : 'text-slate-700'
                                }`}
                              >
                                {habit.title}
                              </p>
                            </div>

                            {habit.link && (
                              <span className="hidden sm:flex items-center gap-1 bg-slate-50 text-slate-500 px-2 py-1 rounded-lg text-xs font-bold">
                                  <LinkIcon size={10} />
                                  Link
                              </span>
                            )}

                            <button
                              onClick={() => deleteHabit(habit.id)}
                              className="text-slate-200 hover:text-red-400 p-2 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* View: GROWTH */}
            {activeTab === 'growth' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-300 h-full flex flex-col">
                <PotatoField 
                  harvestCount={harvestCount}
                  currentStage={growthStage}
                  canWater={canWater}
                  hasWateredToday={hasWateredToday}
                  onWater={handleWater}
                />
              </div>
            )}
            
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-6 sm:pb-4 rounded-t-3xl flex justify-around items-center z-40">
           <button 
             onClick={() => setActiveTab('habits')}
             className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'habits' ? 'text-teal-600' : 'text-slate-300 hover:text-slate-500'}`}
           >
             <ListTodo size={24} strokeWidth={activeTab === 'habits' ? 3 : 2} />
             <span className="text-[10px] font-bold">Habits</span>
           </button>
           
           <button 
             onClick={() => setActiveTab('growth')}
             className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'growth' ? 'text-teal-600' : 'text-slate-300 hover:text-slate-500'}`}
           >
             <LayoutGrid size={24} strokeWidth={activeTab === 'growth' ? 3 : 2} />
             <span className="text-[10px] font-bold">Garden</span>
           </button>
        </div>

        <AddHabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addHabit}
        />
        
        <InstallPrompt />
      </div>
    </div>
  );
};

export default App;