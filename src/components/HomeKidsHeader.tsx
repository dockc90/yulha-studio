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
      <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-[#EDEDEB] w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo & Brand: Notion-Style Clean Minimalist */}
            <button
              type="button"
              onClick={() => setCurrentTab('templates')}
              className="inline-flex items-center gap-2 sm:gap-2.5 text-left group transition cursor-pointer focus:outline-none shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-[#23272A] flex items-center justify-center text-white text-xs font-black shadow-xs shrink-0 group-hover:bg-[#37352F] transition-colors">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5">
                  <span className="font-bold text-base sm:text-lg tracking-tight text-[#37352F] leading-none">
                    율하스튜디오
                  </span>
                  <span className="inline-flex items-center justify-center text-[10px] px-1.5 py-0.5 rounded font-medium bg-[#F1F1EF] text-[#787774] border border-[#E3E2DE] leading-none">
                    PRO
                  </span>
                </div>
                <span className="text-[11px] text-[#9B9A97] font-medium leading-none mt-0.5">
                  Yulha Studio
                </span>
              </div>
            </button>

            {/* Universal Categories Filter (데스크톱 전용 - 노션 스타일) */}
            <div className="hidden lg:flex items-center gap-1 bg-[#F1F1EF] p-1 rounded-xl border border-[#E3E2DE] text-xs">
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
                  className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs transition-all leading-none cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-white text-[#37352F] shadow-xs font-semibold'
                      : 'text-[#787774] hover:text-[#37352F] hover:bg-white/60 font-medium'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Desktop Navigation Tabs (sm 이상 화면 - 노션 스타일) */}
            <div className="hidden sm:flex items-center gap-1 bg-[#F1F1EF] p-1 rounded-xl border border-[#E3E2DE] text-xs shrink-0">
              <button
                onClick={() => setCurrentTab('templates')}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all leading-none whitespace-nowrap cursor-pointer ${
                  currentTab === 'templates'
                    ? 'bg-white text-[#37352F] shadow-xs font-semibold'
                    : 'text-[#787774] hover:text-[#37352F] hover:bg-white/60 font-medium'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#787774] shrink-0" />
                <span className="leading-none">홈</span>
              </button>

              <button
                onClick={() => setCurrentTab('studio')}
                className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all leading-none whitespace-nowrap cursor-pointer ${
                  currentTab === 'studio'
                    ? 'bg-[#23272A] text-white shadow-xs font-semibold'
                    : 'text-[#787774] hover:text-[#37352F] hover:bg-white/60 font-medium'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 shrink-0" />
                <span className="leading-none">스튜디오</span>
              </button>

              {onOpenCapCut && (
                <button
                  type="button"
                  onClick={onOpenCapCut}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-[#37352F] hover:bg-[#23272A] text-white transition-all leading-none whitespace-nowrap cursor-pointer"
                  title="전문 동영상 컷편집기 즉시 실행"
                >
                  <Scissors className="w-3.5 h-3.5 shrink-0" />
                  <span className="leading-none">동영상 컷편집</span>
                </button>
              )}

              <button
                onClick={() => setCurrentTab('publish')}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all leading-none whitespace-nowrap cursor-pointer ${
                  currentTab === 'publish'
                    ? 'bg-white text-[#37352F] shadow-xs font-semibold'
                    : 'text-[#787774] hover:text-[#37352F] hover:bg-white/60 font-medium'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-[#787774] shrink-0" />
                <span className="leading-none">SNS 발행</span>
              </button>

              <button
                onClick={() => setCurrentTab('saved')}
                className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all leading-none whitespace-nowrap cursor-pointer ${
                  currentTab === 'saved'
                    ? 'bg-white text-[#37352F] shadow-xs font-semibold'
                    : 'text-[#787774] hover:text-[#37352F] hover:bg-white/60 font-medium'
                }`}
              >
                <FolderHeart className="w-3.5 h-3.5 text-[#787774] shrink-0" />
                <span className="leading-none">보관함</span>
                {savedCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] bg-[#23272A] text-white font-bold rounded-full leading-none ml-0.5">
                    {savedCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Header Right: Clean saved count pill */}
            <div className="flex sm:hidden items-center gap-1.5">
              {savedCount > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentTab('saved')}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F1F1EF] text-[#37352F] text-[11px] font-medium border border-[#E3E2DE]"
                >
                  <FolderHeart className="w-3 h-3 text-[#787774]" />
                  <span>보관함 {savedCount}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 📱 Mobile Fixed Bottom Navigation Bar (모바일 전용 하단 탭바 - 노션 미니멀 스타일) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FBFBFA]/95 backdrop-blur-md border-t border-[#EDEDEB] px-2 py-1.5 flex items-center justify-around safe-area-pb">
        <button
          onClick={() => setCurrentTab('templates')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all ${
            currentTab === 'templates' ? 'text-[#23272A] font-bold' : 'text-[#9B9A97] font-medium hover:text-[#37352F]'
          }`}
        >
          <LayoutGrid className="w-4 h-4 shrink-0 mb-0.5" />
          <span className="text-[10px] leading-none">홈</span>
          {currentTab === 'templates' && <span className="w-1 h-1 rounded-full bg-[#23272A] mt-0.5" />}
        </button>

        <button
          onClick={() => setCurrentTab('studio')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all ${
            currentTab === 'studio' ? 'text-[#23272A] font-bold' : 'text-[#9B9A97] font-medium hover:text-[#37352F]'
          }`}
        >
          <Wand2 className="w-4 h-4 shrink-0 mb-0.5" />
          <span className="text-[10px] leading-none">스튜디오</span>
          {currentTab === 'studio' && <span className="w-1 h-1 rounded-full bg-[#23272A] mt-0.5" />}
        </button>

        {onOpenCapCut && (
          <button
            onClick={onOpenCapCut}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all text-[#9B9A97] font-medium hover:text-[#37352F] cursor-pointer"
          >
            <Scissors className="w-4 h-4 shrink-0 mb-0.5" />
            <span className="text-[10px] leading-none">동영상 컷</span>
          </button>
        )}

        <button
          onClick={() => setCurrentTab('publish')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all ${
            currentTab === 'publish' ? 'text-[#23272A] font-bold' : 'text-[#9B9A97] font-medium hover:text-[#37352F]'
          }`}
        >
          <Share2 className="w-4 h-4 shrink-0 mb-0.5" />
          <span className="text-[10px] leading-none">SNS</span>
          {currentTab === 'publish' && <span className="w-1 h-1 rounded-full bg-[#23272A] mt-0.5" />}
        </button>

        <button
          onClick={() => setCurrentTab('saved')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all ${
            currentTab === 'saved' ? 'text-[#23272A] font-bold' : 'text-[#9B9A97] font-medium hover:text-[#37352F]'
          }`}
        >
          <div className="relative">
            <FolderHeart className="w-4 h-4 shrink-0 mb-0.5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.2 text-[8px] bg-[#23272A] text-white font-bold rounded-full leading-none">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-none">보관함</span>
          {currentTab === 'saved' && <span className="w-1 h-1 rounded-full bg-[#23272A] mt-0.5" />}
        </button>
      </nav>
    </>
  );
};
