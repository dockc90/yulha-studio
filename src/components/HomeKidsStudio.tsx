import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Upload, 
  Plus, 
  Trash2, 
  Smile, 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  ArrowLeft, 
  Type, 
  ShieldCheck, 
  Sliders, 
  Film, 
  Music, 
  RotateCw, 
  Eye, 
  Wand2, 
  Copy,
  Layers,
  MessageCircle,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Scissors,
  Volume2,
  VolumeX,
  FastForward,
  Move,
  PlusCircle,
  Radio,
  Split,
  RefreshCw,
  Clock
} from 'lucide-react';
import { 
  HomeKidsProject, 
  MediaScene, 
  CanvasAspectRatio, 
  KidsSticker, 
  AestheticFilter,
  ColorAdjustments,
  MotionEffect,
  SubtitleFont,
  CustomSubtitle,
  TransitionEffect,
  BgmCategory,
  BgmPresetItem,
  TextTypography
} from '../types/homeAndKids';
import { 
  CUTE_STICKER_CATEGORIES, 
  POPULAR_BGM_PRESETS,
  BGM_CATEGORIES
} from '../data/homeKidsTemplates';
import { CapCutVideoEditorModal } from './CapCutVideoEditorModal';

// Web Audio API Synthesizer for copyright-safe BGM Preview
class BgmSynthPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrackId: string | null = null;
  private timer: any = null;

  play(trackId: string, category: string, onEnd?: () => void) {
    this.stop();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.isPlaying = true;
      this.currentTrackId = trackId;

      const scaleNotes: Record<string, number[]> = {
        cafe: [261.63, 329.63, 392.00, 493.88, 523.25, 392.00], // C Maj7 lofi
        kids: [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25], // C Major bright bells
        healing: [329.63, 392.00, 493.88, 587.33, 493.88], // Acoustic E minor
        travel: [293.66, 369.99, 440.00, 587.33, 440.00], // D Major cheerful
        trendy: [220.00, 261.63, 329.63, 392.00, 440.00], // A minor funky beat
        cinematic: [196.00, 246.94, 293.66, 392.00, 493.88] // G cinematic
      };

      const notes = scaleNotes[category] || scaleNotes.cafe;
      let step = 0;

      const playTone = () => {
        if (!this.ctx || !this.isPlaying) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = category === 'kids' ? 'sine' : category === 'trendy' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(notes[step % notes.length], this.ctx.currentTime);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.55);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.55);
        step++;
      };

      playTone();
      this.timer = setInterval(playTone, 320);

      // Auto stop after 10s preview
      setTimeout(() => {
        if (this.currentTrackId === trackId) {
          this.stop();
          onEnd?.();
        }
      }, 10000);
    } catch (e) {
      console.warn('AudioContext not available', e);
    }
  }

  stop() {
    this.isPlaying = false;
    this.currentTrackId = null;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ctx) {
      try { this.ctx.close(); } catch (e) {}
      this.ctx = null;
    }
  }

  getCurrentTrackId() {
    return this.isPlaying ? this.currentTrackId : null;
  }
}

const bgmSynth = new BgmSynthPlayer();

interface StudioProps {
  project: HomeKidsProject;
  setProject: React.Dispatch<React.SetStateAction<HomeKidsProject>>;
  onGoToPublish: () => void;
  onSaveProject: () => void;
  onBack?: () => void;
  onClose?: () => void;
  initialOpenCapCut?: boolean;
}

