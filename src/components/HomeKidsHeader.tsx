import React from 'react';
import { 
  Sparkles, 
  Share2, 
  FolderHeart, 
  LayoutGrid, 
  Wand2,
  Compass,
  Scissors
} from 'lucide-react';

export type StudioTab = 'templates' | 'studio' | 'publish' | 'saved';

export type UniversalCategory = 'all' | 'home' | 'daily' | 'kids' | 'cafe_travel';

interface StudioHeaderProps {
  currentTab: StudioTab;
  setCurrentTab: (tab: StudioTab) => void;
  activeCategory: UniversalCategory;
  setActiveCategory: (cat: UniversalCategory) => void;
  savedCount: number;
  onOpenCapCut?: () => void;
}

export const HomeKidsHeader: React.FC<StudioHeaderProps> = ({
  currentTab,
  setCurrentTab,
  activeCategory,
  setActiveCategory,
  savedCount,
  onOpenCapCut,
}) => {
  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-pink-100 shadow-[0_4px_20px_-2px_rgba(255,105,180,0.08)] w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="h-14 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo & Brand: Yulha Studio - Vivid & Cute Aesthetic */}
            <button
              type="button"
              onClick={() => setCurrentTab('templates')}
              className="inline-flex items-center gap-2 sm:gap-3 text-left group transition cursor-pointer focus:outline-none shrink-0"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 group-hover:scale-108 group-hover:rotate-6 transition-all shrink-0">
                <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 sm:gap-2">
                  <span className="font-black text-base sm:text-xl tracking-tight bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent leading-none">
                    율하스튜디오
                  </span>
                  <span className="inline-flex items-center justify-center text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-black bg-gradient-to-r from-amber-300 to-amber-400 text-amber-950 border border-amber-200/80 shadow-2xs leading-none">
                    PRO ✨
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-pink-400/90 font-bold leading-none mt-0.5 sm:mt-1">
                  Yulha Studio · 감성 미디어
                </span>
              </div>
            </button>

            {/* Universal Categories Filter (데스크톱 전용) */}
            <div className="hidden lg:flex items-center gap-1 bg-pink-50/70 p-1 rounded-2xl border border-pink-100/90 text-xs shadow-2xs">
              {[
                { id: 'all', label: '🌈 전체 콘텐츠' },
                { id: 'home', label: '🏡 홈 & 리빙' },
                { id: 'daily', label: '☕ 일상 · 브이로그' },
                { id: 'kids', label: '👶 키즈 · 패밀리' },
                { id: 'cafe_travel', label: '✨ 공간 · 감성' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as UniversalCategory)}
                  className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl font-bold transition-all leading-none cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white shadow-sm shadow-pink-500/25 font-black scale-102'
                      : 'text-slate-600 hover:text-pink-600 hover:bg-white/80'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Desktop Navigation Tabs (sm 이상 화면에서 표시) */}
            <div className="hidden sm:flex items-center gap-1.5 bg-pink-50/80 p-1.5 rounded-2xl border border-pink-100 text-xs shrink-0 shadow-2xs">
              <button
                onClick={() => setCurrentTab('templates')}
                className={`inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl font-bold transition-all leading-none whitespace-nowrap cursor-pointer ${
                  currentTab === 'templates'
                    ? 'bg-white text-pink-600 shadow-sm font-black scale-102'
                    : 'text-slate-600 hover:text-pink-600 hover:bg-white/60'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span className="leading-none">홈 (시작)</span>
              </button>

              <button
                onClick={() => setCurrentTab('studio')}
                className={`inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-black transition-all leading-none whitespace-nowrap cursor-pointer ${
                  currentTab === 'studio'
                    ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white shadow-md shadow-pink-500/30 scale-102'
                    : 'text-slate-600 hover:text-pink-600 hover:bg-white/60 font-bold'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 shrink-0" />
                <span className="leading-none">스튜디오</span>
              </button>

              {onOpenCapCut && (
                <button
                  type="button"
                  onClick={onOpenCapCut}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/25 transition-all leading-none whitespace-nowrap cursor-pointer hover:scale-102"
                  title="전문 동영상 컷편집기 즉시 실행"
                >
                  <Scissors className="w-3.5 h-3.5 shrink-0" />
                  <span className="leading-none">동영상 컷편집</span>
                </button>
              )}

              <button
                onClick={() => setCurrentTab('publish')}
                className={`inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl font-bold transition-all leading-none whitespace-nowrap cursor-pointer ${
                  currentTab === 'publish'
                    ? 'bg-white text-rose-600 shadow-sm font-black'
                    : 'text-slate-600 hover:text-rose-600 hover:bg-white/60'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="leading-none">SNS 발행</span>
              </button>

              <button
                onClick={() => setCurrentTab('saved')}
                className={`inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl font-bold transition-all leading-none whitespace-nowrap cursor-pointer ${
                  currentTab === 'saved'
                    ? 'bg-white text-pink-600 shadow-sm font-black'
                    : 'text-slate-600 hover:text-pink-600 hover:bg-white/60'
                }`}
              >
                <FolderHeart className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span className="leading-none">보관함</span>
                {savedCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-full leading-none ml-0.5 shadow-2xs">
                    {savedCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Top Header Quick Action (모바일 전용 우측 바로가기) */}
            <div className="flex sm:hidden items-center gap-1.5">
              {onOpenCapCut && (
                <button
                  type="button"
                  onClick={onOpenCapCut}
                  className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] shadow-sm shadow-purple-500/25 active:scale-95 transition-transform"
                >
                  <Scissors className="w-3 h-3 shrink-0" />
                  <span>컷편집</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setCurrentTab('studio')}
                className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white text-[11px] shadow-md shadow-pink-500/25 active:scale-95 transition-transform"
              >
                <Wand2 className="w-3 h-3 shrink-0" />
                <span>편집기</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 📱 Mobile Fixed Bottom Navigation Bar (모바일 전용 하단 탭바 - 비비드 & 큐트 스타일) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-pink-100 shadow-[0_-4px_25px_rgba(255,100,150,0.12)] px-2 py-1.5 flex items-center justify-around safe-area-pb">
        <button
          onClick={() => setCurrentTab('templates')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'templates' ? 'text-pink-600 font-black scale-105' : 'text-slate-400 font-bold hover:text-slate-700'
          }`}
        >
          <LayoutGrid className="w-4 h-4 shrink-0 mb-0.5" />
          <span className="text-[10px] leading-none">홈</span>
          {currentTab === 'templates' && <span className="w-1 h-1 rounded-full bg-pink-500 mt-0.5" />}
        </button>

        <button
          onClick={() => setCurrentTab('studio')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'studio' ? 'text-pink-600 font-black scale-105' : 'text-slate-400 font-bold hover:text-slate-700'
          }`}
        >
          <Wand2 className="w-4 h-4 shrink-0 mb-0.5" />
          <span className="text-[10px] leading-none">스튜디오</span>
          {currentTab === 'studio' && <span className="w-1 h-1 rounded-full bg-pink-500 mt-0.5" />}
        </button>

        {onOpenCapCut && (
          <button
            onClick={onOpenCapCut}
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black border-2 border-white shadow-md shadow-purple-500/30 active:scale-95 transition-transform -translate-y-2"
          >
            <Scissors className="w-4 h-4 shrink-0 mb-0.5" />
            <span className="text-[10px] leading-none font-black">동영상 컷</span>
          </button>
        )}

        <button
          onClick={() => setCurrentTab('publish')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'publish' ? 'text-rose-600 font-black scale-105' : 'text-slate-400 font-bold hover:text-slate-700'
          }`}
        >
          <Share2 className="w-4 h-4 shrink-0 mb-0.5" />
          <span className="text-[10px] leading-none">SNS</span>
          {currentTab === 'publish' && <span className="w-1 h-1 rounded-full bg-rose-500 mt-0.5" />}
        </button>

        <button
          onClick={() => setCurrentTab('saved')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'saved' ? 'text-pink-600 font-black scale-105' : 'text-slate-400 font-bold hover:text-slate-700'
          }`}
        >
          <div className="relative">
            <FolderHeart className="w-4 h-4 shrink-0 mb-0.5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.2 text-[8px] bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-full leading-none shadow-xs">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-none">보관함</span>
          {currentTab === 'saved' && <span className="w-1 h-1 rounded-full bg-pink-500 mt-0.5" />}
        </button>
      </nav>
    </>
  );
};
