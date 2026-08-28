import {
  auth, db,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, fbSignOut,
  onAuthStateChanged, updateProfile,
  doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp,
} from "./firebase-init.js";
import { EXERCISES, MUSCLE_LABELS, MUSCLE_RECOVERY_DAYS, getExercise } from "./exercises.js";

/* ---------------- 유틸 ---------------- */
const $ = (sel) => document.querySelector(sel);
const $all = (sel) => Array.from(document.querySelectorAll(sel));

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
function daysBetween(dateStr, refStr = todayStr()) {
  const a = new Date(dateStr + "T00:00:00");
  const b = new Date(refStr + "T00:00:00");
  return Math.round((b - a) / 86400000);
}
function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove("show"), 2200);
}
function lerpColor(hexA, hexB, t) {
  const a = hexA.match(/\w\w/g).map((x) => parseInt(x, 16));
  const b = hexB.match(/\w\w/g).map((x) => parseInt(x, 16));
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
}

/* ---------------- 상태 ---------------- */
const state = {
  user: null,
  profile: null,
  workouts: [],      // 최근 30일치
  bodyView: "front",
  activeTab: "dashboard",
  logSets: [],        // 모달에서 편집 중인 세트들
};

/* ================= 인증 ================= */
$("#showSignupBtn").addEventListener("click", () => toggleAuthMode(true));
$("#showLoginBtn").addEventListener("click", () => toggleAuthMode(false));

function toggleAuthMode(signup) {
  $("#authTitle").textContent = signup ? "계정 만들기" : "다시 오셨네요";
  $("#authSubtitle").textContent = signup
    ? "운동 기록을 시작해보세요."
    : "오늘의 루틴을 이어가볼까요.";
  $("#nicknameField").style.display = signup ? "block" : "none";
  $("#authSubmitBtn").textContent = signup ? "가입하기" : "로그인";
  $("#authSwitchLogin").style.display = signup ? "block" : "none";
  $("#showSignupBtn").style.display = signup ? "none" : "block";
  $("#authForm").dataset.mode = signup ? "signup" : "login";
  $("#authError").textContent = "";
}

$("#authForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const mode = $("#authForm").dataset.mode || "login";
  const email = $("#emailInput").value.trim();
  const password = $("#passwordInput").value;
  const nickname = $("#nicknameInput").value.trim();
  $("#authError").textContent = "";
  try {
    if (mode === "signup") {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (nickname) await updateProfile(cred.user, { displayName: nickname });
      await setDoc(doc(db, "users", cred.user.uid), {
        displayName: nickname || email.split("@")[0],
        weightKg: 70,
        heightCm: 170,
        createdAt: serverTimestamp(),
      });
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
  } catch (err) {
    $("#authError").textContent = mapAuthError(err.code);
  }
});

function mapAuthError(code) {
  const map = {
    "auth/email-already-in-use": "이미 가입된 이메일이에요.",
    "auth/invalid-email": "이메일 형식을 확인해주세요.",
    "auth/weak-password": "비밀번호는 6자 이상이어야 해요.",
    "auth/invalid-credential": "이메일 또는 비밀번호가 올바르지 않아요.",
    "auth/wrong-password": "이메일 또는 비밀번호가 올바르지 않아요.",
    "auth/user-not-found": "가입되지 않은 이메일이에요.",
  };
  return map[code] || "문제가 발생했어요. 잠시 후 다시 시도해주세요.";
}

$("#logoutBtn").addEventListener("click", () => fbSignOut(auth));

onAuthStateChanged(auth, async (user) => {
  state.user = user;
  if (user) {
    $("#authScreen").classList.remove("active");
    $("#mainScreen").classList.add("active");
    await bootstrapApp();
  } else {
    $("#mainScreen").classList.remove("active");
    $("#authScreen").classList.add("active");
  }
});

async function bootstrapApp() {
  await loadProfile();
  await loadRecentWorkouts();
  $("#greetingName").textContent = state.profile?.displayName || "회원";
  buildBodySvg();
  buildExerciseSelect();
  renderDashboard();
  renderHistory();
  renderSettings();
}

