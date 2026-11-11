export type UniversalCategory = 'all' | 'home' | 'daily' | 'kids' | 'cafe_travel';

export type PlatformTarget = 'all' | 'youtube' | 'instagram' | 'ohouse';

export type CanvasAspectRatio = '9:16' | '1:1' | '4:5' | '16:9';

export type AestheticFilter = 
  | 'none'
  | 'butter_warm'     // 🧈 버터 필터 (인스타 대세! 따스하고 부드러운 크리미 옐로우)
  | 'golden_hour'     // 🌅 골든 아워 (노을빛 감성 선셋 글로우)
  | 'soft_milk'       // 🥛 밀크 크림 (뽀얗고 맑은 피치 밀크 톤)
  | 'tokyo_mood'      // 🗼 도쿄 필름 (채도 뺀 차분하고 서정적인 무드)
  | 'vintage_film'    // 🎞️ 빈티지 90s (필름 카메라 아날로그 감성)
  | 'natural_clean'   // 🌿 내추럴 클린 (맑고 투명한 데일리 톤)
  | 'vivid_glow'      // ✨ 비비드 글로우 (생기 있고 화사한 톤)
  | 'pure_minimal';   // 🤍 퓨어 미니멀 (단정하고 깔끔한 화이트 톤)

export type MotionEffect = 
  | 'static'      // 정지
  | 'zoom_in'     // 천천히 줌인 (Ken Burns In)
  | 'zoom_out'    // 천천히 줌아웃 (Ken Burns Out)
  | 'pan_left'    // 좌➔우 서서히 이동
  | 'pan_right'   // 우➔좌 서서히 이동
  | 'fade';       // 부드러운 페이드

export interface ColorAdjustments {
  brightness: number; // -50 ~ +50 (0 is normal)
  contrast: number;   // -50 ~ +50 (0 is normal)
  saturation: number; // -50 ~ +50 (0 is normal)
  warmth: number;     // -50 ~ +50 (0 is normal, warm vs cool)
  vignette: number;   // 0 ~ 100 (비네팅 감성)
  blur: number;       // 0 ~ 20 (블러)
}

export type SubtitleFont = 
  | 'Pretendard' 
  | 'Gowun Dodum' 
  | 'Jua' 
  | 'Song Myung' 
  | 'Black Han Sans';

export interface TextTypography {
  fontFamily: SubtitleFont;
  fontSizeScale: number; // 0.8 ~ 1.5 (기본 1.0)
  textAlign: 'left' | 'center' | 'right';
  boxStyle: 'dark' | 'glass' | 'cream' | 'custom' | 'none';
  bgColor: string; // hex or rgba
  bgOpacity: number; // 0 ~ 100
  textColor: string;
  positionY: number; // 10 ~ 90% (기본 82%)
}

// 자유로운 다중 드래그 자막 아이템
export interface CustomSubtitle {
  id: string;
  text: string;
  x: number; // 0 ~ 100% (캔버스 가로 위치)
  y: number; // 0 ~ 100% (캔버스 세로 위치)
  rotation?: number; // -180 ~ 180도 회전
  fontFamily: SubtitleFont;
  fontSizeScale: number; // 0.8 ~ 1.6
  textColor: string;
  bgColor?: string;
  bgOpacity?: number; // 0 ~ 100
  boxStyle: 'dark' | 'glass' | 'cream' | 'custom' | 'none';
  textAlign: 'left' | 'center' | 'right';
  isCta?: boolean; // 댓글 유도 문구 여부
}

// 캡컷(CapCut) 스타일 전환 효과
export type TransitionEffect = 'none' | 'fade' | 'dissolve' | 'zoom' | 'slide_left' | 'flash';

// BGM 카테고리
export type BgmCategory = 'cafe' | 'kids' | 'healing' | 'travel' | 'trendy' | 'cinematic';

export interface BgmPresetItem {
  id: string;
  title: string;
  artist: string;
  category: BgmCategory;
  moodTag: string;
  emoji: string;
  duration: string;
  bpm: number;
  isCopyrightFree: boolean;
}

export type KidsStickerType = 
  | 'dday'         // D+100, D+365 등
  | 'month_badge'  // 6개월, 12개월 등
  | 'face_mask'    // 프라이버시 보호 얼굴 스티커
  | 'cute_bubble'  // 귀여운 말풍선 / 소통 유도 말풍선
  | 'deco';        // 하트, 별, 반짝이 등

export interface KidsSticker {
  id: string;
  x: number; // 0 ~ 100%
  y: number; // 0 ~ 100%
  type: KidsStickerType;
  icon?: string;
  text?: string;
  bgBubbleColor?: string;
  textColor?: string;
  size: number;
  rotation?: number;
}

export interface MediaScene {
  id: string;
  mediaType: 'image' | 'video';
  url: string;
  title: string;
  subtitle?: string;
  callToAction?: string; // 댓글/질문 유도 문구
  durationSec: number;
  kidsStickers: KidsSticker[];
  filter: AestheticFilter;
  
  // 자유로운 다중 자막 (드래그 이동 가능)
  customSubtitles?: CustomSubtitle[];

  // 캡컷(CapCut) 스타일 동영상 정밀 편집 필드
  speed?: number;             // 0.5 ~ 2.0 (배속)
  trimStart?: number;         // 시작 트리밍 (초)
  trimEnd?: number;           // 종료 트리밍 (초)
  volume?: number;            // 0 ~ 100 (비디오 원본 볼륨)
  isMuted?: boolean;          // 비디오 원본 음소거
  transition?: TransitionEffect; // 클립 전환 효과
  rotation?: number;          // 0, 90, 180, 270도 회전
  
  // 사진/영상 캔버스 내 직접 이동 & 확대/축소 (Pan & Zoom)
  zoom?: number;              // 1.0 ~ 3.0 (기본값 1.0)
  panX?: number;              // -50 ~ 50 (% offset, 기본값 0)
  panY?: number;              // -50 ~ 50 (% offset, 기본값 0)

  // 프로급 보정 & 연출 필드
  adjustments?: ColorAdjustments;
  motionEffect?: MotionEffect;
  typography?: TextTypography;
}

export interface BgmOption {
  id: string;
  title: string;
  artist: string;
  moodTag: string;
  url: string;
}

export interface HomeKidsProject {
  id: string;
  title: string;
  description: string;
  category: UniversalCategory;
  targetPlatforms: PlatformTarget[];
  aspectRatio: CanvasAspectRatio;
  scenes: MediaScene[];
  selectedBgmId?: string;
  bgmVolume?: number;
  createdAt: string;
  updatedAt: string;
  
  snsMetadata: {
    youtube: {
      title: string;
      description: string;
      commentQuestionPrompt: string;
      hashtags: string[];
    };
    instagram: {
      caption: string;
      commentTriggerHook: string;
      hashtags: string[];
    };
    ohouse: {
      title: string;
      spaceType: string;
      squareFootage?: string;
      stylingTip: string;
      commentNotice: string;
      hashtags: string[];
    };
  };
}

export interface QuickTemplate {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  category: UniversalCategory;
  targetPlatform: PlatformTarget;
  aspectRatio: CanvasAspectRatio;
  previewImage: string;
  sampleScenes: Partial<MediaScene>[];
  defaultMetadata: Partial<HomeKidsProject['snsMetadata']>;
}
