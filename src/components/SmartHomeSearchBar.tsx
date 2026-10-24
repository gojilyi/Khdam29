import React, { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, Mic } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SmartHomeSearchBar: React.FC = () => {
  const { openSmartDiagnosis, activeTab } = useApp();
  const [query, setQuery] = useState('');

  if (activeTab !== 'home') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openSmartDiagnosis(query.trim());
  };

  const handleOpenDirect = () => {
    openSmartDiagnosis(query.trim());
  };

  return (
    <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-30 pointer-events-auto animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#1E9B5C]/40 rounded-[12px] shadow-[0_4px_18px_rgba(10,77,46,0.14)] p-1.5 flex items-center gap-2 transition-shadow hover:shadow-[0_6px_22px_rgba(10,77,46,0.2)]"
      >
        {/* Sparkles Icon with Green Glow */}
        <div 
          onClick={handleOpenDirect}
          className="w-10 h-10 rounded-[8px] bg-[#EEF6F1] text-[#0F6B3F] flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#DDE3DF] transition-colors"
          title="مساعد التشخيص الذكي"
        >
          <Sparkles className="w-5 h-5" strokeWidth={1.75} />
        </div>

        {/* Input Text Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleOpenDirect}
          placeholder="اوصف مشكلتك... مثال: الماء يتسرب من تحت الحوض"
          className="flex-1 min-w-0 bg-transparent text-[13px] sm:text-[14px] text-[#1C2421] placeholder:text-[#5B6660]/75 focus:outline-none px-1"
        />

        {/* Action Button */}
        <button
          type="submit"
          className="h-10 px-3.5 bg-[#0F6B3F] hover:bg-[#0A4D2E] text-white rounded-[8px] text-[13px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
        >
          <span>شخّص</span>
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </form>
    </div>
  );
};
