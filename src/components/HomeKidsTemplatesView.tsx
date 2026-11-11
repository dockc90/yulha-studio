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

      {/* 1. HERO & PURPOSE: Vivid & Cute Interactive Start */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-100/90 via-[#FFF9FB] to-amber-100/80 p-5 sm:p-8 md:p-10 border-2 border-pink-200/80 shadow-[0_12px_40px_rgba(255,100,160,0.12)] w-full">
        {/* Decorative Background Bubbles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl space-y-3.5 sm:space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-white/95 text-pink-600 text-[11px] sm:text-xs font-black border border-pink-200 shadow-sm leading-none">
            <Sparkles className="w-4 h-4 text-pink-500 shrink-0 animate-bounce" />
            <span className="leading-none">All-in-One 감성 크리에이터 스튜디오 🎀</span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug sm:leading-tight break-keep">
            오늘 어떤 소중한 순간을 <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 bg-clip-text text-transparent">
              생생하고 귀여운 콘텐츠
            </span>
            로 완성할까요? ✨
          </h1>

          <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-medium break-keep">
            사진 보정, 타임라인 정밀 컷분할 & 병합, 화면 직접 회전 자막, 인기 버터 필터, 저작권 안심 36곡 BGM까지!
            <br className="hidden md:inline" />{' '}
            복잡한 툴 없이 <strong>인스타그램 릴스 · 오늘의집 스토리 · 유튜브 쇼츠</strong>를 3분 만에 완성하세요.
          </p>

          {/* Platform Quick Dimension Buttons */}
          <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs font-black text-pink-600 mr-0.5 sm:mr-1">📐 올릴 플랫폼:</span>
            <button
              onClick={() => onCreateNewProject('all', { aspectRatio: '9:16' })}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-[11px] sm:text-xs font-black border border-pink-200 shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>9:16 릴스·쇼츠</span>
            </button>

            <button
              onClick={() => onCreateNewProject('home', { aspectRatio: '1:1' })}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] sm:text-xs font-black border border-sky-200 shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Square className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>1:1 오늘의집·피드</span>
            </button>

            <button
              onClick={() => onCreateNewProject('daily', { aspectRatio: '4:5' })}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] sm:text-xs font-black border border-amber-200 shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>4:5 세로 피드</span>
            </button>

            <button
              onClick={() => onCreateNewProject('cafe_travel', { aspectRatio: '16:9' })}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] sm:text-xs font-black border border-purple-200 shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Film className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>16:9 와이드 영상</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 SUPERPOWER CARDS: Canva/CapCut Direct Action Hub (Vivid Pop Candy Theme) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <span>⚡ 원하는 작업을 바로 시작하세요</span>
            <span className="text-xs text-pink-600 font-black bg-pink-100 px-2.5 py-0.5 rounded-full border border-pink-200">원클릭 시작 🚀</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
          {/* Action 1: Dedicated Video Cut Editor - Electric Violet */}
          <div 
            onClick={() => {
              if (onOpenCapCutDirectly) onOpenCapCutDirectly();
              else onCreateNewProject('all', { openCapCut: true, aspectRatio: '9:16' });
            }}
            className="group relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/35 hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between border-2 border-purple-400/40 w-full min-w-0"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
                  <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white/20 text-purple-100 border border-white/30">
                  ✂️ 프로 에디터
                </span>
              </div>

              <div>
                <h3 className="font-black text-base text-white group-hover:text-amber-200 transition-colors">
                  동영상 컷분할 & 합치기
                </h3>
                <p className="text-xs text-purple-100/90 mt-1 leading-relaxed break-keep font-medium">
                  재생바에서 즉시 <strong>✂️ 분할</strong> 및 <strong>🔗 합치기</strong>, 0.5x~4.0x 배속, 화면 회전, 페이드 전환 효과까지 한 번에!
                </p>
              </div>
            </div>

            <div className="pt-3.5 sm:pt-4 mt-3 border-t border-white/20 flex items-center justify-between text-xs font-black text-purple-200 group-hover:text-white">
              <span>동영상 편집기 열기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 2: Photo Polish & Stickers - Vivid Pink & Orange */}
          <div 
            onClick={() => onCreateNewProject('home', { aspectRatio: '1:1' })}
            className="group relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-pink-500 via-rose-500 to-amber-400 text-white shadow-lg shadow-pink-500/25 hover:shadow-2xl hover:shadow-pink-500/40 hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between border-2 border-pink-300/50 w-full min-w-0"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
                  <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white/20 text-white border border-white/30">
                  🎨 감성 버터 필터
                </span>
              </div>

              <div>
                <h3 className="font-black text-base text-white">
                  사진 보정 & 스티커
                </h3>
                <p className="text-xs text-rose-100 mt-1 leading-relaxed break-keep font-medium">
                  버터·코지 감성 필터, 귀여운 아기 동물 마스크 스티커, <strong>화면 직접 회전 자막</strong> 적용.
                </p>
              </div>
            </div>

            <div className="pt-3.5 sm:pt-4 mt-3 border-t border-white/25 flex items-center justify-between text-xs font-black text-white">
              <span>사진 편집 시작하기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 3: 9:16 Vertical Shorts/Reels - Vivid Fuchsia */}
          <div 
            onClick={() => onCreateNewProject('daily', { aspectRatio: '9:16' })}
            className="group relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 text-white shadow-lg shadow-rose-500/20 hover:shadow-2xl hover:shadow-rose-500/35 hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between border-2 border-rose-300/40 w-full min-w-0"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white/20 text-white border border-white/30">
                  🔥 9:16 세로 숏폼
                </span>
              </div>

              <div>
                <h3 className="font-black text-base text-white">
                  인스타 릴스 · 쇼츠
                </h3>
                <p className="text-xs text-rose-100 mt-1 leading-relaxed break-keep font-medium">
                  상·하단 UI 가림 없는 <strong>플랫폼 안전영역(Safe Zone)</strong> 자동 가이드로 깔끔하게 제작.
                </p>
              </div>
            </div>

            <div className="pt-3.5 sm:pt-4 mt-3 border-t border-white/20 flex items-center justify-between text-xs font-black text-white">
              <span>9:16 숏폼 만들기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 4: Today's House 1:1 Feed - Vivid Sky & Cyan */}
          <div 
            onClick={() => onCreateNewProject('home', { aspectRatio: '1:1' })}
            className="group relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20 hover:shadow-2xl hover:shadow-sky-500/35 hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between border-2 border-sky-300/40 w-full min-w-0"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white font-black text-sm shadow-inner">
                  오늘
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white/20 text-white border border-white/30">
                  💬 질문 소통형
                </span>
              </div>

              <div>
                <h3 className="font-black text-base text-white">
                  오늘의집 & 인스타 피드
                </h3>
                <p className="text-xs text-sky-100 mt-1 leading-relaxed break-keep font-medium">
                  댓글과 스크랩을 유도하는 질문형 자막과 1:1 정방형 고화질 컷으로 감성 공간 기록.
                </p>
              </div>
            </div>

            <div className="pt-3.5 sm:pt-4 mt-3 border-t border-white/20 flex items-center justify-between text-xs font-black text-white">
              <span>1:1 피드 만들기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. SMART DRAG & DROP HUB: Vivid Candy Pop Upload Entry */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative overflow-hidden rounded-3xl p-5 sm:p-8 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 w-full ${
          isDragOver
            ? 'border-pink-500 bg-pink-100/70 scale-[1.02] shadow-xl ring-4 ring-pink-300/50'
            : 'border-pink-300 hover:border-pink-500 bg-gradient-to-b from-pink-50/70 via-white to-pink-50/40 hover:bg-pink-50/80 shadow-sm hover:shadow-lg hover:shadow-pink-500/10'
        }`}
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-pink-500/30 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
        </div>

        <div>
          <h3 className="font-black text-sm sm:text-lg text-slate-900 break-keep">
            내 사진 또는 동영상을 여기에 끌어다 놓으세요 💌
          </h3>
          <p className="text-xs sm:text-sm text-pink-600 mt-1 break-keep font-bold">
            또는 <strong className="text-pink-600 underline cursor-pointer hover:text-pink-700">여기를 클릭하여 파일 선택</strong> (사진 및 영상 다중 선택 지원)
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-black text-slate-500">
          <span className="px-2.5 py-0.5 rounded-lg bg-white border border-pink-200 text-pink-600 shadow-2xs">📸 사진추가</span>
          <span className="text-pink-400">+</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-white border border-purple-200 text-purple-600 shadow-2xs">🎬 동영상추가</span>
          <span className="break-keep text-slate-500">업로드 즉시 전용 에디터로 자동 전환</span>
        </div>
      </div>

      {/* 4. WHY YULHA STUDIO? 5 Core Innovations Infographic (Vivid Neon Pop) */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-5 sm:p-8 space-y-5 sm:space-y-6 w-full border-2 border-purple-500/30 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 border-b border-purple-800/60 pb-4">
          <div>
            <span className="text-xs font-black text-pink-400 tracking-wider uppercase flex items-center gap-1">
              <span>✨ Key Innovations</span>
            </span>
            <h2 className="text-base sm:text-xl font-black text-white mt-0.5">
              율하스튜디오만의 5대 핵심 기능 🌈
            </h2>
          </div>
          <p className="text-xs text-purple-200/80 max-w-md break-keep font-medium">
            전문 영상 편집 프로그램을 배우지 않아도, 누구나 최고 수준의 콘텐츠를 쉽게 만들 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
          <div className="bg-purple-900/40 rounded-2xl p-3.5 sm:p-4 border border-purple-600/40 space-y-2 min-w-0 hover:border-purple-400 transition-colors">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-violet-500/30 text-violet-300 flex items-center justify-center font-black">
              <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-violet-300" />
            </div>
            <h4 className="font-black text-sm text-white">1. 타임라인 컷분할 & 합치기</h4>
            <p className="text-xs text-purple-200/80 leading-relaxed break-keep">
              재생 헤드를 원하는 지점에 두고 <strong>✂️ 분할</strong> 및 <strong>🔗 합치기</strong> 클릭 한 번으로 손쉽게 클립을 편집하고 배속 조절.
            </p>
          </div>

          <div className="bg-purple-900/40 rounded-2xl p-3.5 sm:p-4 border border-purple-600/40 space-y-2 min-w-0 hover:border-pink-400 transition-colors">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-500/30 text-pink-300 flex items-center justify-center font-black">
              <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 text-pink-300" />
            </div>
            <h4 className="font-black text-sm text-white">2. 화면 직접 회전 자막</h4>
            <p className="text-xs text-purple-200/80 leading-relaxed break-keep">
              미리보기 화면의 자막을 터치하고 바로 회전 핸들을 돌리는 직관적 제어 (드래그 시 박스 크기 불변).
            </p>
          </div>

          <div className="bg-purple-900/40 rounded-2xl p-3.5 sm:p-4 border border-purple-600/40 space-y-2 min-w-0 hover:border-amber-400 transition-colors">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/30 text-amber-300 flex items-center justify-center font-black">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <h4 className="font-black text-sm text-white">3. 인스타 인기 버터 필터</h4>
            <p className="text-xs text-purple-200/80 leading-relaxed break-keep">
              버터 웜, 코지 우드, 소프트 파스텔 등 인스타그램에서 가장 인기 있는 스튜디오 조명 톤온톤 무드.
            </p>
          </div>

          <div className="bg-purple-900/40 rounded-2xl p-3.5 sm:p-4 border border-purple-600/40 space-y-2 min-w-0 hover:border-pink-400 transition-colors">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-500/30 text-pink-300 flex items-center justify-center font-black">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-300" />
            </div>
            <h4 className="font-black text-sm text-white">4. 귀여운 안심 스티커</h4>
            <p className="text-xs text-purple-200/80 leading-relaxed break-keep">
              얼굴 보호용 동물 마스크 스티커, D+100 성장 배지, 감성 데코 스티커로 아이 사진도 안심 공유.
            </p>
          </div>

          <div className="bg-purple-900/40 rounded-2xl p-3.5 sm:p-4 border border-purple-600/40 space-y-2 min-w-0 hover:border-emerald-400 transition-colors">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-black">
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
            </div>
            <h4 className="font-black text-sm text-white">5. 저작권 안심 36곡 BGM</h4>
            <p className="text-xs text-purple-200/80 leading-relaxed break-keep">
              카페, 키즈, 힐링, 여행 등 6대 테마 음원을 Web Audio 신디사이저로 즉시 실시간 미리듣기.
            </p>
          </div>
        </div>
      </div>

      {/* 5. READY-MADE TEMPLATES WITH CATEGORY TABS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              인기 감성 템플릿 (30초 만에 글자·사진만 바꿔 완성) 🧸
            </h2>
            <p className="text-xs text-pink-600 mt-0.5 font-bold">
              원하는 테마를 고르면 규격, 자막 스타일, 추천 필터와 BGM이 자동 세팅됩니다.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: '⭐ 전체' },
              { id: 'home', label: '🏡 홈스타일링' },
              { id: 'daily', label: '☕ 일상·브이로그' },
              { id: 'kids', label: '👶 키즈·패밀리' },
              { id: 'cafe_travel', label: '🌿 공간·감성' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as UniversalCategory)}
                className={`px-3.5 py-1.5 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white shadow-sm shadow-pink-500/25 scale-102'
                    : 'bg-white hover:bg-pink-50 text-slate-700 border border-pink-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-3xl p-5 border-2 border-pink-100/80 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:border-pink-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-pink-50/50">
                  <img
                    src={template.previewImage}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-[11px] font-black text-white shadow-md">
                    <span>{template.badge}</span>
                  </div>

                  <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-black">
                    <span>{template.aspectRatio}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-base text-slate-900 group-hover:text-pink-600 transition-colors">
                    {template.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                    {template.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-pink-50 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-pink-400 font-black">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" />
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>멀티 최적화</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTemplate(template)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs transition-all cursor-pointer shadow-sm shadow-pink-500/25 hover:scale-102"
                >
                  <span>이 템플릿으로 편집</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. SAMPLE SHOWCASE: 1-Click Load Full Projects */}
      <div className="space-y-5 pt-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              클릭 한 번으로 불러오는 완성작 샘플 프로젝트
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              실제 인스타그램/오늘의집 인기 피드 규격으로 미리 구성된 완성작을 열어 내 사진과 영상으로 교체해보세요.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_HOME_KIDS_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl p-5 border-2 border-pink-100/90 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:border-pink-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-pink-50/50">
                  <img
                    src={project.scenes[0]?.url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-black shadow-xs">
                    <span>슬라이드 {project.scenes.length}개</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-sm text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-pink-50 flex items-center justify-between">
                <span className="text-[11px] font-black text-pink-400">
                  {project.aspectRatio} 전용 규격
                </span>

                <button
                  onClick={() => onLoadProject(project)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-50 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:text-white text-pink-600 text-xs font-black transition-all cursor-pointer shadow-2xs hover:scale-102"
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
