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
      <div className="flex items-center justify-between bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3.5">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer mr-1"
              title="홈으로 돌아가기"
            >
              <span className="text-sm font-bold">←</span>
            </button>
          )}
          <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
            <FolderHeart className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              내 프로젝트 보관함 ({savedProjects.length}개)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              작업 중이던 모든 미디어 프로젝트가 안전하게 보관되어 있습니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCreateNew}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm leading-none cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="leading-none">새 프로젝트</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors cursor-pointer"
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
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-200 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={project.scenes[0]?.url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                  />
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold leading-none">
                    {project.scenes.length}개 슬라이드
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onDeleteProject(project.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4 shrink-0" />
                </button>

                <button
                  onClick={() => onSelectProject(project)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition-all leading-none cursor-pointer"
                >
                  <span className="leading-none">이어서 편집</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
          <h3 className="font-bold text-slate-800 text-base leading-none">보관함이 비어있습니다</h3>
          <p className="text-xs text-slate-400">
            템플릿을 선택하거나 새로운 사진을 업로드해 프로젝트를 시작해보세요.
          </p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-sm leading-none"
          >
            <Plus className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="leading-none">새 프로젝트 만들기</span>
          </button>
        </div>
      )}
    </div>
  );
};
