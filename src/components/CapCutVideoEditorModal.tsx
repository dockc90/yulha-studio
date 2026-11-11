import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Scissors, 
  Trash2, 
  Copy, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  FastForward, 
  Sparkles, 
  Sliders, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Clock,
  Film,
  CornerDownRight,
  Split,
  Plus,
  Save,
  Link2,
  Upload
} from 'lucide-react';
import { 
  MediaScene, 
  CanvasAspectRatio, 
  TransitionEffect, 
  AestheticFilter,
  ColorAdjustments,
  CustomSubtitle
} from '../types/homeAndKids';

interface CapCutVideoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: MediaScene[];
  initialSceneIndex: number;
  aspectRatio: CanvasAspectRatio;
  onApply: (updatedScenes: MediaScene[]) => void;
}

export const CapCutVideoEditorModal: React.FC<CapCutVideoEditorModalProps> = ({
  isOpen,
  onClose,
  scenes,
  initialSceneIndex,
  aspectRatio,
  onApply,
}) => {
  if (!isOpen) return null;

  // Local working copy of scenes
  const [clips, setClips] = useState<MediaScene[]>(() => JSON.parse(JSON.stringify(scenes)));
  const [selectedIdx, setSelectedIdx] = useState<number>(() => {
    return initialSceneIndex >= 0 && initialSceneIndex < scenes.length ? initialSceneIndex : 0;
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'edit' | 'subtitle' | 'speed' | 'transition' | 'adjust' | 'audio'>('edit');
  const [isSavedBadge, setIsSavedBadge] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const currentClip = clips[selectedIdx] || clips[0];

  // Calculate cumulative start time for each clip in total timeline
  const getClipTimeRanges = () => {
    let accumulated = 0;
    return clips.map((clip) => {
      const duration = clip.durationSec || 4;
      const start = accumulated;
      const end = accumulated + duration;
      accumulated = end;
      return { start, end, duration };
    });
  };

  const clipRanges = getClipTimeRanges();
  const totalDuration = clipRanges.reduce((acc, c) => acc + c.duration, 0);

  // Sync video time on change
  useEffect(() => {
    if (videoRef.current && currentClip?.mediaType === 'video') {
      videoRef.current.playbackRate = currentClip.speed || 1.0;
    }
  }, [currentClip?.speed]);

  // Video time update handler
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const clipStart = clipRanges[selectedIdx]?.start || 0;
    const currentVideoTime = videoRef.current.currentTime;
    setCurrentTime(clipStart + currentVideoTime);
  };

  // Video ended -> advance to next clip
  const handleVideoEnded = () => {
    if (selectedIdx < clips.length - 1) {
      setSelectedIdx((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  };

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (currentClip?.mediaType === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  // Spacebar keyboard shortcut for play/pause & Ctrl+B for split
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        handleSplitAtPlayhead();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Update current selected clip fields
  const updateCurrentClip = (updates: Partial<MediaScene>) => {
    setClips((prev) => {
      const next = [...prev];
      next[selectedIdx] = { ...next[selectedIdx], ...updates };
      return next;
    });
  };

  // ✂️ CAPCUT SIGNATURE FEATURE: Split at current Playhead position!
  const handleSplitAtPlayhead = () => {
    if (!currentClip) return;
    const range = clipRanges[selectedIdx];
    if (!range) return;

    // Relative offset within current clip
    let localOffset = currentTime - range.start;
    const clipDuration = currentClip.durationSec || 4;

    // If playhead is too close to boundaries or at 0, default to half
    if (localOffset <= 0.6 || localOffset >= clipDuration - 0.6) {
      localOffset = Number((clipDuration / 2).toFixed(1));
    }

    const firstDuration = Number(localOffset.toFixed(1));
    const secondDuration = Number((clipDuration - localOffset).toFixed(1));

    const clipA: MediaScene = {
      ...currentClip,
      id: `clip-${Date.now()}-a`,
      title: `${currentClip.title} (Part 1)`,
      durationSec: firstDuration,
      trimEnd: (currentClip.trimStart || 0) + firstDuration,
    };

    const clipB: MediaScene = {
      ...currentClip,
      id: `clip-${Date.now()}-b`,
      title: `${currentClip.title} (Part 2)`,
      durationSec: secondDuration,
      trimStart: (currentClip.trimStart || 0) + firstDuration,
    };

    const nextClips = [...clips];
    nextClips.splice(selectedIdx, 1, clipA, clipB);
    setClips(nextClips);
    setSelectedIdx(selectedIdx + 1);
  };

  // 🔗 컷 합치기 (다음 컷과 병합)
  const handleMergeNextCut = () => {
    if (selectedIdx >= clips.length - 1) return;
    const clipA = clips[selectedIdx];
    const clipB = clips[selectedIdx + 1];

    const combinedDuration = Number(((clipA.durationSec || 4) + (clipB.durationSec || 4)).toFixed(1));
    const cleanTitle = clipA.title.replace(/\s*\(Part \d+\)/, '');
    const mergedClip: MediaScene = {
      ...clipA,
      id: `clip-merged-${Date.now()}`,
      title: `${cleanTitle} (병합)`,
      durationSec: combinedDuration,
      trimStart: clipA.trimStart,
      trimEnd: clipB.trimEnd !== undefined ? clipB.trimEnd : ((clipA.trimStart || 0) + combinedDuration),
      customSubtitles: [
        ...(clipA.customSubtitles || []),
        ...(clipB.customSubtitles || []).map((s, i) => ({
          ...s,
          id: `sub-${Date.now()}-${i}`,
          x: Math.min(90, Math.max(10, s.x + 5)),
        }))
      ]
    };

    const nextClips = [...clips];
    nextClips.splice(selectedIdx, 2, mergedClip);
    setClips(nextClips);
  };

  // 🔗 컷 합치기 (이전 컷과 병합)
  const handleMergePrevCut = () => {
    if (selectedIdx <= 0) return;
    const clipA = clips[selectedIdx - 1];
    const clipB = clips[selectedIdx];

    const combinedDuration = Number(((clipA.durationSec || 4) + (clipB.durationSec || 4)).toFixed(1));
    const cleanTitle = clipA.title.replace(/\s*\(Part \d+\)/, '');
    const mergedClip: MediaScene = {
      ...clipA,
      id: `clip-merged-${Date.now()}`,
      title: `${cleanTitle} (병합)`,
      durationSec: combinedDuration,
      trimStart: clipA.trimStart,
      trimEnd: clipB.trimEnd !== undefined ? clipB.trimEnd : ((clipA.trimStart || 0) + combinedDuration),
      customSubtitles: [
        ...(clipA.customSubtitles || []),
        ...(clipB.customSubtitles || []).map((s, i) => ({
          ...s,
          id: `sub-${Date.now()}-${i}`,
          x: Math.min(90, Math.max(10, s.x + 5)),
        }))
      ]
    };

    const nextClips = [...clips];
    nextClips.splice(selectedIdx - 1, 2, mergedClip);
    setClips(nextClips);
    setSelectedIdx(selectedIdx - 1);
  };

  // ➕ 편집기 내부에서 사진/동영상 파일 직접 추가 (DataURL 버퍼링으로 액박 방지)
  const handleAddMediaFiles = async (e: React.ChangeEvent<HTMLInputElement>, forceType?: 'image' | 'video') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const newClips: MediaScene[] = await Promise.all(fileList.map((file, idx) => {
      const isVideo = forceType ? forceType === 'video' : (file.type.startsWith('video/') || /\.(mp4|webm|mov|avi|m4v)$/i.test(file.name));
      const cleanName = file.name.replace(/\.[^/.]+$/, "");

      if (isVideo) {
        return Promise.resolve({
          id: `clip-upload-${Date.now()}-${idx}`,
          title: cleanName,
          mediaType: 'video' as const,
          url: URL.createObjectURL(file),
          durationSec: 8,
          speed: 1.0,
          rotation: 0,
          filter: 'none' as const,
          transition: 'none' as const,
          isMuted: false,
          volume: 100,
          kidsStickers: [],
          customSubtitles: [
            {
              id: `sub-${Date.now()}-${idx}`,
              text: cleanName,
              x: 50,
              y: 82,
              fontSizeScale: 1.0,
              textColor: '#FFFFFF',
              bgColor: '#0F172A',
              boxStyle: 'dark' as const,
              textAlign: 'center' as const,
              fontFamily: 'Pretendard' as const,
              rotation: 0,
            }
          ]
        });
      }

      return new Promise<MediaScene>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: `clip-upload-${Date.now()}-${idx}`,
            title: cleanName,
            mediaType: 'image' as const,
            url: reader.result as string,
            durationSec: 4,
            speed: 1.0,
            rotation: 0,
            filter: 'none' as const,
            transition: 'none' as const,
            isMuted: false,
            volume: 100,
            kidsStickers: [],
            customSubtitles: [
              {
                id: `sub-${Date.now()}-${idx}`,
                text: cleanName,
                x: 50,
                y: 82,
                fontSizeScale: 1.0,
                textColor: '#FFFFFF',
                bgColor: '#0F172A',
                boxStyle: 'dark' as const,
                textAlign: 'center' as const,
                fontFamily: 'Pretendard' as const,
                rotation: 0,
              }
            ]
          });
        };
        reader.onerror = () => {
          resolve({
            id: `clip-upload-${Date.now()}-${idx}`,
            title: cleanName,
            mediaType: 'image' as const,
            url: URL.createObjectURL(file),
            durationSec: 4,
            speed: 1.0,
            rotation: 0,
            filter: 'none' as const,
            transition: 'none' as const,
            isMuted: false,
            volume: 100,
            kidsStickers: [],
            customSubtitles: [
              {
                id: `sub-${Date.now()}-${idx}`,
                text: cleanName,
                x: 50,
                y: 82,
                fontSizeScale: 1.0,
                textColor: '#FFFFFF',
                bgColor: '#0F172A',
                boxStyle: 'dark' as const,
                textAlign: 'center' as const,
                fontFamily: 'Pretendard' as const,
                rotation: 0,
              }
            ]
          });
        };
        reader.readAsDataURL(file);
      });
    }));

    const nextClips = [...clips];
    const insertIndex = selectedIdx >= 0 ? selectedIdx + 1 : nextClips.length;
    nextClips.splice(insertIndex, 0, ...newClips);
    setClips(nextClips);
    setSelectedIdx(insertIndex);
    e.target.value = '';
  };

  const handleSave = () => {
    onApply(clips);
    setIsSavedBadge(true);
    setTimeout(() => setIsSavedBadge(false), 2000);
  };

  const handleCommit = () => {
    onApply(clips);
    onClose();
  };

  const handleDuplicate = () => {
    if (!currentClip) return;
    const newClip: MediaScene = {
      ...JSON.parse(JSON.stringify(currentClip)),
      id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    const nextClips = [...clips];
    nextClips.splice(selectedIdx + 1, 0, newClip);
    setClips(nextClips);
    setSelectedIdx(selectedIdx + 1);
  };

  const handleDelete = () => {
    if (clips.length <= 1) return;
    const nextClips = clips.filter((_, idx) => idx !== selectedIdx);
    setClips(nextClips);
    setSelectedIdx((prev) => Math.min(prev, nextClips.length - 1));
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || totalDuration <= 0) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left + timelineRef.current.scrollLeft;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = progress * totalDuration;
    setCurrentTime(targetTime);
    const ranges = getClipTimeRanges();
    const targetIdx = ranges.findIndex((r) => targetTime >= r.start && targetTime <= r.end);
    if (targetIdx >= 0) {
      setSelectedIdx(targetIdx);
    }
  };

  const updateCurrentClipSubtitle = (updates: Partial<CustomSubtitle>) => {
    setClips((prev) => {
      const next = [...prev];
      if (!next[selectedIdx]) return prev;
      const clip = { ...next[selectedIdx] };
      const currentSubs = clip.customSubtitles && clip.customSubtitles.length > 0
        ? [...clip.customSubtitles]
        : [{
            id: `sub-${Date.now()}`,
            text: clip.title || '',
            x: 50,
            y: 82,
            fontSizeScale: 1.0,
            textColor: '#FFFFFF',
            bgColor: '#0F172A',
            bgOpacity: 75,
            boxStyle: 'dark' as const,
            textAlign: 'center' as const,
            fontFamily: 'Pretendard' as const,
            rotation: 0,
          }];
      currentSubs[0] = { ...currentSubs[0], ...updates };
      clip.customSubtitles = currentSubs;
      next[selectedIdx] = clip;
      return next;
    });
  };

  const getClipSubBg = (sub: CustomSubtitle) => {
    if (sub.boxStyle === 'none') {
      if ((sub.bgOpacity ?? 0) === 0) return 'transparent';
      return `rgba(15, 23, 42, ${(sub.bgOpacity ?? 0) / 100})`;
    }
    const opacity = (sub.bgOpacity !== undefined ? sub.bgOpacity : 75) / 100;
    if (sub.boxStyle === 'glass') return `rgba(255, 255, 255, ${opacity})`;
    if (sub.boxStyle === 'cream') return `rgba(254, 243, 199, ${opacity})`;
    if (sub.bgColor) {
      const hex = sub.bgColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) || 15;
      const g = parseInt(hex.substring(2, 4), 16) || 23;
      const b = parseInt(hex.substring(4, 6), 16) || 42;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return `rgba(15, 23, 42, ${opacity})`;
  };

  // Filter style helper (Mobile WebKit & Canvas compatible)
  const getFilterStyle = (filter?: AestheticFilter) => {
    switch (filter) {
      case 'butter_warm':
        return 'sepia(0.35) brightness(1.08) saturate(1.25) hue-rotate(-6deg) contrast(1.04)';
      case 'golden_hour':
        return 'sepia(0.42) brightness(1.08) saturate(1.35) hue-rotate(-12deg) contrast(1.06)';
      case 'soft_milk':
        return 'brightness(1.12) saturate(0.92) contrast(0.92) sepia(0.08)';
      case 'tokyo_mood':
        return 'sepia(0.18) saturate(0.80) contrast(0.98) brightness(1.04) hue-rotate(5deg)';
      case 'vintage_film':
        return 'sepia(0.40) contrast(1.15) brightness(0.95) saturate(1.18)';
      case 'natural_clean':
        return 'contrast(1.06) saturate(1.08) brightness(1.05)';
      case 'vivid_glow':
        return 'saturate(1.40) brightness(1.08) contrast(1.08)';
      case 'pure_minimal':
        return 'brightness(1.12) contrast(0.95) saturate(0.85)';
      default:
        return 'none';
    }
  };

  const getAspectClasses = (ratio: CanvasAspectRatio) => {
    switch (ratio) {
      case '9:16':
        return 'aspect-[9/16] h-[30vh] sm:h-[40vh] md:h-[440px] max-w-full';
      case '1:1':
        return 'aspect-square h-[30vh] sm:h-[38vh] md:h-[420px] max-w-full';
      case '4:5':
        return 'aspect-[4/5] h-[30vh] sm:h-[40vh] md:h-[440px] max-w-full';
      case '16:9':
        return 'aspect-video w-[92vw] sm:w-[80vw] md:w-[600px] max-h-[26vh] sm:max-h-[36vh] md:max-h-none';
      default:
        return 'aspect-[9/16] h-[30vh] sm:h-[40vh] md:h-[440px] max-w-full';
    }
  };

  // Track natural aspect ratio of the active media in editor
  const [naturalAspect, setNaturalAspect] = useState<number | null>(null);

  useEffect(() => {
    if (!currentClip?.url) return;
    if (currentClip.mediaType === 'image') {
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          setNaturalAspect(img.naturalWidth / img.naturalHeight);
        }
      };
      img.src = currentClip.url;
    }
  }, [currentClip?.url, currentClip?.mediaType]);

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

  // 가로/세로 원본 비율 100% 무왜곡 유지 (비율 차이는 깔끔한 검정색 영역으로 채움)
  const getMediaSizeStyle = (): React.CSSProperties => {
    return {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      maxWidth: '100%',
      maxHeight: '100%',
      backgroundColor: '#000000',
    };
  };

    return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col select-none text-slate-100 animate-in fade-in duration-200">
      {/* Hidden File Inputs for uploading photo & video inside editor */}
      <input
        type="file"
        ref={photoInputRef}
        onChange={(e) => handleAddMediaFiles(e, 'image')}
        multiple
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={(e) => handleAddMediaFiles(e, 'video')}
        multiple
        accept="video/*"
        className="hidden"
      />

      {/* 1. TOP HEADER */}
      <header className="h-14 border-b border-[#2F3437] bg-[#191919]/95 px-3 sm:px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#23272A] border border-[#3F4448] flex items-center justify-center shrink-0">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="text-xs sm:text-sm font-semibold text-white leading-none truncate">
                동영상 컷편집
              </h2>
              <span className="hidden xs:inline-block bg-[#2F3437] border border-[#3F4448] text-neutral-300 text-[9px] font-medium px-1.5 py-0.5 rounded leading-none shrink-0">
                PRO
              </span>
            </div>
            <p className="hidden md:block text-[10px] text-neutral-400 mt-0.5 leading-none">
              재생바 위치에서 [분할] 클릭 시 컷 분할 · [컷 합치기] 클립 병합 · [사진 추가] · [동영상 추가]
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {isSavedBadge && (
            <span className="text-emerald-400 font-medium text-[11px] sm:text-xs animate-in fade-in flex items-center gap-1 bg-emerald-950/70 border border-emerald-800/80 px-2 sm:px-2.5 py-1 rounded-lg">
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">저장 완료</span>
              <span className="sm:hidden">저장됨</span>
            </span>
          )}

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-[#23272A] hover:bg-[#2F3437] text-neutral-200 font-medium text-[11px] sm:text-xs border border-[#3F4448] transition-colors cursor-pointer leading-none"
            title="현재까지 편집한 내용을 프로젝트에 저장합니다"
          >
            <Save className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-300" />
            <span className="hidden sm:inline">저장하기</span>
            <span className="sm:hidden">저장</span>
          </button>

          <button
            onClick={onClose}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-[#23272A] hover:bg-[#2F3437] text-neutral-300 font-medium text-[11px] sm:text-xs border border-[#3F4448] transition-colors cursor-pointer leading-none"
          >
            닫기
          </button>

          <button
            onClick={handleCommit}
            className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white hover:bg-neutral-200 text-[#191919] font-semibold text-[11px] sm:text-xs transition-colors cursor-pointer leading-none shadow-xs"
          >
            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">적용 및 닫기</span>
            <span className="sm:hidden">적용</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE (Preview + Inspector) */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left: Video Canvas Preview */}
        <div className="shrink-0 md:flex-1 bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 relative min-h-0 border-b md:border-b-0 md:border-r border-slate-800">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-slate-800 bg-black flex items-center justify-center max-w-full max-h-full">
            <div className={`${getAspectClasses(aspectRatio)} relative overflow-hidden flex items-center justify-center bg-black`}>
              {!currentClip || !currentClip.url ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-black select-none">
                  <div className="w-12 h-12 rounded-2xl bg-[#23272A] border border-[#3F4448] flex items-center justify-center mb-3 text-neutral-300">
                    <Film className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">편집할 클립을 추가하세요</h4>
                  <p className="text-xs text-neutral-400 mb-4 max-w-[220px] leading-relaxed">
                    동영상이나 사진을 추가하여 컷편집을 시작할 수 있습니다
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2F3437] hover:bg-[#3F4448] text-white font-medium text-xs cursor-pointer border border-[#3F4448]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>사진 추가</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold text-xs cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>동영상 추가</span>
                    </button>
                  </div>
                </div>
              ) : currentClip?.mediaType === 'video' ? (
                <video
                  ref={videoRef}
                  src={currentClip.url}
                  muted={currentClip.isMuted}
                  playsInline
                  // @ts-ignore
                  webkit-playsinline="true"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                  onLoadedMetadata={(e) => {
                    const { videoWidth, videoHeight } = e.currentTarget;
                    if (videoWidth && videoHeight) setNaturalAspect(videoWidth / videoHeight);
                  }}
                  style={{
                    filter: getFilterStyle(currentClip.filter),
                    WebkitFilter: getFilterStyle(currentClip.filter),
                    ...getMediaSizeStyle(),
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${currentClip?.panX || 0}%, ${currentClip?.panY || 0}%) scale(${currentClip?.zoom || 1.0}) rotate(${currentClip.rotation || 0}deg)`,
                  }}
                  className="pointer-events-none select-none"
                />
              ) : (
                <img
                  src={currentClip?.url}
                  alt={currentClip?.title}
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.currentTarget;
                    if (naturalWidth && naturalHeight) setNaturalAspect(naturalWidth / naturalHeight);
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  style={{
                    filter: getFilterStyle(currentClip?.filter),
                    WebkitFilter: getFilterStyle(currentClip?.filter),
                    ...getMediaSizeStyle(),
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${currentClip?.panX || 0}%, ${currentClip?.panY || 0}%) scale(${currentClip?.zoom || 1.0}) rotate(${currentClip?.rotation || 0}deg)`,
                  }}
                  className="pointer-events-none select-none"
                />
              )}

              {/* Subtitles Preview Overlay */}
              {currentClip?.customSubtitles?.map((sub) => {
                const subOpacity = (sub.bgOpacity !== undefined ? sub.bgOpacity : 75) / 100;
                const isCompletelyTransparent = sub.boxStyle === 'none' && subOpacity === 0;
                return (
                  <div
                    key={sub.id}
                    style={{
                      left: `${sub.x}%`,
                      top: `${sub.y}%`,
                      transform: `translate(-50%, -50%) rotate(${sub.rotation || 0}deg)`,
                      backgroundColor: getClipSubBg(sub),
                      color: sub.textColor || '#FFFFFF',
                      fontFamily: sub.fontFamily || 'Pretendard',
                      fontSize: `${14 * (sub.fontSizeScale || 1.0)}px`,
                      whiteSpace: 'nowrap',
                      width: 'max-content',
                      border: isCompletelyTransparent ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                    className="absolute z-20 px-3 py-1.5 rounded-xl shadow-lg font-bold pointer-events-none drop-shadow-sm"
                  >
                    {sub.text}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Canvas Floating Transport Controls */}
          <div className="mt-2 md:mt-0 md:absolute md:bottom-6 flex items-center gap-2 sm:gap-3 bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-slate-700 shadow-xl z-20">
            <button
              onClick={() => {
                setCurrentTime(0);
                if (videoRef.current) videoRef.current.currentTime = 0;
              }}
              className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              title="처음으로"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-8 h-8 rounded-lg bg-white hover:bg-neutral-200 text-black flex items-center justify-center cursor-pointer shadow-sm transition-colors"
              title="재생 / 일시정지 (스페이스바)"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <div className="font-mono text-xs flex items-center gap-1 text-neutral-300">
              <span className="text-white font-semibold">{currentTime.toFixed(1)}s</span>
              <span>/</span>
              <span>{totalDuration.toFixed(1)}s</span>
            </div>

            <span className="text-[#3F4448]">|</span>

            {/* Split At Playhead Button */}
            <button
              onClick={handleSplitAtPlayhead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2F3437] hover:bg-[#3F4448] text-white font-medium text-xs cursor-pointer border border-[#3F4448]"
              title="재생바 위치에서 클립 분할 (Ctrl+B)"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>현재 위치 분할</span>
            </button>
          </div>
        </div>

        {/* Right: Pro Inspector Panel */}
        <div className="w-full md:w-80 flex-1 min-h-0 overflow-y-auto border-t md:border-t-0 md:border-l border-[#2F3437] bg-[#191919]/95 flex flex-col">
          {/* Inspector Tabs */}
          <div className="grid grid-cols-6 p-1 bg-[#191919] border-b border-[#2F3437] text-[11px] font-medium">
            {[
              { id: 'edit', label: '편집' },
              { id: 'subtitle', label: '자막' },
              { id: 'speed', label: '속도' },
              { id: 'transition', label: '전환' },
              { id: 'adjust', label: '필터' },
              { id: 'audio', label: '오디오' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveInspectorTab(tab.id as any)}
                className={`py-1.5 px-1 rounded-md transition-colors leading-none cursor-pointer text-center truncate whitespace-nowrap text-[11px] ${
                  activeInspectorTab === tab.id
                    ? 'bg-[#2F3437] text-white font-semibold shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Inspector Content */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {/* TAB 1: Edit & Transform */}
            {activeInspectorTab === 'edit' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#23272A] rounded-xl border border-[#2F3437] space-y-1.5">
                  <span className="text-neutral-400 font-medium block">선택된 클립 정보</span>
                  <div className="font-semibold text-sm text-white">{currentClip?.title}</div>
                  <div className="text-[11px] text-neutral-300 font-mono">
                    길이: {currentClip?.durationSec || 4}초 · 배속: {currentClip?.speed || 1.0}x
                  </div>
                </div>

                {/* Quick Split, Merge & Actions */}
                <div className="space-y-2">
                  <label className="font-medium text-neutral-300 block">클립 분할 & 합치기</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleSplitAtPlayhead}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#2F3437] hover:bg-[#3F4448] text-white font-medium cursor-pointer border border-[#3F4448] leading-none"
                      title="재생바 위치에서 컷을 둘로 나눕니다 (단축키: Ctrl+B)"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>재생바 분할</span>
                    </button>
                    <button
                      onClick={handleMergeNextCut}
                      disabled={selectedIdx >= clips.length - 1}
                      className={`inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-medium leading-none ${
                        selectedIdx < clips.length - 1
                          ? 'bg-[#2F3437] hover:bg-[#3F4448] text-white cursor-pointer border border-[#3F4448]'
                          : 'bg-[#1E1E1E] text-neutral-500 cursor-not-allowed border border-[#2F3437]'
                      }`}
                      title="선택된 클립과 다음 클립을 하나로 합칩니다"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>다음 컷 합치기</span>
                    </button>
                  </div>

                  {selectedIdx > 0 && (
                    <button
                      onClick={handleMergePrevCut}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#23272A] hover:bg-[#2F3437] text-neutral-300 font-medium border border-[#2F3437] cursor-pointer text-xs"
                      title="선택된 클립과 이전 클립을 하나로 합칩니다"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>이전 컷과 합치기 (앞쪽 클립과 병합)</span>
                    </button>
                  )}
                </div>

                {/* Add Media Files & Duplicate */}
                <div className="space-y-2">
                  <label className="font-medium text-neutral-300 block">미디어 추가 및 관리</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#2F3437] hover:bg-[#3F4448] text-white font-medium cursor-pointer leading-none border border-[#3F4448] text-xs"
                      title="사진 파일을 타임라인에 추가합니다"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>사진 추가</span>
                    </button>
                    <button
                      onClick={() => videoInputRef.current?.click()}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#23272A] hover:bg-[#3F4448] text-neutral-200 font-medium cursor-pointer leading-none border border-[#3F4448] text-xs"
                      title="동영상 파일을 타임라인에 추가합니다"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>동영상 추가</span>
                    </button>
                  </div>
                  <button
                    onClick={handleDuplicate}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#23272A] hover:bg-[#2F3437] text-neutral-300 font-medium cursor-pointer leading-none border border-[#2F3437] text-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>클립 복제</span>
                  </button>
                </div>

                {/* Rotation */}
                <div className="p-3 bg-[#23272A] rounded-xl border border-[#2F3437] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-neutral-300">화면 회전</span>
                    <span className="font-mono text-neutral-200 font-semibold">{currentClip?.rotation || 0}°</span>
                  </div>
                  <button
                    onClick={() => updateCurrentClip({ rotation: ((currentClip.rotation || 0) + 90) % 360 })}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-[#2F3437] hover:bg-[#3F4448] text-white font-medium cursor-pointer border border-[#3F4448]"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-neutral-300" />
                    <span>90° 시계방향 회전</span>
                  </button>
                </div>

                {/* Delete Clip */}
                {clips.length > 1 && (
                  <button
                    onClick={handleDelete}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-950/40 hover:bg-red-950/70 border border-red-900/60 text-red-300 font-medium cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>현재 클립 삭제</span>
                  </button>
                )}
              </div>
            )}

            {/* TAB: Subtitles with Background Opacity Control */}
            {activeInspectorTab === 'subtitle' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#23272A] rounded-xl border border-[#2F3437] space-y-2">
                  <span className="text-neutral-400 font-medium block">클립 자막 문구</span>
                  <input
                    type="text"
                    value={currentClip?.customSubtitles?.[0]?.text || currentClip?.title || ''}
                    onChange={(e) => updateCurrentClipSubtitle({ text: e.target.value })}
                    placeholder="자막 내용을 입력하세요"
                    className="w-full px-3 py-2 bg-[#191919] border border-[#3F4448] rounded-lg text-white text-xs focus:outline-none focus:border-white"
                  />
                </div>

                {/* Subtitle Background Box Style & Opacity */}
                {(() => {
                  const clipSub = currentClip?.customSubtitles?.[0] || {
                    id: 'sub-default',
                    text: currentClip?.title || '',
                    x: 50,
                    y: 82,
                    boxStyle: 'dark' as const,
                    bgColor: '#0F172A',
                    bgOpacity: 75,
                    textColor: '#FFFFFF',
                  };
                  const currentOpacity = clipSub.boxStyle === 'none' && (clipSub.bgOpacity ?? 0) === 0 ? 0 : (clipSub.bgOpacity ?? 75);

                  return (
                    <div className="p-3 bg-[#23272A] rounded-xl border border-[#2F3437] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-medium text-neutral-300">자막 배경 스타일</label>
                        <span className="text-[11px] font-mono text-neutral-400">
                          투명도: {currentOpacity}%
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5 text-xs font-medium">
                        {[
                          { id: 'dark', label: '다크 블러' },
                          { id: 'glass', label: '글래스' },
                          { id: 'cream', label: '크림 옐로우' },
                          { id: 'none', label: '투명 (없음)' },
                        ].map((box) => (
                          <button
                            key={box.id}
                            type="button"
                            onClick={() =>
                              updateCurrentClipSubtitle({
                                boxStyle: box.id as any,
                                ...(box.id === 'cream' ? { bgColor: '#FEF3C7', textColor: '#0F172A', bgOpacity: 90 } : {}),
                                ...(box.id === 'glass' ? { bgColor: '#FFFFFF', textColor: '#0F172A', bgOpacity: 40 } : {}),
                                ...(box.id === 'dark' ? { bgColor: '#0F172A', textColor: '#FFFFFF', bgOpacity: 75 } : {}),
                                ...(box.id === 'none' ? { bgOpacity: 0 } : {}),
                              })
                            }
                            className={`py-1.5 rounded-lg border text-center transition-colors leading-none cursor-pointer text-[11px] ${
                              clipSub.boxStyle === box.id
                                ? 'bg-white text-black font-semibold border-white shadow-xs'
                                : 'bg-[#191919] border-[#3F4448] text-neutral-300 hover:bg-[#2F3437]'
                            }`}
                          >
                            {box.label}
                          </button>
                        ))}
                      </div>

                      {/* 배경 컬러 선택 */}
                      {clipSub.boxStyle !== 'none' && (
                        <div>
                          <span className="text-[11px] font-medium text-neutral-400 block mb-1.5">배경 컬러</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                              { hex: '#0F172A', label: '다크 차콜' },
                              { hex: '#FFFFFF', label: '화이트' },
                              { hex: '#FEF3C7', label: '버터 크림' },
                              { hex: '#3F4448', label: '그레이' },
                              { hex: '#0284C7', label: '블루' },
                              { hex: '#059669', label: '에메랄드' },
                              { hex: '#D97706', label: '앰버' },
                            ].map((c) => (
                              <button
                                key={c.hex}
                                type="button"
                                onClick={() => updateCurrentClipSubtitle({ bgColor: c.hex, boxStyle: 'custom' })}
                                style={{ backgroundColor: c.hex }}
                                title={c.label}
                                className={`w-5 h-5 rounded-full border transition-transform hover:scale-105 cursor-pointer ${
                                  clipSub.bgColor === c.hex
                                    ? 'border-white ring-2 ring-white/50 scale-105'
                                    : 'border-[#3F4448]'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 자막 상자 투명도 조절 슬라이더 & 원클릭 버튼 */}
                      <div className="pt-2 border-t border-[#3F4448]/60 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-medium text-neutral-300">자막 상자 불투명도 조절</span>
                          <span className="font-mono text-white font-semibold">{currentOpacity}%</span>
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
                              updateCurrentClipSubtitle({ bgOpacity: 0, boxStyle: 'none' });
                            } else {
                              updateCurrentClipSubtitle({
                                bgOpacity: val,
                                boxStyle: clipSub.boxStyle === 'none' ? 'dark' : clipSub.boxStyle,
                                bgColor: clipSub.boxStyle === 'none' && !clipSub.bgColor ? '#0F172A' : clipSub.bgColor,
                              });
                            }
                          }}
                          className="w-full accent-white"
                        />
                        <div className="flex items-center gap-1">
                          {[
                            { val: 0, label: '0%' },
                            { val: 25, label: '25%' },
                            { val: 50, label: '50%' },
                            { val: 75, label: '75%' },
                            { val: 90, label: '90%' },
                            { val: 100, label: '100%' },
                          ].map((p) => (
                            <button
                              key={p.val}
                              type="button"
                              onClick={() => {
                                if (p.val === 0) {
                                  updateCurrentClipSubtitle({ bgOpacity: 0, boxStyle: 'none' });
                                } else {
                                  updateCurrentClipSubtitle({
                                    bgOpacity: p.val,
                                    boxStyle: clipSub.boxStyle === 'none' ? 'dark' : clipSub.boxStyle,
                                    bgColor: clipSub.boxStyle === 'none' && !clipSub.bgColor ? '#0F172A' : clipSub.bgColor,
                                  });
                                }
                              }}
                              className={`flex-1 py-1 rounded text-[10px] font-mono border transition-colors cursor-pointer leading-none text-center ${
                                currentOpacity === p.val
                                  ? 'bg-white text-black border-white font-semibold'
                                  : 'bg-[#191919] text-neutral-400 border-[#3F4448] hover:bg-[#2F3437]'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 글자 색상 & 크기 */}
                      <div className="pt-2 border-t border-[#3F4448]/60 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-neutral-400">
                          <span>글자 색상</span>
                          <span className="font-mono text-neutral-300">{clipSub.textColor || '#FFFFFF'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {['#FFFFFF', '#0F172A', '#FEF3C7', '#60A5FA', '#34D399', '#FBBF24'].map((col) => (
                            <button
                              key={col}
                              type="button"
                              onClick={() => updateCurrentClipSubtitle({ textColor: col })}
                              style={{ backgroundColor: col }}
                              className={`w-5 h-5 rounded-full border transition-transform hover:scale-105 cursor-pointer ${
                                (clipSub.textColor || '#FFFFFF') === col ? 'border-white ring-2 ring-white/50 scale-105' : 'border-[#3F4448]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 2: Speed Control */}
            {activeInspectorTab === 'speed' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-300">재생 속도 (배속)</span>
                  <span className="font-mono text-white font-semibold text-sm">
                    {currentClip?.speed || 1.0}x
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 font-medium">
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0, 4.0].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => updateCurrentClip({ speed: spd })}
                      className={`py-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                        (currentClip?.speed || 1.0) === spd
                          ? 'bg-white border-white text-black font-semibold'
                          : 'bg-[#23272A] border-[#2F3437] text-neutral-300 hover:bg-[#2F3437]'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                <input
                  type="range"
                  min={0.5}
                  max={4.0}
                  step={0.1}
                  value={currentClip?.speed || 1.0}
                  onChange={(e) => updateCurrentClip({ speed: Number(e.target.value) })}
                  className="w-full accent-white mt-2"
                />
              </div>
            )}

            {/* TAB 3: Transitions */}
            {activeInspectorTab === 'transition' && (
              <div className="space-y-3">
                <span className="font-medium text-neutral-300 block">클립 전환 효과</span>
                <div className="grid grid-cols-2 gap-2 font-medium">
                  {[
                    { id: 'none', label: '없음 (컷)', emoji: '✂️' },
                    { id: 'fade', label: '페이드', emoji: '🌫️' },
                    { id: 'dissolve', label: '디졸브', emoji: '✨' },
                    { id: 'zoom', label: '줌인', emoji: '🔍' },
                    { id: 'slide_left', label: '슬라이드', emoji: '➡️' },
                    { id: 'flash', label: '화이트 플래시', emoji: '⚡' },
                  ].map((tr) => (
                    <button
                      key={tr.id}
                      onClick={() => updateCurrentClip({ transition: tr.id as TransitionEffect })}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-colors cursor-pointer ${
                        (currentClip?.transition || 'none') === tr.id
                          ? 'bg-white border-white text-black font-semibold shadow-xs'
                          : 'bg-[#23272A] border-[#2F3437] text-neutral-300 hover:bg-[#2F3437]'
                      }`}
                    >
                      <span className="text-lg leading-none">{tr.emoji}</span>
                      <span className="truncate leading-none">{tr.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Filters & Adjustments */}
            {activeInspectorTab === 'adjust' && (
              <div className="space-y-3">
                <span className="font-medium text-neutral-300 block">인기 필터 적용</span>
                <div className="grid grid-cols-2 gap-2 font-medium">
                  {[
                    { id: 'none', label: '원본 (Normal)' },
                    { id: 'butter_warm', label: '🧈 버터 필터' },
                    { id: 'golden_hour', label: '🌅 골든 아워' },
                    { id: 'soft_milk', label: '🥛 밀크 크림' },
                    { id: 'tokyo_mood', label: '🗼 도쿄 필름' },
                    { id: 'vintage_film', label: '🎞️ 90s 빈티지' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => updateCurrentClip({ filter: f.id as AestheticFilter })}
                      className={`py-2 px-2.5 rounded-lg border text-xs truncate transition-colors cursor-pointer ${
                        (currentClip?.filter || 'none') === f.id
                          ? 'bg-white border-white text-black font-semibold'
                          : 'bg-[#23272A] border-[#2F3437] text-neutral-300 hover:bg-[#2F3437]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: Audio */}
            {activeInspectorTab === 'audio' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-300">비디오 음량</span>
                  <button
                    onClick={() => updateCurrentClip({ isMuted: !currentClip?.isMuted })}
                    className={`px-2 py-1 rounded-md text-[10px] font-medium cursor-pointer border ${
                      currentClip?.isMuted ? 'bg-[#23272A] text-neutral-400 border-[#3F4448]' : 'bg-white text-black border-white'
                    }`}
                  >
                    {currentClip?.isMuted ? '음소거 해제' : '음소거'}
                  </button>
                </div>
                {!currentClip?.isMuted && (
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={currentClip?.volume ?? 100}
                    onChange={(e) => updateCurrentClip({ volume: Number(e.target.value) })}
                    className="w-full accent-white"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. MULTI-TRACK TIMELINE */}
      <div className="h-52 sm:h-64 border-t border-[#2F3437] bg-[#191919] flex flex-col shrink-0 select-none">
        {/* Timeline Top Control Strip */}
        <div className="h-11 px-3 sm:px-4 border-b border-[#2F3437] flex items-center justify-between text-xs overflow-x-auto scrollbar-none gap-3 bg-[#191919]">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-max">
            <span className="font-semibold text-neutral-300 flex items-center gap-1 shrink-0 whitespace-nowrap text-xs mr-1">
              <Film className="w-3.5 h-3.5" />
              <span>타임라인</span>
            </span>

            {/* Big Split Button */}
            <button
              onClick={handleSplitAtPlayhead}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2F3437] hover:bg-[#3F4448] text-white font-medium text-xs cursor-pointer border border-[#3F4448] shrink-0 whitespace-nowrap leading-none"
              title="재생바 위치에서 클립 분할 (Ctrl+B)"
            >
              <Scissors className="w-3.5 h-3.5 shrink-0" />
              <span>분할</span>
            </button>

            {/* Merge Cut Button */}
            <button
              onClick={selectedIdx < clips.length - 1 ? handleMergeNextCut : handleMergePrevCut}
              disabled={clips.length <= 1}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 whitespace-nowrap leading-none ${
                clips.length > 1
                  ? 'bg-[#2F3437] hover:bg-[#3F4448] text-white cursor-pointer border border-[#3F4448]'
                  : 'bg-[#1E1E1E] text-neutral-500 cursor-not-allowed border border-[#2F3437]'
              }`}
              title={selectedIdx < clips.length - 1 ? "선택된 클립과 다음 클립 합치기" : "선택된 클립과 이전 클립 합치기"}
            >
              <Link2 className="w-3.5 h-3.5 shrink-0" />
              <span>컷 합치기</span>
            </button>

            {/* Add Photo & Video Buttons */}
            <button
              onClick={() => photoInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2F3437] hover:bg-[#3F4448] text-white font-medium text-xs cursor-pointer border border-[#3F4448] shrink-0 whitespace-nowrap leading-none"
              title="사진 파일 직접 추가하기"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>사진 추가</span>
            </button>

            <button
              onClick={() => videoInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#23272A] hover:bg-[#2F3437] text-neutral-300 font-medium text-xs cursor-pointer border border-[#2F3437] shrink-0 whitespace-nowrap leading-none"
              title="동영상 파일 직접 추가하기"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>동영상 추가</span>
            </button>

            <button
              onClick={handleDuplicate}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#23272A] hover:bg-[#2F3437] text-neutral-300 text-xs font-medium cursor-pointer border border-[#2F3437] shrink-0 whitespace-nowrap leading-none"
            >
              <Copy className="w-3 h-3 shrink-0" />
              <span>복제</span>
            </button>

            {clips.length > 1 && (
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-950/70 text-red-300 text-xs font-medium cursor-pointer border border-red-900/60 shrink-0 whitespace-nowrap leading-none"
              >
                <Trash2 className="w-3 h-3 shrink-0" />
                <span>삭제</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-neutral-400 font-mono shrink-0 whitespace-nowrap pl-2">
            클립 {selectedIdx + 1} / {clips.length}
          </div>
        </div>

        {/* Timeline Tracks Area */}
        <div 
          ref={timelineRef}
          onClick={handleTimelineClick}
          className="flex-1 relative overflow-x-auto p-4 cursor-pointer bg-[#141414] space-y-3"
        >
          {/* Time Ruler */}
          {(() => {
            const step = totalDuration > 30 ? 10 : totalDuration > 10 ? 5 : totalDuration > 5 ? 2 : 1;
            return (
              <div className="h-4 flex items-center text-[9px] font-mono text-neutral-500 border-b border-[#2F3437] pb-1">
                {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, sec) => {
                  const showLabel = sec % step === 0 || sec === Math.ceil(totalDuration);
                  return (
                    <div 
                      key={sec} 
                      style={{ width: `${(1 / Math.max(1, totalDuration)) * 100}%` }}
                      className={`shrink-0 border-l ${sec % step === 0 ? 'border-neutral-500 h-3' : 'border-neutral-800 h-1.5'} pl-1 overflow-visible relative`}
                    >
                      {showLabel && (
                        <span className="absolute -top-0.5 left-1 whitespace-nowrap font-mono text-[9px] text-neutral-400 select-none">
                          {sec}s
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Video Clips Track */}
          <div className="h-20 flex items-center gap-1.5">
            {clips.map((clip, idx) => {
              const isSelected = selectedIdx === idx;
              const range = clipRanges[idx];
              const widthPct = Math.max(12, ((range?.duration || 4) / Math.max(1, totalDuration)) * 100);

              return (
                <div
                  key={clip.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIdx(idx);
                    setCurrentTime(range?.start || 0);
                  }}
                  style={{ width: `${widthPct}%`, minWidth: '90px' }}
                  className={`h-full relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all group shrink-0 bg-neutral-900 ${
                    isSelected
                      ? 'border-white ring-1 ring-white/50 shadow-xl scale-102 z-10'
                      : 'border-[#2F3437] hover:border-neutral-500 opacity-80 hover:opacity-100'
                  }`}
                >
                  {clip.url ? (
                    <img 
                      src={clip.url} 
                      alt="" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-600">
                      <Film className="w-6 h-6" />
                    </div>
                  )}
                  
                  {/* Clip Header Label */}
                  <div className="absolute top-1 left-1 max-w-[80%] px-1.5 py-0.5 rounded bg-black/80 text-white text-[9px] font-medium leading-none flex items-center gap-1 shadow-xs truncate pointer-events-none">
                    <span className="font-bold shrink-0">#{idx + 1}</span>
                    <span className="shrink-0">{clip.mediaType === 'video' ? '🎬' : '🖼️'}</span>
                  </div>

                  {/* Duration Chip */}
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-neutral-200 text-[9px] font-mono leading-none shadow-xs pointer-events-none">
                    {clip.durationSec || 4}s
                  </div>

                  {/* Speed Badge */}
                  {clip.speed && clip.speed !== 1.0 && (
                    <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-white text-black text-[8px] font-semibold leading-none shadow-xs pointer-events-none">
                      {clip.speed}x
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Subtitles Track Visualizer */}
          <div className="h-6 flex items-center gap-1.5 bg-[#1E1E1E] p-1 rounded-lg border border-[#2F3437] overflow-x-auto scrollbar-none">
            {clips.map((clip, idx) => {
              const range = clipRanges[idx];
              const widthPct = Math.max(12, ((range?.duration || 4) / Math.max(1, totalDuration)) * 100);
              const subCount = clip.customSubtitles?.length || (clip.title ? 1 : 0);

              return (
                <div
                  key={`sub-${clip.id}`}
                  style={{ width: `${widthPct}%`, minWidth: '90px' }}
                  className="h-full rounded bg-[#2F3437] border border-[#3F4448] px-1.5 flex items-center justify-between text-[9px] text-neutral-300 font-medium shrink-0 truncate overflow-hidden"
                >
                  <span className="truncate whitespace-nowrap">T: {clip.customSubtitles?.[0]?.text || clip.title || '자막'}</span>
                  {subCount > 1 && <span className="text-[8px] bg-[#3F4448] px-1 rounded shrink-0 ml-1">+{subCount}</span>}
                </div>
              );
            })}
          </div>

          {/* RED PLAYHEAD (Scrubber Line) */}
          <div
            style={{
              left: `${Math.max(0, Math.min(100, (currentTime / Math.max(1, totalDuration)) * 100))}%`,
            }}
            className="absolute top-0 bottom-0 w-0.5 bg-white z-30 pointer-events-none"
          >
            <div className="w-3 h-3.5 bg-white rounded-b-md -translate-x-1/2 flex items-center justify-center shadow-md">
              <span className="w-1 h-1 bg-black rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};