import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Phone,
  GraduationCap,
  ArrowLeft,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  BookOpen,
  Camera,
  Trash2,
  Upload,
  KeyRound,
  Lock,
} from 'lucide-react';

export type UserRole = 'student' | 'teacher' | 'supervisor';

export interface StudentUser {
  name: string;
  contact: string; // Phone or Email
  stage: string;
  theme: 'dark' | 'light';
  loginDate: string;
  role?: UserRole;
  avatarUrl?: string;
  subjectSpecialty?: string;
  supervisorCode?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: StudentUser) => void;
  intendedActionLabel?: string;
  currentTheme?: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  intendedActionLabel = 'لقراءة وتحميل المذكرات ومتابعة الكورسات',
  currentTheme = 'dark',
  onThemeChange,
  initialRole = 'student',
}) => {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [stage, setStage] = useState('الثانوية العامة - علمي');
  const [subjectSpecialty, setSubjectSpecialty] = useState('الفيزياء');
  const [supervisorCode, setSupervisorCode] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light'>(currentTheme);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSelectTheme = (t: 'dark' | 'light') => {
    setSelectedTheme(t);
    if (onThemeChange) {
      onThemeChange(t);
    }
  };

  // Image Upload & Compress to Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress using offscreen canvas to keep localStorage light
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
          setAvatarUrl(dataUrl);
          setError('');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى كتابة الاسم بالكامل للتعرف عليك.');
      return;
    }
    if (!contact.trim() || contact.trim().length < 6) {
      setError('يرجى إدخال رقم الهاتف أو البريد الإلكتروني بشكل صحيح.');
      return;
    }

    // Supervisor secret code validation
    if (role === 'supervisor') {
      if (supervisorCode.trim() !== '1192004') {
        setError('كود الإشراف غير صحيح! يرجى إدخال الكود السري المعتمد الخاص بإدارة المنصة.');
        return;
      }
    }

    const newUser: StudentUser = {
      name: name.trim(),
      contact: contact.trim(),
      stage: role === 'teacher' ? `معلم مادة (${subjectSpecialty})` : role === 'supervisor' ? 'مشرف عام وإدارة EduZone' : stage,
      theme: selectedTheme,
      loginDate: new Date().toLocaleDateString('ar-EG'),
      role,
      avatarUrl: avatarUrl || undefined,
      subjectSpecialty: role === 'teacher' ? subjectSpecialty : undefined,
      supervisorCode: role === 'supervisor' ? supervisorCode.trim() : undefined,
    };

    try {
      localStorage.setItem('eduzone_user', JSON.stringify(newUser));
      localStorage.setItem('eduzone_theme', selectedTheme);
    } catch (err) {
      console.error(err);
    }

    setError('');
    onSuccess(newUser);
  };

  const isDark = selectedTheme === 'dark';
  const isSupervisorCodeValid = supervisorCode.trim() === '1192004';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-right">
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden flex flex-col transition-colors duration-200 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header - Compact */}
        <div className="bg-slate-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs ${
              role === 'supervisor' ? 'bg-amber-600' : role === 'teacher' ? 'bg-emerald-600' : 'bg-indigo-600'
            }`}>
              {role === 'supervisor' ? (
                <ShieldCheck className="w-4 h-4 text-amber-200" />
              ) : role === 'teacher' ? (
                <BookOpen className="w-4 h-4 text-emerald-200" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white leading-tight flex items-center gap-1.5">
                <span>
                  {role === 'supervisor' ? 'دخول المشرفين والإدارة' : role === 'teacher' ? 'تسجيل دخول المعلمين' : 'تسجيل دخول الطالب'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-amber-300 font-mono">
                  EduZone
                </span>
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {role === 'supervisor' ? 'مساحة إدارية لكتابة وإرسال الإشعارات والنشر' : intendedActionLabel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Selector Tabs (طالب / معلم / إشراف) */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 mb-2">اختر نوع التسجيل والصلاحية:</div>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
            {/* Student */}
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setError('');
              }}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                role === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>طالب</span>
            </button>

            {/* Teacher */}
            <button
              type="button"
              onClick={() => {
                setRole('teacher');
                setError('');
              }}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                role === 'teacher'
                  ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>معلم</span>
            </button>

            {/* Supervisor / Admin */}
            <button
              type="button"
              onClick={() => {
                setRole('supervisor');
                setError('');
              }}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                role === 'supervisor'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm ring-1 ring-amber-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>إشراف (كود)</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className={`p-4 sm:p-5 space-y-3.5 transition-colors duration-200 overflow-y-auto max-h-[75vh] ${
            isDark ? 'bg-slate-900/90' : 'bg-slate-50'
          }`}
        >
          {error && (
            <div className="p-2.5 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-500 font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Supervisor Secret Code Notice & Input */}
          {role === 'supervisor' && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>كود الإشراف السري (مطلوب):</span>
                </span>
                <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded font-bold">
                  محمي برمز سري
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={supervisorCode}
                  onChange={(e) => setSupervisorCode(e.target.value)}
                  placeholder="أدخل كود الإشراف السري الخاص بك"
                  className={`w-full pr-9 pl-3 py-2 border rounded-xl text-xs font-mono font-bold text-left focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-colors ${
                    isSupervisorCodeValid
                      ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400'
                      : isDark
                      ? 'bg-slate-950 border-amber-500/50 text-white placeholder:text-slate-500'
                      : 'bg-white border-amber-400 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <Lock className="w-4 h-4 text-amber-400 absolute right-3 top-2.5" />
              </div>
              {isSupervisorCodeValid ? (
                <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تم تأكيد كود الإدارة بنجاح! سيتم فتح لوحة التحكم والإشعارات.</span>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400">
                  مخصص فقط للمشرف المصرح له لإرسال الإشعارات وبث التحديثات للطلاب.
                </p>
              )}
            </div>
          )}

          {/* Avatar Upload Section */}
          <div className="p-3 rounded-xl border border-slate-700/50 bg-slate-950/30 flex items-center gap-3">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="الصورة الشخصية"
                  className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-400">
                  <User className="w-6 h-6" />
                </div>
              )}
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  title="حذف الصورة"
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-xs cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex-1">
              <span className="block text-xs font-bold text-slate-200 mb-1">
                الصورة الشخصية للملف:
              </span>
              <p className="text-[10px] text-slate-400 mb-2">
                ارفع صورتك لتظهر في شريط المنصة ولوحة التحكم.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="avatar-upload-input"
              />
              <label
                htmlFor="avatar-upload-input"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{avatarUrl ? 'تغيير الصورة' : 'رفع صورة من جهازك'}</span>
              </label>
            </div>
          </div>

          {/* 1. Full Name */}
          <div>
            <label
              className={`block text-xs font-bold mb-1 ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              {role === 'supervisor' ? 'اسم المشرف / المسؤول:' : role === 'teacher' ? 'اسم المعلم / الأستاذ:' : 'الاسم بالكامل:'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'supervisor' ? 'مثال: أ / عبدالله (المشرف العام)' : role === 'teacher' ? 'مثال: مستر عبدالله' : 'مثال: أحمد محمد علي'}
                className={`w-full pr-9 pl-3 py-2 border rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-600 transition-colors ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                }`}
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          {/* 2. Contact Phone or Email */}
          <div>
            <label
              className={`block text-xs font-bold mb-1 ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              رقم الهاتف أو التليجرام أو البريد الإلكتروني:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="010XXXXXXXX أو admin@eduzone.com"
                className={`w-full pr-9 pl-3 py-2 border rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-600 transition-colors ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                }`}
              />
              <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          {/* 3. Role-Specific Field */}
          {role === 'student' && (
            <div>
              <label
                className={`block text-xs font-bold mb-1 ${
                  isDark ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                المرحلة التعليمية / الشعبة:
              </label>
              <div className="relative">
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className={`w-full pr-9 pl-3 py-2 border rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-600 transition-colors ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-slate-100'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="الثانوية العامة - علمي">الثانوية العامة - علمي (علوم ورياضة)</option>
                  <option value="الثانوية العامة - أدبي">الثانوية العامة - أدبي</option>
                  <option value="التعليم التجاري (دبلوم 3 و 5 سنوات)">التعليم التجاري (دبلوم التجارة)</option>
                  <option value="التعليم الفني والصناعي">التعليم الفني والصناعي</option>
                  <option value="لغات وتجريبي (Languages)">شعبة اللغات (Languages)</option>
                  <option value="كورسات الجامعات واللغات والـ ICDL">كورسات المحاسبة والجامعات والـ ICDL</option>
                </select>
                <GraduationCap className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          )}

          {role === 'teacher' && (
            <div>
              <label
                className={`block text-xs font-bold mb-1 ${
                  isDark ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                المادة التخصصية التي تقوم بتدريسها:
              </label>
              <div className="relative">
                <select
                  value={subjectSpecialty}
                  onChange={(e) => setSubjectSpecialty(e.target.value)}
                  className={`w-full pr-9 pl-3 py-2 border rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-colors ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-slate-100'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="الفيزياء">الفيزياء (الثانوية العامة)</option>
                  <option value="المحاسبة المالية والتجارية">المحاسبة المالية وجرد المدينين (دبلوم التجارة)</option>
                  <option value="اللغة الإنجليزية">اللغة الإنجليزية (General & Advanced English)</option>
                  <option value="الكيمياء">الكيمياء والعلوم التطبيقية</option>
                  <option value="الرياضيات والإحصاء">الرياضيات والإحصاء العام</option>
                  <option value="اللغة العربية">اللغة العربية والنحو والبلاغة</option>
                  <option value="إدارة الأعمال والتسويق">إدارة الأعمال والسكرتارية</option>
                </select>
                <BookOpen className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          )}

          {/* 4. Theme Choice Step */}
          <div className="pt-1">
            <label
              className={`block text-xs font-bold mb-1.5 flex items-center justify-between ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              <span>اختر مظهر المنصة المفضل:</span>
              <span className="text-[10px] text-amber-500 font-normal">
                (يمكنك تغييره لاحقاً)
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* Light Option */}
              <button
                type="button"
                onClick={() => handleSelectTheme('light')}
                className={`p-2.5 rounded-xl border-2 flex items-center gap-2 transition-all cursor-pointer text-right ${
                  selectedTheme === 'light'
                    ? 'border-amber-500 bg-amber-50 text-slate-950 shadow-xs ring-2 ring-amber-400/40'
                    : isDark
                    ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedTheme === 'light'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-bold flex items-center gap-1">
                    <span>تصميم فاتح</span>
                    {selectedTheme === 'light' && (
                      <CheckCircle2 className="w-3 h-3 text-amber-600" />
                    )}
                  </div>
                  <div className="text-[10px] opacity-75">نهاري مريح</div>
                </div>
              </button>

              {/* Dark Option */}
              <button
                type="button"
                onClick={() => handleSelectTheme('dark')}
                className={`p-2.5 rounded-xl border-2 flex items-center gap-2 transition-all cursor-pointer text-right ${
                  selectedTheme === 'dark'
                    ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-xs ring-2 ring-indigo-400/40'
                    : isDark
                    ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedTheme === 'dark'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-bold flex items-center gap-1">
                    <span>تصميم غامق</span>
                    {selectedTheme === 'dark' && (
                      <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                    )}
                  </div>
                  <div className="text-[10px] opacity-75">ليلي موفر للطاقة</div>
                </div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-2.5 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                role === 'supervisor'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : role === 'teacher'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <span>
                {role === 'supervisor' ? 'دخول لوحة تحكم المشرفين' : role === 'teacher' ? 'تسجيل الدخول كمعلم' : 'تسجيل الدخول ومتابعة المنصة'}
              </span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-400 pt-1">
            تسجيل لمرة واحدة فقط ويحفظ حسابك ورتبتك والمظهر المفضل تلقائياً.
          </p>
        </form>
      </div>
    </div>
  );
};
