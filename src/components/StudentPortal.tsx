import React, { useState } from 'react';
import { StudyGoal, Doubt, TestAttempt, PortalBatch } from '../types';
import StudyPlanner from './StudyPlanner';
import DoubtForum from './DoubtForum';
import VideoBatches from './VideoBatches';
import { User, Award, CheckCircle, HelpCircle, History, Sparkles, Video } from 'lucide-react';

interface StudentPortalProps {
  studentName: string;
  setStudentName: (name: string) => void;
  goals: StudyGoal[];
  onAddGoal: (text: string, subject: string, deadline: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
  doubts: Doubt[];
  onAddDoubt: (title: string, description: string, subject: string, studentName: string) => void;
  onAddAnswer: (doubtId: string, text: string, author: string, isTeacher: boolean) => void;
  attempts: TestAttempt[];
  portalBatches: PortalBatch[];
}

export default function StudentPortal({
  studentName,
  setStudentName,
  goals,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal,
  doubts,
  onAddDoubt,
  onAddAnswer,
  attempts,
  portalBatches
}: StudentPortalProps) {
  const [activeSubView, setActiveSubView] = useState<'video_batches' | 'planner' | 'doubts' | 'history'>('video_batches');

  const resolvedCount = doubts.filter((d) => d.resolved).length;
  const metGoalsCount = goals.filter((g) => g.completed).length;

  return (
    <div className="space-y-8" id="student-portal-dashboard">
      
      {/* Dynamic Profile Personalization Card */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 border border-white/30 px-2 py-0.5 rounded-full">
                Class 12 Prep Mode
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            
            {/* Input to change name */}
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight">Welcome,</span>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name"
                className="bg-transparent font-extrabold text-xl sm:text-2xl border-b-2 border-dashed border-white/40 focus:border-white focus:outline-none w-48 sm:w-60 px-1 py-0.5 transition-all text-white placeholder-blue-200"
              />
            </div>
            <p className="text-blue-100 text-xs">Customize your profile name to track progress metrics</p>
          </div>
        </div>

        {/* Live Academic summary stats */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center min-w-[80px]">
            <span className="block text-[10px] text-blue-200 font-bold uppercase">GOALS MET</span>
            <strong className="text-white font-extrabold text-lg">{metGoalsCount}</strong>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center min-w-[80px]">
            <span className="block text-[10px] text-blue-200 font-bold uppercase">DOUBTS</span>
            <strong className="text-white font-extrabold text-lg">{doubts.length}</strong>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center min-w-[80px]">
            <span className="block text-[10px] text-blue-200 font-bold uppercase">EXAMS</span>
            <strong className="text-white font-extrabold text-lg">{attempts.length}</strong>
          </div>
        </div>
      </div>

      {/* Sub menu selectors */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-1">
        {[
          { id: 'video_batches', label: 'Video Batches', icon: Video },
          { id: 'planner', label: 'Study Planner', icon: CheckCircle },
          { id: 'doubts', label: 'Doubt Discussion Q&A', icon: HelpCircle },
          { id: 'history', label: 'Exam Test History', icon: History },
        ].map((sub) => {
          const IconComp = sub.icon;
          const isActive = activeSubView === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubView(sub.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <IconComp className="h-4.5 w-4.5" />
              {sub.label}
            </button>
          );
        })}
      </div>

      {/* Sub panel renders */}
      <div className="space-y-4">
        {activeSubView === 'video_batches' && (
          <VideoBatches batches={portalBatches} />
        )}

        {activeSubView === 'planner' && (
          <StudyPlanner
            goals={goals}
            onAddGoal={onAddGoal}
            onToggleGoal={onToggleGoal}
            onDeleteGoal={onDeleteGoal}
          />
        )}

        {activeSubView === 'doubts' && (
          <DoubtForum
            doubts={doubts}
            onAddDoubt={onAddDoubt}
            onAddAnswer={onAddAnswer}
          />
        )}

        {activeSubView === 'history' && (
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4" id="attempts-history-widget">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-50">
              <History className="h-5 w-5 text-indigo-500" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Mock CBT Attempt Logbook</h3>
                <p className="text-xs text-slate-500">View scores and solve derivations again to enhance grades</p>
              </div>
            </div>

            {attempts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Award className="h-12 w-12 text-slate-300 mx-auto" />
                <div>
                  <p className="font-bold text-slate-700 text-sm">No exam attempts logged yet</p>
                  <p className="text-xs text-slate-400">Head to the Mock Tests tab to take practice examinations</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Exam Series</th>
                      <th className="py-3 px-4">Attempt Date</th>
                      <th className="py-3 px-4">Marks Scored</th>
                      <th className="py-3 px-4">Time Spent</th>
                      <th className="py-3 px-4 text-center">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attempts.map((att, idx) => {
                      const percent = Math.round((att.score / att.totalMarks) * 100);
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-bold text-slate-800">{att.testTitle}</td>
                          <td className="py-3.5 px-4 text-slate-500 font-medium">{att.date}</td>
                          <td className="py-3.5 px-4">
                            <span className="font-extrabold text-blue-600">{att.score}</span>
                            <span className="text-slate-400 text-xs"> / {att.totalMarks}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">{att.timeTakenMinutes} Mins</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block text-[9px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                              percent >= 75 ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                              percent >= 50 ? 'bg-amber-50 text-amber-800 border-amber-100' :
                              'bg-rose-50 text-rose-800 border-rose-100'
                            }`}>
                              {percent}% Accuracy
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
