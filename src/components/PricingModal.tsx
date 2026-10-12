import React, { useState } from 'react';
import { X, Check, Crown, Sparkles, Send, ShieldCheck, Zap } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTelegram: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onOpenTelegram,
}) => {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn text-right">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-sky-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                خطة الاشتراكات والدفع - منصة EduZone (2026 / 2027)
              </h2>
              <p className="text-xs text-sky-200 mt-0.5">
                محتوى مجاني متاح للجميع + باقة VIP الشاملة لكورسات الجامعات والمراجعات
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

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto bg-slate-50">
          {/* Dual Tiers Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Free Tier */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between text-right">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                    الباقة الأساسية
                  </span>
                  <span className="text-xl font-black text-slate-900">مجاناً 100%</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">
                  الباقة المفتوحة للجميع
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  مناسبة لجميع الطلاب لمراجعة المناهج والملخصات الأساسية مجاناً
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>تحميل وقراءة مذكرات الثانوية العامة ودبلوم التجارة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>كورسات الشرح التأسيسي ومؤقت المذاكرة وبنك الأسئلة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>مدرب قيود اليومية المحاسبية التفاعلي</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>متابعة أخبار التعليم والتعليم العالي</span>
                  </li>
                </ul>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <span className="block text-center text-xs font-bold text-slate-500 py-2 bg-slate-100 rounded-xl">
                  مفعلة تلقائياً للجميع
                </span>
              </div>
            </div>

            {/* VIP Premium Tier */}
            <div className="bg-gradient-to-b from-slate-900 via-sky-950 to-slate-950 text-white rounded-2xl p-5 border-2 border-amber-400 shadow-xl flex flex-col justify-between text-right relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-br-xl shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>الأكثر طلباً</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    باقة VIP المميزة
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400 tabular-nums">100</span>
                    <span className="text-xs text-slate-300 mr-1 font-semibold">ج.م / شهرياً</span>
                  </div>
                </div>

                <h3 className="text-base font-black text-white mb-1">
                  الاشتراك الشهري الاحترافي
                </h3>
                <p className="text-xs text-sky-200 mb-4">
                  لكل طلاب الثانوية العامة، دبلوم التجارة، وطلاب الجامعات الراغبين في التفوق
                </p>

                <ul className="space-y-2.5 text-xs text-sky-100 border-t border-sky-800/60 pt-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>كورسات الجامعات وسوق العمل:</strong> ICDL، إنجليزي محادثة، برمجة وبايثون، محاسبة متقدمة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>مذكرات ليلة الامتحان الحصرية بنظام البابل شيت 2026 / 2027</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>نماذج امتحانات متوقعة وحلول نموذجية مع تلميحات المستر</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>متابعة شخصية وأولوية الرد في جروب التليجرام الرسمي</span>
                  </li>
                </ul>
              </div>

              <div className="mt-5 pt-3 border-t border-sky-800/60 space-y-2">
                <button
                  onClick={onOpenTelegram}
                  className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Send className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                  <span>انضم لجروب التليجرام لدفع الاشتراك وتفعيل VIP (100 ج.م)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Payment Methods Info Box */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 text-right">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>طرق السداد المعتمدة (فودافون كاش / انستاباي):</span>
              </span>
              <span className="text-[11px] text-slate-500">تفعيل فوري بعد التحويل</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              يمكنك سداد قيمة الاشتراك الشهري (<strong>100 جنيه مصري فقط</strong>) بسهولة عبر إحدى الطرق التالية، ثم إرسال سكرين شوت التحويل في جروب التليجرام ليتم فتح صلاحيات المواد فوراً:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">فودافون كاش / المحافظ الإلكترونية</div>
                  <div className="text-[11px] text-slate-500">تواصل عبر التليجرام لاستلام رقم المحفظة النشط</div>
                </div>
                <button
                  onClick={onOpenTelegram}
                  className="text-xs bg-sky-500 hover:bg-sky-600 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>دفع كاش عبر التليجرام</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">تطبيق InstaPay (انستاباي)</div>
                  <div className="text-[11px] text-slate-500">تحويل لحظي وإرسال إيصال الدفع في جروب التليجرام</div>
                </div>
                <button
                  onClick={onOpenTelegram}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>دفع انستاباي عبر التليجرام</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            EduZone التعليميه · تصميم Eng . Abdullah · جروب التليجرام: https://t.me/+2OhLLu7ofSoxNTNk
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-slate-700 hover:text-slate-900 font-bold cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
