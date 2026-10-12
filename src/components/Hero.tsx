import React from 'react';
import { Search, Sparkles, BookOpen, GraduationCap, Video, CheckCircle2, Crown, Smartphone } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExploreClick: () => void;
  onOpenQuizClick: () => void;
  onOpenTechnicalClick?: () => void;
  onOpenUniversityCourses?: () => void;
  onOpenPricingModal?: () => void;
  onOpenCreatorProfile?: () => void;
  theme?: 'dark' | 'light';
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onExploreClick,
  onOpenQuizClick,
  onOpenTechnicalClick,
  onOpenUniversityCourses,
  onOpenPricingModal,
  onOpenCreatorProfile,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  return (
    <section
      className={`relative overflow-hidden text-white pt-6 pb-8 px-3 sm:px-4 transition-colors duration-200 ${
        isDark
          ? 'bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-950'
          : 'bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-900'
      }`}
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-4 text-right relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            <span>تطبيق Android مخصص</span>
          </span>
          <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full text-[11px]">
            العام الدراسي 2026 / 2027
          </span>
          {onOpenCreatorProfile ? (
            <button
              type="button"
              onClick={onOpenCreatorProfile}
              title="عرض الملف التعريفي للمهندس عبد الله عبد الوهاب"
              className="text-amber-300 hover:text-amber-200 hover:underline font-bold text-[11px] cursor-pointer transition-colors"
            >
              تصميم Eng . Abdullah
            </button>
          ) : (
            <span className="text-amber-300 font-bold text-[11px]">تصميم Eng . Abdullah</span>
          )}
        </div>

        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div
            className={`p-1 rounded-full transition-all duration-300 shrink-0 ${
              theme === 'light'
                ? 'bg-white border-2 border-amber-500 shadow-md ring-2 ring-amber-100'
                : 'bg-slate-950 border-2 border-amber-400 shadow-xl ring-2 ring-slate-800'
            }`}
          >
            <img
              src="/images/eduzone_logo.jpg"
              alt="EduZone Emblem"
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/src/assets/images/eduzone_logo_1791585839173.jpg';
              }}
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
              EduZone التعليميه
            </h1>
            <p className="text-xs text-amber-300 font-semibold mt-0.5">
              الثانوية العامة والفنية · دبلوم التجارة · الكورسات والشروحات
            </p>
          </div>
        </div>

        {/* Short friendly mobile description */}
        <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
          تطبيقك المتكامل لملخصات الثانوية العامة (علمي وأدبي)، دبلوم التجارة والصنايع، كورسات اللغات والبرمجة والـ ICDL مع بنك أسئلة ذكي (1,135+ سؤال).
        </p>

        {/* Search Input Bar - Thumb Friendly */}
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مادة، كورس، ملخص، أو سؤال..."
            className="w-full pl-3 pr-10 py-2.5 bg-white text-slate-900 rounded-xl text-xs sm:text-sm font-semibold placeholder:text-slate-400 shadow-md focus:outline-hidden focus:ring-2 focus:ring-amber-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              مسح
            </button>
          )}
        </div>

        {/* Quick Quick-Action Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            onClick={onExploreClick}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shrink-0 shadow-xs transition-colors"
          >
            📚 تصفح الملخصات
          </button>
          {onOpenUniversityCourses && (
            <button
              onClick={onOpenUniversityCourses}
              className="px-3 py-1.5 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 border border-indigo-600 transition-colors flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>الكورسات والـ ICDL</span>
            </button>
          )}
          {onOpenTechnicalClick && (
            <button
              onClick={onOpenTechnicalClick}
              className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs shrink-0 border border-teal-600 transition-colors"
            >
              🛠️ الفني والتجاري
            </button>
          )}
          <button
            onClick={onOpenQuizClick}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>بنك الأسئلة (1,135+ سؤال)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
