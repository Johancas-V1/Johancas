"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Highlighter, StickyNote, Trash2, Pencil, X, MessageSquareText } from "lucide-react";

interface Highlight {
  id: string;
  chapterIndex: number;
  text: string;
  startOffset: number;
  endOffset: number;
  note: string;
  createdAt: string;
}

interface SelectionPopup {
  x: number;
  y: number;
  text: string;
  startOffset: number;
  endOffset: number;
}

interface HighlightPopup {
  x: number;
  y: number;
  highlight: Highlight;
}

interface ReaderDict {
  highlight: string;
  addNote: string;
  deleteHighlight: string;
  editNote: string;
  saveNote: string;
  cancelNote: string;
  notePlaceholder: string;
  noHighlights: string;
  highlightsPanel: string;
}

const STORAGE_KEY = "jcm-highlights";

function loadHighlights(): Highlight[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHighlights(highlights: Highlight[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(highlights));
}

export default function BookReaderClient({
  chapterContent,
  chapterIndex,
  dict,
}: {
  chapterContent: string;
  chapterIndex: number;
  dict: ReaderDict;
}) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectionPopup, setSelectionPopup] = useState<SelectionPopup | null>(null);
  const [highlightPopup, setHighlightPopup] = useState<HighlightPopup | null>(null);
  const [noteForm, setNoteForm] = useState<{ highlightId: string; text: string } | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Load highlights on mount
  useEffect(() => {
    setHighlights(loadHighlights().filter((h) => h.chapterIndex === chapterIndex));
  }, [chapterIndex]);

  // Close popups on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setSelectionPopup(null);
        setHighlightPopup(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const updateHighlights = useCallback(
    (updater: (prev: Highlight[]) => Highlight[]) => {
      setHighlights((prev) => {
        const next = updater(prev);
        // Save all highlights (including other chapters)
        const all = loadHighlights().filter((h) => h.chapterIndex !== chapterIndex);
        saveHighlights([...all, ...next]);
        return next;
      });
    },
    [chapterIndex]
  );

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !contentRef.current) {
      return;
    }

    const text = selection.toString().trim();
    if (!text || text.length < 2) return;

    // Find offsets in the chapter content
    const range = selection.getRangeAt(0);
    const startOffset = chapterContent.indexOf(text);
    if (startOffset === -1) return;
    const endOffset = startOffset + text.length;

    // Check if overlapping with existing highlight
    const overlapping = highlights.some(
      (h) => startOffset < h.endOffset && endOffset > h.startOffset
    );
    if (overlapping) return;

    // Get position for popup
    const rect = range.getBoundingClientRect();
    const containerRect = contentRef.current.getBoundingClientRect();

    setHighlightPopup(null);
    setSelectionPopup({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 10,
      text,
      startOffset,
      endOffset,
    });
  };

  const addHighlight = (withNote: boolean) => {
    if (!selectionPopup) return;

    const newHighlight: Highlight = {
      id: crypto.randomUUID(),
      chapterIndex,
      text: selectionPopup.text,
      startOffset: selectionPopup.startOffset,
      endOffset: selectionPopup.endOffset,
      note: "",
      createdAt: new Date().toISOString(),
    };

    updateHighlights((prev) => [...prev, newHighlight]);
    window.getSelection()?.removeAllRanges();
    setSelectionPopup(null);

    if (withNote) {
      setNoteForm({ highlightId: newHighlight.id, text: "" });
    }
  };

  const deleteHighlight = (id: string) => {
    updateHighlights((prev) => prev.filter((h) => h.id !== id));
    setHighlightPopup(null);
  };

  const saveNote = () => {
    if (!noteForm) return;
    updateHighlights((prev) =>
      prev.map((h) => (h.id === noteForm.highlightId ? { ...h, note: noteForm.text } : h))
    );
    setNoteForm(null);
    setHighlightPopup(null);
  };

  const handleHighlightClick = (highlight: Highlight, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contentRef.current) return;
    const containerRect = contentRef.current.getBoundingClientRect();
    const rect = (e.target as HTMLElement).getBoundingClientRect();

    setSelectionPopup(null);
    setHighlightPopup({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 10,
      highlight,
    });
  };

  // Build text segments with highlights
  const sorted = [...highlights].sort((a, b) => a.startOffset - b.startOffset);
  const segments: { text: string; highlight: Highlight | null }[] = [];
  let cursor = 0;
  for (const h of sorted) {
    if (h.startOffset > cursor) {
      segments.push({ text: chapterContent.slice(cursor, h.startOffset), highlight: null });
    }
    segments.push({ text: chapterContent.slice(h.startOffset, h.endOffset), highlight: h });
    cursor = h.endOffset;
  }
  if (cursor < chapterContent.length) {
    segments.push({ text: chapterContent.slice(cursor), highlight: null });
  }
  if (segments.length === 0) {
    segments.push({ text: chapterContent, highlight: null });
  }

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Panel Toggle */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="absolute top-4 right-4 z-20 flex items-center gap-2 text-xs font-semibold text-[var(--navy-dark)] border border-[var(--border-light)] px-3 py-2 rounded-lg bg-white hover:bg-[var(--bg-light)] transition-colors shadow-sm"
      >
        <MessageSquareText className="w-4 h-4" />
        {dict.highlightsPanel} ({highlights.length})
      </button>

      <div className="flex flex-1">
        {/* Chapter Content */}
        <div
          ref={contentRef}
          className="flex-1 px-6 md:px-16 lg:px-24 py-6 pt-14 max-w-4xl relative"
          onMouseUp={handleMouseUp}
        >
          <p className="text-lg md:text-xl text-[var(--text-dark)] leading-relaxed font-serif select-text">
            {segments.map((seg, i) =>
              seg.highlight ? (
                <mark
                  key={i}
                  className="bg-yellow-100 hover:bg-yellow-200 cursor-pointer transition-colors rounded-sm relative"
                  onClick={(e) => handleHighlightClick(seg.highlight!, e)}
                >
                  {seg.text}
                  {seg.highlight.note && (
                    <span className="inline-block w-3 h-3 ml-0.5 align-super">
                      <StickyNote className="w-3 h-3 text-amber-500" />
                    </span>
                  )}
                </mark>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
          </p>

          {/* Selection Popup */}
          {selectionPopup && (
            <div
              ref={popupRef}
              className="absolute z-30 bg-white shadow-xl rounded-xl border border-[var(--border-light)] py-2 px-1 flex gap-1 -translate-x-1/2"
              style={{ left: selectionPopup.x, top: selectionPopup.y, transform: "translate(-50%, -100%)" }}
            >
              <button
                onClick={() => addHighlight(false)}
                className="flex items-center gap-2 text-sm text-[var(--text-dark)] hover:bg-[var(--bg-light)] px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                <Highlighter className="w-4 h-4 text-amber-500" /> {dict.highlight}
              </button>
              <button
                onClick={() => addHighlight(true)}
                className="flex items-center gap-2 text-sm text-[var(--text-dark)] hover:bg-[var(--bg-light)] px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                <StickyNote className="w-4 h-4 text-amber-500" /> {dict.addNote}
              </button>
            </div>
          )}

          {/* Highlight Popup (edit/delete) */}
          {highlightPopup && !noteForm && (
            <div
              ref={popupRef}
              className="absolute z-30 bg-white shadow-xl rounded-xl border border-[var(--border-light)] py-2 px-1 -translate-x-1/2 min-w-[200px]"
              style={{ left: highlightPopup.x, top: highlightPopup.y, transform: "translate(-50%, -100%)" }}
            >
              {highlightPopup.highlight.note && (
                <div className="px-3 py-2 text-sm text-[var(--text-gray)] border-b border-[var(--border-light)] max-w-[260px]">
                  &ldquo;{highlightPopup.highlight.note}&rdquo;
                </div>
              )}
              <div className="flex gap-1 p-1">
                <button
                  onClick={() =>
                    setNoteForm({
                      highlightId: highlightPopup.highlight.id,
                      text: highlightPopup.highlight.note,
                    })
                  }
                  className="flex items-center gap-2 text-sm text-[var(--text-dark)] hover:bg-[var(--bg-light)] px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Pencil className="w-3.5 h-3.5" /> {highlightPopup.highlight.note ? dict.editNote : dict.addNote}
                </button>
                <button
                  onClick={() => deleteHighlight(highlightPopup.highlight.id)}
                  className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {dict.deleteHighlight}
                </button>
              </div>
            </div>
          )}

          {/* Note Form */}
          {noteForm && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-[var(--navy-dark)]">
                    {noteForm.text ? dict.editNote : dict.addNote}
                  </h3>
                  <button onClick={() => { setNoteForm(null); setHighlightPopup(null); }} className="text-[var(--text-gray)] hover:text-[var(--text-dark)]">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <textarea
                  autoFocus
                  value={noteForm.text}
                  onChange={(e) => setNoteForm({ ...noteForm, text: e.target.value })}
                  placeholder={dict.notePlaceholder}
                  className="w-full h-28 px-4 py-3 border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-dark)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--blue-accent)] focus:ring-1 focus:ring-[var(--blue-accent)] resize-none"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => { setNoteForm(null); setHighlightPopup(null); }}
                    className="flex-1 text-sm font-semibold text-[var(--text-gray)] py-2.5 rounded-xl border border-[var(--border-light)] hover:bg-[var(--bg-light)] transition-colors"
                  >
                    {dict.cancelNote}
                  </button>
                  <button
                    onClick={saveNote}
                    className="flex-1 text-sm font-semibold text-white bg-[var(--navy-dark)] py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    {dict.saveNote}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Highlights Panel */}
        {showPanel && (
          <div className="w-[300px] shrink-0 border-l border-[var(--border-light)] bg-[#f8f6f1] p-5 overflow-y-auto hidden md:block">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[var(--navy-dark)]">{dict.highlightsPanel}</h3>
              <button onClick={() => setShowPanel(false)} className="text-[var(--text-gray)] hover:text-[var(--text-dark)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            {highlights.length === 0 ? (
              <p className="text-sm text-[var(--text-gray)]">{dict.noHighlights}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {sorted.map((h) => (
                  <div
                    key={h.id}
                    className="bg-white rounded-lg p-3 border border-[var(--border-light)] cursor-pointer hover:shadow-sm transition-shadow"
                    onClick={() => {
                      // Scroll to highlight in text
                      const marks = contentRef.current?.querySelectorAll("mark");
                      const idx = sorted.indexOf(h);
                      if (marks && marks[idx]) {
                        marks[idx].scrollIntoView({ behavior: "smooth", block: "center" });
                        marks[idx].classList.add("ring-2", "ring-amber-400");
                        setTimeout(() => marks[idx].classList.remove("ring-2", "ring-amber-400"), 1500);
                      }
                    }}
                  >
                    <p className="text-sm text-[var(--text-dark)] font-medium leading-snug border-l-2 border-amber-400 pl-2">
                      &ldquo;{h.text.length > 60 ? h.text.slice(0, 60) + "..." : h.text}&rdquo;
                    </p>
                    {h.note && (
                      <p className="text-xs text-[var(--text-gray)] mt-1.5 pl-2">
                        <StickyNote className="w-3 h-3 inline mr-1 text-amber-500" />
                        {h.note.length > 80 ? h.note.slice(0, 80) + "..." : h.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