/* ================= 프로필 ================= */
async function loadProfile() {
  const ref = doc(db, "users", state.user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    state.profile = snap.data();
  } else {
    state.profile = { displayName: state.user.email.split("@")[0], weightKg: 70, heightCm: 170 };
    await setDoc(ref, state.profile);
  }
}

/* ================= 운동 기록 로드 ================= */
async function loadRecentWorkouts() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const q = query(
    collection(db, "users", state.user.uid, "workouts"),
    where("date", ">=", cutoffStr),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  state.workouts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ================= 바디맵 SVG ================= */
const FRONT_REGIONS = [
  { muscle: "shoulders", shape: `<ellipse cx="72" cy="88" rx="24" ry="17"/>` },
  { muscle: "shoulders", shape: `<ellipse cx="168" cy="88" rx="24" ry="17"/>` },
  { muscle: "chest",     shape: `<rect x="72" y="78" width="96" height="55" rx="18"/>` },
  { muscle: "arms",      shape: `<rect x="42" y="102" width="24" height="95" rx="12"/>` },
  { muscle: "arms",      shape: `<rect x="174" y="102" width="24" height="95" rx="12"/>` },
  { muscle: "abs",       shape: `<rect x="87" y="136" width="66" height="65" rx="14"/>` },
  { muscle: "legs",      shape: `<rect x="76" y="207" width="40" height="175" rx="18"/>` },
  { muscle: "legs",      shape: `<rect x="124" y="207" width="40" height="175" rx="18"/>` },
];
const BACK_REGIONS = [
  { muscle: "shoulders", shape: `<ellipse cx="72" cy="88" rx="24" ry="17"/>` },
  { muscle: "shoulders", shape: `<ellipse cx="168" cy="88" rx="24" ry="17"/>` },
  { muscle: "back",      shape: `<rect x="80" y="78" width="80" height="123" rx="18"/>` },
  { muscle: "arms",      shape: `<rect x="42" y="102" width="24" height="95" rx="12"/>` },
  { muscle: "arms",      shape: `<rect x="174" y="102" width="24" height="95" rx="12"/>` },
  { muscle: "legs",      shape: `<rect x="76" y="207" width="40" height="175" rx="18"/>` },
  { muscle: "legs",      shape: `<rect x="124" y="207" width="40" height="175" rx="18"/>` },
];

function regionsToSvg(regions) {
  return regions
    .map(
      (r) =>
        `<g class="muscle-region" data-muscle="${r.muscle}" tabindex="0" role="button" aria-label="${MUSCLE_LABELS[r.muscle]}">${r.shape}</g>`
    )
    .join("");
}

function buildBodySvg() {
  const svg = `
  <svg viewBox="0 0 240 400" xmlns="http://www.w3.org/2000/svg">
    <circle cx="120" cy="40" r="24" fill="var(--surface-2)"/>
    <rect x="110" y="60" width="20" height="20" fill="var(--surface-2)"/>
    <g id="regionsFront" style="display:${state.bodyView === "front" ? "block" : "none"}">
      ${regionsToSvg(FRONT_REGIONS)}
    </g>
    <g id="regionsBack" style="display:${state.bodyView === "back" ? "block" : "none"}">
      ${regionsToSvg(BACK_REGIONS)}
    </g>
  </svg>`;
  $("#bodySvgWrap").innerHTML = svg;
  attachRegionEvents();
  updateBodyMapColors();
}

function attachRegionEvents() {
  $all(".muscle-region").forEach((el) => {
    el.addEventListener("click", () => onMuscleTap(el.dataset.muscle));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") onMuscleTap(el.dataset.muscle);
    });
  });
}

function onMuscleTap(muscle) {
  const status = computeMuscleStatus();
  const s = status[muscle];
  const label = MUSCLE_LABELS[muscle];
  const msg = s
    ? `${label} · ${s.daysSince === 0 ? "오늘 운동함" : `${s.daysSince}일 전 운동`}`
    : `${label} · 최근 30일 내 기록 없음`;
  showToast(msg);
  openLogModal(muscle);
}

