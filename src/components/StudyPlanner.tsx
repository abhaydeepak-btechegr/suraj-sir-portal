import React, { useState } from 'react';
import { StudyGoal } from '../types';
import { Plus, Check, Trash2, Calendar, Target, Award, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudyPlannerProps {
  goals: StudyGoal[];
  onAddGoal: (text: string, subject: string, deadline: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

export default function StudyPlanner({ goals, onAddGoal, onToggleGoal, onDeleteGoal }: StudyPlannerProps) {
  const [newGoal, setNewGoal] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [deadline, setDeadline] = useState('');

  const completedCount = goals.filter((g) => g.completed).length;
  const progressPercent = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    onAddGoal(newGoal.trim(), subject, deadline || new Date().toISOString().split('T')[0]);
    setNewGoal('');
    setDeadline('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6" id="study-planner-component">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-700 p-2.5 rounded-xl">
            <ListTodo className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">My Personalized Study Planner</h3>
            <p className="text-xs text-slate-500">Plan and track your science and math goals</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500 block leading-none">GOALS MET</span>
            <span className="text-base font-extrabold text-blue-600">
              {completedCount}/{goals.length}
            </span>
          </div>
          <div className="w-24 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-extrabold text-slate-600">{progressPercent}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Add Goal Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-4 bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
            <Target className="h-4 w-4 text-blue-600 animate-pulse" />
            Add Study Target
          </h4>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">What do you want to learn?</label>
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="e.g., Complete Rotational Inertia questions"
              className="w-full text-sm px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="Physics">Physics 🌌</option>
                <option value="Mathematics">Mathematics 📐</option>
                <option value="Chemistry">Chemistry 🧪</option>
                <option value="General">General 📚</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Goal
          </button>
        </form>

        {/* Goals List */}
        <div className="lg:col-span-8 space-y-3 max-h-[340px] overflow-y-auto">
          {goals.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl space-y-3">
              <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
              <div>
                <p className="font-bold text-slate-700 text-sm">No study targets scheduled</p>
                <p className="text-xs text-slate-400">Define daily goals to keep your exam prep on schedule</p>
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {goals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    goal.completed 
                      ? 'bg-slate-50/60 border-slate-100' 
                      : 'bg-white border-slate-100 shadow-sm'
                  }`}
                  id={`goal-item-${goal.id}`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleGoal(goal.id)}
                      className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                        goal.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 hover:border-blue-500 bg-white'
                      }`}
                    >
                      {goal.completed && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <div>
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded mr-2 ${
                        goal.subject === 'Physics' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                        goal.subject === 'Mathematics' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        goal.subject === 'Chemistry' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-slate-50 text-slate-700 border border-slate-100'
                      }`}>
                        {goal.subject}
                      </span>
                      <p className={`text-sm font-semibold inline-block ${
                        goal.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                      }`}>
                        {goal.text}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                        <Calendar className="h-3 w-3" />
                        Target Date: {goal.deadline}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {goal.completed && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full animate-bounce">
                        <Award className="h-3 w-3" /> Done
                      </span>
                    )}
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
