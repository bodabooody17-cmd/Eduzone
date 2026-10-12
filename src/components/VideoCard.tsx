import React from 'react';
import { VideoCourse } from '../types';
import { Play, Clock, BookOpen, User, Sparkles, CheckCircle2 } from 'lucide-react';

interface VideoCardProps {
  course: VideoCourse;
  onWatchCourse: (course: VideoCourse) => void;
  onOpenVipPayment?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  course,
  onWatchCourse,
  onOpenVipPayment,
}) => {
  const isPaid = course.planType === 'paid';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-right group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            {course.category}
          </span>

          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
              isPaid
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {course.priceBadge || (isPaid ? 'اشتراك VIP' : 'متاح مجاناً')}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{course.instructor}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{course.lessonsCount} محاضرات</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-700 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>+80 نقطة XP</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={() => {
            if (isPaid && onOpenVipPayment) {
              onOpenVipPayment();
            } else {
              onWatchCourse(course);
            }
          }}
          className={`w-full py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
            isPaid
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isPaid ? 'طلب اشتراك الكورس' : 'مشاهدة الكورس الآن (+80 XP)'}</span>
        </button>
      </div>
    </div>
  );
};
