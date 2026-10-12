import React, { useState, useEffect } from 'react';
import { awardPoints } from '../utils/gamification';
import { playNotificationChime } from '../utils/notificationAudio';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  Flame,
  CheckCircle2,
  Bell,
} from 'lucide-react';

interface StudyTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudyTimerModal: React.FC<StudyTimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    setTimeLeft(selectedMinutes * 60);
    setIsRunning(false);
  }, [selectedMinutes]);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      setCompletedSessions((prev) => prev + 1);
      playNotificationChime();
      awardPoints(40, `إتمام جلسة مذاكرة بومودورو (${selectedMinutes} دقيقة)`, 'bonus');
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, selectedMinutes]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = selectedMinutes * 60;
  const progressPercent = Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-right">
      <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-900">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                مؤقت التركيز والمذاكرة (Pomodoro)
              </h3>
              <p className="text-[11px] text-slate-400">
                قسّم وقتك لزيادة الاستيعاب وحصد نقاط التميز
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
        <div className="p-6 text-center space-y-5">
          {/* Preset Buttons */}
          <div className="flex items-center justify-center gap-2">
            {[
              { min: 15, label: '15 دقيقة (مراجعة)' },
              { min: 25, label: '25 دقيقة (بومودورو)' },
              { min: 50, label: '50 دقيقة (تركيز عميق)' },
            ].map((preset) => (
              <button
                key={preset.min}
                onClick={() => {
                  setSelectedMinutes(preset.min);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedMinutes === preset.min
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Big Clock Dial */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center rounded-full border-8 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white shadow-inner">
            <div className="space-y-1">
              <span className="text-4xl sm:text-5xl font-mono font-black text-indigo-950 tracking-wider">
                {formattedTime}
              </span>
              <div className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>جلسة تركيز</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/80">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'إيقاف مؤقت' : 'بدء المذاكرة'}</span>
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(selectedMinutes * 60);
              }}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              title="إعادة ضبط"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Reward note */}
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs text-amber-900 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>إتمام كل جلسة يمنحك تلقائياً <strong>+40 نقطة XP</strong> لترقية مستواك!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
