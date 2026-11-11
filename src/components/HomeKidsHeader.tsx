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
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="h-14 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo & Brand: Yulha Studio - Modern Aesthetic */}
            <button
              type="button"
              onClick={() => setCurrentTab('templates')}
              className="inline-flex items-center gap-2 sm:gap-3 text-left group transition cursor-pointer focus:outline-none shrink-0"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-400 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-102 transition-transform shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 leading-none">
                    율하스튜디오
                  </span>
                  <span className="inline-flex items-center justify-center text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-600 border border-rose-100 leading-none">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-none mt-0.5 sm:mt-1">
                  Yulha Studio
                </span>
              </div>
            </button>

            {/* Universal Categories Filter (데스크톱 전용) */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 text-xs">
              {[
                { id: 'all', label: '전체 콘텐츠' },
                { id: 'home', label: '홈 & 리빙' },
                { id: 'daily', label: '일상 · 브이로그' },
                { id: 'kids', label: '키즈 · 패밀리' },
                { id: 'cafe_travel', label: '공간 · 감성' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as UniversalCategory)}
                  className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl font-medium transition-all leading-none cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Desktop Navigation Tabs (sm 이상 화면에서 표시) */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 text-xs shrink-0">
              <button
                onClick={() => setCurrentTab('templates')}
                className={`inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl font-medium transition-all leading-none whitespace-nowrap cursor-pointer ${
                  currentTab === 'templates'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="leading-none">홈 (시작)</span>
              </button>

              <button
                onClick={() => setCurrentTab('studio')}
                className={`inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-bold transition-all leading-none whitespace-nowrap cursor-pointer ${
                  currentTab === 'studio'
                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm shadow-rose-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 shrink-0" />
                <span className="leading-none">스튜디오</span>
              </button>

              {onOpenCapCut && (
                <button
                  type="button"
                  onClick={onOpenCapCut}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/25 transition-all leading-none whitespace-nowrap cursor-pointer"
                  title="전문 동영상 컷편집기 즉시 실행"
                >
                  <Scissors className="w-3.5 h-3.5 shrink-0" />
                  <span className="leading-none">동영상 컷편집</span>
                </button>
              )}

              <button
                onClick={() => setCurrentTab('publish')}
                className={`inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl font-medium transition-all leading-none whitespace-nowrap cursor-pointer ${
                  currentTab === 'publish'
                    ? 'bg-white text-rose-600 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="leading-none">SNS 발행</span>
              </button>

              <button
                onClick={() => setCurrentTab('saved')}
                className={`inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl font-medium transition-all leading-none whitespace-nowrap cursor-pointer ${
                  currentTab === 'saved'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <FolderHeart className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="leading-none">보관함</span>
                {savedCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] bg-rose-500 text-white font-extrabold rounded-full leading-none ml-0.5">
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
                  className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl font-black bg-indigo-600 text-white text-[11px] shadow-xs active:scale-95 transition-transform"
                >
                  <Scissors className="w-3 h-3 shrink-0" />
                  <span>컷편집</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setCurrentTab('studio')}
                className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl font-bold bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[11px] shadow-xs active:scale-95 transition-transform"
              >
                <Wand2 className="w-3 h-3 shrink-0" />
                <span>편집기</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 📱 Mobile Fixed Bottom Navigation Bar (모바일 전용 하단 탭바 - 잘림 원천 방지) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around safe-area-pb">
        <button
          onClick={() => setCurrentTab('templates')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            currentTab === 'templates' ? 'text-rose-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <LayoutGrid className="w-4 h-4 shrink-0 mb-0.5" />
          <span className="text-[10px] leading-none">홈</span>
        </button>

        <button
          onClick={() => setCurrentTab('studio')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            currentTab === 'studio' ? 'text-rose-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Wand2 className="w-4 h-4 shrink-0 mb-0.5" />
          <span className="text-[10px] leading-none">스튜디오</span>
        </button>

        {onOpenCapCut && (
          <button
            onClick={onOpenCapCut}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-black border border-indigo-200/80 shadow-2xs active:scale-95 transition-transform -translate-y-1"
          >
            <Scissors className="w-4 h-4 shrink-0 mb-0.5 text-indigo-600" />
            <span className="text-[10px] leading-none">동영상 컷</span>
          </button>
        )}

        <button
          onClick={() => setCurrentTab('publish')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            currentTab === 'publish' ? 'text-rose-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Share2 className="w-4 h-4 shrink-0 mb-0.5" />
          <span className="text-[10px] leading-none">SNS</span>
        </button>

        <button
          onClick={() => setCurrentTab('saved')}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            currentTab === 'saved' ? 'text-rose-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <FolderHeart className="w-4 h-4 shrink-0 mb-0.5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1 py-0.2 text-[8px] bg-rose-500 text-white font-black rounded-full leading-none">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-none">보관함</span>
        </button>
      </nav>
    </>
  );
};
