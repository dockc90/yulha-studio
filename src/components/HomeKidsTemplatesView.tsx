import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Layers, 
  MessageCircle,
  Instagram,
  Youtube,
  Play,
  Scissors,
  Film,
  Image as ImageIcon,
  RotateCw,
  Music,
  Smartphone,
  Square,
  UploadCloud,
  CheckCircle2,
  Wand2,
  Heart,
  Sliders,
  Maximize2
} from 'lucide-react';
import { QuickTemplate, UniversalCategory, HomeKidsProject, CanvasAspectRatio } from '../types/homeAndKids';
import { QUICK_TEMPLATES, SAMPLE_HOME_KIDS_PROJECTS } from '../data/homeKidsTemplates';
import { 
  InstagramIcon, 
  InstagramBadge, 
  YouTubeIcon, 
  YouTubeBadge, 
  OHouseBadge 
} from './BrandIcons';

interface TemplatesViewProps {
  activeCategory: UniversalCategory;
  setActiveCategory: (cat: UniversalCategory) => void;
  onSelectTemplate: (template: QuickTemplate) => void;
  onLoadProject: (project: HomeKidsProject) => void;
  onCreateNewProject: (category: UniversalCategory, options?: { aspectRatio?: CanvasAspectRatio; openCapCut?: boolean }) => void;
  onStartWithMedia?: (files: FileList | File[], options?: { aspectRatio?: CanvasAspectRatio; openCapCut?: boolean }) => void;
  onOpenCapCutDirectly?: () => void;
}

