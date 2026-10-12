import React from 'react';
import { EducationalTrack, PlanFilter } from '../types';
import {
  Crown,
  Sparkles,
  CheckCircle,
  GraduationCap,
  BookOpen,
  Wrench,
  Video,
  HelpCircle,
  Calculator,
  Trophy,
} from 'lucide-react';

interface TrackTabsProps {
  activeTrack: EducationalTrack;
  onSelectTrack: (track: EducationalTrack) => void;
  activePlanFilter: PlanFilter;
  onSelectPlanFilter: (filter: PlanFilter) => void;
  onOpenPricingModal: () => void;
  counts: {
    all: number;
    thanawya_science: number;
    thanawya_arts: number;
    languages: number;
    commerce_diploma: number;
    technical_industrial: number;
    university_courses: number;
    free_courses: number;
  };
}

export const TrackTabs: React.FC<TrackTabsProps> = ({
  activeTrack,
  onSelectTrack,
  activePlanFilter,
  onSelectPlanFilter,
  onOpenPricingModal,
  counts,
}) => {
  // Independent Sections - Each section has its dedicated isolated view
  const tabs: { id: EducationalTrack; label: string; count?: number; icon: React.ReactNode }[] = [
    {
      id: 'all',
      label: 'الرئيسية الشاملة',
      count: counts.all,
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'thanawya_science',
      label: 'الثانوية العامة (علمي وأدبي)',
      count: counts.thanawya_science + counts.thanawya_arts + counts.languages,
      icon: <BookOpen className="w-3.5 h-3.5" />,
    },
    {
      id: 'technical_industrial',
      label: 'التعليم الفني والتجاري',
      count: counts.technical_industrial + counts.commerce_diploma,
      icon: <Wrench className="w-3.5 h-3.5" />,
    },
    {
      id: 'university_courses',
      label: 'الكورسات وسوق العمل',
      count: counts.university_courses,
      icon: <GraduationCap className="w-3.5 h-3.5" />,
    },
    {
      id: 'free_courses',
      label: 'الشروحات والفيديوهات',
      count: counts.free_courses,
      icon: <Video className="w-3.5 h-3.5" />,
    },
    {
      id: 'quiz_bank',
      label: 'بنك الأسئلة (1,135+ سؤال)',
      count: 1135,
      icon: <HelpCircle className="w-3.5 h-3.5" />,
    },
    {
      id: 'accounting_sandbox',
      label: 'المحاكي المحاسبي والقوانين',
      icon: <Calculator className="w-3.5 h-3.5" />,
    },
    {
      id: 'gamification_dashboard',
      label: 'نقاط الطالب والمستوى (XP)',
      icon: <Trophy className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-2.5 sm:p-3 space-y-2.5">
      {/* Upper bar: Track selectors - Horizontal scroll optimized for mobile thumbs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive =
            activeTrack === tab.id ||
            (tab.id === 'thanawya_science' &&
              (activeTrack === 'thanawya_arts' || activeTrack === 'languages')) ||
            (tab.id === 'technical_industrial' && activeTrack === 'commerce_diploma');

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTrack(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md tabular-nums ${
                  isActive ? 'bg-white/20 text-white font-black' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter by Free / All */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-slate-500 ml-1">عرض:</span>
          <button
            onClick={() => onSelectPlanFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              activePlanFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => onSelectPlanFilter('free')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              activePlanFilter === 'free'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            المجاني فقط
          </button>
        </div>

        {/* Telegram VIP shortcut */}
        <button
          onClick={onOpenPricingModal}
          className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>اشتراك VIP (تليجرام)</span>
        </button>
      </div>
    </div>
  );
};
