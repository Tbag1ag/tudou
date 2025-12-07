import React from 'react';

interface DateStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const DateStrip: React.FC<DateStripProps> = ({ selectedDate, onSelectDate }) => {
  // Generate a range of dates (e.g., current week)
  const generateDates = () => {
    const dates = [];
    // Start from 3 days ago
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - 2); // Show a rolling window centered-ish

    for (let i = 0; i < 5; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const dates = generateDates();

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex justify-between items-center mb-6 overflow-x-auto no-scrollbar py-2">
      {dates.map((date, index) => {
        const isSelected = isSameDay(date, selectedDate);
        return (
          <button
            key={index}
            onClick={() => onSelectDate(date)}
            className={`flex flex-col items-center justify-center min-w-[3.5rem] h-16 rounded-2xl transition-all duration-200 ${
              isSelected
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-200 scale-105'
                : 'bg-white text-slate-400 hover:bg-slate-50'
            }`}
          >
            <span className="text-xs font-bold uppercase mb-1">{days[date.getDay()]}</span>
            <span className={`text-lg font-extrabold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
              {date.getDate()}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DateStrip;
