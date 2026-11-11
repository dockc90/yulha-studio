/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HomeKidsHeader, StudioTab } from './components/HomeKidsHeader';
import { HomeKidsTemplatesView } from './components/HomeKidsTemplatesView';
import { HomeKidsStudio } from './components/HomeKidsStudio';
import { PlatformPublishHub } from './components/PlatformPublishHub';
import { HomeKidsSavedView } from './components/HomeKidsSavedView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UniversalCategory, HomeKidsProject, QuickTemplate } from './types/homeAndKids';
import { SAMPLE_HOME_KIDS_PROJECTS } from './data/homeKidsTemplates';
import { Sparkles } from 'lucide-react';

const YULHA_STORAGE_KEY = 'yulha_studio_saved_projects_v3';

export default function App() {
  const [currentTab, setCurrentTab] = useState<StudioTab>('templates');
  const [activeCategory, setActiveCategory] = useState<UniversalCategory>('all');
  const [currentProject, setCurrentProject] = useState<HomeKidsProject>(SAMPLE_HOME_KIDS_PROJECTS[0]);
  const [savedProjects, setSavedProjects] = useState<HomeKidsProject[]>(() => {
    try {
      const stored = localStorage.getItem(YULHA_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse saved projects', e);
    }
    return SAMPLE_HOME_KIDS_PROJECTS;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to local storage
  const handleSaveCurrentProject = () => {
    setSavedProjects((prev) => {
      const existingIdx = prev.findIndex((p) => p.id === currentProject.id);
      let updated: HomeKidsProject[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = { ...currentProject, updatedAt: new Date().toISOString() };
      } else {
        updated = [{ ...currentProject, updatedAt: new Date().toISOString() }, ...prev];
      }
      try {
        localStorage.setItem(YULHA_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Storage quota exceeded', err);
      }
      return updated;
    });
    showToast('보관함에 저장되었습니다 ✨');
  };

  const handleDeleteSavedProject = (projectId: string) => {
    setSavedProjects((prev) => {
      const updated = prev.filter((p) => p.id !== projectId);
      try {
        localStorage.setItem(YULHA_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('프로젝트가 삭제되었습니다.');
  };

  // Select Quick Template
  const handleSelectTemplate = (template: QuickTemplate) => {
    const newProj: HomeKidsProject = {
      id: `proj-${Date.now()}`,
      title: template.title,
      description: template.subtitle,
      category: template.category,
      targetPlatforms: ['all', 'ohouse', 'instagram', 'youtube'],
      aspectRatio: template.aspectRatio,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scenes: [
        {
          id: `scene-${Date.now()}-1`,
          mediaType: 'image',
          url: template.previewImage,
          title: template.sampleScenes[0]?.title || '새로운 일상의 순간',
          subtitle: template.sampleScenes[0]?.subtitle || '마음이 머무는 따뜻한 기록',
          callToAction: template.sampleScenes[0]?.callToAction || '궁금하신 정보는 댓글 남겨주시면 알려드릴게요 🤍',
          durationSec: 4,
          kidsStickers: [],
          filter: template.sampleScenes[0]?.filter || 'butter_warm'
        }
      ],
      snsMetadata: {
        youtube: template.defaultMetadata?.youtube || {
          title: `${template.title} | 감성 쇼츠`,
          description: '영상 속 궁금하신 정보는 언제든 댓글로 질문 남겨주세요!',
          commentQuestionPrompt: '📌 여러분의 소중한 일상 이야기를 댓글로 나눠요!',
          hashtags: ['일상기록', '브이로그', '감성쇼츠']
        },
        instagram: template.defaultMetadata?.instagram || {
          caption: `포근하고 따뜻한 일상의 기록 ✨\n\n궁금하신 점은 편하게 댓글 남겨주세요 🤍`,
          commentTriggerHook: '💬 궁금하신 점은 댓글로 남겨주시면 바로 알려드려요!',
          hashtags: ['#일상스타그램', '#감성기록', '#릴스', '#인스타감성']
        },
        ohouse: template.defaultMetadata?.ohouse || {
          title: `${template.title} 공간 이야기`,
          spaceType: '거실',
          stylingTip: '톤온톤 컬러 매치로 편안한 분위기를 연출했습니다.',
          commentNotice: '제품 정보나 일상 질문 댓글 환영합니다 :)',
          hashtags: ['#온라인집들이', '#오늘의집', '#공간기록']
        }
      }
    };

    setCurrentProject(newProj);
    setCurrentTab('studio');
    showToast(`'${template.title}' 템플릿이 적용되었습니다.`);
  };

  // Create empty new project
  const handleCreateNewProject = (category: UniversalCategory) => {
    const newProj: HomeKidsProject = {
      id: `proj-${Date.now()}`,
      title: '나만의 새로운 감성 미디어',
      description: '소중한 순간을 담은 사진과 영상 기록',
      category: category === 'all' ? 'home' : category,
      targetPlatforms: ['all', 'ohouse', 'instagram', 'youtube'],
      aspectRatio: '9:16',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scenes: [
        {
          id: `scene-${Date.now()}-1`,
          mediaType: 'image',
          url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
          title: '포근한 일상의 순간',
          subtitle: '마음이 머무는 따뜻한 기록',
          callToAction: '궁금하신 정보는 댓글 남겨주시면 알려드릴게요 🤍',
          durationSec: 4,
          kidsStickers: [],
          filter: 'butter_warm'
        }
      ],
      snsMetadata: {
        youtube: {
          title: '감성 가득한 일상 기록 쇼츠',
          description: '궁금하신 점은 언제든 댓글로 남겨주세요!',
          commentQuestionPrompt: '📌 여러분의 소소한 일상 이야기를 댓글로 나눠요!',
          hashtags: ['일상기록', '브이로그', '쇼츠']
        },
        instagram: {
          caption: `햇살이 길게 머무는 오늘의 순간 ✨\n\n궁금하신 점은 댓글 남겨주세요 🤍`,
          commentTriggerHook: '💬 궁금하신 점은 댓글로 편하게 물어보세요!',
          hashtags: ['#일상스타그램', '#감성기록', '#릴스']
        },
        ohouse: {
          title: '따뜻한 온기가 머무는 공간 이야기',
          spaceType: '거실',
          stylingTip: '부드러운 조명과 톤온톤 패브릭을 매치했습니다.',
          commentNotice: '소품이나 공간 질문 환영합니다 :)',
          hashtags: ['#오늘의집', '#공간기록', '#온라인집들이']
        }
      }
    };

    setCurrentProject(newProj);
    setCurrentTab('studio');
    showToast('새 프로젝트가 생성되었습니다.');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#FAFAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-rose-100 selection:text-rose-900">
        {/* Main Header (All-in-One Studio) */}
        <HomeKidsHeader
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          savedCount={savedProjects.length}
        />

        {/* Main Views */}
        <main className="flex-1 pb-16">
          {currentTab === 'templates' && (
            <HomeKidsTemplatesView
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onSelectTemplate={handleSelectTemplate}
              onLoadProject={(proj) => {
                setCurrentProject(proj);
                setCurrentTab('studio');
                showToast(`'${proj.title}' 프로젝트를 불러왔습니다.`);
              }}
              onCreateNewProject={handleCreateNewProject}
            />
          )}

          {currentTab === 'studio' && (
            <HomeKidsStudio
              project={currentProject}
              setProject={setCurrentProject}
              onGoToPublish={() => setCurrentTab('publish')}
              onSaveProject={handleSaveCurrentProject}
              onBack={() => setCurrentTab('templates')}
              onClose={() => setCurrentTab('templates')}
            />
          )}

          {currentTab === 'publish' && (
            <PlatformPublishHub
              project={currentProject}
              setProject={setCurrentProject}
              onBackToStudio={() => setCurrentTab('studio')}
              onClose={() => setCurrentTab('templates')}
            />
          )}

          {currentTab === 'saved' && (
            <HomeKidsSavedView
              savedProjects={savedProjects}
              onSelectProject={(proj) => {
                setCurrentProject(proj);
                setCurrentTab('studio');
                showToast(`'${proj.title}' 프로젝트를 불러왔습니다.`);
              }}
              onDeleteProject={handleDeleteSavedProject}
              onCreateNew={() => handleCreateNewProject(activeCategory)}
              onBack={() => setCurrentTab('templates')}
              onClose={() => setCurrentTab('templates')}
            />
          )}
        </main>

        {/* Minimal Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 bg-slate-900/95 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-800 leading-none">
            <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="leading-none">{toastMessage}</span>
          </div>
        )}

        {/* Clean Aesthetic Footer */}
        <footer className="bg-white border-t border-slate-100 py-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2">
              <span className="font-extrabold text-slate-900">율하스튜디오 (Yulha Studio)</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">All-in-One Media Creator Studio</span>
            </div>
            <p className="text-[11px] text-slate-400">
              인스타그램, 오늘의집, 유튜브를 아우르는 감성 미디어 제작 만능 플랫폼
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
