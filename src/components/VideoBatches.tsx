import React, { useState } from 'react';
import { PortalBatch } from '../types';
import { 
  Video, 
  Play, 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  Award, 
  ChevronRight, 
  GraduationCap, 
  Sparkles, 
  Tv, 
  ThumbsUp, 
  Share2, 
  CheckCircle2, 
  BookMarked,
  Loader2
} from 'lucide-react';

function getYouTubeEmbedUrl(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : trimmed;
  return `https://www.youtube.com/embed/${videoId}`;
}

const BATCHES_DATA: PortalBatch[] = [
  {
    id: 'class_10',
    title: 'Class 10th Free Batch',
    tagline: 'CBSE Foundations & Board Preparation',
    description: 'A complete free syllabus course designed specifically for Class 10th students. Build a rock-solid foundation in Science and Mathematics, practice standard Board-level problem-solving, and master key derivations with Suraj Sir.',
    coverImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    enrolledText: '3.4k Students Enrolled',
    rating: '4.9 (120+ reviews)',
    subjects: {
      science: {
        id: 'science',
        name: 'Science',
        description: 'Complete high-yield Physics, Chemistry, and Biology topics with deep concept mapping.',
        icon: '🔬',
        color: 'from-emerald-500 to-teal-600',
        lectures: [
          {
            id: '10_sci_ref_1',
            lectureNumber: 'Lecture 01',
            title: 'Prakash ka Paravartan | Reflection of Light Class 10 Physics | Ray Diagram Easy Explanation | Hindi',
            duration: '60 mins',
            youtubeId: '_FSKjiotREo',
            thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
            description: 'Complete explanation of Reflection of Light, spherical mirrors, image formation, ray diagrams, and mirror formula in Hindi.'
          },
          {
            id: '10_sci_ref_2',
            lectureNumber: 'Lecture 02',
            title: 'Manav Netra ev Rang Viranga Sansar | Human Eye & Colourful World | Class 10 Science',
            duration: '55 mins',
            youtubeId: '4ds0eiFnYhE',
            thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
            description: 'Master Human Eye anatomy, working, defects of vision (Myopia, Hypermetropia, Presbyopia), dispersion of light through a prism, and atmospheric refraction.'
          },
          {
            id: '10_sci_ref_3',
            lectureNumber: 'Lecture 03',
            title: 'Vidhut Class 10 ⚡ Complete Chapter in One Shot | Board Exam 2026',
            duration: '90 mins',
            youtubeId: 'WrtsWQpB7Kg',
            thumbnailUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80',
            description: 'Comprehensive one-shot lecture covering Electric Current, Potential Difference, Ohm\'s Law, Resistance factors, Series and Parallel combinations, and Heating effects of current.'
          },
          {
            id: '10_sci_ref_4',
            lectureNumber: 'Lecture 04',
            title: 'Electric Current & Magnetism Explained 🔥 | Vidhut Dhara aur Chumbakatva',
            duration: '75 mins',
            youtubeId: 'YU6peT7ORM4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1518152006812-cdff28b66580?auto=format&fit=crop&w=400&q=80',
            description: 'Understand Magnetic Effects of Electric Current, magnetic field lines, straight conductor, circular loop, solenoid, Fleming\'s left hand rule, and electric motor.'
          },
          {
            id: '10_sci_ref_5',
            lectureNumber: 'Lecture 05',
            title: 'Rasayanik Abhikriya aur Samikaran | NCERT Class 10 Science Hindi Medium',
            duration: '65 mins',
            youtubeId: 'Qw0-1HffQkE',
            thumbnailUrl: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=400&q=80',
            description: 'Complete Hindi medium explanation of Chemical Reactions and Equations, balancing methods, types of chemical reactions, corrosion, and rancidity.'
          }
        ]
      },
      mathematics: {
        id: 'mathematics',
        name: 'Mathematics',
        description: 'Rigorous step-by-step problem-solving for Algebra, Geometry, and Trigonometry.',
        icon: '📐',
        color: 'from-blue-500 to-indigo-600',
        lectures: [
          {
            id: '10_math_1',
            lectureNumber: 'Lecture 01',
            title: 'Real Numbers - Euclid Division & Fundamental Theorem',
            duration: '42 mins',
            youtubeId: '37pA7S4B534',
            thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80',
            description: 'Starting mathematics CBSE Class 10 with Real Numbers. Understanding LCM-HCF relations and proofs of irrationality of root primes.'
          },
          {
            id: '10_math_2',
            lectureNumber: 'Lecture 02',
            title: 'Polynomials - Roots & Geometrical Meanings',
            duration: '48 mins',
            youtubeId: 'K4w9aL2_o04',
            thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80',
            description: 'Focus on relationship between coefficients and zeroes of quadratic polynomials, division algorithms, and graphical representation.'
          },
          {
            id: '10_math_3',
            lectureNumber: 'Lecture 03',
            title: 'Linear Equations in Two Variables - Algebraic Methods',
            duration: '62 mins',
            youtubeId: 'r5-fCkyiZJ8',
            thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
            description: 'Solving linear pairs using substitution, elimination, and cross-multiplication methods. Features extensive word problem practices.'
          },
          {
            id: '10_math_4',
            lectureNumber: 'Lecture 04',
            title: 'Quadratic Equations - Factoring & Quadratic Formula',
            duration: '55 mins',
            youtubeId: 'xG002X9Yh-g',
            thumbnailUrl: 'https://images.unsplash.com/photo-1635070040807-953e182364c4?auto=format&fit=crop&w=400&q=80',
            description: 'Deriving the famous Shreedharacharya quadratic formula. Determining the nature of roots based on the Discriminant value.'
          },
          {
            id: '10_math_5',
            lectureNumber: 'Lecture 05',
            title: 'Arithmetic Progressions - Sum of N Terms',
            duration: '49 mins',
            youtubeId: 'Gz1BscC2k5I',
            thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
            description: 'Formula derivation for the general nth term and sum of first n terms of an AP with several standard board-exam exam applications.'
          }
        ]
      }
    }
  },
  {
    id: 'class_12',
    title: 'Class 12th Free Batch',
    tagline: 'Boards Booster & Advanced JEE/NEET Foundations',
    description: 'An advanced curriculum formulated for Class 12th science students. Tackle high-difficulty concepts in physics, chemistry, and calculus with rigorous explanations, boards writing patterns, and competitive exam short-cuts.',
    coverImage: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
    enrolledText: '4.8k Students Enrolled',
    rating: '4.95 (250+ reviews)',
    subjects: {
      science: {
        id: 'science',
        name: 'Science',
        description: 'Advanced Physics electrostatic fields and critical Organic/Physical chemistry reactions.',
        icon: '🌌',
        color: 'from-purple-500 to-pink-600',
        lectures: [
          {
            id: '12_sci_1',
            lectureNumber: 'Lecture 01',
            title: 'Electrostatics - Coulomb\'s Law & Electric Dipole Field',
            duration: '75 mins',
            youtubeId: '63yvT6fM2C8',
            thumbnailUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=400&q=80',
            description: 'A deep dive into electric charges, continuous charge distribution, and calculating the electric field intensity on axial and equatorial points of a dipole.'
          },
          {
            id: '12_sci_2',
            lectureNumber: 'Lecture 02',
            title: 'Gauss Law - Flux Calculation & Infinite Sheet Fields',
            duration: '58 mins',
            youtubeId: 'R97v_n2A1sU',
            thumbnailUrl: 'https://images.unsplash.com/photo-1635070040807-953e182364c4?auto=format&fit=crop&w=400&q=80',
            description: 'Understand electric flux conceptually. Prove Gauss law from Coulomb\'s law, and use it to find fields for straight wires, infinite sheets, and shells.'
          },
          {
            id: '12_sci_3',
            lectureNumber: 'Lecture 03',
            title: 'Chemical Kinetics - Order, Molecularity & Rate Laws',
            duration: '64 mins',
            youtubeId: '_Y41Y9V6X_Q',
            thumbnailUrl: 'https://images.unsplash.com/photo-1581093588401-f3c22d7a1f18?auto=format&fit=crop&w=400&q=80',
            description: 'Master rate expression writing, finding orders of reactions, difference between molecularity & order, and integrated rate equations for zero & first order reactions.'
          },
          {
            id: '12_sci_4',
            lectureNumber: 'Lecture 04',
            title: 'Coordination Compounds - Werner\'s Theory & Ligand Field',
            duration: '52 mins',
            youtubeId: 'q_HhF7UuOic',
            thumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
            description: 'An informative chapter covering Werner\'s coordination theory, IUPAC naming rules, structural isomerism, and introductory Valence Bond theory.'
          },
          {
            id: '12_sci_5',
            lectureNumber: 'Lecture 05',
            title: 'Solid State - Unit Cell Packing Efficiency & Defects',
            duration: '44 mins',
            youtubeId: 'S75A_bCH34w',
            thumbnailUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80',
            description: 'Learn the geometric arrangements of crystalline solids, packing fractions of simple cubic, BCC, FCC structures, and crystal line defects.'
          }
        ]
      },
      mathematics: {
        id: 'mathematics',
        name: 'Mathematics',
        description: 'High-level Calculus continuity, differentiation, and integration tricks.',
        icon: '📐',
        color: 'from-blue-600 to-cyan-600',
        lectures: [
          {
            id: '12_math_1',
            lectureNumber: 'Lecture 01',
            title: 'Relations & Functions - One-One, Onto & Composites',
            duration: '48 mins',
            youtubeId: 'n_V_hF1bOic',
            thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80',
            description: 'Establish clear mappings. Master reflexive, symmetric, and transitive equivalence relations. Verify injective (one-one) and surjective (onto) properties.'
          },
          {
            id: '12_math_2',
            lectureNumber: 'Lecture 02',
            title: 'Inverse Trigonometric Functions - Principal Value Branches',
            duration: '62 mins',
            youtubeId: 'hXF7u6U2Z8c',
            thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
            description: 'Master trigonometric domain restrictions, graphing inverse sine/cosine curves, and practicing core substitution formulas for simplification.'
          },
          {
            id: '12_math_3',
            lectureNumber: 'Lecture 03',
            title: 'Matrices & Determinants - Cramer\'s Rule & Inverse',
            duration: '58 mins',
            youtubeId: 'm4X2-iI70U4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80',
            description: 'Matrix multiplication theorems, evaluating 3x3 determinants, finding adjoints & matrix inverses, and solving simultaneous linear equations.'
          },
          {
            id: '12_math_4',
            lectureNumber: 'Lecture 04',
            title: 'Continuity & Differentiability - Chain Rule & Logarithmic',
            duration: '74 mins',
            youtubeId: 'R97v_n2A1sU',
            thumbnailUrl: 'https://images.unsplash.com/photo-1635070040807-953e182364c4?auto=format&fit=crop&w=400&q=80',
            description: 'Limits revision leading to continuity tests. Master advanced derivative tricks: chain rule, logarithmic differentiation, and parametric functions.'
          },
          {
            id: '12_math_5',
            lectureNumber: 'Lecture 05',
            title: 'Integral Calculus - Substitution & Standard Algebraic Forms',
            duration: '85 mins',
            youtubeId: 'b-HQ7g_SbyY',
            thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
            description: 'Kickstart integration by substitution. Solve classic standard integrals and apply algebraic reduction tools to simplify complex rational functions.'
          }
        ]
      }
    }
  }
];

