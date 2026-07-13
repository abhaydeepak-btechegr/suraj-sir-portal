import { useState, useEffect, useRef } from 'react';
import { MockTest, Question, TestAttempt } from '../types';
import { Award, Timer, BookOpen, AlertTriangle, HelpCircle, CheckCircle, XCircle, ChevronLeft, ChevronRight, Calculator, Sparkles, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MockTestSystemProps {
  tests: MockTest[];
  onCompleteAttempt: (attempt: TestAttempt) => void;
}

export default function MockTestSystem({ tests, onCompleteAttempt }: MockTestSystemProps) {
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [inExam, setInExam] = useState(false);
  const [instructionRead, setInstructionRead] = useState(false);

  // Active exam states
  const [activeQIdx, setActiveQIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [questionStates, setQuestionStates] = useState<Record<string, 'answered' | 'unanswered' | 'reviewed' | 'unvisited'>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examDurationSeconds, setExamDurationSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculator Widget states
  const [showCalc, setShowCalc] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');

  // Finished score states
  const [showReport, setShowReport] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<TestAttempt | null>(null);

  useEffect(() => {
    if (inExam && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleForceSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [inExam, timeLeft]);

  const handleStartExam = (test: MockTest) => {
    setSelectedTest(test);
    setInstructionRead(true);
    setInExam(true);
    setActiveQIdx(0);
    setSelectedAnswers({});
    
    // Initialize question states - first is unanswered (visited), rest are unvisited
    const initialStates: Record<string, 'answered' | 'unanswered' | 'reviewed' | 'unvisited'> = {};
    test.questions.forEach((q, idx) => {
      initialStates[q.id] = idx === 0 ? 'unanswered' : 'unvisited';
    });
    setQuestionStates(initialStates);

    const seconds = test.durationMinutes * 60;
    setTimeLeft(seconds);
    setExamDurationSeconds(seconds);
    setShowReport(false);
    setLastAttempt(null);
  };

  const handleForceSubmit = () => {
    handleSubmitExam();
  };

  const handleAnswerSelect = (optionIdx: number) => {
    if (!selectedTest) return;
    const qId = selectedTest.questions[activeQIdx].id;
    setSelectedAnswers({
      ...selectedAnswers,
      [qId]: optionIdx
    });
    setQuestionStates({
      ...questionStates,
      [qId]: 'answered'
    });
  };

  const handleMarkReview = () => {
    if (!selectedTest) return;
    const qId = selectedTest.questions[activeQIdx].id;
    setQuestionStates({
      ...questionStates,
      [qId]: 'reviewed'
    });
    // Jump next if available
    if (activeQIdx < selectedTest.questions.length - 1) {
      setActiveQIdx(activeQIdx + 1);
    }
  };

  const handleSaveNext = () => {
    if (!selectedTest) return;
    const qId = selectedTest.questions[activeQIdx].id;
    
    // If not answered yet, set to unanswered
    if (!selectedAnswers[qId] && selectedAnswers[qId] !== 0) {
      setQuestionStates({
        ...questionStates,
        [qId]: 'unanswered'
      });
    }

    if (activeQIdx < selectedTest.questions.length - 1) {
      const nextQId = selectedTest.questions[activeQIdx + 1].id;
      // Mark next question as unanswered (visited) if it was unvisited
      setQuestionStates((prev) => ({
        ...prev,
        [nextQId]: prev[nextQId] === 'unvisited' ? 'unanswered' : prev[nextQId]
      }));
      setActiveQIdx(activeQIdx + 1);
    }
  };

  const handleSubmitExam = () => {
    if (!selectedTest) return;
    if (timerRef.current) clearInterval(timerRef.current);

    let score = 0;
    let correctAnswers = 0;
    
    selectedTest.questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected === q.correctOption) {
        score += 4; // 4 marks per question
        correctAnswers++;
      }
    });

    const secondsTaken = examDurationSeconds - timeLeft;
    const minutesTaken = Math.max(1, Math.round(secondsTaken / 60));

    const attempt: TestAttempt = {
      testId: selectedTest.id,
      testTitle: selectedTest.title,
      score: score,
      totalMarks: selectedTest.questions.length * 4,
      correctAnswers: correctAnswers,
      totalQuestions: selectedTest.questions.length,
      date: new Date().toISOString().split('T')[0],
      timeTakenMinutes: minutesTaken
    };

    onCompleteAttempt(attempt);
    setLastAttempt(attempt);
    setInExam(false);
    setInstructionRead(false);
    setShowReport(true);
  };

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours > 0 ? hours + ':' : ''}${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculator logic
  const handleCalcBtn = (val: string) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else if (val === '=') {
      try {
        // Safe evaluation simulation
        const sanitized = calcInput.replace(/×/g, '*').replace(/÷/g, '/');
        const res = eval(sanitized);
        setCalcResult(res.toString());
      } catch (err) {
        setCalcResult('Error');
      }
    } else {
      setCalcInput((prev) => prev + val);
    }
  };

  if (showReport && lastAttempt && selectedTest) {
    const accuracy = lastAttempt.totalQuestions > 0 ? Math.round((lastAttempt.correctAnswers / lastAttempt.totalQuestions) * 100) : 0;
    return (
      <div className="space-y-8" id="test-report-screen">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-8 rounded-3xl text-white text-center relative overflow-hidden shadow-lg shadow-blue-500/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -z-10 pointer-events-none" />
          <Trophy className="h-16 w-16 text-yellow-300 mx-auto animate-bounce mb-3" />
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Mock Exam Report Card</h2>
          <p className="text-blue-100 text-sm mt-1">Excellent practice attempt! Keep learning to improve accuracy.</p>
        </div>

        {/* Score metrics bento grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-100 p-5 rounded-2xl text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FINAL SCORE</span>
            <strong className="text-3xl font-extrabold text-blue-600 tracking-tight">{lastAttempt.score} <span className="text-slate-400 text-sm">/ {lastAttempt.totalMarks} Marks</span></strong>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-2xl text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ACCURACY</span>
            <strong className="text-3xl font-extrabold text-emerald-600 tracking-tight">{accuracy}%</strong>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-2xl text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CORRECT ANSWERS</span>
            <strong className="text-3xl font-extrabold text-indigo-600 tracking-tight">{lastAttempt.correctAnswers} <span className="text-slate-400 text-sm">/ {lastAttempt.totalQuestions} Questions</span></strong>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-2xl text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TIME SPENT</span>
            <strong className="text-3xl font-extrabold text-slate-800 tracking-tight">{lastAttempt.timeTakenMinutes} <span className="text-slate-400 text-sm">Mins</span></strong>
          </div>
        </div>

        {/* Solutions section */}
        <div className="space-y-5 bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Detailed Solutions & Step Explanations</h3>
              <p className="text-xs text-slate-500">Examine derivations step-by-step to master concepts</p>
            </div>
            <button
              onClick={() => {
                setSelectedTest(null);
                setShowReport(false);
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors"
            >
              Finish Review
            </button>
          </div>

          <div className="space-y-6">
            {selectedTest.questions.map((q, idx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isCorrect = selectedOpt === q.correctOption;
              const isUnanswered = selectedOpt === undefined;

              return (
                <div 
                  key={q.id} 
                  className={`p-5 rounded-2xl border transition-all ${
                    isCorrect 
                      ? 'bg-emerald-50/50 border-emerald-100/60' 
                      : isUnanswered 
                      ? 'bg-slate-50 border-slate-100' 
                      : 'bg-rose-50/50 border-rose-100/60'
                  }`}
                  id={`review-question-${q.id}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <span className="text-xs font-extrabold text-slate-500">Question {idx+1}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      isCorrect 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : isUnanswered 
                        ? 'bg-slate-200 text-slate-700' 
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {isCorrect ? 'Correct (+4)' : isUnanswered ? 'Skipped (0)' : 'Incorrect (0)'}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-800 leading-relaxed mb-3">
                    {q.text}
                  </p>

                  {/* Options layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {q.options.map((opt, oIdx) => {
                      const optLabel = String.fromCharCode(65 + oIdx);
                      const isOptionSelected = selectedOpt === oIdx;
                      const isOptionCorrect = q.correctOption === oIdx;

                      let style = 'bg-white border-slate-200 text-slate-700';
                      if (isOptionCorrect) {
                        style = 'bg-emerald-100/80 border-emerald-400 text-emerald-900';
                      } else if (isOptionSelected) {
                        style = 'bg-rose-100/80 border-rose-400 text-rose-900';
                      }

                      return (
                        <div 
                          key={oIdx} 
                          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-3 ${style}`}
                        >
                          <span className="h-5 w-5 rounded bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                            {optLabel}
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Scientific derivation explanation text */}
                  <div className="bg-white/80 p-4 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600 font-normal leading-relaxed">
                    <strong className="text-slate-800 flex items-center gap-1.5 font-bold">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Suraj Sir’s Step Derivation:
                    </strong>
                    <p>{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (inExam && selectedTest) {
    const activeQ: Question = selectedTest.questions[activeQIdx];
    const statesList = selectedTest.questions.map((q) => questionStates[q.id] || 'unvisited');

    return (
      <div className="bg-slate-50 min-h-screen p-4 sm:p-6" id="exam-dashboard-frame">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Top Info Header Bar */}
          <div className="bg-white rounded-2xl border border-slate-150 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base sm:text-lg leading-tight">{selectedTest.title}</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">Standard JEE Advanced Single Option Correct CBT Simulator</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Scientific Calculator Trigger */}
              <button
                onClick={() => setShowCalc(!showCalc)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                  showCalc 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calculator className="h-4 w-4" />
                Calculator
              </button>

              {/* Countdown timer */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 font-mono text-sm font-bold">
                <Timer className="h-4 w-4 text-rose-600 animate-pulse" />
                {formatTimer(timeLeft)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Center Left column: Question layout & Options */}
            <div className="lg:col-span-8 bg-white border border-slate-150 shadow-sm rounded-2xl p-6 space-y-6">
              
              {/* Question text box */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Question {activeQIdx + 1} of {selectedTest.questions.length}
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase">
                    {activeQ.subject}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed font-normal">
                  {activeQ.text}
                </p>
              </div>

              {/* Options selection stack */}
              <div className="space-y-3">
                {activeQ.options.map((option, idx) => {
                  const optLetter = String.fromCharCode(65 + idx);
                  const isSelected = selectedAnswers[activeQ.id] === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center gap-4 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/50 border-blue-500 text-blue-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`h-6 w-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border transition-all ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                        {optLetter}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* CBT controls footer buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    disabled={activeQIdx === 0}
                    onClick={() => setActiveQIdx(activeQIdx - 1)}
                    className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  <button
                    onClick={handleMarkReview}
                    className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    Mark for Review
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveNext}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Save & Next <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to submit your answers?')) {
                        handleSubmitExam();
                      }
                    }}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    Submit Test
                  </button>
                </div>
              </div>
            </div>

            {/* Right column: Calculator Widget & Question palette */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Scientific Calculator widget */}
              <AnimatePresence>
                {showCalc && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, height: 0 }}
                    animate={{ opacity: 1, scale: 1, height: 'auto' }}
                    exit={{ opacity: 0, scale: 0.95, height: 0 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-400">
                      <span>Scientific CBT Calculator</span>
                      <button onClick={() => setShowCalc(false)} className="text-rose-400 hover:text-rose-300">Close</button>
                    </div>

                    <div className="space-y-3 font-mono">
                      {/* Calculator Screen Display */}
                      <div className="bg-slate-950 p-3 rounded-lg text-right text-emerald-400 font-mono text-sm leading-snug">
                        <div className="text-[10px] text-slate-500 min-h-[14px]">{calcInput || '0'}</div>
                        <div className="text-lg font-bold truncate mt-1">{calcResult || '0'}</div>
                      </div>

                      {/* Calculator Buttons Layout */}
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        {['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', 'sqrt(', '='].map((btn) => (
                          <button
                            key={btn}
                            onClick={() => handleCalcBtn(btn)}
                            className={`py-2 rounded-lg font-bold cursor-pointer transition-colors ${
                              btn === '=' ? 'bg-blue-600 text-white col-span-2 hover:bg-blue-500' :
                              btn === 'C' ? 'bg-rose-950 text-rose-300 border border-rose-900' :
                              'bg-slate-850 text-slate-300 border border-slate-850 hover:bg-slate-800'
                            }`}
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Question palette widget */}
              <div className="bg-white border border-slate-150 rounded-2xl p-5 space-y-4 shadow-xs">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question Palette</p>
                
                {/* Palette Circle Buttons Grid */}
                <div className="grid grid-cols-5 gap-2.5 justify-items-center">
                  {selectedTest.questions.map((q, idx) => {
                    const state = statesList[idx];
                    let circleStyle = 'bg-slate-100 text-slate-500 border border-slate-200';
                    if (state === 'answered') {
                      circleStyle = 'bg-emerald-500 border-emerald-500 text-white font-bold';
                    } else if (state === 'unanswered') {
                      circleStyle = 'bg-rose-500 border-rose-500 text-white font-bold animate-pulse';
                    } else if (state === 'reviewed') {
                      circleStyle = 'bg-purple-600 border-purple-600 text-white font-bold';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          // Mark current as visited if unvisited
                          setQuestionStates((prev) => ({
                            ...prev,
                            [q.id]: prev[q.id] === 'unvisited' ? 'unanswered' : prev[q.id]
                          }));
                          setActiveQIdx(idx);
                        }}
                        className={`h-9 w-9 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${circleStyle}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* State legends info */}
                <div className="border-t border-slate-50 pt-4 grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Answered
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500" /> Not Answered
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-600" /> Marked for Review
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-100 border border-slate-200" /> Not Visited
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="test-list-dashboard">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">National Mock Practice Exams</h2>
        <p className="text-sm text-slate-500">Attempt timed examinations matching current JEE Main/Advanced and NEET syllabus patterns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-blue-200"
            id={`test-card-${test.id}`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                  <Award className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-50 border border-slate-150 px-2.5 py-0.5 rounded-full">
                  {test.questions.length} Questions
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                  {test.subject}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight group-hover:text-blue-600 transition-colors">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal mt-2">
                  Take this standard time-bound Practice Test designed by Suraj Sir. Get instant analytical report sheets with comprehensive written step-by-step mathematical derivations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 pt-2 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="block text-slate-400 text-[9px] uppercase font-bold">DURATION</span>
                  <strong className="text-slate-800">{test.durationMinutes} Minutes</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="block text-slate-400 text-[9px] uppercase font-bold">TOTAL MARKS</span>
                  <strong className="text-slate-800">{test.totalMarks} Marks</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartExam(test)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              Start Practice Exam &rarr;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
