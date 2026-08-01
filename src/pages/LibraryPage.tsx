import React, { useState } from 'react';
import { Search, BookOpen, Download, Eye, Plus, Trash2, Edit, Sparkles, CheckCircle2, Bookmark, Layers, Tag } from 'lucide-react';
import { initialLibraryBooks } from '../data/staticData';
import { LibraryBook } from '../types';
import { useAuth } from '../context/AuthContext';

export const LibraryPage: React.FC = () => {
  const { role } = useAuth();
  const [books, setBooks] = useState<LibraryBook[]>(initialLibraryBooks);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewBook, setPreviewBook] = useState<LibraryBook | null>(null);

  // Admin modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState<LibraryBook | null>(null);
  const [formData, setFormData] = useState<Partial<LibraryBook>>({
    title: '',
    author: '',
    category: 'Programming',
    availableCopies: 5,
    totalCopies: 5,
    description: '',
    tags: []
  });

  const categories = ['All', 'Programming', 'AI', 'Career', 'Soft Skills', 'Aptitude', 'Research', 'Reference'];

  const filteredBooks = books.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesQuery =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.tags && b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesQuery;
  });

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author) return;

    if (editingBook) {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === editingBook.id
            ? { ...b, ...formData, id: editingBook.id } as LibraryBook
            : b
        )
      );
      setEditingBook(null);
    } else {
      const newB: LibraryBook = {
        id: `lib_${Date.now()}`,
        title: formData.title || 'Untitled Book',
        author: formData.author || 'Unknown Author',
        category: (formData.category as any) || 'General',
        availableCopies: Number(formData.availableCopies) || 5,
        totalCopies: Number(formData.totalCopies) || 5,
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
        description: formData.description || 'General reference digital library book.',
        tags: (formData.tags as any) || ['Library']
      };
      setBooks((prev) => [newB, ...prev]);
      setShowAddModal(false);
    }
    setFormData({
      title: '',
      author: '',
      category: 'Programming',
      availableCopies: 5,
      totalCopies: 5,
      description: '',
      tags: []
    });
  };

  const handleDeleteBook = (id: string) => {
    if (confirm("Are you sure you want to remove this book from the digital library?")) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleOpenEdit = (b: LibraryBook) => {
    setEditingBook(b);
    setFormData(b);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F8FAF8] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <BookOpen className="w-4 h-4" /> Central Knowledge Digital Library
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC] tracking-tight">
            Digital Library & Global Book Repository
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#CBD5E1] mt-1 max-w-xl">
            Access general reference books, AI textbooks, programming guides, soft skill manuals, career preparation materials, and research publications beyond departmental syllabus.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-center">
            <span className="text-2xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">{books.length} Books</span>
            <span className="block text-[10px] text-[#6B7280] dark:text-[#CBD5E1] font-semibold uppercase">Global Library</span>
          </div>

          {role === 'admin' && (
            <button
              onClick={() => {
                setEditingBook(null);
                setFormData({
                  title: '',
                  author: '',
                  category: 'Programming',
                  availableCopies: 5,
                  totalCopies: 5,
                  description: '',
                  tags: ['Programming', 'Computer Science']
                });
                setShowAddModal(true);
              }}
              className="px-4 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs flex items-center gap-1.5 border-none cursor-pointer shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Add New Book
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#CBD5E1]" />
            <input
              type="text"
              placeholder="Search by title, author, category, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-xs sm:text-sm text-[#1F2937] dark:text-[#F8FAFC] focus:border-[#2E7D32] dark:focus:border-[#4CAF50] focus:outline-none"
            />
          </div>

          <span className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50]">
            Showing {filteredBooks.length} Digital Books
          </span>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-[#E5E7EB] dark:border-[#475569] pt-3">
          {categories.map((cat) => {
            const count = cat === 'All' ? books.length : books.filter(b => b.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer border-none ${
                  isSelected
                    ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold'
                    : 'bg-white dark:bg-[#162033] text-[#6B7280] dark:text-[#CBD5E1] border border-[#DDE5DD] dark:border-[#334155]'
                }`}
              >
                <span>{cat}</span>
                <span className={`ml-1.5 px-2 py-0.2 rounded-full text-[10px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-[#E5E7EB] dark:bg-[#334155] text-[#6B7280] dark:text-[#CBD5E1]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="p-4 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] flex flex-col justify-between hover:border-[#2E7D32] dark:hover:border-[#4CAF50] transition-all"
          >
            <div>
              {/* Cover & Category Tag */}
              <div className="relative h-44 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-3">
                <img
                  src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#2E7D32]/90 text-white font-bold text-[10px] backdrop-blur-sm">
                  {book.category}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white font-mono text-[10px]">
                  {book.availableCopies}/{book.totalCopies} Available
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-[#F8FAFC] line-clamp-2">
                {book.title}
              </h3>
              <p className="text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold mt-1">
                By {book.author}
              </p>

              <p className="text-[11px] text-[#6B7280] dark:text-[#CBD5E1] line-clamp-2 mt-1.5 leading-relaxed">
                {book.description}
              </p>

              {book.tags && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {book.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-white dark:bg-[#162033] text-[#6B7280] dark:text-[#CBD5E1] border border-[#DDE5DD] dark:border-[#334155]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="mt-4 pt-3 border-t border-[#E5E7EB] dark:border-[#475569] flex items-center justify-between gap-2">
              <button
                onClick={() => setPreviewBook(book)}
                className="flex-1 py-1.5 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-xs font-semibold text-[#1F2937] dark:text-[#F8FAFC] flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" /> Details
              </button>

              <button
                onClick={() => alert(`Downloading "${book.title}" digital copy...`)}
                className="flex-1 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer border-none"
              >
                <Download className="w-3.5 h-3.5" /> Read PDF
              </button>

              {role === 'admin' && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(book)}
                    className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 cursor-pointer border-none"
                    title="Edit Book"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 cursor-pointer border-none"
                    title="Delete Book"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Book Detail Modal */}
      {previewBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] rounded-2xl p-6 max-w-lg w-full shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#475569] pb-3">
              <h3 className="font-extrabold text-base text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" /> Digital Library Record
              </h3>
              <button onClick={() => setPreviewBook(null)} className="text-[#6B7280] border-none bg-transparent cursor-pointer font-bold text-base">✕</button>
            </div>

            <div className="flex gap-4">
              <img
                src={previewBook.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'}
                alt={previewBook.title}
                className="w-24 h-32 object-cover rounded-xl border border-[#DDE5DD] dark:border-[#334155]"
              />
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#81C784] font-bold text-xs">
                  {previewBook.category}
                </span>
                <h4 className="font-extrabold text-base text-[#1F2937] dark:text-[#F8FAFC] mt-1">{previewBook.title}</h4>
                <p className="text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold">Author: {previewBook.author}</p>
                {previewBook.isbn && <p className="text-[10px] text-[#6B7280] dark:text-[#CBD5E1]">ISBN: {previewBook.isbn}</p>}
                <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                  Status: {previewBook.availableCopies > 0 ? 'Available for E-Borrowing' : 'All Copies In Use'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F4F8F4] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] space-y-1 text-xs">
              <p className="font-bold text-[#1F2937] dark:text-[#F8FAFC]">Overview:</p>
              <p className="text-[#6B7280] dark:text-[#CBD5E1] leading-relaxed">{previewBook.description}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#6B7280] dark:text-[#CBD5E1]">{previewBook.availableCopies} of {previewBook.totalCopies} copies in library</span>
              <button
                onClick={() => {
                  alert(`Starting digital reader for "${previewBook.title}"...`);
                  setPreviewBook(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs border-none cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download / Read Full E-Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Modal */}
      {(showAddModal || editingBook) && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] rounded-2xl p-6 max-w-lg w-full shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#475569] pb-3">
              <h3 className="font-extrabold text-base text-[#1F2937] dark:text-[#F8FAFC]">
                {editingBook ? 'Edit Library Book' : 'Add New Library Book'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingBook(null);
                }}
                className="text-[#6B7280] border-none bg-transparent cursor-pointer font-bold text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1F2937] dark:text-[#F8FAFC] mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F4F8F4] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-[#1F2937] dark:text-[#F8FAFC] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] dark:text-[#F8FAFC] mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F8F4] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-[#1F2937] dark:text-[#F8FAFC] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2937] dark:text-[#F8FAFC] mb-1">Category *</label>
                  <select
                    value={formData.category || 'Programming'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#F4F8F4] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-[#1F2937] dark:text-[#F8FAFC] outline-none"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] dark:text-[#F8FAFC] mb-1">Available Copies</label>
                  <input
                    type="number"
                    value={formData.availableCopies ?? 5}
                    onChange={(e) => setFormData({ ...formData, availableCopies: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F4F8F4] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-[#1F2937] dark:text-[#F8FAFC] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2937] dark:text-[#F8FAFC] mb-1">Total Copies</label>
                  <input
                    type="number"
                    value={formData.totalCopies ?? 5}
                    onChange={(e) => setFormData({ ...formData, totalCopies: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F4F8F4] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-[#1F2937] dark:text-[#F8FAFC] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] dark:text-[#F8FAFC] mb-1">Book Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F4F8F4] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-[#1F2937] dark:text-[#F8FAFC] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingBook(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-[#1F2937] dark:text-[#F8FAFC] font-semibold border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold border-none cursor-pointer"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
