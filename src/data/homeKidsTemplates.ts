import { QuickTemplate, HomeKidsProject } from '../types/homeAndKids';

export const SAMPLE_HOME_KIDS_PROJECTS: HomeKidsProject[] = [
  {
    id: 'sample-project-home-1',
    title: '햇살이 드는 아늑한 거실 룸투어',
    description: '아이와 온 가족이 함께 머무는 따뜻한 거실 공간과 소소한 일상 기록',
    category: 'home',
    targetPlatforms: ['all', 'ohouse', 'instagram', 'youtube'],
    aspectRatio: '9:16',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scenes: [
      {
        id: 'scene-1',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        title: '포근한 햇살이 드는 공간',
        subtitle: '온 가족이 편안하게 머무는 중심 공간이에요',
        callToAction: '가구 정보는 댓글 남겨주시면 답글 드릴게요 🤍',
        durationSec: 4,
        filter: 'butter_warm',
        kidsStickers: []
      },
      {
        id: 'scene-2',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
        title: '정돈된 수납과 오브제 팁',
        subtitle: '작은 소품 하나로 일상의 분위기를 바꿔보았어요',
        callToAction: '수납 팁이나 정보는 댓글로 편하게 물어보세요!',
        durationSec: 4,
        filter: 'natural_clean',
        kidsStickers: []
      }
    ],
    snsMetadata: {
      youtube: {
        title: '감성 가득 룸투어 | 온기가 머무는 아늑한 공간 스타일링',
        description: '공간을 채우는 따뜻한 일상과 소소한 리빙 팁을 담았습니다.\n\n궁금하신 점은 언제든 댓글로 남겨주시면 정성껏 답글 드릴게요 ✨',
        commentQuestionPrompt: '📌 여러분이 가장 좋아하는 인테리어 포인트는 무엇인가요? 댓글로 이야기 나눠요!',
        hashtags: ['룸투어', '온라인집들이', '홈스타일링', '거실인테리어', '쇼츠']
      },
      instagram: {
        caption: `햇살이 가장 길게 머무는 오늘의 공간 🌿\n\n작은 조명과 패브릭 교체만으로도 집안 무드가 확 달라져서 기분이 몽글몽글해지네요 🤍\n\n사진 보시고 궁금하신 점은 댓글 남겨주시면 바로 알려드릴게요! 🕊️`,
        commentTriggerHook: '💬 소파나 조명 정보 궁금하신 분은 댓글 남겨주시면 바로 알려드려요!',
        hashtags: ['#홈스타그램', '#집꾸미기', '#오늘의집', '#룸투어', '#홈데코', '#감성인테리어']
      },
      ohouse: {
        title: '우드와 햇살이 머무는, 포근한 일상 공간 이야기',
        spaceType: '거실',
        squareFootage: '24평',
        stylingTip: '베이지 원목 톤을 중심으로 포근한 패브릭을 매치했습니다.',
        commentNotice: '소품이나 가구 정보 질문 환영해요 :)',
        hashtags: ['#온라인집들이', '#거실스타일링', '#오늘의집', '#홈스타일링']
      }
    }
  },
  {
    id: 'sample-project-vlog-1',
    title: '주말의 소소한 카페 투어 & 감성 브이로그',
    description: '나를 채우는 힐링 순간, 따스한 커피 한 잔과 편안한 오후의 기록',
    category: 'daily',
    targetPlatforms: ['all', 'instagram', 'youtube'],
    aspectRatio: '9:16',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scenes: [
      {
        id: 'scene-v1',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
        title: '마음이 쉬어가는 주말 오후',
        subtitle: '좋아하는 공간에서 즐기는 커피 한 잔의 여유',
        callToAction: '카페 위치 궁금하신 분 댓글 주세요 ☕',
        durationSec: 4,
        filter: 'golden_hour',
        kidsStickers: []
      }
    ],
    snsMetadata: {
      youtube: {
        title: '주말 힐링 브이로그 | 나만의 쉼표가 되어준 따뜻한 공간',
        description: '지친 한 주를 달래주는 소소한 일상 힐링 클립입니다 🌿',
        commentQuestionPrompt: '📌 여러분만의 주말 힐링 방식은 무엇인가요? 댓글로 공유해주세요!',
        hashtags: ['주말브이로그', '카페투어', '일상기록', '힐링쇼츠']
      },
      instagram: {
        caption: `바쁜 일상 속에 작은 쉼표를 찍어보는 주말 ☕✨\n\n흘러나오는 음악도, 창가로 스며드는 볕도 참 따뜻했던 곳.\n카페 정보 궁금하신 분들은 댓글 남겨주시면 DM 드릴게요 🤍`,
        commentTriggerHook: '💬 카페 위치나 정보 궁금하시면 댓글 주세요!',
        hashtags: ['#주말일상', '#카페스타그램', '#감성카페', '#일상기록', '#힐링타임']
      },
      ohouse: {
        title: '일상 속 쉼이 있는 공간 감성',
        spaceType: '거실/서재',
        stylingTip: '홈카페 존에 따뜻한 조명과 우드 트레이를 두어 분위기를 냈습니다.',
        commentNotice: '홈카페 용품 문의 댓글 환영합니다!',
        hashtags: ['#홈카페', '#오늘의집', '#일상기록']
      }
    }
  },
  {
    id: 'sample-project-kids-1',
    title: '율하의 첫 걸음마 도전 & 성장 순간',
    description: '뒤뚱뒤뚱 세 걸음 걸었던 날의 사랑스럽고 소중한 순간',
    category: 'kids',
    targetPlatforms: ['all', 'instagram', 'youtube'],
    aspectRatio: '9:16',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scenes: [
      {
        id: 'scene-k1',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
        title: '첫 걸음마 도전의 순간',
        subtitle: '엄마 손 놓고 세 걸음 걷기 직전의 표정 😆',
        callToAction: '육아맘님들 보통 몇 개월에 걸었나요? 댓글로 나눠요 💛',
        durationSec: 4,
        filter: 'butter_warm',
        kidsStickers: [
          {
            id: 'stk-1',
            x: 20,
            y: 18,
            type: 'dday',
            text: 'D+365 첫돌',
            bgBubbleColor: '#FFF1F2',
            textColor: '#E11D48',
            size: 55,
            rotation: -4
          }
        ]
      }
    ],
    snsMetadata: {
      youtube: {
        title: '첫 걸음마 순간! 12개월 아기가 혼자 걸어오는 날 (심쿵주의)',
        description: '드디어 손을 놓고 아장아장 세 걸음을 걸었어요! 감동과 웃음이 가득했던 순간을 기록합니다.',
        commentQuestionPrompt: '📌 육아맘님들의 아가들은 언제 첫 걸음마를 뗐나요? 댓글로 소통해요!',
        hashtags: ['육아일기', '첫걸음마', '12개월아기', '아기쇼츠', '육아소통']
      },
      instagram: {
        caption: `세상에... 드디어 우리 아가가 첫 걸음마를 뗐어요 😭👣✨\n\n선배 육아맘님들은 아기 첫 신발 어디서 사주셨나요? 첫 걸음마 신발 브랜드 추천 댓글로 마구마구 남겨주세요 💛`,
        commentTriggerHook: '💬 걸음마 신발 추천이나 육아 소통 댓글 환영해요!',
        hashtags: ['#생후12개월', '#첫걸음마', '#돌끝맘', '#육아스타그램', '#아기성장일기', '#육아소통']
      },
      ohouse: {
        title: '아이 있는 집 거실 매트와 안전 동선 노하우',
        spaceType: '아이방',
        stylingTip: '걸음마 시작할 때는 바닥 틈새 없는 논슬립 롤매트와 둥근 모서리 가구가 필수입니다.',
        commentNotice: '매트 시공 팁 궁금하신 점은 댓글로 물어봐주세요 :)',
        hashtags: ['#아이있는집', '#아기방인테리어', '#오늘의집']
      }
    }
  }
];

