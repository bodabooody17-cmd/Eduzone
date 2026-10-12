import React from 'react';
import {
  BookOpen,
  Bookmark,
  Clock,
  MessageCircle,
  HelpCircle,
  Bell,
  User,
  LogOut,
  Smartphone,
  Sun,
  Moon,
  ShieldCheck,
  KeyRound,
  Send,
  Zap,
  Trophy,
} from 'lucide-react';
import { StudentUser } from './AuthModal';
import { StudentProgress } from '../utils/gamification';

interface HeaderProps {
  activeTrack: string;
  onSelectTrack: (track: any) => void;
  savedCount: number;
  onOpenSavedModal: () => void;
  onOpenTimerModal: () => void;
  onOpenContactModal: () => void;
  onOpenQuizModal: () => void;
  onOpenNotifications: () => void;
  onOpenPricingModal?: () => void;
  currentUser?: StudentUser | null;
  studentProgress?: StudentProgress;
  onOpenAuthModal?: (role?: 'student' | 'teacher' | 'supervisor') => void;
  onOpenProfile?: () => void;
  onOpenSupervisorDashboard?: () => void;
  onLogout?: () => void;
  unreadNotificationsCount?: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenCreatorProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTrack,
  onSelectTrack,
  savedCount,
  onOpenSavedModal,
  onOpenTimerModal,
  onOpenContactModal,
  onOpenQuizModal,
  onOpenNotifications,
  currentUser,
  studentProgress,
  onOpenAuthModal,
  onOpenProfile,
  onOpenSupervisorDashboard,
  onLogout,
  unreadNotificationsCount = 3,
  theme = 'dark',
  onToggleTheme,
  onOpenCreatorProfile,
}) => {
  const isDark = theme === 'dark';
  const isSupervisor = currentUser?.role === 'supervisor';

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 w-full max-w-full overflow-hidden ${
        isDark
          ? 'bg-slate-900/95 border-slate-800 text-white shadow-md'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-2xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2.5 w-full">
        {/* ========================================================= */}
        {/* MOBILE VIEW (< sm): Symmetrical, Centered & Guaranteed Zero Overflow */}
        {/* ========================================================= */}
        <div className="flex sm:hidden items-center justify-between w-full gap-1">
          {/* Start (Right in RTL): User Login / Profile button */}
          <div className="flex items-center gap-1 shrink-0 min-w-0">
            {currentUser ? (
              <button
                onClick={onOpenProfile || (() => onOpenAuthModal && onOpenAuthModal())}
                className={`flex items-center gap-1.5 p-1 rounded-xl border transition-colors cursor-pointer ${
                  isSupervisor
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                    : currentUser.role === 'teacher'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-950'
                }`}
                title="الملف الشخصي"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-amber-400"
                  />
                ) : (
                  <div
                    className={`w-7 h-7 rounded-full font-black text-xs flex items-center justify-center ${
                      isSupervisor
                        ? 'bg-amber-400 text-slate-950'
                        : currentUser.role === 'teacher'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-indigo-500 text-white'
                    }`}
                  >
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                {isSupervisor && (
                  <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1 py-0.2 rounded">
                    إشراف
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => onOpenAuthModal && onOpenAuthModal()}
                className="px-2 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <User className="w-3.5 h-3.5" />
                <span>دخول</span>
              </button>
            )}

            {/* Supervisor direct button if supervisor */}
            {isSupervisor && onOpenSupervisorDashboard && (
              <button
                onClick={onOpenSupervisorDashboard}
                title="لوحة الإشراف"
                className="p-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Center: Brand Logo & Title - Fully Centered */}
          <div className="flex-1 flex justify-center items-center min-w-0 px-1">
            <button
              onClick={() => onSelectTrack('all')}
              className="flex items-center justify-center gap-1.5 focus:outline-hidden cursor-pointer max-w-full text-center"
            >
              <div
                className={`p-0.5 rounded-full transition-all shrink-0 ${
                  theme === 'light'
                    ? 'bg-white border-2 border-amber-500 shadow-xs'
                    : 'bg-slate-950 border-2 border-amber-400 shadow-md ring-1 ring-slate-800'
                }`}
              >
                <img
                  src="/images/eduzone_logo.jpg"
                  alt="EduZone Logo"
                  className="w-7 h-7 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/src/assets/images/eduzone_logo_1791585839173.jpg';
                  }}
                />
              </div>

              <div className="leading-tight text-center min-w-0">
                <div className="flex items-center justify-center gap-1">
                  <span
                    className={`text-xs font-black truncate ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    EduZone التعليميه
                  </span>
                </div>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenCreatorProfile) onOpenCreatorProfile();
                  }}
                  title="عرض الملف التعريفي للمهندس عبد الله عبد الوهاب"
                  className="text-[9px] font-bold text-amber-400 block truncate hover:underline hover:text-amber-300 cursor-pointer"
                >
                  تصميم Eng . Abdullah
                </span>
              </div>
            </button>
          </div>

          {/* End (Left in RTL): Telegram, Saved Bookmarks, Notification Bell & Theme Toggle */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Telegram Direct Group Link */}
            <a
              href="https://t.me/+2OhLLu7ofSoxNTNk"
              target="_blank"
              rel="noopener noreferrer"
              title="جروب المنصة على التليجرام"
              className="p-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-400/30 text-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </a>

            {/* Saved Bookmarks */}
            <button
              onClick={onOpenSavedModal}
              title="المذكرات المحفوظة"
              className={`relative p-1.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[8px] font-black px-1 rounded-full tabular-nums">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              title="الإشعارات"
              className={`relative p-1.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-indigo-400" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 rounded-full tabular-nums animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title={isDark ? 'التحويل للوضع الفاتح' : 'التحويل للوضع الليلي'}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
                  isDark
                    ? 'bg-slate-800 text-amber-300 border border-slate-700'
                    : 'bg-slate-100 text-indigo-700 border border-slate-200'
                }`}
              >
                {isDark ? (
                  <Sun className="w-3.5 h-3.5 fill-amber-400/20 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 fill-indigo-600/20 text-indigo-600" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* DESKTOP & TABLET VIEW (sm:flex): Full wide bar with all tools */}
        {/* ========================================================= */}
        <div className="hidden sm:flex items-center justify-between gap-3 w-full">
          {/* Brand Wordmark with EduZone Logo & Android Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectTrack('all')}
              className="text-right group flex items-center gap-2 focus:outline-hidden rounded-lg p-0.5 cursor-pointer"
            >
              <div
                className={`p-1 rounded-full transition-all duration-300 ${
                  theme === 'light'
                    ? 'bg-white border-2 border-amber-500 shadow-sm ring-1 ring-amber-100'
                    : 'bg-slate-950 border-2 border-amber-400 shadow-md ring-2 ring-slate-800'
                }`}
              >
                <img
                  src="/images/eduzone_logo.jpg"
                  alt="EduZone Logo"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.currentTarget.src = '/src/assets/images/eduzone_logo_1791585839173.jpg';
                  }}
                />
              </div>

              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-sm sm:text-base font-black transition-colors ${
                      isDark
                        ? 'text-white group-hover:text-amber-400'
                        : 'text-slate-900 group-hover:text-indigo-600'
                    }`}
                  >
                    EduZone التعليميه
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold px-1.5 py-0.2 rounded-md border border-emerald-500/30">
                    Android
                  </span>
                </div>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenCreatorProfile) onOpenCreatorProfile();
                  }}
                  title="عرض الملف التعريفي للمهندس عبد الله عبد الوهاب"
                  className="text-[10px] font-bold text-amber-500 block hover:underline hover:text-amber-400 cursor-pointer"
                >
                  تصميم Eng . Abdullah
                </span>
              </div>
            </button>
          </div>

          {/* Quick Action & Utility Triggers */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* SUPERVISOR DASHBOARD BUTTON */}
            {isSupervisor && onOpenSupervisorDashboard && (
              <button
                onClick={onOpenSupervisorDashboard}
                title="فتح لوحة تحكم المشرفين وكتابة الإشعارات"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md border border-amber-400/50 cursor-pointer transition-all animate-pulse"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>لوحة الإشراف</span>
              </button>
            )}

            {/* Quick Supervisor Login shortcut if not logged in */}
            {!currentUser && onOpenAuthModal && (
              <button
                onClick={() => onOpenAuthModal('supervisor')}
                title="دخول المشرف الإداري"
                className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-xl border border-dashed border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-[11px] font-bold cursor-pointer transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>دخول إشراف</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title={isDark ? 'التحويل للوضع الفاتح' : 'التحويل للوضع الليلي'}
                className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-indigo-700 border border-slate-200'
                }`}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 fill-amber-400/20 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 fill-indigo-600/20 text-indigo-600" />
                )}
              </button>
            )}

            {/* User Auth / Profile Button */}
            {currentUser ? (
              <button
                onClick={onOpenProfile || (() => onOpenAuthModal && onOpenAuthModal())}
                className={`flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  isSupervisor
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 hover:bg-amber-500/25'
                    : currentUser.role === 'teacher'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/25'
                    : isDark
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                    : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-950'
                }`}
                title="الملف الشخصي"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-amber-400 shadow-xs"
                  />
                ) : (
                  <div className={`w-7 h-7 rounded-full font-black text-xs flex items-center justify-center shadow-xs ${
                    isSupervisor
                      ? 'bg-amber-400 text-slate-950'
                      : currentUser.role === 'teacher'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-indigo-500 text-white'
                  }`}>
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="leading-tight text-right">
                  <span className="font-bold block max-w-[110px] truncate text-[11px]">
                    {currentUser.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] font-semibold block ${
                      isSupervisor ? 'text-amber-400' : currentUser.role === 'teacher' ? 'text-emerald-400' : 'text-indigo-400'
                    }`}>
                      {isSupervisor ? 'مشرف المنصة' : currentUser.role === 'teacher' ? 'معلم معتمد' : 'طالب نشط'}
                    </span>
                    {!isSupervisor && studentProgress && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-mono font-bold flex items-center gap-0.5 border border-amber-400/30">
                        <Zap className="w-2 h-2 text-amber-400 fill-amber-400" />
                        <span>{studentProgress.totalPoints} XP</span>
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuthModal && onOpenAuthModal()}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>دخول</span>
              </button>
            )}

            {/* Notification Bell with unread counter */}
            <button
              onClick={onOpenNotifications}
              title="الإشعارات الفورية"
              className={`relative p-2 rounded-xl transition-colors text-xs font-semibold cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Bell className="w-4 h-4 text-indigo-500" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full tabular-nums animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Saved Bookmarks Button */}
            <button
              onClick={onOpenSavedModal}
              title="المذكرات المحفوظة"
              className={`relative p-2 rounded-xl transition-colors text-xs font-semibold cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-bold px-1 rounded-full tabular-nums">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Study Timer Quick Trigger */}
            <button
              onClick={onOpenTimerModal}
              title="مؤقت المذاكرة والتركيز"
              className={`p-2 rounded-xl transition-colors text-xs font-semibold cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Clock className="w-4 h-4 text-emerald-500" />
            </button>

            {/* Interactive Exam Bank Modal */}
            <button
              onClick={onOpenQuizModal}
              title="بنك الأسئلة الشامل (1,135 سؤال)"
              className={`p-2 rounded-xl transition-colors text-xs font-semibold cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-purple-400" />
            </button>

            {/* Telegram Group Direct Link */}
            <a
              href="https://t.me/+2OhLLu7ofSoxNTNk"
              target="_blank"
              rel="noopener noreferrer"
              title="جروب المنصة على التليجرام"
              className="p-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-400/30 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden md:inline font-bold">جروب التليجرام</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
