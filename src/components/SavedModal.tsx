import React from 'react';
import { SummaryItem } from '../types';
import {
  X,
  Bookmark,
  Trash2,
  BookOpen,
  Download,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SummaryItem[];
  onRemoveSave: (id: string) => void;
  onReadOnline: (item: SummaryItem) => void;
  onDownloadPdf: (item: SummaryItem) => void;
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  savedItems,
  onRemoveSave,
  onReadOnline,
  onDownloadPdf,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-right">
      <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                المذكرات والمحتويات المحفوظة
              </h3>
              <p className="text-[11px] text-slate-400">
                قائمتك المفضلة للمراجعة السريعة ({savedItems.length} عنصر)
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

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50 space-y-3">
          {savedItems.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">لا توجد مذكرات محفوظة حالياً</h4>
              <p className="text-xs text-slate-400">
                اضغط على علامة الحفظ في أي مذكرة لإضافتها هنا والوصول إليها لاحقاً.
              </p>
            </div>
          ) : (
            savedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs hover:border-indigo-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                      {item.trackLabel}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {item.subject}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    {item.title}
                  </h4>
                  <div className="text-[11px] text-slate-400">
                    {item.pagesCount} صفحة · إعداد: {item.author}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      onClose();
                      onReadOnline(item);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>قراءة</span>
                  </button>

                  <button
                    onClick={() => onDownloadPdf(item)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                    title="تحميل PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveSave(item.id)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs cursor-pointer"
                    title="إزالة من المحفوظات"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
