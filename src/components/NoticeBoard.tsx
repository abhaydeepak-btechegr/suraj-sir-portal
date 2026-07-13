import { Notice } from '../types';
import { Bell, Calendar, Megaphone, ShieldAlert, Award } from 'lucide-react';

interface NoticeBoardProps {
  notices: Notice[];
}

export default function NoticeBoard({ notices }: NoticeBoardProps) {
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Urgent':
        return {
          bg: 'bg-rose-50 border-rose-100',
          text: 'text-rose-700',
          iconBg: 'bg-rose-500',
          badge: 'bg-rose-100 text-rose-800 border-rose-200'
        };
      case 'Exam':
        return {
          bg: 'bg-amber-50 border-amber-100',
          text: 'text-amber-700',
          iconBg: 'bg-amber-500',
          badge: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      case 'Batch':
        return {
          bg: 'bg-blue-50 border-blue-100',
          text: 'text-blue-700',
          iconBg: 'bg-blue-500',
          badge: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-100',
          text: 'text-slate-700',
          iconBg: 'bg-slate-500',
          badge: 'bg-slate-100 text-slate-800 border-slate-200'
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="notice-board-widget">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg text-white animate-bounce">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base leading-snug">Latest Notices & Announcements</h3>
            <p className="text-blue-100 text-[11px]">Stay updated with schedules and events</p>
          </div>
        </div>
        <span className="text-[10px] bg-white/20 border border-white/30 text-white px-2 py-0.5 rounded-full font-bold">
          LIVE UPDATES
        </span>
      </div>

      {/* Notice List */}
      <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
        {notices.map((notice) => {
          const styles = getCategoryStyles(notice.category);
          return (
            <div 
              key={notice.id} 
              className={`p-5 hover:bg-slate-50/50 transition-colors flex gap-4 ${styles.bg} border-l-4 border-l-blue-600`}
              id={`notice-item-${notice.id}`}
            >
              <div className="flex-shrink-0">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white ${styles.iconBg} shadow-sm`}>
                  {notice.category === 'Urgent' && <ShieldAlert className="h-5 w-5" />}
                  {notice.category === 'Exam' && <Award className="h-5 w-5" />}
                  {notice.category === 'Batch' && <Megaphone className="h-5 w-5" />}
                  {notice.category === 'General' && <Bell className="h-5 w-5" />}
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold border px-2.5 py-0.5 rounded-full ${styles.badge}`}>
                    {notice.category}
                  </span>
                  <div className="flex items-center text-slate-400 text-xs gap-1">
                    <Calendar className="h-3 w-3" />
                    {notice.date}
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">
                  {notice.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {notice.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
