import React, { useState } from 'react';
import { X, Send, Phone, CheckCircle2, ChevronDown, HelpCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [studentName, setStudentName] = useState('');
  const [stage, setStage] = useState('ثانوية عامة');
  const [question, setQuestion] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                تواصل مع المنشئ وإدارة المنصة
              </h2>
              <p className="text-xs text-slate-300">
                للاستفسارات الدراسية والمذكرات والاشتراك ومتابعة الشروحات عبر التليجرام
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Quick Telegram Channel */}
          <div className="space-y-3">
            <a
              href="https://t.me/+2OhLLu7ofSoxNTNk"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white transition-all shadow-md flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base">
                    الانضمام إلى جروب المنصه على التليجرام
                  </div>
                  <div className="text-xs text-sky-100 font-medium">
                    اضغط هنا للانضمام ومتابعة المذكرات والأسئلة والدفع والتواصل المباشر
                  </div>
                </div>
              </div>
              <span className="hidden sm:inline-block bg-white text-sky-700 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0">
                فتح التليجرام ↗
              </span>
            </a>
          </div>

          {/* Form */}
          {sentSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">
                تم استلام سؤالك بنجاح!
              </h3>
              <p className="text-xs text-emerald-700">
                سيقوم المنشئ (Eng . Abdullah) وفريق الإشراف بالرد على استفسارك ومراجعة المسألة في أقرب وقت.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-slate-700">اسم الطالب / الطالبة:</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="اكتب اسمك الثلاثي"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-slate-700">المرحلة الدراسية:</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="ثانوية عامة - علمي">ثانوية عامة - علمي</option>
                    <option value="ثانوية عامة - أدبي">ثانوية عامة - أدبي</option>
                    <option value="دبلوم تجارة 3 سنوات">دبلوم تجارة - نظام 3 سنوات</option>
                    <option value="دبلوم تجارة 5 سنوات">دبلوم تجارة - نظام 5 سنوات</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-slate-700">سؤالك أو استفسارك الدراسي:</label>
                <textarea
                  rows={4}
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="اكتب رقم المسألة أو المادة أو الاستفسار الذي ترغب في شرحه..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>إرسال السؤال إلى المستر</span>
              </button>
            </form>
          )}

          {/* Quick FAQ summary */}
          <div className="border-t border-slate-200 pt-4 text-right space-y-2">
            <div className="text-xs font-bold text-slate-800">
              أسئلة تتكرر دائماً من الطلاب:
            </div>
            <div className="text-xs text-slate-600 space-y-1 leading-relaxed">
              <p>• <strong>هل جميع مذكرات المنصة مجانية؟</strong> نعم، جميع المذكرات متاحة للتحميل والقراءة مجاناً تماماً بصيغة PDF قابلة للطباعة.</p>
              <p>• <strong>هل تناسب المذكرات نظام البابل شيت الحديث؟</strong> نعم، تم إعدادها وصياغتها طبقاً لوزارة التربية والتعليم للعام 2026.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
