export interface PortalLecture {
  id: string;
  lectureNumber: string;
  title: string;
  duration: string;
  youtubeId: string;
  thumbnailUrl: string;
  description: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'storage';
}

export interface PortalSubject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  lectures: PortalLecture[];
}

export interface PortalBatch {
  id: string;
  title: string;
  tagline: string;
  description: string;
  coverImage: string;
  enrolledText: string;
  rating: string;
  subjects: {
    [key: string]: PortalSubject;
  };
}

export interface VideoBatch {
  id: string;
  title: string;
  subject: 'Physics' | 'Mathematics' | 'Science' | 'Chemistry' | 'All';
  description: string;
  duration: string; // e.g., "45 hours"
  lecturesCount: number;
  teacher: string;
  youtubeId: string; // for embedding
  thumbnailUrl: string;
  enrolledStudents: number;
  rating: number;
  tags: string[];
  notesPdfUrl?: string;
  syllabus: string[];
}

export interface Book {
  id: string;
  title: string;
  subject: string;
  author: string;
  description: string;
  pages: number;
  classCategory: 'Class 11' | 'Class 12' | 'Competitive' | 'Foundation';
  coverUrl: string;
  downloadCount: number;
  content: string[]; // Mock chapters/pages content for the online reader
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number; // 0-indexed
  explanation: string;
  subject: 'Physics' | 'Mathematics' | 'Chemistry';
}

export interface MockTest {
  id: string;
  title: string;
  subject: 'Physics' | 'Mathematics' | 'Chemistry' | 'Full Syllabus';
  durationMinutes: number;
  totalMarks: number;
  questions: Question[];
  highScore?: number;
  attemptsCount: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Urgent' | 'General' | 'Exam' | 'Batch';
}

export interface Doubt {
  id: string;
  studentName: string;
  subject: string;
  title: string;
  description: string;
  answers: {
    author: string;
    text: string;
    date: string;
    isTeacher: boolean;
  }[];
  date: string;
  resolved: boolean;
}

export interface StudyGoal {
  id: string;
  text: string;
  deadline: string;
  completed: boolean;
  subject: string;
}

export interface TestAttempt {
  testId: string;
  testTitle: string;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  totalQuestions: number;
  date: string;
  timeTakenMinutes: number;
}
