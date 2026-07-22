import { useState, useEffect } from 'react';
import { 
  Play, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Award,
  Video
} from 'lucide-react';

export interface LectureItem {
  id: number;
  lectureNumber: number;
  title: string;
  duration: string;
  description: string;
  video: string;
}

// Store all lectures inside a JavaScript array as requested
export const playlist: LectureItem[] = [
  {
    id: 1,
    lectureNumber: 1,
    title: "Class 12 Physics Important Questions 2027 🔥 | Board Exam Most Expected Questions",
    duration: "",
    description: "Important Questions for CBSE Class 12 Physics Board Exam 2027.",
    video: "https://youtu.be/edlEFptqdSY?si=ooy1k_cv2WPewLaL"
  },
  {
    id: 2,
    lectureNumber: 2,
    title: "गतिमान आवेश और चुंबकत्व | Class 12 Physics Chapter 4 Full Explanation 🔥",
    duration: "",
    description: "Class 12 Physics Chapter 4 Full Explanation.",
    video: "https://youtu.be/gLsCdTVoi_g?si=-sSnOmbPIM1PcAvz"
  },
  {
    id: 3,
    lectureNumber: 3,
    title: "5 मिनट में समझो — आवेश क्या होता है? | Class 12 Physics",
    duration: "",
    description: "Quick explanation of Electric Charge for Class 12 Physics.",
    video: "https://youtu.be/X9tCF8EE9_M?si=3YnWyKoq29-_SPd2"
  },
  {
    id: 4,
    lectureNumber: 4,
    title: "D and F Block Elements Explained Easily | Class 12 Chemistry",
    duration: "",
    description: "Complete explanation of D and F Block Elements for Class 12 Chemistry.",
    video: "https://youtu.be/GHxhWDWLdJY?si=Eej87A5Nyf4JZqp3"
  },
  {
    id: 5,
    lectureNumber: 5,
    title: "Chemistry by Amit Sir | Basic se Bond and Carbon Hydrogen Bond Degree",
    duration: "",
    description: "Complete chemistry basics including chemical bonding and carbon-hydrogen bond concepts.",
    video: "https://youtu.be/eX7CTbVdnUE?si=kLrMzMueOMOiblyy"
  }
];

