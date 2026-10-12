import React from 'react';
import {
  X,
  MapPin,
  GraduationCap,
  Calendar,
  Briefcase,
  Code2,
  Send,
  Mail,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/30 text-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative text-right flex flex-col my-auto">
        {/* Cover Header Banner */}
        <div className="h-28 bg-gradient-to-r from-amber-600 via-amber-500 to-indigo-700 relative flex items-center justify-between p-4">
          <span className="text-[11px] font-black uppercase tracking-wider bg-slate-950/60 backdrop-blur-md text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>منشئ ومصمم المنصة</span>
          </span>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-5 pb-6 pt-0 relative space-y-4">
          {/* Avatar with Ring */}
          <div className="flex items-end justify-between -mt-14 mb-2">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-slate-900 shadow-2xl ring-2 ring-amber-400/80 bg-slate-950">
                <img
                  src="/images/eng_abdullah_photo.jpg"
                  alt="Abdullah Abdelwahab"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.src = '/src/assets/images/eng_abdullah_photo_1791801066642.jpg';
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -left-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md border-2 border-slate-900" title="موثق">
                <ShieldCheck className="w-4 h-4 fill-slate-950 text-amber-500" />
              </div>
            </div>

            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
              Eng . Abdullah
            </span>
          </div>

          {/* Name & Title */}
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>Abdullah Abdelwahab</span>
            </h3>
            <p className="text-sm font-bold text-amber-300 flex items-center gap-1.5 leading-relaxed">
              <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Computer Science graduate, Business Administration department</span>
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3 flex items-center gap-2.5 text-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] text-slate-400 block">الموقع / الإقامة</span>
                <span className="font-bold text-white text-xs">El Mahalla El Kubra</span>
              </div>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3 flex items-center gap-2.5 text-xs">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] text-slate-400 block">العمر</span>
                <span className="font-bold text-white text-xs">Age 22</span>
              </div>
            </div>
          </div>

          {/* About / Description */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-3.5 space-y-2 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Code2 className="w-4 h-4" />
              <span>نبذة عن المصمم والمنشئ:</span>
            </div>
            <p>
              مهندس ومطور برمجيات، قام بتصميم وتطوير منصة <strong>EduZone التعليميه</strong> لخدمة طلاب الثانوية العامة ودبلوم التجارة بنظام تعليمي تفاعلي حديث يجمع بين الملخصات الاحترافية وبنوك الأسئلة الذكية.
            </p>
          </div>

          {/* Action Links */}
          <div className="space-y-2 pt-1">
            <a
              href="https://t.me/+2OhLLu7ofSoxNTNk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold text-xs rounded-xl border border-sky-400/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>التواصل عبر جروب التليجرام ↗</span>
            </a>

            <a
              href="mailto:bodabooody17@gmail.com"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>bodabooody17@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
