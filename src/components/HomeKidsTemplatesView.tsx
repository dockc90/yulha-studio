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

      {/* 1. HERO & PURPOSE: Canva/CapCut Style Interactive Start */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 via-white to-amber-50/60 p-5 sm:p-8 md:p-10 border border-rose-100/80 shadow-[0_10px_35px_-5px_rgba(244,63,94,0.06)] w-full">
        <div className="max-w-3xl space-y-3.5 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/95 text-rose-600 text-[11px] sm:text-xs font-bold border border-rose-100 shadow-xs leading-none">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0 animate-pulse" />
            <span className="leading-none">All-in-One 감성 크리에이터 스튜디오</span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-snug sm:leading-tight break-keep">
            오늘 어떤 소중한 순간을 <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-500 via-purple-600 to-amber-500 bg-clip-text text-transparent">
              감각적인 미디어 콘텐츠
            </span>
            로 완성할까요?
          </h1>

          <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal break-keep">
            사진 보정, 타임라인 정밀 컷분할 & 병합, 화면 직접 회전 자막, 인기 버터 필터, 저작권 안심 36곡 BGM까지!
            <br className="hidden md:inline" />{' '}
            복잡한 툴 없이 <strong>인스타그램 릴스 · 오늘의집 스토리 · 유튜브 쇼츠</strong>를 3분 만에 완성하세요.
          </p>

          {/* Platform Quick Dimension Buttons */}
          <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs font-black text-slate-500 mr-0.5 sm:mr-1">📐 올릴 플랫폼:</span>
            <button
              onClick={() => onCreateNewProject('all', { aspectRatio: '9:16' })}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-600 text-[11px] sm:text-xs font-bold border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>9:16 릴스·쇼츠</span>
            </button>

            <button
              onClick={() => onCreateNewProject('home', { aspectRatio: '1:1' })}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-slate-800 hover:text-sky-600 text-[11px] sm:text-xs font-bold border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>1:1 오늘의집·피드</span>
            </button>

            <button
              onClick={() => onCreateNewProject('daily', { aspectRatio: '4:5' })}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-600 text-[11px] sm:text-xs font-bold border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>4:5 세로 피드</span>
            </button>

            <button
              onClick={() => onCreateNewProject('cafe_travel', { aspectRatio: '16:9' })}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-slate-800 hover:text-indigo-600 text-[11px] sm:text-xs font-bold border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
            >
              <Film className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>16:9 와이드 영상</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 SUPERPOWER CARDS: Canva/CapCut Direct Action Hub */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span>⚡ 원하는 작업을 바로 시작하세요</span>
            <span className="text-xs text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-full">원클릭 시작</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
          {/* Action 1: Dedicated Video Cut Editor */}
          <div 
            onClick={() => {
              if (onOpenCapCutDirectly) onOpenCapCutDirectly();
              else onCreateNewProject('all', { openCapCut: true, aspectRatio: '9:16' });
            }}
            className="group relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-md hover:shadow-xl hover:scale-[1.01] sm:hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between border border-indigo-700/40 w-full min-w-0"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-indigo-600/80 flex items-center justify-center text-white shadow-inner">
                  <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  ✂️ 프로 에디터
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-white group-hover:text-indigo-200 transition-colors">
                  동영상 컷분할 & 합치기
                </h3>
                <p className="text-xs text-indigo-200/80 mt-1 leading-relaxed break-keep">
                  재생바에서 즉시 <strong>✂️ 분할</strong> 및 <strong>🔗 합치기</strong>, 0.5x~4.0x 배속, 화면 회전, 페이드 전환 효과까지 한 번에!
                </p>
              </div>
            </div>

            <div className="pt-3.5 sm:pt-4 mt-3 border-t border-indigo-800/60 flex items-center justify-between text-xs font-bold text-indigo-300 group-hover:text-white">
              <span>동영상 편집기 열기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 2: Photo Polish & Stickers */}
          <div 
            onClick={() => onCreateNewProject('home', { aspectRatio: '1:1' })}
            className="group relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-rose-500 via-rose-600 to-amber-500 text-white shadow-md hover:shadow-xl hover:scale-[1.01] sm:hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between border border-rose-400/40 w-full min-w-0"
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
                <h3 className="font-extrabold text-base text-white">
                  사진 보정 & 스티커
                </h3>
                <p className="text-xs text-rose-100 mt-1 leading-relaxed break-keep">
                  버터·코지 감성 필터, 귀여운 아기 동물 마스크 스티커, <strong>화면 직접 회전 자막</strong> 적용.
                </p>
              </div>
            </div>

            <div className="pt-3.5 sm:pt-4 mt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
              <span>사진 편집 시작하기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 3: 9:16 Vertical Shorts/Reels */}
          <div 
            onClick={() => onCreateNewProject('daily', { aspectRatio: '9:16' })}
            className="group relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-white text-slate-900 shadow-sm hover:shadow-lg hover:border-rose-300 hover:scale-[1.01] sm:hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between border border-slate-200 w-full min-w-0"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100">
                  🔥 9:16 세로 숏폼
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-rose-600 transition-colors">
                  인스타 릴스 · 쇼츠
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed break-keep">
                  상·하단 UI 가림 없는 <strong>플랫폼 안전영역(Safe Zone)</strong> 자동 가이드로 깔끔하게 제작.
                </p>
              </div>
            </div>

            <div className="pt-3.5 sm:pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
              <span>9:16 숏폼 만들기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 4: Today's House 1:1 Feed */}
          <div 
            onClick={() => onCreateNewProject('home', { aspectRatio: '1:1' })}
            className="group relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-white text-slate-900 shadow-sm hover:shadow-lg hover:border-sky-300 hover:scale-[1.01] sm:hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between border border-slate-200 w-full min-w-0"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 font-black text-sm">
                  오늘
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-sky-50 text-sky-600 border border-sky-100">
                  💬 질문 소통형
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-sky-600 transition-colors">
                  오늘의집 & 인스타 피드
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed break-keep">
                  댓글과 스크랩을 유도하는 질문형 자막과 1:1 정방형 고화질 컷으로 감성 공간 기록.
                </p>
              </div>
            </div>

            <div className="pt-3.5 sm:pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
              <span>1:1 피드 만들기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. SMART DRAG & DROP HUB: Canva/Figma Direct File Entry */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative overflow-hidden rounded-3xl p-5 sm:p-8 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 w-full ${
          isDragOver
            ? 'border-rose-500 bg-rose-50/70 scale-[1.01] shadow-lg ring-4 ring-rose-200/50'
            : 'border-slate-300 hover:border-rose-400 bg-slate-50/60 hover:bg-white shadow-xs'
        }`}
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
          <UploadCloud className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        <div>
          <h3 className="font-extrabold text-sm sm:text-lg text-slate-900 break-keep">
            내 사진 또는 동영상을 여기에 끌어다 놓으세요
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 break-keep">
            또는 <strong className="text-rose-600 underline cursor-pointer">여기를 클릭하여 파일 선택</strong> (사진 및 영상 다중 선택 지원)
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-bold text-slate-400">
          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">📸 사진</span>
          <span>+</span>
          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">🎬 비디오</span>
          <span className="break-keep">업로드 즉시 전용 에디터로 자동 전환</span>
        </div>
      </div>

      {/* 4. WHY YULHA STUDIO? 5 Core Innovations Infographic */}
      <div className="rounded-3xl bg-slate-900 text-white p-5 sm:p-8 space-y-5 sm:space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-black text-rose-400 tracking-wider uppercase">Key Innovations</span>
            <h2 className="text-base sm:text-xl font-black text-white mt-0.5">
              율하스튜디오만의 5대 핵심 기능
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md break-keep">
            전문 영상 편집 프로그램을 배우지 않아도, 누구나 최고 수준의 콘텐츠를 쉽게 만들 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
          <div className="bg-slate-800/80 rounded-2xl p-3.5 sm:p-4 border border-slate-700/60 space-y-2 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Scissors className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="font-black text-sm text-white">1. 타임라인 컷분할 & 합치기</h4>
            <p className="text-xs text-slate-400 leading-relaxed break-keep">
              재생 헤드를 원하는 지점에 두고 <strong>✂️ 분할</strong> 및 <strong>🔗 합치기</strong> 클릭 한 번으로 손쉽게 클립을 편집하고 배속 조절.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-3.5 sm:p-4 border border-slate-700/60 space-y-2 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="font-black text-sm text-white">2. 화면 직접 회전 자막</h4>
            <p className="text-xs text-slate-400 leading-relaxed break-keep">
              미리보기 화면의 자막을 터치하고 바로 회전 핸들을 돌리는 직관적 제어 (드래그 시 박스 크기 불변).
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-3.5 sm:p-4 border border-slate-700/60 space-y-2 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="font-black text-sm text-white">3. 인스타 인기 버터 필터</h4>
            <p className="text-xs text-slate-400 leading-relaxed break-keep">
              버터 웜, 코지 우드, 소프트 파스텔 등 인스타그램에서 가장 인기 있는 스튜디오 조명 톤온톤 무드.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-3.5 sm:p-4 border border-slate-700/60 space-y-2 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="font-black text-sm text-white">4. 귀여운 안심 스티커</h4>
            <p className="text-xs text-slate-400 leading-relaxed break-keep">
              얼굴 보호용 동물 마스크 스티커, D+100 성장 배지, 감성 데코 스티커로 아이 사진도 안심 공유.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-3.5 sm:p-4 border border-slate-700/60 space-y-2 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Music className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="font-black text-sm text-white">5. 저작권 안심 36곡 BGM</h4>
            <p className="text-xs text-slate-400 leading-relaxed break-keep">
              카페, 키즈, 힐링, 여행 등 6대 테마 음원을 Web Audio 신디사이저로 즉시 실시간 미리듣기.
            </p>
          </div>
        </div>
      </div>

      {/* 5. READY-MADE TEMPLATES WITH CATEGORY TABS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              인기 감성 템플릿 (30초 만에 글자·사진만 바꿔 완성)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
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
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
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
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-rose-400 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={template.previewImage}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-black text-rose-600 shadow-xs">
                    <span>{template.badge}</span>
                  </div>

                  <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold">
                    <span>{template.aspectRatio}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-base text-slate-900 group-hover:text-rose-600 transition-colors">
                    {template.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {template.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                  <Instagram className="w-3.5 h-3.5 text-rose-400" />
                  <Youtube className="w-3.5 h-3.5 text-red-400" />
                  <span>멀티 최적화</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTemplate(template)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 group-hover:bg-rose-500 text-rose-600 group-hover:text-white font-extrabold text-xs transition-all cursor-pointer shadow-2xs"
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
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={project.scenes[0]?.url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold">
                    <span>슬라이드 {project.scenes.length}개</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">
                  {project.aspectRatio} 전용 규격
                </span>

                <button
                  onClick={() => onLoadProject(project)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all cursor-pointer"
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
