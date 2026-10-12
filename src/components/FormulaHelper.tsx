import React, { useState } from 'react';
import { Sigma, Atom, Calculator, Zap, ChevronDown, ChevronUp } from 'lucide-react';

interface FormulaGroup {
  id: string;
  category: string;
  icon: any;
  items: { name: string; formula: string; note: string }[];
}

const FORMULA_GROUPS: FormulaGroup[] = [
  {
    id: 'physics',
    category: 'قوانين الفيزياء والكهربية',
    icon: Atom,
    items: [
      { name: 'قانون أوم', formula: 'V = I × R', note: 'فرق الجهد = شدة التيار × المقاومة' },
      { name: 'قانون كيرشوف الثاني', formula: 'Σ V_B = Σ (I × R)', note: 'مجموع القوى الدافعة = مجموع فروق الجهد' },
      { name: 'طاقة الفوتون', formula: 'E = h × ν = (h × c) / λ', note: 'ثابت بلانك × التردد' },
      { name: 'القوة الدافعة للدينامو', formula: 'emf = N × B × A × ω × sin(θ)', note: 'السرعة الزاوية ω = 2πf' },
    ],
  },
  {
    id: 'accounting',
    category: 'معادلات المحاسبة وإدارة الأعمال',
    icon: Calculator,
    items: [
      { name: 'معادلة المركز المالي', formula: 'الأصول = الالتزامات + حقوق الملكية', note: 'توازن طرفي الميزانية العمومية' },
      { name: 'صافي المبيعات', formula: 'إجمالي المبيعات - (مردودات + مسموحات + خصم مسموح به)', note: 'أساس حساب إيراد النشاط' },
      { name: 'مجمل الربح', formula: 'صافي المبيعات - تكلفة البضاعة المباعة', note: 'يظهر في حساب المتاجرة / قائمة الدخل' },
      { name: 'رأس المال العامل', formula: 'الأصول المتداولة - الخصوم المتداولة', note: 'مؤشر السيولة قصيرة الأجل' },
    ],
  },
];

export const FormulaHelper: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'physics' | 'accounting'>('physics');

  const currentGroup = FORMULA_GROUPS.find((g) => g.id === activeTab) || FORMULA_GROUPS[0];
  const IconComponent = currentGroup.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs text-right space-y-3.5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Sigma className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900">
              دليل القوانين والمعادلات السريعة
            </h3>
            <p className="text-[10px] text-slate-500">
              مراجع مركزة للمفاهيم الرياضية والفيزيائية والمحاسبية ليلة الامتحان
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
          <button
            onClick={() => setActiveTab('physics')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'physics' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            الفيزياء
          </button>
          <button
            onClick={() => setActiveTab('accounting')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'accounting' ? 'bg-white text-cyan-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            المحاسبة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {currentGroup.items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-colors space-y-1"
          >
            <span className="text-xs font-bold text-slate-800 block">{item.name}</span>
            <div className="font-mono font-black text-xs sm:text-sm text-indigo-950 bg-white p-1.5 rounded-lg border border-slate-200 dir-ltr text-center">
              {item.formula}
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
