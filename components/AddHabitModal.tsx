import React, { useState } from 'react';
import { X, Tag } from 'lucide-react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, category: string, link?: string) => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('日常');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, category);
      setTitle('');
      setCategory('日常');
      onClose();
    }
  };

  const categories = ['日常', '工作', '学习', '生活', '其他'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-end sm:items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">New Habit</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Habit Name</label>
            <input
              type="text"
              placeholder="Read for 30 mins"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <Tag size={16} /> Category
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
                    category === cat
                      ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-100'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-teal-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
                type="text"
                placeholder="Custom category..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl mt-4 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            Create Habit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;