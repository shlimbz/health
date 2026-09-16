/**
 * tests.js
 * -----------------------------------------------------------------------
 * 심리테스트 "질문" 데이터 전용 파일.
 *
 * - 이 파일은 오직 "질문 + 선택지 + 선택지별 성향 점수"만 담당한다.
 * - 캐릭터 데이터는 characters.js, 화면/로직은 app.js에서 처리한다.
 * - 새로운 테스트(예: "나의 연애 유형은?")를 추가하고 싶다면
 *   TEST_DEFINITIONS 객체에 새로운 키를 추가하면 된다.
 *
 * 성향 축 (4가지, MBTI에서 아이디어만 참고한 독자적인 축)
 *   energy    : 혼자 충전(-) <-> 사람과 함께 충전(+)
 *   action    : 신중하게 생각(-) <-> 일단 행동(+)
 *   emotion   : 논리·현실(-) <-> 감정·공감(+)
 *   lifestyle : 계획·안정(-) <-> 자유·즉흥(+)
 * -----------------------------------------------------------------------
 */

const CHARACTER_TEST_QUESTIONS = [
  {
    id: 1,
    question: "갑자기 내일 하루가 통째로 비었다.",
    answers: [
      { text: "오랜만에 혼자 하고 싶었던 걸 한다.", emoji: "🛋️", score: { energy: -2, action: 0, emotion: 0, lifestyle: 1 } },
      { text: "친구 한 명에게 연락해서 만난다.", emoji: "📱", score: { energy: 2, action: 0, emotion: 1, lifestyle: 0 } },
      { text: "아예 계획 없이 나가서 돌아다닌다.", emoji: "🚶", score: { energy: 1, action: 2, emotion: 0, lifestyle: 2 } },
      { text: "밀린 일을 처리하면서 하루를 알차게 보낸다.", emoji: "🗂️", score: { energy: -1, action: 1, emotion: -1, lifestyle: -2 } }
    ]
  },
  {
    id: 2,
    question: "친구들과 여행을 가는데 출발 하루 전까지 아무것도 정하지 않았다.",
    answers: [
      { text: "\"이러다 망한다.\" 내가 일정을 짠다.", emoji: "📋", score: { energy: 0, action: 2, emotion: -1, lifestyle: -2 } },
      { text: "\"뭐 어때?\" 가서 정하면 된다.", emoji: "🤷", score: { energy: 1, action: 2, emotion: 1, lifestyle: 2 } },
      { text: "친구들에게 의견을 먼저 물어본다.", emoji: "💬", score: { energy: 2, action: -1, emotion: 2, lifestyle: 0 } },
      { text: "최소한 숙소와 교통편 정도는 확인한다.", emoji: "🏨", score: { energy: -1, action: 0, emotion: 0, lifestyle: -2 } }
    ]
  },
  {
    id: 3,
    question: "카페에서 주문한 음료가 내가 시킨 것과 다르게 나왔다.",
    answers: [
      { text: "바로 직원에게 이야기한다.", emoji: "🙋", score: { energy: 1, action: 2, emotion: -1, lifestyle: 1 } },
      { text: "그냥 마실 수 있으면 마신다.", emoji: "🥤", score: { energy: -1, action: -2, emotion: 1, lifestyle: 1 } },
      { text: "친구에게 \"이거 말할까?\" 하고 물어본다.", emoji: "🗣️", score: { energy: 2, action: -1, emotion: 2, lifestyle: 0 } },
      { text: "상황을 설명하고 정중하게 교환을 요청한다.", emoji: "🙏", score: { energy: 0, action: 1, emotion: 1, lifestyle: -1 } }
    ]
  },
  {
    id: 4,
    question: "친구가 갑자기 \"지금 바다 갈래?\"라고 한다.",
    answers: [
      { text: "\"좋아! 몇 시에 출발해?\"", emoji: "🌊", score: { energy: 2, action: 2, emotion: 1, lifestyle: 2 } },
      { text: "\"잠깐만. 숙소랑 날씨부터 확인하자.\"", emoji: "☂️", score: { energy: 0, action: -1, emotion: -1, lifestyle: -2 } },
      { text: "\"갑자기? 난 오늘 집에 있으려고 했는데.\"", emoji: "🏠", score: { energy: -2, action: -1, emotion: 0, lifestyle: -1 } },
      { text: "\"좋지ㅋㅋ 아무 생각 없이 가자.\"", emoji: "🚗", score: { energy: 1, action: 2, emotion: 1, lifestyle: 2 } }
    ]
  },
  {
    id: 5,
    question: "새로운 게임을 시작했다. 튜토리얼이 끝났다.",
    answers: [
      { text: "설명을 더 읽고 제대로 이해한 다음 시작한다.", emoji: "📖", score: { energy: -1, action: -2, emotion: -1, lifestyle: -1 } },
      { text: "일단 눌러보면서 익힌다.", emoji: "🎮", score: { energy: 0, action: 2, emotion: 0, lifestyle: 1 } },
      { text: "친구에게 팁을 물어본다.", emoji: "❓", score: { energy: 2, action: -1, emotion: 1, lifestyle: 0 } },
      { text: "그냥 내 방식대로 플레이한다.", emoji: "🕹️", score: { energy: 1, action: 1, emotion: 1, lifestyle: 2 } }
    ]
  },
  {
    id: 6,
    question: "단체 채팅방에서 갑자기 아무도 말을 하지 않는다.",
    answers: [
      { text: "내가 먼저 아무 말이나 던져본다.", emoji: "💥", score: { energy: 2, action: 2, emotion: 1, lifestyle: 1 } },
      { text: "누군가 말할 때까지 기다린다.", emoji: "⏳", score: { energy: 0, action: -1, emotion: 0, lifestyle: -1 } },
      { text: "친한 사람에게 개인톡을 보낸다.", emoji: "💌", score: { energy: 1, action: 0, emotion: 2, lifestyle: 0 } },
      { text: "굳이 깨려고 하지 않는다.", emoji: "🤫", score: { energy: -2, action: -1, emotion: -1, lifestyle: 1 } }
    ]
  },
  {
    id: 7,
    question: "친구가 고민을 털어놓았다.",
    answers: [
      { text: "해결 방법부터 같이 찾아준다.", emoji: "🧩", score: { energy: 1, action: 1, emotion: -2, lifestyle: -1 } },
      { text: "일단 이야기를 끝까지 들어준다.", emoji: "👂", score: { energy: 1, action: -1, emotion: 2, lifestyle: 0 } },
      { text: "\"그랬구나...\" 하면서 공감해준다.", emoji: "🥺", score: { energy: 0, action: -1, emotion: 2, lifestyle: 1 } },
      { text: "현실적으로 어떻게 하면 좋을지 이야기한다.", emoji: "📐", score: { energy: -1, action: 1, emotion: -2, lifestyle: -1 } }
    ]
  },
  {
    id: 8,
    question: "갑자기 큰돈이 생겼다.",
    answers: [
      { text: "일단 저축한다.", emoji: "🏦", score: { energy: -1, action: -1, emotion: -1, lifestyle: -2 } },
      { text: "평소 사고 싶었던 걸 산다.", emoji: "🛍️", score: { energy: 0, action: 2, emotion: 1, lifestyle: 1 } },
      { text: "여행을 떠난다.", emoji: "✈️", score: { energy: 2, action: 2, emotion: 2, lifestyle: 2 } },
      { text: "투자나 재테크 방법을 알아본다.", emoji: "📈", score: { energy: -1, action: 0, emotion: -2, lifestyle: -1 } }
    ]
  },
  {
    id: 9,
    question: "친구들과 식당에 갔는데 메뉴가 너무 많다.",
    answers: [
      { text: "리뷰를 찾아보고 결정한다.", emoji: "🔍", score: { energy: -1, action: -1, emotion: -1, lifestyle: -1 } },
      { text: "가장 먹고 싶은 걸 바로 고른다.", emoji: "🍽️", score: { energy: 0, action: 2, emotion: 1, lifestyle: 2 } },
      { text: "친구들이 먹고 싶은 걸 물어본다.", emoji: "🙋‍♀️", score: { energy: 2, action: -1, emotion: 2, lifestyle: 0 } },
      { text: "\"여기 대표 메뉴가 뭐예요?\"라고 묻는다.", emoji: "👨‍🍳", score: { energy: 1, action: 0, emotion: -1, lifestyle: -1 } }
    ]
  },
  {
    id: 10,
    question: "새로운 모임에 처음 참석했다.",
    answers: [
      { text: "먼저 주변 사람들에게 말을 건다.", emoji: "👋", score: { energy: 2, action: 2, emotion: 1, lifestyle: 1 } },
      { text: "아는 사람이 있는지부터 찾는다.", emoji: "👀", score: { energy: -1, action: -1, emotion: 0, lifestyle: -1 } },
      { text: "분위기를 보면서 자연스럽게 섞인다.", emoji: "🌊", score: { energy: 1, action: 0, emotion: 1, lifestyle: 1 } },
      { text: "한 명과 친해지면 그 사람과 주로 이야기한다.", emoji: "🤝", score: { energy: -1, action: 1, emotion: 2, lifestyle: -1 } }
    ]
  },
  {
    id: 11,
    question: "주말에 보기로 한 영화가 갑자기 취소됐다.",
    answers: [
      { text: "다른 영화를 바로 찾아본다.", emoji: "🎬", score: { energy: 1, action: 2, emotion: 0, lifestyle: 2 } },
      { text: "\"그럼 다음에 보자.\"", emoji: "👌", score: { energy: -1, action: -1, emotion: 0, lifestyle: -1 } },
      { text: "아쉬우니 친구와 다른 걸 하자고 한다.", emoji: "🎲", score: { energy: 2, action: 1, emotion: 2, lifestyle: 1 } },
      { text: "오히려 잘 됐다. 집에서 쉬어야겠다.", emoji: "🛌", score: { energy: -2, action: -1, emotion: 1, lifestyle: -2 } }
    ]
  },
  {
    id: 12,
    question: "일을 하던 중 예상치 못한 문제가 발생했다.",
    answers: [
      { text: "원인을 먼저 파악한다.", emoji: "🧐", score: { energy: -1, action: -2, emotion: -1, lifestyle: -1 } },
      { text: "일단 할 수 있는 것부터 해본다.", emoji: "🛠️", score: { energy: 0, action: 2, emotion: -1, lifestyle: 1 } },
      { text: "주변 사람에게 의견을 물어본다.", emoji: "🗨️", score: { energy: 2, action: -1, emotion: 2, lifestyle: 0 } },
      { text: "기존 계획을 버리고 새로운 방법을 찾는다.", emoji: "🔄", score: { energy: 1, action: 1, emotion: 0, lifestyle: 2 } }
    ]
  },
  {
    id: 13,
    question: "친구가 약속 시간에 30분 늦었다.",
    answers: [
      { text: "이유부터 물어본다.", emoji: "❓", score: { energy: 1, action: -1, emotion: 2, lifestyle: 0 } },
      { text: "다음부터 늦지 말라고 이야기한다.", emoji: "⏰", score: { energy: 0, action: 2, emotion: -2, lifestyle: -1 } },
      { text: "괜찮다고 하고 기다린다.", emoji: "😊", score: { energy: -1, action: -1, emotion: 2, lifestyle: -1 } },
      { text: "기다리는 동안 다른 걸 하면서 시간을 보낸다.", emoji: "📱", score: { energy: 1, action: 1, emotion: 0, lifestyle: 2 } }
    ]
  },
  {
    id: 14,
    question: "갑자기 하루 휴가가 생겼다.",
    answers: [
      { text: "가고 싶었던 곳에 바로 간다.", emoji: "🗺️", score: { energy: 1, action: 2, emotion: 1, lifestyle: 2 } },
      { text: "집에서 아무것도 안 하고 쉰다.", emoji: "🛋️", score: { energy: -2, action: -1, emotion: 1, lifestyle: -1 } },
      { text: "친구들에게 연락해서 만날 사람을 찾는다.", emoji: "📞", score: { energy: 2, action: 1, emotion: 2, lifestyle: 1 } },
      { text: "평소 못했던 일을 하나 해본다.", emoji: "✅", score: { energy: 0, action: 2, emotion: 0, lifestyle: 1 } }
    ]
  },
  {
    id: 15,
    question: "친구가 새로 산 옷을 보여줬다.",
    answers: [
      { text: "\"잘 어울린다!\"라고 먼저 말한다.", emoji: "😍", score: { energy: 2, action: 1, emotion: 2, lifestyle: 1 } },
      { text: "솔직하게 장단점을 이야기한다.", emoji: "🗒️", score: { energy: -1, action: 1, emotion: -2, lifestyle: -1 } },
      { text: "어떤 스타일을 좋아하는지 물어본다.", emoji: "🧵", score: { energy: 1, action: -1, emotion: 2, lifestyle: 0 } },
      { text: "내가 좋아하는 스타일인지에 따라 이야기한다.", emoji: "🎨", score: { energy: 0, action: 1, emotion: -1, lifestyle: 2 } }
    ]
  },
  {
    id: 16,
    question: "여행 마지막 날, 아직 가보지 못한 곳이 하나 있다.",
    answers: [
      { text: "시간이 되면 무조건 가본다.", emoji: "🏃", score: { energy: 1, action: 2, emotion: 1, lifestyle: 2 } },
      { text: "이동 시간과 일정을 계산해본다.", emoji: "🧮", score: { energy: -1, action: -1, emotion: -1, lifestyle: -2 } },
      { text: "다음에 다시 오면 된다.", emoji: "🔁", score: { energy: -1, action: -2, emotion: 0, lifestyle: -1 } },
      { text: "같이 온 사람들이 가고 싶어 하는지 물어본다.", emoji: "👥", score: { energy: 2, action: 0, emotion: 2, lifestyle: 1 } }
    ]
  },

  /* ------------------------------------------------------------------
   * Q17~Q24: 캐릭터 수가 늘어나면서(44종) 성향이 겹치는 캐릭터들을 더
   * 세밀하게 구분하기 위해 추가한 문항. 리더십/자기표현/좌절 대처/
   * 질투·서운함/목표 달성 방식/위험 감수/분노 표현 상황을 다룬다.
   * ------------------------------------------------------------------ */
  {
    id: 17,
    question: "팀 프로젝트에서 리더를 정해야 하는 상황이다.",
    answers: [
      { text: "\"내가 할게.\" 자원해서 이끈다.", emoji: "🙋", score: { energy: 1, action: 2, emotion: -1, lifestyle: -1 } },
      { text: "능력 있어 보이는 사람을 추천한다.", emoji: "👍", score: { energy: 0, action: -1, emotion: -1, lifestyle: -1 } },
      { text: "다들 부담스러워하니 분위기를 풀어준다.", emoji: "😊", score: { energy: 1, action: 0, emotion: 1, lifestyle: 0 } },
      { text: "나서지 않고 주어진 역할만 잘 해낸다.", emoji: "🧩", score: { energy: -1, action: -1, emotion: 0, lifestyle: -1 } }
    ]
  },
  {
    id: 18,
    question: "많은 사람 앞에서 실수를 했다.",
    answers: [
      { text: "대수롭지 않게 웃어넘긴다.", emoji: "😅", score: { energy: 1, action: 1, emotion: 1, lifestyle: 1 } },
      { text: "순간 부끄러워 얼굴이 빨개진다.", emoji: "😳", score: { energy: -1, action: -1, emotion: 2, lifestyle: 0 } },
      { text: "왜 실수했는지 원인부터 따져본다.", emoji: "🧐", score: { energy: -1, action: -1, emotion: -2, lifestyle: -1 } },
      { text: "오히려 그 실수를 재미있는 이야깃거리로 만든다.", emoji: "🎤", score: { energy: 2, action: 1, emotion: 1, lifestyle: 1 } }
    ]
  },
  {
    id: 19,
    question: "좋아하는 스타일이 남들과 다르게 눈에 띈다는 말을 들었다.",
    answers: [
      { text: "\"그게 바로 나야!\"라며 더 당당해진다.", emoji: "💅", score: { energy: 1, action: 1, emotion: 1, lifestyle: 2 } },
      { text: "남들 시선이 좀 신경 쓰인다.", emoji: "👀", score: { energy: -1, action: -1, emotion: 1, lifestyle: -1 } },
      { text: "어차피 내 마음에 들면 그만이다.", emoji: "🤙", score: { energy: 0, action: 0, emotion: -1, lifestyle: 1 } },
      { text: "유행이나 분위기에 맞춰서 조절해본다.", emoji: "🪞", score: { energy: 0, action: -1, emotion: 0, lifestyle: -1 } }
    ]
  },
  {
    id: 20,
    question: "열심히 준비한 일이 생각대로 되지 않았다.",
    answers: [
      { text: "될 때까지 다시 도전한다.", emoji: "🔁", score: { energy: 0, action: 2, emotion: 0, lifestyle: 0 } },
      { text: "무엇이 문제였는지 차분히 분석한다.", emoji: "📊", score: { energy: -1, action: -1, emotion: -2, lifestyle: -1 } },
      { text: "속상한 마음을 누군가에게 털어놓는다.", emoji: "😢", score: { energy: 1, action: -1, emotion: 2, lifestyle: 0 } },
      { text: "\"그럴 수도 있지\" 하고 훌훌 털어버린다.", emoji: "🤷‍♂️", score: { energy: 0, action: 0, emotion: 0, lifestyle: 2 } }
    ]
  },
  {
    id: 21,
    question: "친한 친구가 다른 친구들과 더 친하게 지내는 것 같다.",
    answers: [
      { text: "서운하지만 티내지 않는다.", emoji: "😶", score: { energy: -1, action: -1, emotion: 1, lifestyle: -1 } },
      { text: "솔직하게 서운한 마음을 말한다.", emoji: "🗣️", score: { energy: 0, action: 1, emotion: 2, lifestyle: 0 } },
      { text: "나도 다른 친구를 사귀면 된다고 생각한다.", emoji: "🙂", score: { energy: 1, action: 1, emotion: -1, lifestyle: 1 } },
      { text: "별로 신경 쓰지 않는다.", emoji: "😐", score: { energy: -1, action: 0, emotion: -2, lifestyle: 0 } }
    ]
  },
  {
    id: 22,
    question: "꼭 이루고 싶은 목표가 생겼다.",
    answers: [
      { text: "구체적인 계획표부터 세운다.", emoji: "📝", score: { energy: -1, action: -1, emotion: -1, lifestyle: -2 } },
      { text: "일단 할 수 있는 만큼 부딪혀본다.", emoji: "💪", score: { energy: 0, action: 2, emotion: 0, lifestyle: 1 } },
      { text: "주변 사람들에게 알리고 응원을 받는다.", emoji: "📣", score: { energy: 2, action: 0, emotion: 1, lifestyle: 0 } },
      { text: "마음속으로만 조용히 다짐한다.", emoji: "🤫", score: { energy: -2, action: -1, emotion: 0, lifestyle: -1 } }
    ]
  },
  {
    id: 23,
    question: "다 같이 즉흥적으로 스릴 넘치는 액티비티를 해보자고 한다.",
    answers: [
      { text: "\"가장 먼저 해볼래!\"", emoji: "🎢", score: { energy: 1, action: 2, emotion: 1, lifestyle: 2 } },
      { text: "안전한지부터 확인하고 결정한다.", emoji: "🦺", score: { energy: -1, action: -2, emotion: -1, lifestyle: -2 } },
      { text: "다들 하면 분위기 맞춰서 같이 한다.", emoji: "🙌", score: { energy: 1, action: 0, emotion: 1, lifestyle: 0 } },
      { text: "무섭지만 내색하지 않고 버틴다.", emoji: "😬", score: { energy: 0, action: -1, emotion: 1, lifestyle: -1 } }
    ]
  },
  {
    id: 24,
    question: "화가 나는 일이 생겼다.",
    answers: [
      { text: "그 자리에서 바로 솔직하게 표현한다.", emoji: "💢", score: { energy: 0, action: 2, emotion: 1, lifestyle: 0 } },
      { text: "일단 참고 나중에 차분히 얘기한다.", emoji: "🫤", score: { energy: -1, action: -2, emotion: -1, lifestyle: -1 } },
      { text: "다른 걸로 기분을 전환하려 한다.", emoji: "🎧", score: { energy: 0, action: 0, emotion: 0, lifestyle: 1 } },
      { text: "왜 화가 났는지 논리적으로 정리해본다.", emoji: "🧠", score: { energy: -1, action: -1, emotion: -2, lifestyle: -1 } }
    ]
  }
];

/**
 * 향후 여러 종류의 테스트("나의 연애 유형은?" 등)를 추가하기 위한 레지스트리.
 * app.js는 이 객체를 통해 테스트 데이터에 접근한다 (현재는 default 하나만 존재).
 */
const TEST_DEFINITIONS = {
  "character-match": {
    id: "character-match",
    title: "나와 닮은 캐릭터는?",
    subtitle: "24개의 질문에 답하고\n나와 가장 닮은 캐릭터를 찾아보세요.",
    icon: "🔮",
    questions: CHARACTER_TEST_QUESTIONS,
    // 이 테스트가 매칭에 사용할 캐릭터 세트 (characters.js 의 키)
    characterSetKey: "default"
  }
};
