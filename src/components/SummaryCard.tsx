import React from 'react';
import { SummaryItem } from '../types';
import { FileText, Download, Eye, Bookmark, Check, Lock } from 'lucide-react';

interface SummaryCardProps {
  item: SummaryItem;
  onReadOnline: (item: SummaryItem) => void;
  onDownloadPdf: (item: SummaryItem) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  isCommerce?: boolean;
  onOpenVipPayment?: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  item,
  onReadOnline,
  onDownloadPdf,
  isSaved,
  onToggleSave,
  isCommerce = false,
  onOpenVipPayment,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between group">
      <div>
        {/* Card Header & Track */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                item.planType === 'paid'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {item.planType === 'paid' ? 'محتوى متقدم' : 'متاح مجاناً'}
            </span>
            <div className="text-xs font-semibold text-slate-500">
              <span>{item.subject}</span>
            </div>
          </div>

          <button
            onClick={() => onToggleSave(item.id)}
            title={isSaved ? 'إزالة من المحفوظات' : 'حفظ المذكرة'}
            className={`p-1.5 rounded-lg transition-colors ${
              isSaved
                ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 leading-snug">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {item.description}
        </p>

        {/* Unboxed Metadata Line with typographic separators */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-5 pb-4 border-b border-slate-100">
          <span>{item.pagesCount} صفحة</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{item.fileSize}</span>
          <span aria-hidden="true">·</span>
          <span>{item.term}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{item.year}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        {item.planType === 'paid' ? (
          <button
            onClick={() => (onOpenVipPayment ? onOpenVipPayment() : onReadOnline(item))}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-slate-950" />
            <span>فتح المذكرة الكاملة (باقة VIP)</span>
          </button>
        ) : isCommerce ? (
          <button
            onClick={() => onReadOnline(item)}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>تصفح الملخصات</span>
          </button>
        ) : (
          <button
            onClick={() => onDownloadPdf(item)}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>تحميل الملخصات (PDF)</span>
          </button>
        )}

        {/* Secondary Action */}
        <button
          onClick={() => {
            if (item.planType === 'paid' && onOpenVipPayment) {
              onOpenVipPayment();
            } else if (isCommerce) {
              onDownloadPdf(item);
            } else {
              onReadOnline(item);
            }
          }}
          className="w-full py-2 px-3 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          {item.planType === 'paid' ? (
            <span>تفاصيل تفعيل الاشتراك عبر التليجرام</span>
          ) : isCommerce ? (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>تحميل نسخة PDF للطباعة</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>قراءة المذكرة أونلاين</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
