import { useState } from 'react';
import { Book } from '../types';
import { BookOpen, FileText, Download, ChevronLeft, ChevronRight, Bookmark, Maximize2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookViewerProps {
  books: Book[];
  onDownloadBook: (id: string) => void;
}

export default function BookViewer({ books, onDownloadBook }: BookViewerProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePageIdx, setActivePageIdx] = useState(0);

  // Reader customizing states
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [themeMode, setThemeMode] = useState<'light' | 'sepia' | 'dark'>('light');
  const [bookmarks, setBookmarks] = useState<Record<string, number[]>>({});

  const handleToggleBookmark = (bookId: string, pageIdx: number) => {
    const activeBookmarks = bookmarks[bookId] || [];
    let updated: number[];
    if (activeBookmarks.includes(pageIdx)) {
      updated = activeBookmarks.filter((p) => p !== pageIdx);
    } else {
      updated = [...activeBookmarks, pageIdx];
    }
    setBookmarks({
      ...bookmarks,
      [bookId]: updated
    });
  };

  const getFontSizeClass = () => {
    if (fontSize === 'sm') return 'text-xs leading-relaxed';
    if (fontSize === 'lg') return 'text-base sm:text-lg leading-relaxed';
    return 'text-sm sm:text-base leading-relaxed';
  };

  const getThemeClass = () => {
    if (themeMode === 'sepia') return 'bg-amber-50/60 text-slate-800 border-amber-200/50';
    if (themeMode === 'dark') return 'bg-slate-900 text-slate-100 border-slate-800';
    return 'bg-white text-slate-800 border-slate-100';
  };

  const filteredBooks = books.filter((b) => {
    if (selectedCategory === 'All') return true;
    return b.classCategory === selectedCategory;
  });

  const categories = ['All', 'Class 11', 'Class 12', 'Competitive'];

  if (selectedBook) {
    const isBookmarked = (bookmarks[selectedBook.id] || []).includes(activePageIdx);
    return (
      <div className="space-y-6" id="digital-reader-screen">
        {/* Navigation Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <button
            onClick={() => {
              setSelectedBook(null);
              setActivePageIdx(0);
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
          >
            &larr; Exit Digital Reader
          </button>

          {/* Customizing Controls */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-50 border border-slate-200/60 p-1.5 rounded-2xl">
            {/* Font Control */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFontSize('sm')}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold cursor-pointer ${fontSize === 'sm' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('md')}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold cursor-pointer ${fontSize === 'md' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold cursor-pointer ${fontSize === 'lg' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}
              >
                A+
              </button>
            </div>

            <div className="h-4 w-[1px] bg-slate-200" />

            {/* Background Theme */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setThemeMode('light')}
                className={`h-5 w-5 rounded-full bg-white border border-slate-300 cursor-pointer ${themeMode === 'light' ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                title="Light Theme"
              />
              <button
                onClick={() => setThemeMode('sepia')}
                className={`h-5 w-5 rounded-full bg-amber-100 border border-amber-300 cursor-pointer ${themeMode === 'sepia' ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                title="Sepia Mode"
              />
              <button
                onClick={() => setThemeMode('dark')}
                className={`h-5 w-5 rounded-full bg-slate-800 border border-slate-900 cursor-pointer ${themeMode === 'dark' ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                title="Dark Mode"
              />
            </div>
          </div>
        </div>

        {/* Reader Layout Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel: Book details */}
          <div className="lg:col-span-4 bg-white border border-slate-100 shadow-sm rounded-2xl p-6 text-center space-y-4">
            <div className="h-52 w-36 mx-auto rounded-xl shadow-md overflow-hidden bg-slate-100">
              <img src={selectedBook.coverUrl} alt={selectedBook.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-snug">{selectedBook.title}</h3>
              <p className="text-xs text-blue-600 font-bold mt-1">{selectedBook.author}</p>
            </div>

            <div className="border-t border-slate-50 pt-4 text-xs text-slate-500 grid grid-cols-2 gap-4 text-center font-medium">
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="block text-slate-400 text-[10px] uppercase font-bold">PAGES</span>
                <strong className="text-slate-800">{selectedBook.pages}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="block text-slate-400 text-[10px] uppercase font-bold">DOWNLOADS</span>
                <strong className="text-slate-800">{selectedBook.downloadCount + 120}</strong>
              </div>
            </div>

            <button
              onClick={() => {
                onDownloadBook(selectedBook.id);
                alert('Downloading completed! File saved offline in local Cache.');
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="h-4 w-4" /> Download Book PDF
            </button>
          </div>

          {/* Right panel: Active chapter reader */}
          <div className="lg:col-span-8 space-y-4">
            <div className={`border rounded-2xl p-6 sm:p-8 shadow-sm transition-all min-h-[340px] flex flex-col justify-between ${getThemeClass()}`}>
              {/* Header inside reader */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 text-xs font-semibold text-slate-400">
                <span>Page {activePageIdx + 1} of {selectedBook.content.length}</span>
                <button
                  onClick={() => handleToggleBookmark(selectedBook.id, activePageIdx)}
                  className={`flex items-center gap-1 font-bold text-[11px] cursor-pointer ${isBookmarked ? 'text-amber-500' : 'hover:text-slate-600'}`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark Page'}
                </button>
              </div>

              {/* Text content */}
              <div className={getFontSizeClass()}>
                <p className="whitespace-pre-wrap leading-relaxed select-text font-normal">
                  {selectedBook.content[activePageIdx]}
                </p>
              </div>

              {/* Footer navigation */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                <button
                  disabled={activePageIdx === 0}
                  onClick={() => setActivePageIdx(activePageIdx - 1)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                <div className="flex gap-1">
                  {selectedBook.content.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePageIdx(idx)}
                      className={`h-2 w-2 rounded-full transition-all ${activePageIdx === idx ? 'bg-blue-600 w-4' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>

                <button
                  disabled={activePageIdx === selectedBook.content.length - 1}
                  onClick={() => setActivePageIdx(activePageIdx + 1)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100/50 p-4 rounded-xl flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                <strong>Reader Tip:</strong> Toggling Sepia or Dark mode protects eyes during night revision. Highlighted text and formulas remain high contrast to enhance focus retention.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="digital-books-catalog">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">E-Books & Chapter Formula sheets</h2>
        <p className="text-sm text-slate-500">Read online instantly using our interactive viewer or download offline PDF copies.</p>
      </div>

      {/* Categories select row */}
      <div className="flex items-center justify-center gap-2 border-b border-slate-100 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 hover:shadow-md transition-all flex flex-col justify-between group hover:border-blue-200"
            id={`book-card-${book.id}`}
          >
            <div className="space-y-4">
              {/* Cover photo */}
              <div className="h-48 rounded-xl bg-slate-50 relative overflow-hidden flex items-center justify-center border border-slate-100">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-40 w-28 object-cover rounded shadow-md group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 right-2 text-[8px] font-bold uppercase tracking-wider bg-slate-900 text-white px-2.5 py-1 rounded-md shadow-sm">
                  {book.classCategory}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                  {book.subject}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-400 font-bold mt-0.5">{book.author}</p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed font-normal">
                  {book.description}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex gap-2">
              <button
                onClick={() => setSelectedBook(book)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" /> Read Online
              </button>
              <button
                onClick={() => {
                  onDownloadBook(book.id);
                  alert('Book PDF download initiated!');
                }}
                className="p-2.5 bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200/60 rounded-xl cursor-pointer transition-colors"
                title="Download PDF"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
