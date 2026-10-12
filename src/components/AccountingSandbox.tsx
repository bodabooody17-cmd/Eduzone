import React, { useState } from 'react';
import { awardPoints } from '../utils/gamification';
import {
  Calculator,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  TrendingUp,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface TransactionExercise {
  id: string;
  scenario: string;
  amount: number;
  correctDebit: string;
  correctCredit: string;
  options: string[];
  explanation: string;
}

const SAMPLE_TRANSACTIONS: TransactionExercise[] = [
  {
    id: 'tx-1',
    scenario: 'اشترت المنشأة بضاعة بمبلغ 25,000 جنيه وسددت القيمة نقداً من الخزينة.',
    amount: 25000,
    correctDebit: 'حـ/ المشتريات',
    correctCredit: 'حـ/ الصندوق (الخزينة)',
    options: ['حـ/ المشتريات', 'حـ/ الصندوق (الخزينة)', 'حـ/ البنك', 'حـ/ الموردين', 'حـ/ المبيعات'],
    explanation: 'المشتريات أصل متداول زاد (مدين)، والخزينة أصل متداول نقص بالسداد (دائن).',
  },
  {
    id: 'tx-2',
    scenario: 'باعت المنشأة بضاعة بمبلغ 40,000 جنيه إلى محلات النور على الحساب (بالآجل).',
    amount: 40000,
    correctDebit: 'حـ/ العملاء (محلات النور)',
    correctCredit: 'حـ/ المبيعات',
    options: ['حـ/ المبيعات', 'حـ/ العملاء (محلات النور)', 'حـ/ الصندوق', 'حـ/ أوراق القبض'],
    explanation: 'العملاء أصل مدين زاد بالحق الآجل، والمبيعات إيراد طبيعته دائنة عند تحققه.',
  },
  {
    id: 'tx-3',
    scenario: 'سددت المنشأة إيجار المقر الإداري بمبلغ 6,000 جنيه بشيك مسحوب على البنك.',
    amount: 6000,
    correctDebit: 'حـ/ مصروف الإيجار',
    correctCredit: 'حـ/ البنك',
    options: ['حـ/ مصروف الإيجار', 'حـ/ البنك', 'حـ/ الصندوق', 'حـ/ رأس المال'],
    explanation: 'مصروف الإيجار مدين بطبيعته، والبنك أصل نقص بقيمة الشيك المسحوب (دائن).',
  },
];

export const AccountingSandbox: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDebit, setSelectedDebit] = useState<string>('');
  const [selectedCredit, setSelectedCredit] = useState<string>('');
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [earnedFeedback, setEarnedFeedback] = useState<string | null>(null);

  const tx = SAMPLE_TRANSACTIONS[currentIndex];
  const isCorrect = isEvaluated && selectedDebit === tx.correctDebit && selectedCredit === tx.correctCredit;

  const handleVerify = () => {
    if (!selectedDebit || !selectedCredit) return;
    setIsEvaluated(true);
    if (selectedDebit === tx.correctDebit && selectedCredit === tx.correctCredit) {
      awardPoints(35, `حل قيد محاسبي صحيح: ${tx.scenario.slice(0, 30)}...`, 'quiz');
      setEarnedFeedback('ممتاز! حصلت على +35 نقطة XP لحل القيد بنجاح.');
    } else {
      setEarnedFeedback('القيد غير دقيق. راجع طبيعة الحسابات والتفسير أدناه.');
    }
  };

  const handleNext = () => {
    setIsEvaluated(false);
    setSelectedDebit('');
    setSelectedCredit('');
    setEarnedFeedback(null);
    setCurrentIndex((prev) => (prev + 1) % SAMPLE_TRANSACTIONS.length);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs text-right space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              محاكي قيود اليومية المحاسبية التفاعلي (دبلوم التجارة والجامعات)
            </h3>
            <p className="text-[11px] text-slate-500">
              تدريب عملي تفاعلي على توجيه الحسابات المدينة والدائنة وفق نظرية القيد المزدوج
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-full">
          تمرين {currentIndex + 1} من {SAMPLE_TRANSACTIONS.length}
        </span>
      </div>

      {/* Scenario Box */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
        <span className="text-[10px] font-bold text-slate-400 block">العملية المالية:</span>
        <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
          {tx.scenario}
        </p>
        <div className="text-xs font-mono font-bold text-cyan-700">
          المبلغ: {tx.amount.toLocaleString()} جنيه مصري
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {/* Debit Account */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            الطرف المدين (من حـ /):
          </label>
          <select
            value={selectedDebit}
            onChange={(e) => {
              setSelectedDebit(e.target.value);
              setIsEvaluated(false);
            }}
            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold bg-white focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            <option value="">-- اختر الحساب المدين --</option>
            {tx.options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Credit Account */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            الطرف الدائن (إلى حـ /):
          </label>
          <select
            value={selectedCredit}
            onChange={(e) => {
              setSelectedCredit(e.target.value);
              setIsEvaluated(false);
            }}
            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold bg-white focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            <option value="">-- اختر الحساب الدائن --</option>
            {tx.options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={handleVerify}
          disabled={!selectedDebit || !selectedCredit}
          className="flex-1 py-2.5 px-4 bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>التحقق من صحة القيد (+35 XP)</span>
        </button>

        <button
          onClick={handleNext}
          className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          تمرين تالي
        </button>
      </div>

      {/* Feedback & Explanation */}
      {isEvaluated && (
        <div
          className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1.5 animate-fadeIn ${
            isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5">
            {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{earnedFeedback}</span>
          </div>
          <div className="text-[11px] text-slate-700 pt-1 border-t border-slate-200/60">
            <strong>القيد النموذجي:</strong> من {tx.correctDebit} إلى {tx.correctCredit} بمبلغ {tx.amount.toLocaleString()} ج.م.
          </div>
          <p className="text-[11px] text-slate-600">{tx.explanation}</p>
        </div>
      )}
    </div>
  );
};
