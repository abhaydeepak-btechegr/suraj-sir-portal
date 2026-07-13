import React, { useState } from 'react';
import { 
  PortalBatch, 
  PortalSubject, 
  PortalLecture, 
  Book, 
  MockTest, 
  Question,
  Notice 
} from '../types';
import { 
  getYouTubeId,
  uploadVideoFile
} from '../lib/firebase';
import { 
  Video, 
  BookOpen, 
  Award, 
  Bell, 
  LayoutDashboard, 
  Plus, 
  Edit, 
  Trash2, 
  Sliders, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  ListPlus, 
  FolderPlus, 
  ChevronRight, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Eye, 
  FileText,
  BadgeAlert,
  GraduationCap,
  Loader2
} from 'lucide-react';

interface AdminPanelProps {
  portalBatches: PortalBatch[];
  setPortalBatches: React.Dispatch<React.SetStateAction<PortalBatch[]>>;
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  tests: MockTest[];
  setTests: React.Dispatch<React.SetStateAction<MockTest[]>>;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
}

export default function AdminPanel({
  portalBatches,
  setPortalBatches,
  books,
  setBooks,
  tests,
  setTests,
  notices,
  setNotices
}: AdminPanelProps) {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'videos' | 'books' | 'tests' | 'playlists' | 'notices'>('dashboard');

  // Success/Error toast simulator states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ----------------------------------------------------
  // VIDEO MANAGEMENT STATE & ACTIONS
  // ----------------------------------------------------
  const [selectedBatchId, setSelectedBatchId] = useState<string>(portalBatches[0]?.id || 'class_10');
  const [selectedSubjId, setSelectedSubjId] = useState<string>('science');
  const [editingLecture, setEditingLecture] = useState<PortalLecture | null>(null);
  const [isLectureFormOpen, setIsLectureFormOpen] = useState(false);

  // Lecture Form fields
  const [lecTitle, setLecTitle] = useState('');
  const [lecNum, setLecNum] = useState('');
  const [lecDuration, setLecDuration] = useState('');
  const [lecYtId, setLecYtId] = useState('');
  const [lecThumbUrl, setLecThumbUrl] = useState('');
  const [lecDesc, setLecDesc] = useState('');
  const [lecSimulatedFile, setLecSimulatedFile] = useState<string>('');

  // Firebase video upload states
  const [videoType, setVideoType] = useState<'youtube' | 'storage'>('youtube');
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const currentBatch = portalBatches.find(b => b.id === selectedBatchId);
  const currentSubject = currentBatch?.subjects[selectedSubjId];

  // Open form for adding a new lecture
  const openAddLectureForm = () => {
    setEditingLecture(null);
    // Auto increment lecture number
    const count = currentSubject?.lectures.length || 0;
    const formattedNum = `Lecture ${(count + 1).toString().padStart(2, '0')}`;
    setLecTitle('');
    setLecNum(formattedNum);
    setLecDuration('45 mins');
    setLecYtId('');
    setLecThumbUrl('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80');
    setLecDesc('');
    setLecSimulatedFile('');
    setVideoType('youtube');
    setUploadedUrl('');
    setIsUploading(false);
    setIsLectureFormOpen(true);
  };

  // Open form for editing an existing lecture
  const openEditLectureForm = (lec: PortalLecture) => {
    setEditingLecture(lec);
    setLecTitle(lec.title);
    setLecNum(lec.lectureNumber);
    setLecDuration(lec.duration);
    setLecYtId(lec.youtubeId || '');
    setLecThumbUrl(lec.thumbnailUrl);
    setLecDesc(lec.description);
    setLecSimulatedFile('');
    setVideoType(lec.videoType || 'youtube');
    setUploadedUrl(lec.videoUrl || '');
    setIsUploading(false);
    setIsLectureFormOpen(true);
  };

  // Save/Add lecture
  const handleSaveLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lecTitle.trim() || !lecNum.trim()) {
      showToast('Please enter Lecture Title and Number', 'error');
      return;
    }

    if (videoType === 'youtube' && !lecYtId.trim()) {
      showToast('Please enter a YouTube video URL or ID', 'error');
      return;
    }

    if (videoType === 'storage' && !uploadedUrl) {
      showToast('Please select and upload a video file to Firebase Storage first', 'error');
      return;
    }

    // Extract youtube ID if YouTube mode
    let cleanedYtId = '';
    if (videoType === 'youtube') {
      cleanedYtId = getYouTubeId(lecYtId);
    }

    // Prevent duplicate videos
    const currentSubjectLectures = currentSubject?.lectures || [];
    if (videoType === 'youtube') {
      const isDuplicate = currentSubjectLectures.some(l => 
        (!editingLecture || l.id !== editingLecture.id) && 
        l.videoType !== 'storage' && 
        l.youtubeId === cleanedYtId
      );
      if (isDuplicate) {
        showToast('Duplicate Video: A lecture with this YouTube link is already in this playlist!', 'error');
        return;
      }
    } else {
      const isDuplicate = currentSubjectLectures.some(l => 
        (!editingLecture || l.id !== editingLecture.id) && 
        l.videoUrl === uploadedUrl
      );
      if (isDuplicate) {
        showToast('Duplicate Video: This uploaded file is already in this playlist!', 'error');
        return;
      }
    }

    const updatedBatches = portalBatches.map(batch => {
      if (batch.id !== selectedBatchId) return batch;

      const subject = batch.subjects[selectedSubjId];
      if (!subject) return batch;

      let updatedLectures = [...subject.lectures];

      if (editingLecture) {
        // Edit mode
        updatedLectures = updatedLectures.map(l => {
          if (l.id === editingLecture.id) {
            return {
              ...l,
              title: lecTitle.trim(),
              lectureNumber: lecNum.trim(),
              duration: lecDuration.trim(),
              youtubeId: cleanedYtId,
              thumbnailUrl: lecThumbUrl.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
              description: lecDesc.trim(),
              videoUrl: uploadedUrl || undefined,
              videoType: videoType
            };
          }
          return l;
        });
        showToast('Lecture updated successfully!');
      } else {
        // Add mode
        const newLec: PortalLecture = {
          id: `lec_${Date.now()}`,
          lectureNumber: lecNum.trim(),
          title: lecTitle.trim(),
          duration: lecDuration.trim(),
          youtubeId: cleanedYtId,
          thumbnailUrl: lecThumbUrl.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
          description: lecDesc.trim(),
          videoUrl: uploadedUrl || undefined,
          videoType: videoType
        };
        updatedLectures.push(newLec);
        showToast('New lecture added successfully!');
      }

      return {
        ...batch,
        subjects: {
          ...batch.subjects,
          [selectedSubjId]: {
            ...subject,
            lectures: updatedLectures
          }
        }
      };
    });

    setPortalBatches(updatedBatches);
    setIsLectureFormOpen(false);
  };

  // Delete lecture
  const handleDeleteLecture = (lecId: string) => {
    if (!window.confirm('Are you sure you want to delete this lecture?')) return;

    const updatedBatches = portalBatches.map(batch => {
      if (batch.id !== selectedBatchId) return batch;

      const subject = batch.subjects[selectedSubjId];
      if (!subject) return batch;

      return {
        ...batch,
        subjects: {
          ...batch.subjects,
          [selectedSubjId]: {
            ...subject,
            lectures: subject.lectures.filter(l => l.id !== lecId)
          }
        }
      };
    });

    setPortalBatches(updatedBatches);
    showToast('Lecture deleted successfully!');
  };

  // Reorder lectures
  const moveLecture = (index: number, direction: 'up' | 'down') => {
    if (!currentSubject) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSubject.lectures.length) return;

    const updatedLectures = [...currentSubject.lectures];
    const temp = updatedLectures[index];
    updatedLectures[index] = updatedLectures[targetIndex];
    updatedLectures[targetIndex] = temp;

    const updatedBatches = portalBatches.map(batch => {
      if (batch.id !== selectedBatchId) return batch;
      return {
        ...batch,
        subjects: {
          ...batch.subjects,
          [selectedSubjId]: {
            ...batch.subjects[selectedSubjId],
            lectures: updatedLectures
          }
        }
      };
    });

    setPortalBatches(updatedBatches);
  };


  // ----------------------------------------------------
  // BOOK MANAGEMENT STATE & ACTIONS
  // ----------------------------------------------------
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);

  // Book Form Fields
  const [bookTitle, setBookTitle] = useState('');
  const [bookSubject, setBookSubject] = useState('Science');
  const [bookAuthor, setBookAuthor] = useState('Suraj Sir');
  const [bookPages, setBookPages] = useState(120);
  const [bookCat, setBookCat] = useState<'Class 11' | 'Class 12' | 'Competitive' | 'Foundation'>('Class 12');
  const [bookCoverUrl, setBookCoverUrl] = useState('');
  const [bookDesc, setBookDesc] = useState('');
  const [bookChaptersRaw, setBookChaptersRaw] = useState('');

  const openAddBookForm = () => {
    setEditingBook(null);
    setBookTitle('');
    setBookSubject('Science');
    setBookAuthor('Suraj Sir');
    setBookPages(150);
    setBookCat('Class 12');
    setBookCoverUrl('https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80');
    setBookDesc('');
    setBookChaptersRaw('Chapter 1: Solid Foundations\nChapter 2: Formulas & Derivations\nChapter 3: Question Bank Solved');
    setIsBookFormOpen(true);
  };

  const openEditBookForm = (book: Book) => {
    setEditingBook(book);
    setBookTitle(book.title);
    setBookSubject(book.subject);
    setBookAuthor(book.author);
    setBookPages(book.pages);
    setBookCat(book.classCategory);
    setBookCoverUrl(book.coverUrl);
    setBookDesc(book.description);
    setBookChaptersRaw(book.content.join('\n'));
    setIsBookFormOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim() || !bookDesc.trim()) {
      showToast('Please enter Book Title and Synopsis', 'error');
      return;
    }

    const chapters = bookChaptersRaw
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (editingBook) {
      // Edit mode
      const updated = books.map(b => {
        if (b.id === editingBook.id) {
          return {
            ...b,
            title: bookTitle.trim(),
            subject: bookSubject.trim(),
            author: bookAuthor.trim(),
            pages: bookPages,
            classCategory: bookCat,
            coverUrl: bookCoverUrl.trim() || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
            description: bookDesc.trim(),
            content: chapters,
          };
        }
        return b;
      });
      setBooks(updated);
      showToast('Book updated successfully!');
    } else {
      // Add mode
      const newBook: Book = {
        id: `book_${Date.now()}`,
        title: bookTitle.trim(),
        subject: bookSubject.trim(),
        author: bookAuthor.trim(),
        pages: bookPages,
        classCategory: bookCat,
        coverUrl: bookCoverUrl.trim() || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
        description: bookDesc.trim(),
        downloadCount: 0,
        content: chapters
      };
      setBooks([newBook, ...books]);
      showToast('Book created successfully!');
    }

    setIsBookFormOpen(false);
  };

  const handleDeleteBook = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    setBooks(books.filter(b => b.id !== id));
    showToast('Book deleted successfully!');
  };


  // ----------------------------------------------------
  // MOCK TEST MANAGEMENT STATE & ACTIONS
  // ----------------------------------------------------
  const [editingTest, setEditingTest] = useState<MockTest | null>(null);
  const [isTestFormOpen, setIsTestFormOpen] = useState(false);
  const [isQFormOpen, setIsQFormOpen] = useState(false);
  const [selectedTestForQuestions, setSelectedTestForQuestions] = useState<MockTest | null>(null);

  // Test form fields
  const [testTitle, setTestTitle] = useState('');
  const [testSubject, setTestSubject] = useState<'Physics' | 'Mathematics' | 'Chemistry' | 'Full Syllabus'>('Physics');
  const [testDuration, setTestDuration] = useState(30);

  // Question form fields
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState<number>(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qSubject, setQSubject] = useState<'Physics' | 'Mathematics' | 'Chemistry'>('Physics');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const openAddTestForm = () => {
    setEditingTest(null);
    setTestTitle('');
    setTestSubject('Physics');
    setTestDuration(30);
    setIsTestFormOpen(true);
  };

  const openEditTestForm = (test: MockTest) => {
    setEditingTest(test);
    setTestTitle(test.title);
    setTestSubject(test.subject);
    setTestDuration(test.durationMinutes);
    setIsTestFormOpen(true);
  };

  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim()) {
      showToast('Please enter test title', 'error');
      return;
    }

    if (editingTest) {
      const updated = tests.map(t => {
        if (t.id === editingTest.id) {
          return {
            ...t,
            title: testTitle.trim(),
            subject: testSubject,
            durationMinutes: testDuration,
          };
        }
        return t;
      });
      setTests(updated);
      showToast('Test details updated successfully!');
    } else {
      const newTest: MockTest = {
        id: `test_${Date.now()}`,
        title: testTitle.trim(),
        subject: testSubject,
        durationMinutes: testDuration,
        totalMarks: 0,
        questions: [],
        attemptsCount: 0
      };
      setTests([newTest, ...tests]);
      showToast('Mock test created! Now click "Manage Qs" to add questions.');
    }
    setIsTestFormOpen(false);
  };

  const handleDeleteTest = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;
    setTests(tests.filter(t => t.id !== id));
    showToast('Mock test deleted successfully!');
  };

  // Questions inside Test
  const openManageQuestions = (test: MockTest) => {
    setSelectedTestForQuestions(test);
    setQSubject(test.subject === 'Full Syllabus' ? 'Physics' : test.subject as any);
  };

  const openAddQuestionForm = () => {
    setEditingQuestion(null);
    setQText('');
    setQOptions(['', '', '', '']);
    setQCorrect(0);
    setQExplanation('');
    setIsQFormOpen(true);
  };

  const openEditQuestionForm = (q: Question) => {
    setEditingQuestion(q);
    setQText(q.text);
    setQOptions([...q.options]);
    setQCorrect(q.correctOption);
    setQExplanation(q.explanation);
    setQSubject(q.subject);
    setIsQFormOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || qOptions.some(o => !o.trim())) {
      showToast('Please fill out the question and all 4 options', 'error');
      return;
    }
    if (!selectedTestForQuestions) return;

    let updatedQuestions = [...selectedTestForQuestions.questions];

    if (editingQuestion) {
      // Edit mode
      updatedQuestions = updatedQuestions.map(q => {
        if (q.id === editingQuestion.id) {
          return {
            ...q,
            text: qText.trim(),
            options: qOptions.map(o => o.trim()),
            correctOption: qCorrect,
            explanation: qExplanation.trim(),
            subject: qSubject
          };
        }
        return q;
      });
      showToast('Question updated!');
    } else {
      // Add mode
      const newQ: Question = {
        id: `q_${Date.now()}`,
        text: qText.trim(),
        options: qOptions.map(o => o.trim()),
        correctOption: qCorrect,
        explanation: qExplanation.trim(),
        subject: qSubject
      };
      updatedQuestions.push(newQ);
      showToast('New question added to test!');
    }

    const updatedTests = tests.map(t => {
      if (t.id === selectedTestForQuestions.id) {
        return {
          ...t,
          questions: updatedQuestions,
          totalMarks: updatedQuestions.length * 4 // 4 marks per question
        };
      }
      return t;
    });

    setTests(updatedTests);
    // Sync current test state
    const currentSync = updatedTests.find(t => t.id === selectedTestForQuestions.id);
    if (currentSync) setSelectedTestForQuestions(currentSync);

    setIsQFormOpen(false);
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!selectedTestForQuestions) return;
    if (!window.confirm('Delete this question from the test?')) return;

    const updatedQuestions = selectedTestForQuestions.questions.filter(q => q.id !== qId);
    const updatedTests = tests.map(t => {
      if (t.id === selectedTestForQuestions.id) {
        return {
          ...t,
          questions: updatedQuestions,
          totalMarks: updatedQuestions.length * 4
        };
      }
      return t;
    });

    setTests(updatedTests);
    const currentSync = updatedTests.find(t => t.id === selectedTestForQuestions.id);
    if (currentSync) setSelectedTestForQuestions(currentSync);
    showToast('Question removed from test.');
  };


  // ----------------------------------------------------
  // PLAYLIST MANAGEMENT (SUBJECTS INSIDE BATCHES)
  // ----------------------------------------------------
  const [isPlaylistFormOpen, setIsPlaylistFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<{ batchId: string; sub: PortalSubject } | null>(null);

  // Playlist Form Fields
  const [plBatchId, setPlBatchId] = useState('class_10');
  const [plId, setPlId] = useState('');
  const [plName, setPlName] = useState('');
  const [plDesc, setPlDesc] = useState('');
  const [plIcon, setPlIcon] = useState('🔬');
  const [plColor, setPlColor] = useState('from-indigo-500 to-blue-600');

  const openAddPlaylistForm = () => {
    setEditingSubject(null);
    setPlBatchId('class_10');
    setPlId('');
    setPlName('');
    setPlDesc('');
    setPlIcon('🔬');
    setPlColor('from-emerald-500 to-teal-600');
    setIsPlaylistFormOpen(true);
  };

  const openEditPlaylistForm = (batchId: string, sub: PortalSubject) => {
    setEditingSubject({ batchId, sub });
    setPlBatchId(batchId);
    setPlId(sub.id);
    setPlName(sub.name);
    setPlDesc(sub.description);
    setPlIcon(sub.icon);
    setPlColor(sub.color);
    setIsPlaylistFormOpen(true);
  };

  const handleSavePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plName.trim() || !plDesc.trim()) {
      showToast('Please fill out Name and Description', 'error');
      return;
    }

    const playlistIdKey = plId.trim().toLowerCase() || plName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');

    const updated = portalBatches.map(batch => {
      if (batch.id !== plBatchId) return batch;

      const subjects = { ...batch.subjects };

      if (editingSubject) {
        // Edit mode
        subjects[editingSubject.sub.id] = {
          ...editingSubject.sub,
          name: plName.trim(),
          description: plDesc.trim(),
          icon: plIcon,
          color: plColor,
        };
        showToast('Playlist updated successfully!');
      } else {
        // Add mode
        if (subjects[playlistIdKey]) {
          showToast('A subject playlist with this ID already exists!', 'error');
          return batch;
        }
        subjects[playlistIdKey] = {
          id: playlistIdKey,
          name: plName.trim(),
          description: plDesc.trim(),
          icon: plIcon,
          color: plColor,
          lectures: []
        };
        showToast('New subject playlist created!');
      }

      return {
        ...batch,
        subjects
      };
    });

    setPortalBatches(updated);
    setIsPlaylistFormOpen(false);
  };

  const handleDeletePlaylist = (batchId: string, subjectKey: string) => {
    if (!window.confirm(`Are you sure you want to delete the "${subjectKey}" playlist? All associated video lectures inside will be permanently deleted.`)) return;

    const updated = portalBatches.map(batch => {
      if (batch.id !== batchId) return batch;

      const subjects = { ...batch.subjects };
      delete subjects[subjectKey];

      return {
        ...batch,
        subjects
      };
    });

    setPortalBatches(updated);
    showToast('Playlist deleted successfully!');
  };


  // ----------------------------------------------------
  // ANNOUNCEMENTS / NOTICES STATE & ACTIONS
  // ----------------------------------------------------
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isNoticeFormOpen, setIsNoticeFormOpen] = useState(false);

  // Notice form fields
  const [ntTitle, setNtTitle] = useState('');
  const [ntContent, setNtContent] = useState('');
  const [ntCat, setNtCat] = useState<'Urgent' | 'General' | 'Exam' | 'Batch'>('General');

  const openAddNoticeForm = () => {
    setEditingNotice(null);
    setNtTitle('');
    setNtContent('');
    setNtCat('General');
    setIsNoticeFormOpen(true);
  };

  const openEditNoticeForm = (notice: Notice) => {
    setEditingNotice(notice);
    setNtTitle(notice.title);
    setNtContent(notice.content);
    setNtCat(notice.category);
    setIsNoticeFormOpen(true);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ntTitle.trim() || !ntContent.trim()) {
      showToast('Please fill out notice title and content', 'error');
      return;
    }

    if (editingNotice) {
      const updated = notices.map(n => {
        if (n.id === editingNotice.id) {
          return {
            ...n,
            title: ntTitle.trim(),
            content: ntContent.trim(),
            category: ntCat
          };
        }
        return n;
      });
      setNotices(updated);
      showToast('Announcement updated!');
    } else {
      const newNotice: Notice = {
        id: `notice_${Date.now()}`,
        title: ntTitle.trim(),
        content: ntContent.trim(),
        date: new Date().toISOString().split('T')[0],
        category: ntCat
      };
      setNotices([newNotice, ...notices]);
      showToast('Announcement broadcasted successfully!');
    }
    setIsNoticeFormOpen(false);
  };

  const handleDeleteNotice = (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    setNotices(notices.filter(n => n.id !== id));
    showToast('Announcement deleted.');
  };


  // Total calculations for Dashboard metrics
  const totalLectures = portalBatches.reduce((acc, b) => {
    return acc + Object.values(b.subjects).reduce((sum, s) => sum + s.lectures.length, 0);
  }, 0);

  const totalPlaylists = portalBatches.reduce((acc, b) => acc + Object.keys(b.subjects).length, 0);

  const totalQuestionsCount = tests.reduce((acc, t) => acc + t.questions.length, 0);


  return (
    <div className="space-y-8" id="admin-panel-root">
      
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl border animate-slideIn ${
            toast.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span className="text-xs font-black tracking-tight">{toast.message}</span>
        </div>
      )}

      {/* Hero / Command Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative space-y-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/15 border border-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
              <Sliders className="h-3.5 w-3.5 shrink-0" /> Command Control Panel
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">Suraj Sir Academic Console</h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Fully operational administration dashboard with no logins required. Add, edit, or delete video lectures, study e-books, CBT mock test questions, and category playlists. Changes persist to local storage and update student screens immediately.
            </p>
          </div>
          
          <div className="flex gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-extrabold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>
        </div>
      </div>

      {/* Admin Sub Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5" id="admin-sub-tabs">
        {[
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, color: 'text-slate-600 border-slate-200 bg-slate-50' },
          { id: 'videos', label: 'Lectures', icon: Video, color: 'text-indigo-600 border-indigo-100 bg-indigo-50/40' },
          { id: 'books', label: 'eBooks Library', icon: BookOpen, color: 'text-blue-600 border-blue-100 bg-blue-50/40' },
          { id: 'tests', label: 'Mock CBT Tests', icon: Award, color: 'text-amber-600 border-amber-100 bg-amber-50/40' },
          { id: 'playlists', label: 'Playlists', icon: Layers, color: 'text-purple-600 border-purple-100 bg-purple-50/40' },
          { id: 'notices', label: 'Notices', icon: Bell, color: 'text-rose-600 border-rose-100 bg-rose-50/40' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedTestForQuestions(null);
              }}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                isActive 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-[1.02]' 
                  : 'bg-white border-slate-200/70 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className={`p-2.5 rounded-xl inline-flex w-fit ${isActive ? 'bg-white/10' : tab.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-black tracking-tight block">{tab.label}</span>
                <span className={`text-[10px] mt-0.5 block ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                  {tab.id === 'dashboard' && 'Metrics & Stats'}
                  {tab.id === 'videos' && `${totalLectures} Lectures`}
                  {tab.id === 'books' && `${books.length} E-Books`}
                  {tab.id === 'tests' && `${tests.length} Practice Tests`}
                  {tab.id === 'playlists' && `${totalPlaylists} Playlists`}
                  {tab.id === 'notices' && `${notices.length} Alerts`}
                </span>
              </div>
            </button>
          );
        })}
      </div>


      {/* ----------------------------------------------------
          TAB 1: DASHBOARD OVERVIEW
          ---------------------------------------------------- */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fadeIn" id="admin-dashboard-tab">
          
          {/* Quick Metrics Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider block">Total Student Batches</span>
                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">Classes</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-slate-900">{portalBatches.length}</span>
                <p className="text-[10px] text-slate-400 font-medium">Class 10th & Class 12th Free Curriculums</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider block">Video Lectures Published</span>
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">Videos</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-slate-900">{totalLectures}</span>
                <p className="text-[10px] text-slate-400 font-medium">Inside Science & Mathematics playlists</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider block">Active Mock Tests</span>
                <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">CBT</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-slate-900">{tests.length}</span>
                <p className="text-[10px] text-slate-400 font-medium">{totalQuestionsCount} Conceptual Questions seeded</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider block">Noticeboard Broadcasts</span>
                <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">Urgent</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-slate-900">{notices.length}</span>
                <p className="text-[10px] text-slate-400 font-medium">Active alerts, updates & timings</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Quick Actions Panel */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">Administrative Short-cuts</h3>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Quickly launch modals to inject content on student portal pages.</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => { setActiveTab('videos'); openAddLectureForm(); }}
                  className="w-full inline-flex items-center justify-between p-3.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 rounded-2xl text-slate-800 text-xs font-extrabold transition-all cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <Video className="h-4.5 w-4.5 text-blue-600" />
                    <span>Upload & Embed YouTube Video</span>
                  </span>
                  <Plus className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  onClick={() => { setActiveTab('books'); openAddBookForm(); }}
                  className="w-full inline-flex items-center justify-between p-3.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 rounded-2xl text-slate-800 text-xs font-extrabold transition-all cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4.5 w-4.5 text-blue-600" />
                    <span>Upload Study Book & Material</span>
                  </span>
                  <Plus className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  onClick={() => { setActiveTab('tests'); openAddTestForm(); }}
                  className="w-full inline-flex items-center justify-between p-3.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 rounded-2xl text-slate-800 text-xs font-extrabold transition-all cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <Award className="h-4.5 w-4.5 text-blue-600" />
                    <span>Create Mock Test & Series</span>
                  </span>
                  <Plus className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  onClick={() => { setActiveTab('playlists'); openAddPlaylistForm(); }}
                  className="w-full inline-flex items-center justify-between p-3.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 rounded-2xl text-slate-800 text-xs font-extrabold transition-all cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="h-4.5 w-4.5 text-blue-600" />
                    <span>Add New Subject Playlist</span>
                  </span>
                  <Plus className="h-4 w-4 text-slate-400" />
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-[11px] text-slate-500 leading-relaxed font-medium">
                <strong>💡 Tip for Teachers:</strong> To embed lectures smoothly, simply paste the full YouTube URL from your address bar (e.g., <code>https://youtube.com/watch?v=...</code>). The console parses the ID and renders it on the student platform instantly.
              </div>
            </div>

            {/* Recent Inventory Summary */}
            <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-slate-900 font-display">Dynamic Content Live Preview</h3>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">Check how batches are populated currently.</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">Live Preview</span>
              </div>

              <div className="space-y-4">
                {portalBatches.map(batch => (
                  <div key={batch.id} className="border border-slate-100 rounded-2xl p-4 space-y-3 hover:bg-slate-50/30 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">{batch.title}</h4>
                        <span className="text-[10px] font-bold text-slate-400">{batch.tagline}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {batch.rating} rating
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                      {Object.values(batch.subjects).map(sub => (
                        <div key={sub.id} className="flex items-center gap-2 text-xs">
                          <span className="p-1 rounded-lg bg-slate-100 text-slate-700">{sub.icon}</span>
                          <div>
                            <span className="font-bold text-slate-800 text-xs block">{sub.name}</span>
                            <span className="text-[10px] text-slate-400 block">{sub.lectures.length} video lectures</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ----------------------------------------------------
          TAB 2: LECTURES / VIDEO MANAGEMENT
          ---------------------------------------------------- */}
      {activeTab === 'videos' && (
        <div className="space-y-6 animate-fadeIn" id="admin-videos-tab">
          
          {/* Filtering Header & Trigger Button */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Target Batch</span>
                <select
                  value={selectedBatchId}
                  onChange={(e) => {
                    setSelectedBatchId(e.target.value);
                    // Reset selected subject to a valid key in that batch if necessary
                    const batch = portalBatches.find(b => b.id === e.target.value);
                    if (batch) {
                      const keys = Object.keys(batch.subjects);
                      if (keys.length > 0) setSelectedSubjId(keys[0]);
                    }
                  }}
                  className="text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
                >
                  {portalBatches.map(b => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Subject Playlist</span>
                <select
                  value={selectedSubjId}
                  onChange={(e) => setSelectedSubjId(e.target.value)}
                  className="text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
                >
                  {currentBatch && Object.values(currentBatch.subjects).map(s => (
                    <option key={s.id} value={s.id}>{s.name} {s.icon}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={openAddLectureForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5" /> Add Lecture Video
            </button>
          </div>

          {/* Lecture Editor Dialog Form (Modal-like Inline Drawer) */}
          {isLectureFormOpen && (
            <form onSubmit={handleSaveLecture} className="bg-slate-55 border border-blue-100 bg-blue-50/10 p-6 rounded-3xl space-y-4 shadow-inner">
              <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                <h4 className="font-extrabold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  <span>{editingLecture ? 'Edit Lecture Properties' : 'Create & Embed Lecture Video'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsLectureFormOpen(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Lecture Title *</label>
                      <input
                        type="text"
                        required
                        value={lecTitle}
                        onChange={(e) => setLecTitle(e.target.value)}
                        placeholder="e.g., Electrostatic Flux & Gauss Theorem derivations"
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Lecture Tag/Number *</label>
                      <input
                        type="text"
                        required
                        value={lecNum}
                        onChange={(e) => setLecNum(e.target.value)}
                        placeholder="e.g., Lecture 01"
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Duration Text</label>
                      <input
                        type="text"
                        value={lecDuration}
                        onChange={(e) => setLecDuration(e.target.value)}
                        placeholder="e.g., 45 mins"
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Video Source</label>
                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setVideoType('youtube')}
                          className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all ${
                            videoType === 'youtube'
                              ? 'bg-white text-blue-600 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          YouTube Embed
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoType('storage')}
                          className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all ${
                            videoType === 'storage'
                              ? 'bg-white text-blue-600 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Storage Upload
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {videoType === 'youtube' ? (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">YouTube ID or Link *</label>
                        <input
                          type="text"
                          required={videoType === 'youtube'}
                          value={lecYtId}
                          onChange={(e) => setLecYtId(e.target.value)}
                          placeholder="e.g., R97v_n2A1sU or full video link"
                          className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Uploaded Storage Video URL *</label>
                        <input
                          type="text"
                          required={videoType === 'storage'}
                          value={uploadedUrl}
                          onChange={(e) => setUploadedUrl(e.target.value)}
                          placeholder="Uploaded video direct download URL"
                          className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Video Description</label>
                    <textarea
                      rows={3}
                      value={lecDesc}
                      onChange={(e) => setLecDesc(e.target.value)}
                      placeholder="Detail topics covered, key proofs studied, and derivation indices..."
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-4 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Thumbnail Image URL</label>
                    <input
                      type="text"
                      value={lecThumbUrl}
                      onChange={(e) => setLecThumbUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Real Firebase Storage Upload Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                      {videoType === 'storage' ? 'Upload Video to Storage *' : 'Upload Thumbnail (Optional)'}
                    </label>
                    <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-white hover:bg-slate-50 transition-colors relative flex flex-col items-center justify-center text-center min-h-[120px]">
                      {isUploading ? (
                        <div className="flex flex-col items-center space-y-2">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                          <span className="text-[10px] font-bold text-slate-700 animate-pulse">Uploading file to Storage...</span>
                          <span className="text-[9px] text-slate-400">Please do not close this form</span>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            accept={videoType === 'storage' ? 'video/*' : 'image/*'}
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setIsUploading(true);
                                try {
                                  if (videoType === 'storage') {
                                    const downloadUrl = await uploadVideoFile(file);
                                    setUploadedUrl(downloadUrl);
                                    setLecSimulatedFile(file.name);
                                    if (!lecTitle) {
                                      setLecTitle(file.name.replace(/\.[^/.]+$/, ""));
                                    }
                                    showToast('Video file successfully uploaded to Firebase Storage!');
                                  } else {
                                    const downloadUrl = await uploadVideoFile(file);
                                    setLecThumbUrl(downloadUrl);
                                    setLecSimulatedFile(file.name);
                                    showToast('Thumbnail file uploaded successfully!');
                                  }
                                } catch (error) {
                                  showToast('Upload failed! Please check your connection.', 'error');
                                } finally {
                                  setIsUploading(false);
                                }
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Upload className="h-7 w-7 text-slate-400 mb-2" />
                          <span className="text-[11px] font-extrabold text-slate-700 block">Drag & Drop or Click to Upload</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">
                            {videoType === 'storage' ? 'MP4, WEBM (Max 2GB)' : 'PNG, JPG, WEBP'}
                          </span>
                        </>
                      )}
                    </div>
                    {lecSimulatedFile && (
                      <span className="text-[10px] text-emerald-600 font-bold block mt-1.5 flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> File Loaded: {lecSimulatedFile}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3.5 pt-4 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setIsLectureFormOpen(false)}
                  className="px-4.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-colors"
                >
                  {editingLecture ? 'Update Lecture' : 'Publish Lecture'}
                </button>
              </div>
            </form>
          )}

          {/* Video List Display inside selected category */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                  Active Playlists • {currentSubject?.lectures.length || 0} Lectures
                </h4>
                <p className="text-[10px] text-slate-400">Manage orders, update thumbnail details or remove old recordings.</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                {currentBatch?.title} &gt; {currentSubject?.name}
              </span>
            </div>

            {currentSubject && currentSubject.lectures.length > 0 ? (
              <div className="space-y-3.5">
                {currentSubject.lectures.map((lecture, index) => (
                  <div 
                    key={lecture.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-200/60 rounded-2xl gap-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="h-14 w-24 rounded-lg bg-slate-200 overflow-hidden relative shrink-0 border border-slate-200">
                        <img 
                          src={lecture.thumbnailUrl} 
                          alt={lecture.title} 
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-950/25 flex items-center justify-center">
                          <Play className="h-4.5 w-4.5 text-white drop-shadow-md" />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-100 border border-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded">
                            {lecture.lectureNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                            🕒 {lecture.duration}
                          </span>
                        </div>
                        <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight leading-snug">{lecture.title}</h5>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{lecture.description}</p>
                      </div>
                    </div>

                    {/* Actions and Sorting Controls */}
                    <div className="flex items-center justify-end gap-2.5 pt-3.5 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                      
                      {/* Move Up */}
                      <button
                        onClick={() => moveLecture(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer transition-colors"
                        title="Move Lecture Up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => moveLecture(index, 'down')}
                        disabled={index === currentSubject.lectures.length - 1}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer transition-colors"
                        title="Move Lecture Down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => openEditLectureForm(lecture)}
                        className="p-2 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/20 rounded-lg text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                        title="Edit Lecture details"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteLecture(lecture.id)}
                        className="p-2 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 rounded-lg text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Lecture"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                <Video className="h-10 w-10 mx-auto text-slate-300 mb-2.5 animate-bounce" />
                No lectures are currently found in this subject playlist. Click "Add Lecture Video" to publish your first lesson!
              </div>
            )}
          </div>

        </div>
      )}


      {/* ----------------------------------------------------
          TAB 3: BOOK MANAGEMENT
          ---------------------------------------------------- */}
      {activeTab === 'books' && (
        <div className="space-y-6 animate-fadeIn" id="admin-books-tab">
          
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 font-display">Manage eBooks & Class Material</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Publish downloadable e-books or conceptual solution companions for board exams.</p>
            </div>
            <button
              onClick={openAddBookForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-all shrink-0"
            >
              <Plus className="h-4.5 w-4.5" /> Publish eBook Companion
            </button>
          </div>

          {isBookFormOpen && (
            <form onSubmit={handleSaveBook} className="bg-slate-55 border border-blue-100 bg-blue-50/10 p-6 rounded-3xl space-y-4 shadow-inner">
              <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                <h4 className="font-extrabold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>{editingBook ? 'Edit eBook Metadata' : 'Publish New Study Material / eBook'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsBookFormOpen(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">eBook Title *</label>
                      <input
                        type="text"
                        required
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        placeholder="e.g., NCERT Solutions Companion: Calculus"
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Subject *</label>
                      <input
                        type="text"
                        required
                        value={bookSubject}
                        onChange={(e) => setBookSubject(e.target.value)}
                        placeholder="e.g., Mathematics, Physics, Chemistry"
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Author *</label>
                      <input
                        type="text"
                        required
                        value={bookAuthor}
                        onChange={(e) => setBookAuthor(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Pages *</label>
                      <input
                        type="number"
                        required
                        value={bookPages}
                        onChange={(e) => setBookPages(Number(e.target.value))}
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Class Target *</label>
                      <select
                        value={bookCat}
                        onChange={(e) => setBookCat(e.target.value as any)}
                        className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl"
                      >
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12">Class 12</option>
                        <option value="Competitive">Competitive (JEE/NEET)</option>
                        <option value="Foundation">Foundation</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Synopsis / Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={bookDesc}
                      onChange={(e) => setBookDesc(e.target.value)}
                      placeholder="Summarize textbook features and diagnostic chapters covered..."
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-4 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Book Cover URL</label>
                    <input
                      type="text"
                      value={bookCoverUrl}
                      onChange={(e) => setBookCoverUrl(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Chapter Index / Reader Content *</label>
                    <textarea
                      rows={5}
                      required
                      value={bookChaptersRaw}
                      onChange={(e) => setBookChaptersRaw(e.target.value)}
                      placeholder="Write chapters or book pages, one per line..."
                      className="w-full text-xs px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-mono"
                    />
                    <span className="text-[9px] text-slate-400 block">Separating chapters with newlines populates pages inside the Student Online PDF Reader automatically.</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3.5 pt-4 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setIsBookFormOpen(false)}
                  className="px-4.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
                >
                  {editingBook ? 'Update eBook metadata' : 'Publish Study eBook'}
                </button>
              </div>
            </form>
          )}

          {/* eBooks listing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {books.map(book => (
              <div 
                key={book.id} 
                className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex gap-4 hover:border-slate-300 transition-all"
              >
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  className="w-20 h-28 object-cover rounded-xl border border-slate-200 shrink-0 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-blue-50 border border-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                        {book.classCategory}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {book.subject}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-950 text-sm tracking-tight leading-snug mt-1.5">{book.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">By {book.author} • {book.pages} pages</p>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{book.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                    <span className="text-[10px] text-slate-400 font-semibold">📥 {book.downloadCount} Downloads</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditBookForm(book)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                        title="Edit Book properties"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete Book"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}


      {/* ----------------------------------------------------
          TAB 4: MOCK CBT TESTS
          ---------------------------------------------------- */}
      {activeTab === 'tests' && (
        <div className="space-y-6 animate-fadeIn" id="admin-tests-tab">
          
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 font-display">Manage Mock CBT Test Series</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Design time-bound exam papers, append multiple choice questions, and monitor average high scores.</p>
            </div>
            <button
              onClick={openAddTestForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-all"
            >
              <Plus className="h-4.5 w-4.5" /> Create Mock Test
            </button>
          </div>

          {isTestFormOpen && (
            <form onSubmit={handleSaveTest} className="bg-slate-55 border border-blue-100 bg-blue-50/10 p-5 rounded-3xl space-y-4 shadow-inner max-w-xl">
              <h4 className="font-extrabold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                <span>{editingTest ? 'Edit Test Properties' : 'Create New Mock Test Series'}</span>
              </h4>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Test Title *</label>
                <input
                  type="text"
                  required
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="e.g., Kinematics Challenge & Speed Drill 05"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Subject Category *</label>
                  <select
                    value={testSubject}
                    onChange={(e) => setTestSubject(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Full Syllabus">Full Syllabus</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Duration (Minutes) *</label>
                  <input
                    type="number"
                    required
                    value={testDuration}
                    onChange={(e) => setTestDuration(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTestFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
                >
                  Save Test Details
                </button>
              </div>
            </form>
          )}

          {/* Manage Questions Sub-drawer/Section */}
          {selectedTestForQuestions && (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Managing Questions for</span>
                    <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {selectedTestForQuestions.subject}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base mt-1 tracking-tight">{selectedTestForQuestions.title}</h4>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={openAddQuestionForm}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Question
                  </button>
                  <button
                    onClick={() => setSelectedTestForQuestions(null)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-extrabold text-xs rounded-xl hover:bg-slate-100 cursor-pointer"
                  >
                    Close Manager
                  </button>
                </div>
              </div>

              {/* Question Seeder Drawer Form */}
              {isQFormOpen && (
                <form onSubmit={handleSaveQuestion} className="bg-white border border-blue-100 p-5 rounded-2xl space-y-4 shadow-sm">
                  <h5 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">
                    {editingQuestion ? 'Edit Question Properties' : 'Seeding New Mock MCQ'}
                  </h5>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Question Prompt / Problem Text *</label>
                    <textarea
                      rows={3}
                      required
                      value={qText}
                      onChange={(e) => setQText(e.target.value)}
                      placeholder="e.g., A cylinder of mass M and radius R rolls without slipping down an incline. Find acceleration..."
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {qOptions.map((opt, i) => (
                      <div key={i} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Option {String.fromCharCode(65 + i)} *</label>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => {
                            const copy = [...qOptions];
                            copy[i] = e.target.value;
                            setQOptions(copy);
                          }}
                          placeholder={`Option ${i+1} text`}
                          className="w-full text-xs px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Correct Solution Option *</label>
                      <select
                        value={qCorrect}
                        onChange={(e) => setQCorrect(Number(e.target.value))}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl font-bold"
                      >
                        <option value={0}>Option A (Correct)</option>
                        <option value={1}>Option B (Correct)</option>
                        <option value={2}>Option C (Correct)</option>
                        <option value={3}>Option D (Correct)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Topic Track</label>
                      <select
                        value={qSubject}
                        onChange={(e) => setQSubject(e.target.value as any)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl"
                      >
                        <option value="Physics">Physics</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Chemistry">Chemistry</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Diagnostic Solution/Explanation</label>
                      <input
                        type="text"
                        value={qExplanation}
                        onChange={(e) => setQExplanation(e.target.value)}
                        placeholder="Provide deep steps to verify correct logic..."
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsQFormOpen(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-500 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
                    >
                      Save Question
                    </button>
                  </div>
                </form>
              )}

              {/* Questions list within that test */}
              <div className="space-y-3">
                {selectedTestForQuestions.questions.length > 0 ? (
                  selectedTestForQuestions.questions.map((q, qIndex) => (
                    <div key={q.id} className="bg-white border border-slate-200/60 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          Q{qIndex + 1} • {q.subject}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditQuestionForm(q)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-50 cursor-pointer"
                            title="Edit Question properties"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-50 cursor-pointer"
                            title="Delete Question"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-relaxed">{q.text}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, optIdx) => (
                          <div 
                            key={optIdx} 
                            className={`p-2 rounded-xl border flex items-center gap-2 ${
                              optIdx === q.correctOption 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold' 
                                : 'bg-slate-50/50 border-slate-150 text-slate-600'
                            }`}
                          >
                            <span className={`h-5 w-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                              optIdx === q.correctOption ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic leading-relaxed">
                          <strong>Solution Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs">
                    <AlertCircle className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    No questions exist in this mock test yet. Click "Add Question" above to start seeding MCQs.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Test Listing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map(test => (
              <div 
                key={test.id} 
                className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-[9px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                      {test.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">🕒 {test.durationMinutes} Mins</span>
                  </div>

                  <h4 className="font-extrabold text-slate-950 text-sm tracking-tight leading-snug mt-2.5">{test.title}</h4>
                  
                  <div className="grid grid-cols-2 gap-3.5 pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Total Marks</span>
                      <strong className="text-slate-800 font-extrabold text-sm">{test.totalMarks} Marks</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Question Count</span>
                      <strong className="text-slate-800 font-extrabold text-sm">{test.questions.length} MCQs</strong>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 mt-2">
                  <span className="text-[10px] text-slate-400 font-semibold">📊 {test.attemptsCount} Student Attempts</span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openManageQuestions(test)}
                      className="px-3 py-1.5 bg-slate-950 text-white text-[10px] font-black uppercase rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ListPlus className="h-3.5 w-3.5" /> Manage Qs
                    </button>

                    <button
                      onClick={() => openEditTestForm(test)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/20 rounded-lg cursor-pointer"
                      title="Edit Test properties"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteTest(test.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Delete Test Series"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}


      {/* ----------------------------------------------------
          TAB 5: PLAYLISTS / SUBJECT CHANNELS
          ---------------------------------------------------- */}
      {activeTab === 'playlists' && (
        <div className="space-y-6 animate-fadeIn" id="admin-playlists-tab">
          
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 font-display">Manage Subject Playlists</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Control the subjects rendered on the Student Portal. Add custom subjects (like Chem, SST) or edit visual styles.</p>
            </div>
            <button
              onClick={openAddPlaylistForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-all shrink-0"
            >
              <FolderPlus className="h-4.5 w-4.5" /> Add Subject Playlist
            </button>
          </div>

          {isPlaylistFormOpen && (
            <form onSubmit={handleSavePlaylist} className="bg-slate-55 border border-blue-100 bg-blue-50/10 p-5 rounded-3xl space-y-4 shadow-inner max-w-xl">
              <h4 className="font-extrabold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                <span>{editingSubject ? 'Edit Subject Playlist Properties' : 'Create Custom Subject Playlist'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Target Batch Course *</label>
                  <select
                    disabled={editingSubject !== null}
                    value={plBatchId}
                    onChange={(e) => setPlBatchId(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-60"
                  >
                    {portalBatches.map(b => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Unique Subject Key/ID *</label>
                  <input
                    type="text"
                    required
                    disabled={editingSubject !== null}
                    value={plId}
                    onChange={(e) => setPlId(e.target.value)}
                    placeholder="e.g., science, mathematics, chemistry"
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-60 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Subject Playlist Display Name *</label>
                  <input
                    type="text"
                    required
                    value={plName}
                    onChange={(e) => setPlName(e.target.value)}
                    placeholder="e.g., Chemistry Booster, English foundations"
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Display Icon Emoji *</label>
                  <input
                    type="text"
                    required
                    value={plIcon}
                    onChange={(e) => setPlIcon(e.target.value)}
                    placeholder="🧪"
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-center text-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Visual Color Gradient *</label>
                <select
                  value={plColor}
                  onChange={(e) => setPlColor(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="from-emerald-500 to-teal-600">Emerald Green Gradient 🔬</option>
                  <option value="from-blue-500 to-indigo-600">Classic Indigo Blue 📐</option>
                  <option value="from-purple-500 to-pink-600">Cosmic Purple Pink 🌌</option>
                  <option value="from-rose-500 to-orange-500">Volcanic Red Orange 🧪</option>
                  <option value="from-amber-500 to-yellow-600">Golden Amber 📚</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Short Description *</label>
                <input
                  type="text"
                  required
                  value={plDesc}
                  onChange={(e) => setPlDesc(e.target.value)}
                  placeholder="e.g., Comprehensive derivations, full syllabus mock sets, board exam papers."
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPlaylistFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
                >
                  Save Subject Playlist
                </button>
              </div>
            </form>
          )}

          {/* Grouped view by Batch */}
          <div className="space-y-8">
            {portalBatches.map(batch => (
              <div key={batch.id} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-2.5 flex items-center justify-between">
                  <span>📂 {batch.title} Playlists</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{Object.keys(batch.subjects).length} Active Channels</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.values(batch.subjects).map(sub => (
                    <div 
                      key={sub.id} 
                      className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex justify-between items-start gap-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-12 w-12 rounded-xl bg-gradient-to-r ${sub.color} text-white text-xl flex items-center justify-center shrink-0 shadow`}>
                          {sub.icon}
                        </span>
                        <div>
                          <h5 className="font-extrabold text-slate-900 text-sm tracking-tight leading-snug">{sub.name}</h5>
                          <p className="text-[10px] text-slate-400 font-semibold">Unique Key: <code>{sub.id}</code></p>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{sub.description}</p>
                          <span className="inline-block text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200">
                            🎥 {sub.lectures.length} Lectures inside
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditPlaylistForm(batch.id, sub)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded border border-transparent hover:border-slate-200 cursor-pointer transition-all"
                          title="Edit Playlist style & info"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePlaylist(batch.id, sub.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded border border-transparent hover:border-rose-100 cursor-pointer transition-all"
                          title="Delete Subject Playlist"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}


      {/* ----------------------------------------------------
          TAB 6: NOTICEBOARD BROADCASTS
          ---------------------------------------------------- */}
      {activeTab === 'notices' && (
        <div className="space-y-6 animate-fadeIn" id="admin-notices-tab">
          
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 font-display">Noticeboard Announcements</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Post announcements, holiday schedules, class cancellations, or priority test notifications.</p>
            </div>
            <button
              onClick={openAddNoticeForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-all shrink-0"
            >
              <Plus className="h-4.5 w-4.5" /> Post Announcement
            </button>
          </div>

          {isNoticeFormOpen && (
            <form onSubmit={handleSaveNotice} className="bg-slate-55 border border-blue-100 bg-blue-50/10 p-5 rounded-3xl space-y-4 shadow-inner max-w-xl">
              <h4 className="font-extrabold text-slate-950 text-sm uppercase tracking-wide flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <span>{editingNotice ? 'Edit Notice Properties' : 'Broadcast New Announcement'}</span>
              </h4>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={ntTitle}
                  onChange={(e) => setNtTitle(e.target.value)}
                  placeholder="e.g., Weekly Calculus Mock Test Postponed"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Urgency Category *</label>
                <select
                  value={ntCat}
                  onChange={(e) => setNtCat(e.target.value as any)}
                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="Urgent">🔴 Urgent Priority High</option>
                  <option value="General">🔵 General Update</option>
                  <option value="Exam">🟡 Examination Alert</option>
                  <option value="Batch">🟢 Batch Timings Schedule</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Announcement Content *</label>
                <textarea
                  rows={4}
                  required
                  value={ntContent}
                  onChange={(e) => setNtContent(e.target.value)}
                  placeholder="Type clear locations, timings, syllabus targets..."
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNoticeFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
                >
                  Broadcast Announcement
                </button>
              </div>
            </form>
          )}

          {/* Notices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notices.map(notice => (
              <div 
                key={notice.id} 
                className={`bg-white border rounded-3xl p-5 shadow-sm space-y-3 relative hover:border-slate-300 transition-all ${
                  notice.category === 'Urgent' ? 'border-rose-100/80 bg-rose-50/10' : 'border-slate-200/60'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                      notice.category === 'Urgent' 
                        ? 'bg-rose-50 border-rose-200 text-rose-700' 
                        : notice.category === 'Exam' 
                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : notice.category === 'Batch'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-blue-50 border-blue-200 text-blue-700'
                    }`}>
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{notice.date}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditNoticeForm(notice)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h4 className="font-extrabold text-slate-950 text-sm tracking-tight leading-snug mt-1">{notice.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{notice.content}</p>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
