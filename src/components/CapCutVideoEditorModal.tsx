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
  Split
} from 'lucide-react';
import { 
  MediaScene, 
  CanvasAspectRatio, 
  TransitionEffect, 
  AestheticFilter,
  ColorAdjustments 
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
  const [activeInspectorTab, setActiveInspectorTab] = useState<'edit' | 'speed' | 'transition' | 'adjust' | 'audio'>('edit');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

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

  // Duplicate current clip
  const handleDuplicate = () => {
    const clone: MediaScene = {
      ...currentClip,
      id: `clip-${Date.now()}-copy`,
      title: `${currentClip.title} (복제)`
    };
    const nextClips = [...clips];
    nextClips.splice(selectedIdx + 1, 0, clone);
    setClips(nextClips);
    setSelectedIdx(selectedIdx + 1);
  };

  // Delete current clip
  const handleDelete = () => {
    if (clips.length <= 1) return;
    const nextClips = clips.filter((_, idx) => idx !== selectedIdx);
    setClips(nextClips);
    setSelectedIdx(Math.max(0, selectedIdx - 1));
  };

  // Timeline click to move playhead
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = ratio * totalDuration;
    setCurrentTime(targetTime);

    // Find which clip this falls into
    const idx = clipRanges.findIndex((r) => targetTime >= r.start && targetTime <= r.end);
    if (idx !== -1) {
      setSelectedIdx(idx);
      if (videoRef.current && clips[idx].mediaType === 'video') {
        const localTime = targetTime - clipRanges[idx].start;
        videoRef.current.currentTime = localTime;
      }
    }
  };

  // Apply and exit
  const handleCommit = () => {
    onApply(clips);
    onClose();
  };

  // Filter style helper
  const getFilterStyle = (filter?: AestheticFilter) => {
    switch (filter) {
      case 'butter_warm':
        return 'sepia(0.32) brightness(1.06) saturate(1.22) hue-rotate(-6deg)';
      case 'golden_hour':
        return 'sepia(0.38) brightness(1.06) saturate(1.32) hue-rotate(-12deg)';
      case 'soft_milk':
        return 'brightness(1.08) saturate(0.94) contrast(0.93) sepia(0.06)';
      case 'tokyo_mood':
        return 'sepia(0.14) saturate(0.82) contrast(0.98) brightness(1.02)';
      case 'vintage_film':
        return 'sepia(0.35) contrast(1.12) brightness(0.95) saturate(1.15)';
      default:
        return 'none';
    }
  };

  const getAspectClasses = (ratio: CanvasAspectRatio) => {
    switch (ratio) {
      case '9:16':
        return 'aspect-[9/16] h-[460px]';
      case '1:1':
        return 'aspect-square h-[440px]';
      case '4:5':
        return 'aspect-[4/5] h-[460px]';
      case '16:9':
        return 'aspect-video w-[640px]';
      default:
        return 'aspect-[9/16] h-[460px]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col select-none text-slate-100 animate-in fade-in duration-200">
      {/* 1. TOP HEADER */}
      <header className="h-14 border-b border-slate-800 bg-slate-950/80 px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-md shadow-rose-500/20">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-white leading-none">
                캡컷 프로 비디오 에디터 (CapCut Video Studio)
              </h2>
              <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded leading-none">
                PRO 100%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-none">
              재생바 위치에서 [✂️ 분할] 클릭 시 캡컷처럼 즉시 컷분할됩니다 · 단축키 [Ctrl+B / Space]
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer leading-none"
          >
            취소
          </button>
          <button
            onClick={handleCommit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black text-xs shadow-md shadow-rose-500/30 transition-all cursor-pointer leading-none"
          >
            <Check className="w-3.5 h-3.5" />
            <span>편집 완료 및 적용</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE (Preview + Inspector) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left: Video Canvas Preview */}
        <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-4 relative">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-slate-800 bg-black flex items-center justify-center max-w-full max-h-full">
            <div className={`${getAspectClasses(aspectRatio)} relative overflow-hidden flex items-center justify-center bg-black`}>
              {currentClip?.mediaType === 'video' ? (
                <video
                  ref={videoRef}
                  src={currentClip.url}
                  muted={currentClip.isMuted}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                  style={{
                    filter: getFilterStyle(currentClip.filter),
                    transform: `rotate(${currentClip.rotation || 0}deg)`,
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={currentClip?.url}
                  alt={currentClip?.title}
                  style={{
                    filter: getFilterStyle(currentClip?.filter),
                    transform: `rotate(${currentClip?.rotation || 0}deg)`,
                  }}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Subtitles Preview Overlay */}
              {currentClip?.customSubtitles?.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    left: `${sub.x}%`,
                    top: `${sub.y}%`,
                    transform: `translate(-50%, -50%) rotate(${sub.rotation || 0}deg)`,
                    backgroundColor: sub.boxStyle === 'none' ? 'transparent' : (sub.bgColor || '#0F172A'),
                    color: sub.textColor || '#FFFFFF',
                    fontFamily: sub.fontFamily || 'Pretendard',
                    fontSize: `${14 * (sub.fontSizeScale || 1.0)}px`,
                    whiteSpace: 'nowrap',
                    width: 'max-content',
                  }}
                  className="absolute z-20 px-3 py-1.5 rounded-xl shadow-lg font-bold pointer-events-none drop-shadow-sm border border-white/20"
                >
                  {sub.text}
                </div>
              ))}
            </div>
          </div>

          {/* Canvas Floating Transport Controls */}
          <div className="absolute bottom-6 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 shadow-xl">
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
              className="w-8 h-8 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center cursor-pointer shadow-md shadow-rose-600/30"
              title="재생 / 일시정지 (스페이스바)"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <div className="font-mono text-xs flex items-center gap-1 text-slate-300">
              <span className="text-rose-400 font-bold">{currentTime.toFixed(1)}s</span>
              <span>/</span>
              <span>{totalDuration.toFixed(1)}s</span>
            </div>

            <span className="text-slate-600">|</span>

            {/* Split At Playhead Button */}
            <button
              onClick={handleSplitAtPlayhead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-amber-500/20"
              title="재생바 위치에서 클립 분할 (Ctrl+B)"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>현재 위치 분할</span>
            </button>
          </div>
        </div>

        {/* Right: CapCut Pro Inspector Panel */}
        <div className="w-80 border-l border-slate-800 bg-slate-900/95 flex flex-col shrink-0">
          {/* Inspector Tabs */}
          <div className="grid grid-cols-5 p-1.5 bg-slate-950 border-b border-slate-800 text-[11px] font-bold">
            {[
              { id: 'edit', label: '편집' },
              { id: 'speed', label: '속도' },
              { id: 'transition', label: '전환' },
              { id: 'adjust', label: '필터' },
              { id: 'audio', label: '오디오' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveInspectorTab(tab.id as any)}
                className={`py-2 rounded-xl transition-all leading-none cursor-pointer text-center ${
                  activeInspectorTab === tab.id
                    ? 'bg-rose-600 text-white font-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
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
                <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-2">
                  <span className="text-slate-400 font-bold block">선택된 클립 정보</span>
                  <div className="font-extrabold text-sm text-white">{currentClip?.title}</div>
                  <div className="text-[11px] text-rose-400 font-mono">
                    길이: {currentClip?.durationSec || 4}초 · 배속: {currentClip?.speed || 1.0}x
                  </div>
                </div>

                {/* Quick Split & Actions */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-300 block">클립 분할 & 복제</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleSplitAtPlayhead}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer shadow-md leading-none"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>재생바 분할</span>
                    </button>
                    <button
                      onClick={handleDuplicate}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer leading-none"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>클립 복제</span>
                    </button>
                  </div>
                </div>

                {/* Rotation */}
                <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300">화면 회전</span>
                    <span className="font-mono text-rose-400 font-bold">{currentClip?.rotation || 0}°</span>
                  </div>
                  <button
                    onClick={() => updateCurrentClip({ rotation: ((currentClip.rotation || 0) + 90) % 360 })}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-rose-400" />
                    <span>90° 시계방향 회전</span>
                  </button>
                </div>

                {/* Delete Clip */}
                {clips.length > 1 && (
                  <button
                    onClick={handleDelete}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-300 font-bold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>현재 클립 삭제</span>
                  </button>
                )}
              </div>
            )}

            {/* TAB 2: Speed Control */}
            {activeInspectorTab === 'speed' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">재생 속도 (배속)</span>
                  <span className="font-mono text-rose-400 font-extrabold text-sm">
                    {currentClip?.speed || 1.0}x
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 font-bold">
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0, 4.0].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => updateCurrentClip({ speed: spd })}
                      className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                        (currentClip?.speed || 1.0) === spd
                          ? 'bg-rose-600 border-rose-500 text-white font-black'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
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
                  className="w-full accent-rose-500 mt-2"
                />
              </div>
            )}

            {/* TAB 3: Transitions */}
            {activeInspectorTab === 'transition' && (
              <div className="space-y-3">
                <span className="font-bold text-slate-300 block">클립 전환 효과</span>
                <div className="grid grid-cols-2 gap-2 font-bold">
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
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        (currentClip?.transition || 'none') === tr.id
                          ? 'bg-rose-950/60 border-rose-500 text-white font-black shadow-xs'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-xl leading-none">{tr.emoji}</span>
                      <span className="truncate leading-none">{tr.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Filters & Adjustments */}
            {activeInspectorTab === 'adjust' && (
              <div className="space-y-3">
                <span className="font-bold text-slate-300 block">인기 필터 적용</span>
                <div className="grid grid-cols-2 gap-2 font-bold">
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
                      className={`py-2 px-2.5 rounded-xl border text-xs truncate transition-all cursor-pointer ${
                        (currentClip?.filter || 'none') === f.id
                          ? 'bg-rose-600 border-rose-500 text-white font-black'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
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
                  <span className="font-bold text-slate-300">비디오 음량</span>
                  <button
                    onClick={() => updateCurrentClip({ isMuted: !currentClip?.isMuted })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                      currentClip?.isMuted ? 'bg-rose-900 text-rose-300' : 'bg-slate-800 text-slate-300'
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
                    className="w-full accent-rose-500"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. CAPCUT BOTTOM MULTI-TRACK TIMELINE */}
      <div className="h-64 border-t border-slate-800 bg-slate-950 flex flex-col shrink-0 select-none">
        {/* Timeline Top Control Strip */}
        <div className="h-10 px-5 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-black text-rose-400 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              <span>타임라인</span>
            </span>

            {/* Big Split Button */}
            <button
              onClick={handleSplitAtPlayhead}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-sm shadow-amber-500/20"
              title="재생바 위치에서 클립 분할"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>✂️ 분할</span>
            </button>

            <button
              onClick={handleDuplicate}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>복제</span>
            </button>

            {clips.length > 1 && (
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/70 hover:bg-red-900 text-red-300 text-xs font-bold cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>삭제</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            클립 {selectedIdx + 1} / {clips.length}
          </div>
        </div>

        {/* Timeline Tracks Area */}
        <div 
          ref={timelineRef}
          onClick={handleTimelineClick}
          className="flex-1 relative overflow-x-auto p-4 cursor-pointer bg-slate-950 space-y-3"
        >
          {/* Time Ruler */}
          <div className="h-4 flex items-center text-[9px] font-mono text-slate-500 border-b border-slate-800/60 pb-1">
            {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, sec) => (
              <div 
                key={sec} 
                style={{ width: `${(1 / Math.max(1, totalDuration)) * 100}%` }}
                className="shrink-0 border-l border-slate-700 pl-1"
              >
                {sec}s
              </div>
            ))}
          </div>

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
                  className={`h-full relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all group shrink-0 ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-xl scale-102 z-10'
                      : 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={clip.url} alt={clip.title} className="w-full h-full object-cover" />
                  
                  {/* Clip Header Label */}
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-white text-[9px] font-bold leading-none">
                    #{idx + 1} {clip.mediaType === 'video' ? '🎬' : '🖼️'}
                  </div>

                  {/* Duration Chip */}
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-amber-300 text-[9px] font-mono font-bold leading-none">
                    {clip.durationSec || 4}s
                  </div>

                  {/* Speed Badge */}
                  {clip.speed && clip.speed !== 1.0 && (
                    <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-rose-600 text-white text-[8px] font-black leading-none">
                      {clip.speed}x
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Subtitles Track Visualizer */}
          <div className="h-6 flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-lg border border-slate-800/80">
            {clips.map((clip, idx) => {
              const range = clipRanges[idx];
              const widthPct = Math.max(12, ((range?.duration || 4) / Math.max(1, totalDuration)) * 100);
              const subCount = clip.customSubtitles?.length || (clip.title ? 1 : 0);

              return (
                <div
                  key={`sub-${clip.id}`}
                  style={{ width: `${widthPct}%`, minWidth: '90px' }}
                  className="h-full rounded bg-sky-950/70 border border-sky-800/60 px-1.5 flex items-center justify-between text-[9px] text-sky-300 font-bold shrink-0 truncate"
                >
                  <span className="truncate">T: {clip.customSubtitles?.[0]?.text || clip.title || '자막'}</span>
                  {subCount > 1 && <span className="text-[8px] bg-sky-800 px-1 rounded">+{subCount}</span>}
                </div>
              );
            })}
          </div>

          {/* RED PLAYHEAD (Scrubber Line) */}
          <div
            style={{
              left: `${Math.max(0, Math.min(100, (currentTime / Math.max(1, totalDuration)) * 100))}%`,
            }}
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-30 pointer-events-none"
          >
            <div className="w-3 h-3.5 bg-rose-500 rounded-b-md -translate-x-1/2 flex items-center justify-center shadow-md">
              <span className="w-1 h-1 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};