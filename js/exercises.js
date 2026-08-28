// 운동 데이터베이스
// muscle: chest | back | shoulders | arms | abs | legs | cardio
// logType: 'strength' (무게x횟수) | 'cardio' (시간+속도)
// equipment: 'gym' | 'bodyweight' | 'both'  (헬스장 필요 여부)
// image: 추후 이미지 URL 제공 예정 (현재는 null)
export const MUSCLE_LABELS = {
  chest: "가슴",
  back: "등",
  shoulders: "어깨",
  arms: "팔",
  abs: "복근",
  legs: "하체",
  cardio: "유산소",
};

export const MUSCLE_RECOVERY_DAYS = {
  chest: 2,
  back: 2,
  shoulders: 2,
  legs: 2,
  arms: 1,
  abs: 1,
  cardio: 0,
};

export const GOAL_LABELS = {
  muscle: "근육량 증가",
  diet: "다이어트/체지방 감소",
  stamina: "체력/지구력 향상",
  health: "건강 관리",
};

export const EXERCISES = [
  // 가슴
  { id: "bench_press", name: "벤치프레스", muscle: "chest", met: 6, equipment: "gym", logType: "strength", image: null,
    howto: "가슴을 펴고 견갑골을 모은 상태에서 바벨을 가슴 아래쪽까지 천천히 내렸다가 밀어 올립니다." },
  { id: "incline_db_press", name: "인클라인 덤벨프레스", muscle: "chest", met: 6, equipment: "gym", logType: "strength", image: null,
    howto: "벤치 각도를 30~45도로 세우고 덤벨을 가슴 위쪽 라인까지 내렸다가 밀어 올립니다." },
  { id: "push_up", name: "푸시업", muscle: "chest", met: 8, equipment: "bodyweight", logType: "strength", image: null,
    howto: "손은 어깨너비보다 약간 넓게, 몸은 일직선을 유지하며 가슴이 바닥에 가까워질 때까지 내려갑니다." },
  { id: "cable_crossover", name: "케이블 크로스오버", muscle: "chest", met: 5, equipment: "gym", logType: "strength", image: null,
    howto: "케이블을 양손에 잡고 팔꿈치를 살짝 굽힌 채 가슴 앞에서 손을 모으듯 교차시킵니다." },

  // 등
  { id: "deadlift", name: "데드리프트", muscle: "back", met: 6, equipment: "gym", logType: "strength", image: null,
    howto: "허리를 곧게 편 상태에서 바벨을 정강이에 가깝게 유지하며 엉덩이를 뒤로 빼서 들어 올립니다." },
  { id: "lat_pulldown", name: "랫풀다운", muscle: "back", met: 5, equipment: "gym", logType: "strength", image: null,
    howto: "가슴을 살짝 내밀고 바를 쇄골 앞까지 당기며 등 근육으로 당긴다는 느낌을 유지합니다." },
  { id: "barbell_row", name: "바벨로우", muscle: "back", met: 6, equipment: "gym", logType: "strength", image: null,
    howto: "상체를 45도 정도 숙인 상태에서 바벨을 배꼽 방향으로 당겨 올립니다." },
  { id: "pull_up", name: "풀업", muscle: "back", met: 8, equipment: "bodyweight", logType: "strength", image: null,
    howto: "어깨너비보다 넓게 바를 잡고 턱이 바 위로 올라올 때까지 몸을 끌어올립니다." },

  // 어깨
  { id: "ohp", name: "오버헤드프레스", muscle: "shoulders", met: 6, equipment: "gym", logType: "strength", image: null,
    howto: "코어에 힘을 준 상태로 바벨 또는 덤벨을 머리 위로 곧게 밀어 올립니다." },
  { id: "lateral_raise", name: "사이드레터럴레이즈", muscle: "shoulders", met: 4, equipment: "gym", logType: "strength", image: null,
    howto: "팔꿈치를 살짝 굽힌 채 덤벨을 어깨 높이까지 옆으로 들어 올립니다." },
  { id: "face_pull", name: "페이스풀", muscle: "shoulders", met: 4, equipment: "gym", logType: "strength", image: null,
    howto: "케이블을 얼굴 방향으로 당기며 팔꿈치를 뒤로 넓게 벌려 뒤쪽 어깨를 자극합니다." },

  // 팔
  { id: "barbell_curl", name: "바벨컬", muscle: "arms", met: 4, equipment: "gym", logType: "strength", image: null,
    howto: "팔꿈치를 몸통에 고정한 채 바벨을 천천히 감아 올렸다가 내립니다." },
  { id: "triceps_pushdown", name: "트라이셉스 푸시다운", muscle: "arms", met: 4, equipment: "gym", logType: "strength", image: null,
    howto: "팔꿈치를 옆구리에 고정하고 케이블 바를 아래로 곧게 펴줍니다." },
  { id: "db_kickback", name: "덤벨킥백", muscle: "arms", met: 3.5, equipment: "gym", logType: "strength", image: null,
    howto: "상체를 숙인 상태에서 팔꿈치를 고정하고 덤벨을 뒤로 곧게 펴줍니다." },

  // 복근
  { id: "crunch", name: "크런치", muscle: "abs", met: 4, equipment: "bodyweight", logType: "strength", image: null,
    howto: "무릎을 세우고 상체를 말아 올리듯 복부에 힘을 주며 들어 올립니다." },
  { id: "hanging_leg_raise", name: "행잉레그레이즈", muscle: "abs", met: 5, equipment: "bodyweight", logType: "strength", image: null,
    howto: "바에 매달린 상태에서 다리를 곧게 편 채 수평 가까이 들어 올립니다." },
  { id: "plank", name: "플랭크", muscle: "abs", met: 3, equipment: "bodyweight", logType: "strength", image: null,
    howto: "팔뚝과 발끝으로 몸을 지탱하며 머리부터 발끝까지 일직선을 유지합니다." },

  // 하체
  { id: "squat", name: "스쿼트", muscle: "legs", met: 8, equipment: "both", logType: "strength", image: null,
    howto: "발은 어깨너비로 벌리고 무릎이 발끝 방향을 향하게 하며 엉덩이를 뒤로 빼듯 앉습니다." },
  { id: "leg_press", name: "레그프레스", muscle: "legs", met: 6, equipment: "gym", logType: "strength", image: null,
    howto: "발판에 발을 어깨너비로 두고 무릎이 90도 정도 될 때까지 내렸다가 밀어냅니다." },
  { id: "lunge", name: "런지", muscle: "legs", met: 6, equipment: "both", logType: "strength", image: null,
    howto: "한 발을 앞으로 크게 내딛고 뒷무릎이 바닥에 가까워질 때까지 내려갑니다." },
  { id: "leg_curl", name: "레그컬", muscle: "legs", met: 4, equipment: "gym", logType: "strength", image: null,
    howto: "엎드리거나 앉은 상태에서 무릎을 굽혀 패드를 뒤꿈치 방향으로 당깁니다." },

  // 유산소 (시간 + 속도 기반)
  { id: "running", name: "러닝", muscle: "cardio", met: 9.8, equipment: "both", logType: "cardio", image: null,
    howto: "일정한 페이스로 호흡을 유지하며 달립니다.", speedTiers: [
      { max: 6, met: 6 }, { max: 8, met: 8.3 }, { max: 10, met: 9.8 },
      { max: 12, met: 11.5 }, { max: 14, met: 13.5 }, { max: Infinity, met: 16 },
    ] },
  { id: "cycling", name: "사이클", muscle: "cardio", met: 7.5, equipment: "both", logType: "cardio", image: null,
    howto: "케이던스를 일정하게 유지하며 페달링합니다.", speedTiers: [
      { max: 16, met: 4 }, { max: 19, met: 6 }, { max: 22, met: 8 },
      { max: 25, met: 10 }, { max: Infinity, met: 12 },
    ] },
  { id: "rowing", name: "로잉머신", muscle: "cardio", met: 7, equipment: "gym", logType: "cardio", image: null,
    howto: "다리-허리-팔 순서로 당기고 반대 순서로 되돌아옵니다." },
];

export function getExercise(id) {
  return EXERCISES.find((e) => e.id === id);
}

export function metForCardio(ex, speedKmh) {
  if (!ex.speedTiers || !speedKmh) return ex.met;
  const tier = ex.speedTiers.find((t) => speedKmh <= t.max);
  return tier ? tier.met : ex.met;
}
