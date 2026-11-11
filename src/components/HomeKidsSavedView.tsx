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
      <div className="flex items-center justify-between bg-white rounded-2xl p-5 sm:p-6 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center p-2 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] transition-colors cursor-pointer border border-[#E3E2DE]"
              title="홈으로 돌아가기"
            >
              <span className="text-sm font-semibold">←</span>
            </button>
          )}
          <div className="w-10 h-10 rounded-lg bg-[#23272A] flex items-center justify-center text-white shrink-0">
            <FolderHeart className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#37352F] leading-snug">
              내 프로젝트 보관함 ({savedProjects.length}개)
            </h2>
            <p className="text-xs text-[#787774] mt-0.5">
              작업 중이던 모든 미디어 프로젝트가 안전하게 보관되어 있습니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCreateNew}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#23272A] hover:bg-[#37352F] text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="leading-none">새 프로젝트</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center p-2 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#787774] transition-colors cursor-pointer border border-[#E3E2DE]"
              title="창 닫기 (홈으로 이동)"
            >
              <span className="text-sm font-semibold leading-none">✕</span>
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
              className="bg-white rounded-2xl p-4 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#D3D1CB] transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#F7F6F3] border border-[#EDEDEB] flex items-center justify-center">
                  {project.scenes[0]?.url ? (
                    <img
                      src={project.scenes[0]?.url}
                      alt={project.title}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#9B9A97] gap-1 select-none">
                      <FolderHeart className="w-6 h-6 text-[#9B9A97]" />
                      <span className="text-[11px] font-medium">미디어 없음</span>
                    </div>
                  )}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#23272A]/85 backdrop-blur-xs text-white text-[10px] font-medium leading-none">
                    {project.scenes.length}개 컷
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-[#37352F] group-hover:text-[#23272A] transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#787774] mt-1 font-medium">
                    <Calendar className="w-3 h-3 shrink-0 text-[#9B9A97]" />
                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#EDEDEB] flex items-center justify-between">
                <button
                  onClick={() => onDeleteProject(project.id)}
                  className="p-1.5 text-[#9B9A97] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4 shrink-0" />
                </button>

                <button
                  onClick={() => onSelectProject(project)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#23272A] hover:bg-[#37352F] text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  <span className="leading-none">이어서 편집</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#D3D1CB] space-y-3">
          <h3 className="font-semibold text-[#37352F] text-base leading-none">보관함이 비어있습니다</h3>
          <p className="text-xs text-[#787774]">
            템플릿을 선택하거나 새로운 사진을 업로드해 프로젝트를 시작해보세요.
          </p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#23272A] hover:bg-[#37352F] text-white text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="leading-none">새 프로젝트 만들기</span>
          </button>
        </div>
      )}
    </div>
  );
};
