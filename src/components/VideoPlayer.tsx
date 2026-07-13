import { useState, useEffect, useRef } from 'react';
import { VideoBatch } from '../types';
import { Play, Pause, RotateCcw, Volume2, FastForward, Check, HelpCircle, Download, FileText, List, Sparkles } from 'lucide-react';

interface VideoPlayerProps {
  batches: VideoBatch[];
}

export default function VideoPlayer({ batches }: VideoPlayerProps) {
  const [selectedBatch, setSelectedBatch] = useState<VideoBatch | null>(null);
  const [activeLectureIdx, setActiveLectureIdx] = useState(0);
  const [activeRightTab, setActiveRightTab] = useState<'syllabus' | 'notes' | 'quiz'>('syllabus');

  // Video Simulator states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(80);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [checkedAnswers, setCheckedAnswers] = useState(false);

  // Setup sample quiz questions based on subject
  const getSyllabusQuiz = (subject: string) => {
    if (subject === 'Physics') {
      return [
        {
          q: 'Which of the following is correct for static friction?',
          opts: ['It is always constant', 'It is self-adjusting', 'It depends on area', 'It does no virtual work'],
          ans: 1,
          exp: 'Static friction adjusts its magnitude and direction to oppose relative motion tendency, up to a maximum limiting friction.'
        },
        {
          q: 'According to Gauss Law, electric flux through a closed surface is zero when:',
          opts: ['No charges are inside', 'Equal positive & negative charges are inside', 'All of the above', 'Electric field is perpendicular to surface'],
          ans: 2,
          exp: 'Flux is Q_enclosed / ε₀. If net enclosed charge is zero (no charges, or equal opposite charges), flux is zero.'
        }
      ];
    } else {
      return [
        {
          q: 'The sum of roots of 2x² - 8x + 6 = 0 is:',
          opts: ['4', '-4', '8', '3'],
          ans: 0,
          exp: 'Sum of roots is -b/a = -(-8)/2 = 4.'
        },
        {
          q: 'The limit as x approaches 0 of tan(x)/x is equal to:',
          opts: ['0', '1', 'Infinity', 'None of these'],
          ans: 1,
          exp: 'lim (x->0) tan(x)/x is a standard limit evaluating to 1.'
        }
      ];
    }
  };

  const sampleQuiz = getSyllabusQuiz(selectedBatch?.subject || 'Physics');

  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 180) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Reset states when changing batch/lecture
  const handleSelectBatch = (batch: VideoBatch) => {
    setSelectedBatch(batch);
    setActiveLectureIdx(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setQuizAnswers({});
    setCheckedAnswers(false);
  };

  if (!selectedBatch) {
    return (
      <div className="space-y-6" id="video-batches-list">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Interactive Video Classrooms</h2>
          <p className="text-sm text-slate-500">Choose a course below to study with Suraj Sir’s interactive high definition digital whiteboard classes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {batches.map((batch) => (
            <div
              key={batch.id}
              onClick={() => handleSelectBatch(batch)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group hover:border-blue-200"
              id={`batch-card-${batch.id}`}
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={batch.thumbnailUrl}
                    alt={batch.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                  <span className={`absolute top-4 left-4 text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg text-white shadow-sm ${
                    batch.subject === 'Physics' ? 'bg-indigo-600' : 'bg-blue-600'
                  }`}>
                    {batch.subject}
                  </span>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs text-blue-200 font-semibold">{batch.teacher}</p>
                    <h3 className="font-bold text-lg leading-tight line-clamp-1">{batch.title}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-3.5">
                  <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-3">
                    {batch.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {batch.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="text-slate-600 font-semibold">{batch.lecturesCount} Video Lectures</span>
                <span className="text-slate-600 font-semibold">{batch.duration} Total</span>
                <button className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer">
                  Start Learning &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="video-batch-player-view">
      {/* Return button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedBatch(null)}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
        >
          &larr; Back to Course Batches
        </button>
        <span className="text-xs text-slate-400 font-semibold">
          Active: <strong className="text-slate-700">{selectedBatch.title}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Video Player Screen & Info */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Simulated Whiteboard Video Player */}
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 flex flex-col justify-between" id="virtual-whiteboard">
            {/* Whiteboard content area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none relative">
              <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                RECORDED STREAM
              </div>

              {/* Dynamic educational diagram mock based on playtime */}
              <div className="space-y-3 font-mono text-slate-100 max-w-md">
                <p className="text-xs text-blue-400 font-semibold">// Live Lecture Whiteboard Board</p>
                <p className="text-sm font-bold text-white leading-tight">
                  Lecture {activeLectureIdx + 1}: {selectedBatch.syllabus[activeLectureIdx]}
                </p>
                
                {currentTime > 0 ? (
                  <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2 mt-4 text-left animate-fadeIn">
                    <span className="text-green-400 text-xs font-bold"># Concept Demonstration:</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {selectedBatch.subject === 'Physics' 
                        ? 'Applying static friction constraints. When the coefficient of friction is μ = 0.5, the angle of repose is θ = arctan(0.5) ≈ 26.5°.' 
                        : 'Integrating polynomial fractions using partial fractions: 1/(x²-a²) = (1/2a) * [1/(x-a) - 1/(x+a)]'}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>Drawing Speed: {playbackSpeed}x</span>
                      <span>Coordinates: [x: 140, y: 320]</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-slate-400 space-y-4">
                    <p className="text-xs font-medium">Click Play to begin the lecture playback stream</p>
                    <button 
                      onClick={() => setIsPlaying(true)}
                      className="mx-auto h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center cursor-pointer shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
                    >
                      <Play className="h-6 w-6 ml-1 text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Player Controls Bar */}
            <div className="bg-slate-950/90 border-t border-slate-800/50 px-5 py-3.5 flex items-center justify-between gap-4 select-none">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setCurrentTime(0)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Reset Video"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <span className="text-xs font-mono text-slate-300">{formatTime(currentTime)} / 3:00</span>
              </div>

              {/* Progress Bar slider */}
              <div className="flex-1 max-w-md hidden sm:block">
                <input
                  type="range"
                  min="0"
                  max="180"
                  value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-full appearance-none focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Volume bar */}
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Volume2 className="h-4 w-4 shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-16 accent-slate-300 cursor-pointer h-1 bg-slate-800 rounded-full appearance-none focus:outline-none"
                  />
                </div>

                {/* Speed indicator */}
                <button
                  onClick={() => {
                    const speeds = [1, 1.25, 1.5, 2];
                    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                    setPlaybackSpeed(speeds[nextIdx]);
                  }}
                  className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700 px-2 py-1 rounded-md hover:text-white transition-colors cursor-pointer"
                >
                  {playbackSpeed}x
                </button>
              </div>
            </div>
          </div>

          {/* Lecture Description & Teacher */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                Lecture {activeLectureIdx + 1}: {selectedBatch.syllabus[activeLectureIdx]}
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Syllabus Matched
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              In this recorded session, {selectedBatch.teacher} delivers rigorous explanations regarding {selectedBatch.syllabus[activeLectureIdx]}. Work along with the solved examples and make sure to download the associated reference notes below.
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Tabs (Playlist, notes, or quiz) */}
        <div className="lg:col-span-4 flex flex-col h-full min-h-[400px]">
          {/* Tab buttons header */}
          <div className="grid grid-cols-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {[
              { id: 'syllabus', label: 'Playlist', icon: List },
              { id: 'notes', label: 'PDF Notes', icon: FileText },
              { id: 'quiz', label: 'Practice Quiz', icon: HelpCircle },
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveRightTab(tab.id as any)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeRightTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <IconComp className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div className="mt-4 flex-1 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm overflow-y-auto max-h-[380px]">
            {activeRightTab === 'syllabus' && (
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lecture Playlist ({selectedBatch.syllabus.length})</p>
                {selectedBatch.syllabus.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveLectureIdx(index);
                      setCurrentTime(0);
                      setIsPlaying(false);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      activeLectureIdx === index
                        ? 'bg-blue-50/50 border-blue-200 text-blue-700'
                        : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`h-6 w-6 shrink-0 rounded-full flex items-center justify-center font-bold text-xs ${
                      activeLectureIdx === index ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="text-xs font-bold flex-1 leading-snug">
                      {topic}
                      <span className="block text-[10px] text-slate-400 font-normal mt-1">Duration: ~15 mins</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeRightTab === 'notes' && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chapter Classroom Notes</p>
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-4 text-center">
                  <div className="h-14 w-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                    <FileText className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Lecture {activeLectureIdx + 1} Study PDF</h4>
                    <p className="text-xs text-slate-500">Comprehensive handwritten derivation steps</p>
                  </div>
                  <button
                    onClick={() => alert('Reference Notes PDF download simulated successfully!')}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="h-4 w-4" /> Download Study Notes (PDF)
                  </button>
                </div>
              </div>
            )}

            {activeRightTab === 'quiz' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lecture Practice Quiz</p>
                  <button 
                    onClick={() => {
                      setQuizAnswers({});
                      setCheckedAnswers(false);
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-4">
                  {sampleQuiz.map((item, idx) => (
                    <div key={idx} className="space-y-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <p className="text-xs font-bold text-slate-800 leading-snug">
                        Q{idx+1}: {item.q}
                      </p>
                      
                      <div className="space-y-1.5">
                        {item.opts.map((opt, oIdx) => {
                          const isSelected = quizAnswers[idx] === oIdx;
                          const isCorrect = oIdx === item.ans;
                          
                          let optStyle = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50';
                          if (isSelected) {
                            optStyle = 'border-blue-500 bg-blue-50 text-blue-700';
                          }
                          if (checkedAnswers) {
                            if (isCorrect) {
                              optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800';
                            } else if (isSelected) {
                              optStyle = 'border-rose-500 bg-rose-50 text-rose-800';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => !checkedAnswers && setQuizAnswers({ ...quizAnswers, [idx]: oIdx })}
                              className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {checkedAnswers && isCorrect && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                            </button>
                          );
                        })}
                      </div>

                      {checkedAnswers && (
                        <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 mt-1 leading-relaxed">
                          <strong>Exp:</strong> {item.exp}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {!checkedAnswers ? (
                  <button
                    onClick={() => setCheckedAnswers(true)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    Verify Practice Answers
                  </button>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100/50 p-3 rounded-xl flex items-center gap-2 text-emerald-700 text-[10px] font-bold">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    Quiz completed! Re-watch the video anytime to clarify core physics derivations.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
