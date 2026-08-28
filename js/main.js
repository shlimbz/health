import {
  auth, db,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, fbSignOut,
  onAuthStateChanged, updateProfile,
  doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp,
} from "./firebase-init.js";
import { EXERCISES, MUSCLE_LABELS, MUSCLE_RECOVERY_DAYS, GOAL_LABELS, getExercise, metForCardio } from "./exercises.js";

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
function pad2(n) { return String(n).padStart(2, "0"); }
function ymd(y, m, d) { return `${y}-${pad2(m + 1)}-${pad2(d)}`; }

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
function computeBmi(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const h = heightCm / 100;
  return +(weightKg / (h * h)).toFixed(1);
}
const DAY_LABELS = { mon: "월", tue: "화", wed: "수", thu: "목", fri: "금", sat: "토", sun: "일" };
const EQUIP_LABELS = { gym: "헬스장", bodyweight: "맨몸/홈트", both: "헬스장 + 맨몸" };
const REST_SECONDS = { chest: 90, back: 90, shoulders: 75, legs: 90, arms: 45, abs: 45 };

/* ---------------- 상태 ---------------- */
const state = {
  user: null,
  profile: null,
  workouts: [],          // 최근 30일치 (홈/추천용)
  bodyView: "front",
  activeTab: "dashboard",
  logSets: [],
  quest: { status: "loading", items: [] },
  cal: { year: 0, month: 0, selectedDate: todayStr(), monthWorkouts: [] },
  timer: { seconds: 0, total: 0, handle: null, muted: false },
  ob: { step: 1, total: 8, answers: {} },
};

/* ================= 테마 ================= */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  $("#themeSwitch")?.classList.toggle("on", theme === "dark");
  localStorage.setItem("fitlog_theme", theme);
}
(function initTheme() {
  const saved = localStorage.getItem("fitlog_theme") || "light";
  applyTheme(saved);
})();
document.addEventListener("click", (e) => {
  if (e.target.id === "themeSwitch") {
    const cur = document.documentElement.getAttribute("data-theme");
    applyTheme(cur === "dark" ? "light" : "dark");
  }
});

/* ================= 인증 ================= */
$("#showSignupBtn").addEventListener("click", () => toggleAuthMode(true));
$("#showLoginBtn").addEventListener("click", () => toggleAuthMode(false));

function toggleAuthMode(signup) {
  $("#authTitle").textContent = signup ? "계정 만들기" : "다시 오셨네요";
  $("#authSubtitle").textContent = signup ? "운동 기록을 시작해보세요." : "오늘의 루틴을 이어가볼까요.";
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
        onboarded: false,
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
  $all(".screen").forEach((s) => s.classList.remove("active"));
  if (user) {
    await loadProfile();
    if (!state.profile?.onboarded) {
      startOnboarding();
    } else {
      $("#mainScreen").classList.add("active");
      await bootstrapApp();
    }
  } else {
    $("#authScreen").classList.add("active");
  }
});

/* ================= 프로필 ================= */
async function loadProfile() {
  const ref = doc(db, "users", state.user.uid);
  const snap = await getDoc(ref);
  state.profile = snap.exists() ? snap.data() : { displayName: state.user.email.split("@")[0], onboarded: false };
}

async function bootstrapApp() {
  $("#greetingName").textContent = state.profile?.displayName || "회원";
  await loadRecentWorkouts();
  buildBodySvg();
  buildExerciseSelect();
  renderDashboard();
  renderSettingsProfile();
  state.quest.loaded = false;
  state.cal.loadedMonth = null;
}

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

/* ================= 온보딩 ================= */
function startOnboarding() {
  state.ob = { step: 1, total: 8, answers: { availableDays: [], targetMuscles: [], avoidMuscles: [] } };
  $all(".chip").forEach((c) => c.classList.remove("selected"));
  $("#onboardingScreen").classList.add("active");
  renderObStep();
}

$all(".ob-step .chip-group").forEach((group) => {
  group.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const field = group.dataset.field;
    const multi = group.dataset.multi === "true";
    if (multi) {
      const arr = state.ob.answers[field] || [];
      const v = chip.dataset.value;
      const idx = arr.indexOf(v);
      if (idx >= 0) { arr.splice(idx, 1); chip.classList.remove("selected"); }
      else { arr.push(v); chip.classList.add("selected"); }
      state.ob.answers[field] = arr;
    } else {
      state.ob.answers[field] = chip.dataset.value;
      group.querySelectorAll(".chip").forEach((c) => c.classList.toggle("selected", c === chip));
    }
  });
});