function computeMuscleStatus() {
  const status = {};
  for (const w of state.workouts) {
    const d = daysBetween(w.date);
    if (!status[w.muscle] || d < status[w.muscle].daysSince) {
      status[w.muscle] = { daysSince: d, lastDate: w.date };
    }
  }
  return status;
}

function colorForDays(muscle, daysSince) {
  const target = MUSCLE_RECOVERY_DAYS[muscle] ?? 2;
  const cap = Math.max(target, 1) + 1; // 완전 회복로 보는 기준
  if (daysSince == null) return "var(--surface-2)";
  const t = Math.min(daysSince / cap, 1);
  return lerpColor("#FF6B4A", "#4FD1C5", t);
}

function updateBodyMapColors() {
  const status = computeMuscleStatus();
  $all(".muscle-region").forEach((el) => {
    const muscle = el.dataset.muscle;
    const days = status[muscle]?.daysSince ?? null;
    const shape = el.querySelector("rect, ellipse, path");
    if (shape) shape.setAttribute("fill", colorForDays(muscle, days));
  });
}

$("#bodyViewFront").addEventListener("click", () => switchBodyView("front"));
$("#bodyViewBack").addEventListener("click", () => switchBodyView("back"));
function switchBodyView(view) {
  state.bodyView = view;
  $("#bodyViewFront").classList.toggle("active", view === "front");
  $("#bodyViewBack").classList.toggle("active", view === "back");
  $("#regionsFront").style.display = view === "front" ? "block" : "none";
  $("#regionsBack").style.display = view === "back" ? "block" : "none";
}

