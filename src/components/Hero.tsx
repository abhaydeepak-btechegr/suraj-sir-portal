import { motion } from 'motion/react';
import { BookOpen, Video, Award, FileText, ChevronRight, GraduationCap, Star, ShieldAlert, Sparkles, Compass } from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: string) => void;
}

export default function Hero({ setActiveTab }: HeroProps) {
  const stats = [
    { label: 'Enrolled Students', value: '15,000+', icon: GraduationCap, color: 'text-blue-600 bg-blue-50' },
    { label: 'Video Lectures', value: '850+', icon: Video, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Mock Test Series', value: '120+', icon: Award, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'E-Books & PDFs', value: '350+', icon: FileText, color: 'text-amber-600 bg-amber-50' },
  ];

  const features = [
    {
      title: 'Free Courses',
      desc: 'Access complete foundational concept videos of Physics & Mathematics for free.',
      icon: Compass,
      tabId: 'videos',
      tag: 'Free access',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Video Lectures',
      desc: 'Rigorous explanations, practical examples, and step-by-step problem-solving guides.',
      icon: Video,
      tabId: 'videos',
      tag: '4K HD quality',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'Mock Tests',
      desc: 'Attempt fully-timed Computer Based Tests (CBT) with instant detailed answer solutions.',
      icon: Award,
      tabId: 'mock',
      tag: 'JEE/NEET Pattern',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Study Material',
      desc: 'Quick revision sheets, cheat sheets, derivation guides, and chapter homework assignments.',
      icon: FileText,
      tabId: 'books',
      tag: 'Free PDFs',
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Books',
      desc: 'Read Suraj Sir’s exclusive textbooks online using our fast, immersive custom eBook reader.',
      icon: BookOpen,
      tabId: 'books',
      tag: 'Digital Library',
      color: 'from-red-500 to-rose-500',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white" id="hero-section">
      {/* Visual background shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-indigo-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Hero Banner Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Tag & Verified Educator Badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-semibold uppercase tracking-wider"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                Empowering Minds, Shaping Futures
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-white text-[11px] font-medium border border-slate-800 shadow-sm"
              >
                <img 
                  src="/src/assets/images/Screenshot 2026-07-09 201413.png" 
                  alt="Suraj Sir" 
                  className="h-5 w-5 rounded-full object-cover border border-blue-400"
                  referrerPolicy="no-referrer"
                />
                <span className="text-slate-300">Suraj Sir (IIT Roorkee)</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </motion.div>
            </div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight"
            >
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">Suraj Sir</span> Education Portal
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Learn Science and Mathematics with High Quality Video Lectures
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => setActiveTab('student')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                id="btn-hero-student"
              >
                <GraduationCap className="h-5 w-5" />
                Student Portal
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-700 hover:text-slate-900 font-semibold text-base border border-slate-200 hover:border-slate-300 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                id="btn-hero-admin"
              >
                <ShieldAlert className="h-5 w-5 text-indigo-500" />
                Admin Panel
              </button>
            </motion.div>

            {/* Student Trust Quote */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-3 text-sm text-slate-500"
            >
              <div className="flex -space-x-2">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Student" referrerPolicy="no-referrer" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Student" referrerPolicy="no-referrer" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Student" referrerPolicy="no-referrer" />
              </div>
              <div>
                <span className="font-bold text-slate-800">⭐ 4.9/5 Rating</span> from 2,500+ Board & JEE topper reviews.
              </div>
            </motion.div>
          </div>

          {/* Right Visual Column - High-fidelity Laptop Classroom Mockup */}
          <div className="lg:col-span-5 relative flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
              className="relative w-full max-w-lg px-2 lg:px-0"
            >
              {/* Laptop Display Shell */}
              <div className="relative mx-auto bg-slate-900 rounded-2xl p-2.5 shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-800/50 aspect-video lg:aspect-square md:aspect-video w-full overflow-hidden group">
                {/* Camera Notch */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 h-1.5 w-12 bg-slate-800 rounded-full z-20 flex items-center justify-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-slate-900" />
                  <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                </div>

                {/* Main Screen Content */}
                <div className="relative h-full w-full rounded-lg overflow-hidden bg-slate-950 flex flex-col justify-between">
                  {/* Web Browser Toolbar */}
                  <div className="bg-slate-900 border-b border-slate-800 px-3.5 py-2 flex items-center justify-between z-10 text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-rose-500" />
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="bg-slate-950 px-4 py-0.5 rounded-md text-slate-500 border border-slate-800 w-1/2 text-center truncate">
                      surajsirportal.com/live
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500 font-bold animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      LIVE
                    </div>
                  </div>

                  {/* Classroom Stream Frame */}
                  <div className="relative flex-1 w-full overflow-hidden group">
                    <img
                      src="/src/assets/images/Screenshot 2026-07-09 201413.png"
                      alt="Suraj Sir teaching Live"
                      className="absolute inset-0 h-full w-full object-cover object-top filter contrast-110 brightness-105 transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient shadow overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-slate-900/40" />

                    {/* Badge Overlays on Stream */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      <span className="px-2.5 py-1 rounded-md bg-red-600 text-white text-[9px] font-extrabold uppercase tracking-widest shadow-md shadow-red-600/20">
                        Live Class
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 text-[9px] font-bold border border-slate-700/50">
                        Class 10th Science & Maths
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-1 rounded-md bg-slate-950/90 text-yellow-400 text-[10px] font-bold border border-yellow-500/30 flex items-center gap-1 shadow-md">
                        ★ 4.9 Rating
                      </span>
                    </div>

                    {/* Interactive Play Button overlay for students */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <button 
                        onClick={() => setActiveTab('videos')}
                        className="p-4 rounded-full bg-blue-600/90 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/40 transform scale-90 group-hover:scale-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                      >
                        <Video className="h-6 w-6 animate-pulse" />
                      </button>
                    </div>

                    {/* Bottom Status Panel on video screen */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white z-10">
                      <div className="space-y-1 text-left">
                        <span className="text-[10px] text-blue-400 font-bold tracking-wide uppercase">Educator Profile</span>
                        <h4 className="text-sm font-extrabold text-slate-100 tracking-tight">Suraj Sir</h4>
                        <p className="text-[9px] text-slate-300 font-medium">M.Tech (IIT Roorkee) | 8+ Years Exp</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-bold block">15,000+ Enrolled</span>
                        <span className="text-[9px] text-slate-300">100% Free Lectures</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Keyboard Base Mockup */}
              <div className="relative mx-auto h-3 w-11/12 bg-slate-700 rounded-b-xl border-t border-slate-600 shadow-lg" />
              <div className="relative mx-auto h-1 w-1/4 bg-slate-800 rounded-b-md shadow-md" />

              {/* Decorative side floating cards to enrich layout */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-slate-100 rounded-xl p-3.5 shadow-xl flex items-center gap-2.5 max-w-[180px] hidden sm:flex">
                <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  95%
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-bold block">SUCCESS RATE</span>
                  <p className="text-xs font-black text-slate-800">Board Toppers</p>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white border border-slate-100 rounded-xl p-3.5 shadow-xl flex items-center gap-2.5 max-w-[180px] hidden sm:flex">
                <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Star className="h-4.5 w-4.5 fill-blue-600" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-bold block">FREE BATCHES</span>
                  <p className="text-xs font-black text-slate-800">Class 10 Science</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dynamic Stats Banner */}
        <div className="mt-16 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8" id="stats-banner">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div key={idx} className={`pt-4 md:pt-0 ${idx > 0 ? 'md:pl-6' : ''}`}>
                  <div className="flex items-center justify-center gap-2.5 mb-1.5">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Card Section */}
        <div className="mt-20 space-y-10" id="features-section">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">High Quality Resources Ready For You</h2>
            <p className="text-sm text-slate-500">Accelerate your academics with our highly optimized study modules</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, boxShadow: '0 12px 30px -10px rgba(59, 130, 246, 0.15)' }}
                  onClick={() => setActiveTab(feat.tabId)}
                  className="bg-white rounded-xl p-5 border border-slate-100 cursor-pointer flex flex-col justify-between transition-all group shadow-sm hover:border-blue-200"
                  id={`feature-card-${idx}`}
                >
                  <div className="space-y-4">
                    <div className={`inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-tr ${feat.color} text-white shadow-md shadow-slate-100`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50/70 border border-blue-100/50 px-2 py-0.5 rounded-full inline-block mb-2">
                        {feat.tag}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center text-xs font-semibold text-blue-600 gap-1 group-hover:gap-1.5 transition-all">
                    Explore Now
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
