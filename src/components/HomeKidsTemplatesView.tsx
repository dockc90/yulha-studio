import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Layers, 
  MessageCircle,
  Instagram,
  Youtube,
  Play
} from 'lucide-react';
import { QuickTemplate, UniversalCategory, HomeKidsProject } from '../types/homeAndKids';
import { QUICK_TEMPLATES, SAMPLE_HOME_KIDS_PROJECTS } from '../data/homeKidsTemplates';

interface TemplatesViewProps {
  activeCategory: UniversalCategory;
  setActiveCategory: (cat: UniversalCategory) => void;
  onSelectTemplate: (template: QuickTemplate) => void;
  onLoadProject: (project: HomeKidsProject) => void;
  onCreateNewProject: (category: UniversalCategory) => void;
}

export const HomeKidsTemplatesView: React.FC<TemplatesViewProps> = ({
  activeCategory,
  setActiveCategory,
  onSelectTemplate,
  onLoadProject,
  onCreateNewProject,
}) => {
  const filteredTemplates = QUICK_TEMPLATES.filter(
    (t) => activeCategory === 'all' || t.category === activeCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Hero Banner: Clean Soft Aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 via-white to-amber-50/50 p-8 sm:p-12 border border-rose-100/70 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 text-rose-600 text-xs font-bold border border-rose-100 shadow-xs leading-none">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="leading-none">만능 감성 미디어 크리에이터</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            당신의 모든 소중한 일상을 <br />
            <span className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 bg-clip-text text-transparent">
              감각적인 미디어 콘텐츠
            </span>
            로 완성하세요.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            사진과 동영상을 올리면 질문 유도 자막, 감성 톤 필터, 안심 스티커와 함께 
            인스타그램 릴스, 오늘의집, 유튜브 쇼츠에 딱 맞는 규격으로 원클릭 제작할 수 있습니다.
          </p>

          {/* Quick Action Button (버튼 글자 완벽 수직 정렬) */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onCreateNewProject(activeCategory)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md cursor-pointer leading-none"
            >
              <Plus className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="leading-none">새 미디어 만들기</span>
            </button>
            <span className="text-xs text-slate-500 font-medium">
              사진이나 동영상을 업로드해 바로 시작해보세요!
            </span>
          </div>
        </div>
      </div>

      {/* 3 Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 font-extrabold text-sm">
            집
          </div>
          <h3 className="font-bold text-sm text-slate-900">오늘의집 소통형 스토리</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            질문과 소통을 이끄는 본문 템플릿과 고화질 컷으로 오늘의집 집들이와 노하우에서 높은 스크랩과 댓글을 이끌어냅니다.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <Instagram className="w-5 h-5 shrink-0" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">인스타그램 릴스 & 캐러셀</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            댓글 알고리즘을 자극하는 감성 캡션과 9:16 릴스, 1:1/4:5 피드 규격으로 누구나 쉽게 감성 피드를 꾸밀 수 있습니다.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <Youtube className="w-5 h-5 shrink-0" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">유튜브 쇼츠 & 롱폼</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            3초 후킹 타이틀, 시청자 질문형 고정 댓글 템플릿으로 시청 지속 시간과 조회수를 높여줍니다.
          </p>
        </div>
      </div>

      {/* Showcase Projects */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              클릭 한 번으로 시작하는 샘플 프로젝트
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              샘플을 불러와 내 사진과 동영상으로 즉시 교체할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_HOME_KIDS_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-200 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={project.scenes[0]?.url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold leading-none">
                    <span className="leading-none">슬라이드 {project.scenes.length}개</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">
                  9:16 쇼츠 · 1:1 피드
                </span>

                <button
                  onClick={() => onLoadProject(project)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition-all leading-none cursor-pointer"
                >
                  <span className="leading-none">불러오기</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Templates Grid */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            테마별 감성 템플릿
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={template.previewImage}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-extrabold text-rose-600 shadow-2xs leading-none">
                    <span className="leading-none">{template.badge}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {template.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {template.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 inline-flex items-center justify-between text-xs font-bold text-rose-600 leading-none">
                <span className="leading-none">템플릿 적용</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