export const HomeKidsStudio: React.FC<StudioProps> = ({
  project,
  setProject,
  onGoToPublish,
  onSaveProject,
  onBack,
  onClose,
  initialOpenCapCut,
}) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const currentScene = project?.scenes?.[currentSceneIdx] || project?.scenes?.[0] || {
    id: 'scene-fallback',
    mediaType: 'image' as const,
    url: '',
    title: '',
    subtitle: '',
    durationSec: 4,
    kidsStickers: [],
    customSubtitles: [],
    filter: 'none' as const,
    zoom: 1.0,
    panX: 0,
    panY: 0
  };
  const [isPlaying, setIsPlaying] = useState(false);
  
  // CapCut Pro Dedicated Editor Modal State & Browser Back navigation
  const [isCapCutModalOpen, setIsCapCutModalOpen] = useState(initialOpenCapCut || false);

  useEffect(() => {
    if (initialOpenCapCut) {
      setIsCapCutModalOpen(true);
    }
  }, [initialOpenCapCut]);

  // Handle phone/browser back button for modal without closing the window
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (isCapCutModalOpen && (!e.state || e.state.modal !== 'capcut')) {
        setIsCapCutModalOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isCapCutModalOpen]);

  const openCapCutEditor = () => {
    try {
      window.history.pushState({ modal: 'capcut' }, '');
    } catch (e) {}
    setIsCapCutModalOpen(true);
  };

  const closeCapCutEditor = () => {
    setIsCapCutModalOpen(false);
    if (window.history.state?.modal === 'capcut') {
      window.history.back();
    }
  };

  // Active editing tab
  const [activeTool, setActiveTool] = useState<'filter' | 'adjust' | 'motion' | 'video_edit' | 'stickers' | 'text' | 'bgm'>('filter');
  
  // Subtitle Draggable & Multi-custom Subtitles
  const [selectedSubtitleId, setSelectedSubtitleId] = useState<string | null>(null);
  const [isDraggingSubtitle, setIsDraggingSubtitle] = useState(false);
  const [isRotatingSubtitle, setIsRotatingSubtitle] = useState(false);
  const subtitleCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sticker interaction & rotation
  const [activeStickerCategory, setActiveStickerCategory] = useState<'face_mask' | 'deco' | 'milestone' | 'bubble'>('face_mask');
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [isDraggingSticker, setIsDraggingSticker] = useState(false);
  const [isRotatingSticker, setIsRotatingSticker] = useState(false);
  const stickerCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // BGM Active Category & Preview State
  const [selectedBgmCategory, setSelectedBgmCategory] = useState<string>('all');
  const [playingBgmId, setPlayingBgmId] = useState<string | null>(null);

  // Timeline Scrubber state
  const [timelinePlayhead, setTimelinePlayhead] = useState(0); // in seconds

  // Media Background Pan & Zoom state (사진 끌어서 이동 및 확대/축소)
  const [isDraggingMedia, setIsDraggingMedia] = useState(false);
  const mediaDragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mediaPanStartRef = useRef<{ panX: number; panY: number }>({ panX: 0, panY: 0 });
  const pinchStartDistanceRef = useRef<number>(0);
  const pinchStartZoomRef = useRef<number>(1.0);

  // Track natural aspect ratio of the active media (가로/세로 프레임 맞춤 계산용)
  const [naturalAspect, setNaturalAspect] = useState<number | null>(null);

  useEffect(() => {
    if (!currentScene?.url) return;
    let isCancelled = false;
    if (currentScene.mediaType === 'image') {
      const img = new Image();
      img.onload = () => {
        if (!isCancelled && img.naturalWidth && img.naturalHeight) {
          setNaturalAspect(img.naturalWidth / img.naturalHeight);
        }
      };
      img.src = currentScene.url;
    }
    return () => {
      isCancelled = true;
    };
  }, [currentScene?.url, currentScene?.mediaType]);

  const getBoxAspectRatio = (ratio: CanvasAspectRatio): number => {
    switch (ratio) {
      case '9:16':
        return 9 / 16;
      case '1:1':
        return 1.0;
      case '4:5':
        return 4 / 5;
      case '16:9':
        return 16 / 9;
      default:
        return 9 / 16;
    }
  };

  // 가로/세로 원본 비율 100% 무왜곡 유지 (비율 차이는 깔끔한 검정색 레터박스로 채움)
  const getMediaSizeStyle = (): React.CSSProperties => {
    return {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      maxWidth: '100%',
      maxHeight: '100%',
    };
  };

  // 사진 채우기: 원본 사진 비율은 100% 무왜곡으로 유지하면서 검정 여백 없이 프레임에 꽉 차게 자동 확대
  const handleFillFrame = () => {
    const boxRatio = getBoxAspectRatio(project.aspectRatio);
    const aspect = naturalAspect || 1.0;
    
    // 계산: aspect가 boxRatio보다 크면 (가로가 더 긴 사진) 높이를 채우기 위해 aspect / boxRatio 배 확대
    // aspect가 boxRatio보다 작으면 (세로가 더 긴 사진) 너비를 채우기 위해 boxRatio / aspect 배 확대
    const fillZoom = aspect >= boxRatio
      ? Number((aspect / boxRatio).toFixed(2))
      : Number((boxRatio / aspect).toFixed(2));
      
    // 최소 1.0배, 최대 3.5배로 안전 클램핑
    const targetZoom = Math.max(1.0, Math.min(3.5, fillZoom));
    updateCurrentScene({ zoom: targetZoom, panX: 0, panY: 0 });
  };

  // 전체 맞춤: 여백이 생기더라도 원본 사진 전체가 온전히 보이도록 맞춤 (zoom 1.0)
  const handleFitEntire = () => {
    updateCurrentScene({ zoom: 1.0, panX: 0, panY: 0 });
  };

  // Original view toggle (Press & Hold or Click to compare)
  const [showOriginal, setShowOriginal] = useState(false);

  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  // Floating Live Preview tracking & controls (스크롤 내려도 미리보기 유지 & 크기조절 & 드래그 위치 이동)
  const [isMainPreviewVisible, setIsMainPreviewVisible] = useState(true);
  const [isFloatingDismissed, setIsFloatingDismissed] = useState(false);
  const [floatingPos, setFloatingPos] = useState<{ x: number; y: number } | null>(null);
  const [floatingSize, setFloatingSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isDraggingFloating, setIsDraggingFloating] = useState(false);
  const dragOffsetRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });

  const handleFloatingPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    e.preventDefault();
    const floatingEl = (e.currentTarget as HTMLElement).closest('.floating-preview-root') as HTMLElement;
    if (!floatingEl) return;
    const rect = floatingEl.getBoundingClientRect();
    dragOffsetRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
    setIsDraggingFloating(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleFloatingPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingFloating) return;
    e.preventDefault();
    const newX = e.clientX - dragOffsetRef.current.offsetX;
    const newY = e.clientY - dragOffsetRef.current.offsetY;
    const clampedX = Math.max(8, Math.min(window.innerWidth - 110, newX));
    const clampedY = Math.max(50, Math.min(window.innerHeight - 100, newY));
    setFloatingPos({ x: clampedX, y: clampedY });
  };

  const handleFloatingPointerUp = (e: React.PointerEvent) => {
    if (isDraggingFloating) {
      setIsDraggingFloating(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  useEffect(() => {
    const target = previewContainerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMainPreviewVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.15,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const scrollToMainPreview = () => {
    if (previewContainerRef.current) {
      const top = previewContainerRef.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const getMiniAspectClasses = (ratio: CanvasAspectRatio, size: 'sm' | 'md' | 'lg' = 'md') => {
    if (size === 'sm') {
      switch (ratio) {
        case '9:16': return 'w-20 h-[142px]';
        case '1:1': return 'w-24 h-24';
        case '4:5': return 'w-[90px] h-[112px]';
        case '16:9': return 'w-32 h-[72px]';
        default: return 'w-20 h-[142px]';
      }
    }
    if (size === 'lg') {
      switch (ratio) {
        case '9:16': return 'w-36 h-[256px]';
        case '1:1': return 'w-48 h-48';
        case '4:5': return 'w-40 h-[200px]';
        case '16:9': return 'w-64 h-[144px]';
        default: return 'w-36 h-[256px]';
      }
    }
    // 'md' (default)
    switch (ratio) {
      case '9:16': return 'w-28 h-[198px]';
      case '1:1': return 'w-36 h-36';
      case '4:5': return 'w-32 h-[160px]';
      case '16:9': return 'w-48 h-[108px]';
      default: return 'w-28 h-[198px]';
    }
  };
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // currentScene already declared above

  // Initialize adjustments and motion if undefined
  const adjustments: ColorAdjustments = currentScene?.adjustments || {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    warmth: 0,
    vignette: 0,
    blur: 0
  };

  const currentMotion: MotionEffect = currentScene?.motionEffect || 'static';
  
  // Default Typography with position, colors & size
  const typography: TextTypography = currentScene?.typography || {
    fontFamily: 'Pretendard',
    fontSizeScale: 1.0,
    textAlign: 'center',
    boxStyle: 'dark',
    bgColor: '#0F172A',
    bgOpacity: 75,
    textColor: '#FFFFFF',
    positionY: 82
  };

  const currentFont: SubtitleFont = typography.fontFamily;
  const currentBoxStyle = typography.boxStyle;

  // Aspect ratio dimension styling (각 비율마다 왜곡 없이 명확한 비율의 캔버스 규격 제공)
  const getAspectRatioClasses = (ratio: CanvasAspectRatio) => {
    switch (ratio) {
      case '9:16':
        return 'w-[230px] sm:w-[280px] md:w-[310px] aspect-[9/16]';
      case '1:1':
        return 'w-[290px] sm:w-[350px] md:w-[390px] aspect-square';
      case '4:5':
        return 'w-[260px] sm:w-[310px] md:w-[350px] aspect-[4/5]';
      case '16:9':
        return 'w-full max-w-[340px] sm:max-w-[480px] md:max-w-[540px] aspect-video';
      default:
        return 'w-[230px] sm:w-[280px] md:w-[310px] aspect-[9/16]';
    }
  };

  // Switch aspect ratio
  const handleSetAspectRatio = (ratio: CanvasAspectRatio) => {
    setProject((prev) => ({
      ...prev,
      aspectRatio: ratio,
      updatedAt: new Date().toISOString()
    }));
  };

  // Add new scene via photo/video upload (Buffered DataURL prevents broken images)
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, forceType?: 'image' | 'video') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const newScenes: MediaScene[] = await Promise.all(fileList.map((file, index) => {
      const isVid = forceType ? forceType === 'video' : (file.type.startsWith('video/') || /\.(mp4|webm|mov|avi|m4v)$/i.test(file.name));
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "");

      if (isVid) {
        const videoBlobUrl = URL.createObjectURL(file);
        return new Promise<MediaScene>((resolve) => {
          const tempV = document.createElement('video');
          tempV.preload = 'metadata';
          tempV.src = videoBlobUrl;
          const onMeta = () => {
            const dur = tempV.duration;
            const validDur = isFinite(dur) && dur > 0 ? Number(dur.toFixed(1)) : 8;
            resolve({
              id: `scene-${Date.now()}-${index}`,
              mediaType: 'video' as const,
              url: videoBlobUrl,
              title: cleanTitle || '새로운 영상 클립',
              subtitle: '생생한 순간을 담았습니다',
              callToAction: '궁금하신 점은 댓글 남겨주시면 알려드릴게요 🤍',
              durationSec: validDur,
              kidsStickers: [],
              filter: 'none' as const,
              zoom: 1.0,
              panX: 0,
              panY: 0,
              adjustments: { brightness: 0, contrast: 0, saturation: 0, warmth: 0, vignette: 0, blur: 0 },
              motionEffect: 'zoom_in' as const,
              typography: { fontFamily: 'Pretendard' as const, fontSizeScale: 1, textAlign: 'center' as const, boxStyle: 'dark' as const, bgColor: '#0F172A', bgOpacity: 75, textColor: '#FFFFFF', positionY: 82 }
            });
          };
          tempV.onloadedmetadata = onMeta;
          tempV.onerror = () => onMeta();
          setTimeout(onMeta, 2000);
        });
      }

      return new Promise<MediaScene>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: `scene-${Date.now()}-${index}`,
            mediaType: 'image' as const,
            url: reader.result as string,
            title: cleanTitle || '포근한 일상의 순간',
            subtitle: '마음이 머무는 따뜻한 기록',
            callToAction: '궁금하신 점은 댓글 남겨주시면 알려드릴게요 🤍',
            durationSec: 4,
            kidsStickers: [],
            filter: 'none' as const,
            zoom: 1.0,
            panX: 0,
            panY: 0,
            adjustments: { brightness: 0, contrast: 0, saturation: 0, warmth: 0, vignette: 0, blur: 0 },
            motionEffect: 'zoom_in' as const,
            typography: { fontFamily: 'Pretendard' as const, fontSizeScale: 1, textAlign: 'center' as const, boxStyle: 'dark' as const, bgColor: '#0F172A', bgOpacity: 75, textColor: '#FFFFFF', positionY: 82 }
          });
        };
        reader.onerror = () => {
          resolve({
            id: `scene-${Date.now()}-${index}`,
            mediaType: 'image' as const,
            url: URL.createObjectURL(file),
            title: cleanTitle || '포근한 일상의 순간',
            subtitle: '마음이 머무는 따뜻한 기록',
            callToAction: '궁금하신 점은 댓글 남겨주시면 알려드릴게요 🤍',
            durationSec: 4,
            kidsStickers: [],
            filter: 'none' as const,
            zoom: 1.0,
            panX: 0,
            panY: 0,
            adjustments: { brightness: 0, contrast: 0, saturation: 0, warmth: 0, vignette: 0, blur: 0 },
            motionEffect: 'zoom_in' as const,
            typography: { fontFamily: 'Pretendard' as const, fontSizeScale: 1, textAlign: 'center' as const, boxStyle: 'dark' as const, bgColor: '#0F172A', bgOpacity: 75, textColor: '#FFFFFF', positionY: 82 }
          });
        };
        reader.readAsDataURL(file);
      });
    }));

    setProject((prev) => ({
      ...prev,
      scenes: [...prev.scenes, ...newScenes],
      updatedAt: new Date().toISOString()
    }));

    setCurrentSceneIdx(project.scenes.length);
    e.target.value = '';
  };

  // Backwards compatibility
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleMediaUpload(e);
  };

  // Update current scene field
  const updateCurrentScene = (updates: Partial<MediaScene>) => {
    setProject((prev) => {
      const newScenes = [...prev.scenes];
      if (newScenes[currentSceneIdx]) {
        newScenes[currentSceneIdx] = {
          ...newScenes[currentSceneIdx],
          ...updates
        };
      }
      return {
        ...prev,
        scenes: newScenes,
        updatedAt: new Date().toISOString()
      };
    });
  };

  // Update typography fields
  const updateTypography = (updates: Partial<TextTypography>) => {
    updateCurrentScene({
      typography: {
        ...typography,
        ...updates
      }
    });
  };

  // Helper to retrieve scene's subtitles (fallback from title/subtitle/CTA if customSubtitles is undefined)
  const getSceneSubtitles = (scene?: MediaScene): CustomSubtitle[] => {
    if (!scene) return [];
    if (scene.customSubtitles !== undefined) {
      return scene.customSubtitles;
    }
    const typo = scene.typography || typography;
    const initialList: CustomSubtitle[] = [];
    if (scene.title) {
      initialList.push({
        id: `${scene.id}-title`,
        text: scene.title,
        x: 50,
        y: typo.positionY || 78,
        fontFamily: typo.fontFamily || 'Pretendard',
        fontSizeScale: typo.fontSizeScale || 1.1,
        textColor: typo.textColor || '#FFFFFF',
        bgColor: typo.boxStyle === 'none' ? undefined : (typo.bgColor || '#0F172A'),
        bgOpacity: typo.bgOpacity ?? 75,
        boxStyle: typo.boxStyle || 'dark',
        textAlign: typo.textAlign || 'center'
      });
    }
    if (scene.subtitle) {
      initialList.push({
        id: `${scene.id}-sub`,
        text: scene.subtitle,
        x: 50,
        y: (typo.positionY || 78) + 7,
        fontFamily: typo.fontFamily || 'Pretendard',
        fontSizeScale: (typo.fontSizeScale || 1.0) * 0.85,
        textColor: typo.textColor || '#FFFFFF',
        bgColor: undefined,
        bgOpacity: 0,
        boxStyle: 'none',
        textAlign: typo.textAlign || 'center'
      });
    }
    if (scene.callToAction) {
      initialList.push({
        id: `${scene.id}-cta`,
        text: `💬 ${scene.callToAction}`,
        x: 50,
        y: (typo.positionY || 78) + 14,
        fontFamily: typo.fontFamily || 'Pretendard',
        fontSizeScale: 0.82,
        textColor: '#FDA4AF',
        bgColor: '#0F172A',
        bgOpacity: 80,
        boxStyle: 'dark',
        textAlign: typo.textAlign || 'center',
        isCta: true
      });
    }
    return initialList;
  };

  const activeSubtitles = getSceneSubtitles(currentScene);
  const selectedSubtitle = activeSubtitles.find((s) => s.id === selectedSubtitleId) || activeSubtitles[0];

  // Add new custom subtitle
  const handleAddSubtitle = (initialText = '새로운 감성 자막 ✨') => {
    const newSub: CustomSubtitle = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: initialText,
      x: 50,
      y: 50,
      fontFamily: currentFont,
      fontSizeScale: 1.0,
      textColor: typography.textColor || '#FFFFFF',
      bgColor: '#0F172A',
      bgOpacity: 75,
      boxStyle: 'dark',
      textAlign: 'center'
    };
    const currentSubs = currentScene?.customSubtitles && currentScene.customSubtitles.length > 0
      ? currentScene.customSubtitles
      : activeSubtitles;
    updateCurrentScene({ customSubtitles: [...currentSubs, newSub] });
    setSelectedSubtitleId(newSub.id);
  };

  // Update a specific subtitle
  const updateSubtitle = (subId: string, updates: Partial<CustomSubtitle>) => {
    const currentSubs = currentScene?.customSubtitles && currentScene.customSubtitles.length > 0
      ? currentScene.customSubtitles
      : activeSubtitles;
    const updated = currentSubs.map((s) => (s.id === subId ? { ...s, ...updates } : s));
    updateCurrentScene({ customSubtitles: updated });
  };

  // Delete a subtitle (supports deleting even when 1 subtitle remains)
  const handleDeleteSubtitle = (subId: string, e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    const currentSubs = currentScene?.customSubtitles !== undefined
      ? currentScene.customSubtitles
      : activeSubtitles;
    const updated = currentSubs.filter((s) => s.id !== subId);
    updateCurrentScene({
      customSubtitles: updated,
      title: updated.length === 0 ? '' : currentScene.title,
      subtitle: updated.length === 0 ? '' : currentScene.subtitle,
      callToAction: updated.length === 0 ? '' : currentScene.callToAction
    });
    if (selectedSubtitleId === subId) {
      setSelectedSubtitleId(updated[0]?.id || null);
    }
  };

  // Duplicate a subtitle
  const handleDuplicateSubtitle = (sub: CustomSubtitle, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newSub: CustomSubtitle = {
      ...sub,
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      x: Math.min(90, sub.x + 4),
      y: Math.min(90, sub.y + 4),
    };
    const currentSubs = currentScene?.customSubtitles && currentScene.customSubtitles.length > 0
      ? currentScene.customSubtitles
      : activeSubtitles;
    updateCurrentScene({ customSubtitles: [...currentSubs, newSub] });
    setSelectedSubtitleId(newSub.id);
  };

  // CapCut: Split current scene into two
  const handleSplitClip = () => {
    if (!currentScene) return;
    const currentDur = currentScene.durationSec || 4;
    const halfDuration = Math.max(1.5, Number((currentDur / 2).toFixed(1)));
    const sceneA: MediaScene = {
      ...currentScene,
      id: `scene-${Date.now()}-part1`,
      title: `${currentScene.title} (Part 1)`,
      durationSec: halfDuration,
      trimEnd: halfDuration
    };
    const sceneB: MediaScene = {
      ...currentScene,
      id: `scene-${Date.now()}-part2`,
      title: `${currentScene.title} (Part 2)`,
      durationSec: halfDuration,
      trimStart: halfDuration
    };

    setProject((prev) => {
      const newScenes = [...prev.scenes];
      newScenes.splice(currentSceneIdx, 1, sceneA, sceneB);
      return {
        ...prev,
        scenes: newScenes,
        updatedAt: new Date().toISOString()
      };
    });
  };

  // CapCut: Duplicate current scene
  const handleDuplicateClip = () => {
    if (!currentScene) return;
    const duplicated: MediaScene = {
      ...currentScene,
      id: `scene-${Date.now()}-copy`,
      title: `${currentScene.title} (복사본)`
    };
    setProject((prev) => {
      const newScenes = [...prev.scenes];
      newScenes.splice(currentSceneIdx + 1, 0, duplicated);
      return {
        ...prev,
        scenes: newScenes,
        updatedAt: new Date().toISOString()
      };
    });
    setCurrentSceneIdx((prev) => prev + 1);
  };

  // CapCut: Rotate clip 90 degrees
  const handleRotateClip = () => {
    const cur = currentScene.rotation || 0;
    updateCurrentScene({ rotation: (cur + 90) % 360 });
  };

  // BGM Audio Preview Toggle
  const handleTogglePlayBgm = (bgm: BgmPresetItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingBgmId === bgm.id) {
      bgmSynth.stop();
      setPlayingBgmId(null);
    } else {
      bgmSynth.play(bgm.id, bgm.category, () => {
        setPlayingBgmId(null);
      });
      setPlayingBgmId(bgm.id);
    }
  };

  // Update adjustments
  const updateAdjustments = (key: keyof ColorAdjustments, val: number) => {
    const updated = { ...adjustments, [key]: val };
    updateCurrentScene({ adjustments: updated });
  };

  // One-click Auto Magic Enhance ✨
  const handleAutoEnhance = () => {
    updateCurrentScene({
      adjustments: {
        brightness: 8,
        contrast: 10,
        saturation: 12,
        warmth: 6,
        vignette: 15,
        blur: 0
      },
      filter: 'butter_warm'
    });
  };

  // Reset adjustments
  const handleResetAdjustments = () => {
    updateCurrentScene({
      adjustments: { brightness: 0, contrast: 0, saturation: 0, warmth: 0, vignette: 0, blur: 0 },
      filter: 'none'
    });
  };

  // Delete scene
  const handleDeleteScene = (idx: number) => {
    if (project.scenes.length <= 1) {
      alert('최소 1개 이상의 슬라이드가 필요합니다.');
      return;
    }
    setProject((prev) => {
      const newScenes = prev.scenes.filter((_, i) => i !== idx);
      return {
        ...prev,
        scenes: newScenes,
        updatedAt: new Date().toISOString()
      };
    });
    if (currentSceneIdx >= project.scenes.length - 1) {
      setCurrentSceneIdx(Math.max(0, project.scenes.length - 2));
    }
  };

  // Add Sticker
  const handleAddKidsSticker = (preset: typeof CUTE_STICKER_CATEGORIES[0]['items'][0]) => {
    const sticker: KidsSticker = {
      id: `stk-${Date.now()}`,
      x: 50,
      y: 45,
      type: preset.type,
      icon: preset.icon,
      text: preset.text || preset.label,
      bgBubbleColor: preset.bgBubbleColor || '#FFFFFF',
      textColor: preset.textColor || '#0F172A',
      size: preset.type === 'face_mask' ? 65 : 48,
      rotation: 0
    };

    const currentStickers = currentScene.kidsStickers || [];
    updateCurrentScene({
      kidsStickers: [...currentStickers, sticker]
    });
    setSelectedStickerId(sticker.id);
  };

  // Remove Sticker
  const handleRemoveSticker = (stickerId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const currentStickers = currentScene.kidsStickers || [];
    updateCurrentScene({
      kidsStickers: currentStickers.filter((s) => s.id !== stickerId)
    });
    if (selectedStickerId === stickerId) setSelectedStickerId(null);
  };

  // Update selected sticker properties
  const updateSelectedSticker = (updates: Partial<KidsSticker>) => {
    if (!selectedStickerId) return;
    const currentStickers = (currentScene.kidsStickers || []).map((s) => {
      if (s.id === selectedStickerId) {
        return { ...s, ...updates };
      }
      return s;
    });
    updateCurrentScene({ kidsStickers: currentStickers });
  };

  // Helper: extract clientX, clientY from Mouse or Touch event
  const getPointerCoords = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    if ('changedTouches' in e && e.changedTouches.length > 0) {
      return { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY };
    }
    const mouse = e as React.MouseEvent;
    return { clientX: mouse.clientX, clientY: mouse.clientY };
  };

  // Canvas Pointer Down: Background photo drag or pinch start
  const handleCanvasPointerDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Check 2-finger touch for mobile pinch zoom
    if ('touches' in e && e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchStartDistanceRef.current = dist;
      pinchStartZoomRef.current = currentScene?.zoom || 1.0;
      setIsDraggingMedia(false);
      return;
    }

    const { clientX, clientY } = getPointerCoords(e);
    mediaDragStartRef.current = { x: clientX, y: clientY };
    mediaPanStartRef.current = { panX: currentScene?.panX || 0, panY: currentScene?.panY || 0 };
    setIsDraggingMedia(true);

    // Deselect selected items when clicking empty canvas background
    setSelectedSubtitleId(null);
    setSelectedStickerId(null);
  };

  // Canvas Mouse Wheel: Zoom in/out on desktop
  const handleCanvasWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomDelta = -e.deltaY * 0.0015;
    const currentZoom = currentScene?.zoom || 1.0;
    const nextZoom = Math.max(0.5, Math.min(3.0, Number((currentZoom + zoomDelta).toFixed(2))));
    updateCurrentScene({ zoom: nextZoom });
  };

  // Interactive Drag & Drop Sticker or Subtitle & Direct Rotation & Media Pan/Zoom on Canvas
  const handleCanvasPointerMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!previewContainerRef.current) return;

    // 1. Mobile Two-Finger Pinch Zoom
    if ('touches' in e && e.touches.length === 2 && pinchStartDistanceRef.current > 0) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = dist / pinchStartDistanceRef.current;
      const nextZoom = Math.max(0.5, Math.min(3.0, Number((pinchStartZoomRef.current * ratio).toFixed(2))));
      updateCurrentScene({ zoom: nextZoom });
      return;
    }

    if (!isDraggingSticker && !isDraggingSubtitle && !isRotatingSubtitle && !isRotatingSticker && !isDraggingMedia) return;

    const { clientX, clientY } = getPointerCoords(e);
    const rect = previewContainerRef.current.getBoundingClientRect();

    // 2. Direct On-Canvas Subtitle Rotation
    if (isRotatingSubtitle && selectedSubtitleId) {
      const centerX = subtitleCenterRef.current.x;
      const centerY = subtitleCenterRef.current.y;
      const radians = Math.atan2(clientY - centerY, clientX - centerX);
      let degrees = Math.round((radians * (180 / Math.PI)) - 90);
      if (degrees > 180) degrees -= 360;
      if (degrees < -180) degrees += 360;
      updateSubtitle(selectedSubtitleId, { rotation: degrees });
      return;
    }

    // 3. Direct On-Canvas Sticker Rotation
    if (isRotatingSticker && selectedStickerId) {
      const centerX = stickerCenterRef.current.x;
      const centerY = stickerCenterRef.current.y;
      const radians = Math.atan2(clientY - centerY, clientX - centerX);
      let degrees = Math.round((radians * (180 / Math.PI)) - 90);
      if (degrees > 180) degrees -= 360;
      if (degrees < -180) degrees += 360;
      updateSelectedSticker({ rotation: degrees });
      return;
    }

    // 4. Drag & Move Subtitle or Sticker (좌표 변경 시에만 업데이트하여 불필요한 렌더링 방지)
    if (isDraggingSticker && selectedStickerId) {
      const x = Math.max(5, Math.min(95, Math.round(((clientX - rect.left) / rect.width) * 100)));
      const y = Math.max(5, Math.min(95, Math.round(((clientY - rect.top) / rect.height) * 100)));
      const curSticker = currentScene?.kidsStickers?.find((s) => s.id === selectedStickerId);
      if (!curSticker || curSticker.x !== x || curSticker.y !== y) {
        updateSelectedSticker({ x, y });
      }
      return;
    } else if (isDraggingSubtitle && selectedSubtitleId) {
      const x = Math.max(5, Math.min(95, Math.round(((clientX - rect.left) / rect.width) * 100)));
      const y = Math.max(5, Math.min(95, Math.round(((clientY - rect.top) / rect.height) * 100)));
      const curSub = currentScene?.customSubtitles?.find((s) => s.id === selectedSubtitleId);
      if (!curSub || curSub.x !== x || curSub.y !== y) {
        updateSubtitle(selectedSubtitleId, { x, y });
      }
      return;
    }

    // 5. Drag & Move Photo Background (Pan)
    if (isDraggingMedia) {
      const deltaX = ((clientX - mediaDragStartRef.current.x) / rect.width) * 100;
      const deltaY = ((clientY - mediaDragStartRef.current.y) / rect.height) * 100;
      const nextPanX = Math.max(-100, Math.min(100, Math.round(mediaPanStartRef.current.panX + deltaX)));
      const nextPanY = Math.max(-100, Math.min(100, Math.round(mediaPanStartRef.current.panY + deltaY)));
      if (nextPanX !== (currentScene?.panX || 0) || nextPanY !== (currentScene?.panY || 0)) {
        updateCurrentScene({ panX: nextPanX, panY: nextPanY });
      }
    }
  };

  const handleCanvasPointerUp = () => {
    setIsDraggingSticker(false);
    setIsDraggingSubtitle(false);
    setIsRotatingSubtitle(false);
    setIsRotatingSticker(false);
    setIsDraggingMedia(false);
    pinchStartDistanceRef.current = 0;
  };

  // Canvas API & CSS filter string helper (모바일 & PC 전체 일치)
  const getFilterString = (filter: AestheticFilter, adj: ColorAdjustments) => {
    const b = 1 + adj.brightness / 100;
    const c = 1 + adj.contrast / 100;
    const s = 1 + adj.saturation / 100;
    const blur = adj.blur > 0 ? `blur(${adj.blur / 5}px)` : '';
    const warmth = adj.warmth !== 0 
      ? adj.warmth > 0 ? `sepia(${adj.warmth / 100}) hue-rotate(-${adj.warmth / 15}deg)` : `hue-rotate(${-adj.warmth / 10}deg)`
      : '';

    let baseFilter = '';
    switch (filter) {
      case 'butter_warm':
        baseFilter = 'sepia(0.35) brightness(1.08) saturate(1.25) hue-rotate(-6deg) contrast(1.04)';
        break;
      case 'golden_hour':
        baseFilter = 'sepia(0.42) brightness(1.08) saturate(1.35) hue-rotate(-12deg) contrast(1.06)';
        break;
      case 'soft_milk':
        baseFilter = 'brightness(1.12) saturate(0.92) contrast(0.92) sepia(0.08)';
        break;
      case 'tokyo_mood':
        baseFilter = 'sepia(0.18) saturate(0.80) contrast(0.98) brightness(1.04) hue-rotate(5deg)';
        break;
      case 'vintage_film':
        baseFilter = 'sepia(0.40) contrast(1.15) brightness(0.95) saturate(1.18)';
        break;
      case 'natural_clean':
        baseFilter = 'contrast(1.06) saturate(1.08) brightness(1.05)';
        break;
      case 'vivid_glow':
        baseFilter = 'saturate(1.40) brightness(1.08) contrast(1.08)';
        break;
      case 'pure_minimal':
        baseFilter = 'brightness(1.12) contrast(0.95) saturate(0.85)';
        break;
      default:
        baseFilter = '';
    }

    const res = `${baseFilter} brightness(${b}) contrast(${c}) saturate(${s}) ${warmth} ${blur}`.trim();
    return res || 'none';
  };

  // Backwards compatibility alias
  const getCanvasFilterString = (filter: AestheticFilter, adj: ColorAdjustments) => getFilterString(filter, adj);
  const getFilterClass = (_filter: AestheticFilter) => '';

  // Unified Fine Adjustment & Preset Style helper (Mobile Safari & Chrome WebKit Compatible)
  const getCombinedFilterStyle = (): React.CSSProperties => {
    if (showOriginal) return {};
    const filterStr = getFilterString(currentScene?.filter || 'none', adjustments);
    if (!filterStr || filterStr === 'none') return {};
    return {
      filter: filterStr,
      WebkitFilter: filterStr,
    };
  };

  const getAdjustStyle = (): React.CSSProperties => getCombinedFilterStyle();

  // Motion class for Preview
  const getMotionAnimationClass = (motion: MotionEffect) => {
    if (!isPlaying) return '';
    switch (motion) {
      case 'zoom_in':
        return 'scale-110 transition-transform duration-[4000ms] ease-out';
      case 'zoom_out':
        return 'scale-95 transition-transform duration-[4000ms] ease-out';
      case 'pan_left':
        return '-translate-x-4 transition-transform duration-[4000ms] ease-out';
      case 'pan_right':
        return 'translate-x-4 transition-transform duration-[4000ms] ease-out';
      case 'fade':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  // Export frame as High-Quality PNG using Canvas
  const handleDownloadSnapshot = (sceneToExport = currentScene, fileNameSuffix = '') => {
    if (!sceneToExport) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1080;
    let height = 1920; // 9:16
    if (project.aspectRatio === '1:1') {
      height = 1080;
    } else if (project.aspectRatio === '4:5') {
      height = 1350;
    } else if (project.aspectRatio === '16:9') {
      width = 1920;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = sceneToExport.url;

    img.onload = () => {
      // 1. Calculate true cover dimensions preserving image original aspect ratio
      const imgWidth = img.naturalWidth || width;
      const imgHeight = img.naturalHeight || height;
      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = width / height;

      let drawWidth = width;
      let drawHeight = height;

      // 0. Fill canvas background with solid black (letterbox / pillarbox)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // 1. Calculate true contain dimensions preserving image original aspect ratio
      if (imgRatio > canvasRatio) {
        // Image is wider than canvas: match width, height has clean letterbox
        drawWidth = width;
        drawHeight = width / imgRatio;
      } else {
        // Image is taller than canvas: match height, width has clean pillarbox
        drawHeight = height;
        drawWidth = height * imgRatio;
      }

      ctx.save();
      const adj = sceneToExport.adjustments || adjustments;
      ctx.filter = getCanvasFilterString(sceneToExport.filter, adj);

      const zoom = sceneToExport.zoom || 1.0;
      const panX = sceneToExport.panX || 0;
      const panY = sceneToExport.panY || 0;

      // Translate to canvas center
      ctx.translate(width / 2, height / 2);
      // Pan offset based on actual drawWidth and drawHeight
      ctx.translate((panX / 100) * drawWidth, (panY / 100) * drawHeight);
      ctx.scale(zoom, zoom);

      // Draw centered with true aspect-ratio cover
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      // 2. Vignette Layer if enabled
      if (adj.vignette > 0) {
        ctx.save();
        const gradient = ctx.createRadialGradient(
          width / 2, height / 2, width * 0.3,
          width / 2, height / 2, width * 0.75
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${adj.vignette / 120})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // 3. Subtitles (Draggable Multi-Subtitles or Fallback)
      const subsToExport = getSceneSubtitles(sceneToExport);
      if (subsToExport && subsToExport.length > 0) {
        // Safe roundRect helper
        const safeRoundRect = (rx: number, ry: number, rw: number, rh: number, r: number) => {
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(rx, ry, rw, rh, r);
          } else {
            ctx.rect(rx, ry, rw, rh);
          }
        };

        subsToExport.forEach((sub) => {
          ctx.save();
          const scale = sub.fontSizeScale || 1.0;
          const fontName = sub.fontFamily || 'Pretendard';
          const posX = (sub.x / 100) * width;
          const posY = (sub.y / 100) * height;

          ctx.translate(posX, posY);
          if (sub.rotation) {
            ctx.rotate((sub.rotation * Math.PI) / 180);
          }

          ctx.font = `bold ${Math.round(38 * scale)}px ${fontName}, sans-serif`;
          const textMetrics = ctx.measureText(sub.text);
          const textWidth = textMetrics.width;
          const boxPadding = 32 * scale;
          const boxHeight = 70 * scale;
          const boxWidth = textWidth + boxPadding * 2;

          const subOpacity = (sub.bgOpacity !== undefined ? sub.bgOpacity : 75) / 100;
          if (sub.boxStyle !== 'none' && subOpacity > 0) {
            if (sub.boxStyle === 'glass') {
              ctx.fillStyle = `rgba(255, 255, 255, ${subOpacity})`;
            } else if (sub.boxStyle === 'cream') {
              ctx.fillStyle = `rgba(254, 243, 199, ${subOpacity})`;
            } else if (sub.bgColor) {
              const hex = sub.bgColor.replace('#', '');
              const r = parseInt(hex.substring(0, 2), 16) || 15;
              const g = parseInt(hex.substring(2, 4), 16) || 23;
              const b = parseInt(hex.substring(4, 6), 16) || 42;
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${subOpacity})`;
            } else {
              ctx.fillStyle = `rgba(15, 23, 42, ${subOpacity})`;
            }
            safeRoundRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 20 * scale);
            ctx.fill();
          }

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = sub.textColor || '#FFFFFF';
          ctx.fillText(sub.text, 0, 0);
          ctx.restore();
        });
      }

      // 4. Stickers
      if (sceneToExport.kidsStickers) {
        sceneToExport.kidsStickers.forEach((stk) => {
          const posX = (stk.x / 100) * width;
          const posY = (stk.y / 100) * height;

          ctx.save();
          ctx.translate(posX, posY);
          if (stk.rotation) ctx.rotate((stk.rotation * Math.PI) / 180);

          if (stk.type === 'face_mask') {
            ctx.font = `${stk.size * 1.6}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(stk.icon || '🐻', 0, 0);
          } else {
            ctx.font = 'bold 30px Pretendard, sans-serif';
            const badgeText = `${stk.icon ? stk.icon + ' ' : ''}${stk.text || ''}`;
            const textWidth = ctx.measureText(badgeText).width;

            ctx.fillStyle = stk.bgBubbleColor || '#FFFFFF';
            if (typeof ctx.roundRect === 'function') {
              ctx.roundRect(-textWidth / 2 - 20, -28, textWidth + 40, 56, 28);
            } else {
              ctx.rect(-textWidth / 2 - 20, -28, textWidth + 40, 56);
            }
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#E2E8F0';
            ctx.stroke();

            ctx.fillStyle = stk.textColor || '#0F172A';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(badgeText, 0, 2);
          }

          ctx.restore();
        });
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `yulha-${(project.title || 'studio').replace(/\s+/g, '_')}${fileNameSuffix}-${Date.now()}.png`;
        link.href = objectUrl;
        link.click();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
      }, 'image/png');
    };
  };

  // Batch Export All Scenes as High-Res Images
  const handleBatchDownloadAll = () => {
    project.scenes.forEach((scene, index) => {
      setTimeout(() => {
        handleDownloadSnapshot(scene, `-slide${index + 1}`);
      }, index * 400);
    });
  };

  // Play slideshow
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        setCurrentSceneIdx((prev) => (prev + 1) % project.scenes.length);
      }, (currentScene?.durationSec || 4) * 1000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentSceneIdx, project.scenes.length, currentScene?.durationSec]);

  const selectedSticker = currentScene?.kidsStickers?.find((s) => s.id === selectedStickerId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Action Bar with Back & Close Buttons (Notion Clean Styling) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center p-2 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] transition-colors cursor-pointer border border-[#E3E2DE]"
              title="이전 화면으로 돌아가기"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
            </button>
          )}

          <div className="w-9 h-9 rounded-lg bg-[#23272A] flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col justify-center">
            <input
              type="text"
              value={project.title}
              onChange={(e) => setProject((prev) => ({ ...prev, title: e.target.value }))}
              className="font-semibold text-base sm:text-lg text-[#37352F] bg-transparent border-b border-transparent hover:border-[#D3D1CB] focus:border-[#23272A] focus:outline-none px-1 py-0.5 rounded-sm leading-normal"
            />
            <span className="text-xs text-[#787774] font-medium leading-none mt-0.5">
              슬라이드 {project.scenes.length}개 · {project.aspectRatio} 비율
            </span>
          </div>
        </div>

        {/* Aspect Ratio Selector (Notion Segmented Control) */}
        <div className="flex items-center gap-1 bg-[#F1F1EF] p-1 rounded-xl border border-[#EDEDEB] text-xs overflow-x-auto max-w-full shrink-0">
          <button
            onClick={() => handleSetAspectRatio('9:16')}
            className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-medium transition-all leading-none cursor-pointer ${
              project.aspectRatio === '9:16'
                ? 'bg-[#23272A] text-white shadow-xs font-semibold'
                : 'text-[#787774] hover:text-[#37352F] hover:bg-[#EAE9E5]/60'
            }`}
          >
            <span className="leading-none">9:16 세로</span>
          </button>
          <button
            onClick={() => handleSetAspectRatio('1:1')}
            className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-medium transition-all leading-none cursor-pointer ${
              project.aspectRatio === '1:1'
                ? 'bg-[#23272A] text-white shadow-xs font-semibold'
                : 'text-[#787774] hover:text-[#37352F] hover:bg-[#EAE9E5]/60'
            }`}
          >
            <span className="leading-none">1:1 정방형</span>
          </button>
          <button
            onClick={() => handleSetAspectRatio('4:5')}
            className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-medium transition-all leading-none cursor-pointer ${
              project.aspectRatio === '4:5'
                ? 'bg-[#23272A] text-white shadow-xs font-semibold'
                : 'text-[#787774] hover:text-[#37352F] hover:bg-[#EAE9E5]/60'
            }`}
          >
            <span className="leading-none">4:5 피드</span>
          </button>
          <button
            onClick={() => handleSetAspectRatio('16:9')}
            className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-medium transition-all leading-none cursor-pointer ${
              project.aspectRatio === '16:9'
                ? 'bg-[#23272A] text-white shadow-xs font-semibold'
                : 'text-[#787774] hover:text-[#37352F] hover:bg-[#EAE9E5]/60'
            }`}
          >
            <span className="leading-none">16:9 가로</span>
          </button>
        </div>

        {/* Actions Button Row + Close Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Compare Original Button */}
          <button
            onMouseDown={() => setShowOriginal(true)}
            onMouseUp={() => setShowOriginal(false)}
            onMouseLeave={() => setShowOriginal(false)}
            onTouchStart={() => setShowOriginal(true)}
            onTouchEnd={() => setShowOriginal(false)}
            className={`inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-medium transition-colors leading-none cursor-pointer ${
              showOriginal ? 'bg-[#23272A] text-white' : 'bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] border border-[#E3E2DE]'
            }`}
            title="누르고 있으면 원본 사진과 실시간 비교"
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span className="leading-none">원본 비교</span>
          </button>

          {/* Export Options Dropdown or Buttons */}
          <button
            onClick={() => handleDownloadSnapshot(currentScene)}
            className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-white hover:bg-[#F1F1EF] text-[#37352F] text-[11px] sm:text-xs font-medium border border-[#E3E2DE] transition-colors leading-none cursor-pointer"
            title="현재 사진 고화질 저장"
          >
            <Download className="w-3.5 h-3.5 text-[#787774] shrink-0" />
            <span className="leading-none">사진 저장</span>
          </button>

          {project.scenes.length > 1 && (
            <button
              onClick={handleBatchDownloadAll}
              className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white hover:bg-[#F1F1EF] text-[#37352F] text-[11px] sm:text-xs font-medium border border-[#E3E2DE] transition-colors leading-none cursor-pointer"
              title="모든 슬라이드 한 번에 저장"
            >
              <Layers className="w-3.5 h-3.5 text-[#787774] shrink-0" />
              <span className="leading-none hidden sm:inline">전체 일괄 저장</span>
              <span className="leading-none sm:hidden">일괄 저장</span>
            </button>
          )}

          <button
            onClick={onSaveProject}
            className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-[#23272A] hover:bg-[#37352F] text-white text-[11px] sm:text-xs font-medium transition-colors leading-none cursor-pointer shadow-xs"
          >
            <Check className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="leading-none">보관함 저장</span>
          </button>

          <button
            onClick={onGoToPublish}
            className="hidden sm:inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] text-[11px] sm:text-xs font-medium border border-[#E3E2DE] transition-colors leading-none cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#787774] shrink-0" />
            <span className="leading-none">SNS 가이드</span>
          </button>

          {/* Pro Video Editor Launcher Button */}
          <button
            onClick={openCapCutEditor}
            className="hidden sm:inline-flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] font-medium text-[11px] sm:text-xs border border-[#E3E2DE] transition-colors leading-none cursor-pointer"
            title="전문 동영상 편집기 열기"
          >
            <Scissors className="w-3.5 h-3.5 text-[#37352F] shrink-0" />
            <span className="leading-none">동영상 컷편집</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center p-2 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#787774] transition-colors cursor-pointer border border-[#E3E2DE]"
              title="창 닫기 (홈으로 이동)"
            >
              <X className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Canvas Preview (lg: 7 cols - Notion Clean Styling) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-6 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col items-center relative">
          {/* Section Title */}
          <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-[#EDEDEB]">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#23272A]" />
              <h3 className="font-semibold text-sm sm:text-base text-[#37352F] tracking-tight leading-none">
                미리보기
              </h3>
              <span className="text-[10px] sm:text-[11px] font-mono text-[#787774] bg-[#F1F1EF] border border-[#EDEDEB] px-2 py-0.5 rounded-md leading-none">
                {project.aspectRatio}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#787774] font-mono">
              <span className="text-[#37352F] font-semibold">{currentSceneIdx + 1}</span>
              <span>/</span>
              <span>{project.scenes.length}</span>
            </div>
          </div>

          <div className="w-full flex justify-center py-2">
            <div
              ref={previewContainerRef}
              onMouseDown={handleCanvasPointerDown}
              onTouchStart={handleCanvasPointerDown}
              onMouseMove={handleCanvasPointerMove}
              onMouseUp={handleCanvasPointerUp}
              onMouseLeave={handleCanvasPointerUp}
              onTouchMove={handleCanvasPointerMove}
              onTouchEnd={handleCanvasPointerUp}
              onTouchCancel={handleCanvasPointerUp}
              onWheel={handleCanvasWheel}
              className={`relative overflow-hidden rounded-xl shadow-md border border-[#E9E9E7] bg-black select-none touch-none ${
                isDraggingMedia ? 'cursor-grabbing' : 'cursor-grab'
              } ${getAspectRatioClasses(project.aspectRatio)}`}
            >
              {/* Media Element with Filter, Pan & Zoom, and Adjustments (Preserves original aspect ratio and fits width/height) */}
              {!currentScene || !currentScene.url ? (
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#191919] select-none"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#282828] border border-[#3F4448] flex items-center justify-center mb-3 text-neutral-300">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">사진 또는 동영상 추가</h4>
                  <p className="text-xs text-neutral-400 mb-4 max-w-[220px] leading-relaxed">
                    사진이나 동영상을 추가하여 편집을 시작하세요
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-black font-bold text-xs shadow-sm hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>동영상 추가</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#282828] text-white font-medium text-xs shadow-xs hover:bg-[#333] transition-colors cursor-pointer border border-[#3F4448]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>사진 추가</span>
                    </button>
                  </div>
                </div>
              ) : currentScene?.mediaType === 'video' ? (
                <video
                  src={currentScene.url}
                  controls
                  playsInline
                  // @ts-ignore
                  webkit-playsinline="true"
                  onLoadedMetadata={(e) => {
                    const { videoWidth, videoHeight, duration } = e.currentTarget;
                    if (videoWidth && videoHeight) setNaturalAspect(videoWidth / videoHeight);
                    if (duration && isFinite(duration) && duration > 0) {
                      const realDur = Number(duration.toFixed(1));
                      if (Math.abs((currentScene?.durationSec || 0) - realDur) > 0.2) {
                        updateCurrentScene({ durationSec: realDur });
                      }
                    }
                  }}
                  style={{
                    ...getCombinedFilterStyle(),
                    ...getMediaSizeStyle(),
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${currentScene.panX || 0}%, ${currentScene.panY || 0}%) scale(${currentScene.zoom || 1.0})`,
                    transformOrigin: 'center center',
                    transition: isDraggingMedia ? 'none' : 'transform 0.1s ease-out',
                  }}
                  className="pointer-events-none select-none"
                />
              ) : (
                <img
                  src={currentScene?.url}
                  alt={currentScene?.title}
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.currentTarget;
                    if (naturalWidth && naturalHeight) setNaturalAspect(naturalWidth / naturalHeight);
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  style={{
                    ...getCombinedFilterStyle(),
                    ...getMediaSizeStyle(),
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${currentScene.panX || 0}%, ${currentScene.panY || 0}%) scale(${currentScene.zoom || 1.0})`,
                    transformOrigin: 'center center',
                    transition: isDraggingMedia ? 'none' : 'transform 0.1s ease-out',
                  }}
                  className={`pointer-events-none select-none ${getMotionAnimationClass(currentMotion)}`}
                />
              )}

              {/* Vignette Layer Overlay */}
              {adjustments.vignette > 0 && !showOriginal && (
                <div 
                  style={{
                    boxShadow: `inset 0 0 ${adjustments.vignette * 1.5}px rgba(0,0,0,${adjustments.vignette / 100})`
                  }}
                  className="absolute inset-0 pointer-events-none"
                />
              )}

              {/* Original Preview Indicator */}
              {showOriginal && (
                <div className="absolute top-4 left-4 bg-slate-900/90 text-amber-300 px-3 py-1 rounded-full text-xs font-bold shadow-md z-30">
                  원본 상태 미리보기 중
                </div>
              )}

              {/* Interactive Draggable Custom Subtitles Overlay */}
              {activeSubtitles.map((sub) => {
                const isSelected = selectedSubtitleId === sub.id;
                const subOpacity = (sub.bgOpacity !== undefined ? sub.bgOpacity : 75) / 100;
                const isCompletelyTransparent = (sub.boxStyle === 'none' && (sub.bgOpacity ?? 0) === 0) || subOpacity === 0;

                const getSubBg = () => {
                  if (sub.boxStyle === 'none') {
                    if ((sub.bgOpacity ?? 0) === 0) return 'transparent';
                    return `rgba(15, 23, 42, ${(sub.bgOpacity ?? 0) / 100})`;
                  }
                  if (sub.boxStyle === 'glass') return `rgba(255, 255, 255, ${subOpacity})`;
                  if (sub.boxStyle === 'cream') return `rgba(254, 243, 199, ${subOpacity})`;
                  if (sub.bgColor) {
                    const hex = sub.bgColor.replace('#', '');
                    const r = parseInt(hex.substring(0, 2), 16) || 15;
                    const g = parseInt(hex.substring(2, 4), 16) || 23;
                    const b = parseInt(hex.substring(4, 6), 16) || 42;
                    return `rgba(${r}, ${g}, ${b}, ${subOpacity})`;
                  }
                  return `rgba(15, 23, 42, ${subOpacity})`;
                };

                return (
                  <div
                    key={sub.id}
                    style={{
                      left: `${sub.x}%`,
                      top: `${sub.y}%`,
                      transform: `translate(-50%, -50%) rotate(${sub.rotation || 0}deg)`,
                      backgroundColor: getSubBg(),
                      textAlign: sub.textAlign || 'center',
                      backdropFilter: isCompletelyTransparent ? 'none' : 'blur(8px)',
                      WebkitBackdropFilter: isCompletelyTransparent ? 'none' : 'blur(8px)',
                      width: 'max-content',
                      maxWidth: '92%',
                      whiteSpace: 'nowrap',
                      border: isSelected
                        ? '2px solid #23272A'
                        : isCompletelyTransparent
                          ? 'none'
                          : '1px solid rgba(255, 255, 255, 0.25)',
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setSelectedSubtitleId(sub.id);
                      setIsDraggingSubtitle(true);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      setSelectedSubtitleId(sub.id);
                      setIsDraggingSubtitle(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSubtitleId(sub.id);
                    }}
                    className={`absolute z-20 px-3.5 py-2 rounded-2xl cursor-move select-none transition-transform duration-75 group ${
                      isSelected
                        ? 'ring-2 ring-white/80 shadow-2xl scale-102'
                        : 'hover:ring-1 hover:ring-white/40 shadow-md'
                    }`}
                  >
                    <span
                      style={{
                        fontFamily: sub.fontFamily || 'Pretendard',
                        fontSize: `${14 * (sub.fontSizeScale || 1.0)}px`,
                        color: sub.textColor || '#FFFFFF',
                        whiteSpace: 'nowrap',
                      }}
                      className="font-bold leading-tight block drop-shadow-sm pointer-events-none select-none"
                    >
                      {sub.text}
                    </span>

                    {/* Direct On-Canvas Controls: Drag tooltip, Delete & Rotation Handle */}
                    {isSelected && (
                      <>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-[#23272A] text-white text-[9px] font-medium px-2 py-0.5 rounded-full shadow-md whitespace-nowrap pointer-events-none leading-none z-30 border border-white/20">
                          <Move className="w-2.5 h-2.5" />
                          <span>드래그 이동</span>
                        </div>

                        {/* On-Canvas Delete Button for Subtitle */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSubtitle(sub.id, e)}
                          className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer border border-white z-40"
                          title="자막 삭제"
                        >
                          <X className="w-3.5 h-3.5 pointer-events-none" />
                        </button>

                        {/* Direct Rotation Stem & Handle on Canvas */}
                        <div 
                          className="absolute -bottom-9 left-1/2 -translate-x-1/2 flex items-center gap-1 z-30 pointer-events-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Quick Rotate -15° Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSubtitle(sub.id, { rotation: ((sub.rotation || 0) - 15) });
                            }}
                            className="w-6 h-6 rounded-full bg-[#23272A] hover:bg-[#37352F] text-white flex items-center justify-center text-[10px] font-medium shadow-md active:scale-90 transition-transform cursor-pointer border border-white/20"
                            title="-15° 회전"
                          >
                            ↺
                          </button>

                          {/* Interactive Rotation Knob (Drag to Spin) */}
                          <div
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              const targetEl = e.currentTarget.closest('.cursor-move') as HTMLElement;
                              if (targetEl) {
                                const r = targetEl.getBoundingClientRect();
                                subtitleCenterRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
                              }
                              setIsRotatingSubtitle(true);
                            }}
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              const targetEl = e.currentTarget.closest('.cursor-move') as HTMLElement;
                              if (targetEl) {
                                const r = targetEl.getBoundingClientRect();
                                subtitleCenterRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
                              }
                              setIsRotatingSubtitle(true);
                            }}
                            className="w-7 h-7 rounded-full bg-white border-2 border-[#23272A] text-[#23272A] flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-transform"
                            title="돌려서 직접 회전"
                          >
                            <RotateCw className="w-3.5 h-3.5 pointer-events-none" />
                          </div>

                          {/* Quick Rotate +15° Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSubtitle(sub.id, { rotation: ((sub.rotation || 0) + 15) });
                            }}
                            className="w-6 h-6 rounded-full bg-[#23272A] hover:bg-[#37352F] text-white flex items-center justify-center text-[10px] font-medium shadow-md active:scale-90 transition-transform cursor-pointer border border-white/20"
                            title="+15° 회전"
                          >
                            ↻
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {/* Stickers with Drag, On-Canvas Delete & Rotation Controls */}
              {currentScene?.kidsStickers?.map((stk) => {
                const isSelected = selectedStickerId === stk.id;
                return (
                  <div
                    key={stk.id}
                    style={{ 
                      left: `${stk.x}%`, 
                      top: `${stk.y}%`,
                      transform: `translate(-50%, -50%) rotate(${stk.rotation || 0}deg)`
                    }}
                    className={`absolute z-20 cursor-move select-none ${
                      isSelected ? 'ring-2 ring-white rounded-2xl scale-105' : ''
                    }`}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setSelectedStickerId(stk.id);
                      setIsDraggingSticker(true);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      setSelectedStickerId(stk.id);
                      setIsDraggingSticker(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStickerId(stk.id);
                    }}
                  >
                    {stk.type === 'face_mask' ? (
                      <div
                        style={{ fontSize: `${stk.size}px` }}
                        className="drop-shadow-lg flex items-center justify-center leading-none relative"
                      >
                        <span className="leading-none">{stk.icon || '🐻'}</span>
                      </div>
                    ) : (
                      <div
                        style={{
                          backgroundColor: stk.bgBubbleColor || '#FFFFFF',
                          color: stk.textColor || '#0F172A',
                          fontSize: `${Math.round(stk.size / 4)}px`
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold shadow-md border border-slate-200 whitespace-nowrap leading-none relative"
                      >
                        {stk.icon && <span className="leading-none">{stk.icon}</span>}
                        <span className="leading-none">{stk.text}</span>
                      </div>
                    )}

                    {/* Selected Sticker On-Canvas Controls (Delete & Rotation Handle) */}
                    {isSelected && (
                      <>
                        {/* Direct On-Canvas Delete Button (Top Right) */}
                        <button
                          type="button"
                          onClick={(e) => handleRemoveSticker(stk.id, e)}
                          className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer border border-white z-40"
                          title="스티커 삭제"
                        >
                          <X className="w-3.5 h-3.5 pointer-events-none" />
                        </button>

                        {/* Direct Rotation Stem & Handle on Canvas (Bottom) */}
                        <div 
                          className="absolute -bottom-9 left-1/2 -translate-x-1/2 flex items-center gap-1 z-40 pointer-events-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Quick Rotate -15° Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSelectedSticker({ rotation: ((stk.rotation || 0) - 15) });
                            }}
                            className="w-6 h-6 rounded-full bg-[#23272A] hover:bg-[#37352F] text-white flex items-center justify-center text-[10px] font-medium shadow-md active:scale-90 transition-transform cursor-pointer border border-white/20"
                            title="-15° 회전"
                          >
                            ↺
                          </button>

                          {/* Interactive Rotation Knob (Drag to Spin) */}
                          <div
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              const targetEl = e.currentTarget.closest('.cursor-move') as HTMLElement;
                              if (targetEl) {
                                const r = targetEl.getBoundingClientRect();
                                stickerCenterRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
                              }
                              setIsRotatingSticker(true);
                            }}
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              const targetEl = e.currentTarget.closest('.cursor-move') as HTMLElement;
                              if (targetEl) {
                                const r = targetEl.getBoundingClientRect();
                                stickerCenterRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
                              }
                              setIsRotatingSticker(true);
                            }}
                            className="w-7 h-7 rounded-full bg-white border-2 border-[#23272A] text-[#23272A] flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-transform"
                            title="돌려서 직접 회전"
                          >
                            <RotateCw className="w-3.5 h-3.5 pointer-events-none" />
                          </div>

                          {/* Quick Rotate +15° Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSelectedSticker({ rotation: ((stk.rotation || 0) + 15) });
                            }}
                            className="w-6 h-6 rounded-full bg-[#23272A] hover:bg-[#37352F] text-white flex items-center justify-center text-[10px] font-medium shadow-md active:scale-90 transition-transform cursor-pointer border border-white/20"
                            title="+15° 회전"
                          >
                            ↻
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Photo Zoom & Pan Controller Bar */}
          <div className="w-full max-w-sm mt-3 px-3 py-2 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex flex-col gap-2 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <span className="text-[11px] text-slate-500 whitespace-nowrap">사진 확대</span>
                <button
                  type="button"
                  onClick={() => {
                    const z = Math.max(0.5, Number(((currentScene?.zoom || 1.0) - 0.1).toFixed(2)));
                    updateCurrentScene({ zoom: z });
                  }}
                  className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer active:scale-95 transition-transform font-bold"
                  title="사진 축소"
                >
                  −
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.05"
                  value={currentScene?.zoom || 1.0}
                  onChange={(e) => updateCurrentScene({ zoom: parseFloat(e.target.value) })}
                  className="w-20 sm:w-28 accent-[#23272A] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => {
                    const z = Math.min(3.0, Number(((currentScene?.zoom || 1.0) + 0.1).toFixed(2)));
                    updateCurrentScene({ zoom: z });
                  }}
                  className="w-6 h-6 rounded-md bg-white border border-[#E3E2DE] hover:bg-[#F1F1EF] flex items-center justify-center text-[#37352F] cursor-pointer font-bold text-xs"
                  title="사진 확대"
                >
                  +
                </button>
                <span className="font-mono text-[11px] text-[#37352F] font-semibold min-w-[36px] text-right">
                  {Math.round((currentScene?.zoom || 1.0) * 100)}%
                </span>
              </div>

              {/* Reset Zoom & Pan Position Button */}
              {((currentScene?.zoom && currentScene.zoom !== 1.0) || currentScene?.panX || currentScene?.panY) && (
                <button
                  type="button"
                  onClick={() => updateCurrentScene({ zoom: 1.0, panX: 0, panY: 0 })}
                  className="text-[10px] font-medium text-[#787774] hover:text-[#37352F] bg-white hover:bg-[#F1F1EF] px-2 py-1 rounded-md border border-[#E3E2DE] transition-colors cursor-pointer whitespace-nowrap"
                  title="사진 위치 및 크기 원위치"
                >
                  ↺ 원위치
                </button>
              )}
            </div>

            {/* Quick Presets: Frame Fill & Full Fit */}
            <div className="flex items-center gap-1.5 pt-1.5 border-t border-[#EDEDEB] text-[11px]">
              <span className="text-[#787774] font-medium whitespace-nowrap">화면 맞춤:</span>
              <button
                type="button"
                onClick={handleFillFrame}
                className="px-2.5 py-1 rounded-md font-medium bg-[#23272A] hover:bg-[#37352F] text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                title="원본 사진 비율을 100% 유지하면서 검정 여백 없이 꽉 채웁니다"
              >
                <span>사진 채우기</span>
              </button>
              <button
                type="button"
                onClick={handleFitEntire}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer border ${
                  (currentScene?.zoom || 1.0) === 1.0 && (!currentScene?.panX && !currentScene?.panY)
                    ? 'bg-[#23272A] text-white border-[#23272A]'
                    : 'bg-white text-[#37352F] hover:bg-[#F1F1EF] border-[#E3E2DE]'
                }`}
                title="여백이 생기더라도 원본 사진 전체가 온전히 보이도록 맞춤"
              >
                전체 맞춤
              </button>
            </div>
          </div>

          <p className="text-[11px] text-[#9B9A97] mt-1.5 flex items-center gap-1">
            <span>사진을 직접 드래그하여 이동하고, 슬라이더나 두 손가락으로 확대할 수 있습니다.</span>
          </p>

          {/* Controls Bar */}
          <div className="w-full flex items-center justify-between pt-4 mt-2 border-t border-[#EDEDEB]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#23272A] hover:bg-[#37352F] text-white font-medium text-xs transition-colors leading-none cursor-pointer shadow-xs"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 shrink-0" /> : <Play className="w-3.5 h-3.5 shrink-0" />}
                <span className="leading-none">{isPlaying ? '일시정지' : '슬라이드 재생'}</span>
              </button>

              <span className="text-xs text-[#787774] font-mono leading-none">
                {currentSceneIdx + 1} / {project.scenes.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentSceneIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentSceneIdx === 0}
                className="inline-flex items-center justify-center p-2 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] disabled:opacity-40 text-[#37352F] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
              </button>
              <button
                onClick={() => setCurrentSceneIdx((prev) => Math.min(project.scenes.length - 1, prev + 1))}
                disabled={currentSceneIdx === project.scenes.length - 1}
                className="inline-flex items-center justify-center p-2 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] disabled:opacity-40 text-[#37352F] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Pro Editing Studio Tools (lg: 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Pro Tool Tabs (Notion Clean Segmented Control) */}
          <div className="bg-[#F1F1EF] rounded-xl p-1 border border-[#EDEDEB] grid grid-cols-7 gap-1 text-[11px] font-medium">
            <button
              onClick={() => setActiveTool('filter')}
              className={`inline-flex flex-col items-center justify-center gap-1 py-1.5 rounded-lg transition-colors leading-none cursor-pointer ${
                activeTool === 'filter' ? 'bg-white text-[#23272A] font-semibold shadow-xs' : 'text-[#787774] hover:text-[#37352F] hover:bg-[#EAE9E5]/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>필터</span>
            </button>

            <button
              onClick={() => setActiveTool('adjust')}
              className={`inline-flex flex-col items-center justify-center gap-1 py-1.5 rounded-lg transition-colors leading-none cursor-pointer ${
                activeTool === 'adjust' ? 'bg-white text-[#23272A] font-semibold shadow-xs' : 'text-[#787774] hover:text-[#37352F] hover:bg-[#EAE9E5]/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 shrink-0" />
              <span>보정</span>
            </button>

            <button
              onClick={() => setActiveTool('video_edit')}
              className={`inline-flex flex-col items-center justify-center gap-1 py-1.5 rounded-lg transition-colors leading-none cursor-pointer ${
                activeTool === 'video_edit' ? 'bg-white text-[#23272A] font-semibold shadow-xs' : 'text-[#787774] hover:text-[#37352F] hover:bg-[#EAE9E5]/50'
              }`}
            >
              <Scissors className="w-3.5 h-3.5 shrink-0" />
              <span>동영상컷</span>
            </button>

            <button
              onClick={() => setActiveTool('motion')}
              className={`inline-flex flex-col items-center justify-center gap-1 py-1.5 rounded-lg transition-colors leading-none cursor-pointer ${
                activeTool === 'motion' ? 'bg-white text-[#23272A] font-semibold shadow-xs' : 'text-[#787774] hover:text-[#37352F] hover:bg-[#EAE9E5]/50'
              }`}
            >
              <Film className="w-3.5 h-3.5 shrink-0" />
              <span>모션</span>
            </button>

            <button
              onClick={() => setActiveTool('stickers')}
              className={`inline-flex flex-col items-center justify-center gap-1 py-1.5 rounded-lg transition-colors leading-none cursor-pointer ${
                activeTool === 'stickers' ? 'bg-white text-[#23272A] font-semibold shadow-xs' : 'text-[#787774] hover:text-[#37352F] hover:bg-[#EAE9E5]/50'
              }`}
            >
              <Smile className="w-3.5 h-3.5 shrink-0" />
              <span>스티커</span>
            </button>

            <button
              onClick={() => setActiveTool('text')}
              className={`inline-flex flex-col items-center justify-center gap-1 py-1.5 rounded-lg transition-colors leading-none cursor-pointer ${
                activeTool === 'text' ? 'bg-white text-[#23272A] font-semibold shadow-xs' : 'text-[#787774] hover:text-[#37352F] hover:bg-[#EAE9E5]/50'
              }`}
            >
              <Type className="w-3.5 h-3.5 shrink-0" />
              <span>자막</span>
            </button>

            <button
              onClick={() => setActiveTool('bgm')}
              className={`inline-flex flex-col items-center justify-center gap-1 py-1.5 rounded-lg transition-colors leading-none cursor-pointer ${
                activeTool === 'bgm' ? 'bg-white text-[#23272A] font-semibold shadow-xs' : 'text-[#787774] hover:text-[#37352F] hover:bg-[#EAE9E5]/50'
              }`}
            >
              <Music className="w-3.5 h-3.5 shrink-0" />
              <span>BGM</span>
            </button>
          </div>

          {/* TAB 1: Filter Panel */}
          {activeTool === 'filter' && (
            <div className="bg-white rounded-2xl p-5 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#23272A]" />
                  <h3 className="font-semibold text-sm text-[#37352F] leading-none">인기 필터</h3>
                </div>
                <button
                  onClick={handleAutoEnhance}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#37352F] bg-[#F1F1EF] hover:bg-[#EAE9E5] border border-[#E3E2DE] px-2.5 py-1 rounded-md leading-none transition-colors cursor-pointer"
                >
                  <Wand2 className="w-3 h-3 text-[#787774]" />
                  <span>원클릭 감성 보정</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'none', label: '원본 그대로', badge: '기본 선택', desc: '필터 없는 본래 사진 원본' },
                  { id: 'butter_warm', label: '버터 필터', badge: '인스타 대세', desc: '따스하고 몽글몽글한 크리미 옐로우' },
                  { id: 'golden_hour', label: '골든 아워', badge: '노을 감성', desc: '황금빛 햇살이 부드럽게 스며드는 무드' },
                  { id: 'soft_milk', label: '밀크 크림', badge: '맑고 뽀얀', desc: '피부와 공간을 부드럽게 밝혀주는 톤' },
                  { id: 'tokyo_mood', label: '도쿄 필름', badge: '감성 피드', desc: '채도를 뺀 차분하고 서정적인 필름' },
                  { id: 'vintage_film', label: '빈티지 90s', badge: '레트로', desc: '아날로그 필름 카메라 감성' },
                  { id: 'natural_clean', label: '내추럴 클린', badge: '추천', desc: '맑고 왜곡 없는 투명한 톤' },
                  { id: 'vivid_glow', label: '비비드 글로우', badge: '생기 UP', desc: '선명하고 화사하게 빛나는 톤' },
                  { id: 'pure_minimal', label: '퓨어 미니멀', badge: '미니멀', desc: '단정하고 군더더기 없는 화이트' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => updateCurrentScene({ filter: f.id as AestheticFilter })}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer relative ${
                      currentScene?.filter === f.id
                        ? 'bg-[#F7F6F3] border-[#23272A] text-[#23272A] shadow-xs'
                        : 'bg-white border-[#EDEDEB] text-[#37352F] hover:bg-[#FBFBFA]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-semibold text-xs leading-none">{f.label}</span>
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#F1F1EF] text-[#787774] leading-none">
                        {f.badge}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#787774] leading-tight">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Pro Adjustments Panel */}
          {activeTool === 'adjust' && (
            <div className="bg-white rounded-2xl p-5 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#23272A]" />
                  <h3 className="font-semibold text-sm text-[#37352F] leading-none">정밀 색감 보정</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleAutoEnhance}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#37352F] bg-[#F1F1EF] hover:bg-[#EAE9E5] border border-[#E3E2DE] px-2 py-1 rounded-md leading-none cursor-pointer"
                  >
                    <Wand2 className="w-3 h-3 text-[#787774]" />
                    <span>자동 보정</span>
                  </button>
                  <button
                    onClick={handleResetAdjustments}
                    className="text-[11px] font-medium text-[#787774] hover:text-[#37352F] px-2 py-1 leading-none cursor-pointer"
                  >
                    초기화
                  </button>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Brightness */}
                <div>
                  <div className="flex items-center justify-between font-medium text-[#37352F] mb-1">
                    <span>밝기 (Brightness)</span>
                    <span className="font-mono text-[#787774]">{adjustments.brightness > 0 ? `+${adjustments.brightness}` : adjustments.brightness}</span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={adjustments.brightness}
                    onChange={(e) => updateAdjustments('brightness', Number(e.target.value))}
                    className="w-full accent-[#23272A]"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <div className="flex items-center justify-between font-medium text-[#37352F] mb-1">
                    <span>대비 (Contrast)</span>
                    <span className="font-mono text-[#787774]">{adjustments.contrast > 0 ? `+${adjustments.contrast}` : adjustments.contrast}</span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={adjustments.contrast}
                    onChange={(e) => updateAdjustments('contrast', Number(e.target.value))}
                    className="w-full accent-[#23272A]"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex items-center justify-between font-medium text-[#37352F] mb-1">
                    <span>채도 (Saturation)</span>
                    <span className="font-mono text-[#787774]">{adjustments.saturation > 0 ? `+${adjustments.saturation}` : adjustments.saturation}</span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={adjustments.saturation}
                    onChange={(e) => updateAdjustments('saturation', Number(e.target.value))}
                    className="w-full accent-[#23272A]"
                  />
                </div>

                {/* Warmth (Color Temp) */}
                <div>
                  <div className="flex items-center justify-between font-medium text-[#37352F] mb-1">
                    <span>색온도 (Warmth)</span>
                    <span className="font-mono text-[#787774]">{adjustments.warmth > 0 ? `+${adjustments.warmth}` : adjustments.warmth}</span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={adjustments.warmth}
                    onChange={(e) => updateAdjustments('warmth', Number(e.target.value))}
                    className="w-full accent-[#23272A]"
                  />
                </div>

                {/* Vignette */}
                <div>
                  <div className="flex items-center justify-between font-medium text-[#37352F] mb-1">
                    <span>비네팅 (Vignette)</span>
                    <span className="font-mono text-[#787774]">+{adjustments.vignette}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={adjustments.vignette}
                    onChange={(e) => updateAdjustments('vignette', Number(e.target.value))}
                    className="w-full accent-[#23272A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: Video Editing */}
          {activeTool === 'video_edit' && (
            <div className="bg-white rounded-2xl p-5 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#23272A]" />
                  <h3 className="font-semibold text-sm text-[#37352F] leading-none">동영상 편집</h3>
                </div>
                <span className="text-[10px] font-medium text-[#787774] bg-[#F1F1EF] border border-[#EDEDEB] px-2 py-0.5 rounded-md leading-none">
                  {currentScene?.mediaType === 'video' ? '비디오 클립' : '사진 클립'}
                </span>
              </div>

              {/* Dedicated Studio Full Launch Banner */}
              <button
                onClick={() => setIsCapCutModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#23272A] hover:bg-[#37352F] text-white font-medium text-xs flex items-center justify-between cursor-pointer transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                    <Scissors className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-xs leading-none">동영상 컷편집기로 열기</div>
                    <div className="text-[10px] text-neutral-400 mt-1 leading-none">재생바 위치에서 즉시 컷분할 & 타임라인 정밀 편집</div>
                  </div>
                </div>
                <span className="text-[10px] bg-white/20 text-white px-2 py-1 rounded-md">
                  실행 →
                </span>
              </button>

              {/* Quick Cut & Split Toolbar */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleSplitClip}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer leading-none"
                  title="현재 클립을 반으로 분할합니다"
                >
                  <Scissors className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>클립 분할</span>
                </button>

                <button
                  onClick={handleDuplicateClip}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer leading-none"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>클립 복제</span>
                </button>

                <button
                  onClick={handleRotateClip}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer leading-none"
                >
                  <RotateCw className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>90° 회전</span>
                </button>
              </div>

              {/* 1. Speed Control (배속) */}
              <div className="p-3.5 bg-[#F7F6F3] rounded-xl border border-[#EDEDEB] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-xs text-[#37352F] inline-flex items-center gap-1.5 leading-none">
                    <FastForward className="w-3.5 h-3.5 text-[#787774] shrink-0" />
                    <span>클립 재생 속도 (Speed)</span>
                  </label>
                  <span className="text-xs font-mono font-semibold text-[#37352F] leading-none">
                    {currentScene?.speed || 1.0}x
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 text-xs font-medium">
                  {[
                    { label: '0.5x', val: 0.5 },
                    { label: '0.75x', val: 0.75 },
                    { label: '1.0x', val: 1.0 },
                    { label: '1.5x', val: 1.5 },
                    { label: '2.0x', val: 2.0 },
                  ].map((spd) => (
                    <button
                      key={spd.val}
                      onClick={() => updateCurrentScene({ speed: spd.val })}
                      className={`py-1.5 rounded-lg border text-center transition-colors leading-none cursor-pointer truncate ${
                        (currentScene?.speed || 1.0) === spd.val
                          ? 'bg-[#23272A] border-[#23272A] text-white font-semibold'
                          : 'bg-white border-[#EDEDEB] text-[#37352F] hover:bg-[#F1F1EF]'
                      }`}
                    >
                      {spd.val}x
                    </button>
                  ))}
                </div>

                <input
                  type="range"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={currentScene?.speed || 1.0}
                  onChange={(e) => updateCurrentScene({ speed: Number(e.target.value) })}
                  className="w-full accent-[#23272A]"
                />
              </div>

              {/* 2. Clip Trimming (구간 자르기) */}
              <div className="p-3.5 bg-[#F7F6F3] rounded-xl border border-[#EDEDEB] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-xs text-[#37352F] inline-flex items-center gap-1.5 leading-none">
                    <Clock className="w-3.5 h-3.5 text-[#787774] shrink-0" />
                    <span>클립 지속 시간 및 트리밍</span>
                  </label>
                  <span className="text-xs font-mono font-semibold text-[#37352F] leading-none">
                    {currentScene?.durationSec || 4}초
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#787774] w-12 leading-none">재생 길이</span>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    step={0.5}
                    value={currentScene?.durationSec || 4}
                    onChange={(e) => updateCurrentScene({ durationSec: Number(e.target.value) })}
                    className="w-full accent-[#23272A]"
                  />
                  <span className="text-xs font-mono font-medium text-[#37352F] w-10 text-right">
                    {currentScene?.durationSec || 4}s
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-[#EDEDEB]">
                    <span className="text-[#787774] block">시작 트리밍: {currentScene?.trimStart || 0}s</span>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(0, (currentScene?.durationSec || 4) - 1)}
                      step={0.5}
                      value={currentScene?.trimStart || 0}
                      onChange={(e) => updateCurrentScene({ trimStart: Number(e.target.value) })}
                      className="w-full accent-[#23272A] mt-1"
                    />
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#EDEDEB]">
                    <span className="text-[#787774] block">종료 트리밍: {currentScene?.trimEnd || currentScene?.durationSec || 4}s</span>
                    <input
                      type="range"
                      min={Math.max(1, (currentScene?.trimStart || 0) + 1)}
                      max={currentScene?.durationSec || 4}
                      step={0.5}
                      value={currentScene?.trimEnd || currentScene?.durationSec || 4}
                      onChange={(e) => updateCurrentScene({ trimEnd: Number(e.target.value) })}
                      className="w-full accent-[#23272A] mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Transitions between Clips (전환 효과) */}
              <div className="p-3.5 bg-[#F7F6F3] rounded-xl border border-[#EDEDEB] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-xs text-[#37352F] inline-flex items-center gap-1.5 leading-none">
                    <Sparkles className="w-3.5 h-3.5 text-[#787774] shrink-0" />
                    <span>클립 전환 효과 (Transitions)</span>
                  </label>
                  <span className="text-[10px] text-[#787774]">다음 클립과 연결</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
                  {[
                    { id: 'none', label: '없음 (컷)', emoji: '✂️' },
                    { id: 'fade', label: '페이드', emoji: '🌫️' },
                    { id: 'dissolve', label: '디졸브', emoji: '✨' },
                    { id: 'zoom', label: '줌인', emoji: '🔍' },
                    { id: 'slide_left', label: '슬라이드', emoji: '➡️' },
                    { id: 'flash', label: '플래시', emoji: '⚡' },
                  ].map((tr) => (
                    <button
                      key={tr.id}
                      onClick={() => updateCurrentScene({ transition: tr.id as TransitionEffect })}
                      className={`inline-flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg border transition-colors leading-none cursor-pointer ${
                        (currentScene?.transition || 'none') === tr.id
                          ? 'bg-[#23272A] border-[#23272A] text-white font-semibold'
                          : 'bg-white border-[#EDEDEB] text-[#37352F] hover:bg-[#F1F1EF]'
                      }`}
                    >
                      <span className="leading-none text-xs">{tr.emoji}</span>
                      <span className="leading-none truncate">{tr.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Video Audio Mute & Volume */}
              {currentScene?.mediaType === 'video' && (
                <div className="p-3.5 bg-[#F7F6F3] rounded-xl border border-[#EDEDEB] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-xs text-[#37352F] inline-flex items-center gap-1.5 leading-none">
                      {currentScene?.isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#787774]" /> : <Volume2 className="w-3.5 h-3.5 text-[#37352F]" />}
                      <span>비디오 원본 오디오</span>
                    </label>
                    <button
                      onClick={() => updateCurrentScene({ isMuted: !currentScene?.isMuted })}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-md transition-colors cursor-pointer border ${
                        currentScene?.isMuted ? 'bg-[#F1F1EF] text-[#787774] border-[#E3E2DE]' : 'bg-[#23272A] text-white border-[#23272A]'
                      }`}
                    >
                      {currentScene?.isMuted ? '음소거 됨' : '소리 켜짐'}
                    </button>
                  </div>

                  {!currentScene?.isMuted && (
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#787774] w-12 leading-none">볼륨</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={currentScene?.volume ?? 100}
                        onChange={(e) => updateCurrentScene({ volume: Number(e.target.value) })}
                        className="w-full accent-[#23272A]"
                      />
                      <span className="text-xs font-mono font-medium text-[#37352F] w-8 leading-none">
                        {currentScene?.volume ?? 100}%
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Motion & Animation (Ken Burns) */}
          {activeTool === 'motion' && (
            <div className="bg-white rounded-2xl p-5 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#23272A]" />
                <h3 className="font-semibold text-sm text-[#37352F] leading-none">카메라 무빙 & 모션 효과</h3>
              </div>
              <p className="text-xs text-[#787774]">
                사진을 동영상처럼 천천히 움직이게 하여 시청 지속 시간을 끌어올립니다.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'static', label: '고정 (Static)', desc: '움직임 없이 안정된 컷' },
                  { id: 'zoom_in', label: '서서히 줌인 (Zoom In)', desc: '주목도 높은 서서히 다가가기' },
                  { id: 'zoom_out', label: '서서히 줌아웃 (Zoom Out)', desc: '공간 전체가 드러나는 무빙' },
                  { id: 'pan_left', label: '좌측 패닝 (Pan Left)', desc: '왼쪽으로 흐르듯 이동' },
                  { id: 'pan_right', label: '우측 패닝 (Pan Right)', desc: '오른쪽으로 흐르듯 이동' },
                  { id: 'fade', label: '소프트 페이드 (Fade)', desc: '부드러운 빛 번짐' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => updateCurrentScene({ motionEffect: m.id as MotionEffect })}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      currentMotion === m.id
                        ? 'bg-[#F7F6F3] border-[#23272A] text-[#23272A] shadow-xs'
                        : 'bg-white border-[#EDEDEB] text-[#37352F] hover:bg-[#FBFBFA]'
                    }`}
                  >
                    <div className="font-semibold text-xs leading-none mb-1">{m.label}</div>
                    <div className="text-[10px] text-[#787774] leading-tight">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Stickers */}
          {activeTool === 'stickers' && (
            <div className="bg-white rounded-2xl p-5 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#23272A]" />
                  <h3 className="font-semibold text-sm text-[#37352F] leading-none">스티커 라이브러리</h3>
                </div>
                <span className="text-[10px] font-medium text-[#787774] bg-[#F1F1EF] border border-[#EDEDEB] px-2 py-0.5 rounded-md leading-none">
                  화면에서 드래그 이동 가능
                </span>
              </div>

              {/* Selected Sticker Controls Bar */}
              {selectedSticker && (
                <div className="p-3 rounded-xl bg-[#F7F6F3] border border-[#EDEDEB] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#37352F]">
                      선택된 스티커 [{selectedSticker.icon || selectedSticker.text}]
                    </span>
                    <button
                      onClick={() => handleRemoveSticker(selectedSticker.id)}
                      className="text-red-600 hover:text-red-700 text-xs font-medium leading-none cursor-pointer"
                    >
                      스티커 삭제
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-[#787774]">크기 조절</span>
                      <input
                        type="range"
                        min={30}
                        max={120}
                        value={selectedSticker.size}
                        onChange={(e) => updateSelectedSticker({ size: Number(e.target.value) })}
                        className="w-full accent-[#23272A] mt-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#787774]">회전 각도</span>
                      <input
                        type="range"
                        min={-45}
                        max={45}
                        value={selectedSticker.rotation || 0}
                        onChange={(e) => updateSelectedSticker({ rotation: Number(e.target.value) })}
                        className="w-full accent-[#23272A] mt-0.5"
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Sticker Category Sub-tabs */}
              <div className="grid grid-cols-4 gap-1 bg-[#F1F1EF] p-1 rounded-xl text-[11px] font-medium border border-[#EDEDEB]">
                {CUTE_STICKER_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveStickerCategory(cat.id)}
                    className={`inline-flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg transition-colors leading-none cursor-pointer truncate ${
                      activeStickerCategory === cat.id
                        ? 'bg-white text-[#23272A] shadow-xs font-semibold'
                        : 'text-[#787774] hover:text-[#37352F]'
                    }`}
                  >
                    <span className="leading-none text-xs">{cat.icon}</span>
                    <span className="leading-none truncate">{cat.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Category Items View */}
              {(() => {
                const currentCat = CUTE_STICKER_CATEGORIES.find((c) => c.id === activeStickerCategory) || CUTE_STICKER_CATEGORIES[0];
                
                if (currentCat.id === 'face_mask') {
                  return (
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {currentCat.items.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAddKidsSticker(item as any)}
                            className="p-2.5 rounded-xl bg-white hover:bg-[#F1F1EF] border border-[#EDEDEB] text-2xl flex flex-col items-center justify-center transition-colors cursor-pointer leading-none"
                            title={item.label}
                          >
                            <span className="leading-none">{item.icon}</span>
                            <span className="text-[10px] text-[#787774] font-medium mt-1 leading-none">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (currentCat.id === 'deco') {
                  return (
                    <div className="grid grid-cols-4 gap-2">
                      {currentCat.items.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAddKidsSticker(item as any)}
                          className="p-2.5 rounded-xl bg-white hover:bg-[#F1F1EF] border border-[#EDEDEB] flex flex-col items-center justify-center transition-colors cursor-pointer leading-none"
                          title={item.label}
                        >
                          <span className="text-2xl leading-none">{item.icon}</span>
                          <span className="text-[10px] text-[#37352F] font-medium mt-1 leading-none truncate max-w-full">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  );
                }

                return (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentCat.items.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAddKidsSticker(item as any)}
                          className="inline-flex items-center gap-2 p-2.5 rounded-lg bg-white hover:bg-[#F1F1EF] border border-[#EDEDEB] text-left transition-colors cursor-pointer text-xs leading-none"
                        >
                          <span className="text-base leading-none shrink-0">{item.icon}</span>
                          <span className="text-[#37352F] font-medium truncate leading-none">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 5: Typography & Subtitles */}
          {activeTool === 'text' && (
            <div className="bg-white rounded-2xl p-5 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#23272A]" />
                  <h3 className="font-semibold text-sm text-[#37352F] leading-none">자막 설정</h3>
                </div>
                <button
                  onClick={() => handleAddSubtitle('새로운 자막')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#23272A] hover:bg-[#37352F] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer leading-none"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ 새 자막 추가</span>
                </button>
              </div>

              {/* Subtitles Reel / Chips */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[#787774] flex items-center justify-between">
                  <span>자막 목록 ({activeSubtitles.length}개)</span>
                  <span className="text-[#9B9A97] text-[10px]">화면에서 마우스로 드래그 이동</span>
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {activeSubtitles.map((sub, idx) => {
                    const isSelected = (selectedSubtitleId || activeSubtitles[0]?.id) === sub.id;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedSubtitleId(sub.id)}
                        className={`inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer shrink-0 leading-none ${
                          isSelected
                            ? 'bg-[#23272A] border-[#23272A] text-white shadow-xs'
                            : 'bg-white border-[#EDEDEB] text-[#37352F] hover:bg-[#F1F1EF]'
                        }`}
                      >
                        <span className="text-[10px] text-neutral-400 font-mono">#{idx + 1}</span>
                        <span className="truncate max-w-[110px] leading-none">{sub.text || '빈 자막'}</span>
                        <button
                          onClick={(e) => handleDuplicateSubtitle(sub, e)}
                          title="자막 복제"
                          className="hover:text-white text-neutral-400 p-0.5 ml-0.5 cursor-pointer"
                        >
                          <Copy className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteSubtitle(sub.id, e)}
                          title="자막 삭제"
                          className="hover:text-red-400 text-neutral-400 p-0.5 cursor-pointer ml-0.5"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notice Banner */}
              <div className="p-2.5 rounded-xl bg-[#F7F6F3] border border-[#EDEDEB] flex items-center gap-2 text-[#787774] text-[11px] leading-tight">
                <Move className="w-3.5 h-3.5 text-[#37352F] shrink-0" />
                <span>미리보기 화면에서 자막을 마우스로 직접 드래그하여 이동할 수 있습니다.</span>
              </div>

              {selectedSubtitle && (
                <>
                  {/* Text Input for selected subtitle */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-medium text-xs text-[#37352F] block">
                        자막 내용 수정
                      </label>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSubtitle(selectedSubtitle.id, e)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-0.5 rounded-md transition-colors cursor-pointer border border-red-200"
                        title="현재 자막을 삭제합니다"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                        <span>자막 삭제</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={selectedSubtitle.text}
                      onChange={(e) => updateSubtitle(selectedSubtitle.id, { text: e.target.value })}
                      placeholder="자막 내용을 입력하세요"
                      className="w-full px-3.5 py-2 rounded-lg border border-[#EDEDEB] focus:outline-none focus:border-[#23272A] font-medium text-[#37352F] text-xs"
                    />
                  </div>

                  {/* SECTION 1: Subtitle Position & Alignment */}
                  <div className="p-3.5 bg-[#F7F6F3] rounded-xl border border-[#EDEDEB] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-xs text-[#37352F] leading-none">자막 위치 & 정렬</label>
                      <span className="text-[11px] font-mono text-[#787774] leading-none">
                        X: {Math.round(selectedSubtitle.x)}% · Y: {Math.round(selectedSubtitle.y)}%
                      </span>
                    </div>

                    {/* Position Presets */}
                    <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
                      {[
                        { label: '상단 (18%)', y: 18 },
                        { label: '중앙 (50%)', y: 50 },
                        { label: '하단 (82%)', y: 82 },
                      ].map((pos) => (
                        <button
                          key={pos.y}
                          onClick={() => updateSubtitle(selectedSubtitle.id, { y: pos.y, x: 50 })}
                          className={`py-1.5 rounded-lg border text-center transition-colors leading-none cursor-pointer ${
                            Math.abs(selectedSubtitle.y - pos.y) < 5
                              ? 'bg-[#23272A] border-[#23272A] text-white font-semibold shadow-xs'
                              : 'bg-white border-[#EDEDEB] text-[#37352F] hover:bg-[#F1F1EF]'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>

                    {/* X & Y Micro Sliders */}
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <div className="flex justify-between text-[#787774] mb-1">
                          <span>가로 위치 (X)</span>
                          <span className="font-mono">{Math.round(selectedSubtitle.x)}%</span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={90}
                          value={selectedSubtitle.x}
                          onChange={(e) => updateSubtitle(selectedSubtitle.id, { x: Number(e.target.value) })}
                          className="w-full accent-[#23272A]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[#787774] mb-1">
                          <span>세로 위치 (Y)</span>
                          <span className="font-mono">{Math.round(selectedSubtitle.y)}%</span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={90}
                          value={selectedSubtitle.y}
                          onChange={(e) => updateSubtitle(selectedSubtitle.id, { y: Number(e.target.value) })}
                          className="w-full accent-[#23272A]"
                        />
                      </div>
                    </div>

                    {/* Text Align buttons */}
                    <div>
                      <span className="text-[11px] font-medium text-[#787774] block mb-1.5">텍스트 정렬</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'left', label: '왼쪽', icon: AlignLeft },
                          { id: 'center', label: '가운데', icon: AlignCenter },
                          { id: 'right', label: '오른쪽', icon: AlignRight },
                        ].map((align) => {
                          const Icon = align.icon;
                          return (
                            <button
                              key={align.id}
                              onClick={() => updateSubtitle(selectedSubtitle.id, { textAlign: align.id as any })}
                              className={`inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-xs font-medium transition-colors leading-none cursor-pointer ${
                                (selectedSubtitle.textAlign || 'center') === align.id
                                  ? 'bg-[#23272A] border-[#23272A] text-white font-semibold shadow-xs'
                                  : 'bg-white border-[#EDEDEB] text-[#37352F] hover:bg-[#F1F1EF]'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span>{align.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Subtitle Rotation */}
                    <div className="pt-2 border-t border-[#EDEDEB]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-medium text-[#37352F] flex items-center gap-1">
                          <RotateCw className="w-3 h-3 text-[#787774]" />
                          <span>자막 회전 각도</span>
                        </span>
                        <span className="text-[11px] font-mono font-medium text-[#787774]">
                          {selectedSubtitle.rotation || 0}°
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1 text-[11px] font-medium mb-2">
                        {[
                          { label: '0° 수평', deg: 0 },
                          { label: '-12°', deg: -12 },
                          { label: '+12°', deg: 12 },
                          { label: '-90°', deg: -90 },
                          { label: '+90°', deg: 90 },
                        ].map((rot) => (
                          <button
                            key={rot.deg}
                            onClick={() => updateSubtitle(selectedSubtitle.id, { rotation: rot.deg })}
                            className={`py-1 rounded-md border text-center transition-colors cursor-pointer ${
                              (selectedSubtitle.rotation || 0) === rot.deg
                                ? 'bg-[#23272A] border-[#23272A] text-white font-semibold'
                                : 'bg-white border-[#EDEDEB] text-[#37352F] hover:bg-[#F1F1EF]'
                            }`}
                          >
                            {rot.label}
                          </button>
                        ))}
                      </div>

                      <input
                        type="range"
                        min={-180}
                        max={180}
                        step={1}
                        value={selectedSubtitle.rotation || 0}
                        onChange={(e) => updateSubtitle(selectedSubtitle.id, { rotation: Number(e.target.value) })}
                        className="w-full accent-[#23272A]"
                      />
                    </div>
                  </div>

                  {/* SECTION 2: Subtitle Size */}
                  <div className="p-3.5 bg-[#F7F6F3] rounded-xl border border-[#EDEDEB] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-xs text-[#37352F] leading-none">자막 크기 배율</label>
                      <span className="text-[11px] font-mono font-medium text-[#787774] leading-none">
                        {(selectedSubtitle.fontSizeScale || 1.0).toFixed(2)}x
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-xs font-medium">
                      {[
                        { label: '작게', val: 0.85 },
                        { label: '보통', val: 1.0 },
                        { label: '크게', val: 1.2 },
                        { label: '특대', val: 1.4 },
                      ].map((sz) => (
                        <button
                          key={sz.val}
                          onClick={() => updateSubtitle(selectedSubtitle.id, { fontSizeScale: sz.val })}
                          className={`py-1.5 rounded-lg border text-center transition-colors leading-none cursor-pointer ${
                            Math.abs((selectedSubtitle.fontSizeScale || 1.0) - sz.val) < 0.05
                              ? 'bg-[#23272A] border-[#23272A] text-white font-semibold shadow-xs'
                              : 'bg-white border-[#EDEDEB] text-[#37352F] hover:bg-[#F1F1EF]'
                          }`}
                        >
                          {sz.label} ({sz.val}x)
                        </button>
                      ))}
                    </div>

                    <input
                      type="range"
                      min={0.8}
                      max={1.6}
                      step={0.05}
                      value={selectedSubtitle.fontSizeScale || 1.0}
                      onChange={(e) => updateSubtitle(selectedSubtitle.id, { fontSizeScale: Number(e.target.value) })}
                      className="w-full accent-[#23272A]"
                    />
                  </div>

                  {/* SECTION 3: Background Box Style & Opacity Control */}
                  <div className="p-3.5 bg-[#F7F6F3] rounded-xl border border-[#EDEDEB] space-y-3">
                    {(() => {
                      const currentOpacity = selectedSubtitle.boxStyle === 'none' && (selectedSubtitle.bgOpacity ?? 0) === 0 ? 0 : (selectedSubtitle.bgOpacity ?? 75);

                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <label className="font-medium text-xs text-[#37352F] leading-none">자막 배경 스타일 & 투명도</label>
                            <span className="text-[11px] font-mono text-[#787774] leading-none">
                              투명도: {currentOpacity}%
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-1.5 text-xs font-medium">
                            {[
                              { id: 'dark', label: '다크 블러' },
                              { id: 'glass', label: '소프트 글래스' },
                              { id: 'cream', label: '크림 옐로우' },
                              { id: 'none', label: '투명 (없음)' },
                            ].map((box) => (
                              <button
                                key={box.id}
                                onClick={() =>
                                  updateSubtitle(selectedSubtitle.id, {
                                    boxStyle: box.id as any,
                                    ...(box.id === 'cream' ? { bgColor: '#FEF3C7', textColor: '#0F172A', bgOpacity: 90 } : {}),
                                    ...(box.id === 'glass' ? { bgColor: '#FFFFFF', textColor: '#0F172A', bgOpacity: 40 } : {}),
                                    ...(box.id === 'dark' ? { bgColor: '#0F172A', textColor: '#FFFFFF', bgOpacity: 75 } : {}),
                                    ...(box.id === 'none' ? { bgOpacity: 0 } : {}),
                                  })
                                }
                                className={`py-1.5 rounded-lg border text-center transition-colors leading-none cursor-pointer ${
                                  selectedSubtitle.boxStyle === box.id
                                    ? 'bg-[#23272A] border-[#23272A] text-white font-semibold shadow-xs'
                                    : 'bg-white border-[#EDEDEB] text-[#37352F] hover:bg-[#F1F1EF]'
                                }`}
                              >
                                {box.label}
                              </button>
                            ))}
                          </div>

                          {selectedSubtitle.boxStyle !== 'none' && (
                            <div>
                              <span className="text-[11px] font-medium text-[#787774] block mb-1.5">배경 컬러 팔레트</span>
                              <div className="flex items-center gap-2 flex-wrap">
                                {[
                                  { hex: '#0F172A', label: '다크 차콜' },
                                  { hex: '#FFFFFF', label: '화이트' },
                                  { hex: '#FEF3C7', label: '버터 크림' },
                                  { hex: '#F1F1EF', label: '라이트 그레이' },
                                  { hex: '#ECFDF5', label: '세이지 민트' },
                                  { hex: '#E0E7FF', label: '소프트 블루' },
                                  { hex: '#0284C7', label: '스카이 블루' },
                                  { hex: '#D97706', label: '웜 앰버' },
                                ].map((c) => (
                                  <button
                                    key={c.hex}
                                    onClick={() => updateSubtitle(selectedSubtitle.id, { bgColor: c.hex, boxStyle: 'custom' })}
                                    style={{ backgroundColor: c.hex }}
                                    title={c.label}
                                    className={`w-6 h-6 rounded-full border transition-transform hover:scale-105 cursor-pointer ${
                                      selectedSubtitle.bgColor === c.hex
                                        ? 'border-[#23272A] ring-2 ring-[#23272A]/30 scale-105'
                                        : 'border-[#EDEDEB]'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 모든 자막 상자 투명도 조절 슬라이더 및 원클릭 프리셋 */}
                          <div className="pt-2 border-t border-[#EDEDEB]/80 space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-[#787774]">
                              <span className="font-medium text-[#37352F]">자막 상자 불투명도 조절</span>
                              <span className="font-mono font-semibold text-[#23272A]">
                                {currentOpacity === 0 ? '0% (완전 투명)' : `${currentOpacity}%`}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              step={5}
                              value={currentOpacity}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val === 0) {
                                  updateSubtitle(selectedSubtitle.id, { bgOpacity: 0, boxStyle: 'none' });
                                } else {
                                  updateSubtitle(selectedSubtitle.id, {
                                    bgOpacity: val,
                                    boxStyle: selectedSubtitle.boxStyle === 'none' ? 'dark' : selectedSubtitle.boxStyle,
                                    bgColor: selectedSubtitle.boxStyle === 'none' && !selectedSubtitle.bgColor ? '#0F172A' : selectedSubtitle.bgColor,
                                  });
                                }
                              }}
                              className="w-full accent-[#23272A]"
                            />
                            <div className="flex items-center gap-1.5">
                              {[
                                { val: 0, label: '0%' },
                                { val: 25, label: '25%' },
                                { val: 50, label: '50%' },
                                { val: 75, label: '75%' },
                                { val: 90, label: '90%' },
                                { val: 100, label: '100%' },
                              ].map((p) => {
                                const isActive = currentOpacity === p.val;
                                return (
                                  <button
                                    key={p.val}
                                    type="button"
                                    onClick={() => {
                                      if (p.val === 0) {
                                        updateSubtitle(selectedSubtitle.id, { bgOpacity: 0, boxStyle: 'none' });
                                      } else {
                                        updateSubtitle(selectedSubtitle.id, {
                                          bgOpacity: p.val,
                                          boxStyle: selectedSubtitle.boxStyle === 'none' ? 'dark' : selectedSubtitle.boxStyle,
                                          bgColor: selectedSubtitle.boxStyle === 'none' && !selectedSubtitle.bgColor ? '#0F172A' : selectedSubtitle.bgColor,
                                        });
                                      }
                                    }}
                                    className={`flex-1 py-1 rounded text-[10px] font-mono border transition-colors cursor-pointer leading-none text-center ${
                                      isActive
                                        ? 'bg-[#23272A] text-white border-[#23272A] font-semibold'
                                        : 'bg-white text-[#787774] border-[#EDEDEB] hover:bg-[#F1F1EF]'
                                    }`}
                                  >
                                    {p.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* SECTION 4: Text Font & Color */}
                  <div className="p-3.5 bg-[#F7F6F3] rounded-xl border border-[#EDEDEB] space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-medium text-xs text-[#37352F] leading-none">글자 색상</label>
                        <span className="text-[11px] font-mono text-[#787774]">{selectedSubtitle.textColor || '#FFFFFF'}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {[
                          { hex: '#FFFFFF', label: '순백색' },
                          { hex: '#0F172A', label: '딥 차콜' },
                          { hex: '#37352F', label: '소프트 블랙' },
                          { hex: '#787774', label: '미디엄 그레이' },
                          { hex: '#D97706', label: '웜 앰버' },
                          { hex: '#0284C7', label: '스카이 블루' },
                        ].map((c) => (
                          <button
                            key={c.hex}
                            onClick={() => updateSubtitle(selectedSubtitle.id, { textColor: c.hex })}
                            style={{ backgroundColor: c.hex }}
                            title={c.label}
                            className={`w-6 h-6 rounded-full border transition-transform hover:scale-105 cursor-pointer ${
                              (selectedSubtitle.textColor || '#FFFFFF') === c.hex
                                ? 'border-[#23272A] ring-2 ring-[#23272A]/30 scale-105'
                                : 'border-[#EDEDEB]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-medium text-xs text-[#37352F] block mb-1.5">자막 폰트</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'Pretendard', label: '프리텐다드' },
                          { id: 'Gowun Dodum', label: '고운돋움' },
                          { id: 'Jua', label: '주아체' },
                          { id: 'Song Myung', label: '송명체' },
                          { id: 'Black Han Sans', label: '블랙한스' },
                        ].map((font) => (
                          <button
                            key={font.id}
                            onClick={() => updateSubtitle(selectedSubtitle.id, { fontFamily: font.id as SubtitleFont })}
                            style={{ fontFamily: font.id }}
                            className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-colors truncate leading-none cursor-pointer ${
                              (selectedSubtitle.fontFamily || currentFont) === font.id
                                ? 'bg-[#23272A] border-[#23272A] text-white font-semibold'
                                : 'bg-white border-[#EDEDEB] text-[#37352F] hover:bg-[#F1F1EF]'
                            }`}
                          >
                            {font.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Quick CTA Suggestions */}
              <div className="bg-[#F7F6F3] p-3.5 rounded-xl border border-[#EDEDEB] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-xs text-[#37352F] inline-flex items-center gap-1.5 leading-none">
                    <MessageCircle className="w-3.5 h-3.5 text-[#787774] shrink-0" />
                    <span className="leading-none">댓글 유도 문구 (CTA 추가)</span>
                  </label>
                  <span className="text-[10px] text-[#787774]">소통 촉진</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    '궁금하신 점은 댓글 남겨주세요 🤍',
                    '소품/가구 정보는 댓글로 알려드릴게요!',
                    '오늘 영상 어떠셨나요? 댓글로 소통해요',
                    '아이 착장 정보는 댓글로 남겨둘게요'
                  ].map((ctaText, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddSubtitle(`💬 ${ctaText}`)}
                      className="text-[11px] bg-white border border-[#EDEDEB] text-[#37352F] px-2.5 py-1.5 rounded-lg hover:bg-[#F1F1EF] transition-colors cursor-pointer leading-none font-medium"
                    >
                      + {ctaText}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Slider */}
              <div>
                <label className="font-medium text-[#37352F] block mb-1">슬라이드 지속 시간 (초)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={2}
                    max={12}
                    step={1}
                    value={currentScene?.durationSec || 4}
                    onChange={(e) => updateCurrentScene({ durationSec: Number(e.target.value) })}
                    className="w-full accent-[#23272A]"
                  />
                  <span className="font-mono text-xs text-[#787774] w-8 leading-none">{currentScene?.durationSec || 4}초</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Bgm & Audio */}
          {activeTool === 'bgm' && (
            <div className="bg-white rounded-2xl p-5 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#23272A]" />
                  <h3 className="font-semibold text-sm text-[#37352F] leading-none">BGM 라이브러리 ({POPULAR_BGM_PRESETS.length}곡)</h3>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#787774] bg-[#F1F1EF] border border-[#EDEDEB] px-2 py-0.5 rounded-md leading-none">
                  <ShieldCheck className="w-3 h-3 text-[#37352F]" />
                  <span>저작권 안심</span>
                </span>
              </div>

              {/* Master Volume Slider */}
              <div className="p-3 bg-[#F7F6F3] rounded-xl border border-[#EDEDEB] flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-[#787774] shrink-0" />
                <span className="text-xs font-medium text-[#37352F] w-16 leading-none">BGM 볼륨</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={project.bgmVolume ?? 70}
                  onChange={(e) => setProject((prev) => ({ ...prev, bgmVolume: Number(e.target.value) }))}
                  className="w-full accent-[#23272A]"
                />
                <span className="text-xs font-mono font-medium text-[#787774] w-10 text-right leading-none">
                  {project.bgmVolume ?? 70}%
                </span>
              </div>

              {/* BGM Category Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs font-medium">
                {BGM_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedBgmCategory(cat.id)}
                    className={`inline-flex items-center gap-1 py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer shrink-0 leading-none ${
                      selectedBgmCategory === cat.id
                        ? 'bg-[#23272A] text-white font-semibold'
                        : 'bg-[#F1F1EF] text-[#787774] hover:bg-[#EAE9E5]'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* BGM List */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {POPULAR_BGM_PRESETS.filter((bgm) =>
                  selectedBgmCategory === 'all' ? true : bgm.category === selectedBgmCategory
                ).map((bgm) => {
                  const isSelected = project.selectedBgmId === bgm.id;
                  const isPreviewing = playingBgmId === bgm.id;

                  return (
                    <div
                      key={bgm.id}
                      onClick={() => setProject((prev) => ({ ...prev, selectedBgmId: bgm.id }))}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#F7F6F3] border-[#23272A] shadow-xs'
                          : 'bg-white border-[#EDEDEB] hover:bg-[#FBFBFA]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl shrink-0 leading-none">{bgm.emoji}</span>
                        <div>
                          <div className="font-semibold text-xs text-[#37352F] leading-tight flex items-center gap-1.5">
                            <span>{bgm.title}</span>
                            {isPreviewing && (
                              <span className="inline-flex gap-0.5 items-end h-3">
                                <span className="w-0.5 h-3 bg-[#23272A] animate-pulse rounded-full" />
                                <span className="w-0.5 h-2 bg-[#23272A] animate-pulse rounded-full delay-75" />
                                <span className="w-0.5 h-3.5 bg-[#23272A] animate-pulse rounded-full delay-150" />
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#787774] mt-1 leading-none flex items-center gap-2">
                            <span>{bgm.artist}</span>
                            <span>·</span>
                            <span>{bgm.moodTag}</span>
                            <span>·</span>
                            <span className="font-mono">{bgm.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Audio Preview Button */}
                        <button
                          onClick={(e) => handleTogglePlayBgm(bgm, e)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer leading-none ${
                            isPreviewing
                              ? 'bg-[#23272A] text-white shadow-xs'
                              : 'bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F]'
                          }`}
                          title="미리듣기"
                        >
                          {isPreviewing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          <span>{isPreviewing ? '정지' : '미리듣기'}</span>
                        </button>

                        {isSelected ? (
                          <span className="text-xs font-semibold text-[#23272A] bg-[#EAE9E5] px-2.5 py-1 rounded-lg">
                            적용됨 ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => setProject((prev) => ({ ...prev, selectedBgmId: bgm.id }))}
                            className="text-[11px] font-medium text-[#787774] bg-[#F1F1EF] hover:bg-[#EAE9E5] px-2 py-1 rounded-lg border border-[#E3E2DE]"
                          >
                            선택
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Visual Multi-Track Timeline */}
      <div className="bg-[#191919] text-white rounded-2xl p-4 sm:p-5 border border-[#2F3437] shadow-xl space-y-4">
        {/* Timeline Header with Timecode & Quick Action Tools */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2F3437] pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-lg bg-white hover:bg-neutral-200 text-black flex items-center justify-center cursor-pointer shadow-sm transition-colors"
              title={isPlaying ? '일시정지' : '전체 재생'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={() => setCurrentSceneIdx(0)}
              className="inline-flex items-center justify-center p-2 rounded-lg bg-[#23272A] hover:bg-[#2F3437] text-neutral-300 font-medium transition-colors cursor-pointer border border-[#3F4448]"
              title="처음으로 되감기"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-baseline gap-1.5 font-mono text-xs">
              <span className="text-white font-semibold text-sm">
                00:{String(project.scenes.slice(0, currentSceneIdx).reduce((acc, s) => acc + (s.durationSec || 4), 0)).padStart(2, '0')}.0
              </span>
              <span className="text-neutral-500">/</span>
              <span className="text-neutral-400">
                00:{String(project.scenes.reduce((acc, s) => acc + (s.durationSec || 4), 0)).padStart(2, '0')}.0
              </span>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleSplitClip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#23272A] hover:bg-[#2F3437] text-neutral-200 text-xs font-medium border border-[#3F4448] transition-colors cursor-pointer leading-none"
            >
              <Scissors className="w-3.5 h-3.5 text-neutral-300" />
              <span>클립 분할</span>
            </button>

            {/* 1. Primary Action: Add Video (High-contrast bright button) */}
            <button
              onClick={() => videoInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer leading-none shrink-0"
              title="새로운 동영상 파일을 타임라인에 추가합니다"
            >
              <Film className="w-3.5 h-3.5 text-black" />
              <span>동영상 추가</span>
            </button>
            <input
              type="file"
              ref={videoInputRef}
              multiple
              accept="video/*"
              className="hidden"
              onChange={(e) => handleMediaUpload(e, 'video')}
            />

            {/* 2. Add Photo */}
            <button
              onClick={() => photoInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2F3437] hover:bg-[#3F4448] text-white text-xs font-medium border border-[#3F4448] transition-colors cursor-pointer leading-none shrink-0"
              title="새로운 사진 파일을 타임라인에 추가합니다"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>사진 추가</span>
            </button>
            <input
              type="file"
              ref={photoInputRef}
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleMediaUpload(e, 'image')}
            />

            {/* 3. Clip Split */}
            <button
              onClick={handleSplitClip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2F3437] hover:bg-[#3F4448] text-white text-xs font-medium border border-[#3F4448] transition-colors cursor-pointer leading-none shrink-0"
            >
              <Scissors className="w-3.5 h-3.5 text-neutral-300" />
              <span>클립 분할</span>
            </button>

            {/* 4. Delete Clip (Clearly visible red button) */}
            {project.scenes.length > 1 && (
              <button
                onClick={() => handleDeleteScene(currentSceneIdx)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/35 border border-red-500/40 text-red-300 hover:text-red-200 text-xs font-semibold transition-transform active:scale-95 cursor-pointer leading-none shrink-0"
                title="현재 선택된 클립 삭제"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>클립 삭제</span>
              </button>
            )}

            {/* 5. Duplicate */}
            <button
              onClick={handleDuplicateClip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#23272A] hover:bg-[#2F3437] text-neutral-200 text-xs font-medium border border-[#3F4448] transition-colors cursor-pointer leading-none shrink-0"
            >
              <Copy className="w-3.5 h-3.5 text-neutral-300" />
              <span>복제</span>
            </button>
          </div>
        </div>

        {/* TRACK 1: Video & Media Clips Reel */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium px-1">
            <span className="flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-neutral-400" />
              <span>미디어 트랙</span>
            </span>
            <span className="text-neutral-500 font-mono">{project.scenes.length}개 클립</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {project.scenes.map((scene, idx) => {
              const isSelected = currentSceneIdx === idx;
              return (
                <React.Fragment key={scene.id}>
                  <div
                    onClick={() => setCurrentSceneIdx(idx)}
                    className={`relative shrink-0 w-32 aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                      isSelected
                        ? 'border-white ring-1 ring-white/50 shadow-lg scale-102'
                        : 'border-[#2F3437] hover:border-neutral-500 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {scene.mediaType === 'video' ? (
                      <video
                        src={scene.url}
                        muted
                        playsInline
                        // @ts-ignore
                        webkit-playsinline="true"
                        preload="auto"
                        onLoadedData={(e) => {
                          try {
                            if (e.currentTarget.currentTime === 0) {
                              e.currentTarget.currentTime = 0.05;
                            }
                          } catch {}
                        }}
                        className="w-full h-full object-cover pointer-events-none select-none"
                      />
                    ) : (
                      <img src={scene.url} alt={scene.title} className="w-full h-full object-cover pointer-events-none select-none" />
                    )}
                    
                    {/* Index & Type badge */}
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono leading-none">
                      #{idx + 1} {scene.mediaType === 'video' ? '🎬' : '🖼️'}
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-neutral-300 text-[10px] font-mono leading-none">
                      {scene.durationSec || 4}s
                    </div>

                    {/* Speed indicator if != 1 */}
                    {scene.speed && scene.speed !== 1.0 && (
                      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-white text-black text-[9px] font-semibold leading-none">
                        {scene.speed}x
                      </div>
                    )}
                  </div>

                  {/* Transition Connector Button between clips */}
                  {idx < project.scenes.length - 1 && (
                    <button
                      onClick={() => {
                        setCurrentSceneIdx(idx);
                        setActiveTool('video_edit');
                      }}
                      className="shrink-0 p-1.5 rounded-lg bg-[#23272A] hover:bg-[#2F3437] border border-[#2F3437] hover:border-neutral-500 text-neutral-300 hover:text-white transition-colors cursor-pointer leading-none"
                      title={`전환 효과: ${scene.transition || '없음'}`}
                    >
                      <Sparkles className="w-3 h-3 text-neutral-400" />
                    </button>
                  )}
                </React.Fragment>
              );
            })}

            {/* Quick add photo tile */}
            <button
              onClick={() => photoInputRef.current?.click()}
              className="shrink-0 w-24 aspect-video rounded-xl border border-dashed border-[#3F4448] hover:border-neutral-400 bg-[#23272A]/50 flex flex-col items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="새 사진 추가"
            >
              <Plus className="w-4 h-4 mb-0.5 text-neutral-400" />
              <span className="text-[10px] font-medium leading-none">사진 추가</span>
            </button>

            {/* Quick add video tile */}
            <button
              onClick={() => videoInputRef.current?.click()}
              className="shrink-0 w-24 aspect-video rounded-xl border border-dashed border-[#3F4448] hover:border-neutral-400 bg-[#23272A]/50 flex flex-col items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="새 동영상 추가"
            >
              <Film className="w-4 h-4 mb-0.5 text-neutral-400" />
              <span className="text-[10px] font-medium leading-none">동영상 추가</span>
            </button>
          </div>
        </div>

        {/* TRACK 2: Subtitles Track */}
        <div className="space-y-1.5 bg-[#141414] p-3 rounded-xl border border-[#2F3437]">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium px-1">
            <span className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-neutral-400" />
              <span>자막 트랙</span>
            </span>
            <button
              onClick={() => {
                setActiveTool('text');
                handleAddSubtitle('새 자막');
              }}
              className="text-[10px] text-neutral-300 hover:text-white font-medium cursor-pointer"
            >
              + 자막 추가
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {activeSubtitles.map((sub, idx) => (
              <div
                key={sub.id}
                onClick={() => {
                  setSelectedSubtitleId(sub.id);
                  setActiveTool('text');
                }}
                className={`py-1 px-3 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer border leading-none flex items-center gap-1.5 ${
                  (selectedSubtitleId || activeSubtitles[0]?.id) === sub.id
                    ? 'bg-[#2F3437] border-white text-white shadow-xs'
                    : 'bg-[#23272A] border-[#2F3437] text-neutral-300 hover:bg-[#2F3437]'
                }`}
              >
                <span className="text-[9px] text-neutral-400 font-mono">T{idx + 1}</span>
                <span className="truncate max-w-[120px]">{sub.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TRACK 3: Audio / BGM Track */}
        <div className="space-y-1.5 bg-[#141414] p-3 rounded-xl border border-[#2F3437]">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium px-1">
            <span className="flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-neutral-400" />
              <span>BGM 오디오 트랙</span>
            </span>
            <button
              onClick={() => setActiveTool('bgm')}
              className="text-[10px] text-neutral-300 hover:text-white font-medium cursor-pointer"
            >
              BGM 변경
            </button>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#23272A] border border-[#2F3437]">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-base leading-none">
                {POPULAR_BGM_PRESETS.find((b) => b.id === project.selectedBgmId)?.emoji || '🎵'}
              </span>
              <div>
                <span className="font-semibold text-white block leading-tight">
                  {POPULAR_BGM_PRESETS.find((b) => b.id === project.selectedBgmId)?.title || 'BGM 선택 안됨'}
                </span>
                <span className="text-[10px] text-neutral-400 block leading-tight">
                  {POPULAR_BGM_PRESETS.find((b) => b.id === project.selectedBgmId)?.artist || '저작권 안심 라이브러리'}
                </span>
              </div>
            </div>

            {/* Sound Wave Animation Visualizer */}
            <div className="flex items-center gap-1 h-5 px-3">
              {[8, 14, 18, 10, 16, 20, 12, 16, 10, 18, 12, 15, 8].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}px` }}
                  className={`w-0.5 rounded-full ${isPlaying ? 'bg-white animate-pulse' : 'bg-neutral-600'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Live Preview Window (스크롤을 내려도 미리보기 창이 계속 떠있도록 지원 & 위치 드래그 이동 & 소/중/대 크기 조절) */}
      {!isMainPreviewVisible && !isFloatingDismissed && (
        <div
          className="floating-preview-root fixed z-50 bg-[#1E1E1E]/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl shadow-2xl border border-[#3F4448] animate-in fade-in slide-in-from-top-4 duration-200 select-none group"
          style={{
            touchAction: 'none',
            ...(floatingPos
              ? { left: `${floatingPos.x}px`, top: `${floatingPos.y}px` }
              : { right: '16px', top: '80px' }),
          }}
          title="스크롤 시 계속 떠있는 실시간 미리보기 (헤더를 드래그하여 원하는 위치로 자유롭게 이동)"
        >
          {/* Draggable Header with Size Switcher */}
          <div 
            onPointerDown={handleFloatingPointerDown}
            onPointerMove={handleFloatingPointerMove}
            onPointerUp={handleFloatingPointerUp}
            onPointerCancel={handleFloatingPointerUp}
            className={`flex items-center justify-between gap-1.5 pb-1.5 px-0.5 border-b border-[#2F3437] text-[10px] text-white select-none ${
              isDraggingFloating ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <div className="flex items-center gap-1.5 text-neutral-300">
              <span className="text-neutral-400 hover:text-white font-mono text-xs cursor-grab px-0.5" title="드래그하여 위치 이동">⠿</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Size Switcher: 소 / 중 / 대 */}
            <div className="flex items-center gap-0.5 bg-[#2B2B2B] p-0.5 rounded-md border border-[#3F4448]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFloatingSize('sm');
                }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-medium leading-none cursor-pointer transition-colors ${
                  floatingSize === 'sm' ? 'bg-white text-black font-semibold shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
                title="작은 크기"
              >
                소
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFloatingSize('md');
                }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-medium leading-none cursor-pointer transition-colors ${
                  floatingSize === 'md' ? 'bg-white text-black font-semibold shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
                title="중간 크기"
              >
                중
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFloatingSize('lg');
                }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-medium leading-none cursor-pointer transition-colors ${
                  floatingSize === 'lg' ? 'bg-white text-black font-semibold shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
                title="큰 크기"
              >
                대
              </button>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[9px] text-neutral-400 bg-[#2B2B2B] border border-[#3F4448] px-1 py-0.5 rounded font-mono">
                {project.aspectRatio}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFloatingDismissed(true);
                }}
                className="w-4 h-4 rounded text-neutral-400 hover:text-white hover:bg-[#2B2B2B] flex items-center justify-center cursor-pointer text-xs"
                title="미리보기 닫기"
              >
                ✕
              </button>
            </div>
          </div>

          <div
            onClick={scrollToMainPreview}
            className={`relative overflow-hidden rounded-xl bg-black mt-1.5 ${getMiniAspectClasses(project.aspectRatio, floatingSize)} shadow-inner cursor-pointer hover:opacity-95 transition-opacity`}
            title="클릭 시 본문 편집 화면으로 이동"
          >
            {/* Live Media with Filter & Zoom */}
            {currentScene?.mediaType === 'video' ? (
              <video
                src={currentScene.url}
                muted
                playsInline
                style={{
                  ...getCombinedFilterStyle(),
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: `scale(${currentScene.zoom || 1.0})`,
                }}
                className="pointer-events-none"
              />
            ) : currentScene?.url ? (
              <img
                src={currentScene.url}
                alt={currentScene?.title}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                style={{
                  ...getCombinedFilterStyle(),
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: `scale(${currentScene.zoom || 1.0})`,
                }}
                className="pointer-events-none select-none"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 text-[10px] gap-1 select-none">
                <span className="text-xs">📷</span>
                <span>미디어 없음</span>
              </div>
            )}

            {/* Subtitles Overlay on Mini Preview */}
            {currentScene?.customSubtitles?.map((sub) => (
              <div
                key={sub.id}
                style={{
                  left: `${sub.x}%`,
                  top: `${sub.y}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: floatingSize === 'sm' ? '7px' : floatingSize === 'lg' ? '10px' : '8px',
                  color: sub.textColor || '#FFFFFF',
                  backgroundColor: (() => {
                    const subOpacity = (sub.bgOpacity !== undefined ? sub.bgOpacity : 75) / 100;
                    if (sub.boxStyle === 'none' || subOpacity === 0) return 'transparent';
                    if (sub.boxStyle === 'glass') return `rgba(255, 255, 255, ${subOpacity})`;
                    if (sub.boxStyle === 'cream') return `rgba(254, 243, 199, ${subOpacity})`;
                    if (sub.bgColor) {
                      const hex = sub.bgColor.replace('#', '');
                      const r = parseInt(hex.substring(0, 2), 16) || 15;
                      const g = parseInt(hex.substring(2, 4), 16) || 23;
                      const b = parseInt(hex.substring(4, 6), 16) || 42;
                      return `rgba(${r}, ${g}, ${b}, ${subOpacity})`;
                    }
                    return `rgba(15, 23, 42, ${subOpacity})`;
                  })(),
                  borderRadius: '4px',
                  padding: '1px 3px',
                  position: 'absolute',
                  maxWidth: '90%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  pointerEvents: 'none'
                }}
              >
                {sub.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Re-open floating preview button if dismissed */}
      {!isMainPreviewVisible && isFloatingDismissed && (
        <button
          type="button"
          onClick={() => setIsFloatingDismissed(false)}
          className="fixed top-20 right-3 z-40 bg-[#1E1E1E] text-neutral-200 border border-[#3F4448] px-3 py-1.5 rounded-full text-xs font-medium shadow-xl flex items-center gap-1.5 cursor-pointer hover:bg-[#2B2B2B]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>미리보기 보기</span>
        </button>
      )}

      <CapCutVideoEditorModal
        isOpen={isCapCutModalOpen}
        onClose={() => setIsCapCutModalOpen(false)}
        scenes={project.scenes}
        initialSceneIndex={currentSceneIdx}
        aspectRatio={project.aspectRatio}
        onApply={(updatedScenes) => {
          setProject((prev) => ({
            ...prev,
            scenes: updatedScenes,
            updatedAt: new Date().toISOString()
          }));
          setCurrentSceneIdx(0);
        }}
      />
    </div>
  );
};