export const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    id: 'tpl-daily-aesthetic-vlog',
    title: '감성 일상 & 주말 브이로그',
    subtitle: '카페, 여행, 소소한 일상을 시네마틱한 무드로 완성하는 템플릿',
    badge: '인기 템플릿',
    category: 'daily',
    targetPlatform: 'all',
    aspectRatio: '9:16',
    previewImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    sampleScenes: [
      {
        title: '마음이 쉬어가는 순간',
        subtitle: '따스한 햇살과 커피 한 잔의 여유',
        callToAction: '카페 위치 궁금하신 분 댓글 주세요 ☕',
        durationSec: 4,
        filter: 'golden_hour'
      }
    ],
    defaultMetadata: {
      instagram: {
        caption: `바쁜 일상 속에 마주한 소소한 쉼표 🌿✨\n\n카페 위치나 궁금하신 점은 댓글 남겨주시면 바로 알려드릴게요!`,
        commentTriggerHook: '💬 궁금하신 점은 편하게 댓글로 남겨주세요!',
        hashtags: ['#일상기록', '#감성브이로그', '#카페스타그램', '#힐링', '#릴스']
      },
      youtube: {
        title: '소소하지만 따뜻한 일상 브이로그 | 나만의 쉼표',
        description: '하루의 끝, 작은 위로가 되어주는 일상의 순간들을 담았습니다.',
        commentQuestionPrompt: '📌 여러분의 소중한 힐링 장소는 어디인가요? 댓글로 들려주세요!',
        hashtags: ['브이로그', '일상쇼츠', '카페투어', '힐링쇼츠']
      },
      ohouse: {
        title: '홈카페 & 일상 감성 공간',
        spaceType: '거실',
        stylingTip: '작은 테이블과 은은한 조명으로 나만의 홈카페를 연출해보세요.',
        commentNotice: '소품 정보 질문 환영합니다 :)',
        hashtags: ['#홈카페', '#오늘의집', '#인테리어소품']
      }
    }
  },
  {
    id: 'tpl-home-clean-minimal',
    title: '감성 룸투어 & 홈스타일링',
    subtitle: '조명, 가구, 패브릭으로 완성한 감성 공간 숏폼',
    badge: '홈&리빙 추천',
    category: 'home',
    targetPlatform: 'all',
    aspectRatio: '9:16',
    previewImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    sampleScenes: [
      {
        title: '온기가 머무는 우리 집',
        subtitle: '작은 변화로 완성한 아늑한 무드',
        callToAction: '가구 정보는 댓글 남겨주시면 알려드릴게요 🤍',
        durationSec: 4,
        filter: 'butter_warm'
      }
    ],
    defaultMetadata: {
      instagram: {
        caption: `드디어 정돈된 침실 무드 🕊️\n따뜻한 간접조명을 켜두면 하루 피로가 사르르 녹아내려요.\n\n조명이나 베딩 정보 궁금하시면 편하게 댓글 남겨주세요 🤍`,
        commentTriggerHook: '💬 궁금하신 점은 댓글로 남겨주시면 바로 알려드려요!',
        hashtags: ['#홈스타그램', '#침실인테리어', '#집꾸미기', '#오늘의집', '#룸투어']
      },
      youtube: {
        title: '소소하지만 따뜻한 룸투어 | 아늑한 방 꾸미기',
        description: '영상 속 궁금하신 제품은 댓글로 질문해주시면 정성껏 답변 남겨드리겠습니다 :)',
        commentQuestionPrompt: '📌 여러분이 가장 좋아하는 인테리어 포인트는 무엇인가요? 댓글로 이야기 나눠요!',
        hashtags: ['룸투어', '방꾸미기', '홈스타일링', '쇼츠']
      },
      ohouse: {
        title: '간접조명으로 완성한 차분한 침실 스타일링',
        spaceType: '침실',
        stylingTip: '메인등 대신 웜톤 스탠드 2개를 배치해 은은한 휴식 공간을 연출했습니다.',
        commentNotice: '제품 정보나 인테리어 팁 질문 댓글 환영합니다 :)',
        hashtags: ['#침실꾸미기', '#조명인테리어', '#오늘의집']
      }
    }
  },
  {
    id: 'tpl-kids-growth-diary',
    title: 'D-Day & 개월수 감성 성장일기',
    subtitle: '백일, 첫돌, 개월수 배지와 소통형 자막으로 남기는 우리 아기 순간',
    badge: '키즈 추천',
    category: 'kids',
    targetPlatform: 'instagram',
    aspectRatio: '9:16',
    previewImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    sampleScenes: [
      {
        title: '오늘의 사랑스러운 순간',
        subtitle: '하루하루 쑥쑥 자라는 우리 보물',
        callToAction: '육아맘님들 댓글로 함께 소통해요 💛',
        durationSec: 4,
        filter: 'butter_warm'
      }
    ],
    defaultMetadata: {
      instagram: {
        caption: `너와 함께하는 매 순간이 반짝반짝 빛나는 기적 💛\n오늘도 건강하게 웃어줘서 고마워 우리 아가!\n\n육아맘님들 요즘 아기 낮잠 패턴은 어떠신가요? 댓글로 소통해요 🕊️`,
        commentTriggerHook: '💬 같은 개월수 키우시는 육아맘님들 댓글로 소통해요!',
        hashtags: ['#육아일기', '#성장기록', '#베이비스타그램', '#인스타베이비', '#도치맘', '#육아소통']
      },
      youtube: {
        title: '아기 성장 브이로그 | 100일의 기적부터 오늘까지의 소중한 기록',
        description: '소중한 아기의 순간들을 따뜻하게 담았습니다. 육아 꿀팁 댓글 언제든 환영합니다 🍼',
        commentQuestionPrompt: '📌 여러분의 아기 성장 꿀팁을 댓글로 나눠주세요!',
        hashtags: ['아기성장', '육아브이로그', '아기쇼츠', '귀여운아기', '육아소통']
      },
      ohouse: {
        title: '아기 있는 집의 안전하고 깔끔한 놀이 공간',
        spaceType: '아이방',
        stylingTip: '가구 모서리 쿠션과 무소음 롤매트로 안전과 층간소음을 동시에 잡았습니다.',
        commentNotice: '시공 매트나 가구 정보는 댓글로 편하게 물어보세요!',
        hashtags: ['#아이있는집', '#아기방인테리어', '#오늘의집']
      }
    }
  }
];

