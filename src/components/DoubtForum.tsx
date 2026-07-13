import React, { useState } from 'react';
import { Doubt } from '../types';
import { HelpCircle, Send, MessageSquare, CheckCircle, Search, HelpCircle as AskIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DoubtForumProps {
  doubts: Doubt[];
  onAddDoubt: (title: string, description: string, subject: string, studentName: string) => void;
  onAddAnswer: (doubtId: string, text: string, author: string, isTeacher: boolean) => void;
}

export default function DoubtForum({ doubts, onAddDoubt, onAddAnswer }: DoubtForumProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSubj, setNewSubj] = useState('Physics');
  const [studentName, setStudentName] = useState('');
  const [activeDoubtId, setActiveDoubtId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Simulated tutor response replies
  const handleAutoReply = (doubtId: string, doubtTitle: string, doubtDesc: string) => {
    // Generate a beautiful, highly detailed simulated answer from Suraj Sir
    setTimeout(() => {
      let customAnswer = '';
      if (doubtTitle.toLowerCase().includes('limit') || doubtDesc.toLowerCase().includes('limit')) {
        customAnswer = `Excellent limit doubt! Let's simplify this. Remember the fundamental expansion rule for (1 + x)^n or the standard limits like lim(x->0) (e^x - 1)/x = 1. Always evaluate the form first (0/0, inf/inf, 1^inf). For 1^inf forms, we can use the short-cut formula: lim f(x)^g(x) = e^[lim (f(x)-1)*g(x)]. Practice applying this to typical exam queries!`;
      } else if (doubtTitle.toLowerCase().includes('integral') || doubtDesc.toLowerCase().includes('integral')) {
        customAnswer = `Hello! Definite integrals are highly symmetrical. For complex trigonometric integrals from 0 to pi/2, always try the King's Rule first: Replace x with (a + b - x). In 90% of cases, the terms combine beautifully to cancel out the denominator. Keep practicing the standard integral forms!`;
      } else if (doubtTitle.toLowerCase().includes('rolling') || doubtDesc.toLowerCase().includes('inertia') || doubtDesc.toLowerCase().includes('torque')) {
        customAnswer = `Good question! In pure rolling on flat ground, the velocity of the lowest point of contact is zero. Therefore, friction is static (and does zero work!). You can apply conservation of mechanical energy safely. To find acceleration, write F = ma for center of mass translation and Torque = I*alpha about center of mass, and substitute the constraint a = alpha * R. Let me know if this clears it up!`;
      } else {
        customAnswer = `This is a very common conceptual doubt in Science and Math. The key is to start from the absolute fundamental definition. Isolate your variables and double check boundary conditions (e.g. is the system isolated? Is the mass constant?). Write down your equations step-by-step and keep track of sign conventions! Let's discuss further in our Saturday live masterclass.`;
      }

      onAddAnswer(doubtId, customAnswer, 'Suraj Sir', true);
    }, 1500);
  };

  const handleSubmitDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;
    
    const name = studentName.trim() || 'Anonymous Student';
    // Let's create a temporary unique id or use the list's size
    const newId = `d_${Date.now()}`;
    
    // Call parent handler
    onAddDoubt(newTitle.trim(), newDesc.trim(), newSubj, name);
    
    // Trigger simulated automatic teacher assistance
    handleAutoReply(newId, newTitle, newDesc);

    // Reset inputs
    setNewTitle('');
    setNewDesc('');
    setStudentName('');
  };

  const handlePostReply = (doubtId: string) => {
    if (!replyText.trim()) return;
    onAddAnswer(doubtId, replyText.trim(), 'Me (Student)', false);
    setReplyText('');
  };

  const filteredDoubts = doubts.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || d.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="doubt-forum-view">
      
      {/* Left Form Panel */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5 h-fit">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-50">
          <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
            <AskIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-tight">Ask a Doubt</h3>
            <p className="text-xs text-slate-500">Get solutions from Suraj Sir and peers</p>
          </div>
        </div>

        <form onSubmit={handleSubmitDoubt} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Your Name</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g., Rohan Verma"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 gap-1">
            <label className="text-xs font-bold text-slate-500">Subject Category</label>
            <select
              value={newSubj}
              onChange={(e) => setNewSubj(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="Physics">Physics 🌌</option>
              <option value="Mathematics">Mathematics 📐</option>
              <option value="Chemistry">Chemistry 🧪</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Question Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Moment of Inertia of Hollow Cone"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Detailed Description</label>
            <textarea
              rows={4}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Write your question, formulas used, and where you are stuck in detail..."
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/10 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Send className="h-4 w-4" /> Submit Doubt
          </button>
        </form>

        <div className="bg-indigo-50 border border-indigo-100/50 p-4 rounded-xl flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
          <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
            <strong>Instant AI Tutor Assistance Active:</strong> When you submit a doubt, Suraj Sir’s simulated tutor engine analyzes the topics and provides explanations within 2 seconds!
          </p>
        </div>
      </div>

      {/* Right List & Details Panel */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search active doubts..."
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Physics', 'Mathematics', 'Chemistry'].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`text-xs px-4 py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                  selectedSubject === sub
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Doubts Thread Stack */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {filteredDoubts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <HelpCircle className="h-12 w-12 text-slate-300 mx-auto" />
              <div>
                <p className="font-bold text-slate-700 text-sm">No matched doubts found</p>
                <p className="text-xs text-slate-400">Try modifying search term or select other subjects</p>
              </div>
            </div>
          ) : (
            filteredDoubts.map((doubt) => {
              const isExpanded = activeDoubtId === doubt.id;
              return (
                <div
                  key={doubt.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:border-slate-200"
                  id={`doubt-thread-${doubt.id}`}
                >
                  {/* Thread Header info */}
                  <div 
                    onClick={() => setActiveDoubtId(isExpanded ? null : doubt.id)}
                    className="p-5 flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          doubt.subject === 'Physics' ? 'bg-indigo-50 text-indigo-700' :
                          doubt.subject === 'Mathematics' ? 'bg-blue-50 text-blue-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {doubt.subject}
                        </span>
                        <span className="text-slate-400 text-[10px]">{doubt.date}</span>
                        <span className="text-slate-500 text-[10px] font-medium">• Asked by {doubt.studentName}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base hover:text-blue-600 transition-colors">
                        {doubt.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {doubt.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {doubt.answers.length > 0 ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                          <CheckCircle className="h-3.5 w-3.5" /> Resolved ({doubt.answers.length})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg">
                          <MessageSquare className="h-3.5 w-3.5" /> Pending tutor response
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-blue-600 hover:underline">
                        {isExpanded ? 'Hide Discussion' : 'Reply & Read Answers'}
                      </span>
                    </div>
                  </div>

                  {/* Discussion Expansion Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-50/50 border-t border-slate-50 p-5 space-y-4"
                      >
                        {/* Answers list */}
                        <div className="space-y-3">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Responses:</p>
                          
                          {doubt.answers.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">No answers posted yet. Type a response below to answer Rohan!</p>
                          ) : (
                            doubt.answers.map((ans, aIdx) => (
                              <div 
                                key={aIdx} 
                                className={`p-4 rounded-xl border ${
                                  ans.isTeacher 
                                    ? 'bg-blue-50/70 border-blue-100/50' 
                                    : 'bg-white border-slate-100 shadow-xs'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className={`text-xs font-bold ${ans.isTeacher ? 'text-blue-800' : 'text-slate-700'}`}>
                                    {ans.author} {ans.isTeacher && '🎓 (Verified Teacher)'}
                                  </span>
                                  <span className="text-[10px] text-slate-400">{ans.date}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
                                  {ans.text}
                                </p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Reply Form box */}
                        <div className="flex gap-2.5 pt-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your answer or ask follow-up info..."
                            className="flex-1 text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                          />
                          <button
                            onClick={() => handlePostReply(doubt.id)}
                            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            Reply
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