/**
 * Helper function that converts any YouTube URL format into an embeddable URL,
 * ignoring extra parameters like ?si=, &t=, &list=, &index=, &feature=:
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const regExp = /(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);

  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

export default function Class12Batch() {
  const [activeLectureIndex, setActiveLectureIndex] = useState<number>(0);
  const [activeCarouselSlide, setActiveCarouselSlide] = useState<number>(0);

  const carouselSlides = [
    {
      id: 1,
      title: "Welcome to Class 12th Batch",
      description: "Academic Year 2026-27 | Complete Video Lectures, Notes & Chapter Test Series by Suraj Sir.",
      btnText: "Explore Batch Details",
      bgGradient: "from-blue-900 via-indigo-900 to-slate-900",
      accentBadge: "Session 2026-27"
    },
    {
      id: 2,
      title: "Latest Lecture Available",
      description: "Chapter-wise video tutorials with step-by-step mathematical derivations and numerical solving.",
      btnText: "Watch Current Video",
      bgGradient: "from-slate-900 via-blue-950 to-indigo-950",
      accentBadge: "New Content Updated"
    },
    {
      id: 3,
      title: "Start Learning Today",
      description: "Boost your score with Suraj Sir's proven Board Exam and competitive entrance preparation strategies.",
      btnText: "Start Learning Now",
      bgGradient: "from-indigo-900 via-blue-900 to-slate-950",
      accentBadge: "Board Exam Prep"
    }
  ];

  // Auto-rotate Carousel slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCarouselSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const currentLecture = playlist[activeLectureIndex] || playlist[0];
  const embedUrl = getYouTubeEmbedUrl(currentLecture.video);

  const handlePrevLecture = () => {
    if (activeLectureIndex > 0) {
      setActiveLectureIndex(activeLectureIndex - 1);
    }
  };

  const handleNextLecture = () => {
    if (activeLectureIndex < playlist.length - 1) {
      setActiveLectureIndex(activeLectureIndex + 1);
    }
  };

  return (
    <div className="container-fluid py-4 max-w-7xl mx-auto" id="class12-batch-section">
      {/* Top Header Banner */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className="badge bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-pill mb-3 d-inline-flex align-items-center gap-1.5 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-warning" />
                Academic Session 2026-2027
              </span>
              <h1 className="display-6 fw-bold mb-2 tracking-tight">
                📚 Class 12th Batch (2026-27)
              </h1>
              <p className="lead mb-0 text-blue-100 fs-6">
                Official Video Playlist for Mathematics, Sciences & Board Preparation. Watch lectures, track progress, and learn directly from Suraj Sir.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <div className="d-inline-flex align-items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-3 text-white text-sm">
                <GraduationCap className="h-5 w-5 text-warning" />
                <div>
                  <div className="fw-bold fs-6">{playlist.length} Total Lectures</div>
                  <div className="text-white-50 text-xs">Full Syllabus Covered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: Left Sidebar (30%) + Right Player (70%) */}
      <div className="row g-4">
        {/* LEFT SIDEBAR (30% width) - Lecture List Group */}
        <div className="col-lg-4 col-md-5">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
            <div className="card-header bg-slate-900 text-white p-3.5 d-flex align-items-center justify-content-between border-0">
              <div className="d-flex align-items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <h5 className="m-0 fw-bold fs-6">Lecture Playlist</h5>
              </div>
              <span className="badge bg-blue-600 rounded-pill px-2.5 py-1 text-xs">
                {playlist.length} Videos
              </span>
            </div>

            <div className="card-body p-0 overflow-auto" style={{ maxHeight: '680px' }}>
              <div className="list-group list-group-flush" id="lecture-playlist-group">
                {playlist.map((item, index) => {
                  const isActive = index === activeLectureIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      id={`lecture-item-${item.id}`}
                      onClick={() => setActiveLectureIndex(index)}
                      className={`list-group-item list-group-item-action p-3 text-start border-bottom transition-all ${
                        isActive
                          ? 'bg-blue-50/90 text-blue-900 fw-semibold border-start border-4 border-blue-600'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className={`mt-0.5 rounded-circle p-2 d-flex align-items-center justify-content-center shrink-0 ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                          style={{ width: '32px', height: '32px' }}
                        >
                          {isActive ? (
                            <Play className="h-3.5 w-3.5 fill-white" />
                          ) : (
                            <span className="text-xs font-bold">{item.lectureNumber}</span>
                          )}
                        </div>

                        <div className="flex-grow-1 min-w-0">
                          <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                            <span className="badge bg-slate-100 text-slate-600 border text-[10px] px-2 py-0.5">
                              Lecture {item.lectureNumber}
                            </span>
                            <span className="text-muted text-[11px] d-inline-flex align-items-center gap-1 shrink-0">
                              <Clock className="h-3 w-3" />
                              {item.duration || "Full Video"}
                            </span>
                          </div>
                          <h6 className={`m-0 text-truncate text-sm ${isActive ? 'text-blue-900 fw-bold' : 'text-slate-800'}`}>
                            {item.title}
                          </h6>
                        </div>

                        {isActive && (
                          <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 align-self-center ms-1" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card-footer bg-slate-50 p-3 border-top text-center text-muted text-xs">
              💡 Select any lecture to start instant streaming on the right player.
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (70% width) - Carousel + Video Player + Description */}
        <div className="col-lg-8 col-md-7">
          <div className="d-flex flex-column gap-4">
            {/* ABOVE THE VIDEO: Bootstrap Carousel */}
            <div id="class12Carousel" className="carousel slide shadow-sm rounded-4 overflow-hidden" data-bs-ride="carousel">
              {/* Carousel Indicators */}
              <div className="carousel-indicators mb-2">
                {carouselSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    data-bs-target="#class12Carousel"
                    onClick={() => setActiveCarouselSlide(idx)}
                    className={idx === activeCarouselSlide ? 'active' : ''}
                    aria-label={`Slide ${idx + 1}`}
                  ></button>
                ))}
              </div>

              {/* Carousel Inner Slides */}
              <div className="carousel-inner">
                {carouselSlides.map((slide, idx) => {
                  const isCurrent = idx === activeCarouselSlide;
                  return (
                    <div
                      key={slide.id}
                      className={`carousel-item ${isCurrent ? 'active' : ''}`}
                    >
                      <div className={`p-4 p-md-5 bg-gradient-to-r ${slide.bgGradient} text-white rounded-4 position-relative`}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="badge bg-white/20 text-white text-xs px-2.5 py-1 rounded-pill backdrop-blur-sm">
                            {slide.accentBadge}
                          </span>
                          <span className="text-white-50 text-xs font-mono">Slide {idx + 1} of 3</span>
                        </div>
                        <h3 className="fw-extrabold text-white mb-2 fs-4 fs-md-3">
                          {slide.title}
                        </h3>
                        <p className="text-blue-100 text-sm mb-3 max-w-xl">
                          {slide.description}
                        </p>
                        <button 
                          onClick={() => setActiveLectureIndex(0)}
                          className="btn btn-light btn-sm fw-bold px-3.5 py-2 text-blue-900 rounded-3 shadow-sm hover:bg-blue-50 transition-all cursor-pointer"
                        >
                          {slide.btnText} →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Carousel Controls */}
              <button
                className="carousel-control-prev"
                type="button"
                onClick={() => setActiveCarouselSlide((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1))}
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                onClick={() => setActiveCarouselSlide((prev) => (prev + 1) % carouselSlides.length)}
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>

            {/* VIDEO PLAYER - Bootstrap Ratio 16x9 Container */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-black">
              <div className="ratio ratio-16x9">
                <iframe
                  src={embedUrl}
                  title={`Lecture ${currentLecture.lectureNumber}: ${currentLecture.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-100 h-100 border-0"
                  id="class12-video-iframe"
                ></iframe>
              </div>
            </div>

            {/* BELOW THE VIDEO: Lecture Details & Navigation Controls */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 border-bottom mb-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge bg-blue-100 text-blue-800 fw-bold px-2.5 py-1 text-xs">
                      Lecture {currentLecture.lectureNumber} of {playlist.length}
                    </span>
                    <span className="badge bg-slate-100 text-slate-600 text-xs d-inline-flex align-items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {currentLecture.duration || "Full Video"}
                    </span>
                  </div>
                  <h2 className="fs-4 fw-bold text-slate-900 m-0">
                    {currentLecture.title}
                  </h2>
                </div>

                {/* Previous & Next Lecture Buttons */}
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    id="prev-lecture-btn"
                    onClick={handlePrevLecture}
                    disabled={activeLectureIndex === 0}
                    className={`btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 px-3 py-2 rounded-3 fw-semibold ${
                      activeLectureIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous Lecture
                  </button>

                  <button
                    type="button"
                    id="next-lecture-btn"
                    onClick={handleNextLecture}
                    disabled={activeLectureIndex === playlist.length - 1}
                    className={`btn btn-primary btn-sm d-inline-flex align-items-center gap-1 px-3 py-2 rounded-3 fw-semibold ${
                      activeLectureIndex === playlist.length - 1 ? 'opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Next Lecture
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Lecture Description */}
              <div className="space-y-2">
                <h6 className="text-uppercase text-muted fw-bold text-xs tracking-wider m-0">
                  Lecture Description & Session Overview
                </h6>
                <p className="text-slate-600 text-sm leading-relaxed m-0">
                  {currentLecture.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-top d-flex flex-wrap align-items-center justify-content-between text-muted text-xs gap-2">
                <span className="d-inline-flex align-items-center gap-1">
                  <Award className="h-4 w-4 text-warning" />
                  Suraj Sir Education Portal • Official Class 12th Series
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <Video className="h-4 w-4 text-blue-500" />
                  High Definition 1080p Stream
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