$("#obWeight").addEventListener("input", updateBmiPreview);
$("#obHeight").addEventListener("input", updateBmiPreview);
function updateBmiPreview() {
  const w = Number($("#obWeight").value);
  const h = Number($("#obHeight").value);
  const bmi = computeBmi(w, h);
  $("#obBmiPreview").textContent = bmi ? `참고용 BMI: ${bmi}` : "";
}

function renderObStep() {
  $all(".ob-step").forEach((s) => s.classList.toggle("active", Number(s.dataset.step) === state.ob.step));
  $("#obProgressBar").style.width = `${(state.ob.step / state.ob.total) * 100}%`;
  $("#obStepCount").textContent = `${state.ob.step}/${state.ob.total}`;
  $("#obBackBtn").style.visibility = state.ob.step === 1 ? "hidden" : "visible";
  $("#obNextBtn").textContent = state.ob.step === state.ob.total ? "완료" : "다음";
}

function obStepValid() {
  const step = state.ob.step;
  const a = state.ob.answers;
  if (step === 1) return !!a.gender;
  if (step === 2) return !!a.ageRange;
  if (step === 3) return Number($("#obWeight").value) > 0 && Number($("#obHeight").value) > 0;
  if (step === 4) return !!a.goal;
  if (step === 5) return (a.availableDays || []).length > 0;
  if (step === 6) return !!a.preferredTime;
  if (step === 7) return !!a.equipment;
  return true; // step 8은 선택사항
}

$("#obBackBtn").addEventListener("click", () => {
  if (state.ob.step > 1) { state.ob.step--; renderObStep(); }
});
$("#obNextBtn").addEventListener("click", async () => {
  if (!obStepValid()) { showToast("항목을 선택해주세요."); return; }
  if (state.ob.step < state.ob.total) {
    state.ob.step++;
    renderObStep();
  } else {
    await finishOnboarding();
  }
});

async function finishOnboarding() {
  const a = state.ob.answers;
  const profileUpdate = {
    gender: a.gender,
    ageRange: a.ageRange,
    weightKg: Number($("#obWeight").value),
    heightCm: Number($("#obHeight").value),
    goal: a.goal,
    availableDays: a.availableDays || [],
    preferredTime: a.preferredTime,
    equipment: a.equipment,
    targetMuscles: a.targetMuscles || [],
    avoidMuscles: a.avoidMuscles || [],
    onboarded: true,
  };
  await setDoc(doc(db, "users", state.user.uid), profileUpdate, { merge: true });
  state.profile = { ...state.profile, ...profileUpdate };
  $("#onboardingScreen").classList.remove("active");
  $("#mainScreen").classList.add("active");
  await bootstrapApp();
  showToast("프로필 설정 완료! 오늘의 운동을 시작해보세요.");
}