export interface StickerCategoryGroup {
  id: 'face_mask' | 'deco' | 'milestone' | 'bubble';
  label: string;
  icon: string;
  items: {
    icon: string;
    label: string;
    type: 'face_mask' | 'deco' | 'dday' | 'month_badge' | 'cute_bubble';
    text?: string;
    bgBubbleColor?: string;
    textColor?: string;
  }[];
}

export const CUTE_STICKER_CATEGORIES: StickerCategoryGroup[] = [
  {
    id: 'face_mask',
    label: '얼굴 안심 마스크',
    icon: '🛡️',
    items: [
      { icon: '🐻', label: '곰돌이', type: 'face_mask' },
      { icon: '🐰', label: '토끼', type: 'face_mask' },
      { icon: '🐱', label: '야옹이', type: 'face_mask' },
      { icon: '🐶', label: '멍멍이', type: 'face_mask' },
      { icon: '🐥', label: '병아리', type: 'face_mask' },
      { icon: '🐼', label: '판다', type: 'face_mask' },
      { icon: '🦊', label: '아기 여우', type: 'face_mask' },
      { icon: '🐨', label: '코알라', type: 'face_mask' },
      { icon: '🌸', label: '벚꽃 블러', type: 'face_mask' },
      { icon: '😊', label: '스마일 블러', type: 'face_mask' },
      { icon: '🤍', label: '화이트 하트', type: 'face_mask' },
      { icon: '🕶️', label: '힙 썬글라스', type: 'face_mask' },
    ]
  },
  {
    id: 'deco',
    label: '감성 데코 & 오브제',
    icon: '✨',
    items: [
      { icon: '✨', label: '반짝반짝', type: 'deco' },
      { icon: '🤍', label: '화이트 하트', type: 'deco' },
      { icon: '💖', label: '핑크 하트', type: 'deco' },
      { icon: '🎀', label: '러블리 리본', type: 'deco' },
      { icon: '🌿', label: '내추럴 리프', type: 'deco' },
      { icon: '☕', label: '홈카페 머그', type: 'deco' },
      { icon: '🥐', label: '크루아상', type: 'deco' },
      { icon: '🧁', label: '컵케이크', type: 'deco' },
      { icon: '🧸', label: '테디베어', type: 'deco' },
      { icon: '🎈', label: '파티 풍선', type: 'deco' },
      { icon: '🍰', label: '딸기 케이크', type: 'deco' },
      { icon: '🍓', label: '생딸기', type: 'deco' },
      { icon: '🌈', label: '무지개', type: 'deco' },
      { icon: '☁️', label: '몽실 구름', type: 'deco' },
      { icon: '🌙', label: '초승달', type: 'deco' },
      { icon: '⭐', label: '별똥별', type: 'deco' },
    ]
  },
  {
    id: 'milestone',
    label: 'D-Day & 성장 배지',
    icon: '🎂',
    items: [
      { icon: '🎉', label: 'D+50', text: 'D+50', type: 'dday', bgBubbleColor: '#FFF1F2', textColor: '#BE123C' },
      { icon: '🎉', label: 'D+100 백일', text: 'D+100', type: 'dday', bgBubbleColor: '#FEF3C7', textColor: '#B45309' },
      { icon: '🎈', label: 'D+200', text: 'D+200', type: 'dday', bgBubbleColor: '#EFF6FF', textColor: '#1D4ED8' },
      { icon: '🎂', label: 'D+300', text: 'D+300', type: 'dday', bgBubbleColor: '#F3E8FF', textColor: '#6B21A8' },
      { icon: '👑', label: 'D+365 첫돌', text: 'D+365 첫돌 🎉', type: 'dday', bgBubbleColor: '#FFFBEB', textColor: '#92400E' },
      { icon: '🌱', label: '생후 1개월', text: '생후 1개월', type: 'month_badge', bgBubbleColor: '#F0FDF4', textColor: '#15803D' },
      { icon: '🍼', label: '생후 3개월', text: '생후 3개월', type: 'month_badge', bgBubbleColor: '#FEF9C3', textColor: '#854D0E' },
      { icon: '👣', label: '생후 6개월', text: '생후 6개월', type: 'month_badge', bgBubbleColor: '#FDF2F8', textColor: '#9D174D' },
      { icon: '🐥', label: '생후 9개월', text: '생후 9개월', type: 'month_badge', bgBubbleColor: '#FFF7ED', textColor: '#C2410C' },
      { icon: '👣', label: '생후 12개월', text: '생후 12개월', type: 'month_badge', bgBubbleColor: '#EFF6FF', textColor: '#1E40AF' },
      { icon: '🌟', label: '생후 24개월', text: '생후 24개월', type: 'month_badge', bgBubbleColor: '#F5F3FF', textColor: '#5B21B6' },
      { icon: '👣', label: '첫 걸음마 성공', text: '첫 걸음마 성공! 👣', type: 'month_badge', bgBubbleColor: '#FEF08A', textColor: '#854D0E' },
    ]
  },
  {
    id: 'bubble',
    label: '소통 & 감성 말풍선',
    icon: '💬',
    items: [
      { icon: '💬', label: '정보는 댓글로', text: '정보는 댓글로 알려드려요 🤍', type: 'cute_bubble', bgBubbleColor: '#FFFFFF', textColor: '#0F172A' },
      { icon: '💬', label: '댓글로 소통해요', text: '댓글로 함께 소통해요 💛', type: 'cute_bubble', bgBubbleColor: '#FFFFFF', textColor: '#0F172A' },
      { icon: '💬', label: '궁금하신 점 문의', text: '궁금하신 점은 댓글 주세요 🕊️', type: 'cute_bubble', bgBubbleColor: '#FFFFFF', textColor: '#0F172A' },
      { icon: '💬', label: '육아맘 소통', text: '선배 육아맘 조언 구해요 🍼', type: 'cute_bubble', bgBubbleColor: '#FFFFFF', textColor: '#0F172A' },
      { icon: '💬', label: '오늘도 수고했어', text: '오늘 하루도 수고했어요 ✨', type: 'cute_bubble', bgBubbleColor: '#FFFFFF', textColor: '#0F172A' },
      { icon: '💬', label: '엄마 사랑해요', text: '엄마 사랑해요 💛', type: 'cute_bubble', bgBubbleColor: '#FFF1F2', textColor: '#BE123C' },
      { icon: '💬', label: '맘마 냠냠', text: '맘마 맛있어요 냠냠 🍓', type: 'cute_bubble', bgBubbleColor: '#FEF3C7', textColor: '#B45309' },
      { icon: '💬', label: '신난다~', text: '우와 신난다~ 🎈', type: 'cute_bubble', bgBubbleColor: '#EFF6FF', textColor: '#1D4ED8' },
    ]
  }
];

