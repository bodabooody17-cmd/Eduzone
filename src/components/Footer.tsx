import React from 'react';
import { BookOpen, GraduationCap, Heart, Mail } from 'lucide-react';

interface FooterProps {
  onSelectTrack: (track: any) => void;
  onOpenContact: () => void;
  onOpenTimer: () => void;
  onOpenCreatorProfile?: () => void;
  theme?: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTrack,
  onOpenContact,
  onOpenTimer,
  onOpenCreatorProfile,
  theme = 'dark',
}) => {
  return (
    <footer className="bg-slate-900 text-white mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-right">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-0.5 rounded-full transition-colors ${
                  theme === 'light'
                    ? 'bg-white border border-amber-400 shadow-sm'
                    : 'bg-slate-950 border border-amber-400/80 shadow-md ring-2 ring-slate-800'
                }`}
              >
                <img
                  src="/images/eduzone_logo.jpg"
                  alt="EduZone Logo"
                  className="w-9 h-9 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/src/assets/images/eduzone_logo_1791585839173.jpg';
                  }}
                />
              </div>
              <span className="text-lg font-black text-white">EduZone التعليميه</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              بوابتك الشاملة لملخصات الثانوية العامة ودبلوم التجارة والكورسات وبنك الأسئلة (EduZone التعليميه).
            </p>
            <div className="pt-1">
              {onOpenCreatorProfile ? (
                <button
                  type="button"
                  onClick={onOpenCreatorProfile}
                  title="عرض الملف التعريفي للمهندس عبد الله عبد الوهاب"
                  className="text-xs font-bold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/20 inline-block transition-colors cursor-pointer"
                >
                  تصميم Eng . Abdullah
                </button>
              ) : (
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 inline-block">
                  تصميم Eng . Abdullah
                </span>
              )}
            </div>
            <div className="pt-2 space-y-2">
              <a
                href="https://t.me/+2OhLLu7ofSoxNTNk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>جروب المنصه على التليجرام ↗</span>
              </a>
            </div>
          </div>

          {/* Quick Links Thanawya */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400">قسم الثانوية العامة</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onSelectTrack('thanawya_science')}
                  className="hover:text-white transition-colors"
                >
                  ملخصات الشعبة العلمية (فيزياء، كيمياء، أحياء)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTrack('thanawya_arts')}
                  className="hover:text-white transition-colors"
                >
                  ملخصات الشعبة الأدبية (تاريخ، جغرافيا، فلسفة)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTrack('languages')}
                  className="hover:text-white transition-colors"
                >
                  اللغات العربية والإنجليزية
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Commerce */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-emerald-400">قسم دبلوم التجارة</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onSelectTrack('commerce_diploma')}
                  className="hover:text-white transition-colors"
                >
                  المحاسبة المالية ومحاسبة الشركات
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTrack('commerce_diploma')}
                  className="hover:text-white transition-colors"
                >
                  الإحصاء ومبادئ الاقتصاد
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTrack('commerce_diploma')}
                  className="hover:text-white transition-colors"
                >
                  قوانين الأعمال والتأمينات (نظام 3 و 5 سنوات)
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Study Tools */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-indigo-400">أدوات المذاكرة</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={onOpenTimer}
                  className="hover:text-white transition-colors"
                >
                  مؤقت التركيز وبومودورو المذاكرة
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTrack('free_courses')}
                  className="hover:text-white transition-colors"
                >
                  سلسلة الفيديوهات والكورسات التأسيسية
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors"
                >
                  جروب المنصه وتواصل مع المنشئ
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom line matching user prompt */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>جميع الحقوق محفوظة &copy; 2026 - EduZone التعليميه</p>
          {onOpenCreatorProfile ? (
            <button
              type="button"
              onClick={onOpenCreatorProfile}
              title="عرض الملف التعريفي للمهندس عبد الله عبد الوهاب"
              className="text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>تصميم</span>
              <span className="underline underline-offset-2">Eng . Abdullah</span>
            </button>
          ) : (
            <p className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
              <span>تصميم</span>
              <span>Eng . Abdullah</span>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};