/* ================= 추천 알고리즘 ================= */
function getConsecutiveTrainingDays() {
  const trainedDates = new Set(state.workouts.map((w) => w.date));
  let streak = 0;
  let cursor = new Date();
  for (let i = 0; i < 14; i++) {
    const dStr = cursor.toISOString().slice(0, 10);
    if (trainedDates.has(dStr)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
}

function getRecommendation() {
  const status = computeMuscleStatus();
  const majorMuscles = ["chest", "back", "shoulders", "legs", "arms", "abs"];
  const streak = getConsecutiveTrainingDays();

  if (streak >= 5) {
    return {
      type: "rest",
      muscles: [],
      message: `${streak}일 연속 운동했어요. 오늘은 <strong>휴식</strong>하며 회복하는 게 좋아요.`,
    };
  }

  const ready = majorMuscles.filter((m) => {
    const d = status[m]?.daysSince;
    return d == null || d >= MUSCLE_RECOVERY_DAYS[m];
  });

  if (ready.length === 0) {
    return {
      type: "rest",
      muscles: [],
      message: "모든 부위가 아직 회복 중이에요. 가벼운 유산소나 <strong>휴식</strong>을 추천해요.",
    };
  }

  const sorted = ready.sort((a, b) => {
    const da = status[a]?.daysSince ?? 99;
    const db_ = status[b]?.daysSince ?? 99;
    return db_ - da;
  });
  const picks = sorted.slice(0, 2);
  const labels = picks.map((m) => MUSCLE_LABELS[m]).join(", ");
  return {
    type: "train",
    muscles: picks,
    message: `오늘은 <strong>${labels}</strong> 운동을 추천해요.`,
  };
}

/* ================= 대시보드 렌더 ================= */
function renderDashboard() {
  updateBodyMapColors();

  const reco = getRecommendation();
  $("#recoBadge").textContent = reco.type === "rest" ? "휴식 추천" : "운동 추천";
  $("#recoBadge").className = "reco-badge " + reco.type;
  $("#recoMsg").innerHTML = reco.message;

  const today = todayStr();
  const todayWorkouts = state.workouts.filter((w) => w.date === today);
  const totalCal = Math.round(todayWorkouts.reduce((s, w) => s + (w.calories || 0), 0));
  const totalSets = todayWorkouts.reduce((s, w) => s + (w.sets?.length || 0), 0);
  const weekDays = new Set(
    state.workouts.filter((w) => daysBetween(w.date) < 7).map((w) => w.date)
  ).size;

  $("#statCalories").textContent = totalCal;
  $("#statSets").textContent = totalSets;
  $("#statWeekDays").textContent = weekDays;

  const list = $("#todayLogList");
  if (todayWorkouts.length === 0) {
    list.innerHTML = `<div class="empty-msg">오늘 기록한 운동이 없어요.</div>`;
  } else {
    list.innerHTML = todayWorkouts
      .map((w) => {
        const setsTxt = w.sets.map((s) => `${s.weight}kg×${s.reps}`).join(" · ");
        return `<div class="log-item">
          <div><span class="ex-name">${w.exerciseName}</span><span class="ex-muscle">${MUSCLE_LABELS[w.muscle]}</span></div>
          <div class="ex-detail">${setsTxt}</div>
        </div>`;
      })
      .join("");
  }

  renderAiCard();
}

/* ================= 운동 기록 모달 ================= */
function buildExerciseSelect() {
  const sel = $("#exerciseSelect");
  const groups = {};
  EXERCISES.forEach((ex) => {
    groups[ex.muscle] = groups[ex.muscle] || [];
    groups[ex.muscle].push(ex);
  });
  sel.innerHTML = Object.entries(groups)
    .map(
      ([muscle, list]) =>
        `<optgroup label="${MUSCLE_LABELS[muscle]}">` +
        list.map((ex) => `<option value="${ex.id}">${ex.name}</option>`).join("") +
        `</optgroup>`
    )
    .join("");
}

function openLogModal(preselectMuscle) {
  $("#logDate").value = todayStr();
  if (preselectMuscle) {
    const first = EXERCISES.find((e) => e.muscle === preselectMuscle);
    if (first) $("#exerciseSelect").value = first.id;
  }
  state.logSets = [{ weight: "", reps: "" }];
  renderSetRows();
  onExerciseSelectChange();
  $("#logModal").classList.add("open");
}
function closeLogModal() {
  $("#logModal").classList.remove("open");
}
$("#openLogBtn").addEventListener("click", () => openLogModal());
$("#closeLogModal").addEventListener("click", closeLogModal);

$("#exerciseSelect").addEventListener("change", onExerciseSelectChange);
function onExerciseSelectChange() {
  const ex = getExercise($("#exerciseSelect").value);
  if (!ex) return;
  $("#exerciseMuscleTag").textContent = MUSCLE_LABELS[ex.muscle];
  $("#exerciseHowto").textContent = ex.howto;
  updateCalcPreview();
}

function renderSetRows() {
  const wrap = $("#setRows");
  wrap.innerHTML = state.logSets
    .map(
      (s, i) => `
      <div class="set-row" data-idx="${i}">
        <span class="set-idx">${i + 1}</span>
        <input type="number" inputmode="decimal" placeholder="무게(kg)" value="${s.weight}" data-field="weight" />
        <input type="number" inputmode="numeric" placeholder="횟수" value="${s.reps}" data-field="reps" />
        <button type="button" class="remove-set" aria-label="세트 삭제">×</button>
      </div>`
    )
    .join("");

  wrap.querySelectorAll(".set-row").forEach((row) => {
    const idx = Number(row.dataset.idx);
    row.querySelectorAll("input").forEach((inp) => {
      inp.addEventListener("input", () => {
        state.logSets[idx][inp.dataset.field] = inp.value;
        updateCalcPreview();
      });
    });
    row.querySelector(".remove-set").addEventListener("click", () => {
      state.logSets.splice(idx, 1);
      if (state.logSets.length === 0) state.logSets.push({ weight: "", reps: "" });
      renderSetRows();
      updateCalcPreview();
    });
  });
}

$("#addSetBtn").addEventListener("click", () => {
  state.logSets.push({ weight: "", reps: "" });
  renderSetRows();
});

function updateCalcPreview() {
  const ex = getExercise($("#exerciseSelect").value);
  if (!ex) return;
  const validSets = state.logSets.filter((s) => s.weight !== "" && s.reps !== "");
  const cal = calcCalories(ex, validSets);
  $("#calcPreviewSets").textContent = validSets.length;
  $("#calcPreviewCal").textContent = cal;
}

function calcCalories(ex, sets) {
  const bodyWeight = state.profile?.weightKg || 70;
  const minutesPerSet = 2; // 수행 + 휴식 평균 추정치
  const hours = (sets.length * minutesPerSet) / 60;
  return Math.round(ex.met * bodyWeight * hours);
}

$("#logForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const ex = getExercise($("#exerciseSelect").value);
  const validSets = state.logSets
    .filter((s) => s.weight !== "" && s.reps !== "")
    .map((s) => ({ weight: Number(s.weight), reps: Number(s.reps) }));

  if (validSets.length === 0) {
    showToast("최소 한 세트는 입력해주세요.");
    return;
  }

  const payload = {
    date: $("#logDate").value || todayStr(),
    exerciseId: ex.id,
    exerciseName: ex.name,
    muscle: ex.muscle,
    sets: validSets,
    calories: calcCalories(ex, validSets),
    note: $("#logNote").value.trim(),
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "users", state.user.uid, "workouts"), payload);
  showToast("운동을 기록했어요.");
  closeLogModal();
  $("#logNote").value = "";
  await loadRecentWorkouts();
  renderDashboard();
  renderHistory();
});

