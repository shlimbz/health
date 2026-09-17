/**
 * characters.js
 * -----------------------------------------------------------------------
 * 캐릭터 데이터 전용 파일.
 *
 * ⚠️ 참고: 아래 45개 캐릭터는 각 원작사(치이카와/산리오 계열, 디즈니, 픽사 등)가
 * 권리를 가진 이름입니다. 개인적으로 테스트해보거나 구조를 검증하는 용도로는
 * 문제가 없지만, 실제 서비스로 공개/배포한다면 이름과 이미지를 자체 제작
 * 캐릭터로 교체하는 것을 권장합니다.
 *
 * - personality 값의 범위는 질문 데이터와 동일하게 -2 ~ +2 를 기준으로 하되,
 *   캐릭터 수가 많아진 만큼 0.5 단위의 세분화된 값을 사용해 서로 겹치지
 *   않도록 배치했다.
 * - family: 같은 세계관/브랜드로 묶기 위한 그룹 키. 결과 화면이나 향후
 *   "세계관별로 캐릭터 뽑기" 같은 기능에 활용할 수 있다.
 * -----------------------------------------------------------------------
 */

/**
 * 캐릭터 사진을 저장해둘 기본 경로.
 *
 * 사진 파일들을 별도 폴더/경로에 저장할 계획이라면 이 값 하나만 바꾸면
 * 모든 캐릭터의 이미지 경로가 한 번에 바뀐다. 예:
 *   - 같은 저장소 안의 images 폴더    -> "images/"
 *   - assets/characters 폴더         -> "assets/characters/"
 *   - 별도 CDN/외부 저장소에 올린 경우 -> "https://내도메인.com/characters/"
 *
 * 각 캐릭터의 personality.image 값에는 파일명만 적어두고,
 * 실제 경로가 필요할 때는 getCharacterImageUrl(character)를 사용한다.
 */
const CHARACTER_IMAGE_BASE = "images/";

function getCharacterImageUrl(character) {
  if (!character || !character.image) return "";
  return CHARACTER_IMAGE_BASE + character.image;
}

