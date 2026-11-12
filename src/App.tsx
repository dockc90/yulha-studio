/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HomeKidsHeader, StudioTab } from './components/HomeKidsHeader';
import { HomeKidsTemplatesView } from './components/HomeKidsTemplatesView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UniversalCategory, HomeKidsProject, QuickTemplate, CanvasAspectRatio, MediaScene } from './types/homeAndKids';
import { SAMPLE_HOME_KIDS_PROJECTS } from './data/homeKidsTemplates';
import { Sparkles } from 'lucide-react';

// Code Splitting (React.lazy): 무거운 에디터와 퍼블리싱 허브를 지연 로딩하여 첫 페이지 초고속 로딩 보장
const HomeKidsStudio = lazy(() =>
  import('./components/HomeKidsStudio').then((m) => ({ default: m.HomeKidsStudio }))
);
const PlatformPublishHub = lazy(() =>
  import('./components/PlatformPublishHub').then((m) => ({ default: m.PlatformPublishHub }))
);
const HomeKidsSavedView = lazy(() =>
  import('./components/HomeKidsSavedView').then((m) => ({ default: m.HomeKidsSavedView }))
);

const ViewLoadingFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 text-[#787774] animate-in fade-in">
    <div className="w-6 h-6 border-2 border-[#23272A] border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-medium">스튜디오를 불러오는 중입니다...</span>
  </div>
);

const YULHA_STORAGE_KEY = 'yulha_studio_saved_projects_v3';

const createEmptyProject = (title = '새 프로젝트', category: UniversalCategory = 'home', aspectRatio: CanvasAspectRatio = '9:16'): HomeKidsProject => ({
  id: `proj-${Date.now()}`,
  title,
  description: '소중한 순간을 담은 미디어 프로젝트',
  category: category === 'all' ? 'home' : category,
  targetPlatforms: ['all', 'ohouse', 'instagram', 'youtube'],
  aspectRatio,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  scenes: [],
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
});

