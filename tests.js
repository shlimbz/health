/**
 * tests.js
 * -----------------------------------------------------------------------
 * 심리테스트 "질문 풀(pool)" 데이터 전용 파일.
 *
 * - 이 파일은 오직 "질문 + 선택지 + 선택지별 성향 점수"만 담당한다.
 * - 캐릭터 데이터는 characters.js, 화면/로직은 app.js에서 처리한다.
 *
 * 성향 축 (4가지 — 실제 MBTI 4개 축에 그대로 대응시킨 것. 단, 사용자에게는
 * "MBTI 유형"이라고 직접 표시하지 않고 사이트 자체의 성향 축처럼 보여준다.)
 *   energy    : 혼자 충전(-, I) <-> 사람과 함께 충전(+, E)
 *   sense     : 현실·경험 중시(-, S) <-> 상상·가능성 중시(+, N)
 *   emotion   : 논리·원칙(-, T) <-> 감정·공감(+, F)
 *   lifestyle : 계획·체계(-, J) <-> 자유·즉흥(+, P)
 *
 * 질문 풀은 총 50개이며, 각 질문은 자신이 가장 강하게 구분해주는 축을
 * primaryAxis로 표시해둔다. 실제 테스트에서는 이 50개 중 24개를
 * "축별로 골고루" 무작위로 뽑아서 사용한다 (app.js의 selectBalancedQuestions
 * 참고) — 그래야 매번 다른 질문이 나와도 4개 축을 고르게 측정할 수 있다.
 * -----------------------------------------------------------------------
 */