/* ================= 히스토리 ================= */
function renderHistory() {
  // 5주 히트맵
  const cells = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 34);
  const countByDate = {};
  state.workouts.forEach((w) => {
    countByDate[w.date] = (countByDate[w.date] || 0) + (w.sets?.length || 0);
  });
  for (let i = 0; i < 35; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dStr = d.toISOString().slice(0, 10);
    const c = countByDate[dStr] || 0;
    const lv = c === 0 ? 0 : c <= 3 ? 1 : c <= 6 ? 2 : 3;
    cells.push(`<div class="heat-cell lv${lv}" title="${dStr} · 세트 ${c}"></div>`);
  }
  $("#heatmapGrid").innerHTML = cells.join("");

  // 날짜별 리스트
  const byDate = {};
  state.workouts.forEach((w) => {
    byDate[w.date] = byDate[w.date] || [];
    byDate[w.date].push(w);
  });
  const dates = Object.keys(byDate).sort((a, b) => (a < b ? 1 : -1));
  const list = $("#historyList");
  if (dates.length === 0) {
    list.innerHTML = `<div class="empty-msg">아직 기록이 없어요. 첫 운동을 기록해보세요!</div>`;
    return;
  }
  list.innerHTML = dates
    .map((dStr) => {
      const items = byDate[dStr]
        .map((w) => {
          const setsTxt = w.sets.map((s) => `${s.weight}kg×${s.reps}`).join(" · ");
          return `<div class="log-item">
            <div><span class="ex-name">${w.exerciseName}</span><span class="ex-muscle">${MUSCLE_LABELS[w.muscle]}</span></div>
            <div class="ex-detail">${setsTxt}</div>
          </div>`;
        })
        .join("");
      return `<div class="history-day"><div class="date-label">${dStr}</div>${items}</div>`;
    })
    .join("");
}

/* ================= 설정 ================= */
function renderSettings() {
  $("#settingNickname").value = state.profile?.displayName || "";
  $("#settingWeight").value = state.profile?.weightKg || "";
  $("#settingHeight").value = state.profile?.heightCm || "";
  const reminder = JSON.parse(localStorage.getItem("fitlog_reminder") || "{}");
  $("#reminderSwitch").classList.toggle("on", !!reminder.enabled);
  $("#reminderTime").value = reminder.time || "19:00";
  $("#reminderTime").disabled = !reminder.enabled;
}