export default function VideoBatches({ batches, isLoading = false }: { batches: PortalBatch[]; isLoading?: boolean }) {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [activeLectureIndex, setActiveLectureIndex] = useState<number>(0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3" id="video-batches-loading">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-xs font-semibold uppercase tracking-wider font-mono">Loading dynamic playlist from database...</p>
      </div>
    );
  }

  // Merge static BATCHES_DATA with dynamic batches synced from database
  const mergedBatches = [...BATCHES_DATA];
  if (batches && batches.length > 0) {
    batches.forEach(b => {
      const idx = mergedBatches.findIndex(mb => mb.id === b.id);
      if (idx !== -1) {
        const mergedSubjects = { ...mergedBatches[idx].subjects };
        Object.entries(b.subjects || {}).forEach(([subId, subData]) => {
          if (mergedSubjects[subId]) {
            mergedSubjects[subId] = {
              ...mergedSubjects[subId],
              ...subData,
              lectures: subData.lectures && subData.lectures.length > 0 ? subData.lectures : mergedSubjects[subId].lectures
            };
          } else {
            mergedSubjects[subId] = subData;
          }
        });
        mergedBatches[idx] = {
          ...mergedBatches[idx],
          ...b,
          subjects: mergedSubjects
        };
      } else {
        mergedBatches.push(b);
      }
    });
  }

  if (mergedBatches.length === 0) {
    return (
      <div className="bg-white border border-slate-200/60 rounded-3xl p-8 text-center space-y-4" id="video-batches-empty">
        <Video className="h-12 w-12 text-slate-300 mx-auto" />
        <div>
          <h3 className="font-extrabold text-slate-800 text-base">No videos available</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            There are no educational batches or live lectures configured in the portal at this time.
          </p>
        </div>
      </div>
    );
  }

  // Computed state
  const currentBatch = mergedBatches.find(b => b.id === selectedBatchId);
  const currentSubject = currentBatch && selectedSubjectId ? currentBatch.subjects[selectedSubjectId] : null;
  const currentLecture = currentSubject ? currentSubject.lectures[activeLectureIndex] : null;

  // Navigation handlers
  const handleSelectBatch = (batchId: string) => {
    setSelectedBatchId(batchId);
    setSelectedSubjectId(null);
    setActiveLectureIndex(0);
  };

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setActiveLectureIndex(0);
  };

  const handleBackToBatches = () => {
    setSelectedBatchId(null);
    setSelectedSubjectId(null);
  };

  const handleBackToSubjects = () => {
    setSelectedSubjectId(null);
  };

  return (
    <div className="space-y-6" id="video-batches-container">
      
      {/* 1. Header & Navigation Context */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 tracking-tight flex items-center gap-2">
            <Video className="h-6 w-6 text-blue-600 animate-pulse" />
            <span>Free Student Video Batches</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {!selectedBatchId 
              ? 'Select an academic batch below to explore full subjects, lectures, and play YouTube-embedded lessons.' 
              : `Current Location: ${currentBatch?.title} ${currentSubject ? `> ${currentSubject.name}` : ''}`}
          </p>
        </div>

        {/* Dynamic breadcrumb navigation action */}
        {selectedBatchId && (
          <div className="flex gap-2.5 shrink-0">
            {selectedSubjectId ? (
              <button
                onClick={handleBackToSubjects}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all cursor-pointer border border-blue-100"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Subjects
              </button>
            ) : (
              <button
                onClick={handleBackToBatches}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all cursor-pointer border border-blue-100"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Batches
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. MAIN VIEWS SWITCH */}

      {/* VIEW A: Batches List (Default) */}
      {!selectedBatchId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="batches-selection-grid">
          {mergedBatches.map((batch) => (
            <div 
              key={batch.id} 
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full animate-fadeIn"
            >
              <div className="h-48 sm:h-52 overflow-hidden relative">
                <img 
                  src={batch.coverImage} 
                  alt={batch.title} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md">
                    <Sparkles className="h-3 w-3 fill-white" /> Free Course
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-white">
                  {batch.enrolledText}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase block">
                    {batch.tagline}
                  </span>
                  <h3 className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight">
                    {batch.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-normal">
                    {batch.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span>Rating: {batch.rating}</span>
                  </div>
                  <button
                    onClick={() => handleSelectBatch(batch.id)}
                    className="inline-flex items-center gap-1 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Explore Subjects <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW B: Subjects List of selected Batch */}
      {selectedBatchId && !selectedSubjectId && currentBatch && (
        <div className="space-y-6 animate-fadeIn" id="subjects-selection-grid">
          {/* Selected Batch Intro Jumbotron */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
            <div className="relative z-10 space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                ACTIVE BATCH
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                {currentBatch.title}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                {currentBatch.description}
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-[11px] font-medium text-slate-400">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Full Syllabus Videos</span>
                <span className="flex items-center gap-1"><BookMarked className="h-4 w-4 text-emerald-400" /> Free PDF Formula Sheets</span>
                <span className="flex items-center gap-1"><Tv className="h-4 w-4 text-blue-400" /> Interactive Playlists</span>
              </div>
            </div>
            {/* Ambient visual background glow */}
            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-blue-600/10 to-transparent pointer-events-none"></div>
          </div>

          <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-2">
            Select Your Subject
          </h3>

          {/* Subjects Cards Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(currentBatch.subjects).map((subj) => (
              <div 
                key={subj.id}
                onClick={() => handleSelectSubject(subj.id)}
                className="bg-white border border-slate-200 hover:border-blue-300 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-start gap-4 group"
              >
                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
                  {subj.icon}
                </div>
                <div className="space-y-1.5 flex-1">
                  <h4 className="font-black text-slate-800 text-base sm:text-lg group-hover:text-blue-600 transition-colors">
                    {subj.name}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {subj.description}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-blue-600">
                    <span>Explore {subj.lectures.length} Lectures</span>
                    <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW C: Double-column Embedded Video Player & Playlist */}
      {selectedBatchId && selectedSubjectId && currentBatch && currentSubject && currentLecture && (
        <div className="space-y-6 animate-fadeIn" id="interactive-video-player-grid">
          
          {/* Location details & navigation summary */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-slate-400">{currentBatch.title}</span>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="text-blue-600 font-bold">{currentSubject.name} Class Playlist</span>
          </div>

          {/* Large Video Player Left, Lecture Playlist Right (Responsive Bootstrap Grid Style) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Large Video Player (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              
               {/* Aspect ratio video placeholder holding embedded iframe or video player */}
              <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-800 aspect-video relative flex items-center justify-center">
                {currentLecture.videoType === 'storage' || currentLecture.videoUrl ? (
                  <video
                    id={`storage-player-${currentLecture.id}`}
                    src={currentLecture.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  ></video>
                ) : (
                  <iframe
                    id={`yt-player-${currentLecture.id}`}
                    src={`${getYouTubeEmbedUrl(currentLecture.youtubeId)}?autoplay=1&rel=0&modestbranding=1`}
                    title={currentLecture.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                  ></iframe>
                )}
              </div>

              {/* Lecture Description & Author Details Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-extrabold uppercase tracking-wider border border-blue-100">
                      {currentLecture.lectureNumber}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-medium">
                      <Clock className="h-3.5 w-3.5 text-slate-400" /> {currentLecture.duration} duration
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {currentLecture.title}
                  </h1>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                  {currentLecture.description}
                </p>

                {/* Additional widgets: Likes & Action */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      className="h-10 w-10 rounded-full border border-slate-200 object-cover" 
                      src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                      alt="Teacher" 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">Taught by Suraj Sir</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">IIT Roorkee Alumnus</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/60 text-slate-600 transition-colors cursor-pointer text-xs font-bold inline-flex items-center gap-1.5">
                      <ThumbsUp className="h-4 w-4" /> <span>Helpful</span>
                    </button>
                    <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/60 text-slate-600 transition-colors cursor-pointer text-xs font-bold inline-flex items-center gap-1.5">
                      <Share2 className="h-4 w-4" /> <span>Share Class</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Side: Lecture Playlist (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wider">
                    Lecture Playlist
                  </h4>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {currentSubject.lectures.length} Videos
                  </span>
                </div>

                {/* Playlist Scrollable lecture cards */}
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {currentSubject.lectures.map((lec, idx) => {
                    const isActive = idx === activeLectureIndex;
                    return (
                      <div
                        key={lec.id}
                        onClick={() => setActiveLectureIndex(idx)}
                        className={`group flex gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer items-start ${
                          isActive 
                            ? 'bg-blue-50/70 border-blue-200/80 shadow-xs' 
                            : 'bg-white border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {/* Lecture Card elements: Thumbnail on the left */}
                        <div className="h-16 w-24 rounded-lg overflow-hidden relative shrink-0 shadow-xs bg-slate-100">
                          <img 
                            src={lec.thumbnailUrl} 
                            alt={lec.title} 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${
                            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}>
                            <Play className="h-5 w-5 text-white fill-white shrink-0" />
                          </div>
                          <span className="absolute bottom-1 right-1 bg-slate-950/80 text-[8px] font-bold text-white px-1 py-0.2 rounded-xs">
                            {lec.duration}
                          </span>
                        </div>

                        {/* Lecture Card elements: Lecture details on the right */}
                        <div className="space-y-1 flex-1 min-w-0">
                          <span className={`text-[9px] font-extrabold uppercase tracking-wider block ${
                            isActive ? 'text-blue-600' : 'text-slate-400'
                          }`}>
                            {lec.lectureNumber}
                          </span>
                          <h5 className={`text-xs font-bold leading-tight line-clamp-2 ${
                            isActive ? 'text-blue-700' : 'text-slate-800 group-hover:text-blue-600'
                          }`}>
                            {lec.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            Duration: {lec.duration}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
