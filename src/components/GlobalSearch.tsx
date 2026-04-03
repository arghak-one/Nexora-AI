import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Users, GraduationCap, BookOpen, X } from "lucide-react";

interface SearchResult {
  id: string;
  label: string;
  sublabel: string;
  type: "Student" | "Teacher" | "Parent" | "Class";
  href: string;
}

import { store, useStoreUpdate } from "@/lib/store";

function runSearch(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  // Students
  const students = store.getStudents();
  for (const s of students) {
    if (s.name.toLowerCase().includes(q) || s.class.toLowerCase().includes(q)) {
      results.push({ id: `student-${s.id}`, label: s.name, sublabel: `Class ${s.class}`, type: "Student", href: `/students/${s.id}` });
    }
  }

  // Teachers
  const teachers = store.getTeachers();
  for (const t of teachers) {
    if (t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)) {
      results.push({ id: `teacher-${t.id}`, label: t.name, sublabel: t.subject, type: "Teacher", href: "/teachers" });
    }
  }

  // Parents
  const parents = store.getParents();
  for (const p of parents) {
    if (
      p.parentName.toLowerCase().includes(q) ||
      p.studentName.toLowerCase().includes(q) ||
      p.class.toLowerCase().includes(q) ||
      (p.email && p.email.toLowerCase().includes(q))
    ) {
      results.push({ id: `parent-${p.id}`, label: p.parentName, sublabel: `Parent of ${p.studentName}`, type: "Parent", href: `/parents/${p.id}` });
    }
  }

  // Classes
  const classes = store.getClasses();
  for (const c of classes) {
    if (c.name.toLowerCase().includes(q) || c.teacher.toLowerCase().includes(q)) {
      results.push({ id: `class-${c.id}`, label: c.name, sublabel: c.teacher, type: "Class", href: "/classes" });
    }
  }

  return results.slice(0, 10);
}

const typeIcon: Record<SearchResult["type"], React.ReactNode> = {
  Student: <GraduationCap className="w-3.5 h-3.5" />,
  Teacher: <User className="w-3.5 h-3.5" />,
  Parent: <Users className="w-3.5 h-3.5" />,
  Class: <BookOpen className="w-3.5 h-3.5" />,
};

const typeBadge: Record<SearchResult["type"], string> = {
  Student: "bg-primary/15 text-primary",
  Teacher: "bg-success/15 text-success",
  Parent: "bg-warning/15 text-warning",
  Class: "bg-secondary text-muted-foreground",
};

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  useStoreUpdate();

  const doSearch = useCallback((q: string) => {
    setResults(runSearch(q));
    setActiveIndex(-1);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      doSearch(query);
      setOpen(true);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (result: SearchResult) => {
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
    navigate(result.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = activeIndex >= 0 ? results[activeIndex] : results[0];
      if (target) handleSelect(target);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative hidden md:block">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          data-testid="input-global-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Search students, teachers, parents..."
          className="w-72 pl-9 pr-8 h-9 bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground text-sm rounded-xl outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        />
        {query && (
          <button
            onClick={clearQuery}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-clear-search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          data-testid="search-dropdown"
          className="absolute top-full mt-2 left-0 w-80 z-50 rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.25)] overflow-hidden animate-fade-in"
          style={{ boxShadow: "0 8px 40px -8px hsl(var(--primary)/0.25), 0 0 0 1px hsl(var(--border)/0.5)" }}
        >
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <Search className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">Try a different search term</p>
            </div>
          ) : (
            <div className="py-1.5 max-h-80 overflow-y-auto">
              {results.map((result, idx) => (
                <button
                  key={result.id}
                  data-testid={`search-result-${result.id}`}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-100 ${
                    idx === activeIndex ? "bg-primary/10" : "hover:bg-secondary/60"
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${typeBadge[result.type]}`}>
                    {typeIcon[result.type]}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate leading-tight">{result.label}</p>
                    <p className="text-xs text-muted-foreground truncate leading-tight">{result.sublabel}</p>
                  </div>

                  {/* Type badge */}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${typeBadge[result.type]}`}>
                    {result.type}
                  </span>
                </button>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className="border-t border-border/30 px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground/60">{results.length} result{results.length !== 1 ? "s" : ""}</span>
              <span className="text-[10px] text-muted-foreground/60">↑↓ navigate · Enter select · Esc close</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
