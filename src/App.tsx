import React, { useState, useMemo, useEffect } from 'react';
import { EducationalTrack, PlanFilter, SummaryItem, VideoCourse } from './types';
import { SUMMARY_ITEMS, VIDEO_COURSES } from './data/coursesData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrackTabs } from './components/TrackTabs';
import { PricingModal } from './components/PricingModal';
import { SummaryCard } from './components/SummaryCard';
import { VideoCard } from './components/VideoCard';
import { SummaryViewerModal } from './components/SummaryViewerModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AccountingSandbox } from './components/AccountingSandbox';
import { FormulaHelper } from './components/FormulaHelper';
import { InteractiveQuizModal } from './components/InteractiveQuizModal';
import { StudyTimerModal } from './components/StudyTimerModal';
import { ContactModal } from './components/ContactModal';
import { SavedModal } from './components/SavedModal';
import { NotificationCenter } from './components/NotificationCenter';
import { Footer } from './components/Footer';
import { AuthModal, StudentUser, UserRole } from './components/AuthModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { SupervisorDashboardModal } from './components/SupervisorDashboardModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AndroidFrame } from './components/AndroidFrame';
import { downloadSummaryAsDocument } from './utils/downloadHelper';
import { playNotificationChime } from './utils/notificationAudio';
import { getStudentProgress, StudentProgress } from './utils/gamification';
import { BookOpen, GraduationCap, Video, CheckCircle2, Search, Sparkles, MessageCircle, Crown, Wrench, X, Bell, Trophy, Zap, Award, ArrowRight, Download, Package, ArrowLeft } from 'lucide-react';

