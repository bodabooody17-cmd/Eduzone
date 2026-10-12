import React from 'react';
import { Home, BookOpen, Video, HelpCircle, User, CheckCircle2 } from 'lucide-react';
import { EducationalTrack } from '../types';

interface MobileBottomNavProps {
  activeTab: 'home' | 'summaries' | 'courses' | 'quiz' | 'profile';
  onSelectNavTab: (tab: 'home' | 'summaries' | 'courses' | 'quiz' | 'profile') => void;
  currentUser: { name: string; contact: string; stage: string; avatarUrl?: string; role?: string } | null;
  savedCount: number;
  theme?: 'dark' | 'light';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectNavTab,
  currentUser,
  savedCount,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  return (
    <nav
      aria-label="شريط التنقل السفلي للهواتف الذكية"
      className={`fixed bottom-0 inset-x-0 z-40 backdrop-blur-md py-1.5 px-2 max-w-[480px] mx-auto transition-colors duration-200 ${
        isDark
          ? 'bg-slate-900/95 border-t border-slate-800 shadow-[0_-4px_25px_rgba(0,0,0,0.6)] text-slate-300'
          : 'bg-white/95 border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] text-slate-700'
      }`}
    >
      <div className="flex items-center justify-around">
        {/* 1. الرئيسية */}
        <button
          onClick={() => onSelectNavTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'home'
              ? isDark
                ? 'text-amber-400 font-bold scale-105'
                : 'text-indigo-600 font-bold scale-105'
              : isDark
              ? 'text-slate-400 hover:text-slate-200 font-medium'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {activeTab === 'home' && (
              <span
                className={`absolute -bottom-1 inset-x-0 mx-auto w-1.5 h-1.5 rounded-full ${
                  isDark ? 'bg-amber-400' : 'bg-indigo-600'
                }`}
              />
            )}
          </div>
          <span className="text-[11px] mt-0.5">الرئيسية</span>
        </button>

        {/* 2. الملخصات والمذكرات */}
        <button
          onClick={() => onSelectNavTab('summaries')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 relative cursor-pointer ${
            activeTab === 'summaries'
              ? isDark
                ? 'text-amber-400 font-bold scale-105'
                : 'text-indigo-600 font-bold scale-105'
              : isDark
              ? 'text-slate-400 hover:text-slate-200 font-medium'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <BookOpen className="w-5 h-5" />
            {savedCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                  isDark ? 'bg-amber-400' : 'bg-indigo-600'
                }`}
              />
            )}
            {activeTab === 'summaries' && (
              <span
                className={`absolute -bottom-1 inset-x-0 mx-auto w-1.5 h-1.5 rounded-full ${
                  isDark ? 'bg-amber-400' : 'bg-indigo-600'
                }`}
              />
            )}
          </div>
          <span className="text-[11px] mt-0.5">الملخصات</span>
        </button>

        {/* 3. الكورسات والشروحات */}
        <button
          onClick={() => onSelectNavTab('courses')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'courses'
              ? isDark
                ? 'text-amber-400 font-bold scale-105'
                : 'text-indigo-600 font-bold scale-105'
              : isDark
              ? 'text-slate-400 hover:text-slate-200 font-medium'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <Video className="w-5 h-5" />
            {activeTab === 'courses' && (
              <span
                className={`absolute -bottom-1 inset-x-0 mx-auto w-1.5 h-1.5 rounded-full ${
                  isDark ? 'bg-amber-400' : 'bg-indigo-600'
                }`}
              />
            )}
          </div>
          <span className="text-[11px] mt-0.5">الكورسات</span>
        </button>

        {/* 4. بنك الأسئلة (500 سؤال) */}
        <button
          onClick={() => onSelectNavTab('quiz')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'quiz'
              ? isDark
                ? 'text-amber-400 font-bold scale-105'
                : 'text-indigo-600 font-bold scale-105'
              : isDark
              ? 'text-slate-400 hover:text-slate-200 font-medium'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <HelpCircle className="w-5 h-5" />
            {activeTab === 'quiz' && (
              <span
                className={`absolute -bottom-1 inset-x-0 mx-auto w-1.5 h-1.5 rounded-full ${
                  isDark ? 'bg-amber-400' : 'bg-indigo-600'
                }`}
              />
            )}
          </div>
          <span className="text-[11px] mt-0.5">الأسئلة</span>
        </button>

        {/* 5. حسابي / الطالب */}
        <button
          onClick={() => onSelectNavTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'profile'
              ? isDark
                ? 'text-amber-400 font-bold scale-105'
                : 'text-indigo-600 font-bold scale-105'
              : isDark
              ? 'text-slate-400 hover:text-slate-200 font-medium'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            {currentUser ? (
              currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-amber-400"
                />
              ) : (
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    isDark
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {currentUser.name.charAt(0)}
                </div>
              )
            ) : (
              <User className="w-5 h-5" />
            )}
            {activeTab === 'profile' && (
              <span
                className={`absolute -bottom-1 inset-x-0 mx-auto w-1.5 h-1.5 rounded-full ${
                  isDark ? 'bg-amber-400' : 'bg-indigo-600'
                }`}
              />
            )}
          </div>
          <span className="text-[11px] mt-0.5 truncate max-w-[50px]">
            {currentUser ? 'حسابي' : 'دخول'}
          </span>
        </button>
      </div>
    </nav>
  );
};