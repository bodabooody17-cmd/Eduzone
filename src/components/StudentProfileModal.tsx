import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  ShieldCheck,
  Bookmark,
  LogOut,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Sun,
  Moon,
  Camera,
  Send,
  BookOpen,
  KeyRound,
  Trophy,
  Award,
  Zap,
  Star,
  ChevronLeft,
  Flame,
} from 'lucide-react';
import { StudentUser } from './AuthModal';
import { getStudentProgress, StudentProgress } from '../utils/gamification';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  savedCount: number;
  onOpenSavedModal: () => void;
  onOpenWhatsApp?: () => void;
  onOpenTelegram?: () => void;
  onOpenPricingModal: () => void;
  onOpenSupervisorDashboard?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onUpdateUser?: (updated: StudentUser) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAuthModal,
  onLogout,
  savedCount,
  onOpenSavedModal,
  onOpenWhatsApp,
  onOpenTelegram,
  onOpenPricingModal,
  onOpenSupervisorDashboard,
  theme = 'dark',
  onToggleTheme,
  onUpdateUser,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<StudentProgress>(getStudentProgress);
  const [showBadgesList, setShowBadgesList] = useState(false);

  useEffect(() => {
    setProgress(getStudentProgress());
    const handleProgressUpdate = (e: any) => {
      if (e.detail) {
        setProgress(e.detail);
      } else {
        setProgress(getStudentProgress());
      }
    };
    window.addEventListener('eduzone_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('eduzone_progress_updated', handleProgressUpdate);
  }, [isOpen]);

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const isSupervisor = currentUser?.role === 'supervisor';
  const isTeacher = currentUser?.role === 'teacher';

  // Handle Photo Change directly in profile
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 200;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          const updated: StudentUser = {
            ...currentUser,
            avatarUrl: dataUrl,
          };
          try {
            localStorage.setItem('eduzone_user', JSON.stringify(updated));
          } catch (err) {
            console.error(err);
          }
          if (onUpdateUser) {
            onUpdateUser(updated);
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn text-right">
      <div
        className={`w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh] transition-colors duration-200 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${
              isSupervisor ? 'bg-amber-600' : isTeacher ? 'bg-emerald-600' : 'bg-indigo-600'
            }`}>
              {isSupervisor ? (
                <ShieldCheck className="w-5 h-5 text-amber-200" />
              ) : isTeacher ? (
                <BookOpen className="w-5 h-5 text-emerald-200" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-white leading-tight">
                {currentUser
                  ? isSupervisor
                    ? 'الملف الشخصي للمشرف'
                    : isTeacher
                    ? 'الملف الشخصي للمعلم'
                    : 'الملف الشخصي للطالب'
                  : 'تسجيل دخول المستخدم'}
              </h3>
              <p className="text-xs text-indigo-300">
                EduZone التعليميه · تصميم Eng . Abdullah
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

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {currentUser ? (
            <>
              {/* Digital ID Card with Avatar */}
              <div
                className={`relative rounded-2xl text-white p-5 shadow-lg border overflow-hidden ${
                  isSupervisor
                    ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 border-amber-500/40'
                    : isTeacher
                    ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border-emerald-500/40'
                    : 'bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-950 border-indigo-700/50'
                }`}
              >
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3">
                    {/* User Avatar with change button */}
                    <div className="relative group shrink-0">
                      {currentUser.avatarUrl ? (
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentUser.name}
                          className="w-13 h-13 rounded-full object-cover border-2 border-amber-400 shadow-md ring-2 ring-white/20"
                        />
                      ) : (
                        <div className="w-13 h-13 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md ring-2 ring-white/30">
                          {currentUser.name.charAt(0)}
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="profile-avatar-update"
                      />
                      <label
                        htmlFor="profile-avatar-update"
                        title="تغيير الصورة الشخصية"
                        className="absolute -bottom-1 -left-1 w-6 h-6 bg-slate-900 border border-amber-400 text-amber-300 rounded-full flex items-center justify-center cursor-pointer shadow-xs hover:bg-slate-800 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </label>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isSupervisor ? (
                          <span className="text-[11px] font-bold text-amber-300 bg-amber-500/30 px-2 py-0.5 rounded-full border border-amber-400/40 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-400" />
                            <span>مشرف إداري معتمد</span>
                          </span>
                        ) : isTeacher ? (
                          <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/30 px-2 py-0.5 rounded-full border border-emerald-400/40 flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-emerald-400" />
                            <span>معلم معتمد 2026 / 2027</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/30 px-2 py-0.5 rounded-full border border-indigo-400/40">
                            طالب معتمد 2026 / 2027
                          </span>
                        )}
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-white mt-1">
                        {currentUser.name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-left text-[10px] text-slate-300 font-mono">
                    {isSupervisor ? 'ROLE: ADMIN' : isTeacher ? 'ROLE: TEACHER' : 'ROLE: STUDENT'}
                  </div>
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      {isSupervisor ? 'المسمى الإداري:' : isTeacher ? 'المادة التدريسية:' : 'المرحلة التعليمية:'}
                    </span>
                    <span className="font-bold text-slate-100">{currentUser.stage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">بيانات التواصل:</span>
                    <span className="font-bold text-slate-100 dir-ltr text-right truncate block">
                      {currentUser.contact}
                    </span>
                  </div>
                </div>
              </div>

              {/* 🌟 STUDENT POINTS & LEVEL PROGRESS DASHBOARD */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isDark
                    ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border-amber-500/30'
                    : 'bg-gradient-to-br from-amber-50/80 via-white to-indigo-50/50 border-amber-300 shadow-sm'
                }`}
              >
                {/* Level Title & XP header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-black text-sm">
                      <Trophy className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-amber-400">
                          {progress.levelTitle}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-md">
                          المستوى {progress.level}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        نظام نقاط التميز الأكاديمي
                      </div>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-base font-black text-amber-400 font-mono">
                      {progress.totalPoints}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold mr-1">نقطة XP</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>تقدم المستوى: {progress.progressPercent}%</span>
                    </span>
                    <span className="text-amber-400 font-mono text-[10px]">
                      {progress.totalPoints} / {progress.nextLevelXp} XP
                    </span>
                  </div>

                  {/* Gradient Progress Bar */}
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${Math.max(5, progress.progressPercent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>
                      باقي {Math.max(0, progress.nextLevelXp - progress.totalPoints)} نقطة للترقية
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      +{Math.round(progress.progressPercent)}% تم الإنجاز
                    </span>
                  </div>
                </div>

                {/* Stats Chips */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center">
                  <div className="p-1.5 rounded-lg bg-slate-950/40 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">مذكرات مقروءة</span>
                    <span className="text-xs font-black text-indigo-400 font-mono">
                      {progress.completedSummariesCount}
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-950/40 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">محاضرات مكتملة</span>
                    <span className="text-xs font-black text-emerald-400 font-mono">
                      {progress.completedLessonsCount}
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-950/40 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">أسئلة محلولة</span>
                    <span className="text-xs font-black text-amber-400 font-mono">
                      {progress.solvedQuizzesCount}
                    </span>
                  </div>
                </div>

                {/* How to earn points banner */}
                <div className="mt-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300/90 flex items-center justify-between flex-wrap gap-1">
                  <span>💡 <strong>كيف تجمع النقاط؟</strong> قراءة مذكرة (+50) · كورس فيديو (+80) · حل سؤال (+25) · تحميل PDF (+30)</span>
                </div>

                {/* Badges Accordion Toggle */}
                <button
                  type="button"
                  onClick={() => setShowBadgesList(!showBadgesList)}
                  className="w-full mt-2 text-[11px] font-bold text-slate-400 hover:text-white flex items-center justify-between pt-1 cursor-pointer"
                >
                  <span className="flex items-center gap-1 text-amber-400">
                    <Award className="w-3.5 h-3.5" />
                    <span>أوسمة وشارات الطالب ({progress.badges.filter((b) => b.unlocked).length} من {progress.badges.length})</span>
                  </span>
                  <span>{showBadgesList ? 'إخفاء ▲' : 'عرض الأوسمة ▼'}</span>
                </button>

                {showBadgesList && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 animate-fadeIn">
                    {progress.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className={`p-2 rounded-xl border flex items-center gap-2 text-right transition-all ${
                          badge.unlocked
                            ? 'bg-amber-500/15 border-amber-400/50 text-white'
                            : 'bg-slate-950/50 border-slate-800/80 text-slate-500 opacity-60'
                        }`}
                      >
                        <span className="text-lg shrink-0">{badge.icon}</span>
                        <div className="leading-tight">
                          <div className="text-[11px] font-bold flex items-center gap-1">
                            <span>{badge.name}</span>
                            {badge.unlocked && (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            )}
                          </div>
                          <div className="text-[9px] text-slate-400 line-clamp-1">
                            {badge.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SUPERVISOR DASHBOARD BUTTON (Prominent if supervisor) */}
              {isSupervisor && onOpenSupervisorDashboard && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenSupervisorDashboard();
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-98"
                >
                  <ShieldCheck className="w-5 h-5 text-slate-950" />
                  <span>فتح لوحة تحكم المشرفين وإرسال الإشعارات ⚡</span>
                </button>
              )}

              {/* If not supervisor, option to switch to supervisor with secret code */}
              {!isSupervisor && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuthModal();
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>الدخول كـ مشرف إداري للكتابة والنشر</span>
                </button>
              )}

              {/* Theme Preference Switch Row */}
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                  isDark
                    ? 'bg-slate-950/80 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isDark
                        ? 'bg-indigo-900/50 text-indigo-400'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold">
                      مظهر المنصة: {isDark ? 'الوضع الليلي' : 'الوضع النهاري'}
                    </div>
                    <div className="text-[10px] opacity-75">
                      اضغط للتبديل بين المظهرين
                    </div>
                  </div>
                </div>

                {onToggleTheme && (
                  <button
                    onClick={onToggleTheme}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isDark
                        ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isDark ? (
                      <>
                        <Sun className="w-3.5 h-3.5" />
                        <span>فاتح</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5" />
                        <span>غامق</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Quick Actions & Stats */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onOpenSavedModal();
                  }}
                  className={`p-3 border rounded-2xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-950/60 border-slate-800 hover:bg-slate-800'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <Bookmark className="w-5 h-5 text-indigo-500 mb-1" />
                  <span className="text-xs font-bold">المذكرات المحفوظة</span>
                  <span className="text-[11px] opacity-75 font-semibold">{savedCount} مذكرات</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenPricingModal();
                  }}
                  className={`p-3 border rounded-2xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 text-amber-300'
                      : 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-200 text-amber-900'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-amber-500 mb-1" />
                  <span className="text-xs font-bold">ترقية الحساب VIP</span>
                  <span className="text-[11px] opacity-80 font-semibold">باقة الشروحات</span>
                </button>
              </div>

              {/* Telegram Support Button */}
              <button
                onClick={() => {
                  onClose();
                  if (onOpenTelegram) onOpenTelegram();
                  else if (onOpenWhatsApp) onOpenWhatsApp();
                }}
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>جروب المنصه الرسمي على التليجرام</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج من الحساب</span>
              </button>
            </>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-xs ${
                  isDark
                    ? 'bg-indigo-950 border-2 border-indigo-700 text-indigo-400'
                    : 'bg-indigo-50 border-2 border-indigo-200 text-indigo-600'
                }`}
              >
                <User className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-black">
                  سجل دخولك إلى EduZone التعليميه
                </h4>
                <p className="text-xs opacity-75 max-w-xs mx-auto mt-1">
                  اختر التسجيل كـ طالب، أو معلم، أو مشرف إداري لبث الإشعارات ومتابعة المنصة.
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal();
                }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>تسجيل الدخول / إنشاء حساب</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