export default function App() {
  const [activeTrack, setActiveTrack] = useState<EducationalTrack>('all');
  const [activePlanFilter, setActivePlanFilter] = useState<PlanFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'summaries' | 'courses' | 'quiz' | 'profile'>('home');

  // Gamification & Student Progress
  const [studentProgress, setStudentProgress] = useState<StudentProgress>(getStudentProgress);
  const [xpAwardToast, setXpAwardToast] = useState<{
    points: number;
    title: string;
    leveledUp?: boolean;
    newLevel?: number;
    newLevelTitle?: string;
  } | null>(null);

  // Student Authentication State
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => {
    try {
      const stored = localStorage.getItem('eduzone_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('student');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState(false);
  const [authActionPrompt, setAuthActionPrompt] = useState<string>('لقراءة وتحميل المذكرات ومتابعة الكورسات');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Live Toast for new supervisor notifications
  const [liveNotificationToast, setLiveNotificationToast] = useState<{
    id: string;
    title: string;
    message: string;
    actionUrl?: string;
  } | null>(null);

  // Unread notifications counter
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('edu_notifications');
      if (stored) {
        const list = JSON.parse(stored);
        return list.filter((n: any) => !n.read).length;
      }
      return 3;
    } catch {
      return 3;
    }
  });

  // Saved Bookmarks
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('saved_summaries');
      return stored ? JSON.parse(stored) : ['phys-01', 'com-acc-01', 'uni-icdl-01'];
    } catch {
      return ['phys-01', 'com-acc-01', 'uni-icdl-01'];
    }
  });

  // Modals state
  const [viewingSummary, setViewingSummary] = useState<SummaryItem | null>(null);
  const [viewingCourse, setViewingCourse] = useState<VideoCourse | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // Sync saved bookmarks with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('saved_summaries', JSON.stringify(savedIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedIds]);

  // Real-time notifications listener for instant alerts from supervisors across tabs
  useEffect(() => {
    const handleNewNotif = (e: any) => {
      const notif = e.detail;
      if (notif) {
        setLiveNotificationToast({
          id: notif.id,
          title: notif.title,
          message: notif.message,
          actionUrl: notif.actionUrl,
        });
        playNotificationChime();
        setUnreadNotificationsCount((prev) => prev + 1);

        // Auto-dismiss floating toast after 7 seconds
        setTimeout(() => {
          setLiveNotificationToast((current) => (current?.id === notif.id ? null : current));
        }, 7000);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'edu_notifications' && e.newValue) {
        try {
          const list = JSON.parse(e.newValue);
          setUnreadNotificationsCount(list.filter((n: any) => !n.read).length);
        } catch {}
      }
      if (e.key === 'eduzone_user' && e.newValue) {
        try {
          setCurrentUser(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener('eduzone_new_notification', handleNewNotif);
    window.addEventListener('storage', handleStorage);

    const handleProgressUpdated = (e: any) => {
      if (e.detail) {
        setStudentProgress(e.detail);
      } else {
        setStudentProgress(getStudentProgress());
      }
    };

    const handleXpAwarded = (e: any) => {
      if (e.detail) {
        setXpAwardToast(e.detail);
        setStudentProgress(getStudentProgress());
        setTimeout(() => {
          setXpAwardToast(null);
        }, 5500);
      }
    };

    window.addEventListener('eduzone_progress_updated', handleProgressUpdated);
    window.addEventListener('eduzone_xp_awarded', handleXpAwarded);

    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('eduzone_live_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'NEW_NOTIFICATION') {
            handleNewNotif({ detail: event.data.data });
          }
        };
      } catch (err) {
        console.error(err);
      }
    }

    return () => {
      window.removeEventListener('eduzone_new_notification', handleNewNotif);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('eduzone_progress_updated', handleProgressUpdated);
      window.removeEventListener('eduzone_xp_awarded', handleXpAwarded);
      if (bc) bc.close();
    };
  }, []);

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const requireAuth = (prompt: string, callback: () => void) => {
    if (currentUser) {
      callback();
    } else {
      setAuthActionPrompt(prompt);
      setPendingAction(() => callback);
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (user: StudentUser) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('eduzone_user');
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setIsProfileModalOpen(false);
  };

  const handleDownloadPdf = (item: SummaryItem) => {
    requireAuth(`لتحميل مذكرة ${item.title}`, () => {
      downloadSummaryAsDocument(item);
    });
  };

  const handleReadOnline = (item: SummaryItem) => {
    requireAuth(`لقراءة مذكرة ${item.title}`, () => {
      setViewingSummary(item);
    });
  };

  const handleWatchCourse = (course: VideoCourse) => {
    requireAuth(`لمشاهدة كورس ${course.title}`, () => {
      setViewingCourse(course);
    });
  };

  const handleOpenTelegramGroup = () => {
    window.open('https://t.me/+2OhLLu7ofSoxNTNk', '_blank');
  };
  const handleOpenWhatsAppGroup = handleOpenTelegramGroup;

  const handleOpenQuiz = () => {
    if (!currentUser) {
      setAuthInitialRole('student');
      setAuthActionPrompt('يرجى تسجيل الدخول أولاً للوصول إلى بنك الأسئلة الشامل (1,135+ سؤال) وحفظ نتائجك ونقاطك.');
      setPendingAction(() => () => setIsQuizModalOpen(true));
      setIsAuthModalOpen(true);
      return;
    }
    setIsQuizModalOpen(true);
  };

  const handleSelectNavTab = (tab: 'home' | 'summaries' | 'courses' | 'quiz' | 'profile') => {
    setActiveNavTab(tab);
    if (tab === 'home') {
      setActiveTrack('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'summaries') {
      setActiveTrack('thanawya_science');
      const el = document.getElementById('browse-sections');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'courses') {
      setActiveTrack('university_courses');
      const el = document.getElementById('browse-sections');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'quiz') {
      handleOpenQuiz();
    } else if (tab === 'profile') {
      if (currentUser) {
        setIsProfileModalOpen(true);
      } else {
        setAuthActionPrompt('تسجيل دخول الطالب لحفظ ومتابعة دراستك');
        setIsAuthModalOpen(true);
      }
    }
  };

  // Filtered summaries
  const filteredSummaries = useMemo(() => {
    return SUMMARY_ITEMS.filter((item) => {
      // Track match
      if (activeTrack !== 'all' && activeTrack !== 'free_courses') {
        if (activeTrack === 'thanawya_science') {
          if (item.track !== 'thanawya_science' && item.track !== 'thanawya_arts' && item.track !== 'languages') return false;
        } else if (activeTrack === 'technical_industrial') {
          if (item.track !== 'technical_industrial' && item.track !== 'commerce_diploma') return false;
        } else if (item.track !== activeTrack) {
          return false;
        }
      }

      // Plan filter match
      if (activePlanFilter === 'free' && item.planType === 'paid') return false;
      if (activePlanFilter === 'paid' && item.planType !== 'paid') return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(query);
        const inSubject = item.subject.toLowerCase().includes(query);
        const inDesc = item.description.toLowerCase().includes(query);
        const inTags = item.tags.some((t) => t.toLowerCase().includes(query));
        return inTitle || inSubject || inDesc || inTags;
      }

      return true;
    });
  }, [activeTrack, activePlanFilter, searchQuery]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    if (
      activeTrack !== 'all' &&
      activeTrack !== 'free_courses' &&
      activeTrack !== 'university_courses'
    ) {
      return [];
    }
    return VIDEO_COURSES.filter((course) => {
      if (activeTrack === 'university_courses' && course.track !== 'university') return false;

      // Plan filter match
      if (activePlanFilter === 'free' && course.planType === 'paid') return false;
      if (activePlanFilter === 'paid' && course.planType !== 'paid') return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [activeTrack, activePlanFilter, searchQuery]);

  const savedItems = useMemo(() => {
    return SUMMARY_ITEMS.filter((item) => savedIds.includes(item.id));
  }, [savedIds]);

  // Category counts
  const counts = useMemo(() => {
    return {
      all: SUMMARY_ITEMS.length + VIDEO_COURSES.length,
      thanawya_science: SUMMARY_ITEMS.filter((s) => s.track === 'thanawya_science').length,
      thanawya_arts: SUMMARY_ITEMS.filter((s) => s.track === 'thanawya_arts').length,
      languages: SUMMARY_ITEMS.filter((s) => s.track === 'languages').length,
      commerce_diploma: SUMMARY_ITEMS.filter((s) => s.track === 'commerce_diploma').length,
      technical_industrial:
        SUMMARY_ITEMS.filter((s) => s.track === 'technical_industrial').length +
        VIDEO_COURSES.filter((c) => c.category === 'التعليم الفني والصناعي').length,
      university_courses:
        SUMMARY_ITEMS.filter((s) => s.track === 'university_courses').length +
        VIDEO_COURSES.filter((c) => c.track === 'university').length,
      free_courses: VIDEO_COURSES.length,
    };
  }, []);

  // Distinct groups
  const thanawyaSummaries = useMemo(
    () =>
      filteredSummaries.filter(
        (s) =>
          s.track === 'thanawya_science' ||
          s.track === 'thanawya_arts' ||
          s.track === 'languages'
      ),
    [filteredSummaries]
  );

  const technicalAndCommerceSummaries = useMemo(
    () =>
      filteredSummaries.filter(
        (s) => s.track === 'technical_industrial' || s.track === 'commerce_diploma'
      ),
    [filteredSummaries]
  );

  const universitySummaries = useMemo(
    () => filteredSummaries.filter((s) => s.track === 'university_courses'),
    [filteredSummaries]
  );

  return (
    <AndroidFrame>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
        {/* Floating XP Award Toast */}
        {xpAwardToast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 text-slate-950 px-4 py-2.5 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-2.5 animate-bounce text-right">
            <span className="text-xl">🎉</span>
            <div className="leading-tight">
              <div className="text-xs font-black">
                +{xpAwardToast.points} نقطة خبرة (XP) مكتسبة!
              </div>
              <div className="text-[11px] font-bold text-slate-900">
                {xpAwardToast.title}
              </div>
            </div>
            <span className="text-[10px] bg-slate-950 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full mr-1">
              {studentProgress.levelTitle}
            </span>
          </div>
        )}

        {/* Mobile Header */}
        <Header
          activeTrack={activeTrack}
          onSelectTrack={(track) => {
            setActiveTrack(track);
            const el = document.getElementById('browse-sections');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          savedCount={savedIds.length}
          onOpenSavedModal={() => setIsSavedModalOpen(true)}
          onOpenTimerModal={() => setIsTimerModalOpen(true)}
          onOpenContactModal={() => setIsContactModalOpen(true)}
          onOpenQuizModal={handleOpenQuiz}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          currentUser={currentUser}
          studentProgress={studentProgress}
          onOpenAuthModal={(role = 'student') => {
            setAuthInitialRole(role);
            setAuthActionPrompt(
              role === 'supervisor'
                ? 'دخول المشرف الإداري المصرح له لإرسال الإشعارات'
                : 'تسجيل دخول الطالب للاستفادة الكاملة من المنصة'
            );
            setIsAuthModalOpen(true);
          }}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenSupervisorDashboard={() => setIsSupervisorModalOpen(true)}
          onLogout={handleLogout}
          unreadNotificationsCount={unreadNotificationsCount}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Mobile Hero */}
          <Hero
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onExploreClick={() => {
              const el = document.getElementById('browse-sections');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenQuizClick={handleOpenQuiz}
            onOpenTechnicalClick={() => {
              setActiveTrack('technical_industrial');
              const el = document.getElementById('browse-sections');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenUniversityCourses={() => {
              setActiveTrack('university_courses');
              const el = document.getElementById('browse-sections');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenPricingModal={() => setIsPricingModalOpen(true)}
          />

          <div id="browse-sections" className="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-6">
            {/* Filter Tabs (Only General Secondary, Tech Secondary, Courses, Tutorials) */}
            <TrackTabs
              activeTrack={activeTrack}
              onSelectTrack={(track) => {
                if (track === 'quiz_bank') {
                  handleOpenQuiz();
                  return;
                }
                setActiveTrack(track);
              }}
              activePlanFilter={activePlanFilter}
              onSelectPlanFilter={setActivePlanFilter}
              onOpenPricingModal={() => setIsPricingModalOpen(true)}
              counts={counts}
            />

            {/* 🌟 STUDENT POINTS & LEVEL PROGRESS DASHBOARD CARD */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl p-4 sm:p-5.5 shadow-xl border border-amber-500/40 text-white text-right relative overflow-hidden">
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-lg font-black text-xl">
                    <Trophy className="w-6 h-6 text-slate-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-black text-amber-300">
                        {studentProgress.levelTitle}
                      </span>
                      <span className="text-[11px] font-bold bg-amber-500/30 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded-full">
                        المستوى {studentProgress.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      نظام التميز الأكاديمي للطلاب · احصد النقاط بإتمام الكورسات والمذكرات وحل الأسئلة
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  <div className="bg-slate-900/90 border border-amber-400/40 px-3.5 py-1.5 rounded-xl text-left font-mono">
                    <span className="text-lg sm:text-xl font-black text-amber-400">
                      {studentProgress.totalPoints}
                    </span>
                    <span className="text-[11px] text-slate-400 mr-1 font-bold">XP</span>
                  </div>
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                  >
                    <span>لوحة النقاط والأوسمة</span>
                    <Award className="w-3.5 h-3.5 text-slate-950" />
                  </button>
                </div>
              </div>

              {/* Level Progress Bar & Detailed Stats */}
              <div className="mt-4 pt-3.5 border-t border-slate-800 space-y-2 relative z-10">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>شريط تقدم المستوى: {studentProgress.progressPercent}%</span>
                  </span>
                  <span className="text-amber-400 font-mono text-[11px]">
                    {studentProgress.totalPoints} / {studentProgress.nextLevelXp} XP (باقي {Math.max(0, studentProgress.nextLevelXp - studentProgress.totalPoints)} XP)
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${Math.max(6, studentProgress.progressPercent)}%` }}
                  />
                </div>

                {/* Progress Details Chips */}
                <div className="grid grid-cols-3 gap-2 pt-1.5 text-center text-xs">
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                    <span className="text-[10px] text-slate-400 block">مذكرات مقروءة</span>
                    <span className="font-black text-indigo-300 font-mono text-sm">
                      {studentProgress.completedSummariesCount}
                    </span>
                    <span className="text-[9px] text-slate-500 block">+50 XP للمذكرة</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                    <span className="text-[10px] text-slate-400 block">محاضرات مكتملة</span>
                    <span className="font-black text-emerald-300 font-mono text-sm">
                      {studentProgress.completedLessonsCount}
                    </span>
                    <span className="text-[9px] text-slate-500 block">+80 XP للمحاضرة</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                    <span className="text-[10px] text-slate-400 block">أسئلة تم حلها</span>
                    <span className="font-black text-amber-300 font-mono text-sm">
                      {studentProgress.solvedQuizzesCount}
                    </span>
                    <span className="text-[9px] text-slate-500 block">+25 XP للسؤال</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Login Banner if Guest */}
            {!currentUser && (
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-3.5 shadow-md border border-indigo-700/60 flex items-center justify-between gap-3 text-right">
                <div className="space-y-0.5">
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full inline-block">
                    تسجيل دخول سريع
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-white">
                    سجل حسابك كطالب للاحتفاظ بمذكراتك ونتائجك
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    تسجيل مجاني بالاسم ورقم الهاتف لفتح القراءة والتحميل فوراً
                  </p>
                </div>
                <button
                  onClick={() => {
                    setAuthActionPrompt('تسجيل حسابك كطالب في المنصة');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shrink-0 shadow-xs transition-colors"
                >
                  دخول الآن
                </button>
              </div>
            )}

            {/* ========================================================= */}
            {/* 0. عرض جميع الأقسام (Section Navigation Hub & Overview) */}
            {/* ========================================================= */}
            {activeTrack === 'all' && (
              <div className="space-y-6">
                {/* 4 Dedicated Section Cards (Independent Navigation Hub) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-r-4 border-indigo-600 pr-3">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        الأقسام التعليمية المستقلة (اضغط للدخول المباشر)
                      </h2>
                      <p className="text-xs text-slate-500">
                        كل قسم منظم في مساحة خاصة به لسهولة التصفح والمذاكرة السريعة
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Card 1: Thanawya */}
                    <div
                      onClick={() => {
                        setActiveTrack('thanawya_science');
                        window.scrollTo({ top: 380, behavior: 'smooth' });
                      }}
                      className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl border border-indigo-700/60 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                            {counts.thanawya_science + counts.thanawya_arts + counts.languages} مذكرات
                          </span>
                        </div>
                        <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                          قسم الثانوية العامة (علمي وأدبي)
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          مذكرات الفيزياء والكيمياء والعربي والجغرافيا، قوانين مركزة، وأسئلة البابل شيت 2026/2027.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-300">
                        <span>دخول القسم وتصفح المذكرات</span>
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Card 2: Technical & Commercial */}
                    <div
                      onClick={() => {
                        setActiveTrack('technical_industrial');
                        window.scrollTo({ top: 380, behavior: 'smooth' });
                      }}
                      className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl border border-teal-600/50 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                            <Wrench className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold bg-teal-500/30 text-teal-200 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                            {counts.technical_industrial + counts.commerce_diploma} مناهج + محاكي
                          </span>
                        </div>
                        <h3 className="text-base font-black text-white group-hover:text-teal-300 transition-colors">
                          قسم التعليم الفني والتجاري
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          دبلوم التجارة، الثانوي الصناعي، محاكي قيود اليومية المحاسبي التفاعلي، ودليل القوانين السريعة.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-teal-300">
                        <span>دخول القسم والمحاكي المحاسبي</span>
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Card 3: University Courses */}
                    <div
                      onClick={() => {
                        setActiveTrack('university_courses');
                        window.scrollTo({ top: 380, behavior: 'smooth' });
                      }}
                      className="bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl border border-amber-600/50 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold bg-amber-500/30 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                            {counts.university_courses} كورس معتمد
                          </span>
                        </div>
                        <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                          قسم الكورسات وسوق العمل
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          دورات ICDL، مايكروسوفت إكسيل المالي، الأمن السيبراني، لغات، وبرمجة معتمدة للجامعات والخريجين.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-300">
                        <span>دخول قسم الكورسات المعتمدة</span>
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Card 4: Video Lessons */}
                    <div
                      onClick={() => {
                        setActiveTrack('free_courses');
                        window.scrollTo({ top: 380, behavior: 'smooth' });
                      }}
                      className="bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl border border-red-600/50 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                            <Video className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold bg-red-500/30 text-red-200 px-2.5 py-0.5 rounded-full border border-red-400/30">
                            {counts.free_courses} دروس مرئية
                          </span>
                        </div>
                        <h3 className="text-base font-black text-white group-hover:text-red-300 transition-colors">
                          قسم الشروحات والدروس المرئية
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          معسكرات مراجعة ليلة الامتحان، شروحات فيديو تفاعلية بدقة 1080p HD مع كسب +80 XP لكل محاضرة.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-red-300">
                        <span>دخول قسم الشروحات والفيديوهات</span>
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Picks Preview */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>أبرز المذكرات الأكثر قراءة اليوم</span>
                    </h3>
                    <span className="text-xs text-slate-500 font-bold">
                      اختر أي قسم في الأعلى لعرض كافة محتوياته
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {SUMMARY_ITEMS.slice(0, 2).map((item) => (
                      <SummaryCard
                        key={item.id}
                        item={item}
                        onReadOnline={handleReadOnline}
                        onDownloadPdf={handleDownloadPdf}
                        isSaved={savedIds.includes(item.id)}
                        onToggleSave={handleToggleSave}
                        isCommerce={false}
                        onOpenVipPayment={() => setIsPricingModalOpen(true)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 1. قسم الثانوية العامة منفصلاً ومستقلاً */}
            {/* ========================================================= */}
            {activeTrack === 'thanawya_science' && (
              <section className="space-y-4 pt-1 animate-fadeIn">
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-md">
                        قسم مستقل
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-indigo-950">
                        قسم الثانوية العامة (علمي وأدبي)
                      </h2>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      مذكرات مركزة، خرائط الكيمياء، قوانين الفيزياء والإحصاء، وأسئلة البابل شيت 2026 / 2027.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTrack('all')}
                    className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-white border border-indigo-300 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>العودة لجميع الأقسام</span>
                  </button>
                </div>

                {/* Summaries Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {thanawyaSummaries.map((item) => (
                    <SummaryCard
                      key={item.id}
                      item={item}
                      onReadOnline={handleReadOnline}
                      onDownloadPdf={handleDownloadPdf}
                      isSaved={savedIds.includes(item.id)}
                      onToggleSave={handleToggleSave}
                      isCommerce={false}
                      onOpenVipPayment={() => setIsPricingModalOpen(true)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ========================================================= */}
            {/* 2. قسم التعليم الفني والتجاري منفصلاً ومستقلاً */}
            {/* ========================================================= */}
            {activeTrack === 'technical_industrial' && (
              <section className="space-y-4 pt-1 animate-fadeIn">
                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-teal-600 text-white px-2 py-0.5 rounded-md">
                        قسم مستقل
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-teal-950">
                        قسم التعليم الفني والتجاري
                      </h2>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      مناهج دبلوم التجارة (3 و 5 سنوات والمعادلة)، الثانوي الصناعي، ومحاكي القيود المحاسبي التفاعلي.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTrack('all')}
                    className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-white border border-teal-300 text-teal-700 text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>العودة لجميع الأقسام</span>
                  </button>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {technicalAndCommerceSummaries.map((item) => (
                    <SummaryCard
                      key={item.id}
                      item={item}
                      onReadOnline={handleReadOnline}
                      onDownloadPdf={handleDownloadPdf}
                      isSaved={savedIds.includes(item.id)}
                      onToggleSave={handleToggleSave}
                      isCommerce={item.track === 'commerce_diploma'}
                      onOpenVipPayment={() => setIsPricingModalOpen(true)}
                    />
                  ))}
                </div>

                {/* Interactive Accounting Sandbox Tool */}
                <div className="pt-2">
                  <AccountingSandbox />
                </div>

                {/* Formula Quick Sheet */}
                <div className="pt-1">
                  <FormulaHelper />
                </div>
              </section>
            )}

            {/* ========================================================= */}
            {/* 3. قسم الكورسات وسوق العمل منفصلاً ومستقلاً */}
            {/* ========================================================= */}
            {activeTrack === 'university_courses' && (
              <section className="space-y-4 pt-1 animate-fadeIn">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-amber-600 text-white px-2 py-0.5 rounded-md">
                        قسم مستقل
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-amber-950">
                        قسم الكورسات وتأهيل سوق العمل
                      </h2>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      دورات متخصصة: ICDL، إكسيل مالي، أمن سيبراني، لغات، ومحاسبة شركات معتمدة 2026/2027.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTrack('all')}
                    className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>العودة لجميع الأقسام</span>
                  </button>
                </div>

                {/* University Summaries */}
                {universitySummaries.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {universitySummaries.map((item) => (
                      <SummaryCard
                        key={item.id}
                        item={item}
                        onReadOnline={handleReadOnline}
                        onDownloadPdf={handleDownloadPdf}
                        isSaved={savedIds.includes(item.id)}
                        onToggleSave={handleToggleSave}
                        isCommerce={false}
                        onOpenVipPayment={() => setIsPricingModalOpen(true)}
                      />
                    ))}
                  </div>
                )}

                {/* University Video Courses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {VIDEO_COURSES.filter((c) => c.track === 'university').map((course) => (
                    <VideoCard
                      key={course.id}
                      course={course}
                      onWatchCourse={handleWatchCourse}
                      onOpenVipPayment={() => setIsPricingModalOpen(true)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ========================================================= */}
            {/* 4. قسم الشروحات والدروس المرئية منفصلاً ومستقلاً */}
            {/* ========================================================= */}
            {activeTrack === 'free_courses' && (
              <section className="space-y-4 pt-1 animate-fadeIn">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded-md">
                        قسم مستقل
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-red-950">
                        قسم الشروحات والدروس المرئية
                      </h2>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      فيديوهات مكثفة لشرح المواد، تأسيس اللغات، ومراجعات ليلة الامتحان (جودة 1080p HD).
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTrack('all')}
                    className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-white border border-red-300 text-red-800 text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>العودة لجميع الأقسام</span>
                  </button>
                </div>

                {/* Video Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredCourses.map((course) => (
                    <VideoCard
                      key={course.id}
                      course={course}
                      onWatchCourse={handleWatchCourse}
                      onOpenVipPayment={() => setIsPricingModalOpen(true)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty state if nothing matches */}
            {filteredSummaries.length === 0 && filteredCourses.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  لا توجد نتائج مطابقة لبحثك
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  جرب مسح البحث أو تغيير التصنيف للوصول إلى المذكرات المطلوبة.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTrack('all');
                    setActivePlanFilter('all');
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  عرض جميع المحتويات
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <Footer
          onSelectTrack={(t) => {
            setActiveTrack(t);
            const el = document.getElementById('browse-sections');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenContact={() => setIsContactModalOpen(true)}
          onOpenTimer={() => setIsTimerModalOpen(true)}
        />

        {/* Mobile Android Bottom Navigation Bar */}
        <MobileBottomNav
          activeTab={activeNavTab}
          onSelectNavTab={handleSelectNavTab}
          currentUser={currentUser}
          savedCount={savedIds.length}
        />

        {/* Floating Live Notification Toast Banner for All Students */}
        {liveNotificationToast && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-[92%] bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-3 sm:p-4 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-start justify-between gap-3 animate-bounce">
            <div className="flex items-start gap-2.5 flex-1">
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="space-y-0.5 flex-1 text-right">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded">
                    🔔 إشعار فوري من الإشراف
                  </span>
                  <h4 className="text-xs font-black text-slate-950">
                    {liveNotificationToast.title}
                  </h4>
                </div>
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {liveNotificationToast.message}
                </p>
                {liveNotificationToast.actionUrl && (
                  <a
                    href={liveNotificationToast.actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-[11px] font-extrabold text-slate-950 underline pt-1"
                  >
                    اضغط هنا لفتح الرابط المرفق ↗
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={() => setLiveNotificationToast(null)}
              className="p-1 text-slate-950 hover:bg-black/10 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Student Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {
            setIsAuthModalOpen(false);
            setPendingAction(null);
          }}
          onSuccess={handleAuthSuccess}
          intendedActionLabel={authActionPrompt}
          initialRole={authInitialRole}
        />

        {/* Student Profile & Digital ID Modal */}
        <StudentProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          onOpenAuthModal={() => {
            setIsProfileModalOpen(false);
            setIsAuthModalOpen(true);
          }}
          onLogout={handleLogout}
          savedCount={savedIds.length}
          onOpenSavedModal={() => setIsSavedModalOpen(true)}
          onOpenTelegram={handleOpenTelegramGroup}
          onOpenPricingModal={() => setIsPricingModalOpen(true)}
          onOpenSupervisorDashboard={() => {
            setIsProfileModalOpen(false);
            setIsSupervisorModalOpen(true);
          }}
          onUpdateUser={(updated) => setCurrentUser(updated)}
        />

        {/* Supervisor Control Panel & Broadcast Dashboard (Secret Code 1192004) */}
        <SupervisorDashboardModal
          isOpen={isSupervisorModalOpen}
          onClose={() => setIsSupervisorModalOpen(false)}
          currentUser={currentUser}
          onNotificationSent={() => {
            setUnreadNotificationsCount((prev) => prev + 1);
          }}
        />

        {/* Modal Viewers & Tools */}
        <SummaryViewerModal
          item={viewingSummary}
          onClose={() => setViewingSummary(null)}
          onDownloadPdf={handleDownloadPdf}
        />

        <VideoPlayerModal
          course={viewingCourse}
          onClose={() => setViewingCourse(null)}
        />

        <InteractiveQuizModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          onOpenPricingModal={() => setIsPricingModalOpen(true)}
          currentUser={currentUser}
          onOpenAuthModal={() => {
            setIsQuizModalOpen(false);
            setAuthInitialRole('student');
            setAuthActionPrompt('يرجى تسجيل الدخول أولاً للوصول إلى بنك الأسئلة الشامل (1,135+ سؤال) وحفظ نتائجك.');
            setPendingAction(() => () => setIsQuizModalOpen(true));
            setIsAuthModalOpen(true);
          }}
        />

        <StudyTimerModal
          isOpen={isTimerModalOpen}
          onClose={() => setIsTimerModalOpen(false)}
        />

        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />

        <SavedModal
          isOpen={isSavedModalOpen}
          onClose={() => setIsSavedModalOpen(false)}
          savedItems={savedItems}
          onRemoveSave={handleToggleSave}
          onReadOnline={handleReadOnline}
          onDownloadPdf={handleDownloadPdf}
        />

        {/* VIP Pricing & Subscription Modal */}
        <PricingModal
          isOpen={isPricingModalOpen}
          onClose={() => setIsPricingModalOpen(false)}
          onOpenTelegram={() => {
            setIsPricingModalOpen(false);
            handleOpenTelegramGroup();
          }}
        />

        {/* Notification Center Modal */}
        <NotificationCenter
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onOpenTelegram={() => {
            setIsNotificationsOpen(false);
            handleOpenTelegramGroup();
          }}
          onOpenSupervisorDashboard={() => {
            setIsNotificationsOpen(false);
            setIsSupervisorModalOpen(true);
          }}
          isSupervisor={currentUser?.role === 'supervisor'}
        />
      </div>
    </AndroidFrame>
  );
}
