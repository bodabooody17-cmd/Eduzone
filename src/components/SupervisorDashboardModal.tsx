import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Send,
  Bell,
  Trash2,
  Sparkles,
  ExternalLink,
  MessageCircle,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Volume2,
  Newspaper,
  Layers,
  Flame,
  Radio,
  BookOpen,
  Trophy,
  Award,
  Zap,
  Star,
  Gift,
  Download,
  Archive,
} from 'lucide-react';
import { StudentUser } from './AuthModal';
import { EducationalNotification } from './NotificationCenter';
import { playNotificationChime } from '../utils/notificationAudio';
import { awardPoints, getStudentProgress, LEVEL_DEFINITIONS } from '../utils/gamification';

interface SupervisorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser | null;
  onNotificationSent?: (notification: EducationalNotification) => void;
  theme?: 'dark' | 'light';
}

export const SupervisorDashboardModal: React.FC<SupervisorDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNotificationSent,
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'send' | 'history' | 'news' | 'rewards' | 'export'>('send');

  // New Notification Form States
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'update' | 'reminder' | 'whatsapp'>('update');
  const [targetAudience, setTargetAudience] = useState('جميع الطلاب في المنصة');
  const [actionUrl, setActionUrl] = useState('');
  const [playChime, setPlayChime] = useState(true);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // New Urgent News item
  const [newsText, setNewsText] = useState('');
  const [newsCategory, setNewsCategory] = useState('عاجل من الإدارة');

  // Bonus Points Distribution
  const [bonusPoints, setBonusPoints] = useState<number>(100);
  const [bonusReason, setBonusReason] = useState<string>('مكافأة اجتهاد من إدارة EduZone بمناسبة مراجعات ليلة الامتحان');
  const studentStats = getStudentProgress();

  // Existing Notifications in Storage
  const [notificationsList, setNotificationsList] = useState<EducationalNotification[]>(() => {
    try {
      const stored = localStorage.getItem('edu_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  // Handle Send Notification
  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    const newNotif: EducationalNotification = {
      id: `supervisor-${Date.now()}`,
      title: notifTitle.trim(),
      message: `${notifMessage.trim()}${targetAudience !== 'جميع الطلاب في المنصة' ? ` [موجه إلى: ${targetAudience}]` : ''}`,
      time: 'الآن (مرسل من المشرف)',
      read: false,
      type: notifType,
      actionUrl: actionUrl.trim() || undefined,
    };

    try {
      // 1. Get current notifications from storage
      const existing: EducationalNotification[] = (() => {
        try {
          const s = localStorage.getItem('edu_notifications');
          return s ? JSON.parse(s) : [];
        } catch {
          return [];
        }
      })();

      const updated = [newNotif, ...existing];
      localStorage.setItem('edu_notifications', JSON.stringify(updated));
      setNotificationsList(updated);

      // 2. Play sound chime
      if (playChime) {
        playNotificationChime();
      }

      // 3. Broadcast to all open tabs / components
      window.dispatchEvent(
        new CustomEvent('eduzone_new_notification', { detail: newNotif })
      );

      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('eduzone_live_channel');
        bc.postMessage({ type: 'NEW_NOTIFICATION', data: newNotif });
        bc.close();
      }

      if (onNotificationSent) {
        onNotificationSent(newNotif);
      }

      // Reset Form & Show Success
      setNotifTitle('');
      setNotifMessage('');
      setActionUrl('');
      setSuccessBanner('تم بث الإشعار بنجاح لجميع طلاب المنصة!');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Grant Bonus Points to Students
  const handleGrantBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (bonusPoints <= 0) return;

    // 1. Award to student progress
    awardPoints(bonusPoints, bonusReason, 'bonus');

    // 2. Create broadcast notification
    const bonusNotif: EducationalNotification = {
      id: `supervisor-bonus-${Date.now()}`,
      title: `🎉 مكافأة نقاط إدارية (+${bonusPoints} XP)`,
      message: `${bonusReason} - تم إضافة ${bonusPoints} نقطة إلى رصيد نقاطك ومستواك في المنصة!`,
      time: 'الآن (مكافأة الإدارة)',
      read: false,
      type: 'update',
    };

    try {
      const existing = JSON.parse(localStorage.getItem('edu_notifications') || '[]');
      const updated = [bonusNotif, ...existing];
      localStorage.setItem('edu_notifications', JSON.stringify(updated));
      setNotificationsList(updated);

      if (playChime) playNotificationChime();

      window.dispatchEvent(
        new CustomEvent('eduzone_new_notification', { detail: bonusNotif })
      );

      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('eduzone_live_channel');
        bc.postMessage({ type: 'NEW_NOTIFICATION', data: bonusNotif });
        bc.close();
      }

      setSuccessBanner(`تم منح ${bonusPoints} نقطة XP وبث إشعار المكافأة لجميع الطلاب بنجاح!`);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete notification
  const handleDeleteNotif = (id: string) => {
    const updated = notificationsList.filter((n) => n.id !== id);
    setNotificationsList(updated);
    try {
      localStorage.setItem('edu_notifications', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('eduzone_notifications_updated', { detail: updated }));
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Publish Urgent News Ticker
  const handlePublishNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsText.trim()) return;

    try {
      const customNews = {
        id: `news-${Date.now()}`,
        title: newsText.trim(),
        category: newsCategory,
        date: 'اليوم',
        summary: `تنويه رسمي صادر من إدارة المنصة بتاريخ ${new Date().toLocaleDateString('ar-EG')}`,
        source: currentUser?.name || 'إشراف EduZone',
        isHot: true,
      };

      const existingNews = (() => {
        try {
          const stored = localStorage.getItem('eduzone_custom_news');
          return stored ? JSON.parse(stored) : [];
        } catch {
          return [];
        }
      })();

      const updatedNews = [customNews, ...existingNews];
      localStorage.setItem('eduzone_custom_news', JSON.stringify(updatedNews));
      window.dispatchEvent(new CustomEvent('eduzone_news_updated', { detail: updatedNews }));

      setNewsText('');
      setSuccessBanner('تم نشر الخبر العاجل في شريط الأخبار بنجاح!');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-right">
      <div
        className={`w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh] transition-colors duration-200 ${
          isDark
            ? 'bg-slate-900 border-amber-500/30 text-white'
            : 'bg-white border-amber-400 text-slate-900'
        }`}
      >
        {/* Header - Gold / Amber Theme */}
        <div className="bg-gradient-to-r from-slate-950 via-amber-950/80 to-slate-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  لوحة تحكم المشرفين والإدارة
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  إدارة معتمدة
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                مساحة إدارية لبث الإشعارات الفورية ونشر الأخبار لجميع طلاب EduZone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Supervisor Info Bar */}
        <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt="المشرف"
                className="w-7 h-7 rounded-full object-cover border border-amber-400"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs">
                {currentUser?.name?.charAt(0) || 'م'}
              </div>
            )}
            <span className="font-bold text-amber-300">
              المشرف النشط: {currentUser?.name || 'مشرف المنصة'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-300 font-semibold">
            <span className="flex items-center gap-1 text-emerald-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>البث الفوري نشط</span>
            </span>
            <span className="text-slate-400">|</span>
            <span>الإشعارات المسجلة: {notificationsList.length}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'send'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>كتابة وإرسال إشعار فوري</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>إدارة وسجل الإشعارات ({notificationsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs ${
              activeTab === 'news'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>شريط الأخبار</span>
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs ${
              activeTab === 'rewards'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>نقاط الطلاب 🏆</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs ${
              activeTab === 'export'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>كود Vercel (ZIP) 📦</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {successBanner && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* TAB 1: Send Notification Form */}
          {activeTab === 'send' && (
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-300/90 leading-relaxed">
                💡 بمجرد الضغط على <strong>"إرسال وبث الإشعار"</strong>، سيظهر التنبيه فوراً لجميع الطلاب المتواجدين داخل المنصة مع نغمة صوتية وتحديث شارة الجرس تلقائياً.
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200">
                  عنوان الإشعار الرئيسي:
                </label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="مثال: هام لطلاب الثانوية العامة ودبلوم التجارة"
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              {/* Message Details Input */}
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200">
                  نص وتفاصيل الإشعار:
                </label>
                <textarea
                  required
                  rows={3}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="اكتب هنا تفاصيل المذكرات الجديدة، مواعيد المراجعات، أو أي تنبيه عاجل للطلاب..."
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              {/* 2-Columns Settings: Type & Target Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Type */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-200">
                    نوع وتصنيف الإشعار:
                  </label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                      isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="update">📚 تحديث مذكرات ومراجعات (Update)</option>
                    <option value="reminder">🚨 تنبيه هام ومواعيد هامة (Reminder)</option>
                    <option value="whatsapp">💬 رابط وتواصل تليجرام (Telegram)</option>
                  </select>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-200">
                    الفئة المستهدفة:
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                      isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="جميع الطلاب في المنصة">👥 جميع الطلاب في المنصة</option>
                    <option value="الثانوية العامة - الشعبة العلمية">🔬 الثانوية العامة - علمي</option>
                    <option value="الثانوية العامة - الشعبة الأدبية">📖 الثانوية العامة - أدبي</option>
                    <option value="دبلوم التجارة نظام 3 و 5 سنوات">💼 طلاب دبلوم التجارة</option>
                    <option value="طلاب الكورسات والمحاسبة">🎓 كورسات المحاسبة واللغات</option>
                  </select>
                </div>
              </div>

              {/* Optional Action URL */}
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200 flex items-center justify-between">
                  <span>رابط خارجي اختياري (انتقال فوري للرابط):</span>
                  <span className="text-[10px] text-slate-400 font-normal">اختياري</span>
                </label>
                <input
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="https://t.me/+2OhLLu7ofSoxNTNk أو رابط تحميل مباشر"
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              {/* Audio Chime Toggle */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
                <input
                  type="checkbox"
                  id="playChimeToggle"
                  checked={playChime}
                  onChange={(e) => setPlayChime(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="playChimeToggle" className="cursor-pointer flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>تشغيل نغمة تنبيه صوتية لطيفة فور الإرسال للطلاب</span>
                </label>
              </div>

              {/* Send Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>إرسال وبث الإشعار الفوري لجميع الطلاب الآن</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Notification History & Management */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>سجل الإشعارات المرسلة ({notificationsList.length})</span>
                <span className="text-[11px] text-slate-400">يمكنك حذف أو متابعة حالة أي إشعار</span>
              </div>

              {notificationsList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">لا توجد إشعارات حالية، يمكنك كتابة إشعارك الأول من التبويب أعلاه.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notificationsList.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            notif.type === 'whatsapp'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : notif.type === 'reminder'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-indigo-500/20 text-indigo-400'
                          }`}
                        >
                          {notif.type === 'whatsapp' ? (
                            <MessageCircle className="w-4 h-4" />
                          ) : notif.type === 'reminder' ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {notif.message}
                          </p>
                          {notif.actionUrl && (
                            <a
                              href={notif.actionUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline pt-0.5"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>رابط مرفق بالإشعار</span>
                            </a>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteNotif(notif.id)}
                        title="حذف الإشعار من المنصة"
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Urgent News Ticker Publishing */}
          {activeTab === 'news' && (
            <form onSubmit={handlePublishNews} className="space-y-4">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-300 leading-relaxed">
                📰 يتيح لك هذا القسم إضافة تنويه عاجل يظهر مباشرة في الشريط الإخباري العلوي المتحرك لجميع الطلاب في EduZone.
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200">
                  تصنيف الخبر:
                </label>
                <select
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="عاجل من الإدارة">🚨 عاجل من الإدارة</option>
                  <option value="جدول الامتحانات">📅 جدول الامتحانات</option>
                  <option value="مذكرات جديدة">📚 مذكرات ليلة الامتحان</option>
                  <option value="مسابقات وجوائز">🏆 مسابقات EduZone</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200">
                  نص الخبر الإخباري العاجل:
                </label>
                <textarea
                  required
                  rows={3}
                  value={newsText}
                  onChange={(e) => setNewsText(e.target.value)}
                  placeholder="مثال: تم إتاحة نماذج امتحانات البابل شيت 2026 لمادة الفيزياء والمحاسبة المالية مجاناً لجميع الطلاب..."
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>نشر الخبر في الشريط الإخباري بالمنصة</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: Student Points & Rewards Management */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-amber-500/15 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>لوحة تحكم نقاط ومستويات الطلاب (Gamification Dashboard)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  يحصل الطلاب تلقائياً على نقاط عند <strong>قراءة المذكرات (+50 XP)</strong>، <strong>إتمام الكورسات (+80 XP)</strong>، <strong>وحل أسئلة البابل شيت (+25 XP)</strong> مع شريط تقدم المستوى. كـ مشرف، يمكنك أيضاً إهداء نقاط تشجيعية فورية لجميع الطلاب.
                </p>
              </div>

              {/* Levels Overview Cards */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>سلم المستويات المعتمد في المنصة:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {LEVEL_DEFINITIONS.map((lvl) => (
                    <div
                      key={lvl.level}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                          {lvl.level}
                        </span>
                        <span className="font-bold text-slate-200">{lvl.title}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-400">
                        {lvl.minXp} - {lvl.maxXp} XP
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Broadcast Bonus Points to All Students */}
              <form onSubmit={handleGrantBonus} className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>منح مكافأة نقاط عامة وبثها لجميع الطلاب الآن:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      كمية النقاط:
                    </label>
                    <select
                      value={bonusPoints}
                      onChange={(e) => setBonusPoints(Number(e.target.value))}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-bold font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                        isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value={50}>+50 نقطة XP</option>
                      <option value={100}>+100 نقطة XP (موصى بها)</option>
                      <option value={200}>+200 نقطة XP</option>
                      <option value={500}>+500 نقطة XP (مكافأة كبرى)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      مناسبة المكافأة والرسالة التقديرية:
                    </label>
                    <input
                      type="text"
                      required
                      value={bonusReason}
                      onChange={(e) => setBonusReason(e.target.value)}
                      placeholder="مثال: مكافأة تفوق بمناسبة حل بنك الأسئلة"
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                        isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>إرسال المكافأة (+{bonusPoints} XP) وبث الإشعار فوراً</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: VERCEL ZIP EXPORT (SUPERVISOR ONLY) */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-amber-500/15 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-right space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0">
                    <Archive className="w-6 h-6 text-slate-950" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                      خاص بالإدارة فقط
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-white mt-1">
                      ملف مشروع EduZone الكامل لـ Vercel (ZIP)
                    </h4>
                    <p className="text-xs text-slate-400">
                      ملف واحد مضغوط يحتوي على كافة ملفات السورس كود، بنك الأسئلة (1,135 سؤال)، الملخصات، وإعدادات Vercel.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">اسم الملف:</span>
                    <code className="text-amber-300 font-mono font-bold">eduzone-vercel-project.zip</code>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">الحجم التقريبي:</span>
                    <span className="text-emerald-400 font-bold font-mono">~2.3 MB</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">الحالة:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> جاهز للتحميل والرفع الفوري
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href="/eduzone-vercel-project.zip"
                    download="eduzone-vercel-project.zip"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل ملف ZIP الآن (مباشرة)</span>
                  </a>

                  <a
                    href="https://vercel.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>فتح موقع Vercel ↗</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>نظام إشراف EduZone المعتمد</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