export default function App() {
  const [currentTab, setCurrentTab] = useState<StudioTab>('templates');
  const [activeCategory, setActiveCategory] = useState<UniversalCategory>('all');
  const [currentProject, setCurrentProject] = useState<HomeKidsProject>(() => createEmptyProject());
  const [initialOpenCapCut, setInitialOpenCapCut] = useState(false);

  // Browser History & Hardware/Gesture Back Button handling (모바일/PC 자체 뒤로가기 연동)
  useEffect(() => {
    // Initialize base history state
    if (!window.history.state || !window.history.state.tab) {
      window.history.replaceState({ tab: 'templates' }, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state && state.tab) {
        setCurrentTab(state.tab);
        setInitialOpenCapCut(false);
      } else {
        setCurrentTab('templates');
        setInitialOpenCapCut(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigateToTab = (newTab: StudioTab) => {
    if (newTab === currentTab) return;
    try {
      window.history.pushState({ tab: newTab }, '');
    } catch (e) {}
    setCurrentTab(newTab);
    if (newTab !== 'studio') setInitialOpenCapCut(false);
  };

  const handleGoBack = () => {
    if (currentTab !== 'templates') {
      window.history.back();
    }
  };
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

  // Safe localStorage helper to prevent quota exceeded errors
  const safeSaveToStorage = (projects: HomeKidsProject[]) => {
    try {
      localStorage.setItem(YULHA_STORAGE_KEY, JSON.stringify(projects));
    } catch (err) {
      console.warn('Storage quota exceeded, trimming media payloads for backup', err);
      try {
        const lightened = projects.slice(0, 15).map((proj) => ({
          ...proj,
          scenes: (proj.scenes || []).slice(0, 20).map((s) => ({
            ...s,
            url: s.url && s.url.length > 300000 ? '' : s.url,
          }))
        }));
        localStorage.setItem(YULHA_STORAGE_KEY, JSON.stringify(lightened));
      } catch {}
    }
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
      safeSaveToStorage(updated);
      return updated;
    });
    showToast('보관함에 저장되었습니다 ✨');
  };

  const handleDeleteSavedProject = (projectId: string) => {
    setSavedProjects((prev) => {
      const updated = prev.filter((p) => p.id !== projectId);
      safeSaveToStorage(updated);
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
    navigateToTab('studio');
    showToast(`'${template.title}' 템플릿이 적용되었습니다.`);
  };

  // Direct CapCut Launch
  const handleOpenCapCutDirectly = () => {
    // If project has no video scene, create or adapt with video
    const hasVideo = currentProject.scenes.some(s => s.mediaType === 'video');
    if (!hasVideo) {
      const videoScene: MediaScene = {
        id: `scene-capcut-${Date.now()}`,
        mediaType: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        title: '프로 동영상 컷편집',
        subtitle: '재생바에서 ✂️ 분할 버튼을 눌러보세요',
        durationSec: 15,
        kidsStickers: [],
        filter: 'butter_warm',
      };
      setCurrentProject(prev => ({
        ...prev,
        scenes: [videoScene, ...prev.scenes],
        aspectRatio: '9:16',
        updatedAt: new Date().toISOString()
      }));
    }
    setInitialOpenCapCut(true);
    navigateToTab('studio');
    showToast('프로 동영상 편집기를 실행했습니다 🎬');
  };

  // Helper to safely buffer uploaded media into memory (prevents blob revocation and broken images on mobile)
  const processMediaFile = (file: File): Promise<{ url: string; isVideo: boolean; title: string }> => {
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|avi|m4v)$/i.test(file.name);
    const cleanTitle = file.name.replace(/\.[^/.]+$/, "");

    if (isVideo) {
      return Promise.resolve({
        url: URL.createObjectURL(file),
        isVideo: true,
        title: cleanTitle || '생생한 순간의 비디오'
      });
    }

    // For photos, use FileReader.readAsDataURL so the image is fully buffered in memory as base64.
    // This completely eliminates blob revocation / broken image icons when the input unmounts!
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          isVideo: false,
          title: cleanTitle || '마음이 머무는 사진'
        });
      };
      reader.onerror = () => {
        resolve({
          url: URL.createObjectURL(file),
          isVideo: false,
          title: cleanTitle || '마음이 머무는 사진'
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Start directly with dropped or selected user media (Canva/CapCut Style)
  const handleStartWithMedia = async (files: FileList | File[], options?: { aspectRatio?: CanvasAspectRatio; openCapCut?: boolean }) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);

    const processed = await Promise.all(fileList.map((f) => processMediaFile(f)));

    const newScenes: MediaScene[] = processed.map((item, idx) => ({
      id: `scene-${Date.now()}-${idx + 1}`,
      mediaType: item.isVideo ? 'video' : 'image',
      url: item.url,
      title: item.title,
      subtitle: item.isVideo ? '생생한 순간을 담았습니다' : '소중한 일상을 담았습니다',
      durationSec: item.isVideo ? 8 : 4,
      kidsStickers: [],
      customSubtitles: [],
      filter: 'none',
      zoom: 1.0,
      panX: 0,
      panY: 0,
    }));

    const hasVideo = processed.some((p) => p.isVideo);
    const chosenRatio = options?.aspectRatio || '9:16';
    const shouldOpenCapCut = options?.openCapCut ?? hasVideo;

    const newProj: HomeKidsProject = {
      id: `proj-${Date.now()}`,
      title: hasVideo ? '새로운 감성 영상 프로젝트' : '새로운 감성 사진 프로젝트',
      description: '업로드한 미디어로 제작 중인 콘텐츠',
      category: activeCategory === 'all' ? 'home' : activeCategory,
      targetPlatforms: ['all', 'ohouse', 'instagram', 'youtube'],
      aspectRatio: chosenRatio,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scenes: newScenes,
      snsMetadata: {
        youtube: {
          title: '감성 가득한 일상 기록 쇼츠',
          description: '궁금하신 점은 언제든 댓글로 남겨주세요!',
          commentQuestionPrompt: '📌 여러분의 소소한 일상 이야기를 댓글로 나눠요!',
          hashtags: ['일상기록', '브이로그', '쇼츠']
        },
        instagram: {
          caption: `포근하고 따뜻한 일상의 기록 ✨\n\n궁금하신 점은 댓글 남겨주세요 🤍`,
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
    setInitialOpenCapCut(shouldOpenCapCut);
    navigateToTab('studio');
    showToast(`${fileList.length}개의 미디어를 불러와 에디터를 열었습니다 ✨`);
  };

  // Create empty new project (Starts completely clean with NO dummy video or photos)
  const handleCreateNewProject = (category: UniversalCategory, options?: { aspectRatio?: CanvasAspectRatio; openCapCut?: boolean }) => {
    const isVideoMode = options?.openCapCut;
    const newProj = createEmptyProject(
      isVideoMode ? '새 동영상 프로젝트' : '새 프로젝트',
      category,
      options?.aspectRatio || '9:16'
    );

    setCurrentProject(newProj);
    setInitialOpenCapCut(options?.openCapCut || false);
    navigateToTab('studio');
    showToast(isVideoMode ? '동영상 편집기를 실행했습니다 🎬' : '새 프로젝트가 생성되었습니다.');
  };

  return (
    <ErrorBoundary onReset={() => { setCurrentTab('templates'); setInitialOpenCapCut(false); }}>
      <div className="min-h-screen bg-[#FBFBFA] text-[#37352F] flex flex-col font-sans antialiased selection:bg-[#EAE9E5] selection:text-[#23272A]">
        {/* Main Header (All-in-One Studio) */}
        <HomeKidsHeader
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            navigateToTab(tab);
          }}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          savedCount={savedProjects.length}
          onOpenCapCut={handleOpenCapCutDirectly}
        />

        {/* Main Views */}
        <main className="flex-1 pb-24 sm:pb-16 w-full max-w-full overflow-x-hidden">
          {currentTab === 'templates' && (
            <HomeKidsTemplatesView
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onSelectTemplate={handleSelectTemplate}
              onLoadProject={(proj) => {
                setCurrentProject(proj);
                setInitialOpenCapCut(false);
                navigateToTab('studio');
                showToast(`'${proj.title}' 프로젝트를 불러왔습니다.`);
              }}
              onCreateNewProject={handleCreateNewProject}
              onStartWithMedia={handleStartWithMedia}
              onOpenCapCutDirectly={handleOpenCapCutDirectly}
            />
          )}

          <Suspense fallback={<ViewLoadingFallback />}>
            {currentTab === 'studio' && (
              <HomeKidsStudio
                key={currentProject.id}
                project={currentProject}
                setProject={setCurrentProject}
                onGoToPublish={() => navigateToTab('publish')}
                onSaveProject={handleSaveCurrentProject}
                onBack={() => handleGoBack()}
                onClose={() => handleGoBack()}
                initialOpenCapCut={initialOpenCapCut}
              />
            )}

            {currentTab === 'publish' && (
              <PlatformPublishHub
                project={currentProject}
                setProject={setCurrentProject}
                onBackToStudio={() => handleGoBack()}
                onClose={() => handleGoBack()}
              />
            )}

            {currentTab === 'saved' && (
              <HomeKidsSavedView
                savedProjects={savedProjects}
                onSelectProject={(proj) => {
                  setCurrentProject(proj);
                  navigateToTab('studio');
                  showToast(`'${proj.title}' 프로젝트를 불러왔습니다.`);
                }}
                onDeleteProject={handleDeleteSavedProject}
                onCreateNew={() => handleCreateNewProject(activeCategory)}
                onBack={() => handleGoBack()}
                onClose={() => handleGoBack()}
              />
            )}
          </Suspense>
        </main>

        {/* Notion-Style Clean Minimalist Toast (Positioned safely above mobile bottom nav) */}
        {toastMessage && (
          <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 inline-flex items-center gap-2.5 bg-[#2F3437] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-xl border border-[#3F4448] leading-none animate-in fade-in slide-in-from-bottom-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="leading-none">{toastMessage}</span>
          </div>
        )}

        {/* Notion-Style Clean Minimalist Footer */}
        <footer className="bg-[#FBFBFA] border-t border-[#EDEDEB] py-7 text-xs text-[#787774]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2">
              <span className="font-semibold text-[#37352F]">
                율하스튜디오
              </span>
              <span className="text-[#D3D1CB]">·</span>
              <span className="text-[#787774]">All-in-One Media Creator Studio</span>
            </div>
            <p className="text-[11px] text-[#9B9A97]">
              인스타그램, 오늘의집, 유튜브를 위한 심플하고 강력한 미디어 에디터
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
