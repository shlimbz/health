/**
 * app.js
 * -----------------------------------------------------------------------
 * 화면 전환 / 점수 계산 / 캐릭터 매칭 / 공유 등 앱의 전체 로직을 담당한다.
 * 데이터(tests.js, characters.js)와 로직(이 파일)을 분리해두었기 때문에,
 * 나중에 서버(Firebase/Supabase 등)를 붙일 때도 이 파일의 저장/로딩
 * 부분만 교체하면 된다. (현재는 sessionStorage 기반 로컬 저장)
 * -----------------------------------------------------------------------
 */

(function () {
  "use strict";

  /* ----------------------------------------------------------------- */
  /* 0. 설정값                                                          */
  /* ----------------------------------------------------------------- */
  const ACTIVE_TEST_ID = "character-match"; // tests.js 의 TEST_DEFINITIONS 키
  const STORAGE_KEY = "character-test:progress:v2";

  const activeTest = TEST_DEFINITIONS[ACTIVE_TEST_ID];
  const questionPool = activeTest.questionPool;
  const QUESTIONS_PER_TEST = activeTest.questionsPerTest || questionPool.length;
  const characterSet = CHARACTER_SETS[activeTest.characterSetKey] || CHARACTER_SETS.default;

  // 실제 이번 회차에 사용할 질문 배열. startTest()에서 selectBalancedQuestions()로
  // 채워지고, 새로고침 시에는 저장된 순서를 그대로 복원한다.
  let questions = [];

  /* ----------------------------------------------------------------- */
  /* 1. DOM 참조                                                        */
  /* ----------------------------------------------------------------- */
  const screens = {
    main: document.getElementById("screen-main"),
    quiz: document.getElementById("screen-quiz"),
    result: document.getElementById("screen-result")
  };

  const el = {
    startBtn: document.getElementById("start-test-btn"),
    mainTitle: document.getElementById("main-title"),
    mainSubtitle: document.getElementById("main-subtitle"),
    mainIcon: document.getElementById("main-icon"),
    participantNote: document.getElementById("participant-note"),

    quizBody: document.getElementById("quiz-body"),
    progressLabel: document.getElementById("progress-label"),
    progressFill: document.getElementById("progress-fill"),
    backBtn: document.getElementById("quiz-back-btn"),
    questionText: document.getElementById("question-text"),
    answersList: document.getElementById("answers-list"),

    traitBars: document.getElementById("trait-bars"),
    resultGroups: document.getElementById("result-groups"),
    shareBtn: document.getElementById("share-btn"),
    restartBtn: document.getElementById("restart-btn"),
    shareToast: document.getElementById("share-toast")
  };

  /* ----------------------------------------------------------------- */
  /* 2-1. 이모지 호환 처리 (Twemoji)                                     */
  /* ----------------------------------------------------------------- */
  // 일부 OS/브라우저 조합에서는 최신 이모지가 없어 네모(tofu)로 보인다.
  // Twemoji로 텍스트 이모지를 이미지로 변환해 모든 환경에서 동일하게 보이게 한다.
  // (CDN: cdnjs — GitHub Pages 등 실제 배포 환경에서 문제없이 로드된다)
  const TWEMOJI_BASE = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/";

  function applyEmojiSupport(container) {
    if (!window.twemoji || !container) return;
    try {
      window.twemoji.parse(container, {
        base: TWEMOJI_BASE,
        folder: "svg",
        ext: ".svg"
      });
    } catch (err) {
      // twemoji 로드에 실패해도(오프라인 등) 기본 텍스트 이모지로 자연스럽게 표시된다.
      console.warn("이모지 변환에 실패했어요:", err);
    }
  }

  /* ----------------------------------------------------------------- */
  /* 2-2. 질문 풀에서 24개를 축별로 골고루 무작위 선택                     */
  /* ----------------------------------------------------------------- */
  // Fisher-Yates 셔플
  function shuffle(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  // 질문 풀(50개)을 primaryAxis별로 묶은 뒤, 각 축에서 골고루 뽑아 총
  // QUESTIONS_PER_TEST(24)개를 만든다. 이렇게 해야 매번 다른 조합이 나와도
  // 4개 축을 빠짐없이, 비슷한 비중으로 측정할 수 있다("분별력 있게").
  function selectBalancedQuestions() {
    const byAxis = {};
    questionPool.forEach((q) => {
      const axis = q.primaryAxis || "etc";
      if (!byAxis[axis]) byAxis[axis] = [];
      byAxis[axis].push(q);
    });

    const axes = Object.keys(byAxis);
    const perAxis = Math.floor(QUESTIONS_PER_TEST / axes.length);
    let remainder = QUESTIONS_PER_TEST - perAxis * axes.length;

    let selected = [];
    axes.forEach((axis) => {
      const shuffled = shuffle(byAxis[axis]);
      let take = perAxis;
      if (remainder > 0) {
        take += 1;
        remainder -= 1;
      }
      selected = selected.concat(shuffled.slice(0, take));
    });

    return shuffle(selected);
  }

  function resolveQuestionsFromIds(ids) {
    if (!ids || !ids.length) return null;
    const byId = {};
    questionPool.forEach((q) => { byId[q.id] = q; });
    const resolved = ids.map((id) => byId[id]).filter(Boolean);
    return resolved.length === ids.length ? resolved : null;
  }

  /* ----------------------------------------------------------------- */
  /* 2. 상태 관리                                                       */
  /* ----------------------------------------------------------------- */
  let state = {
    testId: ACTIVE_TEST_ID,
    questionIds: [], // 이번 회차에 뽑힌 24개 질문의 id (새로고침 시 순서 복원용)
    currentIndex: 0,
    answerIndices: [], // 각 질문에서 선택한 답변의 index (뒤로가기 지원)
    finishedCharacterId: null,
    finishedSimilarity: null,
    finishedVector: null
  };

  function saveState() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      // sessionStorage를 사용할 수 없는 환경(프라이빗 모드 등)이어도
      // 앱이 죽지 않도록 조용히 무시한다.
      console.warn("진행 상태를 저장하지 못했어요:", err);
    }
  }

  function loadState() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.testId === ACTIVE_TEST_ID) return parsed;
      return null;
    } catch (err) {
      return null;
    }
  }

  function clearState() {
    state = {
      testId: ACTIVE_TEST_ID,
      questionIds: [],
      currentIndex: 0,
      answerIndices: [],
      finishedCharacterId: null,
      finishedSimilarity: null,
      finishedVector: null
    };
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      /* noop */
    }
  }

  /* ----------------------------------------------------------------- */
  /* 3. 화면 전환                                                       */
  /* ----------------------------------------------------------------- */
  function showScreen(name) {
    Object.keys(screens).forEach((key) => {
      screens[key].hidden = key !== name;
    });
  }

  /* ----------------------------------------------------------------- */
  /* 4. 메인 화면                                                       */
  /* ----------------------------------------------------------------- */
  function renderMain() {
    el.mainIcon.textContent = activeTest.icon;
    el.mainTitle.textContent = activeTest.title;
    el.mainSubtitle.textContent = activeTest.subtitle;
    // 참여자 수 데이터는 향후 백엔드 연동 시 채워 넣는다.
    // el.participantNote.textContent = "지금까지 12,345명이 테스트했어요";
    // el.participantNote.classList.add("is-active");

    applyEmojiSupport(screens.main);
  }

  function startTest() {
    isTransitioning = false;
    clearState();
    questions = selectBalancedQuestions();
    state.questionIds = questions.map((q) => q.id);
    saveState();
    showScreen("quiz");
    renderQuestion();
    pushHistoryState("quiz");
  }

  /* ----------------------------------------------------------------- */
  /* 5. 질문 화면                                                       */
  /* ----------------------------------------------------------------- */
  function renderQuestion() {
    const idx = state.currentIndex;
    const q = questions[idx];

    el.progressLabel.textContent =
      "Q " + String(idx + 1).padStart(2, "0") + " / " + String(questions.length).padStart(2, "0");
    const percent = Math.round(((idx + 1) / questions.length) * 100);
    el.progressFill.style.width = percent + "%";

    el.backBtn.disabled = idx === 0;

    el.questionText.textContent = q.question;

    el.answersList.innerHTML = "";
    q.answers.forEach((answer, answerIdx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-btn";
      btn.setAttribute("data-answer-index", String(answerIdx));

      // 이전에 이미 선택했던 답이라면(뒤로가기 등으로 재방문) 시각적으로 표시해준다.
      if (state.answerIndices[idx] === answerIdx) {
        btn.classList.add("is-previous-choice");
      }

      const emojiSpan = document.createElement("span");
      emojiSpan.className = "answer-emoji";
      emojiSpan.textContent = answer.emoji || "";

      const textSpan = document.createElement("span");
      textSpan.textContent = answer.text;

      btn.appendChild(emojiSpan);
      btn.appendChild(textSpan);
      btn.addEventListener("click", () => selectAnswer(answerIdx, btn));

      el.answersList.appendChild(btn);
    });

    // 질문 전환 애니메이션을 매번 다시 트리거
    el.quizBody.classList.remove("quiz-body");
    // 강제 리플로우로 애니메이션 재시작
    void el.quizBody.offsetWidth;
    el.quizBody.classList.add("quiz-body");

    applyEmojiSupport(el.answersList);
  }

  // 문항 전환 도중(160ms) 추가 클릭이 들어와도 무시하기 위한 잠금 플래그.
  // 이게 없으면 마지막 문항에서 더블클릭/더블탭 시 finishTest()가 두 번 실행되어,
  // 매칭에 포함된 랜덤 요소 때문에 결과 캐릭터가 한 번 바뀌어 보이는 문제가 있었다.
  // finishTest()는 사진 미리 불러오기(preload)까지 끝나야 완전히 마무리되므로,
  // 이 플래그는 그 시점(showResultScreen 완료)까지 계속 true로 유지된다.
  let isTransitioning = false;

  function selectAnswer(answerIdx, btnEl) {
    if (isTransitioning) return;
    isTransitioning = true;

    // 짧은 선택 피드백 애니메이션
    btnEl.classList.add("is-selected");
    // 전환이 끝날 때까지 같은 문항의 다른 버튼도 눌리지 않도록 잠근다.
    Array.from(el.answersList.children).forEach((b) => { b.disabled = true; });

    state.answerIndices[state.currentIndex] = answerIdx;
    saveState();

    window.setTimeout(() => {
      if (state.currentIndex < questions.length - 1) {
        state.currentIndex += 1;
        saveState();
        renderQuestion();
        isTransitioning = false;
        // 문항마다 히스토리를 쌓지 않는다 — 브라우저 뒤로가기는 "퀴즈 화면 진입 전"으로
        // 돌아가는 화면 단위 동작으로 통일하고, 문항 간 이동은 화면 안의 '‹' 버튼이 담당한다.
      } else {
        finishTest(); // 내부에서 이미지 preload가 끝나면 isTransitioning을 풀어준다.
      }
    }, 160);
  }

  function goToPrevQuestion() {
    if (isTransitioning) return;
    if (state.currentIndex === 0) return;
    state.currentIndex -= 1;
    saveState();
    renderQuestion();
  }

  /* ----------------------------------------------------------------- */
  /* 6. 점수 계산 & 캐릭터 매칭                                          */
  /* ----------------------------------------------------------------- */
  const AXES = ["energy", "sense", "emotion", "lifestyle"];

  // 이번 회차에 뽑힌 질문들의 누적 점수를 계산한다.
  function computeRawVector() {
    const totals = { energy: 0, sense: 0, emotion: 0, lifestyle: 0 };
    questions.forEach((q, idx) => {
      const answerIdx = state.answerIndices[idx];
      if (answerIdx === undefined) return; // 새로고침 등으로 비어있는 값 방어
      const score = q.answers[answerIdx].score;
      AXES.forEach((axis) => {
        totals[axis] += score[axis] || 0;
      });
    });
    return totals;
  }

  // 캐릭터 데이터(-2 ~ +2)와 같은 스케일로 비교하기 위해
  // "질문당 평균 점수"로 정규화한다.
  function normalizeVector(rawVector, questionCount) {
    const normalized = {};
    AXES.forEach((axis) => {
      normalized[axis] = rawVector[axis] / questionCount;
    });
    return normalized;
  }

  // 4개 축의 차이를 계산해 가장 가까운 캐릭터를 찾는다.
  // 가중치(MATCHING_WEIGHTS)는 characters.js에서 손쉽게 조정할 수 있다.
  //
  // 캐릭터가 많아지면서(현재 45종) 성향이 비슷한 캐릭터들이 여러 개 생긴다.
  // "가장 가까운 1명"만 고정으로 뽑으면 비슷한 유형을 여러 개 넣어둔 의미가
  // 없어지므로, 최소 거리 기준 MATCH_POOL_TOLERANCE 이내의 캐릭터들을
  // "후보 풀"로 묶고 그 안에서 거리에 반비례하는 가중 랜덤으로 최종 결과를 고른다.
  // (비슷한 성향의 캐릭터가 여럿이면 그중 실제로 가장 가까운 쪽이 뽑힐 확률이
  // 훨씬 높고, 아주 근소한 차이일 때만 가끔 다른 결과가 나온다.)
  function findClosestCharacter(userVector) {
    const scored = characterSet.map((character) => {
      let distance = 0;
      AXES.forEach((axis) => {
        const weight = (MATCHING_WEIGHTS && MATCHING_WEIGHTS[axis]) || 1;
        distance += Math.abs(userVector[axis] - character.personality[axis]) * weight;
      });
      return { character, distance };
    });

    scored.sort((a, b) => a.distance - b.distance);

    const bestDistance = scored[0].distance;
    const tolerance = typeof MATCH_POOL_TOLERANCE === "number" ? MATCH_POOL_TOLERANCE : 0;
    const pool = scored.filter((entry) => entry.distance <= bestDistance + tolerance);

    const picked = weightedRandomPick(pool);
    return { character: picked.character, distance: picked.distance };
  }

  // 거리가 가까울수록(distance가 작을수록) 더 높은 확률로 뽑히는 가중 랜덤 선택.
  // pool이 1개뿐이면 그 캐릭터를 그대로 반환한다.
  function weightedRandomPick(pool) {
    if (pool.length === 1) return pool[0];

    const weights = pool.map((entry) => 1 / (entry.distance + 0.5));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    let roll = Math.random() * totalWeight;
    for (let i = 0; i < pool.length; i += 1) {
      roll -= weights[i];
      if (roll <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  // 임의의 숫자가 아니라 거리값을 기반으로 한 유사도(%) 계산.
  // 축 하나당 최대 차이는 4(-2~+2), 4개 축이므로 이론상 최대 거리는 16.
  // 최소 표시 유사도를 50%로 두어 "그럭저럭 닮았어요" 대신 긍정적인 톤을 유지한다.
  const MAX_POSSIBLE_DISTANCE = 16;
  const MIN_DISPLAYED_SIMILARITY = 50;

  function calcSimilarity(distance) {
    const raw = 100 - (distance / MAX_POSSIBLE_DISTANCE) * 100;
    const clamped = Math.max(MIN_DISPLAYED_SIMILARITY, Math.min(99, Math.round(raw)));
    return clamped;
  }

  /* ----------------------------------------------------------------- */
  /* 6-1. 결과 사진 미리 불러오기 (요구사항: 결과 발표 전 다른 화면이       */
  /*      잠깐 보이는 깜빡임 방지)                                       */
  /* ----------------------------------------------------------------- */
  // <img>가 화면에 붙은 뒤에야 로딩을 시작하면, 로딩되기 전까지는 이모지
  // 폴백이 먼저 보였다가 사진으로 바뀌는 "깜빡임"이 생긴다. 화면을 보여주기
  // 전에 미리 이미지를 브라우저 캐시에 올려두면, 실제로 <img>를 붙였을 때
  // 이미 캐시에 있으니 onload가 사실상 즉시 발생해 깜빡임 없이 한 번에 나온다.
  function preloadImage(url, timeoutMs) {
    return new Promise((resolve) => {
      if (!url) {
        resolve();
        return;
      }
      const img = new Image();
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      img.onload = finish;
      img.onerror = finish;
      img.src = url;
      window.setTimeout(finish, timeoutMs);
    });
  }

  function finishTest() {
    const rawVector = computeRawVector();
    const userVector = normalizeVector(rawVector, questions.length);
    const { character, distance } = findClosestCharacter(userVector);
    const similarity = calcSimilarity(distance);

    state.finishedCharacterId = character.id;
    state.finishedSimilarity = similarity;
    state.finishedVector = userVector;
    saveState();

    const imageUrl = typeof getCharacterImageUrl === "function" ? getCharacterImageUrl(character) : "";

    preloadImage(imageUrl, 600).then(() => {
      renderResult(userVector, character, similarity);
      showScreen("result");
      pushHistoryState("result");
      isTransitioning = false;
    });
  }

  /* ----------------------------------------------------------------- */
  /* 7. 결과 화면                                                       */
  /* ----------------------------------------------------------------- */
  const TRAIT_LABELS = {
    energy: "사람과 함께",
    sense: "상상·아이디어",
    emotion: "감정·공감",
    lifestyle: "자유로운 편"
  };

  // -2~+2 값을 0~100% 막대 길이로 변환
  function axisValueToBarPercent(value) {
    const percent = ((value + 2) / 4) * 100;
    return Math.max(4, Math.min(100, percent));
  }

  function renderResult(userVector, character, similarity) {
    // 사용자 자신의 성향 그래프
    el.traitBars.innerHTML = "";
    AXES.forEach((axis) => {
      const row = document.createElement("div");
      row.className = "trait-bar-row";

      const label = document.createElement("div");
      label.className = "trait-bar-label";
      label.textContent = TRAIT_LABELS[axis];

      const track = document.createElement("div");
      track.className = "trait-bar-track";
      const fill = document.createElement("div");
      fill.className = "trait-bar-fill";
      track.appendChild(fill);

      row.appendChild(label);
      row.appendChild(track);
      el.traitBars.appendChild(row);

      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          fill.style.width = axisValueToBarPercent(userVector[axis]) + "%";
        }, 60);
      });
    });

    el.resultGroups.innerHTML = "";
    el.resultGroups.appendChild(createResultCard(character, similarity));

    applyEmojiSupport(screens.result);
  }

  // 캐릭터 결과 카드 하나를 만든다. (이미지는 finishTest에서 이미 preload된
  // 상태이므로, 여기서는 그냥 <img>를 붙이기만 해도 거의 즉시 나타난다.)
  function createResultCard(character, similarity) {
    const card = document.createElement("div");
    card.className = "result-group";

    const figure = document.createElement("div");
    figure.className = "result-group-figure";
    const img = document.createElement("img");
    img.className = "result-group-photo";
    img.alt = character.name + " 캐릭터 이미지";
    img.hidden = true;
    const fallback = document.createElement("span");
    fallback.className = "result-group-fallback";
    fallback.textContent = character.emoji || "✨";
    figure.appendChild(img);
    figure.appendChild(fallback);
    card.appendChild(figure);
    setPhotoElement(img, fallback, character);

    const name = document.createElement("h3");
    name.className = "result-group-name";
    name.textContent = character.name;
    card.appendChild(name);

    const match = document.createElement("p");
    match.className = "result-group-match";
    match.textContent = "당신과 " + similarity + "% 닮았어요!";
    card.appendChild(match);

    const tagline = document.createElement("p");
    tagline.className = "result-group-tagline";
    tagline.textContent = "\u201C" + character.tagline + "\u201D";
    card.appendChild(tagline);

    const details = document.createElement("details");
    details.className = "result-group-details";
    details.open = true; // 결과가 1개뿐이므로 바로 펼쳐서 보여준다.
    const summary = document.createElement("summary");
    summary.textContent = "자세히 보기";
    details.appendChild(summary);

    const description = document.createElement("p");
    description.className = "result-group-description";
    description.textContent = character.description;
    details.appendChild(description);

    if (character.traits && character.traits.length) {
      const traitsTitle = document.createElement("h4");
      traitsTitle.className = "result-group-subtitle";
      traitsTitle.textContent = "이런 사람이에요";
      details.appendChild(traitsTitle);

      const traitsList = document.createElement("ul");
      traitsList.className = "result-list";
      character.traits.forEach((trait) => {
        const li = document.createElement("li");
        li.textContent = trait;
        traitsList.appendChild(li);
      });
      details.appendChild(traitsList);
    }

    if (character.reasons && character.reasons.length) {
      const reasonsTitle = document.createElement("h4");
      reasonsTitle.className = "result-group-subtitle";
      reasonsTitle.textContent = "당신과 닮은 이유";
      details.appendChild(reasonsTitle);

      const reasonsList = document.createElement("ul");
      reasonsList.className = "result-list";
      character.reasons.forEach((reason) => {
        const li = document.createElement("li");
        li.textContent = reason;
        reasonsList.appendChild(li);
      });
      details.appendChild(reasonsList);
    }

    card.appendChild(details);

    return card;
  }

  // 캐릭터 사진(character.image)을 불러와 보여주고, 파일이 아직 없거나
  // 로드에 실패하면 자동으로 이모지로 대체한다.
  function setPhotoElement(imgEl, fallbackEl, character) {
    const url = typeof getCharacterImageUrl === "function" ? getCharacterImageUrl(character) : "";

    imgEl.hidden = true;

    if (!url) {
      fallbackEl.hidden = false;
      return;
    }

    imgEl.onload = () => {
      imgEl.hidden = false;
      fallbackEl.hidden = true;
    };
    imgEl.onerror = () => {
      imgEl.hidden = true;
      fallbackEl.hidden = false;
    };

    imgEl.src = url;
  }

  function restartTest() {
    isTransitioning = false;
    clearState();
    showScreen("main");
    pushHistoryState("main");
  }

  /* ----------------------------------------------------------------- */
  /* 8. 결과 공유 (요구사항 15) — 나중에 카카오톡 공유 등으로 교체하기 쉽게 분리 */
  /* ----------------------------------------------------------------- */
  function shareResult() {
    const character = characterSet.find((c) => c.id === state.finishedCharacterId);
    const shareTitle = activeTest.title;
    const shareText = character
      ? "나와 닮은 캐릭터는 " + character.name + "! (" + state.finishedSimilarity + "% 일치)"
      : activeTest.title;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator
        .share({ title: shareTitle, text: shareText, url: shareUrl })
        .catch(() => {
          /* 사용자가 공유를 취소한 경우 등은 조용히 무시 */
        });
      return;
    }

    copyLinkFallback(shareUrl);
  }

  function copyLinkFallback(url) {
    const showCopiedToast = () => showToast("결과 링크가 복사됐어요!");

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(showCopiedToast)
        .catch(() => showToast("링크 복사에 실패했어요. 주소창의 링크를 직접 복사해주세요."));
      return;
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showCopiedToast();
    } catch (err) {
      showToast("링크 복사에 실패했어요. 주소창의 링크를 직접 복사해주세요.");
    }
  }

  let toastTimer = null;
  function showToast(message) {
    el.shareToast.textContent = message;
    el.shareToast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      el.shareToast.classList.remove("is-visible");
    }, 2200);
  }

  /* ----------------------------------------------------------------- */
  /* 9. 새로고침 / 브라우저 뒤로가기 대응                                 */
  /* ----------------------------------------------------------------- */
  function pushHistoryState(screenName) {
    try {
      history.pushState({ appScreen: screenName }, "");
    } catch (err) {
      /* 일부 임베드 환경에서는 history API가 제한될 수 있어 조용히 무시 */
    }
  }

  window.addEventListener("popstate", (event) => {
    const target = event.state && event.state.appScreen;

    if (target === "quiz") {
      // 결과 화면에서 뒤로가기를 누른 경우 -> 마지막 문항으로 돌아가 답을 바꿀 수 있게 한다.
      state.finishedCharacterId = null;
      state.finishedSimilarity = null;
      state.finishedVector = null;
      saveState();
      showScreen("quiz");
      renderQuestion();
      return;
    }

    if (target === "result" && state.finishedCharacterId) {
      const character = characterSet.find((c) => c.id === state.finishedCharacterId);
      if (character) {
        renderResult(state.finishedVector, character, state.finishedSimilarity);
        showScreen("result");
        return;
      }
    }

    // 그 외의 경우(main 포함)에는 안전하게 처음 화면으로
    clearState();
    showScreen("main");
  });

  /* ----------------------------------------------------------------- */
  /* 10. 초기화                                                         */
  /* ----------------------------------------------------------------- */
  function init() {
    renderMain();

    el.startBtn.addEventListener("click", startTest);
    el.backBtn.addEventListener("click", goToPrevQuestion);
    el.shareBtn.addEventListener("click", shareResult);
    el.restartBtn.addEventListener("click", restartTest);

    // 새로고침 시 진행 중이던 상태 복원
    const saved = loadState();
    if (saved) {
      state = Object.assign(state, saved);

      // 이번 회차에 뽑혔던 질문 순서를 그대로 복원 (매번 랜덤이라 저장 필수)
      const restoredQuestions = resolveQuestionsFromIds(state.questionIds);
      if (restoredQuestions) {
        questions = restoredQuestions;
      }

      if (state.finishedCharacterId && questions.length) {
        const character = characterSet.find((c) => c.id === state.finishedCharacterId);
        if (character) {
          renderResult(state.finishedVector, character, state.finishedSimilarity);
          showScreen("result");
          pushHistoryState("result");
          return;
        }
      }

      if (questions.length && state.answerIndices && state.answerIndices.length > 0) {
        showScreen("quiz");
        renderQuestion();
        pushHistoryState("quiz");
        return;
      }
    }

    showScreen("main");
    pushHistoryState("main");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
