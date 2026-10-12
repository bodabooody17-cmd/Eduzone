import React, { useState, useMemo } from 'react';
import { QUESTION_BANK, BankQuestion } from '../data/questionBankData';
import { awardPoints } from '../utils/gamification';
import { StudentUser } from './AuthModal';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Lock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MessageCircle,
  Filter,
  Check,
  Send,
  Search,
  Zap,
  User,
  ShieldAlert,
} from 'lucide-react';

interface InteractiveQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricingModal?: () => void;
  currentUser?: StudentUser | null;
  onOpenAuthModal?: () => void;
}

export const InteractiveQuizModal: React.FC<InteractiveQuizModalProps> = ({
  isOpen,
  onClose,
  onOpenPricingModal,
  currentUser,
  onOpenAuthModal,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [showOnlyFree, setShowOnlyFree] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [awardedXpIds, setAwardedXpIds] = useState<string[]>([]);
  const [xpBanner, setXpBanner] = useState<string | null>(null);

  // Filter questions based on subject & free/all filter & search
  const filteredQuestions = useMemo(() => {
    return QUESTION_BANK.filter((q) => {
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) {
        return false;
      }
      if (showOnlyFree && !q.isFree) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          q.question.toLowerCase().includes(query) ||
          q.subject.toLowerCase().includes(query) ||
          q.options.some((o) => o.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [selectedSubject, showOnlyFree, searchQuery]);

  const subjects = useMemo(() => {
    const list = Array.from(new Set(QUESTION_BANK.map((q) => q.subject)));
    return ['all', ...list];
  }, []);

  if (!isOpen) return null;

  const currentQuestion: BankQuestion | undefined = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (optIndex: number) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optIndex,
    }));
    setRevealedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));

    if (optIndex === currentQuestion.correctIndex && !awardedXpIds.includes(currentQuestion.id)) {
      setAwardedXpIds((prev) => [...prev, currentQuestion.id]);
      awardPoints(25, `حل سؤال صحيح في مادة ${currentQuestion.subject}`, 'quiz');
      setXpBanner(`🎉 إجابة صحيحة! حصلت على +25 نقطة XP.`);
      setTimeout(() => setXpBanner(null), 3500);
    }
  };

  const handleResetCurrent = () => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
    setRevealedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  // Calculate score on answered free questions
  const solvedCount = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).filter(([qId, ans]) => {
    const targetQ = QUESTION_BANK.find((q) => q.id === qId);
    return targetQ && targetQ.correctIndex === ans;
  }).length;

  const handleOpenTelegramUnlock = () => {
    window.open(
      'https://t.me/+2OhLLu7ofSoxNTNk',
      '_blank'
    );
  };

  if (!isOpen) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
        <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-md rounded-3xl p-6 shadow-2xl text-center space-y-5 my-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 inline-block">
              محتوى محمي بحساب الطالب
            </span>
            <h3 className="text-xl font-black text-white">
              بنك الأسئلة مقفل للمسجلين فقط
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
              للوصول إلى بنك الأسئلة التفاعلي الشامل (1,135+ سؤال لجميع المراحل الدراسية) وتتبع درجاتك ونقاط الخبرة XP، يجب تسجيل الدخول بحسابك أولاً.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 text-right text-xs space-y-2 text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>تسجيل دخول مجاني وسريع في ثوانٍ</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>حفظ تقدمك ودرجاتك ونقاط XP لكل مادة</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>تصحيح فوري وشروحات تفصيلية لكافة الأسئلة</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                if (onOpenAuthModal) onOpenAuthModal();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <User className="w-4 h-4" />
              <span>تسجيل الدخول / إنشاء حساب مجاناً</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              إلغاء والعودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] text-right">
        {/* Header - Compact for Mobile */}
        <div className="bg-slate-900 text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-black text-white leading-tight">
                  بنك الأسئلة والتدريبات الشامل (1,135+ سؤال)
                </h2>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-md">
                  100+ سؤال لكل مادة
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                تدريب تفاعلي فوري على أسئلة امتحانات الثانوية العامة ودبلوم التجارة مع نقاط XP
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floating XP Banner */}
        {xpBanner && (
          <div className="bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 px-3 py-1.5 text-center text-xs font-black shadow-md flex items-center justify-center gap-1.5 animate-bounce">
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{xpBanner}</span>
          </div>
        )}

        {/* Filter Bar - Compact chips & Search */}
        <div className="bg-slate-100/90 border-b border-slate-200 p-2.5 space-y-2 shrink-0">
          {/* Search & Score Tracker */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentIndex(0);
                }}
                placeholder="ابحث في الأسئلة أو المفاهيم..."
                className="w-full pl-3 pr-8 py-1.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>

            {/* Score Tracker */}
            <div className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shrink-0 flex items-center gap-1">
              <span>النتيجة:</span>
              <span className="text-emerald-600 font-mono font-black">{correctCount}</span>
              <span>/</span>
              <span className="font-mono">{solvedCount}</span>
            </div>
          </div>

          {/* Subject Pills (Scrollable horizontally) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {subjects.map((sub) => {
              const isActive = selectedSubject === sub;
              const countInSub = sub === 'all' ? QUESTION_BANK.length : QUESTION_BANK.filter((q) => q.subject === sub).length;
              const label = sub === 'all' ? `جميع المواد (${countInSub})` : `${sub} (${countInSub})`;
              return (
                <button
                  key={sub}
                  onClick={() => {
                    setSelectedSubject(sub);
                    setCurrentIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Viewer Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 bg-slate-50 space-y-4">
          {currentQuestion ? (
            /* INTERACTIVE QUESTION CARD */
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
              {/* Question Metadata Bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    سؤال {currentIndex + 1} من {filteredQuestions.length}
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[10px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>+25 نقطة XP</span>
                  </span>
                </div>
                <span className="font-black text-indigo-900 bg-indigo-50/60 px-2 py-0.5 rounded-md text-xs">
                  {currentQuestion.subject}
                </span>
              </div>

                {/* Question Text */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {currentQuestion.question}
                </h3>

                {/* Options List */}
                <div className="space-y-2 pt-1">
                  {currentQuestion.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQuestion.id] === optIdx;
                    const isRevealed = revealedAnswers[currentQuestion.id];
                    const isCorrect = optIdx === currentQuestion.correctIndex;

                    let btnClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

                    if (isRevealed) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'bg-red-50 border-red-400 text-red-950 ring-1 ring-red-400';
                      } else {
                        btnClass = 'bg-slate-50/50 border-slate-200 text-slate-400';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-right p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnClass}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                            {['أ', 'ب', 'ج', 'د'][optIdx]}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isRevealed && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {isRevealed && isSelected && !isCorrect && (
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Explanation Box */}
                {revealedAnswers[currentQuestion.id] && (
                  <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 text-xs leading-relaxed text-amber-950 space-y-1 animate-fadeIn">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>توضيح وقاعدة السؤال:</span>
                    </div>
                    <p className="text-amber-900 font-medium">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-500">
              لا توجد أسئلة تطابق بحثك في هذه المادة حالياً.
            </div>
          )}
        </div>

        {/* Footer Navigation - Compact Prev/Next for Phone */}
        <div className="bg-white px-3.5 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              <span>السابق</span>
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(filteredQuestions.length - 1, prev + 1)
                )
              }
              disabled={currentIndex >= filteredQuestions.length - 1}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
            >
              <span>التالي</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[11px] font-bold text-slate-500 tabular-nums">
            {currentIndex + 1} من {filteredQuestions.length}
          </span>

          <div className="flex items-center gap-1.5">
            {currentQuestion && revealedAnswers[currentQuestion.id] && (
              <button
                onClick={handleResetCurrent}
                title="إعادة حل هذا السؤال"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