const CHARACTER_SETS = {
  default: [
    /* ------------------------- 치이카와 세계관 ------------------------- */
    {
      id: "chiikawa",
      name: "치이카와",
      emoji: "🐹",
      image: "chiikawa.webp",
      family: "치이카와 세계관",
      personality: { energy: -1, sense: -1, emotion: 1.5, lifestyle: -1.5 },
      tagline: "겁은 많지만 오늘도 묵묵히 노력하는 타입",
      description:
        "잘 해낼 수 있을지 늘 걱정이 많지만, 그래도 매번 성실하게 최선을 다하는 타입이에요. 낯선 상황 앞에서는 잔뜩 긴장하지만, 곁에 있는 사람들 덕분에 조금씩 용기를 내요.",
      traits: ["새로운 일 앞에서 걱정이 앞서요", "그래도 끝까지 열심히 해내요", "친한 사람 앞에서만 마음을 열어요"],
      reasons: ["안전하고 확실한 선택을 자주 골랐어요", "감정을 쉽게 드러내는 편이었어요", "무리하게 나서기보다 조심스럽게 행동했어요"]
    },
    {
      id: "hachiware",
      name: "하치와레",
      emoji: "🐱",
      image: "hachiware.webp",
      family: "치이카와 세계관",
      personality: { energy: 1.5, sense: 1, emotion: 1, lifestyle: 1 },
      tagline: "밝은 에너지로 친구를 챙기는 든든한 무드메이커",
      description:
        "똑똑하고 눈치가 빨라서 분위기를 잘 살피고, 주변 친구들을 자연스럽게 챙기는 타입이에요. 긍정적인 태도로 힘든 상황도 가볍게 풀어내는 힘이 있어요.",
      traits: ["분위기를 빠르게 파악해요", "친구를 먼저 챙기는 편이에요", "웬만한 일은 긍정적으로 넘겨요"],
      reasons: ["사람들과 함께 있을 때 에너지를 얻었어요", "적당히 눈치를 보면서도 먼저 다가갔어요", "감정 표현이 자연스러운 편이었어요"]
    },
    {
      id: "usagi",
      name: "우사기",
      emoji: "🐰",
      image: "usagi.webp",
      family: "치이카와 세계관",
      personality: { energy: 1, sense: -1, emotion: 0, lifestyle: 2 },
      tagline: "일단 몸이 먼저 움직이는 자유로운 행동파",
      description:
        "생각보다 행동이 먼저 나가는 통통 튀는 타입이에요. 정해진 틀이나 눈치 보는 것과는 거리가 멀고, 하고 싶은 걸 즉흥적으로 밀어붙이는 에너지가 매력이에요.",
      traits: ["일단 저지르고 봐요", "눈치 안 보고 하고 싶은 대로 해요", "가만히 있는 걸 못 견뎌요"],
      reasons: ["망설임 없이 즉흥적인 선택을 했어요", "계획보다 그 순간의 재미를 따랐어요", "행동으로 먼저 부딪히는 쪽을 골랐어요"]
    },
    {
      id: "momonga",
      name: "모몽가",
      emoji: "🐿️",
      image: "momonga.webp",
      family: "치이카와 세계관",
      personality: { energy: 1.5, sense: 1, emotion: 1, lifestyle: 1.5 },
      tagline: "존재감을 뽐내는 걸 즐기는 자기표현형",
      description:
        "관심받는 걸 즐기고, 자기만의 매력을 적극적으로 드러내는 타입이에요. 유쾌하고 자유분방해서 어디서든 눈에 띄는 존재가 돼요.",
      traits: ["관심받는 걸 즐겨요", "자기 매력을 잘 어필해요", "즉흥적이고 자유분방해요"],
      reasons: ["먼저 나서서 자기 이야기를 꺼냈어요", "감정과 취향을 솔직하게 드러냈어요", "틀에 얽매이지 않고 자유롭게 행동했어요"]
    },
    {
      id: "rakko",
      name: "랏코",
      emoji: "🦦",
      image: "rakko.webp",
      family: "치이카와 세계관",
      personality: { energy: 1, sense: -1, emotion: -1, lifestyle: -1 },
      tagline: "든든하게 무리를 이끄는 신뢰형 리더",
      description:
        "차분하면서도 필요할 때는 앞장서서 사람들을 이끄는 타입이에요. 감정에 휘둘리기보다 안정적인 판단으로 주변에 신뢰를 줘요.",
      traits: ["필요할 때 앞장서요", "감정보다 안정적인 판단을 우선해요", "주변 사람들이 잘 따르는 편이에요"],
      reasons: ["문제가 생기면 앞장서서 해결하려 했어요", "감정보다 현실적인 선택을 했어요", "안정적인 방식으로 상황을 이끌었어요"]
    },
    {
      id: "kurimanju",
      name: "쿠리만쥬",
      emoji: "🌰",
      image: "kurimanju.webp",
      family: "치이카와 세계관",
      personality: { energy: -1.5, sense: -1.5, emotion: 0, lifestyle: 0.5 },
      tagline: "서두르지 않고 내 속도로 사는 여유형",
      description:
        "굳이 애쓰지 않고 느긋하게 흘러가는 대로 사는 타입이에요. 혼자만의 편안한 리듬을 소중히 여기고, 여유로운 태도로 주변까지 편안하게 만들어요.",
      traits: ["서두르는 법이 없어요", "혼자 있는 시간이 편안해요", "느긋한 리듬을 좋아해요"],
      reasons: ["급하게 움직이기보다 여유롭게 대처했어요", "혼자만의 시간을 자연스럽게 선택했어요", "정해진 틀보다 편한 흐름을 따랐어요"]
    },
    {
      id: "shisa",
      name: "시사",
      emoji: "🦁",
      image: "shisa.webp",
      family: "치이카와 세계관",
      personality: { energy: -1, sense: -1, emotion: -1, lifestyle: -1.5 },
      tagline: "묵묵히 자기 몫을 해내는 성실한 노력형",
      description:
        "티 내지 않고 꾸준히 자기 할 일을 해내는 타입이에요. 감정보다 책임감을 우선시하고, 정해진 루틴 안에서 안정적으로 실력을 쌓아가요.",
      traits: ["꾸준하고 성실해요", "책임감이 강한 편이에요", "정해진 루틴을 소중히 여겨요"],
      reasons: ["계획을 세우고 차근차근 따르는 편이었어요", "감정보다 해야 할 일을 우선했어요", "묵묵히 노력하는 선택을 자주 했어요"]
    },
    {
      id: "kanichan",
      name: "카니짱",
      emoji: "🦀",
      image: "kanichan.webp",
      family: "치이카와 세계관",
      personality: { energy: -1.5, sense: 1, emotion: 1.5, lifestyle: -1 },
      tagline: "다정하게 곁을 살피는 차분한 배려꾼",
      description:
        "나서서 주목받기보다 조용히 주변을 살피고 챙기는 타입이에요. 다른 사람의 감정 변화를 잘 알아차리고 부드럽게 다가가요.",
      traits: ["주변을 조용히 살펴요", "다정하고 배려심이 많아요", "차분한 태도를 유지해요"],
      reasons: ["고민을 들을 때 공감을 먼저 건넸어요", "나서기보다 조용히 챙기는 쪽을 택했어요", "안정적이고 다정한 방식으로 행동했어요"]
    },

    /* -------------------------- 디즈니 클래식 -------------------------- */
    {
      id: "winnie-pooh",
      name: "곰돌이 푸",
      emoji: "🐻",
      image: "winnie-pooh.webp",
      family: "디즈니 클래식",
      personality: { energy: -0.5, sense: -1, emotion: 1, lifestyle: 1.5 },
      tagline: "소소한 행복을 아는 느긋한 평화주의자",
      description:
        "서두르는 법이 없고, 작은 것에서도 행복을 찾아내는 타입이에요. 욕심 부리지 않고 지금 이 순간을 편안하게 즐기는 여유가 매력이에요.",
      traits: ["느긋하고 여유로워요", "작은 행복에 만족해요", "다투는 것보다 평화를 좋아해요"],
      reasons: ["서두르지 않고 천천히 움직였어요", "복잡한 계산 없이 마음 가는 대로 행동했어요", "편안하고 안정적인 분위기를 좋아했어요"]
    },
    {
      id: "mickey",
      name: "미키 마우스",
      emoji: "🐭",
      image: "mickey.webp",
      family: "디즈니 클래식",
      personality: { energy: 2, sense: 0, emotion: 1, lifestyle: 1 },
      tagline: "누구와도 잘 지내는 사교적인 긍정왕",
      description:
        "사람들과 함께 있을 때 가장 밝게 빛나는 타입이에요. 긍정적인 에너지로 주변 분위기를 이끌고, 활발하게 이것저것 시도해보는 걸 좋아해요.",
      traits: ["사교성이 좋아요", "늘 긍정적인 편이에요", "활발하게 움직여요"],
      reasons: ["먼저 다가가 밝게 인사를 건넸어요", "사람들과 함께하는 시간에서 에너지를 얻었어요", "긍정적인 태도로 상황을 넘겼어요"]
    },
    {
      id: "donald",
      name: "도널드 덕",
      emoji: "🦆",
      image: "donald.webp",
      family: "디즈니 클래식",
      personality: { energy: 1, sense: -1.5, emotion: 1, lifestyle: 1 },
      tagline: "속마음을 숨기지 못하는 다혈질 감정파",
      description:
        "느낀 걸 그대로 표현하는 솔직한 타입이에요. 욱하는 순간도 있지만 그만큼 감정에 진심이고, 뒤끝 없이 훌훌 털어버리는 편이에요.",
      traits: ["감정을 숨기지 못해요", "욱하지만 뒤끝은 없어요", "생각보다 행동이 먼저예요"],
      reasons: ["문제가 생기면 즉각적으로 반응했어요", "감정을 있는 그대로 드러냈어요", "참기보다 바로 표현하는 쪽을 택했어요"]
    },
    {
      id: "goofy",
      name: "구피",
      emoji: "🐶",
      image: "goofy.webp",
      family: "디즈니 클래식",
      personality: { energy: 1, sense: 1, emotion: 1, lifestyle: 2 },
      tagline: "엉뚱하지만 미워할 수 없는 허당 낙천주의자",
      description:
        "실수투성이여도 늘 웃음을 잃지 않는 타입이에요. 계획대로 되지 않아도 크게 개의치 않고, 특유의 엉뚱함으로 상황을 즐겁게 만들어요.",
      traits: ["엉뚱하고 허당이에요", "실수해도 크게 신경 안 써요", "낙천적인 편이에요"],
      reasons: ["실수해도 가볍게 웃어넘겼어요", "계획보다 그때그때 상황을 즐겼어요", "자유롭고 즉흥적인 선택을 했어요"]
    },
    {
      id: "olaf",
      name: "올라프",
      emoji: "⛄",
      image: "olaf.webp",
      family: "디즈니 클래식",
      personality: { energy: 1.5, sense: 0.5, emotion: 1.5, lifestyle: 2 },
      tagline: "순수한 마음으로 세상을 즐기는 즉흥 낙천가",
      description:
        "작은 것에도 크게 기뻐하는 순수한 타입이에요. 계산 없이 마음 가는 대로 움직이고, 사람들과 함께하는 것 자체를 진심으로 즐거워해요.",
      traits: ["순수하고 긍정적이에요", "즉흥적으로 행동해요", "함께 있는 걸 진심으로 즐거워해요"],
      reasons: ["계획 없이 마음 가는 대로 움직였어요", "감정을 솔직하고 크게 표현했어요", "사람들과 함께하는 순간을 좋아했어요"]
    },
    {
      id: "simba",
      name: "심바",
      emoji: "🦁",
      image: "simba.webp",
      family: "디즈니 클래식",
      personality: { energy: 1, sense: -1.5, emotion: 0, lifestyle: 1 },
      tagline: "책임감으로 성장하는 모험심 가득한 행동파",
      description:
        "일단 부딪혀보며 배우는 타입이에요. 처음엔 자유분방하지만, 책임져야 할 일 앞에서는 망설이지 않고 앞장서는 힘이 있어요.",
      traits: ["일단 부딪혀보는 편이에요", "책임감이 강해요", "새로운 도전을 두려워하지 않아요"],
      reasons: ["망설이지 않고 먼저 행동했어요", "현실적인 판단과 도전을 함께 했어요", "필요할 때 앞장서는 선택을 했어요"]
    },
    {
      id: "ariel",
      name: "에리얼",
      emoji: "🧜‍♀️",
      image: "ariel.webp",
      family: "디즈니 클래식",
      personality: { energy: 1, sense: 1, emotion: 1, lifestyle: 2 },
      tagline: "새로운 세상이 궁금한 호기심 많은 모험가",
      description:
        "익숙한 것보다 낯선 것에 더 끌리는 타입이에요. 궁금한 게 생기면 직접 부딪혀서 확인하고, 자유롭게 자기 길을 찾아 나가요.",
      traits: ["호기심이 많아요", "익숙한 것보다 새로운 걸 좋아해요", "자유롭게 행동해요"],
      reasons: ["망설이지 않고 새로운 걸 시도했어요", "감정이 이끄는 대로 움직였어요", "정해진 틀보다 자유로운 선택을 했어요"]
    },
    {
      id: "genie",
      name: "지니",
      emoji: "🧞",
      image: "genie.webp",
      family: "디즈니 클래식",
      personality: { energy: 2, sense: 1, emotion: 1, lifestyle: 1.5 },
      tagline: "즉흥적인 유쾌함으로 분위기를 살리는 인싸",
      description:
        "어떤 자리든 유쾌하게 만드는 타입이에요. 순발력이 좋아서 상황에 맞춰 즉흥적으로 재치를 발휘하고, 사람들과 어울리는 걸 진심으로 즐겨요.",
      traits: ["순발력과 재치가 뛰어나요", "즉흥적인 상황을 즐겨요", "사람들과 잘 어울려요"],
      reasons: ["즉흥적인 제안을 반갑게 받아들였어요", "사람들과 함께하는 자리에서 에너지를 얻었어요", "재치 있게 상황을 풀어갔어요"]
    },
    {
      id: "tigger",
      name: "티거",
      emoji: "🐯",
      image: "tigger.webp",
      family: "디즈니 클래식",
      personality: { energy: 2, sense: 0, emotion: 1, lifestyle: 1.5 },
      tagline: "가만히 있질 못하는 에너지 폭발형",
      description:
        "튀어 오르는 것처럼 에너지가 넘치는 타입이에요. 가만히 있는 것보다 몸을 움직이는 게 편하고, 어디서든 유쾌한 분위기를 만들어내요.",
      traits: ["에너지가 넘쳐요", "가만히 있질 못해요", "늘 밝고 유쾌해요"],
      reasons: ["망설임 없이 바로 움직였어요", "높은 에너지로 상황을 즐겼어요", "즉흥적이고 활발하게 행동했어요"]
    },
    {
      id: "stitch",
      name: "스티치",
      emoji: "👽",
      image: "stitch.webp",
      family: "디즈니 클래식",
      personality: { energy: 1, sense: 1, emotion: 1.5, lifestyle: 1.5 },
      tagline: "장난꾸러기 같지만 정이 많은 자유분방형",
      description:
        "처음엔 제멋대로처럼 보여도 마음속엔 깊은 애정이 있는 타입이에요. 예측하기 어려운 자유분방함 속에서도 소중한 사람에겐 진심을 다해요.",
      traits: ["예측하기 어려운 자유분방함이 있어요", "겉보기와 달리 정이 많아요", "규칙보다 마음이 가는 대로 움직여요"],
      reasons: ["규칙보다 그 순간의 감정을 따랐어요", "예상치 못한 방식으로 행동했어요", "소중한 사람 앞에서 감정을 숨기지 않았어요"]
    },

    /* -------------------------- 픽사 친구들 -------------------------- */
    {
      id: "dory",
      name: "도리",
      emoji: "🐠",
      image: "dory.webp",
      family: "픽사 친구들",
      personality: { energy: 1.5, sense: -0.5, emotion: 1, lifestyle: 1.5 },
      tagline: "일단 헤엄쳐보는 긍정적인 즉흥 모험가",
      description:
        "고민할 시간에 일단 움직여보는 타입이에요. 상황이 어려워도 금세 툭툭 털고 다시 밝은 태도로 나아가는 회복력이 있어요.",
      traits: ["일단 부딪혀보는 편이에요", "금방 다시 밝아져요", "즉흥적으로 움직여요"],
      reasons: ["계획 없이도 일단 나서서 행동했어요", "힘든 상황에도 긍정적으로 넘겼어요", "그 순간의 감정과 즉흥성을 따랐어요"]
    },
    {
      id: "sulley",
      name: "설리반",
      emoji: "🧸",
      image: "sulley.webp",
      family: "픽사 친구들",
      personality: { energy: 1.5, sense: -1, emotion: 1.5, lifestyle: -1.5 },
      tagline: "덩치는 크지만 마음은 여린 든든한 보호자",
      description:
        "겉모습과 달리 다정하고 세심한 타입이에요. 곁에 있는 존재를 살뜰히 챙기고, 안정적인 태도로 신뢰를 주는 든든함이 있어요.",
      traits: ["겉보기보다 다정해요", "곁을 잘 챙겨요", "안정적이고 믿음직해요"],
      reasons: ["주변 사람을 살뜰히 챙겼어요", "감정을 세심하게 살피는 편이었어요", "안정적인 방식으로 관계를 이어갔어요"]
    },
    {
      id: "mike",
      name: "마이크",
      emoji: "👁️",
      image: "mike.webp",
      family: "픽사 친구들",
      personality: { energy: 1, sense: -1, emotion: -1, lifestyle: -1 },
      tagline: "목표를 향해 달리는 자신감 넘치는 노력파",
      description:
        "원하는 목표가 생기면 전략적으로 밀어붙이는 타입이에요. 감정보다 실력과 결과로 인정받고 싶어 하고, 경쟁 상황에서 오히려 힘이 나요.",
      traits: ["목표 지향적이에요", "자신감이 넘쳐요", "경쟁에서 힘이 나는 편이에요"],
      reasons: ["감정보다 현실적인 전략을 앞세웠어요", "목표를 향해 적극적으로 움직였어요", "결과로 증명하려는 태도를 보였어요"]
    },
    {
      id: "remy",
      name: "레미",
      emoji: "🐭",
      image: "remy.webp",
      family: "픽사 친구들",
      personality: { energy: -1.5, sense: 1, emotion: 0.5, lifestyle: 1.5 },
      tagline: "자기만의 감각을 믿는 창의적인 탐구가",
      description:
        "남들과 다른 자기만의 감각과 취향을 소중히 여기는 타입이에요. 호기심이 생기면 직접 시도해보며 배우고, 자기 방식대로 밀고 나가요.",
      traits: ["호기심이 많고 창의적이에요", "자기만의 방식을 고수해요", "직접 부딪혀보며 배워요"],
      reasons: ["익숙한 방식보다 새로운 시도를 택했어요", "자기 감각과 취향을 따랐어요", "혼자서도 스스로 방법을 찾아갔어요"]
    },

    /* -------------------------- 인사이드아웃 감정 -------------------------- */
    {
      id: "joy",
      name: "기쁨이",
      emoji: "😄",
      image: "joy.webp",
      family: "인사이드아웃",
      personality: { energy: 1, sense: 1, emotion: 2, lifestyle: 1.5 },
      tagline: "언제나 밝은 면을 먼저 보는 긍정 에너자이저",
      description:
        "감정을 숨기지 않고 있는 그대로 밝게 표현하는 타입이에요. 어떤 상황에서도 좋은 점을 먼저 찾아내고, 그 에너지로 주변까지 밝게 만들어요.",
      traits: ["감정 표현이 풍부해요", "늘 좋은 점을 먼저 봐요", "에너지가 넘치는 편이에요"],
      reasons: ["감정을 솔직하고 크게 표현했어요", "긍정적인 태도로 상황을 넘겼어요", "사람들과 함께 있을 때 가장 활발했어요"]
    },
    {
      id: "anger",
      name: "버럭이",
      emoji: "😡",
      image: "anger.webp",
      family: "인사이드아웃",
      personality: { energy: 1, sense: -1.5, emotion: -1, lifestyle: 1 },
      tagline: "참지 않고 바로 터뜨리는 직설적인 반응형",
      description:
        "느낀 걸 곧바로 표현하는 즉각적인 타입이에요. 돌려 말하는 것보다 직설적으로 말하는 편이고, 화가 나면 참지 않고 바로 티가 나요.",
      traits: ["감정을 곧바로 표현해요", "돌려 말하지 않아요", "욱하지만 뒤끝은 짧아요"],
      reasons: ["문제가 생기면 즉각적으로 반응했어요", "직설적으로 표현하는 쪽을 택했어요", "참기보다 바로 행동으로 옮겼어요"]
    },
    {
      id: "fear",
      name: "소심이",
      emoji: "😨",
      image: "fear.webp",
      family: "인사이드아웃",
      personality: { energy: -1.5, sense: 1, emotion: 1, lifestyle: -1.5 },
      tagline: "만약을 대비하는 신중하고 걱정 많은 타입",
      description:
        "혹시 모를 상황을 미리 걱정하고 대비하는 타입이에요. 무리한 도전보다 안전한 선택을 우선하고, 신중하게 확인한 뒤에야 움직여요.",
      traits: ["걱정이 많은 편이에요", "안전한 선택을 우선해요", "신중하게 확인한 뒤 행동해요"],
      reasons: ["즉흥적인 선택보다 안전을 먼저 따졌어요", "무리한 도전을 피하는 편이었어요", "혼자 조용히 걱정하는 경우가 많았어요"]
    },
    {
      id: "sadness",
      name: "슬픔이",
      emoji: "😢",
      image: "sadness.webp",
      family: "인사이드아웃",
      personality: { energy: -1.5, sense: 0, emotion: 2, lifestyle: -1 },
      tagline: "느리지만 깊이 공감하는 조용한 위로자",
      description:
        "서두르지 않고 천천히, 마음 깊이 느끼는 타입이에요. 슬픔이나 힘든 감정을 피하지 않고 있는 그대로 받아들이는 편이라, 오히려 누군가의 아픔을 가장 잘 이해해주는 존재가 돼요.",
      traits: ["감정을 깊이 있게 느껴요", "서두르지 않고 천천히 움직여요", "슬픔이나 힘든 이야기에 진심으로 공감해요"],
      reasons: ["고민을 들을 때 끝까지 들어주는 쪽을 택했어요", "감정을 숨기지 않고 있는 그대로 드러냈어요", "조용하고 차분한 방식으로 행동했어요"]
    },
    {
      id: "disgust",
      name: "까칠이",
      emoji: "🤢",
      image: "disgust.webp",
      family: "인사이드아웃",
      personality: { energy: -1, sense: -1, emotion: -2, lifestyle: -1 },
      tagline: "기준이 확실한 현실적인 깐깐러",
      description:
        "마음에 안 드는 건 솔직하게 티가 나는 타입이에요. 감정보다 자기 기준과 취향이 확실하고, 대충 넘어가는 걸 싫어해요.",
      traits: ["기준과 취향이 확실해요", "솔직하고 까다로운 편이에요", "대충 넘어가는 걸 싫어해요"],
      reasons: ["감정보다 현실적인 기준으로 판단했어요", "마음에 안 드는 부분을 솔직히 짚었어요", "자기 기준을 지키려는 선택을 했어요"]
    },

    /* -------------------------- 디즈니 빌런 -------------------------- */
    {
      id: "ursula",
      name: "우르술라",
      emoji: "🐙",
      image: "ursula.webp",
      family: "디즈니 빌런",
      personality: { energy: 1.5, sense: 1, emotion: -0.5, lifestyle: 1 },
      tagline: "말로 상황을 뒤집는 능글맞은 협상가",
      description:
        "능청스러운 말솜씨로 원하는 걸 얻어내는 타입이에요. 사교적이고 자기주장이 뚜렷해서, 협상 자리에서도 주도권을 잡는 편이에요.",
      traits: ["말솜씨가 뛰어나요", "자기주장이 확실해요", "협상과 거래에 능해요"],
      reasons: ["대화로 상황을 풀어가려 했어요", "자기 의견을 분명하게 밝혔어요", "사람들과의 자리에서 주도권을 잡았어요"]
    },
    {
      id: "maleficent",
      name: "말레피센트",
      emoji: "🐉",
      image: "maleficent.webp",
      family: "디즈니 빌런",
      personality: { energy: -1.5, sense: -0.5, emotion: -2, lifestyle: -1 },
      tagline: "흔들리지 않는 자기 기준의 소유자",
      description:
        "감정에 쉽게 휘둘리지 않는 냉철한 타입이에요. 혼자만의 확고한 기준을 갖고 있고, 필요 이상으로 사람들과 어울리지 않아요.",
      traits: ["감정에 잘 흔들리지 않아요", "자기 기준이 확고해요", "혼자만의 시간을 선호해요"],
      reasons: ["감정보다 원칙에 따라 판단했어요", "혼자 있는 시간을 자연스럽게 택했어요", "쉽게 마음을 열지 않는 편이었어요"]
    },
    {
      id: "scar",
      name: "스카",
      emoji: "🦁",
      image: "scar.webp",
      family: "디즈니 빌런",
      personality: { energy: 0.5, sense: -1, emotion: -2, lifestyle: -1.5 },
      tagline: "치밀하게 계산하는 전략적인 야심가",
      description:
        "감정보다 계산이 앞서는 전략가 타입이에요. 목표를 이루기 위해 차근차근 계획을 세우고, 상황을 유리하게 이끄는 데 능해요.",
      traits: ["계산적이고 전략적이에요", "야망이 뚜렷해요", "감정보다 이성적으로 판단해요"],
      reasons: ["문제 앞에서 원인과 전략을 먼저 따졌어요", "감정보다 현실적인 이득을 고려했어요", "계획적으로 상황을 풀어가려 했어요"]
    },
    {
      id: "evil-queen",
      name: "이블 퀸",
      emoji: "🍎",
      image: "evil-queen.webp",
      family: "디즈니 빌런",
      personality: { energy: -1, sense: -1.5, emotion: -2, lifestyle: -1 },
      tagline: "완벽을 추구하는 자존심 강한 완벽주의자",
      description:
        "자기 관리에 철저하고 지는 걸 싫어하는 타입이에요. 감정을 잘 드러내지 않으면서도 내면에는 강한 승부욕과 자존심을 갖고 있어요.",
      traits: ["자기 관리가 철저해요", "지는 걸 싫어해요", "감정을 잘 드러내지 않아요"],
      reasons: ["감정보다 자기 기준과 통제를 우선했어요", "경쟁 상황에서 물러서지 않았어요", "계획적이고 절제된 태도를 보였어요"]
    },
    {
      id: "hades",
      name: "하데스",
      emoji: "🔥",
      image: "hades.webp",
      family: "디즈니 빌런",
      personality: { energy: 1.5, sense: 1, emotion: -0.5, lifestyle: 1.5 },
      tagline: "말빨로 분위기를 휘어잡는 즉흥적인 능구렁이",
      description:
        "재치 있는 말솜씨로 순식간에 분위기를 만드는 타입이에요. 귀찮은 건 딱 질색이라 즉흥적으로 처리하는 편이지만, 그만큼 유쾌한 매력이 있어요.",
      traits: ["말솜씨와 재치가 뛰어나요", "귀찮은 걸 싫어해요", "즉흥적으로 상황을 처리해요"],
      reasons: ["계획보다 임기응변으로 대처했어요", "사람들과의 대화를 즐겼어요", "귀찮은 일은 빠르게 넘기려 했어요"]
    },
    {
      id: "cruella",
      name: "크루엘라",
      emoji: "🐚",
      image: "cruella.webp",
      family: "디즈니 빌런",
      personality: { energy: 1, sense: 1, emotion: -0.5, lifestyle: 1.5 },
      tagline: "취향이 확실한 개성 넘치는 자기표현러",
      description:
        "남들 시선보다 자기만의 취향과 스타일을 우선하는 타입이에요. 개성이 뚜렷하고 하고 싶은 말은 확실하게 하는 당당함이 있어요.",
      traits: ["취향과 개성이 확실해요", "하고 싶은 말은 다 해요", "남의 시선에 크게 얽매이지 않아요"],
      reasons: ["자기 스타일대로 당당하게 행동했어요", "생각을 솔직하게 표현했어요", "정해진 틀보다 자유로운 방식을 택했어요"]
    },
    {
      id: "jafar",
      name: "자파",
      emoji: "🦜",
      image: "jafar.webp",
      family: "디즈니 빌런",
      personality: { energy: -0.5, sense: -2, emotion: -2, lifestyle: -1 },
      tagline: "빈틈없이 계획하는 냉철한 통제형",
      description:
        "감정에 흔들리지 않고 치밀하게 계획을 세우는 타입이에요. 목표를 이루기 위해 상황을 통제하려 하고, 신중하고 계산적으로 움직여요.",
      traits: ["계획적이고 치밀해요", "감정보다 이성이 앞서요", "상황을 통제하려는 편이에요"],
      reasons: ["즉흥적인 선택보다 철저한 계획을 세웠어요", "감정보다 목표와 결과를 우선했어요", "신중하게 원인을 파악한 뒤 움직였어요"]
    },
    {
      id: "captain-hook",
      name: "후크 선장",
      emoji: "🪝",
      image: "captain-hook.webp",
      family: "디즈니 빌런",
      personality: { energy: -1, sense: 0, emotion: 1.5, lifestyle: -1.5 },
      tagline: "체면을 중시하는 예민하고 감정적인 타입",
      description:
        "자존심과 체면을 무엇보다 중요하게 여기는 타입이에요. 예민한 편이라 사소한 일에도 감정이 크게 흔들리고, 티가 나게 반응해요.",
      traits: ["자존심과 체면을 중시해요", "예민하고 감정 기복이 있어요", "티 나게 반응하는 편이에요"],
      reasons: ["체면이 상하는 상황에 민감하게 반응했어요", "감정을 숨기지 못하는 편이었어요", "격식과 태도를 중요하게 여겼어요"]
    },

    /* -------------------------- 토이 스토리 -------------------------- */
    {
      id: "woody",
      name: "우디",
      emoji: "🤠",
      image: "woody.webp",
      family: "토이 스토리",
      personality: { energy: 1.5, sense: -1, emotion: 1.5, lifestyle: -1.5 },
      tagline: "친구를 먼저 챙기는 책임감 있는 리더",
      description:
        "무리 안에서 자연스럽게 리더 역할을 맡는 타입이에요. 자기 이익보다 친구들의 안전과 화합을 먼저 생각하고, 끝까지 책임지려 해요.",
      traits: ["책임감이 강해요", "친구를 먼저 챙겨요", "자연스럽게 리더 역할을 맡아요"],
      reasons: ["주변 사람들의 상황을 먼저 살폈어요", "책임지고 상황을 이끌려 했어요", "안정적인 방식으로 관계를 지켰어요"]
    },
    {
      id: "buzz",
      name: "버즈",
      emoji: "🚀",
      image: "buzz.webp",
      family: "토이 스토리",
      personality: { energy: 1.5, sense: -1, emotion: -0.5, lifestyle: 1 },
      tagline: "망설임 없이 도전하는 자신감 넘치는 행동파",
      description:
        "일단 부딪혀보며 자신을 증명하는 타입이에요. 새로운 도전 앞에서 망설이지 않고, 확고한 자신감으로 상황을 밀고 나가요.",
      traits: ["자신감이 넘쳐요", "도전을 두려워하지 않아요", "망설임 없이 행동해요"],
      reasons: ["망설이지 않고 먼저 나서서 행동했어요", "확신을 갖고 도전하는 쪽을 택했어요", "적극적으로 상황에 부딪혔어요"]
    },
    {
      id: "hamm",
      name: "햄",
      emoji: "🐷",
      image: "hamm.webp",
      family: "토이 스토리",
      personality: { energy: -1, sense: -1, emotion: -1.5, lifestyle: -1.5 },
      tagline: "한 발 물러서서 지켜보는 현실적인 관찰자",
      description:
        "상황에 바로 뛰어들기보다 한 발 물러서서 지켜보는 타입이에요. 냉소적인 유머 속에 현실적인 판단력이 숨어 있어요.",
      traits: ["관찰하고 나서 판단해요", "현실적이고 냉정한 편이에요", "유머로 상황을 가볍게 만들어요"],
      reasons: ["감정보다 현실적인 시선으로 상황을 봤어요", "바로 나서기보다 지켜보는 쪽을 택했어요", "냉소적인 태도로 넘기는 경우가 많았어요"]
    },
    {
      id: "rex",
      name: "렉스",
      emoji: "🦖",
      image: "rex.webp",
      family: "토이 스토리",
      personality: { energy: -1, sense: 1, emotion: 1, lifestyle: -1.5 },
      tagline: "걱정이 많지만 그만큼 애쓰는 노력형",
      description:
        "잘 해낼 수 있을지 늘 불안해하지만, 그럼에도 최선을 다하는 타입이에요. 조심스러운 성격 때문에 매사에 신중하게 접근해요.",
      traits: ["걱정이 많은 편이에요", "신중하게 접근해요", "그래도 끝까지 노력해요"],
      reasons: ["도전보다 신중한 선택을 우선했어요", "불안한 마음을 자주 드러냈어요", "안전한 방식으로 상황에 대처했어요"]
    },
    {
      id: "bullseye",
      name: "불스아이",
      emoji: "🐴",
      image: "bullseye.webp",
      family: "토이 스토리",
      personality: { energy: 1, sense: -1, emotion: 1.5, lifestyle: 0.5 },
      tagline: "충성심 가득한 순수하고 활동적인 타입",
      description:
        "한번 마음을 준 상대에게는 끝까지 충실한 타입이에요. 순수하고 활동적이라 망설임 없이 몸을 움직이고, 애정 표현도 솔직해요.",
      traits: ["충성심이 강해요", "순수하고 활동적이에요", "애정 표현이 솔직해요"],
      reasons: ["망설이지 않고 몸으로 먼저 반응했어요", "감정을 있는 그대로 표현했어요", "가까운 사람에게 끝까지 의리를 지켰어요"]
    },
    {
      id: "mr-potato-head",
      name: "미스터 포테이토 헤드",
      emoji: "🥔",
      image: "mr-potato-head.webp",
      family: "토이 스토리",
      personality: { energy: 0, sense: -2, emotion: -1.5, lifestyle: -0.5 },
      tagline: "돌려 말하지 않는 현실적인 츤데레",
      description:
        "생각한 걸 그대로 말해버리는 직설적인 타입이에요. 무뚝뚝해 보여도 특유의 유머로 분위기를 만들고, 현실적인 조언을 아끼지 않아요.",
      traits: ["직설적이고 솔직해요", "현실적인 조언을 잘해요", "무뚝뚝하지만 유머가 있어요"],
      reasons: ["돌려 말하지 않고 바로 표현했어요", "감정보다 현실적인 판단을 앞세웠어요", "유머로 상황을 가볍게 풀었어요"]
    },
    {
      id: "mrs-potato-head",
      name: "미세스 포테이토 헤드",
      emoji: "👛",
      image: "mrs-potato-head.webp",
      family: "토이 스토리",
      personality: { energy: 1.5, sense: 0, emotion: 0, lifestyle: 1.5 },
      tagline: "장난기 넘치는 적극적인 분위기 메이커",
      description:
        "필요할 땐 확실하게 자기 의견을 밝히는 타입이에요. 격식에 얽매이기보다 즉흥적으로 유쾌하게 반응하는 편이라, 사람들과 어울리는 자리를 늘 활기차게 만들어요.",
      traits: ["자기주장이 확실해요", "사교적이고 적극적이에요", "즉흥적이고 유쾌해요"],
      reasons: ["망설이지 않고 의견을 밝혔어요", "사람들과 함께하는 자리를 즐겼어요", "격식보다 그때그때의 분위기를 따랐어요"]
    },
    {
      id: "bo-peep",
      name: "보핍",
      emoji: "🐑",
      image: "bo-peep.webp",
      family: "토이 스토리",
      personality: { energy: -1.5, sense: 1, emotion: -0.5, lifestyle: 1.5 },
      tagline: "자기 길을 스스로 정하는 독립적인 타입",
      description:
        "남에게 기대기보다 스스로 판단하고 움직이는 타입이에요. 차분하지만 필요할 땐 과감하게 자기 길을 선택하는 독립심이 있어요.",
      traits: ["독립적이에요", "차분하고 침착해요", "자기 주도적으로 움직여요"],
      reasons: ["스스로 판단해서 방향을 정했어요", "감정에 크게 휘둘리지 않았어요", "자유롭게 자기만의 방식을 택했어요"]
    },
    {
      id: "slinky",
      name: "슬링키",
      emoji: "🐶",
      image: "slinky.webp",
      family: "토이 스토리",
      personality: { energy: -1, sense: -1, emotion: 1.5, lifestyle: -1.5 },
      tagline: "묵묵히 곁을 지키는 든든한 의리파",
      description:
        "나서지 않아도 늘 곁에서 조용히 지지해주는 타입이에요. 의리와 배려심이 깊어서, 힘든 순간에도 변함없이 함께해줘요.",
      traits: ["의리가 깊어요", "배려심이 많아요", "묵묵히 곁을 지켜요"],
      reasons: ["필요할 때 조용히 곁에서 도왔어요", "감정을 세심하게 살피는 편이었어요", "안정적으로 관계를 이어갔어요"]
    },
    {
      id: "jessie",
      name: "제시",
      emoji: "🤠",
      image: "jessie.webp",
      family: "토이 스토리",
      personality: { energy: 1.5, sense: 0, emotion: 1, lifestyle: 1.5 },
      tagline: "씩씩하게 뛰어드는 활기찬 모험가",
      description:
        "망설임보다 행동이 앞서는 씩씩한 타입이에요. 에너지 넘치는 태도로 어떤 상황에도 용감하게 뛰어들고, 감정 표현도 시원시원해요.",
      traits: ["씩씩하고 용감해요", "에너지가 넘쳐요", "감정 표현이 시원해요"],
      reasons: ["망설이지 않고 용감하게 나섰어요", "높은 에너지로 상황을 즐겼어요", "감정을 솔직하고 활발하게 표현했어요"]
    }
  ]
};

