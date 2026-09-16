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
  const STORAGE_KEY = "character-test:progress:v1";

  const activeTest = TEST_DEFINITIONS[ACTIVE_TEST_ID];
  const questions = activeTest.questions;
  const characterSet = CHARACTER_SETS[activeTest.characterSetKey] || CHARACTER_SETS.default;

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

    resultEmoji: document.getElementById("result-emoji"),
    resultPhoto: document.getElementById("result-photo"),
    resultName: document.getElementById("result-name"),
    resultMatch: document.getElementById("result-match"),
    resultTagline: document.getElementById("result-tagline"),
    traitBars: document.getElementById("trait-bars"),
    resultDescription: document.getElementById("result-description"),
    resultTraits: document.getElementById("result-traits"),
    resultReasons: document.getElementById("result-reasons"),
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
  /* 2. 상태 관리                                                       */
  /* ----------------------------------------------------------------- */
  let state = {
    testId: ACTIVE_TEST_ID,
    currentIndex: 0,
    answerIndices: [], // 각 질문에서 선택한 답변의 index (뒤로가기 지원)
    finishedCharacterId: null
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
    state = { testId: ACTIVE_TEST_ID, currentIndex: 0, answerIndices: [], finishedCharacterId: null };
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
        // (이렇게 하지 않으면 뒤로가기를 눌러도 실제로는 같은 문항이 다시 그려지기만 하고
        // 이전 문항으로 돌아가지 않는 혼란스러운 동작이 생긴다.)
      } else {
        finishTest();
        isTransitioning = false;
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
  const AXES = ["energy", "action", "emotion", "lifestyle"];

  // 전체 질문의 누적 점수를 계산한다. (요구사항 7)
  function computeRawVector() {
    const totals = { energy: 0, action: 0, emotion: 0, lifestyle: 0 };
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
  // "질문당 평균 점수"로 정규화한다. (질문 하나의 점수 범위도 -2 ~ +2 이므로
  // 평균을 내면 캐릭터의 좌표 범위와 자연스럽게 맞아떨어진다.)
  function normalizeVector(rawVector, questionCount) {
    const normalized = {};
    AXES.forEach((axis) => {
      normalized[axis] = rawVector[axis] / questionCount;
    });
    return normalized;
  }

  // 요구사항 9: 4개 축의 차이를 계산해 가장 가까운 캐릭터를 찾는다.
  // 가중치(MATCHING_WEIGHTS)는 characters.js에서 손쉽게 조정할 수 있다.
  //
  // 캐릭터가 많아지면서(현재 45종) 성향이 비슷한 캐릭터들이 여러 개 생긴다.
  // "가장 가까운 1명"만 고정으로 뽑으면 비슷한 유형을 여러 개 넣어둔 의미가
  // 없어지므로, 최소 거리 기준 MATCH_POOL_TOLERANCE 이내의 캐릭터들을
  // "후보 풀"로 묶고 그 안에서 거리에 반비례하는 가중 랜덤으로 최종 결과를
  // 고른다. (화면에는 최종 선택된 1명만 보여주고, 후보 풀 자체는 화면에 노출하지 않는다.
  // similarCharacters는 이후 다른 기능에서 활용할 수 있도록 함께 반환만 해둔다.)
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
    const similar = pool
      .filter((entry) => entry.character.id !== picked.character.id)
      .slice(0, 2)
      .map((entry) => entry.character);

    return { character: picked.character, distance: picked.distance, similarCharacters: similar };
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

  // 요구사항 14: 임의의 숫자가 아니라 거리값을 기반으로 한 유사도(%) 계산.
  // 축 하나당 최대 차이는 4(-2~+2), 4개 축이므로 이론상 최대 거리는 16.
  // 최소 표시 유사도를 50%로 두어 "그럭저럭 닮았어요" 대신 긍정적인 톤을 유지한다.
  // (이 숫자들은 아래 두 상수만 바꾸면 쉽게 조정할 수 있다.)
  const MAX_POSSIBLE_DISTANCE = 16;
  const MIN_DISPLAYED_SIMILARITY = 50;

  function calcSimilarity(distance) {
    const raw = 100 - (distance / MAX_POSSIBLE_DISTANCE) * 100;
    const clamped = Math.max(MIN_DISPLAYED_SIMILARITY, Math.min(99, Math.round(raw)));
    return clamped;
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

    renderResult(character, similarity, userVector);
    showScreen("result");
    pushHistoryState("result");
  }

  /* ----------------------------------------------------------------- */
  /* 7. 결과 화면                                                       */
  /* ----------------------------------------------------------------- */
  const TRAIT_LABELS = {
    energy: "사람과 함께",
    action: "일단 행동",
    emotion: "감정·공감",
    lifestyle: "자유로운 편"
  };

  // -2~+2 값을 0~100% 막대 길이로 변환 (요구사항 7의 시각화)
  function axisValueToBarPercent(value) {
    const percent = ((value + 2) / 4) * 100;
    return Math.max(4, Math.min(100, percent));
  }

  function renderResult(character, similarity, userVector) {
    el.resultEmoji.textContent = character.emoji || "✨"; // 사진 로드 실패 시의 대체 표시용
    setResultPhoto(character);
    el.resultName.textContent = character.name;
    el.resultMatch.textContent = "당신과 " + similarity + "% 닮았어요!";
    el.resultTagline.textContent = "\u201C" + character.tagline + "\u201D";
    el.resultDescription.textContent = character.description;

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

      // 살짝 지연 후 채워서 막대가 자라나는 애니메이션 연출
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          fill.style.width = axisValueToBarPercent(userVector[axis]) + "%";
        }, 60);
      });
    });

    el.resultTraits.innerHTML = "";
    (character.traits || []).forEach((trait) => {
      const li = document.createElement("li");
      li.textContent = trait;
      el.resultTraits.appendChild(li);
    });

    el.resultReasons.innerHTML = "";
    (character.reasons || []).forEach((reason) => {
      const li = document.createElement("li");
      li.textContent = reason;
      el.resultReasons.appendChild(li);
    });

    applyEmojiSupport(screens.result);
  }

  // 캐릭터 사진(character.image)을 불러와 보여주고, 파일이 아직 없거나
  // 로드에 실패하면 자동으로 이모지로 대체한다. (요구사항: 별도 경로에 저장할
  // 사진을 불러와 쓰기 — getCharacterImageUrl()이 실제 경로를 만들어준다)
  function setResultPhoto(character) {
    if (!el.resultPhoto) return;

    const url = typeof getCharacterImageUrl === "function" ? getCharacterImageUrl(character) : "";

    // 새 캐릭터로 바뀔 때 이전 사진이 잠깐 남아 보이지 않도록 먼저 숨긴다.
    el.resultPhoto.hidden = true;

    if (!url) {
      el.resultEmoji.hidden = false;
      return;
    }

    el.resultPhoto.onload = () => {
      el.resultPhoto.hidden = false;
      el.resultEmoji.hidden = true;
    };
    el.resultPhoto.onerror = () => {
      // 사진 파일을 아직 넣지 않았거나 경로가 다르면 이모지로 자연스럽게 대체
      el.resultPhoto.hidden = true;
      el.resultEmoji.hidden = false;
    };

    el.resultPhoto.alt = character.name + " 캐릭터 이미지";
    el.resultPhoto.src = url;
  }

  // 매칭 후보 풀("비슷한 유형")은 여러 캐릭터 중 가중 랜덤으로 결과를 고르는 데는
  // 계속 쓰이지만(findClosestCharacter 참고), 화면에 별도 텍스트로 보여주지는 않는다.

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

    // 아주 오래된 브라우저를 위한 최후 수단
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
  /* 9. 새로고침 / 브라우저 뒤로가기 대응 (요구사항 14, 15)                */
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
      // (문항을 답하는 도중의 뒤로가기는 히스토리에 별도로 쌓지 않으므로 이 분기로 오지 않는다.)
      state.finishedCharacterId = null;
      state.finishedSimilarity = undefined;
      state.finishedVector = undefined;
      saveState();
      showScreen("quiz");
      renderQuestion();
      return;
    }

    if (target === "result" && state.finishedCharacterId) {
      const character = characterSet.find((c) => c.id === state.finishedCharacterId);
      if (character) {
        renderResult(character, state.finishedSimilarity, state.finishedVector);
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

    // 새로고침 시 진행 중이던 상태 복원 (요구사항 14)
    const saved = loadState();
    if (saved) {
      state = Object.assign(state, saved);

      if (state.finishedCharacterId) {
        const character = characterSet.find((c) => c.id === state.finishedCharacterId);
        if (character) {
          renderResult(character, state.finishedSimilarity, state.finishedVector);
          showScreen("result");
          pushHistoryState("result");
          return;
        }
      }

      if (state.answerIndices && state.answerIndices.length > 0) {
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
