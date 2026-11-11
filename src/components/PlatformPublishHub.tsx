import React, { useState } from 'react';
import { 
  Instagram, 
  Youtube, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  MessageSquare,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { HomeKidsProject } from '../types/homeAndKids';

interface PlatformPublishHubProps {
  project: HomeKidsProject;
  setProject: React.Dispatch<React.SetStateAction<HomeKidsProject>>;
  onBackToStudio: () => void;
  onClose?: () => void;
}

export const PlatformPublishHub: React.FC<PlatformPublishHubProps> = ({
  project,
  setProject,
  onBackToStudio,
  onClose,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'ohouse' | 'youtube'>('instagram');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Header Banner with Back & Close */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStudio}
            className="inline-flex items-center justify-center p-2 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] transition-colors cursor-pointer border border-[#E3E2DE]"
            title="에디터로 뒤로가기"
          >
            <span className="text-sm font-semibold">←</span>
          </button>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#F1F1EF] text-[#787774] text-xs font-medium border border-[#E3E2DE]">
              <Sparkles className="w-3.5 h-3.5 text-[#37352F] shrink-0" />
              <span>SNS 퍼블리싱 매니저</span>
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-[#37352F] tracking-tight leading-snug">
              {project.title}
            </h1>
            <p className="text-xs text-[#787774]">
              인스타그램, 오늘의집, 유튜브에서 시청자의 댓글과 호기심을 이끌어내는 맞춤 캡션을 원클릭 복사하세요.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToStudio}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#23272A] hover:bg-[#37352F] text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <span className="leading-none">← 에디터로 돌아가기</span>
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

      {/* Platform Switcher */}
      <div className="grid grid-cols-3 gap-3">
        {/* 인스타그램 Tab */}
        <button
          onClick={() => setSelectedPlatform('instagram')}
          className={`p-3.5 rounded-xl border transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer leading-none ${
            selectedPlatform === 'instagram'
              ? 'bg-[#23272A] text-white border-[#23272A] shadow-xs'
              : 'bg-white border-[#E9E9E7] hover:bg-[#F7F6F3] text-[#37352F]'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            selectedPlatform === 'instagram' ? 'bg-white/15 text-white' : 'bg-[#F1F1EF] text-[#37352F]'
          }`}>
            <Instagram className="w-4 h-4 shrink-0" />
          </div>
          <span className={`font-semibold text-xs sm:text-sm leading-none ${selectedPlatform === 'instagram' ? 'text-white' : 'text-[#37352F]'}`}>
            인스타그램
          </span>
          <span className={`text-[11px] leading-none ${selectedPlatform === 'instagram' ? 'text-neutral-300' : 'text-[#787774]'}`}>
            릴스 · 피드 캡션
          </span>
        </button>

        {/* 오늘의집 Tab */}
        <button
          onClick={() => setSelectedPlatform('ohouse')}
          className={`p-3.5 rounded-xl border transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer leading-none ${
            selectedPlatform === 'ohouse'
              ? 'bg-[#23272A] text-white border-[#23272A] shadow-xs'
              : 'bg-white border-[#E9E9E7] hover:bg-[#F7F6F3] text-[#37352F]'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
            selectedPlatform === 'ohouse' ? 'bg-white/15 text-white' : 'bg-[#F1F1EF] text-[#37352F]'
          }`}>
            집
          </div>
          <span className={`font-semibold text-xs sm:text-sm leading-none ${selectedPlatform === 'ohouse' ? 'text-white' : 'text-[#37352F]'}`}>
            오늘의집
          </span>
          <span className={`text-[11px] leading-none ${selectedPlatform === 'ohouse' ? 'text-neutral-300' : 'text-[#787774]'}`}>
            소통형 스토리
          </span>
        </button>

        {/* 유튜브 Tab */}
        <button
          onClick={() => setSelectedPlatform('youtube')}
          className={`p-3.5 rounded-xl border transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer leading-none ${
            selectedPlatform === 'youtube'
              ? 'bg-[#23272A] text-white border-[#23272A] shadow-xs'
              : 'bg-white border-[#E9E9E7] hover:bg-[#F7F6F3] text-[#37352F]'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            selectedPlatform === 'youtube' ? 'bg-white/15 text-white' : 'bg-[#F1F1EF] text-[#37352F]'
          }`}>
            <Youtube className="w-4 h-4 shrink-0" />
          </div>
          <span className={`font-semibold text-xs sm:text-sm leading-none ${selectedPlatform === 'youtube' ? 'text-white' : 'text-[#37352F]'}`}>
            유튜브 쇼츠
          </span>
          <span className={`text-[11px] leading-none ${selectedPlatform === 'youtube' ? 'text-neutral-300' : 'text-[#787774]'}`}>
            고정 댓글 질문
          </span>
        </button>
      </div>

      {/* Platform 1: 인스타그램 */}
      {selectedPlatform === 'instagram' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex items-center justify-between border-b border-[#EDEDEB] pb-4">
            <div>
              <h3 className="font-semibold text-base text-[#37352F]">
                인스타그램 소통형 감성 캡션
              </h3>
              <p className="text-xs text-[#787774]">
                질문을 이끌어내는 문장 구성으로 알고리즘 체류 시간과 댓글 수를 극대화합니다.
              </p>
            </div>

            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] font-medium text-xs border border-[#E3E2DE] leading-none"
            >
              <span className="leading-none">인스타그램 열기</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium text-xs text-[#37352F] leading-none">인스타그램 캡션 본문</label>
              <button
                onClick={() => handleCopyText('insta-caption', project.snsMetadata.instagram.caption)}
                className="inline-flex items-center gap-1 text-xs text-[#787774] hover:text-[#37352F] font-medium cursor-pointer leading-none"
              >
                {copiedKey === 'insta-caption' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span className="leading-none">{copiedKey === 'insta-caption' ? '복사 완료!' : '본문 복사'}</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={project.snsMetadata.instagram.caption}
              onChange={(e) =>
                setProject((prev) => ({
                  ...prev,
                  snsMetadata: {
                    ...prev.snsMetadata,
                    instagram: { ...prev.snsMetadata.instagram, caption: e.target.value }
                  }
                }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDEDEB] focus:outline-none focus:border-[#37352F] text-xs text-[#37352F] leading-relaxed resize-none"
            />
          </div>

          {/* Comment Trigger Hook */}
          <div className="bg-[#F7F6F3] p-4 rounded-xl border border-[#EDEDEB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs text-[#37352F] inline-flex items-center gap-1.5 leading-none">
                <MessageCircle className="w-3.5 h-3.5 text-[#787774] shrink-0" />
                <span className="leading-none">댓글 반응 유도 핵심 문구</span>
              </span>
              <button
                onClick={() => handleCopyText('insta-trigger', project.snsMetadata.instagram.commentTriggerHook)}
                className="text-xs text-[#787774] hover:text-[#37352F] font-medium cursor-pointer leading-none"
              >
                {copiedKey === 'insta-trigger' ? '복사 완료!' : '문구 복사'}
              </button>
            </div>
            <input
              type="text"
              value={project.snsMetadata.instagram.commentTriggerHook}
              onChange={(e) =>
                setProject((prev) => ({
                  ...prev,
                  snsMetadata: {
                    ...prev.snsMetadata,
                    instagram: { ...prev.snsMetadata.instagram, commentTriggerHook: e.target.value }
                  }
                }))
              }
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EDEDEB] focus:outline-none focus:border-[#37352F] text-xs text-[#37352F]"
            />
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium text-xs text-[#37352F] leading-none">해시태그 모음</label>
              <button
                onClick={() => handleCopyText('insta-tags', project.snsMetadata.instagram.hashtags.join(' '))}
                className="inline-flex items-center gap-1 text-xs text-[#787774] hover:text-[#37352F] font-medium cursor-pointer leading-none"
              >
                {copiedKey === 'insta-tags' ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span className="leading-none">{copiedKey === 'insta-tags' ? '복사 완료!' : '해시태그 복사'}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#F7F6F3] border border-[#EDEDEB]">
              {project.snsMetadata.instagram.hashtags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-white border border-[#EDEDEB] text-[#37352F] text-xs font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Platform 2: 오늘의집 */}
      {selectedPlatform === 'ohouse' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex items-center justify-between border-b border-[#EDEDEB] pb-4">
            <div>
              <h3 className="font-semibold text-base text-[#37352F]">
                오늘의집 온라인 집들이 / 사진 업로드
              </h3>
              <p className="text-xs text-[#787774]">
                질문과 댓글을 유도하여 스크랩과 인기 피드 노출을 극대화합니다.
              </p>
            </div>

            <a
              href="https://ohou.se/community/projects/new"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] font-medium text-xs border border-[#E3E2DE] leading-none"
            >
              <span className="leading-none">오늘의집 글쓰기</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium text-xs text-[#37352F] leading-none">게시글 제목</label>
              <button
                onClick={() => handleCopyText('ohouse-title', project.snsMetadata.ohouse.title)}
                className="text-xs text-[#787774] hover:text-[#37352F] font-medium cursor-pointer leading-none"
              >
                {copiedKey === 'ohouse-title' ? '복사 완료!' : '제목 복사'}
              </button>
            </div>
            <input
              type="text"
              value={project.snsMetadata.ohouse.title}
              onChange={(e) =>
                setProject((prev) => ({
                  ...prev,
                  snsMetadata: {
                    ...prev.snsMetadata,
                    ohouse: { ...prev.snsMetadata.ohouse, title: e.target.value }
                  }
                }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDEDEB] focus:outline-none focus:border-[#37352F] text-xs text-[#37352F]"
            />
          </div>

          <div className="bg-[#F7F6F3] p-4 rounded-xl border border-[#EDEDEB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs text-[#37352F] inline-flex items-center gap-1.5 leading-none">
                <HelpCircle className="w-3.5 h-3.5 text-[#787774] shrink-0" />
                <span className="leading-none">댓글 문의 유도 문구</span>
              </span>
              <button
                onClick={() => handleCopyText('ohouse-notice', project.snsMetadata.ohouse.commentNotice)}
                className="text-xs text-[#787774] hover:text-[#37352F] font-medium cursor-pointer leading-none"
              >
                {copiedKey === 'ohouse-notice' ? '복사 완료!' : '문구 복사'}
              </button>
            </div>
            <input
              type="text"
              value={project.snsMetadata.ohouse.commentNotice}
              onChange={(e) =>
                setProject((prev) => ({
                  ...prev,
                  snsMetadata: {
                    ...prev.snsMetadata,
                    ohouse: { ...prev.snsMetadata.ohouse, commentNotice: e.target.value }
                  }
                }))
              }
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#EDEDEB] focus:outline-none focus:border-[#37352F] text-xs text-[#37352F]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium text-xs text-[#37352F] leading-none">스타일링 노하우 팁 본문</label>
              <button
                onClick={() => handleCopyText('ohouse-tip', project.snsMetadata.ohouse.stylingTip)}
                className="text-xs text-[#787774] hover:text-[#37352F] font-medium cursor-pointer leading-none"
              >
                {copiedKey === 'ohouse-tip' ? '복사 완료!' : '팁 본문 복사'}
              </button>
            </div>
            <textarea
              rows={3}
              value={project.snsMetadata.ohouse.stylingTip}
              onChange={(e) =>
                setProject((prev) => ({
                  ...prev,
                  snsMetadata: {
                    ...prev.snsMetadata,
                    ohouse: { ...prev.snsMetadata.ohouse, stylingTip: e.target.value }
                  }
                }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDEDEB] focus:outline-none focus:border-[#37352F] text-xs text-[#37352F] leading-relaxed resize-none"
            />
          </div>
        </div>
      )}

      {/* Platform 3: 유튜브 */}
      {selectedPlatform === 'youtube' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex items-center justify-between border-b border-[#EDEDEB] pb-4">
            <div>
              <h3 className="font-semibold text-base text-[#37352F]">
                유튜브 쇼츠 제목 & 고정 댓글 질문
              </h3>
              <p className="text-xs text-[#787774]">
                시청자들의 댓글 참여를 유도하는 질문형 고정 댓글 템플릿을 제공합니다.
              </p>
            </div>

            <a
              href="https://studio.youtube.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] font-medium text-xs border border-[#E3E2DE] leading-none"
            >
              <span className="leading-none">유튜브 스튜디오</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium text-xs text-[#37352F] leading-none">쇼츠 제목</label>
              <button
                onClick={() => handleCopyText('yt-title', project.snsMetadata.youtube.title)}
                className="text-xs text-[#787774] hover:text-[#37352F] font-medium cursor-pointer leading-none"
              >
                {copiedKey === 'yt-title' ? '복사 완료!' : '제목 복사'}
              </button>
            </div>
            <input
              type="text"
              value={project.snsMetadata.youtube.title}
              onChange={(e) =>
                setProject((prev) => ({
                  ...prev,
                  snsMetadata: {
                    ...prev.snsMetadata,
                    youtube: { ...prev.snsMetadata.youtube, title: e.target.value }
                  }
                }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDEDEB] focus:outline-none focus:border-[#37352F] text-xs text-[#37352F]"
            />
          </div>

          <div className="bg-[#F7F6F3] p-4 rounded-xl border border-[#EDEDEB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs text-[#37352F] inline-flex items-center gap-1.5 leading-none">
                <MessageSquare className="w-3.5 h-3.5 text-[#787774] shrink-0" />
                <span className="leading-none">유튜브 고정 댓글 (시청자 질문 유도용)</span>
              </span>
              <button
                onClick={() => handleCopyText('yt-prompt', project.snsMetadata.youtube.commentQuestionPrompt)}
                className="text-xs text-[#787774] hover:text-[#37352F] font-medium cursor-pointer leading-none"
              >
                {copiedKey === 'yt-prompt' ? '복사 완료!' : '고정 댓글 복사'}
              </button>
            </div>
            <textarea
              rows={2}
              value={project.snsMetadata.youtube.commentQuestionPrompt}
              onChange={(e) =>
                setProject((prev) => ({
                  ...prev,
                  snsMetadata: {
                    ...prev.snsMetadata,
                    youtube: { ...prev.snsMetadata.youtube, commentQuestionPrompt: e.target.value }
                  }
                }))
              }
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#EDEDEB] focus:outline-none focus:border-[#37352F] text-xs text-[#37352F] leading-relaxed resize-none"
            />
          </div>
        </div>
      )}

      {/* Platform 2: 오늘의집 */}
      {selectedPlatform === 'ohouse' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                오늘의집 온라인 집들이 / 사진 업로드
              </h3>
              <p className="text-xs text-slate-500">
                질문과 댓글을 유도하여 스크랩과 인기 피드 노출을 극대화합니다.
              </p>
            </div>

            <a
              href="https://ohou.se/community/projects/new"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs shadow-xs leading-none"
            >
              <span className="leading-none">오늘의집 글쓰기</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-slate-800 leading-none">게시글 제목</label>
              <button
                onClick={() => handleCopyText('ohouse-title', project.snsMetadata.ohouse.title)}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold cursor-pointer leading-none"
              >
                {copiedKey === 'ohouse-title' ? '복사 완료!' : '제목 복사'}
              </button>
            </div>
            <input
              type="text"
              value={project.snsMetadata.ohouse.title}
              onChange={(e) =>
                setProject((prev) => ({
                  ...prev,
                  snsMetadata: {
                    ...prev.snsMetadata,
                    ohouse: { ...prev.snsMetadata.ohouse, title: e.target.value }
                  }
                }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
            />
          </div>

          <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-sky-800 inline-flex items-center gap-1.5 leading-none">
                <HelpCircle className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="leading-none">댓글 문의 유도 문구</span>
              </span>
              <button
                onClick={() => handleCopyText('ohouse-notice', project.snsMetadata.ohouse.commentNotice)}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold cursor-pointer leading-none"
              >
                {copiedKey === 'ohouse-notice' ? '복사 완료!' : '문구 복사'}
              </button>
            </div>
            <input
              type="text"
              value={project.snsMetadata.ohouse.commentNotice}
              onChange={(e) =>
                setProject((prev) => ({
                  ...prev,
                  snsMetadata: {
                    ...prev.snsMetadata,
                    ohouse: { ...prev.snsMetadata.ohouse, commentNotice: e.target.value }
                  }
                }))
              }
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-sky-200 text-xs font-bold text-slate-800"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-slate-800 leading-none">스타일링 노하우 팁 본문</label>
              <button
                onClick={() => handleCopyText('ohouse-tip', project.snsMetadata.ohouse.stylingTip)}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold cursor-pointer leading-none"
              >
                {copiedKey === 'ohouse-tip' ? '복사 완료!' : '팁 본문 복사'}
              </button>
            </div>
            <textarea
              rows={3}
              value={project.snsMetadata.ohouse.stylingTip}
              onChange={(e) =>
                setProject((prev) => ({
                  ...prev,
                  snsMetadata: {
                    ...prev.snsMetadata,
                    ohouse: { ...prev.snsMetadata.ohouse, stylingTip: e.target.value }
                  }
                }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed resize-none font-medium"
            />
          </div>
        </div>
      )}

      {/* Platform 3: 유튜브 */}
      {selectedPlatform === 'youtube' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                유튜브 쇼츠 제목 & 고정 댓글 질문
              </h3>
              <p className="text-xs text-slate-500">
                시청자들의 댓글 참여를 유도하는 질문형 고정 댓글 템플릿을 제공합니다.
              </p>
            </div>

            <a
              href="https://studio.youtube.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-xs leading-none"
            >
              <span className="leading-none">유튜브 스튜디오</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-slate-800 leading-none">쇼츠 제목</label>
              <button
                onClick={() => handleCopyText('yt-title', project.snsMetadata.youtube.title)}
                className="text-xs text-red-600 hover:text-red-700 font-bold cursor-pointer leading-none"
              >
                {copiedKey === 'yt-title' ? '복사 완료!' : '제목 복사'}
              </button>
            </div>
            <input
              type="text"
              value={project.snsMetadata.youtube.title}
              onChange={(e) =>
                setProject((prev) => ({
                  ...prev,
                  snsMetadata: {
                    ...prev.snsMetadata,
                    youtube: { ...prev.snsMetadata.youtube, title: e.target.value }
                  }
                }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
            />
          </div>

          <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-red-700 inline-flex items-center gap-1.5 leading-none">
                <MessageSquare className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span className="leading-none">유튜브 고정 댓글 (시청자 질문 유도용)</span>
              </span>
              <button
                onClick={() => handleCopyText('yt-prompt', project.snsMetadata.youtube.commentQuestionPrompt)}
                className="text-xs text-red-600 hover:text-red-700 font-bold cursor-pointer leading-none"
              >
                {copiedKey === 'yt-prompt' ? '복사 완료!' : '고정 댓글 복사'}
              </button>
            </div>
            <textarea
              rows={2}
              value={project.snsMetadata.youtube.commentQuestionPrompt}
              onChange={(e) =>
                setProject((prev) => ({
                  ...prev,
                  snsMetadata: {
                    ...prev.snsMetadata,
                    youtube: { ...prev.snsMetadata.youtube, commentQuestionPrompt: e.target.value }
                  }
                }))
              }
              className="w-full px-3 py-2 rounded-xl bg-white border border-red-200 text-xs font-bold text-slate-800 leading-relaxed resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
