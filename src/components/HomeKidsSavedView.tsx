import React from 'react';
import { 
  FolderHeart, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  Plus
} from 'lucide-react';
import { HomeKidsProject } from '../types/homeAndKids';

interface SavedViewProps {
  savedProjects: HomeKidsProject[];
  onSelectProject: (project: HomeKidsProject) => void;
  onDeleteProject: (projectId: string) => void;
  onCreateNew: () => void;
  onBack?: () => void;
  onClose?: () => void;
}

export const HomeKidsSavedView: React.FC<SavedViewProps> = ({
  savedProjects,
  onSelectProject,
  onDeleteProject,
  onCreateNew,
  onBack,
  onClose,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/95 backdrop-blur-md rounded-3xl p-6 border-2 border-pink-100 shadow-sm shadow-pink-500/5">
        <div className="flex items-center gap-3.5">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-700 transition-colors cursor-pointer mr-1 border border-pink-200/60"
              title="홈으로 돌아가기"
            >
              <span className="text-sm font-bold">←</span>
            </button>
          )}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-white shrink-0 shadow-md shadow-pink-500/25">
            <FolderHeart className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-snug">
              내 프로젝트 보관함 ({savedProjects.length}개) 💖
            </h2>
            <p className="text-xs text-pink-500/90 font-bold mt-0.5">
              작업 중이던 모든 미디어 프로젝트가 안전하게 보관되어 있습니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCreateNew}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white font-black text-xs transition-all shadow-md shadow-pink-500/25 leading-none cursor-pointer hover:scale-102"
          >
            <Plus className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="leading-none">새 프로젝트</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center p-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 hover:text-pink-600 text-slate-500 transition-colors cursor-pointer"
              title="창 닫기 (홈으로 이동)"
            >
              <span className="text-sm font-bold leading-none">✕</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {savedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl p-5 border-2 border-pink-100/90 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:border-pink-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-pink-50/50">
                  <img
                    src={project.scenes[0]?.url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                  />
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black leading-none shadow-xs">
                    {project.scenes.length}개 슬라이드
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-sm text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-pink-400 font-semibold mt-1">
                    <Calendar className="w-3 h-3 shrink-0 text-pink-500" />
                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3.5 mt-3 border-t border-pink-50 flex items-center justify-between">
                <button
                  onClick={() => onDeleteProject(project.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4 shrink-0" />
                </button>

                <button
                  onClick={() => onSelectProject(project)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-50 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 text-pink-600 hover:text-white text-xs font-black transition-all leading-none cursor-pointer shadow-2xs hover:scale-102"
                >
                  <span className="leading-none">이어서 편집</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/80 rounded-3xl border-2 border-dashed border-pink-200 space-y-3 shadow-xs">
          <h3 className="font-black text-slate-800 text-base leading-none">보관함이 비어있습니다 💌</h3>
          <p className="text-xs text-pink-500 font-semibold">
            템플릿을 선택하거나 새로운 사진을 업로드해 프로젝트를 시작해보세요.
          </p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white text-xs font-black hover:from-pink-600 hover:to-amber-500 transition-all shadow-md shadow-pink-500/25 leading-none hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="leading-none">새 프로젝트 만들기 ✨</span>
          </button>
        </div>
      )}
    </div>
  );
};