// Flat list for fallback compatibility
export const CUTE_STICKER_PRESETS = CUTE_STICKER_CATEGORIES.flatMap((c) => c.items);

import { BgmPresetItem, BgmCategory } from '../types/homeAndKids';

export interface BgmPreset extends BgmPresetItem {}

export const BGM_CATEGORIES = [
  { id: 'all', label: '전체 보기', icon: '🎵' },
  { id: 'cafe', label: '감성 & 홈카페', icon: '☕' },
  { id: 'kids', label: '키즈 & 성장', icon: '🧸' },
  { id: 'healing', label: '힐링 & 룸투어', icon: '🌿' },
  { id: 'travel', label: '여행 & 브이로그', icon: '✈️' },
  { id: 'trendy', label: '릴스 팝 & 비트', icon: '⚡' },
  { id: 'cinematic', label: '시네마틱 무드', icon: '🌙' },
];

export const POPULAR_BGM_PRESETS: BgmPresetItem[] = [
  // 1. 감성 & 홈카페 (Cafe)
  { id: 'bgm-cozy-lofi', title: '포근한 햇살 로파이', artist: 'Yulha Chill', category: 'cafe', moodTag: '릴스/홈카페', emoji: '☕', duration: '0:45', bpm: 80, isCopyrightFree: true },
  { id: 'bgm-cafe-jazz', title: '오후의 나른한 카페 재즈', artist: 'Blue Velvet', category: 'cafe', moodTag: '브이로그/감성', emoji: '🎷', duration: '1:10', bpm: 72, isCopyrightFree: true },
  { id: 'bgm-latte-foam', title: '따뜻한 라떼 한 잔', artist: 'Cozy Table', category: 'cafe', moodTag: '인테리어/일상', emoji: '🥛', duration: '0:55', bpm: 84, isCopyrightFree: true },
  { id: 'bgm-window-sun', title: '창가에 내리는 햇살', artist: 'Sunny Side', category: 'cafe', moodTag: '모닝루틴/감성', emoji: '🪟', duration: '1:05', bpm: 86, isCopyrightFree: true },
  { id: 'bgm-sunday-peace', title: '일요일 아침의 여유', artist: 'Sunday Morning', category: 'cafe', moodTag: '주말/브런치', emoji: '🥞', duration: '0:50', bpm: 78, isCopyrightFree: true },
  { id: 'bgm-nordic-wood', title: '우드톤 거실의 잔향', artist: 'Nordic Tone', category: 'cafe', moodTag: '오늘의집/홈스타일', emoji: '🪵', duration: '1:15', bpm: 75, isCopyrightFree: true },

  // 2. 키즈 & 성장 & 귀여움 (Kids)
  { id: 'bgm-cute-orgel', title: '사랑스런 아기 오르골', artist: 'Little Angel', category: 'kids', moodTag: '키즈/성장일기', emoji: '🧸', duration: '0:40', bpm: 68, isCopyrightFree: true },
  { id: 'bgm-playful-kids', title: '우당탕탕 신나는 발걸음', artist: 'Happy Kiddo', category: 'kids', moodTag: '놀이터/장난감', emoji: '🎈', duration: '0:50', bpm: 105, isCopyrightFree: true },
  { id: 'bgm-bubble-time', title: '퐁당퐁당 목욕 버블 타임', artist: 'Bubble Joy', category: 'kids', moodTag: '목욕/귀여움', emoji: '🛁', duration: '0:48', bpm: 98, isCopyrightFree: true },
  { id: 'bgm-first-steps', title: '아장아장 첫 걸음마', artist: 'First Steps', category: 'kids', moodTag: '성장/돌잔치/D-Day', emoji: '👣', duration: '1:00', bpm: 76, isCopyrightFree: true },
  { id: 'bgm-sweet-lullaby', title: '달콤한 낮잠 자장가', artist: 'Sweet Lullaby', category: 'kids', moodTag: '수면/힐링베이비', emoji: '🌙', duration: '1:20', bpm: 60, isCopyrightFree: true },
  { id: 'bgm-toyland-march', title: '장난감 마을 탐험대', artist: 'Toyland March', category: 'kids', moodTag: '육아/일상쇼츠', emoji: '🎪', duration: '0:52', bpm: 112, isCopyrightFree: true },

  // 3. 힐링 & 내추럴 & 룸투어 (Healing)
  { id: 'bgm-acoustic-morning', title: '어쿠스틱 모닝 햇살', artist: 'Sunny Breeze', category: 'healing', moodTag: '룸투어/홈스타일링', emoji: '🌿', duration: '0:58', bpm: 82, isCopyrightFree: true },
  { id: 'bgm-sunset-lofi', title: '노을 지는 저녁의 쉼표', artist: 'Sunset Beats', category: 'healing', moodTag: '골든아워/힐링', emoji: '🌅', duration: '1:02', bpm: 74, isCopyrightFree: true },
  { id: 'bgm-forest-balcony', title: '숲속 테라스 바람 소리', artist: 'Forest Breeze', category: 'healing', moodTag: '플랜테리어/가드닝', emoji: '🪴', duration: '1:10', bpm: 70, isCopyrightFree: true },
  { id: 'bgm-pure-minimal', title: '마음이 머무는 미니멀룸', artist: 'Pure Minimal', category: 'healing', moodTag: '정리/온라인집들이', emoji: '🤍', duration: '0:54', bpm: 80, isCopyrightFree: true },
  { id: 'bgm-rain-waltz', title: '비 오는 날의 피아노 왈츠', artist: 'Rainy Piano', category: 'healing', moodTag: '비오는날/서정', emoji: '🌧️', duration: '1:15', bpm: 66, isCopyrightFree: true },
  { id: 'bgm-ocean-acoustic', title: '잔잔한 파도와 어쿠스틱', artist: 'Ocean Chords', category: 'healing', moodTag: '휴식/바다멍', emoji: '🌊', duration: '1:05', bpm: 72, isCopyrightFree: true },

  // 4. 여행 & 데일리 브이로그 (Travel)
  { id: 'bgm-road-trip', title: '드라이브와 선글라스', artist: 'Road Trip', category: 'travel', moodTag: '드라이브/여행', emoji: '🚗', duration: '0:45', bpm: 116, isCopyrightFree: true },
  { id: 'bgm-tokyo-sunset', title: '골목길 필름 카메라', artist: 'Tokyo Nostalgia', category: 'travel', moodTag: '해외여행/도쿄', emoji: '🗼', duration: '1:00', bpm: 88, isCopyrightFree: true },
  { id: 'bgm-jeju-breeze', title: '제주 바다와 돌담길', artist: 'Jeju Wave', category: 'travel', moodTag: '제주도/국내여행', emoji: '🍊', duration: '0:55', bpm: 90, isCopyrightFree: true },
  { id: 'bgm-camping-fire', title: '주말 감성 캠핑로그', artist: 'Campfire Log', category: 'travel', moodTag: '캠핑/차박/불멍', emoji: '🏕️', duration: '1:12', bpm: 82, isCopyrightFree: true },
  { id: 'bgm-checkin-vibes', title: '호캉스 체크인의 설렘', artist: 'Check-in Suite', category: 'travel', moodTag: '호캉스/휴가', emoji: '🏨', duration: '0:48', bpm: 102, isCopyrightFree: true },
  { id: 'bgm-departure-gate', title: '공항으로 향하는 설렘', artist: 'Departure Sky', category: 'travel', moodTag: '비행기/출발', emoji: '🛫', duration: '0:56', bpm: 108, isCopyrightFree: true },

  // 5. 트렌디 비트 & 릴스 팝 (Trendy)
  { id: 'bgm-pop-drop', title: '통통 튀는 숏폼 릴스 팝', artist: 'Pop Drop', category: 'trendy', moodTag: '인스타릴스/챌린지', emoji: '⚡', duration: '0:35', bpm: 122, isCopyrightFree: true },
  { id: 'bgm-urban-funk', title: '트렌디 펑키 그루브', artist: 'Urban Funk', category: 'trendy', moodTag: '패션/OOTD', emoji: '🕺', duration: '0:42', bpm: 118, isCopyrightFree: true },
  { id: 'bgm-viral-beats', title: '인스타 하트 바이럴 훅', artist: 'Viral Beats', category: 'trendy', moodTag: '알고리즘추천/후킹', emoji: '❤️', duration: '0:38', bpm: 124, isCopyrightFree: true },
  { id: 'bgm-chillhop-neo', title: '네온사인 칠홉 힙스터', artist: 'Chillhop Neo', category: 'trendy', moodTag: '쇼츠/모던라이프', emoji: '🌃', duration: '0:50', bpm: 92, isCopyrightFree: true },
  { id: 'bgm-step-clap', title: '스텝 업 클랩 앤 비트', artist: 'Clap Beat', category: 'trendy', moodTag: '활기찬일상/운동', emoji: '👏', duration: '0:40', bpm: 120, isCopyrightFree: true },
  { id: 'bgm-shiny-day', title: '샤이니 데이 서머 팝', artist: 'Shiny Sunny', category: 'trendy', moodTag: '썸머/데이트', emoji: '✨', duration: '0:44', bpm: 115, isCopyrightFree: true },

  // 6. 시네마틱 & 무드 (Cinematic)
  { id: 'bgm-golden-memoir', title: '빛나는 순간의 기억', artist: 'Golden Memoir', category: 'cinematic', moodTag: '감동/추억기록', emoji: '🎞️', duration: '1:25', bpm: 64, isCopyrightFree: true },
  { id: 'bgm-film-1998', title: '필름 카메라 1998', artist: 'Analog 1998', category: 'cinematic', moodTag: '레트로/아날로그', emoji: '📸', duration: '1:08', bpm: 72, isCopyrightFree: true },
  { id: 'bgm-midnight-piano', title: '새벽 감성 피아노 에튀드', artist: 'Midnight Melody', category: 'cinematic', moodTag: '새벽/감성독백', emoji: '🎹', duration: '1:30', bpm: 58, isCopyrightFree: true },
  { id: 'bgm-four-seasons', title: '우리의 아름다운 사계절', artist: 'Four Seasons', category: 'cinematic', moodTag: '가족영화/연말결산', emoji: '🌸', duration: '1:20', bpm: 70, isCopyrightFree: true },
  { id: 'bgm-warm-cinematic', title: '영화 속 한 장면처럼', artist: 'Warm Cinema', category: 'cinematic', moodTag: '시네마틱/티저', emoji: '🎬', duration: '1:14', bpm: 68, isCopyrightFree: true },
  { id: 'bgm-timeless-memory', title: '영원히 기억될 오늘', artist: 'Timeless Tone', category: 'cinematic', moodTag: '스페셜데이/기념일', emoji: '💎', duration: '1:18', bpm: 65, isCopyrightFree: true },
];
