import React, { useState, useMemo, useEffect } from 'react';
import { Bell, Check, ExternalLink, X, Sparkles, Volume2, ShieldCheck, MessageCircle } from 'lucide-react';

export interface EducationalNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'update' | 'reminder' | 'whatsapp';
  actionUrl?: string;
}

const INITIAL_NOTIFICATIONS: EducationalNotification[] = [
  {
    id: 'notif-1',
    title: 'تحديث مذكرات ليلة الامتحان 2026',
    message: 'تم رفع ملخص الفيزياء الحديثة وقوانين كيرشوف بنظام البابل شيت على EduZone التعليميه.',
    time: 'منذ 10 دقائق',
    read: false,
    type: 'update',
  },
  {
    id: 'notif-2',
    title: 'تنبيه شعبة دبلوم التجارة',
    message: 'تم إضافة تمرين عملي جديد في مدرب قيود اليومية المحاسبية لجرد المدينين والإهلاك.',
    time: 'منذ ساعة',
    read: false,
    type: 'reminder',
  },
  {
    id: 'notif-3',
    title: 'جروب المنصه الرسمي على التليجرام',
    message: 'انضم لجروب المنصه لمتابعة حلول التمارين ومذكرات ليلة الامتحان والدفع أولاً بأول.',
    time: 'منذ ساعتين',
    read: false,
    type: 'whatsapp',
  },
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp?: () => void;
  onOpenTelegram?: () => void;
  onOpenSupervisorDashboard?: () => void;
  isSupervisor?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onOpenWhatsApp,
  onOpenTelegram,
  onOpenSupervisorDashboard,
  isSupervisor = false,
}) => {
  const [notifications, setNotifications] = useState<EducationalNotification[]>(() => {
    try {
      const stored = localStorage.getItem('edu_notifications');
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with events from Supervisor Dashboard & other tabs
  useEffect(() => {
    const handleNewNotif = (e: any) => {
      try {
        const stored = localStorage.getItem('edu_notifications');
        if (stored) {
          setNotifications(JSON.parse(stored));
        } else if (e.detail) {
          setNotifications((prev) => [e.detail, ...prev]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'edu_notifications' && e.newValue) {
        try {
          setNotifications(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener('eduzone_new_notification', handleNewNotif);
    window.addEventListener('eduzone_notifications_updated', handleNewNotif);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('eduzone_new_notification', handleNewNotif);
      window.removeEventListener('eduzone_notifications_updated', handleNewNotif);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(Notification.permission);
    }
  }, []);

  const saveNotifications = (items: EducationalNotification[]) => {
    setNotifications(items);
    localStorage.setItem('edu_notifications', JSON.stringify(items));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      setToastMessage('متصفحك لا يدعم إشعارات سطح المكتب، ولكن إشعارات المنصة تعمل هنا مباشرة.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setBrowserPermission(perm);
      if (perm === 'granted') {
        new Notification('EduZone التعليميه', {
          body: 'تم تفعيل الإشعارات بنجاح! سنقوم بتنبيهك بكل جديد في المذكرات ومواعيد المراجعات.',
          icon: '/images/eduzone_logo.jpg',
        });
        setToastMessage('تم تفعيل إشعارات المتصفح بنجاح!');
      } else {
        setToastMessage('تم رفض الإذن أو تجاهله في المتصفح.');
      }
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('تنبيه المذاكرة - EduZone التعليميه', {
        body: 'لا تنسَ مراجعة ملخص الإحصاء والاقتصاد اليوم قبل النوم!',
      });
      setToastMessage('تم إرسال إشعار فوري لسطح المكتب!');
    } else {
      setToastMessage('إشعار تجريبي: تم فتح باب الانضمام لجروب المنصه على التليجرام');
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const handleToggleRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: !n.read } : n
    );
    saveNotifications(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-right">
      <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-slate-950 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  مركز الإشعارات والتنبيهات
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                متابعة فورية لإشعارات المشرفين ومذكرات وتحديثات المنصة
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

        {/* Supervisor Quick Access if supervisor */}
        {isSupervisor && onOpenSupervisorDashboard && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-center justify-between text-xs">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>أنت مسجل كمشرف إداري معتمد</span>
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenSupervisorDashboard();
              }}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-black text-xs transition-colors cursor-pointer shadow-xs"
            >
              إرسال إشعار جديد 📢
            </button>
          </div>
        )}

        {/* Browser Permission Banner */}
        <div className="bg-indigo-50 border-b border-indigo-100 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>إشعارات المتصفح الفورية:</span>
            </div>
            <div className="text-[11px] text-indigo-800 mt-0.5">
              {browserPermission === 'granted'
                ? 'إشعارات المتصفح مفعلة لديك وتعمل بكفاءة ✅'
                : 'فعّل إشعارات الجهاز لتصلك رسائل وتحديثات المنشئ حتى أثناء إغلاق الصفحة'}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {browserPermission !== 'granted' ? (
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                تفعيل الإشعارات
              </button>
            ) : (
              <button
                onClick={handleSendTestNotification}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                اختبار إشعار
              </button>
            )}
          </div>
        </div>

        {/* Feedback toast */}
        {toastMessage && (
          <div className="bg-amber-100 text-amber-900 text-xs font-bold p-2.5 text-center animate-fadeIn">
            {toastMessage}
          </div>
        )}

        {/* Notifications list */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-slate-50">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span className="font-semibold">
              التنبيهات الأخيرة ({unreadCount} غير مقروء)
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
              >
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          {notifications.map((notif) => {
            const isSupervisorNotif = notif.id.startsWith('supervisor-');
            return (
              <div
                key={notif.id}
                onClick={() => handleToggleRead(notif.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-right ${
                  isSupervisorNotif
                    ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                    : !notif.read
                    ? 'bg-white border-indigo-200 shadow-xs ring-1 ring-indigo-50'
                    : 'bg-white/70 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">
                      {notif.title}
                    </span>
                    {isSupervisorNotif && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-800 font-bold px-1.5 py-0.2 rounded border border-amber-300">
                        ⚡ من الإشراف
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                    {notif.time}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {notif.message}
                </p>

                {/* Action Link if provided */}
                {notif.actionUrl && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={notif.actionUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>فتح الرابط المرفق للإشعار</span>
                    </a>
                  </div>
                )}

                {notif.type === 'whatsapp' && !notif.actionUrl && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-sky-600">
                      جروب التليجرام الرسمي
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenTelegram) onOpenTelegram();
                        else if (onOpenWhatsApp) onOpenWhatsApp();
                      }}
                      className="text-[11px] bg-sky-500 hover:bg-sky-600 text-white font-bold px-2.5 py-1 rounded-md cursor-pointer"
                    >
                      انضم الآن ↗
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            تحديث مباشر برعاية EduZone التعليميه · تصميم Eng . Abdullah
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