/**
 * 향후 축별 가중치를 조정하고 싶을 때 이 값만 바꾸면 된다.
 * (예: emotion 축을 더 중요하게 보고 싶다면 emotion 값을 1.0보다 크게)
 */
const MATCHING_WEIGHTS = {
  energy: 1.0,
  sense: 1.0,
  emotion: 1.0,
  lifestyle: 1.0
};

/**
 * "비슷한 유형" 후보 풀을 얼마나 넓게 잡을지 결정하는 값.
 * 캐릭터가 많아지면서 성향이 겹치는 캐릭터들이 생기는데, 매번 똑같은 결과만
 * 나오지 않도록 최소 거리 캐릭터 기준 이 값 이내의 캐릭터들을 후보 풀로 묶고
 * 그 안에서 가중 랜덤으로 최종 결과를 고른다. (app.js 의 findClosestCharacter 참고)
 * 값을 줄이면 더 정확하게 "가장 가까운 1명"에 가깝게, 늘리면 더 다양한 결과가 나온다.
 */
const MATCH_POOL_TOLERANCE = 0.9;

/**
 * 세계관(family)을 더 큰 "유니버스" 3개로 묶는 매핑.
 *
 * ⚠️ 현재 app.js는 이 매핑을 사용하지 않는다 (한때 "치이카와 세계관에서 1명 /
 * 디즈니 세계관에서 1명 / 픽사 세계관에서 1명" 총 3명을 보여주는 결과 화면을
 * 시도했다가, 지금은 전체 45개 중 가장 잘 맞는 1명만 보여주는 방식으로
 * 되돌렸다). 나중에 "세계관별로 뽑기" 같은 기능을 다시 붙이고 싶을 때
 * 바로 쓸 수 있도록 그대로 남겨둔다.
 */
const UNIVERSE_BY_FAMILY = {
  "치이카와 세계관": "치이카와 세계관",
  "디즈니 클래식": "디즈니 세계관",
  "디즈니 빌런": "디즈니 세계관",
  "픽사 친구들": "픽사 세계관",
  "인사이드아웃": "픽사 세계관",
  "토이 스토리": "픽사 세계관"
};

// 결과 화면에 유니버스를 보여줄 순서
const UNIVERSE_ORDER = ["치이카와 세계관", "디즈니 세계관", "픽사 세계관"];

function getCharacterUniverse(character) {
  return UNIVERSE_BY_FAMILY[character.family] || character.family;
}

// 유니버스별로 캐릭터를 미리 묶어둔 맵 { "치이카와 세계관": [...], "디즈니 세계관": [...], "픽사 세계관": [...] }
function groupCharactersByUniverse(characterList) {
  const groups = {};
  UNIVERSE_ORDER.forEach((u) => { groups[u] = []; });
  characterList.forEach((character) => {
    const universe = getCharacterUniverse(character);
    if (!groups[universe]) groups[universe] = [];
    groups[universe].push(character);
  });
  return groups;
}
