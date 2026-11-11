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
  HelpCircle,
  RotateCw
} from 'lucide-react';
import { HomeKidsProject } from '../types/homeAndKids';

const VIRAL_STYLES = [
  { id: 'curiosity', name: '호기심 & DM 유도형' },
  { id: 'before_after', name: '비포애프터 & 꿀팁형' },
  { id: 'healing', name: '감성 공감 힐링형' },
  { id: 'shopping', name: '가성비 꿀템 정보형' },
];

export const generateViralPlatformContent = (rawTopic: string, styleIdx = 0) => {
  const topic = rawTopic.trim() || '아늑한 거실 룸투어';
  const cleanTopic = topic.replace(/[#✨🤍🌿☕️💡📌💬]/g, '').trim();
  const style = Math.abs(styleIdx) % 4;

  let instaCaption = '';
  let instaTrigger = '';
  let instaTags: string[] = [];

  let ohouseTitle = '';
  let ohouseNotice = '';
  let ohouseTip = '';
  let ohouseTags: string[] = [];

  let ytTitle = '';
  let ytDesc = '';
  let ytPrompt = '';
  let ytTags: string[] = [];

  const tagTopic = cleanTopic.replace(/\s+/g, '');

  if (style === 0) {
    // 호기심 & DM 유도형
    instaCaption = `다들 어디서 샀냐고 DM 폭발했던 바로 그 ${cleanTopic}…✨ 드디어 정보 공개합니다!\n\n놀러오는 사람들마다 제일 먼저 물어보는 공간이에요 🤍\n작은 소품과 가구 배치만 살짝 바꿨을 뿐인데, 하루 종일 머물고 싶어지는 아늑한 무드가 완성되었어요 🌿\n\n햇살 들어올 때 커피 한잔 마시면 여기가 바로 힐링 스팟 ☕️\n\n사진 속 가구/소품 정보 궁금하신 분들은 편하게 댓글 남겨주세요!`;
    instaTrigger = `💬 사진 속 가구/조명 정보 궁금하신 분은 댓글로 '정보' 남겨주시면 DM 바로 보내드릴게요! 💌`;
    instaTags = ['#홈스타그램', '#집꾸미기', '#오늘의집', '#룸투어', '#감성인테리어', '#온라인집들이', '#공간스타일링', '#홈데코', '#리빙스타그램', '#살림팁', '#릴스추천', `#${tagTopic}`];

    ohouseTitle = `햇살이 온종일 머무는, ${cleanTopic} 이야기 (가구 배치 & 수납 꿀팁)`;
    ohouseNotice = `📌 가구나 소품 제품명 궁금하신 점은 댓글 남겨주시면 바로 상세히 답변해 드려요 :)`;
    ohouseTip = `복잡하고 좁아 보이던 공간을 2배 넓어 보이게 만드는 3가지 팁!\n1. 시선을 가리지 않는 낮은 가구 위주로 배치하기\n2. 톤온톤 패브릭으로 시각적 통일감 주기\n3. 전구색 간접 조명으로 아늑한 무드 연출하기\n\n나중에 인테리어 하실 때 참고하시려면 [스크랩] 해두세요 📌`;
    ohouseTags = ['#오늘의집', '#온라인집들이', '#홈스타일링', '#거실인테리어', '#수납정리', `#${tagTopic}`];

    ytTitle = `인테리어 고수들이 ${cleanTopic}에 무조건 두는 ‘이것’ 💡 #Shorts`;
    ytDesc = `공간의 분위기를 180도 바꿔주는 실전 스타일링 꿀팁!\n\n궁금하신 제품 정보는 고정 댓글을 확인해주세요 ✨\n영상이 도움 되셨다면 구독과 좋아요 부탁드립니다 :)`;
    ytPrompt = `📌 [고정] 솔직히 1번 조명 vs 2번 조명 중 어떤 게 더 분위기 있나요? 여러분의 취향을 투표해주세요! 👇`;
    ytTags = ['#Shorts', '#인테리어', '#룸투어', '#집꾸미기', '#홈스타일링', '#쇼츠'];
  } else if (style === 1) {
    // 비포애프터 & 꿀팁형
    instaCaption = `정리 안 되던 ${cleanTopic}, 이렇게 바꿨더니 삶의 질이 200% 수직 상승했습니다 🌿\n\n비싸고 거창한 리모델링 없이도 무드를 확 바꾸는 꿀팁 3가지 공유해요 🤍\n\n1️⃣ 잡동사니는 같은 톤 수납함에 쏙\n2️⃣ 포인트 조명 하나로 카페 같은 감성 완성\n3️⃣ 계절 패브릭으로 손쉽게 분위기 전환\n\n작은 변화로도 매일 집에 들어오는 순간이 행복해져요 ✨`;
    instaTrigger = `💬 제가 직접 써보고 가장 만족스러웠던 필수템 리스트, 댓글로 '공유' 남겨주시면 바로 보내드려요! 💌`;
    instaTags = ['#살림꿀팁', '#정리정돈', '#집꾸미기', '#홈스타일링', '#인테리어팁', '#오늘의집', '#룸투어', '#비포애프터', '#감성살림', `#${tagTopic}`];

    ohouseTitle = `버릴 것 버리고 나니 비로소 완성된 우리 집 ${cleanTopic} | 톤온톤 스타일링`;
    ohouseNotice = `📌 공간 구조나 견적, 가구 정보는 편하게 댓글로 질문해주세요! 솔직하게 알려드릴게요.`;
    ohouseTip = `불필요한 가구는 과감히 비우고, 자연광과 따스한 우드 톤을 살려 연출했습니다. 아침과 저녁 조명 하나로 분위기가 완전히 달라져서 매일 새로운 공간 같아요. 좁은 공간일수록 메인 컬러를 3가지 이내로 통일하는 것을 강력 추천합니다.`;
    ohouseTags = ['#오늘의집', '#온라인집들이', '#비포애프터', '#미니멀라이프', '#공간인테리어', `#${tagTopic}`];

    ytTitle = `솔직히 이건 사지 마세요 vs 무조건 사야 하는 ${cleanTopic} 꿀템 TOP 3 #Shorts`;
    ytDesc = `내돈내산으로 직접 써보고 검증한 추천템 & 비추천템 솔직 후기!\n\n더 많은 살림/인테리어 꿀팁은 구독하고 받아보세요 🤍`;
    ytPrompt = `📌 [고정] 여러분은 이 중에 가장 사고 싶은 아이템이 무엇인가요? 1번, 2번, 3번 중 골라주세요! 댓글로 알려주세요 💬`;
    ytTags = ['#Shorts', '#내돈내산', '#인테리어꿀팁', '#집꾸미기', '#꿀템추천', '#쇼츠'];
  } else if (style === 2) {
    // 감성 공감 힐링형
    instaCaption = `퇴근하고 문 열었을 때 마주하는 이 느낌… 하루의 피로가 사르르 녹아내려요 🕊️\n\n온전히 나에게 집중할 수 있는 나만의 ${cleanTopic} 공간 ☕️\n\n복잡한 세상 속에서 가장 따뜻하고 안전한 나만의 아지트예요. 좋아하는 음악 틀어두고 멍하니 바라만 봐도 행복 가득 ✨\n\n여러분에게 집이란 어떤 의미인가요? 🤍`;
    instaTrigger = `💬 따스한 감성 인테리어 좋아하시는 분들은 팔로우하시고 매일 힐링 공간 팁 받아보세요 🌿`;
    instaTags = ['#감성인테리어', '#홈스타그램', '#집순이', '#힐링공간', '#퇴근후일상', '#룸투어', '#집꾸미기', '#온라인집들이', '#취향공간', `#${tagTopic}`];

    ohouseTitle = `온 가족의 온기가 머무는, 포근하고 아늑한 ${cleanTopic} 랜선 집들이`;
    ohouseNotice = `📌 공간에 머무는 모든 시간들이 따뜻해지는 소소한 팁들을 담았어요. 궁금하신 점 댓글로 편하게 나눠요 :)`;
    ohouseTip = `차가운 형광등 대신 3000K 웜톤 조명을 분산 배치하고, 리넨과 면 소재의 패브릭을 믹스매치하여 시각뿐 아니라 촉감까지 포근한 공간으로 완성했습니다. 계절마다 쿠션 커버만 바꿔줘도 분위기 전환에 최고예요.`;
    ohouseTags = ['#오늘의집', '#랜선집들이', '#감성홈', '#포근한집', '#조명인테리어', `#${tagTopic}`];

    ytTitle = `하루의 피로가 싹 풀리는 힐링 ${cleanTopic} 브이로그 ✨ #Shorts`;
    ytDesc = `나만의 소중한 공간에서 보내는 조용하고 따스한 하루의 기록.\n\n구독과 좋아요는 다음 영상을 만드는 큰 힘이 됩니다 🤍`;
    ytPrompt = `📌 [고정] 여러분이 가장 좋아하는 하루 중 힐링 타임은 언제인가요? 댓글로 소소하게 이야기 나눠봐요 ☕️`;
    ytTags = ['#Shorts', '#일상브이로그', '#힐링', '#감성공간', '#쇼츠', '#집순이브이로그'];
  } else {
    // 가성비 꿀템 정보형
    instaCaption = `이거 왜 이제 샀을까 후회 중인 ${cleanTopic} 가성비 치트키 템들 🤍\n\n광고 없이 찐으로 써보고 추천하는 리얼 꿀템 모음이에요 🌿\n\n공간 차지는 적은데 실용성과 감성 둘 다 챙길 수 있어서 볼 때마다 뿌듯…!\n인테리어 망설이시는 분들께 적극 추천합니다 ✨`;
    instaTrigger = `💬 제품 좌표 궁금하신 분들은 댓글에 '링크' 남겨주시면 DM으로 최저가 구매처 쏴드립니다 🚀`;
    instaTags = ['#가성비인테리어', '#살림치트키', '#인테리어소품', '#내돈내산', '#집꾸미기', '#룸투어', '#꿀템공유', '#홈데코', `#${tagTopic}`];

    ohouseTitle = `가성비와 감성 둘 다 잡은 ${cleanTopic} 스타일링 & 아이템 정보 공유`;
    ohouseNotice = `📌 사진 속 모든 소품과 가구 정보는 댓글로 물어보시면 상세 제품명과 링크 안내해 드려요!`;
    ohouseTip = `고가의 가구 대신 가성비 좋은 모듈 가구와 소품을 활용해 언제든 배치를 바꿀 수 있게 설계했습니다. 비싼 돈 들이지 않고도 감성 있는 공간을 만드는 핵심은 '여백의 미'와 '조명'입니다.`;
    ohouseTags = ['#오늘의집', '#가성비인테리어', '#원룸인테리어', '#방꾸미기', '#가구추천', `#${tagTopic}`];

    ytTitle = `가성비 대박! ${cleanTopic} 분위기 180도 바꾸는 소품 BEST 3 #Shorts`;
    ytDesc = `3만원 이하로 집안 분위기 호텔처럼 만드는 법!\n\n궁금한 제품 정보는 고정 댓글을 확인해주세요 ✨`;
    ytPrompt = `📌 [고정] 여러분 집에 가장 먼저 들이고 싶은 소품은 몇 번인가요? 투표하고 가세요 👇`;
    ytTags = ['#Shorts', '#가성비인테리어', '#소품추천', '#집꾸미기', '#쇼츠'];
  }

  return {
    instagram: {
      caption: instaCaption,
      commentTriggerHook: instaTrigger,
      hashtags: instaTags,
    },
    ohouse: {
      title: ohouseTitle,
      commentNotice: ohouseNotice,
      stylingTip: ohouseTip,
      hashtags: ohouseTags,
    },
    youtube: {
      title: ytTitle,
      description: ytDesc,
      commentQuestionPrompt: ytPrompt,
      hashtags: ytTags,
    }
  };
};

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
  const [customTopic, setCustomTopic] = useState<string>(project.title || '아늑한 거실 룸투어');
  const [styleIndex, setStyleIndex] = useState<number>(0);

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleApplyGenerated = (topicToUse?: string, nextStyle?: number) => {
    const t = topicToUse !== undefined ? topicToUse : customTopic;
    const s = nextStyle !== undefined ? nextStyle : styleIndex;
    const generated = generateViralPlatformContent(t, s);

    setProject((prev) => ({
      ...prev,
      title: t.trim() ? t.trim() : prev.title,
      snsMetadata: {
        instagram: generated.instagram,
        ohouse: {
          ...prev.snsMetadata.ohouse,
          title: generated.ohouse.title,
          commentNotice: generated.ohouse.commentNotice,
          stylingTip: generated.ohouse.stylingTip,
          hashtags: generated.ohouse.hashtags,
        },
        youtube: generated.youtube,
      }
    }));
  };

  const handleRefresh = () => {
    const nextIdx = (styleIndex + 1) % VIRAL_STYLES.length;
    setStyleIndex(nextIdx);
    handleApplyGenerated(customTopic, nextIdx);
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

      {/* 💡 AI Topic Input & Viral Refresh Engine */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#23272A] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#23272A]" />
            <span>주제별 바이럴 맞춤 문구 생성기</span>
          </label>
          <span className="text-[11px] font-mono text-[#787774] bg-[#F1F1EF] px-2 py-0.5 rounded-md border border-[#E9E9E7]">
            스타일: {VIRAL_STYLES[styleIndex % VIRAL_STYLES.length].name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApplyGenerated(customTopic, styleIndex);
              }}
              placeholder="주제를 입력하세요 (예: 미니멀 주방 정리 꿀팁, 아늑한 거실 룸투어, 신혼집 셀프 인테리어)"
              className="w-full px-3.5 py-2.5 bg-[#F7F6F3] border border-[#EDEDEB] rounded-xl text-xs text-[#23272A] focus:outline-none focus:border-[#23272A]"
            />
          </div>

          <button
            onClick={() => handleApplyGenerated(customTopic, styleIndex)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#23272A] hover:bg-[#37352F] text-white font-medium text-xs transition-colors cursor-pointer shadow-xs shrink-0 leading-none"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>내용 생성</span>
          </button>

          <button
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] font-medium text-xs transition-colors cursor-pointer border border-[#EDEDEB] shrink-0 leading-none"
            title="다른 추천 문구 스타일로 새로고침"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>새로고침</span>
          </button>
        </div>

        {/* Popular Recommended Topic Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] text-[#9B9A97] font-medium mr-1">추천 주제:</span>
          {[
            '아늑한 거실 룸투어',
            '미니멀 주방 정리 팁',
            '호텔 같은 침실 인테리어',
            '감성 홈카페 꾸미기',
            '가성비 인테리어 꿀템 TOP 3',
            '24평 온라인 집들이'
          ].map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => {
                setCustomTopic(kw);
                handleApplyGenerated(kw, styleIndex);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#787774] hover:text-[#23272A] transition-colors cursor-pointer border border-transparent hover:border-[#EDEDEB] leading-none"
            >
              {kw}
            </button>
          ))}
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] font-medium text-xs border border-[#E3E2DE] leading-none cursor-pointer"
                title="다른 추천 문구로 새로고침"
              >
                <RotateCw className="w-3 h-3 shrink-0" />
                <span>새로고침</span>
              </button>
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] font-medium text-xs border border-[#E3E2DE] leading-none cursor-pointer"
                title="다른 추천 문구로 새로고침"
              >
                <RotateCw className="w-3 h-3 shrink-0" />
                <span>새로고침</span>
              </button>
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] font-medium text-xs border border-[#E3E2DE] leading-none cursor-pointer"
                title="다른 추천 문구로 새로고침"
              >
                <RotateCw className="w-3 h-3 shrink-0" />
                <span>새로고침</span>
              </button>
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
