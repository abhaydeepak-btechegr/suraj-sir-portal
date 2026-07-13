import { useState, useEffect, SetStateAction } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NoticeBoard from './components/NoticeBoard';
import StudyPlanner from './components/StudyPlanner';
import DoubtForum from './components/DoubtForum';
import VideoPlayer from './components/VideoPlayer';
import BookViewer from './components/BookViewer';
import MockTestSystem from './components/MockTestSystem';
import ContactPage from './components/ContactPage';
import AdminPanel from './components/AdminPanel';
import StudentPortal from './components/StudentPortal';

import { 
  initialNotices, 
  initialVideoBatches, 
  initialBooks, 
  initialMockTests, 
  initialDoubts,
  initialPortalBatches
} from './data/initialData';

import { Notice, VideoBatch, Book, MockTest, Doubt, StudyGoal, TestAttempt, PortalBatch } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Phone, Mail, MapPin, GraduationCap, ArrowUpRight, Youtube, Star, Loader2 } from 'lucide-react';
import { 
  seedDatabaseIfEmpty, 
  syncCollection, 
  saveDocument, 
  deleteDocument 
} from './lib/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  // Firestore-backed state
  const [notices, setNotices] = useState<Notice[]>([]);
  const [videoBatches, setVideoBatches] = useState<VideoBatch[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [portalBatches, setPortalBatches] = useState<PortalBatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load local personal state from localStorage
  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>(() => {
    const saved = localStorage.getItem('srj_study_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>(() => {
    const saved = localStorage.getItem('srj_test_attempts');
    return saved ? JSON.parse(saved) : [];
  });

  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('srj_student_name') || 'Rohan Verma';
  });

  // Real-time Firestore synchronizer
  useEffect(() => {
    let active = true;
    let unsubNotices: () => void;
    let unsubPortalBatches: () => void;
    let unsubBooks: () => void;
    let unsubMockTests: () => void;
    let unsubDoubts: () => void;
    let unsubVideoBatches: () => void;

    async function initFirebase() {
      try {
        await seedDatabaseIfEmpty(
          initialNotices,
          initialPortalBatches,
          initialBooks,
          initialMockTests,
          initialDoubts
        );

        if (!active) return;

        unsubNotices = syncCollection<Notice>('notices', (data) => {
          if (active) setNotices(data);
        }, 'date', 'desc');

        unsubPortalBatches = syncCollection<PortalBatch>('portalBatches', (data) => {
          if (active) setPortalBatches(data);
        });

        unsubBooks = syncCollection<Book>('books', (data) => {
          if (active) setBooks(data);
        });

        unsubMockTests = syncCollection<MockTest>('mockTests', (data) => {
          if (active) setMockTests(data);
        });

        unsubDoubts = syncCollection<Doubt>('doubts', (data) => {
          if (active) {
            setDoubts(data);
            setIsLoading(false);
          }
        }, 'date', 'desc');

        unsubVideoBatches = syncCollection<VideoBatch>('videoBatches', (data) => {
          if (active) {
            if (data.length === 0) {
              initialVideoBatches.forEach(b => saveDocument('videoBatches', b.id, b));
            } else {
              setVideoBatches(data);
            }
          }
        });
      } catch (err) {
        console.error('Failed to initialize and sync Firestore collections:', err);
        if (active) setIsLoading(false);
      }
    }

    initFirebase();

    return () => {
      active = false;
      if (unsubNotices) unsubNotices();
      if (unsubPortalBatches) unsubPortalBatches();
      if (unsubBooks) unsubBooks();
      if (unsubMockTests) unsubMockTests();
      if (unsubDoubts) unsubDoubts();
      if (unsubVideoBatches) unsubVideoBatches();
    };
  }, []);

  // Local storage persistence for personal metrics
  useEffect(() => {
    localStorage.setItem('srj_study_goals', JSON.stringify(studyGoals));
  }, [studyGoals]);

  useEffect(() => {
    localStorage.setItem('srj_test_attempts', JSON.stringify(testAttempts));
  }, [testAttempts]);

  useEffect(() => {
    localStorage.setItem('srj_student_name', studentName);
  }, [studentName]);

  // Firestore Write wrappers for admin/student panels
  const handleSetPortalBatches = async (updater: SetStateAction<PortalBatch[]>) => {
    const nextVal = typeof updater === 'function' ? (updater as any)(portalBatches) : updater;
    
    // Find deleted
    const oldIds = new Set<string>(portalBatches.map(b => b.id));
    const newIds = new Set<string>(nextVal.map((b: PortalBatch) => b.id));
    for (const oldId of oldIds) {
      if (!newIds.has(oldId)) {
        await deleteDocument('portalBatches', oldId);
      }
    }

    // Save added or updated
    for (const batch of nextVal) {
      const oldBatch = portalBatches.find(b => b.id === batch.id);
      if (!oldBatch || JSON.stringify(oldBatch) !== JSON.stringify(batch)) {
        await saveDocument('portalBatches', batch.id, batch);
      }
    }
  };

  const handleSetBooks = async (updater: SetStateAction<Book[]>) => {
    const nextVal = typeof updater === 'function' ? (updater as any)(books) : updater;
    const oldIds = new Set<string>(books.map(b => b.id));
    const newIds = new Set<string>(nextVal.map((b: Book) => b.id));
    for (const oldId of oldIds) {
      if (!newIds.has(oldId)) {
        await deleteDocument('books', oldId);
      }
    }
    for (const book of nextVal) {
      const oldBook = books.find(b => b.id === book.id);
      if (!oldBook || JSON.stringify(oldBook) !== JSON.stringify(book)) {
        await saveDocument('books', book.id, book);
      }
    }
  };

  const handleSetMockTests = async (updater: SetStateAction<MockTest[]>) => {
    const nextVal = typeof updater === 'function' ? (updater as any)(mockTests) : updater;
    const oldIds = new Set<string>(mockTests.map(t => t.id));
    const newIds = new Set<string>(nextVal.map((t: MockTest) => t.id));
    for (const oldId of oldIds) {
      if (!newIds.has(oldId)) {
        await deleteDocument('mockTests', oldId);
      }
    }
    for (const test of nextVal) {
      const oldTest = mockTests.find(t => t.id === test.id);
      if (!oldTest || JSON.stringify(oldTest) !== JSON.stringify(test)) {
        await saveDocument('mockTests', test.id, test);
      }
    }
  };

  const handleSetNotices = async (updater: SetStateAction<Notice[]>) => {
    const nextVal = typeof updater === 'function' ? (updater as any)(notices) : updater;
    const oldIds = new Set<string>(notices.map(n => n.id));
    const newIds = new Set<string>(nextVal.map((n: Notice) => n.id));
    for (const oldId of oldIds) {
      if (!newIds.has(oldId)) {
        await deleteDocument('notices', oldId);
      }
    }
    for (const notice of nextVal) {
      const oldNotice = notices.find(n => n.id === notice.id);
      if (!oldNotice || JSON.stringify(oldNotice) !== JSON.stringify(notice)) {
        await saveDocument('notices', notice.id, notice);
      }
    }
  };

  // Handler functions
  const handleAddGoal = (text: string, subject: string, deadline: string) => {
    const newGoal: StudyGoal = {
      id: `g_${Date.now()}`,
      text,
      subject,
      deadline,
      completed: false
    };
    setStudyGoals([newGoal, ...studyGoals]);
  };

  const handleToggleGoal = (id: string) => {
    setStudyGoals(studyGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleDeleteGoal = (id: string) => {
    setStudyGoals(studyGoals.filter(g => g.id !== id));
  };

  const handleAddDoubt = async (title: string, description: string, subject: string, name: string) => {
    const newDoubt: Doubt = {
      id: `d_${Date.now()}`,
      studentName: name,
      subject,
      title,
      description,
      answers: [],
      date: new Date().toISOString().split('T')[0],
      resolved: false
    };
    await saveDocument('doubts', newDoubt.id, newDoubt);
  };

  const handleAddAnswer = async (doubtId: string, text: string, author: string, isTeacher: boolean) => {
    const d = doubts.find(item => item.id === doubtId);
    if (d) {
      const updatedDoubt = {
        ...d,
        resolved: isTeacher || d.resolved,
        answers: [
          ...d.answers,
          {
            author,
            text,
            date: new Date().toISOString().split('T')[0],
            isTeacher
          }
        ]
      };
      await saveDocument('doubts', doubtId, updatedDoubt);
    }
  };

  const handleCompleteAttempt = (attempt: TestAttempt) => {
    setTestAttempts([attempt, ...testAttempts]);
  };

  const handleDownloadBook = async (id: string) => {
    const book = books.find(b => b.id === id);
    if (book) {
      await saveDocument('books', id, { ...book, downloadCount: book.downloadCount + 1 });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white" id="app-loading-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
          <p className="text-xs text-slate-400 uppercase tracking-widest font-black font-mono">Syncing Suraj Sir Portal with Firebase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans" id="portal-root">
      
      {/* Sticky Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Live Marquee Scrolling Ticker representing live notices */}
      <div className="bg-blue-600 text-white text-xs py-2 overflow-hidden shadow-inner flex items-center select-none border-y border-blue-700">
        <div className="shrink-0 bg-blue-800 text-blue-100 font-bold px-3.5 py-0.5 ml-4 rounded-full text-[10px] tracking-wider uppercase mr-4">
          LATEST NEWS
        </div>
        <div className="whitespace-nowrap animate-marquee flex gap-16 font-semibold">
          {notices.map((n, i) => (
            <span key={i} className="flex items-center gap-1.5 text-blue-50">
              <Sparkles className="h-3 w-3 text-yellow-300 fill-yellow-300 shrink-0" />
              {n.title} ({n.date})
            </span>
          ))}
          {/* Duplicate to ensure seamless infinite scroll */}
          {notices.map((n, i) => (
            <span key={`dup-${i}`} className="flex items-center gap-1.5 text-blue-50">
              <Sparkles className="h-3 w-3 text-yellow-300 fill-yellow-300 shrink-0" />
              {n.title} ({n.date})
            </span>
          ))}
        </div>
      </div>

      {/* Main Body container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {activeTab === 'home' && (
              <div className="space-y-16">
                {/* Hero section */}
                <Hero setActiveTab={setActiveTab} />

                {/* Sub features grid layout (Notice board + Class reviews) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Notice Board Widget */}
                  <div className="lg:col-span-7">
                    <NoticeBoard notices={notices} />
                  </div>

                  {/* Right Column: Toppers Hall of Fame and Student Reviews */}
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">Topper Review Highlights</h3>
                        <p className="text-[11px] text-slate-500">Student reviews and recent ranks</p>
                      </div>
                      <div className="flex text-yellow-400">
                        <Star className="h-4.5 w-4.5 fill-yellow-400" />
                        <Star className="h-4.5 w-4.5 fill-yellow-400" />
                        <Star className="h-4.5 w-4.5 fill-yellow-400" />
                        <Star className="h-4.5 w-4.5 fill-yellow-400" />
                        <Star className="h-4.5 w-4.5 fill-yellow-400" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                        <p className="text-xs text-slate-600 leading-relaxed font-normal italic">
                          "Suraj Sir’s derivation sheets in Electrostatics made the difference. The step-by-step methods in calculus speed boosters are pure gold. Secured 99.6 percentile in mathematics!"
                        </p>
                        <div className="flex items-center gap-2.5">
                          <img className="h-8 w-8 rounded-full border" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80" alt="Reviewer" referrerPolicy="no-referrer" />
                          <div>
                            <span className="font-bold text-slate-800 text-xs block">Akash Singhal</span>
                            <span className="text-[10px] text-emerald-600 font-semibold">JEE Advanced AIR 420</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                        <p className="text-xs text-slate-600 leading-relaxed font-normal italic">
                          "Doubt resolution speed in the Student Portal is amazing. I posted a mechanics problem at 10 PM and got a detailed video step reply from Suraj Sir. Best learning portal ever."
                        </p>
                        <div className="flex items-center gap-2.5">
                          <img className="h-8 w-8 rounded-full border" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80" alt="Reviewer" referrerPolicy="no-referrer" />
                          <div>
                            <span className="font-bold text-slate-800 text-xs block">Meghna Iyer</span>
                            <span className="text-[10px] text-emerald-600 font-semibold">NEET Biology 355/360 Marks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'student' && (
              <StudentPortal
                studentName={studentName}
                setStudentName={setStudentName}
                goals={studyGoals}
                onAddGoal={handleAddGoal}
                onToggleGoal={handleToggleGoal}
                onDeleteGoal={handleDeleteGoal}
                doubts={doubts}
                onAddDoubt={handleAddDoubt}
                onAddAnswer={handleAddAnswer}
                attempts={testAttempts}
                portalBatches={portalBatches}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPanel
                portalBatches={portalBatches}
                setPortalBatches={handleSetPortalBatches}
                books={books}
                setBooks={handleSetBooks}
                tests={mockTests}
                setTests={handleSetMockTests}
                notices={notices}
                setNotices={handleSetNotices}
              />
            )}

            {activeTab === 'videos' && (
              <VideoPlayer batches={videoBatches} />
            )}

            {activeTab === 'books' && (
              <BookViewer books={books} onDownloadBook={handleDownloadBook} />
            )}

            {activeTab === 'mock' && (
              <MockTestSystem tests={mockTests} onCompleteAttempt={handleCompleteAttempt} />
            )}

            {activeTab === 'contact' && (
              <ContactPage />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Static Footer block */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 mt-20 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Branding col */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 text-white p-2 rounded-xl">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="font-sans font-extrabold text-white text-lg tracking-tight">Suraj Sir Portal</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                An advanced digital education portal catering premium video batches, test series CBT exams, and study materials for Mathematics & Sciences.
              </p>
            </div>

            {/* Quicklinks col */}
            <div className="space-y-3.5 text-xs font-semibold">
              <h4 className="text-white text-[10px] uppercase font-bold tracking-widest text-slate-300">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors cursor-pointer">Home Hub</button></li>
                <li><button onClick={() => setActiveTab('student')} className="hover:text-white transition-colors cursor-pointer">Student Desk</button></li>
                <li><button onClick={() => setActiveTab('videos')} className="hover:text-white transition-colors cursor-pointer">Video Classes</button></li>
                <li><button onClick={() => setActiveTab('books')} className="hover:text-white transition-colors cursor-pointer">Digital E-Books</button></li>
              </ul>
            </div>

            {/* Resources col */}
            <div className="space-y-3.5 text-xs font-semibold">
              <h4 className="text-white text-[10px] uppercase font-bold tracking-widest text-slate-300">Exam Resources</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveTab('mock')} className="hover:text-white transition-colors cursor-pointer">CBT Mock Exams</button></li>
                <li><button onClick={() => setActiveTab('student')} className="hover:text-white transition-colors cursor-pointer">Discussion Boards</button></li>
                <li><button onClick={() => setActiveTab('contact')} className="hover:text-white transition-colors cursor-pointer">Academic FAQs</button></li>
                <li><button onClick={() => setActiveTab('admin')} className="hover:text-white transition-colors cursor-pointer">Admin Command</button></li>
              </ul>
            </div>

            {/* Contact details col */}
            <div className="space-y-3 text-xs">
              <h4 className="text-white text-[10px] uppercase font-bold tracking-widest text-slate-300">Contact Desk</h4>
              <div className="space-y-2 text-slate-500 font-medium">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500 shrink-0" /> Sector 4, New Delhi, India</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-500 shrink-0" /> +91 98765 43210</div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-500 shrink-0" /> admissions@surajsirportal.com</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-10 pt-6 text-center text-[11px] text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>&copy; 2026 Suraj Sir Education Portal. All rights reserved. Designed for optimal high-speed mobile and desktop learning.</p>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-slate-500 transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-slate-500 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