$("#editProfileBtn").addEventListener("click", () => {
  const p = state.profile;
  state.ob = {
    step: 1, total: 8,
    answers: {
      gender: p.gender, ageRange: p.ageRange, goal: p.goal,
      availableDays: [...(p.availableDays || [])], preferredTime: p.preferredTime,
      equipment: p.equipment, targetMuscles: [...(p.targetMuscles || [])], avoidMuscles: [...(p.avoidMuscles || [])],
    },
  };
  $("#obWeight").value = p.weightKg || "";
  $("#obHeight").value = p.heightCm || "";
  updateBmiPreview();
  $all(".chip-group").forEach((group) => {
    const field = group.dataset.field;
    const multi = group.dataset.multi === "true";
    group.querySelectorAll(".chip").forEach((chip) => {
      const on = multi ? (state.ob.answers[field] || []).includes(chip.dataset.value) : state.ob.answers[field] === chip.dataset.value;
      chip.classList.toggle("selected", on);
    });
  });
  $("#mainScreen").classList.remove("active");
  $("#onboardingScreen").classList.add("active");
  renderObStep();
});

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
  return regions.map((r) =>
    `<g class="muscle-region" data-muscle="${r.muscle}" tabindex="0" role="button" aria-label="${MUSCLE_LABELS[r.muscle]}">${r.shape}</g>`
  ).join("");
}
function buildBodySvg() {
  const svg = `
  <svg viewBox="0 0 240 400" xmlns="http://www.w3.org/2000/svg">
    <circle cx="120" cy="40" r="24" fill="var(--surface-2)"/>
    <rect x="110" y="60" width="20" height="20" fill="var(--surface-2)"/>
    <g id="regionsFront" style="display:${state.bodyView === "front" ? "block" : "none"}">${regionsToSvg(FRONT_REGIONS)}</g>
    <g id="regionsBack" style="display:${state.bodyView === "back" ? "block" : "none"}">${regionsToSvg(BACK_REGIONS)}</g>
  </svg>`;
  $("#bodySvgWrap").innerHTML = svg;
  $all(".muscle-region").forEach((el) => {
    el.addEventListener("click", () => onMuscleTap(el.dataset.muscle));
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") onMuscleTap(el.dataset.muscle); });
  });
  updateBodyMapColors();
}
function onMuscleTap(muscle) {
  const status = computeMuscleStatus();
  const s = status[muscle];
  const label = MUSCLE_LABELS[muscle];
  const msg = s ? `${label} · ${s.daysSince === 0 ? "오늘 운동함" : `${s.daysSince}일 전 운동`}` : `${label} · 최근 30일 내 기록 없음`;
  showToast(msg);
}
function computeMuscleStatus() {
  const status = {};
  for (const w of state.workouts) {
    const d = daysBetween(w.date);
    if (!status[w.muscle] || d < status[w.muscle].daysSince) status[w.muscle] = { daysSince: d, lastDate: w.date };
  }
  return status;
}
function colorForDays(muscle, daysSince) {
  const target = MUSCLE_RECOVERY_DAYS[muscle] ?? 2;
  const cap = Math.max(target, 1) + 1;
  if (daysSince == null) return "var(--surface-2)";
  const t = Math.min(daysSince / cap, 1);
  return lerpColor("#FF6B4A", "#2FAE9E", t);
}
function updateBodyMapColors() {
  const status = computeMuscleStatus();
  $all(".muscle-region").forEach((el) => {
    const days = status[el.dataset.muscle]?.daysSince ?? null;
    const shape = el.querySelector("rect, ellipse, path");
    if (shape) shape.setAttribute("fill", colorForDays(el.dataset.muscle, days));
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
  const cursor = new Date();
  for (let i = 0; i < 14; i++) {
    const dStr = cursor.toISOString().slice(0, 10);
    if (trainedDates.has(dStr)) { streak++; cursor.setDate(cursor.getDate() - 1); } else break;
  }
  return streak;
}
function getRecommendation() {
  const status = computeMuscleStatus();
  const avoid = new Set(state.profile?.avoidMuscles || []);
  const targets = new Set(state.profile?.targetMuscles || []);
  const majorMuscles = ["chest", "back", "shoulders", "legs", "arms", "abs"].filter((m) => !avoid.has(m));
  const streak = getConsecutiveTrainingDays();

  if (streak >= 5) {
    return { type: "rest", muscles: [], message: `${streak}일 연속 운동했어요. 오늘은 <strong>휴식</strong>하며 회복하는 게 좋아요.` };
  }
  const ready = majorMuscles.filter((m) => {
    const d = status[m]?.daysSince;
    return d == null || d >= MUSCLE_RECOVERY_DAYS[m];
  });
  if (ready.length === 0) {
    return { type: "rest", muscles: [], message: "모든 부위가 아직 회복 중이에요. 가벼운 유산소나 <strong>휴식</strong>을 추천해요." };
  }
  const sorted = ready.sort((a, b) => {
    const da = (status[a]?.daysSince ?? 99) + (targets.has(a) ? 100 : 0);
    const db_ = (status[b]?.daysSince ?? 99) + (targets.has(b) ? 100 : 0);
    return db_ - da;
  });
  const picks = sorted.slice(0, 2);
  const labels = picks.map((m) => MUSCLE_LABELS[m]).join(", ");
  return { type: "train", muscles: picks, message: `오늘은 <strong>${labels}</strong> 운동을 추천해요.` };
}

/* ================= 홈 대시보드 (무스크롤) ================= */
function renderDashboard() {
  updateBodyMapColors();
  const reco = getRecommendation();
  $("#recoBanner").classList.toggle("rest", reco.type === "rest");
  $("#recoEyebrow").textContent = reco.type === "rest" ? "휴식 추천" : "오늘의 추천";
  $("#recoMsg").innerHTML = reco.message;
  $("#recoCtaBtn").textContent = reco.type === "rest" ? "운동 탭 보기" : "운동 시작하기";

  const today = todayStr();
  const todayWorkouts = state.workouts.filter((w) => w.date === today);
  const totalCal = Math.round(todayWorkouts.reduce((s, w) => s + (w.calories || 0), 0));
  const totalSets = todayWorkouts.reduce((s, w) => s + (w.sets?.length || 0), 0);
  const weekDays = new Set(state.workouts.filter((w) => daysBetween(w.date) < 7).map((w) => w.date)).size;

  $("#statCalories").textContent = totalCal;
  $("#statSets").textContent = totalSets;
  $("#statWeekDays").textContent = weekDays;
  $("#statStreak").textContent = getConsecutiveTrainingDays();
}
$("#recoCtaBtn").addEventListener("click", () => switchTab("workout"));

/* ================= 운동 기록 모달 (수동) ================= */
function buildExerciseSelect() {
  const sel = $("#exerciseSelect");
  const groups = {};
  EXERCISES.forEach((ex) => { (groups[ex.muscle] ||= []).push(ex); });
  sel.innerHTML = Object.entries(groups).map(([muscle, list]) =>
    `<optgroup label="${MUSCLE_LABELS[muscle]}">${list.map((ex) => `<option value="${ex.id}">${ex.name}</option>`).join("")}</optgroup>`
  ).join("");
}
function openLogModal(preselectExerciseId) {
  $("#logDate").value = state.cal.selectedDate || todayStr();
  if (preselectExerciseId) $("#exerciseSelect").value = preselectExerciseId;
  state.logSets = [{ weight: "", reps: "" }];
  renderSetRows();
  onExerciseSelectChange();
  $("#logModal").classList.add("open");
}
function closeLogModal() { $("#logModal").classList.remove("open"); }
$("#openLogBtn").addEventListener("click", () => openLogModal());
$("#closeLogModal").addEventListener("click", closeLogModal);

$("#exerciseSelect").addEventListener("change", onExerciseSelectChange);
function onExerciseSelectChange() {
  const ex = getExercise($("#exerciseSelect").value);
  if (!ex) return;
  $("#exerciseMuscleTag").textContent = MUSCLE_LABELS[ex.muscle];
  $("#exerciseHowto").textContent = ex.howto;
  $("#strengthFields").style.display = ex.logType === "cardio" ? "none" : "block";
  $("#cardioFields").style.display = ex.logType === "cardio" ? "block" : "none";
  updateCalcPreview();
}
function renderSetRows() {
  const wrap = $("#setRows");
  wrap.innerHTML = state.logSets.map((s, i) => `
      <div class="set-row" data-idx="${i}">
        <span class="set-idx">${i + 1}</span>
        <input type="number" inputmode="decimal" placeholder="무게(kg)" value="${s.weight}" data-field="weight" />
        <input type="number" inputmode="numeric" placeholder="횟수" value="${s.reps}" data-field="reps" />
        <button type="button" class="remove-set" aria-label="세트 삭제">×</button>
      </div>`).join("");
  wrap.querySelectorAll(".set-row").forEach((row) => {
    const idx = Number(row.dataset.idx);
    row.querySelectorAll("input").forEach((inp) => {
      inp.addEventListener("input", () => { state.logSets[idx][inp.dataset.field] = inp.value; updateCalcPreview(); });
    });
    row.querySelector(".remove-set").addEventListener("click", () => {
      state.logSets.splice(idx, 1);
      if (state.logSets.length === 0) state.logSets.push({ weight: "", reps: "" });
      renderSetRows(); updateCalcPreview();
    });
  });
}
$("#addSetBtn").addEventListener("click", () => { state.logSets.push({ weight: "", reps: "" }); renderSetRows(); });
$("#cardioDuration").addEventListener("input", updateCalcPreview);
$("#cardioSpeed").addEventListener("input", updateCalcPreview);

function updateCalcPreview() {
  const ex = getExercise($("#exerciseSelect").value);
  if (!ex) return;
  let cal = 0;
  if (ex.logType === "cardio") {
    const dur = Number($("#cardioDuration").value) || 0;
    const speed = Number($("#cardioSpeed").value) || 0;
    cal = calcCardioCalories(ex, dur, speed);
  } else {
    const validSets = state.logSets.filter((s) => s.weight !== "" && s.reps !== "");
    cal = calcStrengthCalories(ex, validSets);
  }
  $("#calcPreviewCal").textContent = cal;
}
function calcStrengthCalories(ex, sets) {
  const bodyWeight = state.profile?.weightKg || 70;
  const minutesPerSet = 2;
  const hours = (sets.length * minutesPerSet) / 60;
  return Math.round(ex.met * bodyWeight * hours);
}
function calcCardioCalories(ex, durationMin, speedKmh) {
  const bodyWeight = state.profile?.weightKg || 70;
  const met = metForCardio(ex, speedKmh);
  return Math.round(met * bodyWeight * (durationMin / 60));
}

$("#logForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const ex = getExercise($("#exerciseSelect").value);
  const date = $("#logDate").value || todayStr();
  let payload;
  if (ex.logType === "cardio") {
    const durationMin = Number($("#cardioDuration").value) || 0;
    const speedKmh = Number($("#cardioSpeed").value) || 0;
    if (durationMin <= 0) { showToast("운동 시간을 입력해주세요."); return; }
    payload = {
      type: "cardio", date, exerciseId: ex.id, exerciseName: ex.name, muscle: ex.muscle,
      durationMin, speedKmh: speedKmh || null,
      calories: calcCardioCalories(ex, durationMin, speedKmh),
      note: $("#logNote").value.trim(), createdAt: serverTimestamp(),
    };
  } else {
    const validSets = state.logSets.filter((s) => s.weight !== "" && s.reps !== "").map((s) => ({ weight: Number(s.weight), reps: Number(s.reps) }));
    if (validSets.length === 0) { showToast("최소 한 세트는 입력해주세요."); return; }
    payload = {
      type: "strength", date, exerciseId: ex.id, exerciseName: ex.name, muscle: ex.muscle,
      sets: validSets, calories: calcStrengthCalories(ex, validSets),
      note: $("#logNote").value.trim(), createdAt: serverTimestamp(),
    };
  }
  await addDoc(collection(db, "users", state.user.uid, "workouts"), payload);
  showToast("운동을 기록했어요.");
  closeLogModal();
  $("#logNote").value = "";
  await loadRecentWorkouts();
  renderDashboard();
  if (state.activeTab === "history") await loadCalendarMonth(state.cal.year, state.cal.month, true);
});

/* ================= 운동 퀘스트 탭 ================= */
async function ensureQuestLoaded() {
  if (state.quest.loaded) return;
  const ref = doc(db, "users", state.user.uid, "dailyQuests", todayStr());
  const snap = await getDoc(ref);
  state.quest = snap.exists() ? { ...snap.data(), loaded: true } : { status: "setup", items: [], loaded: true };
  renderQuestView();
}
async function saveQuest() {
  const ref = doc(db, "users", state.user.uid, "dailyQuests", todayStr());
  await setDoc(ref, { status: state.quest.status, items: state.quest.items, updatedAt: serverTimestamp() });
}

function buildAutoQuestItems() {
  const reco = getRecommendation();
  const equip = state.profile?.equipment || "both";
  const muscles = reco.muscles.length ? reco.muscles : ["abs", "cardio"];
  const pool = EXERCISES.filter((ex) =>
    muscles.includes(ex.muscle) && (equip === "both" || ex.equipment === "both" || ex.equipment === equip)
  );
  const picked = [];
  muscles.forEach((m) => {
    const candidates = pool.filter((ex) => ex.muscle === m && !picked.find((p) => p.exerciseId === ex.id));
    if (candidates[0]) picked.push(exToQuestItem(candidates[0]));
  });
  while (picked.length < 3 && pool.length > picked.length) {
    const next = pool.find((ex) => !picked.find((p) => p.exerciseId === ex.id));
    if (!next) break;
    picked.push(exToQuestItem(next));
  }
  return picked;
}
function exToQuestItem(ex) {
  return {
    exerciseId: ex.id, exerciseName: ex.name, muscle: ex.muscle, logType: ex.logType,
    targetSets: ex.logType === "cardio" ? 1 : 3,
    targetReps: ex.logType === "cardio" ? null : 10,
    completed: [],
  };
}

function renderQuestView() {
  $("#questDateLabel").textContent = new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
  const body = $("#questBody");
  const ring = $("#questProgress");

  if (state.quest.status === "setup" || !state.quest.items?.length) {
    ring.style.display = "none";
    const selectOptions = EXERCISES.filter((ex) => {
      const equip = state.profile?.equipment || "both";
      return equip === "both" || ex.equipment === "both" || ex.equipment === equip;
    }).map((ex) => `<option value="${ex.id}">${MUSCLE_LABELS[ex.muscle]} · ${ex.name}</option>`).join("");

    body.innerHTML = `
      <div class="quest-empty">오늘의 운동을 아직 정하지 않았어요.</div>
      <button type="button" class="btn-fab" id="autoGenQuestBtn">추천 부위로 자동 구성</button>
      <div class="quest-setup-list" id="questSetupList"></div>
      <div class="field" style="margin-top:10px">
        <select id="questAddSelect">${selectOptions}</select>
      </div>
      <button type="button" class="btn-outline" id="questAddBtn" style="margin-top:8px">+ 직접 종목 추가</button>
      <button type="button" class="btn-fab" id="startQuestBtn" style="margin-top:14px">오늘의 운동 시작하기</button>
    `;
    renderQuestSetupList();
    $("#autoGenQuestBtn").addEventListener("click", () => {
      state.quest.items = buildAutoQuestItems();
      state.quest.status = "setup";
      renderQuestSetupList();
    });
    $("#questAddBtn").addEventListener("click", () => {
      const ex = getExercise($("#questAddSelect").value);
      if (!ex) return;
      state.quest.items = state.quest.items || [];
      state.quest.items.push(exToQuestItem(ex));
      renderQuestSetupList();
    });
    $("#startQuestBtn").addEventListener("click", async () => {
      if (!state.quest.items?.length) { showToast("운동을 하나 이상 추가해주세요."); return; }
      state.quest.status = "active";
      await saveQuest();
      renderQuestView();
    });
    return;
  }

  if (state.quest.status === "active") {
    const doneCount = state.quest.items.filter((it) => it.completed.length >= it.targetSets).length;
    ring.style.display = "inline-block";
    ring.textContent = `${doneCount}/${state.quest.items.length}`;
    body.innerHTML = `<div class="quest-list" id="questListWrap"></div><button type="button" class="quest-remove-btn" id="resetQuestBtn">오늘의 운동 다시 구성하기</button>`;
    const wrap = $("#questListWrap");
    state.quest.items.forEach((item, idx) => wrap.appendChild(buildQuestCard(item, idx)));
    $("#resetQuestBtn").addEventListener("click", async () => {
      state.quest = { status: "setup", items: [] };
      await saveQuest();
      renderQuestView();
    });

    if (doneCount === state.quest.items.length) {
      const doneBanner = document.createElement("div");
      doneBanner.className = "card";
      doneBanner.style.textAlign = "center";
      doneBanner.style.marginTop = "10px";
      doneBanner.innerHTML = `<div style="font-size:15px;font-weight:700">오늘 운동 완료! 🎉</div><div style="font-size:12.5px;color:var(--text-muted);margin-top:4px">수고하셨어요. 홈에서 오늘 기록을 확인해보세요.</div>`;
      body.appendChild(doneBanner);
    }
  }
}

function renderQuestSetupList() {
  const list = $("#questSetupList");
  if (!list) return;
  const items = state.quest.items || [];
  list.innerHTML = items.map((it, i) => `
    <div class="quest-setup-item">
      <span>${MUSCLE_LABELS[it.muscle]} · ${it.exerciseName} ${it.logType === "cardio" ? "" : `(${it.targetSets}세트)`}</span>
      <button type="button" data-idx="${i}">×</button>
    </div>`).join("") || `<div class="empty-msg">아직 추가된 종목이 없어요.</div>`;
  list.querySelectorAll("button[data-idx]").forEach((btn) => {
    btn.addEventListener("click", () => { items.splice(Number(btn.dataset.idx), 1); renderQuestSetupList(); });
  });
}

function buildQuestCard(item, idx) {
  const el = document.createElement("div");
  const done = item.completed.length >= item.targetSets;
  el.className = "quest-card" + (done ? " done" : "");
  const icon = item.muscle === "cardio" ? "🏃" : "🏋️";

  let bodyHtml = "";
  if (item.logType === "cardio") {
    bodyHtml = done
      ? `<div class="settings-hint">${item.completed[0].durationMin}분 · ${item.completed[0].speedKmh ? item.completed[0].speedKmh + "km/h" : "완료"}</div>`
      : `<div class="quest-input-row">
          <input type="number" placeholder="시간(분)" id="q_${idx}_dur" />
          <input type="number" placeholder="속도(선택)" id="q_${idx}_spd" />
          <button type="button" class="quest-log-btn" id="q_${idx}_log">완료</button>
        </div>`;
  } else {
    const dots = Array.from({ length: item.targetSets }, (_, i) => `<div class="quest-set-dot ${i < item.completed.length ? "filled" : ""}"></div>`).join("");
    bodyHtml = `
      <div class="quest-sets-track">${dots}</div>
      ${done ? "" : `
      <div class="quest-input-row">
        <input type="number" placeholder="무게(kg)" id="q_${idx}_w" />
        <input type="number" placeholder="횟수" id="q_${idx}_r" />
        <button type="button" class="quest-log-btn" id="q_${idx}_log">기록</button>
      </div>`}
    `;
  }

  el.innerHTML = `
    <div class="quest-card-head">
      <div class="quest-card-name"><span class="quest-thumb">${icon}</span>${item.exerciseName}<span class="quest-card-muscle">${MUSCLE_LABELS[item.muscle]}</span></div>
      <div class="quest-progress-txt">${done ? "완료" : item.logType === "cardio" ? "" : `${item.completed.length}/${item.targetSets}`}</div>
    </div>
    ${bodyHtml}
  `;

  setTimeout(() => {
    const logBtn = el.querySelector(`#q_${idx}_log`);
    if (!logBtn) return;
    logBtn.addEventListener("click", () => onQuestLog(idx, item));
  }, 0);

  return el;
}

async function onQuestLog(idx, item) {
  const ex = getExercise(item.exerciseId);
  if (item.logType === "cardio") {
    const dur = Number($(`#q_${idx}_dur`).value) || 0;
    const spd = Number($(`#q_${idx}_spd`).value) || 0;
    if (dur <= 0) { showToast("운동 시간을 입력해주세요."); return; }
    item.completed.push({ durationMin: dur, speedKmh: spd || null });
    await upsertQuestWorkout(item, ex);
  } else {
    const w = Number($(`#q_${idx}_w`).value);
    const r = Number($(`#q_${idx}_r`).value);
    if (!w || !r) { showToast("무게와 횟수를 입력해주세요."); return; }
    item.completed.push({ weight: w, reps: r });
    await upsertQuestWorkout(item, ex);
    if (item.completed.length < item.targetSets) startRestTimer(REST_SECONDS[item.muscle] || 60);
  }
  await saveQuest();
  await loadRecentWorkouts();
  renderDashboard();
  renderQuestView();
}

async function upsertQuestWorkout(item, ex) {
  const date = todayStr();
  const workoutId = `${date}_${item.exerciseId}`;
  const ref = doc(db, "users", state.user.uid, "workouts", workoutId);
  if (item.logType === "cardio") {
    const last = item.completed[item.completed.length - 1];
    await setDoc(ref, {
      type: "cardio", date, exerciseId: ex.id, exerciseName: ex.name, muscle: ex.muscle,
      durationMin: last.durationMin, speedKmh: last.speedKmh || null,
      calories: calcCardioCalories(ex, last.durationMin, last.speedKmh),
      note: "", createdAt: serverTimestamp(),
    });
  } else {
    const sets = item.completed;
    await setDoc(ref, {
      type: "strength", date, exerciseId: ex.id, exerciseName: ex.name, muscle: ex.muscle,
      sets, calories: calcStrengthCalories(ex, sets), note: "", createdAt: serverTimestamp(),
    });
  }
}

/* ---------------- 휴식 타이머 ---------------- */
state.timer.muted = localStorage.getItem("fitlog_timer_muted") === "1";
function startRestTimer(seconds) {
  clearInterval(state.timer.handle);
  state.timer.seconds = seconds;
  state.timer.total = seconds;
  updateTimerBar();
  $("#restTimerBar").classList.add("show");
  state.timer.handle = setInterval(() => {
    state.timer.seconds--;
    if (state.timer.seconds <= 0) {
      clearInterval(state.timer.handle);
      $("#restTimerBar").classList.remove("show");
      if (!state.timer.muted) playBeep();
      return;
    }
    updateTimerBar();
  }, 1000);
}
function updateTimerBar() {
  const m = Math.floor(state.timer.seconds / 60);
  const s = state.timer.seconds % 60;
  $("#restTimeLabel").textContent = `${pad2(m)}:${pad2(s)}`;
}
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine"; o.frequency.value = 880;
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    o.start();
    o.stop(ctx.currentTime + 0.35);
  } catch (_) { /* 오디오를 지원하지 않는 환경 무시 */ }
}
$("#restSkipBtn").addEventListener("click", () => { clearInterval(state.timer.handle); $("#restTimerBar").classList.remove("show"); });
$("#restAddBtn").addEventListener("click", () => { state.timer.seconds += 15; updateTimerBar(); });