$("#settingsForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const updated = {
    displayName: $("#settingNickname").value.trim() || state.profile.displayName,
    weightKg: Number($("#settingWeight").value) || state.profile.weightKg,
    heightCm: Number($("#settingHeight").value) || state.profile.heightCm,
  };
  await setDoc(doc(db, "users", state.user.uid), updated, { merge: true });
  state.profile = { ...state.profile, ...updated };
  showToast("프로필을 저장했어요.");
});

$("#reminderSwitch").addEventListener("click", () => {
  const on = !$("#reminderSwitch").classList.contains("on");
  $("#reminderSwitch").classList.toggle("on", on);
  $("#reminderTime").disabled = !on;
  const time = $("#reminderTime").value || "19:00";
  localStorage.setItem("fitlog_reminder", JSON.stringify({ enabled: on, time }));
  if (on && "Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
});
$("#reminderTime").addEventListener("change", () => {
  const reminder = JSON.parse(localStorage.getItem("fitlog_reminder") || "{}");
  reminder.time = $("#reminderTime").value;
  localStorage.setItem("fitlog_reminder", JSON.stringify(reminder));
});

// 탭이 열려있는 동안 1분마다 알림 시간 확인 (브라우저 탭이 꺼져있으면 동작하지 않음)
setInterval(() => {
  const reminder = JSON.parse(localStorage.getItem("fitlog_reminder") || "{}");
  if (!reminder.enabled || !("Notification" in window) || Notification.permission !== "granted") return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const nowKey = `${todayStr()}_${hh}:${mm}`;
  if (`${hh}:${mm}` === reminder.time && localStorage.getItem("fitlog_last_notify") !== nowKey) {
    new Notification("오늘 운동할 시간이에요 💪", { body: "루틴을 확인하고 기록해보세요." });
    localStorage.setItem("fitlog_last_notify", nowKey);
  }
}, 30000);

/* ================= AI 코치 ================= */
function renderAiCard() {
  const cacheKey = `fitlog_ai_${state.user.uid}_${todayStr()}`;
  const cached = localStorage.getItem(cacheKey);
  const box = $("#aiResult");
  if (cached) {
    box.innerHTML = `<div class="ai-text">${cached}</div>`;
    $("#askAiBtn").textContent = "다시 분석하기";
  } else {
    box.innerHTML = `<div class="ai-empty">최근 운동 기록을 바탕으로 AI 코치의 분석을 받아보세요.</div>`;
    $("#askAiBtn").textContent = "AI 코치에게 물어보기";
  }
}

$("#askAiBtn").addEventListener("click", async () => {
  const box = $("#aiResult");
  box.innerHTML = `<div class="ai-loading">분석 중...</div>`;
  $("#askAiBtn").disabled = true;
  try {
    const reco = getRecommendation();
    const recent = state.workouts
      .filter((w) => daysBetween(w.date) < 7)
      .map((w) => ({
        date: w.date,
        exercise: w.exerciseName,
        muscle: MUSCLE_LABELS[w.muscle],
        sets: w.sets,
        calories: w.calories,
      }));

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: { weightKg: state.profile.weightKg, heightCm: state.profile.heightCm },
        recentWorkouts: recent,
        ruleBasedRecommendation: reco.message.replace(/<\/?strong>/g, ""),
      }),
    });
    if (!res.ok) throw new Error("API 오류");
    const data = await res.json();
    const text = data.text || "분석 결과를 가져오지 못했어요.";
    box.innerHTML = `<div class="ai-text">${text}</div>`;
    localStorage.setItem(`fitlog_ai_${state.user.uid}_${todayStr()}`, text);
    $("#askAiBtn").textContent = "다시 분석하기";
  } catch (err) {
    box.innerHTML = `<div class="ai-empty">AI 분석을 가져오지 못했어요. /api/gemini 설정을 확인해주세요.</div>`;
  } finally {
    $("#askAiBtn").disabled = false;
  }
});

/* ================= 탭 전환 ================= */
$all(".tabbar button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    state.activeTab = tab;
    $all(".tabbar button").forEach((b) => b.classList.toggle("active", b === btn));
    $all(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${tab}`));
  });
});