const CHARACTER_TEST_QUESTIONS = [
  // ===================== energy 축 (E/I) 중심 문항 ===================== //
  {
    id: 1,
    primaryAxis: "energy",
    question: "갑자기 내일 하루가 통째로 비었다.",
    answers: [
      { text: "오랜만에 혼자 하고 싶었던 걸 한다.", emoji: "🛋️", score: { energy: -2, sense: 0, emotion: 0, lifestyle: 1 } },
      { text: "친구 한 명에게 연락해서 만난다.", emoji: "📱", score: { energy: 2, sense: 0, emotion: 1, lifestyle: 0 } },
      { text: "아예 계획 없이 나가서 돌아다닌다.", emoji: "🚶", score: { energy: 1, sense: 1, emotion: 0, lifestyle: 2 } },
      { text: "밀린 일을 처리하면서 하루를 알차게 보낸다.", emoji: "🗂️", score: { energy: -1, sense: -1, emotion: -1, lifestyle: -2 } }
    ]
  },
  {
    id: 6,
    primaryAxis: "energy",
    question: "단체 채팅방에서 갑자기 아무도 말을 하지 않는다.",
    answers: [
      { text: "내가 먼저 아무 말이나 던져본다.", emoji: "💥", score: { energy: 2, sense: 1, emotion: 1, lifestyle: 1 } },
      { text: "누군가 말할 때까지 기다린다.", emoji: "⏳", score: { energy: 0, sense: 0, emotion: 0, lifestyle: -1 } },
      { text: "친한 사람에게 개인톡을 보낸다.", emoji: "💌", score: { energy: 1, sense: 0, emotion: 2, lifestyle: 0 } },
      { text: "굳이 깨려고 하지 않는다.", emoji: "🤫", score: { energy: -2, sense: 0, emotion: -1, lifestyle: 1 } }
    ]
  },
  {
    id: 10,
    primaryAxis: "energy",
    question: "새로운 모임에 처음 참석했다.",
    answers: [
      { text: "먼저 주변 사람들에게 말을 건다.", emoji: "👋", score: { energy: 2, sense: 0, emotion: 1, lifestyle: 1 } },
      { text: "아는 사람이 있는지부터 찾는다.", emoji: "👀", score: { energy: -1, sense: -1, emotion: 0, lifestyle: -1 } },
      { text: "분위기를 보면서 자연스럽게 섞인다.", emoji: "🌊", score: { energy: 1, sense: 1, emotion: 1, lifestyle: 1 } },
      { text: "한 명과 친해지면 그 사람과 주로 이야기한다.", emoji: "🤝", score: { energy: -1, sense: 0, emotion: 2, lifestyle: -1 } }
    ]
  },
  {
    id: 14,
    primaryAxis: "energy",
    question: "갑자기 하루 휴가가 생겼다.",
    answers: [
      { text: "가고 싶었던 곳에 바로 간다.", emoji: "🗺️", score: { energy: 1, sense: 0, emotion: 1, lifestyle: 2 } },
      { text: "집에서 아무것도 안 하고 쉰다.", emoji: "🛋️", score: { energy: -2, sense: 0, emotion: 1, lifestyle: -1 } },
      { text: "친구들에게 연락해서 만날 사람을 찾는다.", emoji: "📞", score: { energy: 2, sense: 0, emotion: 2, lifestyle: 1 } },
      { text: "평소 못했던 일을 하나 해본다.", emoji: "✅", score: { energy: 0, sense: 1, emotion: 0, lifestyle: 1 } }
    ]
  },
  {
    id: 25,
    primaryAxis: "energy",
    question: "연휴 첫날 아침, 아무 약속도 없다는 걸 깨달았다.",
    answers: [
      { text: "심심하니 누구든 불러낸다.", emoji: "📲", score: { energy: 2, sense: 0, emotion: 1, lifestyle: 1 } },
      { text: "완벽해, 혼자만의 시간이다.", emoji: "🛀", score: { energy: -2, sense: 0, emotion: 0, lifestyle: -1 } },
      { text: "일단 밖에 나가서 사람 구경이라도 한다.", emoji: "🚏", score: { energy: 1, sense: 1, emotion: 0, lifestyle: 1 } },
      { text: "집에서 혼자 할 일을 차분히 계획한다.", emoji: "📓", score: { energy: -1, sense: -1, emotion: 0, lifestyle: -1 } }
    ]
  },
  {
    id: 26,
    primaryAxis: "energy",
    question: "엘리베이터에서 아는 사람과 단둘이 마주쳤다.",
    answers: [
      { text: "반갑게 먼저 인사하고 대화를 건다.", emoji: "🙌", score: { energy: 2, sense: 0, emotion: 1, lifestyle: 0 } },
      { text: "가볍게 인사만 하고 조용히 있는다.", emoji: "🙂", score: { energy: -1, sense: 0, emotion: 0, lifestyle: 0 } },
      { text: "휴대폰을 보는 척한다.", emoji: "📴", score: { energy: -2, sense: 0, emotion: -1, lifestyle: 0 } },
      { text: "날씨 얘기 같은 걸로 자연스럽게 넘긴다.", emoji: "☀️", score: { energy: 1, sense: 0, emotion: 0, lifestyle: 0 } }
    ]
  },
  {
    id: 27,
    primaryAxis: "energy",
    question: "친구 여러 명이 놀러가자고 단톡방이 시끌시끌하다.",
    answers: [
      { text: "누구보다 먼저 신나서 참여한다.", emoji: "🎉", score: { energy: 2, sense: 0, emotion: 1, lifestyle: 1 } },
      { text: "일단 지켜보다가 나중에 답한다.", emoji: "👀", score: { energy: -1, sense: 0, emotion: 0, lifestyle: -1 } },
      { text: "인원이 너무 많으면 살짝 부담스럽다.", emoji: "😅", score: { energy: -2, sense: 0, emotion: 0, lifestyle: -1 } },
      { text: "적당히 낀 다음 편하게 묻어간다.", emoji: "🙆", score: { energy: 1, sense: 0, emotion: 0, lifestyle: 1 } }
    ]
  },
  {
    id: 28,
    primaryAxis: "energy",
    question: "일주일 내내 사람들과 부대꼈다.",
    answers: [
      { text: "사람을 더 만나야 오히려 에너지가 채워진다.", emoji: "⚡", score: { energy: 2, sense: 0, emotion: 0, lifestyle: 0 } },
      { text: "혼자만의 시간이 절실하게 필요하다.", emoji: "🌙", score: { energy: -2, sense: 0, emotion: 0, lifestyle: -1 } },
      { text: "적당히 섞어서 밸런스를 맞춘다.", emoji: "⚖️", score: { energy: 0, sense: 0, emotion: 0, lifestyle: 0 } },
      { text: "일단 익숙한 한두 명만 만난다.", emoji: "👥", score: { energy: -1, sense: 0, emotion: 1, lifestyle: -1 } }
    ]
  },
  {
    id: 29,
    primaryAxis: "energy",
    question: "새로운 반이나 직장에 첫 출근하는 날이다.",
    answers: [
      { text: "먼저 다가가서 이름을 물어보며 친해진다.", emoji: "🤗", score: { energy: 2, sense: 0, emotion: 1, lifestyle: 0 } },
      { text: "조용히 자리에 앉아 상황을 지켜본다.", emoji: "🪑", score: { energy: -2, sense: 0, emotion: 0, lifestyle: -1 } },
      { text: "몇몇에게만 가볍게 인사한다.", emoji: "🙋", score: { energy: 0, sense: 0, emotion: 0, lifestyle: 0 } },
      { text: "말 걸어주는 사람이 있으면 반갑게 응한다.", emoji: "😊", score: { energy: 1, sense: 0, emotion: 1, lifestyle: 0 } }
    ]
  },
  {
    id: 30,
    primaryAxis: "energy",
    question: "오랜만에 하루 종일 집에 혼자 있게 됐다.",
    answers: [
      { text: "심심해서 결국 누군가를 불러낸다.", emoji: "📱", score: { energy: 2, sense: 0, emotion: 0, lifestyle: 1 } },
      { text: "이 시간이 꿀맛처럼 소중하다.", emoji: "🍯", score: { energy: -2, sense: 0, emotion: 0, lifestyle: 0 } },
      { text: "영상통화라도 켜놓고 지낸다.", emoji: "📹", score: { energy: 1, sense: 0, emotion: 1, lifestyle: 0 } },
      { text: "오히려 집중이 잘 되고 편안하다.", emoji: "🧘", score: { energy: -1, sense: 0, emotion: 0, lifestyle: -1 } }
    ]
  },
  {
    id: 31,
    primaryAxis: "energy",
    question: "다 같이 있는 자리에서 갑자기 나에게 발언 기회가 넘어왔다.",
    answers: [
      { text: "신나서 마이크를 받아 이야기를 이어간다.", emoji: "🎤", score: { energy: 2, sense: 0, emotion: 1, lifestyle: 1 } },
      { text: "당황해서 얼른 다른 사람에게 넘긴다.", emoji: "😳", score: { energy: -2, sense: 0, emotion: 0, lifestyle: 0 } },
      { text: "짧게 한마디 하고 자연스럽게 마무리한다.", emoji: "🙂", score: { energy: 0, sense: 0, emotion: 0, lifestyle: 0 } },
      { text: "미리 생각해둔 것처럼 술술 이야기한다.", emoji: "💬", score: { energy: 1, sense: 0, emotion: 0, lifestyle: -1 } }
    ]
  },

  // ===================== sense 축 (S/N) 중심 문항 ===================== //
  {
    id: 5,
    primaryAxis: "sense",
    question: "새로운 게임을 시작했다. 튜토리얼이 끝났다.",
    answers: [
      { text: "설명을 더 읽고 제대로 이해한 다음 시작한다.", emoji: "📖", score: { energy: -1, sense: -2, emotion: -1, lifestyle: -1 } },
      { text: "일단 눌러보면서 익힌다.", emoji: "🎮", score: { energy: 0, sense: -1, emotion: 0, lifestyle: 1 } },
      { text: "친구에게 팁을 물어본다.", emoji: "❓", score: { energy: 2, sense: 0, emotion: 1, lifestyle: 0 } },
      { text: "그냥 내 방식대로 플레이한다.", emoji: "🕹️", score: { energy: 1, sense: 1, emotion: 1, lifestyle: 2 } }
    ]
  },
  {
    id: 9,
    primaryAxis: "sense",
    question: "친구들과 식당에 갔는데 메뉴가 너무 많다.",
    answers: [
      { text: "리뷰를 찾아보고 결정한다.", emoji: "🔍", score: { energy: -1, sense: -2, emotion: -1, lifestyle: -1 } },
      { text: "가장 먹고 싶은 걸 바로 고른다.", emoji: "🍽️", score: { energy: 0, sense: 1, emotion: 1, lifestyle: 2 } },
      { text: "친구들이 먹고 싶은 걸 물어본다.", emoji: "🙋‍♀️", score: { energy: 2, sense: 0, emotion: 2, lifestyle: 0 } },
      { text: "\"여기 대표 메뉴가 뭐예요?\"라고 묻는다.", emoji: "👨‍🍳", score: { energy: 1, sense: -1, emotion: -1, lifestyle: -1 } }
    ]
  },
  {
    id: 12,
    primaryAxis: "sense",
    question: "일을 하던 중 예상치 못한 문제가 발생했다.",
    answers: [
      { text: "원인을 먼저 파악한다.", emoji: "🧐", score: { energy: -1, sense: -1, emotion: -1, lifestyle: -1 } },
      { text: "일단 할 수 있는 것부터 해본다.", emoji: "🛠️", score: { energy: 0, sense: -1, emotion: -1, lifestyle: 1 } },
      { text: "주변 사람에게 의견을 물어본다.", emoji: "🗨️", score: { energy: 2, sense: 0, emotion: 2, lifestyle: 0 } },
      { text: "기존 계획을 버리고 새로운 방법을 찾는다.", emoji: "🔄", score: { energy: 1, sense: 2, emotion: 0, lifestyle: 2 } }
    ]
  },
  {
    id: 33,
    primaryAxis: "sense",
    question: "새로운 카페에 갔는데 메뉴판에 낯선 이름의 음료가 있다.",
    answers: [
      { text: "일단 무슨 재료인지 물어보고 확인한다.", emoji: "🧾", score: { energy: 0, sense: -2, emotion: 0, lifestyle: -1 } },
      { text: "이름이 끌리는 대로 상상하며 골라본다.", emoji: "✨", score: { energy: 0, sense: 2, emotion: 0, lifestyle: 1 } },
      { text: "가장 무난하고 실패 없는 걸 고른다.", emoji: "☕", score: { energy: 0, sense: -1, emotion: 0, lifestyle: -1 } },
      { text: "직원 추천을 받는다.", emoji: "🙋", score: { energy: 1, sense: 0, emotion: 0, lifestyle: 0 } }
    ]
  },
  {
    id: 34,
    primaryAxis: "sense",
    question: "친구가 미래 계획을 물어봤다.",
    answers: [
      { text: "5년 뒤 구체적인 목표와 숫자까지 얘기한다.", emoji: "📊", score: { energy: 0, sense: -2, emotion: -1, lifestyle: -1 } },
      { text: "이런저런 가능성을 상상하며 이야기한다.", emoji: "🌈", score: { energy: 0, sense: 2, emotion: 1, lifestyle: 1 } },
      { text: "그때 가봐야 안다고 한다.", emoji: "🤷", score: { energy: 0, sense: 0, emotion: 0, lifestyle: 2 } },
      { text: "지금 하고 있는 일 얘기만 한다.", emoji: "💼", score: { energy: 0, sense: -1, emotion: 0, lifestyle: -1 } }
    ]
  },
  {
    id: 35,
    primaryAxis: "sense",
    question: "책이나 영화를 고를 때 나는",
    answers: [
      { text: "줄거리 요약과 리뷰를 꼼꼼히 확인한다.", emoji: "📃", score: { energy: 0, sense: -2, emotion: 0, lifestyle: -1 } },
      { text: "제목이나 느낌이 끌리면 바로 본다.", emoji: "🎬", score: { energy: 0, sense: 1, emotion: 0, lifestyle: 1 } },
      { text: "장르와 평점부터 따진다.", emoji: "⭐", score: { energy: 0, sense: -1, emotion: -1, lifestyle: 0 } },
      { text: "상상력을 자극하는 낯선 작품에 끌린다.", emoji: "🌌", score: { energy: 0, sense: 2, emotion: 0, lifestyle: 1 } }
    ]
  },
  {
    id: 36,
    primaryAxis: "sense",
    question: "누군가 나에게 조언을 구했다.",
    answers: [
      { text: "내가 직접 겪었던 비슷한 경험을 얘기해준다.", emoji: "🗂️", score: { energy: 0, sense: -2, emotion: 1, lifestyle: 0 } },
      { text: "여러 관점에서 다양한 가능성을 짚어준다.", emoji: "🧭", score: { energy: 0, sense: 2, emotion: 0, lifestyle: 0 } },
      { text: "구체적인 다음 행동 단계를 알려준다.", emoji: "📋", score: { energy: 0, sense: -1, emotion: -1, lifestyle: -1 } },
      { text: "떠오르는 아이디어를 자유롭게 던져본다.", emoji: "💡", score: { energy: 1, sense: 1, emotion: 0, lifestyle: 1 } }
    ]
  },
  {
    id: 37,
    primaryAxis: "sense",
    question: "새로운 가구를 조립해야 한다.",
    answers: [
      { text: "설명서를 순서대로 정확히 따른다.", emoji: "📐", score: { energy: 0, sense: -2, emotion: 0, lifestyle: -1 } },
      { text: "그림만 대충 보고 감으로 조립한다.", emoji: "🔧", score: { energy: 0, sense: 2, emotion: 0, lifestyle: 1 } },
      { text: "비슷하게 만들어본 적 있어서 수월하다.", emoji: "🪛", score: { energy: 0, sense: -1, emotion: 0, lifestyle: 0 } },
      { text: "이러면 더 좋겠다 싶은 방식으로 응용한다.", emoji: "🛠️", score: { energy: 0, sense: 1, emotion: 0, lifestyle: 1 } }
    ]
  },
  {
    id: 38,
    primaryAxis: "sense",
    question: "여행지에서 길을 찾을 때",
    answers: [
      { text: "지도 앱의 정확한 경로를 그대로 따라간다.", emoji: "🗺️", score: { energy: 0, sense: -2, emotion: 0, lifestyle: -1 } },
      { text: "일단 감으로 걷다가 필요하면 찾아본다.", emoji: "🚶‍♀️", score: { energy: 0, sense: 1, emotion: 0, lifestyle: 1 } },
      { text: "표지판과 랜드마크를 꼼꼼히 확인하며 간다.", emoji: "🪧", score: { energy: 0, sense: -1, emotion: 0, lifestyle: -1 } },
      { text: "골목이 예뻐 보이면 그냥 들어가본다.", emoji: "🏘️", score: { energy: 0, sense: 2, emotion: 0, lifestyle: 1 } }
    ]
  },
  {
    id: 39,
    primaryAxis: "sense",
    question: "회의에서 새로운 프로젝트 아이디어를 낼 때",
    answers: [
      { text: "이미 검증된 사례를 바탕으로 제안한다.", emoji: "📚", score: { energy: 0, sense: -2, emotion: 0, lifestyle: -1 } },
      { text: "기존에 없던 새로운 방식을 제안한다.", emoji: "🚀", score: { energy: 0, sense: 2, emotion: 0, lifestyle: 1 } },
      { text: "데이터와 자료를 근거로 설명한다.", emoji: "📈", score: { energy: -1, sense: -1, emotion: -1, lifestyle: 0 } },
      { text: "떠오르는 큰 그림을 먼저 그려서 얘기한다.", emoji: "🖼️", score: { energy: 1, sense: 1, emotion: 0, lifestyle: 0 } }
    ]
  },
  {
    id: 40,
    primaryAxis: "sense",
    question: "친구가 지난밤 꿈 이야기를 시시콜콜 설명한다.",
    answers: [
      { text: "무슨 의미인지 같이 상상하며 해석해본다.", emoji: "🔮", score: { energy: 0, sense: 2, emotion: 1, lifestyle: 0 } },
      { text: "그냥 꿈일 뿐이라고 넘긴다.", emoji: "😴", score: { energy: 0, sense: -1, emotion: -1, lifestyle: 0 } },
      { text: "꿈에 나온 현실적인 디테일이 궁금하다.", emoji: "🔎", score: { energy: 0, sense: -2, emotion: 0, lifestyle: -1 } },
      { text: "관련된 다른 상상을 덧붙여 이야기를 키운다.", emoji: "🎈", score: { energy: 1, sense: 1, emotion: 1, lifestyle: 1 } }
    ]
  },
  {
    id: 41,
    primaryAxis: "sense",
    question: "새로운 레시피로 요리를 한다.",
    answers: [
      { text: "계량과 순서를 그대로 정확히 지킨다.", emoji: "⚖️", score: { energy: 0, sense: -2, emotion: 0, lifestyle: -1 } },
      { text: "감으로 재료를 바꿔가며 응용한다.", emoji: "🍳", score: { energy: 0, sense: 2, emotion: 0, lifestyle: 1 } },
      { text: "레시피 영상을 몇 번 돌려보며 따라한다.", emoji: "📹", score: { energy: -1, sense: -1, emotion: 0, lifestyle: -1 } },
      { text: "이 재료 대신 저게 더 어울리지 않을까 상상한다.", emoji: "🌶️", score: { energy: 0, sense: 1, emotion: 0, lifestyle: 1 } }
    ]
  },
  {
    id: 42,
    primaryAxis: "sense",
    question: "미래에 대한 걱정이 문득 들 때",
    answers: [
      { text: "구체적으로 뭐가 문제인지 현실적으로 따진다.", emoji: "📌", score: { energy: 0, sense: -2, emotion: -1, lifestyle: -1 } },
      { text: "여러 가능성과 시나리오를 상상해본다.", emoji: "🌠", score: { energy: 0, sense: 2, emotion: 0, lifestyle: 0 } },
      { text: "지금 할 수 있는 눈앞의 일에 집중한다.", emoji: "🎯", score: { energy: -1, sense: -1, emotion: 0, lifestyle: -1 } },
      { text: "결국 다 잘 풀릴 거라는 큰 그림을 그린다.", emoji: "🌤️", score: { energy: 0, sense: 1, emotion: 1, lifestyle: 1 } }
    ]
  },

  // ===================== emotion 축 (T/F) 중심 문항 ===================== //
  {
    id: 3,
    primaryAxis: "emotion",
    question: "카페에서 주문한 음료가 내가 시킨 것과 다르게 나왔다.",
    answers: [
      { text: "바로 직원에게 이야기한다.", emoji: "🙋", score: { energy: 1, sense: 0, emotion: -1, lifestyle: 1 } },
      { text: "그냥 마실 수 있으면 마신다.", emoji: "🥤", score: { energy: -1, sense: 0, emotion: 1, lifestyle: 1 } },
      { text: "친구에게 \"이거 말할까?\" 하고 물어본다.", emoji: "🗣️", score: { energy: 2, sense: 0, emotion: 2, lifestyle: 0 } },
      { text: "상황을 설명하고 정중하게 교환을 요청한다.", emoji: "🙏", score: { energy: 0, sense: -1, emotion: 1, lifestyle: -1 } }
    ]
  },
  {
    id: 7,
    primaryAxis: "emotion",
    question: "친구가 고민을 털어놓았다.",
    answers: [
      { text: "해결 방법부터 같이 찾아준다.", emoji: "🧩", score: { energy: 1, sense: -1, emotion: -2, lifestyle: -1 } },
      { text: "일단 이야기를 끝까지 들어준다.", emoji: "👂", score: { energy: 1, sense: 0, emotion: 2, lifestyle: 0 } },
      { text: "\"그랬구나...\" 하면서 공감해준다.", emoji: "🥺", score: { energy: 0, sense: 0, emotion: 2, lifestyle: 1 } },
      { text: "현실적으로 어떻게 하면 좋을지 이야기한다.", emoji: "📐", score: { energy: -1, sense: -2, emotion: -2, lifestyle: -1 } }
    ]
  },
  {
    id: 13,
    primaryAxis: "emotion",
    question: "친구가 약속 시간에 30분 늦었다.",
    answers: [
      { text: "이유부터 물어본다.", emoji: "❓", score: { energy: 1, sense: 0, emotion: 2, lifestyle: 0 } },
      { text: "다음부터 늦지 말라고 이야기한다.", emoji: "⏰", score: { energy: 0, sense: -1, emotion: -2, lifestyle: -1 } },
      { text: "괜찮다고 하고 기다린다.", emoji: "😊", score: { energy: -1, sense: 0, emotion: 2, lifestyle: -1 } },
      { text: "기다리는 동안 다른 걸 하면서 시간을 보낸다.", emoji: "📱", score: { energy: 1, sense: 0, emotion: 0, lifestyle: 2 } }
    ]
  },
  {
    id: 15,
    primaryAxis: "emotion",
    question: "친구가 새로 산 옷을 보여줬다.",
    answers: [
      { text: "\"잘 어울린다!\"라고 먼저 말한다.", emoji: "😍", score: { energy: 2, sense: 0, emotion: 2, lifestyle: 1 } },
      { text: "솔직하게 장단점을 이야기한다.", emoji: "🗒️", score: { energy: -1, sense: -1, emotion: -2, lifestyle: -1 } },
      { text: "어떤 스타일을 좋아하는지 물어본다.", emoji: "🧵", score: { energy: 1, sense: 0, emotion: 2, lifestyle: 0 } },
      { text: "내가 좋아하는 스타일인지에 따라 이야기한다.", emoji: "🎨", score: { energy: 0, sense: 1, emotion: -1, lifestyle: 2 } }
    ]
  },
  {
    id: 18,
    primaryAxis: "emotion",
    question: "많은 사람 앞에서 실수를 했다.",
    answers: [
      { text: "대수롭지 않게 웃어넘긴다.", emoji: "😅", score: { energy: 1, sense: 0, emotion: 1, lifestyle: 1 } },
      { text: "순간 부끄러워 얼굴이 빨개진다.", emoji: "😳", score: { energy: -1, sense: 0, emotion: 2, lifestyle: 0 } },
      { text: "왜 실수했는지 원인부터 따져본다.", emoji: "🧐", score: { energy: -1, sense: -1, emotion: -2, lifestyle: -1 } },
      { text: "오히려 그 실수를 재미있는 이야깃거리로 만든다.", emoji: "🎤", score: { energy: 2, sense: 1, emotion: 1, lifestyle: 1 } }
    ]
  },
  {
    id: 20,
    primaryAxis: "emotion",
    question: "열심히 준비한 일이 생각대로 되지 않았다.",
    answers: [
      { text: "될 때까지 다시 도전한다.", emoji: "🔁", score: { energy: 0, sense: 0, emotion: 0, lifestyle: 0 } },
      { text: "무엇이 문제였는지 차분히 분석한다.", emoji: "📊", score: { energy: -1, sense: -1, emotion: -2, lifestyle: -1 } },
      { text: "속상한 마음을 누군가에게 털어놓는다.", emoji: "😢", score: { energy: 1, sense: 0, emotion: 2, lifestyle: 0 } },
      { text: "\"그럴 수도 있지\" 하고 훌훌 털어버린다.", emoji: "🤷‍♂️", score: { energy: 0, sense: 0, emotion: 0, lifestyle: 2 } }
    ]
  },
  {
    id: 21,
    primaryAxis: "emotion",
    question: "친한 친구가 다른 친구들과 더 친하게 지내는 것 같다.",
    answers: [
      { text: "서운하지만 티내지 않는다.", emoji: "😶", score: { energy: -1, sense: 0, emotion: 1, lifestyle: -1 } },
      { text: "솔직하게 서운한 마음을 말한다.", emoji: "🗣️", score: { energy: 0, sense: 0, emotion: 2, lifestyle: 0 } },
      { text: "나도 다른 친구를 사귀면 된다고 생각한다.", emoji: "🙂", score: { energy: 1, sense: 0, emotion: -1, lifestyle: 1 } },
      { text: "별로 신경 쓰지 않는다.", emoji: "😐", score: { energy: -1, sense: 0, emotion: -2, lifestyle: 0 } }
    ]
  },
  {
    id: 24,
    primaryAxis: "emotion",
    question: "화가 나는 일이 생겼다.",
    answers: [
      { text: "그 자리에서 바로 솔직하게 표현한다.", emoji: "💢", score: { energy: 0, sense: 0, emotion: 1, lifestyle: 0 } },
      { text: "일단 참고 나중에 차분히 얘기한다.", emoji: "🫤", score: { energy: -1, sense: 0, emotion: -1, lifestyle: -1 } },
      { text: "다른 걸로 기분을 전환하려 한다.", emoji: "🎧", score: { energy: 0, sense: 0, emotion: 0, lifestyle: 1 } },
      { text: "왜 화가 났는지 논리적으로 정리해본다.", emoji: "🧠", score: { energy: -1, sense: -1, emotion: -2, lifestyle: -1 } }
    ]
  },
  {
    id: 43,
    primaryAxis: "emotion",
    question: "친구가 힘든 일을 겪고 나에게 털어놓는다.",
    answers: [
      { text: "원인과 해결책을 논리적으로 짚어준다.", emoji: "📐", score: { energy: 0, sense: -1, emotion: -2, lifestyle: 0 } },
      { text: "그 마음이 얼마나 힘들었을지 같이 아파해준다.", emoji: "🥹", score: { energy: 1, sense: 0, emotion: 2, lifestyle: 0 } },
      { text: "객관적으로 상황을 정리해준다.", emoji: "📋", score: { energy: -1, sense: -1, emotion: -1, lifestyle: 0 } },
      { text: "옆에서 그냥 함께 있어준다.", emoji: "🤍", score: { energy: 0, sense: 0, emotion: 1, lifestyle: 0 } }
    ]
  },
  {
    id: 44,
    primaryAxis: "emotion",
    question: "채용 면접에서 누구를 뽑을지 팀 회의 중이다.",
    answers: [
      { text: "스펙과 실적 등 객관적 기준으로 판단한다.", emoji: "📄", score: { energy: 0, sense: -1, emotion: -2, lifestyle: -1 } },
      { text: "이 사람과 함께 일했을 때 분위기를 상상해본다.", emoji: "🤝", score: { energy: 0, sense: 1, emotion: 1, lifestyle: 0 } },
      { text: "원칙과 기준표를 만들어 점수를 매긴다.", emoji: "📏", score: { energy: -1, sense: -1, emotion: -2, lifestyle: -1 } },
      { text: "면접자가 힘들어 보였던 부분이 마음에 걸린다.", emoji: "💭", score: { energy: 0, sense: 0, emotion: 2, lifestyle: 0 } }
    ]
  },
  {
    id: 45,
    primaryAxis: "emotion",
    question: "규칙을 어긴 친한 친구를 어떻게 대할지 고민된다.",
    answers: [
      { text: "옳고 그름은 확실히 짚어야 한다.", emoji: "⚖️", score: { energy: 0, sense: 0, emotion: -2, lifestyle: -1 } },
      { text: "그래도 그 사람 마음이 먼저 걱정된다.", emoji: "🫂", score: { energy: 0, sense: 0, emotion: 2, lifestyle: 0 } },
      { text: "원칙대로 처리하는 게 맞다고 생각한다.", emoji: "📏", score: { energy: -1, sense: -1, emotion: -2, lifestyle: -1 } },
      { text: "우리 사이니까 이해하고 넘어가고 싶다.", emoji: "💛", score: { energy: 0, sense: 0, emotion: 1, lifestyle: 1 } }
    ]
  },

  // ===================== lifestyle 축 (J/P) 중심 문항 ===================== //
  {
    id: 2,
    primaryAxis: "lifestyle",
    question: "친구들과 여행을 가는데 출발 하루 전까지 아무것도 정하지 않았다.",
    answers: [
      { text: "\"이러다 망한다.\" 내가 일정을 짠다.", emoji: "📋", score: { energy: 0, sense: -1, emotion: -1, lifestyle: -2 } },
      { text: "\"뭐 어때?\" 가서 정하면 된다.", emoji: "🤷", score: { energy: 1, sense: 1, emotion: 1, lifestyle: 2 } },
      { text: "친구들에게 의견을 먼저 물어본다.", emoji: "💬", score: { energy: 2, sense: 0, emotion: 2, lifestyle: 0 } },
      { text: "최소한 숙소와 교통편 정도는 확인한다.", emoji: "🏨", score: { energy: -1, sense: -2, emotion: 0, lifestyle: -2 } }
    ]
  },
  {
    id: 4,
    primaryAxis: "lifestyle",
    question: "친구가 갑자기 \"지금 바다 갈래?\"라고 한다.",
    answers: [
      { text: "\"좋아! 몇 시에 출발해?\"", emoji: "🌊", score: { energy: 2, sense: 0, emotion: 1, lifestyle: 2 } },
      { text: "\"잠깐만. 숙소랑 날씨부터 확인하자.\"", emoji: "☂️", score: { energy: 0, sense: -2, emotion: -1, lifestyle: -2 } },
      { text: "\"갑자기? 난 오늘 집에 있으려고 했는데.\"", emoji: "🏠", score: { energy: -2, sense: 0, emotion: 0, lifestyle: -1 } },
      { text: "\"좋지ㅋㅋ 아무 생각 없이 가자.\"", emoji: "🚗", score: { energy: 1, sense: 1, emotion: 1, lifestyle: 2 } }
    ]
  },
  {
    id: 8,
    primaryAxis: "lifestyle",
    question: "갑자기 큰돈이 생겼다.",
    answers: [
      { text: "일단 저축한다.", emoji: "🏦", score: { energy: -1, sense: -1, emotion: -1, lifestyle: -2 } },
      { text: "평소 사고 싶었던 걸 산다.", emoji: "🛍️", score: { energy: 0, sense: -1, emotion: 1, lifestyle: 1 } },
      { text: "여행을 떠난다.", emoji: "✈️", score: { energy: 2, sense: 1, emotion: 2, lifestyle: 2 } },
      { text: "투자나 재테크 방법을 알아본다.", emoji: "📈", score: { energy: -1, sense: -1, emotion: -2, lifestyle: -1 } }
    ]
  },
  {
    id: 11,
    primaryAxis: "lifestyle",
    question: "주말에 보기로 한 영화가 갑자기 취소됐다.",
    answers: [
      { text: "다른 영화를 바로 찾아본다.", emoji: "🎬", score: { energy: 1, sense: -1, emotion: 0, lifestyle: 2 } },
      { text: "\"그럼 다음에 보자.\"", emoji: "👌", score: { energy: -1, sense: 0, emotion: 0, lifestyle: -1 } },
      { text: "아쉬우니 친구와 다른 걸 하자고 한다.", emoji: "🎲", score: { energy: 2, sense: 1, emotion: 2, lifestyle: 1 } },
      { text: "오히려 잘 됐다. 집에서 쉬어야겠다.", emoji: "🛌", score: { energy: -2, sense: 0, emotion: 1, lifestyle: -2 } }
    ]
  },
  {
    id: 16,
    primaryAxis: "lifestyle",
    question: "여행 마지막 날, 아직 가보지 못한 곳이 하나 있다.",
    answers: [
      { text: "시간이 되면 무조건 가본다.", emoji: "🏃", score: { energy: 1, sense: 0, emotion: 1, lifestyle: 2 } },
      { text: "이동 시간과 일정을 계산해본다.", emoji: "🧮", score: { energy: -1, sense: -1, emotion: -1, lifestyle: -2 } },
      { text: "다음에 다시 오면 된다.", emoji: "🔁", score: { energy: -1, sense: 0, emotion: 0, lifestyle: -1 } },
      { text: "같이 온 사람들이 가고 싶어 하는지 물어본다.", emoji: "👥", score: { energy: 2, sense: 0, emotion: 2, lifestyle: 1 } }
    ]
  },
  {
    id: 19,
    primaryAxis: "lifestyle",
    question: "좋아하는 스타일이 남들과 다르게 눈에 띈다는 말을 들었다.",
    answers: [
      { text: "\"그게 바로 나야!\"라며 더 당당해진다.", emoji: "💅", score: { energy: 1, sense: 1, emotion: 1, lifestyle: 2 } },
      { text: "남들 시선이 좀 신경 쓰인다.", emoji: "👀", score: { energy: -1, sense: 0, emotion: 1, lifestyle: -1 } },
      { text: "어차피 내 마음에 들면 그만이다.", emoji: "🤙", score: { energy: 0, sense: 0, emotion: -1, lifestyle: 1 } },
      { text: "유행이나 분위기에 맞춰서 조절해본다.", emoji: "🪞", score: { energy: 0, sense: -1, emotion: 0, lifestyle: -1 } }
    ]
  },
  {
    id: 22,
    primaryAxis: "lifestyle",
    question: "꼭 이루고 싶은 목표가 생겼다.",
    answers: [
      { text: "구체적인 계획표부터 세운다.", emoji: "📝", score: { energy: -1, sense: -2, emotion: -1, lifestyle: -2 } },
      { text: "일단 할 수 있는 만큼 부딪혀본다.", emoji: "💪", score: { energy: 0, sense: -1, emotion: 0, lifestyle: 1 } },
      { text: "주변 사람들에게 알리고 응원을 받는다.", emoji: "📣", score: { energy: 2, sense: 0, emotion: 1, lifestyle: 0 } },
      { text: "마음속으로만 조용히 다짐한다.", emoji: "🤫", score: { energy: -2, sense: 0, emotion: 0, lifestyle: -1 } }
    ]
  },
  {
    id: 23,
    primaryAxis: "lifestyle",
    question: "다 같이 즉흥적으로 스릴 넘치는 액티비티를 해보자고 한다.",
    answers: [
      { text: "\"가장 먼저 해볼래!\"", emoji: "🎢", score: { energy: 1, sense: 1, emotion: 1, lifestyle: 2 } },
      { text: "안전한지부터 확인하고 결정한다.", emoji: "🦺", score: { energy: -1, sense: -1, emotion: -1, lifestyle: -2 } },
      { text: "다들 하면 분위기 맞춰서 같이 한다.", emoji: "🙌", score: { energy: 1, sense: 0, emotion: 1, lifestyle: 0 } },
      { text: "무섭지만 내색하지 않고 버틴다.", emoji: "😬", score: { energy: 0, sense: 0, emotion: 1, lifestyle: -1 } }
    ]
  },
  {
    id: 46,
    primaryAxis: "lifestyle",
    question: "다이어리(플래너)를 쓰는 습관에 대해 말하자면",
    answers: [
      { text: "하루 일정을 시간 단위로 빼곡히 적는다.", emoji: "🗓️", score: { energy: 0, sense: -1, emotion: 0, lifestyle: -2 } },
      { text: "딱히 계획을 안 세우고 그때그때 움직인다.", emoji: "🎈", score: { energy: 0, sense: 0, emotion: 0, lifestyle: 2 } },
      { text: "큰 일정만 대략 적어둔다.", emoji: "🗒️", score: { energy: 0, sense: 0, emotion: 0, lifestyle: -1 } },
      { text: "적어놔도 결국 마음 내키는 대로 한다.", emoji: "😄", score: { energy: 0, sense: 0, emotion: 0, lifestyle: 1 } }
    ]
  },
  {
    id: 47,
    primaryAxis: "lifestyle",
    question: "여행 짐을 쌀 때",
    answers: [
      { text: "며칠 전부터 체크리스트를 만들어 준비한다.", emoji: "✅", score: { energy: 0, sense: -1, emotion: 0, lifestyle: -2 } },
      { text: "떠나기 직전에 생각나는 대로 대충 싼다.", emoji: "🧳", score: { energy: 0, sense: 1, emotion: 0, lifestyle: 2 } },
      { text: "필요한 건 미리 사서 챙겨둔다.", emoji: "🛒", score: { energy: 0, sense: -1, emotion: 0, lifestyle: -1 } },
      { text: "가서 필요하면 그때 사면 된다고 생각한다.", emoji: "🏪", score: { energy: 0, sense: 1, emotion: 0, lifestyle: 1 } }
    ]
  },
  {
    id: 48,
    primaryAxis: "lifestyle",
    question: "갑자기 일정이 변경됐다는 연락을 받았다.",
    answers: [
      { text: "짜증이 난다, 계획이 틀어지는 게 싫다.", emoji: "😤", score: { energy: 0, sense: 0, emotion: -1, lifestyle: -2 } },
      { text: "오히려 재밌겠다, 즉흥적으로 움직이면 된다.", emoji: "🎊", score: { energy: 1, sense: 0, emotion: 1, lifestyle: 2 } },
      { text: "일정을 다시 짜맞춰야 마음이 놓인다.", emoji: "🔧", score: { energy: 0, sense: 0, emotion: 0, lifestyle: -1 } },
      { text: "그때그때 맞춰가면 되지 크게 신경 안 쓴다.", emoji: "🙂", score: { energy: 0, sense: 0, emotion: 0, lifestyle: 1 } }
    ]
  },
  {
    id: 49,
    primaryAxis: "lifestyle",
    question: "책상이나 방 정리 상태는",
    answers: [
      { text: "물건마다 자리가 정해져 있어야 마음이 편하다.", emoji: "🗄️", score: { energy: 0, sense: -1, emotion: 0, lifestyle: -2 } },
      { text: "약간 어질러져 있어도 크게 신경 안 쓴다.", emoji: "🧸", score: { energy: 0, sense: 0, emotion: 0, lifestyle: 2 } },
      { text: "정기적으로 정리하는 루틴이 있다.", emoji: "🧹", score: { energy: 0, sense: 0, emotion: 0, lifestyle: -1 } },
      { text: "필요할 때만 몰아서 치운다.", emoji: "📦", score: { energy: 0, sense: 0, emotion: 0, lifestyle: 1 } }
    ]
  },
  {
    id: 50,
    primaryAxis: "lifestyle",
    question: "마감이 있는 일을 처리하는 방식은",
    answers: [
      { text: "여유 있게 미리미리 끝내놓는다.", emoji: "⏱️", score: { energy: 0, sense: -1, emotion: 0, lifestyle: -2 } },
      { text: "마감 직전에 몰아서 끝낸다.", emoji: "🔥", score: { energy: 0, sense: 0, emotion: 0, lifestyle: 2 } },
      { text: "중간중간 진행 상황을 체크한다.", emoji: "📆", score: { energy: 0, sense: -1, emotion: 0, lifestyle: -1 } },
      { text: "닥치면 어떻게든 되더라고 생각한다.", emoji: "🍀", score: { energy: 0, sense: 0, emotion: 0, lifestyle: 1 } }
    ]
  },
  {
    id: 17,
    primaryAxis: "lifestyle",
    question: "팀 프로젝트에서 리더를 정해야 하는 상황이다.",
    answers: [
      { text: "\"내가 할게.\" 자원해서 이끈다.", emoji: "🙋", score: { energy: 1, sense: 0, emotion: -1, lifestyle: -1 } },
      { text: "능력 있어 보이는 사람을 추천한다.", emoji: "👍", score: { energy: 0, sense: -1, emotion: -1, lifestyle: -1 } },
      { text: "다들 부담스러워하니 분위기를 풀어준다.", emoji: "😊", score: { energy: 1, sense: 0, emotion: 1, lifestyle: 0 } },
      { text: "나서지 않고 주어진 역할만 잘 해낸다.", emoji: "🧩", score: { energy: -1, sense: -1, emotion: 0, lifestyle: -1 } }
    ]
  },
  {
    id: 32,
    primaryAxis: "lifestyle",
    question: "다 같이 즉흥적으로 스릴 넘치는 액티비티를 또 해보자고 한다.",
    answers: [
      { text: "\"이번에도 내가 먼저!\"", emoji: "🎡", score: { energy: 1, sense: 0, emotion: 1, lifestyle: 2 } },
      { text: "지난번처럼 안전 여부부터 확인한다.", emoji: "🧯", score: { energy: -1, sense: -1, emotion: -1, lifestyle: -1 } },
      { text: "다들 좋아하니 나도 자연스럽게 낀다.", emoji: "🙆‍♂️", score: { energy: 1, sense: 0, emotion: 1, lifestyle: 0 } },
      { text: "이번엔 그냥 구경만 하고 싶다.", emoji: "🍿", score: { energy: -1, sense: 0, emotion: 0, lifestyle: -1 } }
    ]
  }
];

/**
 * 향후 여러 종류의 테스트("나의 연애 유형은?" 등)를 추가하기 위한 레지스트리.
 * app.js는 이 객체를 통해 테스트 데이터에 접근한다 (현재는 default 하나만 존재).
 *
 * questionPool: 전체 50문항. 실제 테스트에서는 이 중 questionsPerTest(24)개를
 * 축별로 골고루 무작위 선별해서 사용한다 (app.js의 selectBalancedQuestions 참고).
 */
const QUESTIONS_PER_TEST = 24;

const TEST_DEFINITIONS = {
  "character-match": {
    id: "character-match",
    title: "나와 닮은 캐릭터는?",
    subtitle: QUESTIONS_PER_TEST + "개의 질문에 답하고\n나와 가장 닮은 캐릭터를 찾아보세요.",
    icon: "🔮",
    questionPool: CHARACTER_TEST_QUESTIONS,
    questionsPerTest: QUESTIONS_PER_TEST,
    // 이 테스트가 매칭에 사용할 캐릭터 세트 (characters.js 의 키)
    characterSetKey: "default"
  }
};