/* ================= 캘린더 기록 ================= */
async function loadCalendarMonth(year, month, force) {
  const key = `${year}-${month}`;
  if (!force && state.cal.loadedMonth === key) { renderCalendar(); return; }
  const first = ymd(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();
  const last = ymd(year, month, lastDay);
  const q = query(
    collection(db, "users", state.user.uid, "workouts"),
    where("date", ">=", first), where("date", "<=", last), orderBy("date", "asc")
  );
  const snap = await getDocs(q);
  state.cal.monthWorkouts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  state.cal.loadedMonth = key;
  renderCalendar();
}
function renderCalendar() {
  const { year, month } = state.cal;
  $("#calTitle").textContent = `${year}년 ${month + 1}월`;
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const byDate = {};
  state.cal.monthWorkouts.forEach((w) => { (byDate[w.date] ||= []).push(w); });

  let html = ["일", "월", "화", "수", "목", "금", "토"].map((d) => `<div class="cal-dow">${d}</div>`).join("");
  for (let i = 0; i < firstWeekday; i++) html += `<div class="cal-cell empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = ymd(year, month, d);
    const hasLog = !!byDate[dStr]?.length;
    const isToday = dStr === todayStr();
    const isSelected = dStr === state.cal.selectedDate;
    html += `<button type="button" class="cal-cell ${hasLog ? "has-log" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}" data-date="${dStr}">${d}${hasLog ? '<span class="cal-dot"></span>' : ""}</button>`;
  }
  $("#calGrid").innerHTML = html;
  $all(".cal-cell[data-date]").forEach((cell) => {
    cell.addEventListener("click", () => { state.cal.selectedDate = cell.dataset.date; renderCalendar(); renderHistoryDayList(); });
  });
  renderHistoryDayList();
}
function renderHistoryDayList() {
  const dStr = state.cal.selectedDate;
  const items = state.cal.monthWorkouts.filter((w) => w.date === dStr);
  $("#historyDayTitle").textContent = dStr === todayStr() ? `오늘 (${dStr})` : dStr;
  const list = $("#historyDayList");
  if (items.length === 0) {
    list.innerHTML = `<div class="empty-msg">이 날은 기록이 없어요.</div>`;
    return;
  }
  list.innerHTML = items.map((w) => {
    const detail = w.type === "cardio"
      ? `${w.durationMin}분${w.speedKmh ? " · " + w.speedKmh + "km/h" : ""}`
      : w.sets.map((s) => `${s.weight}kg×${s.reps}`).join(" · ");
    return `<div class="log-item">
      <div><span class="ex-name">${w.exerciseName}</span><span class="ex-muscle">${MUSCLE_LABELS[w.muscle]}</span></div>
      <div class="ex-detail">${detail}<br/>${Math.round(w.calories || 0)}kcal</div>
    </div>`;
  }).join("");
}
$("#calPrevBtn").addEventListener("click", () => {
  state.cal.month--; if (state.cal.month < 0) { state.cal.month = 11; state.cal.year--; }
  loadCalendarMonth(state.cal.year, state.cal.month);
});
$("#calNextBtn").addEventListener("click", () => {
  state.cal.month++; if (state.cal.month > 11) { state.cal.month = 0; state.cal.year++; }
  loadCalendarMonth(state.cal.year, state.cal.month);
});

/* ================= 설정 ================= */
function renderSettingsProfile() {
  const p = state.profile || {};
  $("#settingNickname").value = p.displayName || "";
  $("#settingWeight").value = p.weightKg || "";
  $("#settingHeight").value = p.heightCm || "";
  $("#pfGoal").textContent = GOAL_LABELS[p.goal] || "-";
  $("#pfBody").textContent = p.weightKg && p.heightCm ? `${p.weightKg}kg / ${p.heightCm}cm` : "-";
  const bmi = computeBmi(p.weightKg, p.heightCm);
  $("#pfBmi").textContent = bmi ? `${bmi}` : "-";
  $("#pfEquip").textContent = EQUIP_LABELS[p.equipment] || "-";
  $("#pfDays").textContent = (p.availableDays || []).map((d) => DAY_LABELS[d]).join(", ") || "-";
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
  $("#greetingName").textContent = state.profile.displayName;
  renderSettingsProfile();
  showToast("프로필을 저장했어요.");
});

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
    const recent = state.workouts.filter((w) => daysBetween(w.date) < 7).map((w) => ({
      date: w.date, exercise: w.exerciseName, muscle: MUSCLE_LABELS[w.muscle],
      sets: w.sets || null, cardio: w.type === "cardio" ? { durationMin: w.durationMin, speedKmh: w.speedKmh } : null,
      calories: w.calories,
    }));
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: { weightKg: state.profile.weightKg, heightCm: state.profile.heightCm, goal: state.profile.goal },
        recentWorkouts: recent,
        ruleBasedRecommendation: reco.message.replace(/<\/?strong>/g, ""),
      }),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`API ${res.status}: ${errBody}`);
    }
    const data = await res.json();
    const text = data.text || "분석 결과를 가져오지 못했어요.";
    box.innerHTML = `<div class="ai-text">${text}</div>`;
    localStorage.setItem(`fitlog_ai_${state.user.uid}_${todayStr()}`, text);
    $("#askAiBtn").textContent = "다시 분석하기";
  } catch (err) {
    console.error("AI coach error:", err);
    box.innerHTML = `<div class="ai-empty">AI 분석을 가져오지 못했어요. 브라우저 콘솔(F12)에서 자세한 오류를 확인하거나 /api/gemini 설정(GEMINI_API_KEY)을 확인해주세요.</div>`;
  } finally {
    $("#askAiBtn").disabled = false;
  }
});

/* ================= 탭 전환 ================= */
function switchTab(tab) {
  state.activeTab = tab;
  $all(".tabbar button").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  $all(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${tab}`));
  if (tab === "workout") ensureQuestLoaded();
  if (tab === "history") {
    if (state.cal.year === 0) { const now = new Date(); state.cal.year = now.getFullYear(); state.cal.month = now.getMonth(); }
    loadCalendarMonth(state.cal.year, state.cal.month);
    renderAiCard();
  }
  if (tab === "settings") renderSettingsProfile();
}
$all(".tabbar button").forEach((btn) => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
