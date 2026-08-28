# FitLog — 운동 루틴 & 이력 관리 (Firebase + Gemini)

부위별 신체 지도(바디맵)로 근육 회복 상태를 보고, 오늘 운동을 기록하면
소모 칼로리를 계산하고, 내일 어떤 부위를 하면 좋을지(또는 쉴지) 추천해주는
개인/멀티유저용 운동 트래커입니다. AI 코치 기능은 Gemini API를 사용합니다.

## 폴더 구조

```
index.html          메인 화면 (SPA)
css/style.css        전체 스타일
js/firebase-init.js  Firebase 초기화 (본인 프로젝트 config로 교체 필요)
js/exercises.js       운동 데이터베이스 (부위/칼로리 계산용 MET/운동방법)
js/main.js            앱 로직 전체 (인증, 바디맵, 기록, 추천, AI 코치)
api/gemini.js          Vercel 서버리스 함수 (Gemini API 프록시, 키 보호용)
vercel.json             Vercel 설정
firestore.rules          Firestore 보안 규칙
```

## 1. Firebase 프로젝트 설정

1. https://console.firebase.google.com 에서 새 프로젝트 생성
2. **Authentication** → 로그인 방법에서 **이메일/비밀번호** 활성화
3. **Firestore Database** 생성 (프로덕션 모드로 생성해도 무방, 아래 규칙을 적용할 것이기 때문)
4. 프로젝트 설정 → 내 앱 → 웹 앱 추가 → 발급된 `firebaseConfig` 값을
   `js/firebase-init.js` 상단의 `firebaseConfig` 객체에 그대로 붙여넣기

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

5. Firestore 보안 규칙 적용: Firebase 콘솔 → Firestore Database → 규칙 탭에
   이 저장소의 `firestore.rules` 내용을 붙여넣고 게시(Publish)
   (또는 Firebase CLI가 있다면 `firebase deploy --only firestore:rules`)

이 규칙은 로그인한 본인의 `users/{본인 uid}` 문서와 그 하위 컬렉션(운동 기록 등)만
읽고 쓸 수 있도록 제한합니다. 즉 여러 사용자가 같은 앱을 써도 서로의 기록은 볼 수 없습니다.

## 2. Gemini API 키 발급

1. https://aistudio.google.com 에서 API 키 발급
2. **이 키는 절대 클라이언트 코드(js 파일)에 직접 넣지 마세요.** 브라우저 소스에 그대로
   노출되어 누구나 도용할 수 있습니다. 이 프로젝트는 `api/gemini.js`라는 Vercel
   서버리스 함수를 통해서만 Gemini를 호출하도록 이미 구성되어 있습니다.

## 3. Vercel 배포

1. 이 폴더를 GitHub 저장소에 push
2. https://vercel.com 에서 해당 저장소를 Import
3. 프로젝트 설정 → **Environment Variables**에 아래 값 추가
   - `GEMINI_API_KEY` : 위에서 발급받은 키
   - `GEMINI_MODEL` (선택) : 사용할 Gemini 모델명. 비워두면 기본값(`gemini-2.0-flash`) 사용.
     Google AI Studio 문서에서 현재 사용 가능한 최신 모델명을 확인해 필요하면 지정하세요.
4. Deploy

> GitHub Pages 등 순수 정적 호스팅에도 프론트엔드(index.html 등)는 올릴 수 있지만,
> `/api/gemini` 서버리스 함수는 동작하지 않으므로 AI 코치 기능만 빠지게 됩니다.
> AI 코치까지 쓰려면 Vercel(또는 유사한 서버리스 지원 호스팅)로 배포하세요.

## 4. 로컬에서 테스트

정적 파일이라 별도 빌드가 필요 없습니다. 다만 `type="module"` 스크립트는
`file://`로 열면 CORS 문제로 동작하지 않으니 간단한 로컬 서버로 열어주세요.

```bash
npx serve .
# 또는
python3 -m http.server 5173
```

`/api/gemini`까지 로컬에서 테스트하려면 `vercel dev`를 사용하세요 (Vercel CLI 설치 필요).

## 주요 기능

- **이메일/비밀번호 로그인·회원가입** (Firebase Auth), 사용자별 데이터는 Firestore에 분리 저장
- **온보딩**: 첫 가입 후 성별·연령대·체중/키·운동목표·운동가능 요일·운동시간대·헬스장/맨몸 여부·(선택)키우고 싶은/피하고 싶은 부위를 입력받아 프로필과 추천 로직에 반영
- **홈 화면**: 오늘의 추천 부위(또는 휴식 안내), 오늘 소모 칼로리·세트·이번 주 운동일·연속 운동일, 부위별 회복 상태 바디맵을 스크롤 없이 한 화면에 표시
- **운동(퀘스트) 탭**: 추천 부위 기반 자동 구성 또는 직접 종목 선택으로 오늘의 운동 목록을 만들고, 세트를 하나씩 깨는 퀘스트 형식으로 진행. 세트 완료 시 부위별 권장 휴식 시간(가슴/등/하체 90초, 어깨 75초, 팔/복근 45초) 동안 휴식 타이머가 뜨고, 종료 시 소리 알림(음소거 가능)
- **운동 기록**: 근력 운동은 무게×횟수(세트별), 유산소(러닝/사이클/로잉 등)는 시간+평균 속도로 기록. 속도 구간에 따라 칼로리 계산에 사용하는 MET 값이 달라짐
- **추천 로직(규칙 기반)**: 부위별 권장 회복일, 연속 운동일수, 프로필의 "피하고 싶은 부위"(제외)·"키우고 싶은 부위"(우선순위 가점)를 반영해 오늘 훈련할 부위 또는 휴식을 추천
- **AI 코치**: 최근 7일 기록과 규칙 기반 추천을 Gemini에 전달해 총평·밸런스 조언·내일 제안을 한국어로 생성 (기록 탭에 위치, 하루 1회 결과를 로컬에 캐시)
- **기록(캘린더)**: 월별 캘린더에서 운동한 날짜가 표시되고, 날짜를 탭하면 해당 일의 상세 기록 확인 가능. 과거 날짜에 대한 수동 기록 추가도 지원
- **라이트/다크 테마**: 기본은 라이트 모드이며, 설정 탭에서 다크 모드로 전환 가능 (로컬에 저장)

## 커스터마이징 아이디어

- `js/exercises.js`에 운동 종목을 자유롭게 추가/수정 (추후 `image` 필드에 이미지 URL을 채우면 퀘스트 카드에 반영하도록 확장 가능)
- `MUSCLE_RECOVERY_DAYS`, `REST_SECONDS`(main.js) 값을 조정해 추천/휴식 타이머 기준 변경
- PWA(manifest + service worker)로 확장하면 홈 화면 추가 및 오프라인 지원 가능