export const HomeKidsTemplatesView: React.FC<TemplatesViewProps> = ({
  activeCategory,
  setActiveCategory,
  onSelectTemplate,
  onLoadProject,
  onCreateNewProject,
  onStartWithMedia,
  onOpenCapCutDirectly,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTemplates = QUICK_TEMPLATES.filter(
    (t) => activeCategory === 'all' || t.category === activeCategory
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (onStartWithMedia) {
        onStartWithMedia(e.dataTransfer.files);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (onStartWithMedia) {
        onStartWithMedia(e.target.files);
      }
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        accept="image/*,video/*"
        className="hidden"
      />

      {/* 1. HERO & PURPOSE: Notion-Style Clean Minimalist Start */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 md:p-10 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] w-full">
        <div className="max-w-3xl space-y-3.5 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F1F1EF] text-[#37352F] text-[11px] sm:text-xs font-semibold border border-[#E3E2DE] leading-none">
            <Sparkles className="w-3.5 h-3.5 text-[#37352F] shrink-0" />
            <span className="leading-none">Yulha Studio · All-in-One Creator</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#37352F] tracking-tight leading-snug sm:leading-tight break-keep">
            소중한 일상과 순간을 <br className="hidden sm:inline" />
            깔끔한 미디어 콘텐츠로 완성하세요
          </h1>

          <p className="text-xs sm:text-sm text-[#787774] leading-relaxed font-normal break-keep">
            사진 보정, 타임라인 정밀 컷분할 & 병합, 회전 자막, 스튜디오 필터, 저작권 안심 36곡 BGM까지 —
            복잡한 툴 없이 <strong className="text-[#37352F]">인스타그램 릴스 · 오늘의집 스토리 · 유튜브 쇼츠</strong>를 빠르게 제작할 수 있습니다.
          </p>

          {/* Platform Quick Dimension Buttons with Official Brand Badges */}
          <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-medium text-[#787774] mr-0.5">플랫폼 규격:</span>
            <button
              onClick={() => onCreateNewProject('all', { aspectRatio: '9:16' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50/50 text-[#37352F] hover:text-black text-xs font-medium border border-[#E3E2DE] hover:border-rose-200 transition-all cursor-pointer shadow-2xs group"
            >
              <InstagramBadge size="sm" className="group-hover:scale-110 transition-transform" />
              <span>9:16 릴스·쇼츠</span>
            </button>

            <button
              onClick={() => onCreateNewProject('home', { aspectRatio: '1:1' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50/50 text-[#37352F] hover:text-black text-xs font-medium border border-[#E3E2DE] hover:border-sky-200 transition-all cursor-pointer shadow-2xs group"
            >
              <OHouseBadge size="sm" className="group-hover:scale-110 transition-transform" />
              <span>1:1 오늘의집 피드</span>
            </button>

            <button
              onClick={() => onCreateNewProject('daily', { aspectRatio: '4:5' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50/50 text-[#37352F] hover:text-black text-xs font-medium border border-[#E3E2DE] hover:border-rose-200 transition-all cursor-pointer shadow-2xs group"
            >
              <InstagramBadge size="sm" className="group-hover:scale-110 transition-transform" />
              <span>4:5 세로 피드</span>
            </button>

            <button
              onClick={() => onCreateNewProject('cafe_travel', { aspectRatio: '16:9' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-red-50/50 text-[#37352F] hover:text-black text-xs font-medium border border-[#E3E2DE] hover:border-red-200 transition-all cursor-pointer shadow-2xs group"
            >
              <YouTubeBadge size="sm" className="group-hover:scale-110 transition-transform" />
              <span>16:9 유튜브 가로</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 SUPERPOWER CARDS: Elevated Sensory Action Hub */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#37352F] flex items-center gap-2">
            <span>작업 시작하기</span>
            <span className="text-xs text-[#787774] font-medium bg-[#F1F1EF] px-2 py-0.5 rounded-full border border-[#E3E2DE]">바로가기</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
          {/* Action 1: Dedicated Video Cut Editor */}
          <div 
            onClick={() => {
              if (onOpenCapCutDirectly) onOpenCapCutDirectly();
              else onCreateNewProject('all', { openCapCut: true, aspectRatio: '9:16' });
            }}
            className="group relative rounded-2xl p-5 bg-white text-[#37352F] hover:bg-[#FDFDFD] transition-all cursor-pointer flex flex-col justify-between border border-[#E9E9E7] hover:border-indigo-300 hover:shadow-[0_4px_20px_rgba(99,102,241,0.1)] w-full min-w-0"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#191919] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Scissors className="w-4 h-4 text-white" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  동영상 에디터
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#191919] group-hover:text-indigo-900 transition-colors">
                  동영상 컷분할 & 합치기
                </h3>
                <p className="text-xs text-[#787774] mt-1 leading-relaxed break-keep font-normal">
                  재생바에서 <strong className="text-neutral-800">분할</strong> 및 <strong className="text-neutral-800">합치기</strong>, 배속 조절, 화면 회전, 전환 효과를 직관적으로 편집합니다.
                </p>
              </div>
            </div>

            <div className="pt-3.5 mt-3 border-t border-[#EDEDEB] flex items-center justify-between text-xs font-semibold text-[#37352F] group-hover:text-indigo-600">
              <span>편집기 열기</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#787774] group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* Action 2: Photo Polish & Stickers */}
          <div 
            onClick={() => onCreateNewProject('home', { aspectRatio: '1:1' })}
            className="group relative rounded-2xl p-5 bg-white text-[#37352F] hover:bg-[#FDFDFD] transition-all cursor-pointer flex flex-col justify-between border border-[#E9E9E7] hover:border-amber-300 hover:shadow-[0_4px_20px_rgba(245,158,11,0.1)] w-full min-w-0"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-400 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-4 h-4 text-white" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                  감성 필터
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#191919] group-hover:text-amber-900 transition-colors">
                  사진 보정 & 스티커
                </h3>
                <p className="text-xs text-[#787774] mt-1 leading-relaxed break-keep font-normal">
                  감성 스튜디오 필터, 얼굴 보호용 마스크 스티커, 화면 직접 회전 자막을 손쉽게 적용합니다.
                </p>
              </div>
            </div>

            <div className="pt-3.5 mt-3 border-t border-[#EDEDEB] flex items-center justify-between text-xs font-semibold text-[#37352F] group-hover:text-amber-600">
              <span>사진 편집 시작</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#787774] group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* Action 3: 9:16 Vertical Shorts/Reels */}
          <div 
            onClick={() => onCreateNewProject('daily', { aspectRatio: '9:16' })}
            className="group relative rounded-2xl p-5 bg-white text-[#37352F] hover:bg-[#FDFDFD] transition-all cursor-pointer flex flex-col justify-between border border-[#E9E9E7] hover:border-rose-300 hover:shadow-[0_4px_20px_rgba(220,39,67,0.1)] w-full min-w-0"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <InstagramBadge size="md" className="group-hover:scale-105 transition-transform" />
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                  9:16 숏폼
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#191919] group-hover:text-rose-900 transition-colors">
                  인스타 릴스 · 쇼츠
                </h3>
                <p className="text-xs text-[#787774] mt-1 leading-relaxed break-keep font-normal">
                  상·하단 UI 가림 없는 플랫폼 안전영역(Safe Zone) 자동 가이드로 깔끔하게 제작합니다.
                </p>
              </div>
            </div>

            <div className="pt-3.5 mt-3 border-t border-[#EDEDEB] flex items-center justify-between text-xs font-semibold text-[#37352F] group-hover:text-rose-600">
              <span>숏폼 만들기</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#787774] group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* Action 4: Today's House 1:1 Feed */}
          <div 
            onClick={() => onCreateNewProject('home', { aspectRatio: '1:1' })}
            className="group relative rounded-2xl p-5 bg-white text-[#37352F] hover:bg-[#FDFDFD] transition-all cursor-pointer flex flex-col justify-between border border-[#E9E9E7] hover:border-sky-300 hover:shadow-[0_4px_20px_rgba(53,197,240,0.1)] w-full min-w-0"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <OHouseBadge size="md" className="group-hover:scale-105 transition-transform" />
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                  1:1 피드
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#191919] group-hover:text-sky-900 transition-colors">
                  오늘의집 & 피드
                </h3>
                <p className="text-xs text-[#787774] mt-1 leading-relaxed break-keep font-normal">
                  댓글과 스크랩을 유도하는 질문형 자막과 1:1 정방형 컷으로 깔끔하게 기록합니다.
                </p>
              </div>
            </div>

            <div className="pt-3.5 mt-3 border-t border-[#EDEDEB] flex items-center justify-between text-xs font-semibold text-[#37352F] group-hover:text-sky-600">
              <span>1:1 피드 만들기</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#787774] group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. SMART DRAG & DROP HUB: Notion Clean File Entry */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 border border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 w-full ${
          isDragOver
            ? 'border-[#23272A] bg-[#F1F1EF] shadow-sm'
            : 'border-[#D3D1CB] hover:border-[#37352F] bg-white hover:bg-[#FBFBFA]'
        }`}
      >
        <div className="w-11 h-11 rounded-xl bg-[#F1F1EF] text-[#37352F] flex items-center justify-center">
          <UploadCloud className="w-5 h-5 text-[#37352F]" />
        </div>

        <div>
          <h3 className="font-bold text-sm sm:text-base text-[#37352F] break-keep">
            내 사진 또는 동영상을 여기에 끌어다 놓으세요
          </h3>
          <p className="text-xs text-[#787774] mt-1 break-keep">
            또는 <strong className="text-[#37352F] underline cursor-pointer font-semibold">여기를 클릭하여 파일 선택</strong> (사진 및 영상 다중 선택 지원)
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-[#787774]">
          <span className="px-2 py-0.5 rounded bg-[#F1F1EF] border border-[#E3E2DE] text-[#37352F] font-medium text-[11px]">사진추가</span>
          <span>·</span>
          <span className="px-2 py-0.5 rounded bg-[#F1F1EF] border border-[#E3E2DE] text-[#37352F] font-medium text-[11px]">동영상추가</span>
          <span>·</span>
          <span className="text-[11px]">업로드 즉시 에디터로 자동 전환</span>
        </div>
      </div>

      {/* 4. WHY YULHA STUDIO? 5 Core Innovations Infographic (Notion Clean Cards) */}
      <div className="rounded-2xl bg-white text-[#37352F] p-6 sm:p-8 space-y-5 w-full border border-[#E9E9E7]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDEDEB] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#787774] uppercase">Key Innovations</span>
            <h2 className="text-base sm:text-lg font-bold text-[#37352F] mt-0.5">
              율하스튜디오 5대 핵심 기능
            </h2>
          </div>
          <p className="text-xs text-[#787774] max-w-md break-keep font-normal">
            전문 툴을 따로 배우지 않아도 누구나 직관적으로 고품질 콘텐츠를 제작할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
          <div className="bg-[#FBFBFA] rounded-xl p-3.5 border border-[#EDEDEB] space-y-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#F1F1EF] text-[#37352F] flex items-center justify-center">
              <Scissors className="w-4 h-4 text-[#37352F]" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-[#37352F]">1. 타임라인 컷분할 & 합치기</h4>
            <p className="text-xs text-[#787774] leading-relaxed break-keep font-normal">
              재생바에서 원하는 지점을 <strong>분할</strong> 및 <strong>합치기</strong> 클릭으로 손쉽게 편집하고 배속 조절.
            </p>
          </div>

          <div className="bg-[#FBFBFA] rounded-xl p-3.5 border border-[#EDEDEB] space-y-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#F1F1EF] text-[#37352F] flex items-center justify-center">
              <RotateCw className="w-4 h-4 text-[#37352F]" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-[#37352F]">2. 화면 직접 회전 자막</h4>
            <p className="text-xs text-[#787774] leading-relaxed break-keep font-normal">
              미리보기 화면의 자막을 터치하고 회전 핸들을 돌리는 직관적 제어 (드래그 시 박스 크기 불변).
            </p>
          </div>

          <div className="bg-[#FBFBFA] rounded-xl p-3.5 border border-[#EDEDEB] space-y-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#F1F1EF] text-[#37352F] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#37352F]" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-[#37352F]">3. 스튜디오 감성 필터</h4>
            <p className="text-xs text-[#787774] leading-relaxed break-keep font-normal">
              버터 웜, 코지 우드, 소프트 톤온톤 등 인스타그램에서 인기 있는 차분한 조명 톤.
            </p>
          </div>

          <div className="bg-[#FBFBFA] rounded-xl p-3.5 border border-[#EDEDEB] space-y-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#F1F1EF] text-[#37352F] flex items-center justify-center">
              <Heart className="w-4 h-4 text-[#37352F]" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-[#37352F]">4. 안심 마스크 스티커</h4>
            <p className="text-xs text-[#787774] leading-relaxed break-keep font-normal">
              얼굴 보호용 동물 마스크 스티커, D+100 성장 배지, 감성 데코 스티커로 안심 공유.
            </p>
          </div>

          <div className="bg-[#FBFBFA] rounded-xl p-3.5 border border-[#EDEDEB] space-y-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#F1F1EF] text-[#37352F] flex items-center justify-center">
              <Music className="w-4 h-4 text-[#37352F]" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-[#37352F]">5. 저작권 안심 36곡 BGM</h4>
            <p className="text-xs text-[#787774] leading-relaxed break-keep font-normal">
              카페, 키즈, 힐링, 여행 등 6대 테마 음원을 Web Audio 신디사이저로 즉시 실시간 미리듣기.
            </p>
          </div>
        </div>
      </div>

      {/* 5. READY-MADE TEMPLATES WITH CATEGORY TABS (Notion Style) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDEDEB] pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#37352F]">
              추천 템플릿
            </h2>
            <p className="text-xs text-[#787774] mt-0.5">
              원하는 테마를 고르면 규격, 자막 스타일, 추천 필터와 BGM이 자동 세팅됩니다.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1 bg-[#F1F1EF] p-1 rounded-xl border border-[#E3E2DE] text-xs overflow-x-auto pb-1">
            {[
              { id: 'all', label: '전체' },
              { id: 'home', label: '홈스타일링' },
              { id: 'daily', label: '일상·브이로그' },
              { id: 'kids', label: '키즈·패밀리' },
              { id: 'cafe_travel', label: '공간·감성' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as UniversalCategory)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-white text-[#37352F] shadow-xs font-semibold'
                    : 'text-[#787774] hover:text-[#37352F] font-medium'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl p-4 border border-[#E9E9E7] hover:border-[#D3D1CB] hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#F7F6F3]">
                  <img
                    src={template.previewImage}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                  />
                  <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#23272A]/90 backdrop-blur-xs text-[10px] font-medium text-white shadow-xs">
                    <span>{template.badge}</span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 inline-flex items-center px-1.5 py-0.5 rounded bg-white/90 text-[#37352F] text-[10px] font-semibold">
                    <span>{template.aspectRatio}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#37352F] group-hover:text-black transition-colors">
                    {template.title}
                  </h4>
                  <p className="text-xs text-[#787774] mt-1 line-clamp-2 leading-relaxed font-normal">
                    {template.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-3.5 mt-3 border-t border-[#EDEDEB] flex items-center justify-between">
                <span className="text-[11px] text-[#9B9A97] font-medium">
                  멀티 플랫폼 최적화
                </span>

                <button
                  type="button"
                  onClick={() => onSelectTemplate(template)}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-[#23272A] hover:bg-[#37352F] text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  <span>편집하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. SAMPLE SHOWCASE: 1-Click Load Full Projects */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-[#EDEDEB] pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#37352F]">
              샘플 프로젝트
            </h2>
            <p className="text-xs text-[#787774] mt-0.5">
              인스타그램 및 피드 규격으로 미리 구성된 완성작을 열어 내 사진과 영상으로 교체해보세요.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SAMPLE_HOME_KIDS_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-4 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#D3D1CB] transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#F1F1EF]">
                  <img
                    src={project.scenes[0]?.url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#23272A]/85 backdrop-blur-xs text-white text-[10px] font-medium">
                    <span>슬라이드 {project.scenes.length}개</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-[#37352F] line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#787774] mt-1 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#EDEDEB] flex items-center justify-between">
                <span className="text-[11px] text-[#9B9A97] font-mono">
                  {project.aspectRatio} 전용
                </span>

                <button
                  onClick={() => onLoadProject(project)}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] text-xs font-medium transition-colors cursor-pointer"
                >
                  <span>프로젝트 열기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
