import { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import { 
  entries, 
  categories, 
  Entry, 
  Category, 
  getEntriesByCategory, 
  getEntryById, 
  searchEntries, 
  mockStats 
} from "./data/encyclopediaData";
import { cn } from "./utils/cn";
import AdBanner from "./components/AdBanner";  // <-- تمت إضافة هذا السطر

// === DYNAMIC ICON COMPONENT ===
const DynamicIcon = ({ name, className, size = 20 }: { name: string; className?: string; size?: number }) => {
  const pascalName = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  
  const LucideIcon = (Icons as any)[pascalName] || Icons.BookOpen;
  return <LucideIcon className={className} size={size} />;
};

// === SCIENTIFIC ILLUSTRATION COMPONENT ===
const ScientificIllustration = ({ type, className }: { type: string; className?: string }) => {
  const baseClass = cn("w-full h-full rounded-xl flex items-center justify-center p-6 bg-linear-to-br", className);
  
  switch (type) {
    case "atom":
      return (
        <div className={cn(baseClass, "from-violet-500/10 to-indigo-500/10 text-violet-600")}>
          <svg className="w-24 h-24 animate-spin-slow" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="50" r="6" fill="currentColor" />
            <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(0 50 50)" />
            <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(60 50 50)" />
            <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(120 50 50)" />
            <circle cx="50" cy="10" r="3" fill="currentColor" />
            <circle cx="85" cy="70" r="3" fill="currentColor" />
            <circle cx="15" cy="70" r="3" fill="currentColor" />
          </svg>
        </div>
      );
    case "earth":
      return (
        <div className={cn(baseClass, "from-amber-600/10 to-stone-500/10 text-stone-600")}>
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="50" r="45" strokeDasharray="5 3" />
            <circle cx="50" cy="50" r="35" fill="none" className="text-stone-300" />
            <path d="M 50 15 A 35 35 0 0 0 15 50" strokeWidth="4" />
            <circle cx="50" cy="50" r="22" fill="currentColor" className="text-amber-500/30" />
            <circle cx="50" cy="50" r="10" fill="currentColor" className="text-amber-500" />
            <path d="M 50 50 L 95 50 M 50 50 L 50 5 M 50 50 L 75 80" strokeWidth="1" strokeDasharray="2 2" />
            <text x="100" y="5" className="text-[8px] fill-current font-sans" transform="rotate(90 50 50)">Crust</text>
            <text x="35" y="40" className="text-[6px] fill-stone-800 font-sans font-bold">CORE</text>
          </svg>
        </div>
      );
    case "brain":
      return (
        <div className={cn(baseClass, "from-rose-500/10 to-pink-500/10 text-rose-600")}>
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 50 20 C 35 20, 20 25, 20 40 C 20 50, 25 55, 30 60 C 25 70, 30 85, 45 80 C 45 85, 50 85, 50 80 C 50 85, 55 85, 55 80 C 70 85, 75 70, 70 60 C 75 55, 80 50, 80 40 C 80 25, 65 20, 50 20 Z" />
            <path d="M 50 20 L 50 80" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 35 30 Q 30 35 32 45 T 45 50 M 65 30 Q 70 35 68 45 T 55 50" />
            <path d="M 25 50 Q 35 55 35 65 M 75 50 Q 65 55 65 65" />
            <circle cx="35" cy="35" r="2" fill="currentColor" />
            <circle cx="65" cy="35" r="2" fill="currentColor" />
            <circle cx="45" cy="65" r="2" fill="currentColor" />
            <circle cx="55" cy="65" r="2" fill="currentColor" />
          </svg>
        </div>
      );
    case "math":
      return (
        <div className={cn(baseClass, "from-fuchsia-500/10 to-purple-500/10 text-fuchsia-600")}>
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 10 50 L 90 50 M 50 10 L 50 90" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 10 70 Q 30 10, 50 50 T 90 30" strokeWidth="3" className="animate-pulse" />
            <circle cx="50" cy="50" r="4" fill="currentColor" />
            <rect x="60" y="15" width="20" height="20" rx="3" fill="currentColor" className="text-fuchsia-100" />
            <text x="65" y="28" className="text-xs font-serif fill-fuchsia-700">f(x)</text>
            <path d="M 20 20 L 35 35 M 35 20 L 20 35" strokeWidth="2" />
          </svg>
        </div>
      );
    case "computer":
      return (
        <div className={cn(baseClass, "from-indigo-500/10 to-sky-500/10 text-indigo-600")}>
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="10" y="15" width="80" height="55" rx="5" />
            <path d="M 10 60 L 90 60" />
            <path d="M 30 70 L 20 85 L 80 85 L 70 70" fill="currentColor" className="text-indigo-100" />
            <rect x="15" y="22" width="70" height="32" rx="2" fill="currentColor" className="text-slate-900" />
            <text x="20" y="35" className="text-[8px] font-mono fill-green-400">&gt;_ run</text>
            <text x="20" y="45" className="text-[8px] font-mono fill-green-400">01101001</text>
            <circle cx="50" cy="65" r="2" fill="currentColor" />
          </svg>
        </div>
      );
    case "leaf":
      return (
        <div className={cn(baseClass, "from-emerald-500/10 to-teal-500/10 text-emerald-600")}>
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 50 90 C 50 90, 15 65, 15 40 C 15 15, 50 10, 50 10 C 50 10, 85 15, 85 40 C 85 65, 50 90, 50 90 Z" fill="currentColor" className="text-emerald-500/10" />
            <path d="M 50 90 L 50 10" strokeWidth="3" />
            <path d="M 50 70 Q 30 60 25 50 M 50 50 Q 30 40 20 30 M 50 30 Q 35 25 30 15" strokeWidth="1.5" />
            <path d="M 50 70 Q 70 60 75 50 M 50 50 Q 70 40 80 30 M 50 30 Q 65 25 70 15" strokeWidth="1.5" />
          </svg>
        </div>
      );
    case "scientist":
      return (
        <div className={cn(baseClass, "from-cyan-500/10 to-blue-500/10 text-cyan-600")}>
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 50 45 C 58 45 65 38 65 30 C 65 22 58 15 50 15 C 42 15 35 22 35 30 C 35 38 42 45 50 45 Z" fill="currentColor" className="text-cyan-100" />
            <path d="M 20 80 C 20 65 30 55 50 55 C 70 55 80 65 80 80" fill="currentColor" className="text-cyan-100" />
            <circle cx="20" cy="20" r="2" fill="currentColor" className="animate-ping" />
            <circle cx="80" cy="25" r="3" fill="currentColor" />
            <path d="M 15 40 L 25 45 L 15 50 Z M 85 50 L 75 55 L 80 65 Z" fill="currentColor" />
            <path d="M 50 5 L 50 10 M 95 50 L 90 50 M 5 50 L 10 50" strokeDasharray="2 2" />
          </svg>
        </div>
      );
    case "law":
      return (
        <div className={cn(baseClass, "from-orange-500/10 to-amber-500/10 text-orange-600")}>
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 25 20 L 75 20 C 80 20, 80 15, 75 15 L 20 15 C 15 15, 15 20, 20 20 L 20 80 C 20 85, 25 85, 30 85 L 80 85 C 85 85, 85 80, 80 80 L 25 80 Z" fill="currentColor" className="text-orange-50" />
            <path d="M 40 40 L 70 40 M 40 50 L 70 50 M 40 60 L 60 60" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 30 10 L 30 85" strokeWidth="0.5" />
            <circle cx="50" cy="20" r="4" fill="currentColor" />
            <path d="M 75 15 C 85 15, 85 85, 75 85" strokeWidth="0.5" strokeDasharray="2 2" />
          </svg>
        </div>
      );
    case "tech":
      return (
        <div className={cn(baseClass, "from-sky-500/10 to-teal-500/10 text-sky-600")}>
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="25" y="25" width="50" height="50" rx="4" strokeWidth="3" />
            <rect x="38" y="38" width="24" height="24" rx="2" fill="currentColor" className="text-sky-500/20" strokeWidth="1" />
            <path d="M 50 15 L 50 25 M 50 75 L 50 85 M 15 50 L 25 50 M 75 50 L 85 50" strokeWidth="2" />
            <path d="M 35 15 L 35 25 M 65 15 L 65 25 M 35 75 L 35 85 M 65 75 L 65 85" strokeWidth="2" />
            <path d="M 15 35 L 25 35 M 15 65 L 25 65 M 75 35 L 85 35 M 75 65 L 85 65" strokeWidth="2" />
            <circle cx="50" cy="50" r="3" fill="currentColor" />
          </svg>
        </div>
      );
    case "flask-conical":
      return (
        <div className={cn(baseClass, "from-teal-500/10 to-cyan-500/10 text-teal-600")}>
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 40 15 L 60 15 M 45 15 L 45 35 L 20 75 C 15 82, 20 85, 30 85 L 70 85 C 80 85, 85 82, 80 75 L 55 35 L 55 15" strokeWidth="2.5" />
            <path d="M 27 65 L 73 65 M 23 72 L 77 72" strokeWidth="1" className="text-teal-300" />
            <path d="M 23 72 C 22 75, 25 82, 35 82 L 65 82 C 75 82, 78 75, 77 72 Z" fill="currentColor" className="text-teal-500/20" />
            <circle cx="45" cy="55" r="3" fill="currentColor" className="animate-bounce" />
            <circle cx="55" cy="50" r="2" fill="currentColor" className="animate-bounce [animation-delay:0.2s]" />
            <circle cx="40" cy="65" r="3" fill="currentColor" className="animate-bounce [animation-delay:0.4s]" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={cn(baseClass, "from-slate-500/10 to-slate-400/10 text-slate-600")}>
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="20" y="20" width="60" height="60" rx="8" />
            <path d="M 35 40 L 65 40 M 35 50 L 65 50 M 35 60 L 50 60" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="50" r="15" strokeDasharray="3 3" className="text-slate-300" />
          </svg>
        </div>
      );
  }
};

export default function App() {
  // === APPLICATION STATES ===
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("home");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [alphabetFilter, setAlphabetFilter] = useState<string>("");
  const [textSize, setTextSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [randomDayId, setRandomDayId] = useState<string>("ai");

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // === INITIALIZATION ===
  useEffect(() => {
    // 1. Load favorites from localStorage
    const savedFavs = localStorage.getItem("scientific_encyclopedia_favs");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error("Failed to parse favorites");
      }
    }

    // 2. Load text size from localStorage
    const savedSize = localStorage.getItem("scientific_encyclopedia_textsize");
    if (savedSize && ["normal", "large", "xlarge"].includes(savedSize)) {
      setTextSize(savedSize as any);
    }

    // 3. Set random Definition of the Day based on the current date
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const dayEntry = entries[dayOfYear % entries.length];
    if (dayEntry) setRandomDayId(dayEntry.id);
  }, []);

  // === CORE METHODS ===
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavs = prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id];
      localStorage.setItem("scientific_encyclopedia_favs", JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const handleTextSizeChange = (size: "normal" | "large" | "xlarge") => {
    setTextSize(size);
    localStorage.setItem("scientific_encyclopedia_textsize", size);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setAlphabetFilter("");
    if (q.trim() !== "" && activeCategory === "home") {
      setActiveCategory("all"); // Switch from dashboard to browse when searching
    }
  };

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setSelectedEntryId(null);
    setAlphabetFilter("");
    setSearchQuery("");
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    stopSpeaking();
  };

  const openEntry = (id: string) => {
    setSelectedEntryId(id);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    stopSpeaking();
  };

  // === TEXT TO SPEECH (TTS) ===
  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("عذراً، متصفحك لا يدعم خاصية نطق النصوص.");
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    window.speechSynthesis.cancel();
    
    // Clean text from symbols
    const cleanText = text.replace(/[|•➔➔➔➔\-➔_()]/g, " ").replace(/([A-Za-z0-9])/g, "");
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85; // slightly slower for better clarity in Arabic
    utterance.pitch = 1.0;

    // Try to select an Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith("ar"));
    if (arVoice) {
      utterance.voice = arVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // === DATA FILTERING LOGIC ===
  const getFilteredEntries = () => {
    return entries.filter((entry) => {
      // 1. Filter by Sidebar Category
      if (activeCategory === "bookmarks") {
        if (!favorites.includes(entry.id)) return false;
      } else if (activeCategory !== "home" && activeCategory !== "all") {
        if (entry.category !== activeCategory) return false;
      }

      // 2. Filter by Alphabetical Selection
      if (alphabetFilter) {
        // Strip out Al- (التعريف) for better alphabetical filtering
        const normalizedTitle = entry.titleAr.replace(/^(ال)/, "");
        if (!normalizedTitle.startsWith(alphabetFilter)) return false;
      }

      // 3. Filter by Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matchesAr = entry.titleAr.toLowerCase().includes(q);
        const matchesEn = entry.titleEn.toLowerCase().includes(q);
        const matchesDef = entry.definition.toLowerCase().includes(q);
        const matchesTags = entry.tags.some((t) => t.toLowerCase().includes(q));
        const matchesSub = entry.subCategory?.toLowerCase().includes(q);
        
        return matchesAr || matchesEn || matchesDef || matchesTags || matchesSub;
      }

      return true;
    });
  };

  const activeCategoryData = categories.find((c) => c.id === activeCategory);
  const currentEntry = selectedEntryId ? getEntryById(selectedEntryId) : null;
  const filteredEntriesList = getFilteredEntries();

  // Sort entries alphabetically for listing
  const sortedEntriesList = [...filteredEntriesList].sort((a, b) => {
    const titleA = a.titleAr.replace(/^(ال)/, "");
    const titleB = b.titleAr.replace(/^(ال)/, "");
    return titleA.localeCompare(titleB, "ar");
  });

  // Arabic Alphabet for filter row
  const arabicAlphabet = [
    "أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"
  ];

  // Definition of the Day data
  const dayEntry = getEntryById(randomDayId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased dir-rtl">
      {/* === HEADER === */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 h-16 flex items-center px-4 md:px-6 justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg md:hidden text-slate-600"
            title="القائمة"
          >
            <Icons.Menu size={24} />
          </button>

          {/* Logo & Title */}
          <div 
            onClick={() => handleCategoryChange("home")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-linear-to-br from-indigo-600 to-violet-600 p-2 rounded-xl text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <Icons.GraduationCap size={22} className="stroke-[2]" />
            </div>
            <div>
              <h1 className="font-bold text-lg md:text-xl text-slate-900 tracking-tight">منصة الشامل التعليمية</h1>
              <p className="text-[10px] text-slate-400 font-sans font-bold select-none tracking-widest leading-none">AL-SHAMEL PLATFORM</p>
            </div>
          </div>
        </div>

        {/* Search Bar - Center */}
        <div className="flex-1 max-w-xl mx-4 md:mx-12 relative hidden sm:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="ابحث عن تعريف، عالم، قانون، أو مصلطح علمي..."
            className="w-full pl-12 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm text-slate-800 placeholder-slate-400"
          />
          <div className="absolute left-4 top-2.5 text-slate-400">
            {searchQuery ? (
              <Icons.X size={18} className="cursor-pointer hover:text-slate-600" onClick={() => setSearchQuery("")} />
            ) : (
              <Icons.Search size={18} />
            )}
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCategoryChange("bookmarks")}
            className={cn(
              "p-2 rounded-xl transition-all relative flex items-center gap-2 border",
              activeCategory === "bookmarks" 
                ? "bg-rose-50 border-rose-200 text-rose-600" 
                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800"
            )}
            title="المفضلة"
          >
            <Icons.Heart size={18} className={activeCategory === "bookmarks" ? "fill-rose-500" : ""} />
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border border-white">
                {favorites.length}
              </span>
            )}
            <span className="text-xs font-bold hidden md:inline">مفضلتي</span>
          </button>
          
          <button
            onClick={() => window.print()}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all hidden md:flex items-center gap-2"
            title="طباعة الصفحة"
          >
            <Icons.Printer size={18} />
            <span className="text-xs font-bold">طباعة البحث</span>
          </button>
        </div>
      </header>

      {/* Mobile Search Bar - Visible only on mobile */}
      <div className="no-print p-4 bg-white border-b border-slate-200 sm:hidden">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="ابحث عن مصلطح، عالم، قانون..."
            className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:border-indigo-500 focus:bg-white text-sm"
          />
          <div className="absolute left-4 top-3 text-slate-400">
            {searchQuery ? (
              <Icons.X size={18} className="cursor-pointer hover:text-slate-600" onClick={() => setSearchQuery("")} />
            ) : (
              <Icons.Search size={18} />
            )}
          </div>
        </div>
      </div>

      {/* === MAIN LAYOUT === */}
      <div className="flex-1 flex relative h-[calc(100vh-4rem)] sm:h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* === SIDEBAR overlay for mobile === */}
        {isSidebarOpen && (
          <div 
            className="no-print fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-45 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* === SIDEBAR === */}
        <aside className={cn(
          "no-print bg-white border-l border-slate-200 w-64 flex-shrink-0 flex flex-col z-50 transition-all duration-300 md:static fixed inset-y-0 right-0 h-full",
          isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}>
          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {/* Main items */}
            <button
              onClick={() => handleCategoryChange("home")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200",
                activeCategory === "home" 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-100" 
                  : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
              )}
            >
              <Icons.LayoutDashboard size={18} />
              <span>لوحة المنصة</span>
            </button>

            <button
              onClick={() => handleCategoryChange("all")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200",
                activeCategory === "all" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                  : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
              )}
            >
              <Icons.Book size={18} />
              <span>تصفح كل المجلدات</span>
            </button>

            {/* Section Divider */}
            <div className="px-4 pt-4 pb-2 text-[10px] font-bold text-slate-400 tracking-widest border-t border-slate-100 mt-2 select-none">
              تصنيفات المنصة
            </div>

            {/* Categories list */}
            <div className="space-y-1 pr-1 max-h-[60vh] overflow-y-auto">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const catEntriesCount = getEntriesByCategory(cat.id).length;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all",
                      isActive 
                        ? `${cat.color} font-bold border shadow-xs` 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-1.5 rounded-lg border bg-white shadow-xs", isActive ? "text-current border-current/30" : "text-slate-400 border-slate-200")}>
                        <DynamicIcon name={cat.iconName} size={16} />
                      </div>
                      <span className="font-bold">{cat.nameAr}</span>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-sans font-bold",
                      isActive ? "bg-white/50 border border-current/10" : "bg-slate-100 text-slate-500"
                    )}>
                      {catEntriesCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer Info */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2 select-none text-[11px] text-slate-500">
            <div className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 p-2 rounded-lg shadow-xs transition-all hover:border-indigo-300">
              <Icons.Code2 size={14} className="text-indigo-600" />
              <span className="font-bold text-slate-700">تصميم وتطوير: الأستاذ خمقاني أحمد</span>
            </div>
            <p className="text-center mt-1 font-sans font-bold text-slate-400">
              © {new Date().getFullYear()} منصة الشامل التعليمية
            </p>
          </div>
        </aside>

        {/* === MAIN CONTENT SECTION === */}
        <main className="flex-1 overflow-y-auto" id="main-scroll-container">
          
          {/* Print only Header */}
          <div className="print-only hidden p-4 text-center border-b-2 border-slate-900 mb-6">
            <h1 className="text-2xl font-bold">منصة الشامل التعليمية - للطلبة والباحثين</h1>
            <p className="text-sm">وثيقة أكاديمية مطبوعة وموثقة</p>
          </div>

          <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
            {selectedEntryId ? (
              /* =========================================
                 A. DEFINITION DETAILED READER VIEW
                 ========================================= */
              currentEntry && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 md:p-8 relative">
                  {/* Action Buttons Header */}
                  <div className="no-print flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-3">
                    <button
                      onClick={() => setSelectedEntryId(null)}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-sm font-bold shadow-xs"
                    >
                      <Icons.ArrowRight size={18} />
                      <span>العودة للقائمة</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Text size controls */}
                      <div className="flex border border-slate-200 rounded-xl overflow-hidden p-1 bg-slate-50 shadow-xs">
                        <button
                          onClick={() => handleTextSizeChange("normal")}
                          className={cn("px-2.5 py-1 text-xs font-bold rounded-lg transition-all", textSize === "normal" ? "bg-white border-slate-200 shadow-xs text-slate-800" : "text-slate-400 hover:text-slate-600")}
                        >
                          A
                        </button>
                        <button
                          onClick={() => handleTextSizeChange("large")}
                          className={cn("px-2.5 py-1 text-sm font-bold rounded-lg transition-all", textSize === "large" ? "bg-white border-slate-200 shadow-xs text-slate-800" : "text-slate-400 hover:text-slate-600")}
                        >
                          A+
                        </button>
                        <button
                          onClick={() => handleTextSizeChange("xlarge")}
                          className={cn("px-2.5 py-1 text-base font-bold rounded-lg transition-all", textSize === "xlarge" ? "bg-white border-slate-200 shadow-xs text-slate-800" : "text-slate-400 hover:text-slate-600")}
                        >
                          A++
                        </button>
                      </div>

                      {/* TTS Speak button */}
                      <button
                        onClick={() => speakText(currentEntry.titleAr + " . " + currentEntry.definition + " . " + (currentEntry.formula ? "المعادلة الخاصة به " + currentEntry.formula : ""))}
                        className={cn(
                          "p-2 border rounded-xl shadow-xs transition-all flex items-center gap-2 text-xs font-bold",
                          isSpeaking 
                            ? "bg-amber-500 border-amber-600 text-white animate-pulse" 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                        )}
                        title={isSpeaking ? "إيقاف القراءة" : "اقرأ بصوت مسموع"}
                      >
                        {isSpeaking ? <Icons.VolumeX size={18} /> : <Icons.Volume2 size={18} />}
                        <span className="hidden sm:inline">{isSpeaking ? "إيقاف الصوت" : "استمع"}</span>
                      </button>

                      {/* Bookmark button */}
                      <button
                        onClick={() => toggleFavorite(currentEntry.id)}
                        className={cn(
                          "p-2 border rounded-xl shadow-xs transition-all flex items-center gap-2 text-xs font-bold",
                          favorites.includes(currentEntry.id)
                            ? "bg-rose-50 border-rose-200 text-rose-500"
                            : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-800"
                        )}
                        title="حفظ للمفضلة"
                      >
                        <Icons.Heart size={18} className={favorites.includes(currentEntry.id) ? "fill-rose-500" : ""} />
                        <span className="hidden sm:inline">{favorites.includes(currentEntry.id) ? "محفوظ" : "تفضيل"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Title Section */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                    <div className="flex-1">
                      {/* Category Badge */}
                      {(() => {
                        const cat = categories.find((c) => c.id === currentEntry.category);
                        return cat ? (
                          <div 
                            onClick={() => handleCategoryChange(cat.id)}
                            className={cn("no-print inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border mb-3 cursor-pointer hover:scale-95 transition-all", cat.color)}
                          >
                            <DynamicIcon name={cat.iconName} size={14} />
                            <span>{cat.nameAr}</span>
                            {currentEntry.subCategory && (
                              <>
                                <span className="opacity-40">/</span>
                                <span className="font-normal opacity-80">{currentEntry.subCategory}</span>
                              </>
                            )}
                          </div>
                        ) : null;
                      })()}

                      {/* Titles */}
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{currentEntry.titleAr}</h2>
                      <p className="text-lg md:text-xl font-sans font-semibold text-slate-400 dir-ltr text-right">
                        {currentEntry.titleEn}
                      </p>
                    </div>

                    {/* Desktop Illustration Slot */}
                    <div className="no-print w-full md:w-48 h-36 border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs shrink-0">
                      <ScientificIllustration type={currentEntry.imageType || "general"} />
                    </div>
                  </div>

                  {/* Definition Body */}
                  <div className="border-t border-b border-slate-100 py-6 mb-6">
                    <h3 className="no-print text-sm font-bold text-slate-400 mb-2">التعريف العلمي المعتمد:</h3>
                    <p className={cn(
                      "text-slate-700 leading-relaxed text-justify break-words",
                      textSize === "normal" && "text-base md:text-lg",
                      textSize === "large" && "text-xl md:text-2xl font-semibold",
                      textSize === "xlarge" && "text-2xl md:text-3xl font-bold"
                    )}>
                      {currentEntry.definition}
                    </p>
                  </div>

                  {/* AdSense Banner */}
                  <div className="my-6 no-print">
                    <AdBanner adSlot="8309351369" />
                  </div>

                  {/* SPECIALIZED PANELS BASED ON CATEGORY */}
                  {/* 1. Scientific Laws Formulas */}
                  {currentEntry.category === "laws" && currentEntry.formula && (
                    <div className="my-6 p-5 bg-linear-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-2xl shadow-xs">
                      <div className="flex items-center gap-2 mb-3 text-orange-800">
                        <Icons.FunctionSquare size={20} className="stroke-[2.5]" />
                        <span className="font-bold text-sm">المعادلة الرياضية / الصياغة القانونية:</span>
                      </div>
                      <div className="py-4 px-6 bg-white rounded-xl shadow-xs border border-orange-100 text-center font-mono text-xl md:text-3xl font-bold text-slate-800 dir-ltr">
                        {currentEntry.formula}
                      </div>
                    </div>
                  )}

                  {/* 2. Scientists Biographies */}
                  {currentEntry.category === "scientists" && (
                    <div className="my-6 p-5 bg-linear-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Icons.Calendar size={18} className="text-cyan-600" />
                        <div>
                          <span className="block text-xs text-slate-400 font-bold">فترة الحياة (الميلاد - الوفاة):</span>
                          <span className="text-sm font-bold text-slate-700">{currentEntry.bornDied || "غير محدد"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Icons.Globe size={18} className="text-cyan-600" />
                        <div>
                          <span className="block text-xs text-slate-400 font-bold">الجنسية / الموطن:</span>
                          <span className="text-sm font-bold text-slate-700">{currentEntry.nationality || "غير محدد"}</span>
                        </div>
                      </div>
                      
                      {currentEntry.discoveries && currentEntry.discoveries.length > 0 && (
                        <div className="md:col-span-2 border-t border-cyan-200/60 pt-3 mt-1">
                          <span className="block text-xs text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                            <Icons.Award size={16} className="text-cyan-600" />
                            <span>أبرز الإنجازات والاكتشافات العلمية:</span>
                          </span>
                          <ul className="space-y-1.5 text-sm text-slate-700 pr-4">
                            {currentEntry.discoveries.map((disc, idx) => (
                              <li key={idx} className="list-disc leading-relaxed">
                                {disc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Examples Section */}
                  {currentEntry.examples && currentEntry.examples.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                        <Icons.Lightbulb size={16} className="text-amber-500 fill-amber-100" />
                        <span>أمثلة تطبيقية وتوضيحية:</span>
                      </h4>
                      <div className="space-y-2">
                        {currentEntry.examples.map((ex, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 text-sm leading-relaxed">
                            <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-xs font-bold text-slate-400">{idx + 1}</span>
                            <p className="flex-1">{ex}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags Section */}
                  <div className="no-print flex flex-wrap items-center gap-2 mb-6">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Icons.Tag size={14} />
                      <span>الكلمات الدالة:</span>
                    </span>
                    {currentEntry.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleSearch(tag)}
                        className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-lg border border-slate-200 transition-all font-semibold"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

                  {/* Related Entries Section */}
                  {currentEntry.relatedIds && currentEntry.relatedIds.length > 0 && (
                    <div className="no-print border-t border-slate-100 pt-5 mt-6">
                      <h4 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-1.5">
                        <Icons.Link2 size={16} />
                        <span>مصطلحات ذات صلة وثيقة:</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {currentEntry.relatedIds.map((relId) => {
                          const relEntry = getEntryById(relId);
                          if (!relEntry) return null;
                          return (
                            <div
                              key={relId}
                              onClick={() => openEntry(relId)}
                              className="p-3 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-slate-50/50 cursor-pointer transition-all flex items-center gap-3 group shadow-xs"
                            >
                              <div className="bg-slate-100 p-1.5 rounded-lg text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                <Icons.ChevronRight size={16} />
                              </div>
                              <div className="overflow-hidden">
                                <h5 className="font-bold text-sm text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                  {relEntry.titleAr}
                                </h5>
                                <p className="text-[10px] text-slate-400 font-sans truncate font-semibold">
                                  {relEntry.titleEn}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : activeCategory === "home" ? (
              /* =========================================
                 B. HOME / DASHBOARD VIEW
                 ========================================= */
              <div className="space-y-6">
                
                {/* 1. Dashboard Greeting Banner */}
                <div className="bg-linear-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 relative overflow-hidden border border-slate-800 shadow-lg">
                  {/* Decorative background vectors */}
                  <div className="absolute inset-0 opacity-10 select-none pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <line x1="10" y1="10" x2="90" y2="90" stroke="white" strokeWidth="0.1" strokeDasharray="2 2" />
                      <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.1" fill="none" />
                      <ellipse cx="50" cy="50" rx="20" ry="40" stroke="white" strokeWidth="0.1" fill="none" />
                      <polygon points="50,15 15,80 85,80" stroke="white" strokeWidth="0.1" fill="none" />
                    </svg>
                  </div>

                  <div className="relative z-10 max-w-2xl">
                    <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold mb-3 border border-indigo-500/30">
                      منصة الشامل التعليمية: للطلبة والباحثين
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">مرحباً بك في بوابتك المعرفية.. الرائدة دائماً في تقديم المحتوى العلمي الأصيل</h2>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                      نظام "منصة الشامل التعليمية" المبتكر، صُمم بمحرك بحث متقدم يضمن لك الوصول الفوري والقانوني لكل ما تحتاجه من تعريفات وقوانين وسِيَر العلماء بنقرة واحدة. نحن في "منصة الشامل التعليمية" نعتز بهويتنا التي تضع الطالب في المقدمة، مع معالجة شاملة لتقنيات الخطوط العربية لضمان تجربة تعليمية لا تُضاهى.
                    </p>

                    {/* Quick Search Box inside Banner */}
                    <div className="relative w-full max-w-lg">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="ما هو المصطلح الذي تود البحث عنه اليوم؟"
                        className="w-full pl-12 pr-4 py-3 bg-white text-slate-800 rounded-xl focus:outline-hidden text-sm shadow-md font-semibold border-2 border-transparent focus:border-indigo-500"
                      />
                      <div className="absolute left-4 top-3.5 text-indigo-600">
                        <Icons.Search size={18} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Statistical Highlights Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { title: "التعاريف العلمية", value: entries.length, icon: "book-marked", color: "text-blue-600 bg-blue-50 border-blue-200" },
                    { title: "مجلدات ومجالات", value: categories.length, icon: "folders", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                    { title: "قوانين ونظريات", value: entries.filter(e => e.category === 'laws' || e.category === 'general').length, icon: "scale", color: "text-orange-600 bg-orange-50 border-orange-200" },
                    { title: "مفضلتي المحفوظة", value: favorites.length, icon: "heart-handshake", color: "text-rose-600 bg-rose-50 border-rose-200" }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
                      <div>
                        <span className="text-xs font-bold text-slate-400 block mb-1">{stat.title}</span>
                        <span className="text-2xl font-sans font-bold text-slate-800 leading-none">{stat.value}</span>
                      </div>
                      <div className={cn("p-3 rounded-xl border shadow-xs", stat.color)}>
                        <DynamicIcon name={stat.icon} size={22} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3. Main Dashboard Body: Featured & Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column (2 spans): Categories Grid */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-md font-bold text-slate-700 flex items-center gap-2">
                      <Icons.FolderTree size={18} />
                      <span>تصفح مجلدات منصة الشامل كاملة</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categories.map((cat) => {
                        const count = getEntriesByCategory(cat.id).length;
                        return (
                          <div
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={cn(
                              "border p-4 rounded-2xl cursor-pointer hover:scale-[1.01] transition-all flex flex-col justify-between h-36 group bg-white relative overflow-hidden shadow-xs border-slate-200"
                            )}
                          >
                            {/* Accent indicator */}
                            <div className={cn("absolute top-0 right-0 h-1.5 w-full border-b", cat.color.split(" ")[1])} />
                            
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <div className={cn("p-2 rounded-xl border shadow-xs bg-white", cat.color.split(" ")[2], cat.color.split(" ")[1])}>
                                  <DynamicIcon name={cat.iconName} size={18} />
                                </div>
                                <h4 className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">
                                  {cat.nameAr}
                                </h4>
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                {cat.descriptionAr}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-100">
                              <span className="font-sans font-bold bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200 text-slate-500">
                                {count} مصلطح
                              </span>
                              <span className="text-indigo-600 flex items-center gap-1 font-bold group-hover:gap-2 transition-all">
                                <span>تصفح المجلد</span>
                                <Icons.ChevronLeft size={14} />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column (1 span): Definition of the Day */}
                  <div className="space-y-4">
                    <h3 className="text-md font-bold text-slate-700 flex items-center gap-2">
                      <Icons.Sparkles size={18} className="text-amber-500" />
                      <span>تعريف اليوم المقترح</span>
                    </h3>

                    {dayEntry ? (
                      <div className="bg-linear-to-b from-amber-50/40 to-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-[calc(100%-2rem)]">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="px-2.5 py-0.5 bg-amber-500 text-white rounded-lg text-[11px] font-bold shadow-xs">
                              تثقيف يومي
                            </span>
                            <span className="text-[11px] text-slate-400 font-sans font-semibold">
                              {new Date().toLocaleDateString("ar-SA", { weekday: "long", month: "short", day: "numeric" })}
                            </span>
                          </div>

                          <h4 className="text-xl font-bold text-slate-900 mb-1">{dayEntry.titleAr}</h4>
                          <p className="text-xs font-sans font-bold text-slate-400 dir-ltr text-right mb-4 border-b border-amber-200/60 pb-3">
                            {dayEntry.titleEn}
                          </p>

                          <p className="text-slate-600 text-sm leading-relaxed text-justify line-clamp-6">
                            {dayEntry.definition}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-amber-200/60">
                          <button
                            onClick={() => openEntry(dayEntry.id)}
                            className="w-full py-2.5 bg-white border-2 border-amber-500 text-amber-600 rounded-xl hover:bg-amber-500 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
                          >
                            <Icons.BookOpen size={16} />
                            <span>اقرأ التعريف كاملاً</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">
                        جاري تحميل الاقتراح...
                      </div>
                    )}
                  </div>

                </div>

                {/* 4. Quick Highlights (Scientists & Laws) Carousels/Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Quick list: Great Scientists */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icons.Users size={16} className="text-cyan-600" />
                        <span>علماء غيروا مجرى التاريخ</span>
                      </div>
                      <button 
                        onClick={() => handleCategoryChange("scientists")}
                        className="text-xs text-indigo-600 font-bold hover:underline"
                      >
                        عرض الكل
                      </button>
                    </h3>
                    <div className="space-y-3">
                      {entries
                        .filter((e) => e.category === "scientists")
                        .slice(0, 3)
                        .map((sc) => (
                          <div 
                            key={sc.id}
                            onClick={() => openEntry(sc.id)}
                            className="p-3 border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/10 cursor-pointer rounded-xl flex items-center justify-between group transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-cyan-50 text-cyan-600 border border-cyan-100 rounded-lg group-hover:scale-105 transition-all">
                                <Icons.User size={16} />
                              </div>
                              <div>
                                <span className="font-bold text-sm text-slate-800 group-hover:text-cyan-700">{sc.titleAr}</span>
                                <span className="block text-[10px] text-slate-400 font-sans font-semibold">{sc.bornDied}</span>
                              </div>
                            </div>
                            <Icons.ChevronLeft size={16} className="text-slate-300 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Quick list: Famous Laws */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icons.Binary size={16} className="text-orange-600" />
                        <span>قوانين طبيعية تحكم الكون</span>
                      </div>
                      <button 
                        onClick={() => handleCategoryChange("laws")}
                        className="text-xs text-indigo-600 font-bold hover:underline"
                      >
                        عرض الكل
                      </button>
                    </h3>
                    <div className="space-y-3">
                      {entries
                        .filter((e) => e.category === "laws")
                        .slice(0, 3)
                        .map((law) => (
                          <div 
                            key={law.id}
                            onClick={() => openEntry(law.id)}
                            className="p-3 border border-slate-100 hover:border-orange-200 hover:bg-orange-50/10 cursor-pointer rounded-xl flex items-center justify-between group transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg group-hover:scale-105 transition-all">
                                <Icons.ScrollText size={16} />
                              </div>
                              <div>
                                <span className="font-bold text-sm text-slate-800 group-hover:text-orange-700">{law.titleAr}</span>
                                <span className="block text-[10px] font-mono font-bold text-slate-400 dir-ltr text-right">{law.formula?.split("|")[0]}</span>
                              </div>
                            </div>
                            <Icons.ChevronLeft size={16} className="text-slate-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* =========================================
                 C. BROWSE / LIST VIEW (Category / Search / Bookmarks)
                 ========================================= */
              <div className="space-y-6">
                
                {/* 1. Browse Header / Banner */}
                <div className={cn(
                  "border rounded-2xl p-5 shadow-xs relative overflow-hidden",
                  activeCategoryData 
                    ? activeCategoryData.color.split(" ")[0] + " " + activeCategoryData.color.split(" ")[1]
                    : activeCategory === "bookmarks"
                      ? "bg-rose-50 border-rose-200 text-rose-800"
                      : "bg-slate-100 border-slate-200 text-slate-800"
                )}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white border rounded-xl shadow-xs text-current border-current/20 shrink-0">
                        {activeCategoryData ? (
                          <DynamicIcon name={activeCategoryData.iconName} size={28} />
                        ) : activeCategory === "bookmarks" ? (
                          <Icons.Heart size={28} className="fill-rose-500 text-rose-500" />
                        ) : (
                          <Icons.FolderClosed size={28} className="text-slate-500" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold">
                          {activeCategoryData 
                            ? activeCategoryData.nameAr 
                            : activeCategory === "bookmarks"
                              ? "مفضلتي العلمية المحفوظة"
                              : "تصفح مجلدات الموسوعة كاملة"}
                        </h2>
                        <p className="text-xs md:text-sm text-current/80 mt-0.5 max-w-2xl leading-relaxed">
                          {activeCategoryData 
                            ? activeCategoryData.descriptionAr 
                            : activeCategory === "bookmarks"
                              ? "مجموعة المصطلحات العلمية والتعريفات التي قمت بحفظها أثناء بحثك ودراستك لمراجعتها لاحقاً."
                              : "عرض لجميع المصلطحات العلمية المدرجة بالترتيب الهجائي لتسهيل البحث الشامل والدقيق."}
                        </p>
                      </div>
                    </div>
                    
                    {/* Compact counter */}
                    <div className="sm:text-left">
                      <span className="px-3 py-1 bg-white/60 border border-current/10 rounded-full text-xs font-sans font-bold">
                        {sortedEntriesList.length} مصلطح مُدرج
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Advanced Alphabet Filter (SOLVES LONG LIST PROBLEM) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <Icons.SlidersHorizontal size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-400">تصفية سريعة حسب الحرف الهجائي (الأبجدية):</span>
                    {alphabetFilter && (
                      <button
                        onClick={() => setAlphabetFilter("")}
                        className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-md hover:bg-indigo-100 transition-all flex items-center gap-1"
                      >
                        <Icons.X size={10} />
                        <span>إلغاء الحرف ({alphabetFilter})</span>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 md:gap-1.5 justify-center">
                    {arabicAlphabet.map((char) => (
                      <button
                        key={char}
                        onClick={() => setAlphabetFilter(alphabetFilter === char ? "" : char)}
                        className={cn(
                          "w-8 h-8 rounded-lg text-sm font-bold border flex items-center justify-center transition-all",
                          alphabetFilter === char
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 scale-110 z-10"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-400 hover:text-slate-900"
                        )}
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Browse Sub-Bar (Reset alerts) */}
                {(searchQuery || alphabetFilter) && (
                  <div className="flex items-center justify-between p-3 bg-linear-to-r from-slate-100 to-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>نتائج التصفية لـ:</span>
                      {searchQuery && (
                        <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-bold text-slate-800">
                          البحث: "{searchQuery}"
                        </span>
                      )}
                      {alphabetFilter && (
                        <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-bold text-slate-800">
                          حرف: {alphabetFilter}
                        </span>
                      )}
                      <span className="text-slate-400">({sortedEntriesList.length} مصلطح مطابِق)</span>
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setAlphabetFilter("");
                      }}
                      className="font-bold text-indigo-600 hover:text-indigo-800 shrink-0"
                    >
                      إعادة تعيين التصفية
                    </button>
                  </div>
                )}

                {/* 4. Definition List (Expandable Grid/List Layout) */}
                {sortedEntriesList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sortedEntriesList.map((entry) => {
                      const isFavorite = favorites.includes(entry.id);
                      const cat = categories.find((c) => c.id === entry.category);
                      
                      return (
                        <div
                          key={entry.id}
                          onClick={() => openEntry(entry.id)}
                          className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between group shadow-xs"
                        >
                          <div>
                            {/* Card Top: Tags/Favorites & Category */}
                            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                              {cat ? (
                                <span className={cn("text-[10px] px-2 py-0.5 rounded-md border font-bold", cat.color)}>
                                  {cat.nameAr}
                                  {entry.subCategory && ` / ${entry.subCategory}`}
                                </span>
                              ) : <span className="text-[10px] text-slate-400">مصلطح</span>}
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Don't trigger card click
                                  toggleFavorite(entry.id);
                                }}
                                className={cn(
                                  "p-1.5 rounded-lg border shadow-xs text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all",
                                  isFavorite && "text-rose-500 bg-rose-50 border-rose-100"
                                )}
                              >
                                <Icons.Heart size={14} className={isFavorite ? "fill-rose-500" : ""} />
                              </button>
                            </div>

                            {/* Titles */}
                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-0.5">
                              {entry.titleAr}
                            </h3>
                            <p className="text-xs font-sans font-semibold text-slate-400 dir-ltr text-right mb-3">
                              {entry.titleEn}
                            </p>

                            {/* Definition Snippet */}
                            <p className="text-slate-600 text-xs md:text-sm leading-relaxed line-clamp-3 text-justify">
                              {entry.definition}
                            </p>
                          </div>

                          {/* Card Bottom: Read more indicator */}
                          <div className="mt-4 pt-3 border-t border-slate-100/60 flex items-center justify-between">
                            {/* Special visual tag based on data type */}
                            {entry.formula ? (
                              <span className="text-[10px] font-mono font-bold text-orange-500 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-md">
                                صيغة رياضية
                              </span>
                            ) : entry.category === "scientists" ? (
                              <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 border border-cyan-100 px-1.5 py-0.5 rounded-md">
                                سيرة ذاتية
                              </span>
                            ) : (
                              <div className="flex gap-1 overflow-hidden max-w-[150px]">
                                {entry.tags.slice(0, 2).map((tag) => (
                                  <span key={tag} className="text-[9px] text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md truncate">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            <span className="text-xs text-indigo-600 font-bold flex items-center gap-1 group-hover:gap-1.5 transition-all">
                              <span>قراءة التفسير</span>
                              <Icons.ChevronLeft size={14} />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* EMPTY STATE - NO SEARCH RESULTS */
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-xs">
                    <div className="bg-slate-50 p-4 rounded-full border border-slate-100 w-16 h-16 flex items-center justify-center text-slate-400 mx-auto mb-4 shadow-inner">
                      <Icons.SearchX size={32} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">عذراً، لم يتم العثور على نتائج</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      لم نجد أي مصلطحات علمية مطابقة لمعايير التصفية الحالية. يرجى تجربة كتابة كلمات مفتاحية أخرى، أو اختيار حرف هجائي مختلف، أو تغيير المجلد المحدد.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setAlphabetFilter("");
                      }}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 mx-auto shadow-md shadow-indigo-100 transition-all"
                    >
                      <Icons.RefreshCw size={14} />
                      <span>إعادة ضبط البحث والتصفح</span>
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}