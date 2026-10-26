/**
 * Bluebook Digital SAT Practice Engine — October 2026 (INT-B)
 * 100% Client-Side LocalStorage Isolation for Independent Student Practice
 */

const STORAGE_KEY = "bluebook_oct2026_student_state_v1";
const DRIVE_PREVIEW_URL = "https://drive.google.com/file/d/1Qiu34_dltehpEVmfHvOivjAvf8Zkd77b/preview";
const DRIVE_VIEW_URL = "https://drive.google.com/file/d/1Qiu34_dltehpEVmfHvOivjAvf8Zkd77b/view?usp=drive_link";

// Application State
const App = {
  db: null,
  activeModuleCode: "RW_Module1",
  questions: [],
  currentIndex: 0,
  currentQuestion: null,
  selectedChoice: null,
  eliminatorMode: false,
  timerInterval: null,
  timerRunning: false, // Default paused until student starts practice
  timerHidden: false,
  pdfViewerMode: "drive", // "drive" (default, ideal for iPad/phones) or "local"

  // Student Personal State (Loaded from localStorage)
  studentState: {
    student_name: "",
    student_email: "",
    student_target: "1400+",
    active_module: "RW_Module1",
    active_q_index: 0,
    attempts: {}, // [qid]: { attempts: [], status: "unanswered", efficiency: 0.0, marked: false, eliminated: [] }
    error_logs: [],
    timer_seconds: {
      "RW_Module1": 32 * 60,
      "RW_Module2": 32 * 60,
      "Math_Module1": 35 * 60,
      "Math_Module2": 35 * 60,
      "ALL": 134 * 60
    }
  }
};

// DOM Cache
const DOM = {
  // Views
  viewHome: document.getElementById("view-home"),
  viewPractice: document.getElementById("view-practice"),

  // Home Page Elements
  btnHeroEnterTest: document.getElementById("btn-hero-enter-test"),
  homeUserChip: document.getElementById("home-user-chip"),
  homeStudentNameChip: document.getElementById("home-student-name-chip"),
  homeInputName: document.getElementById("home-input-name"),
  homeInputEmail: document.getElementById("home-input-email"),
  targetChipsContainer: document.getElementById("target-chips-container"),
  btnHomeStartPractice: document.getElementById("btn-home-start-practice"),
  btnHomeViewGuide: document.getElementById("btn-home-view-guide"),

  // Practice Header
  btnHome: document.getElementById("btn-home"),
  selectModule: document.getElementById("select-active-module"),
  timerDisplay: document.getElementById("timer-display"),
  btnTimerToggleView: document.getElementById("btn-timer-toggle-view"),
  btnTimerPause: document.getElementById("btn-timer-pause"),
  btnOpenCalc: document.getElementById("btn-open-calc"),
  btnOpenRef: document.getElementById("btn-open-ref"),
  btnToggleScratchpad: document.getElementById("btn-toggle-scratchpad"),
  btnOpenErrorLog: document.getElementById("btn-open-error-log"),
  badgeErrorCount: document.getElementById("badge-error-count"),
  btnOpenStrategies: document.getElementById("btn-open-strategies"),
  btnExportExcel: document.getElementById("btn-export-excel"),
  btnResetTest: document.getElementById("btn-reset-test"),
  btnFinishTest: document.getElementById("btn-finish-test"),
  headerStudentBadge: document.getElementById("header-student-badge"),
  headerStudentName: document.getElementById("header-student-name"),
  btnEditStudent: document.getElementById("btn-edit-student"),
  btnThemeToggle: document.getElementById("btn-theme-toggle"),

  // Split & PDF
  splitContainer: document.getElementById("split-container"),
  panePdf: document.getElementById("pane-pdf"),
  splitDivider: document.getElementById("split-divider"),
  pdfFrame: document.getElementById("pdf-frame"),
  pdfPageBadge: document.getElementById("pdf-page-badge"),
  pdfSyncPageNum: document.getElementById("pdf-sync-page-num"),
  btnModeDrive: document.getElementById("btn-mode-drive"),
  btnModeLocal: document.getElementById("btn-mode-local"),
  localPdfControls: document.getElementById("local-pdf-controls"),
  inputPdfPage: document.getElementById("input-pdf-page"),
  btnPdfPrev: document.getElementById("btn-pdf-prev"),
  btnPdfNext: document.getElementById("btn-pdf-next"),
  btnPdfExternal: document.getElementById("btn-pdf-external"),

  // Question Top
  qNumberLabel: document.getElementById("q-number-label"),
  qTopicBadge: document.getElementById("q-topic-badge"),
  qDomainBadge: document.getElementById("q-domain-badge"),
  chkMarkReview: document.getElementById("chk-mark-review"),
  markReviewLabel: document.querySelector(".mark-review-label"),
  btnToggleEliminator: document.getElementById("btn-toggle-eliminator"),

  // Excerpt
  excerptHeader: document.getElementById("excerpt-header"),
  excerptBody: document.getElementById("excerpt-body"),
  excerptToggleIcon: document.getElementById("excerpt-toggle-icon"),
  excerptPassage: document.getElementById("excerpt-passage"),
  excerptPrompt: document.getElementById("excerpt-prompt"),

  // Response Areas
  mcqResponseArea: document.getElementById("mcq-response-area"),
  optionsContainer: document.getElementById("options-container"),
  gridinResponseArea: document.getElementById("gridin-response-area"),
  gridinInput: document.getElementById("gridin-input"),

  // Attempts & Feedback
  slotL1: document.getElementById("slot-l1"),
  slotL2: document.getElementById("slot-l2"),
  slotL3: document.getElementById("slot-l3"),
  effVal: document.getElementById("eff-val"),
  btnCheckAnswer: document.getElementById("btn-check-answer"),
  statusAlert: document.getElementById("status-alert"),
  alertIcon: document.getElementById("alert-icon"),
  alertText: document.getElementById("alert-text"),

  // Hints
  hintCard1: document.getElementById("hint-card-1"),
  hintHead1: document.getElementById("hint-head-1"),
  hintContent1: document.getElementById("hint-content-1"),
  hintText1: document.getElementById("hint-text-1"),

  hintCard2: document.getElementById("hint-card-2"),
  hintHead2: document.getElementById("hint-head-2"),
  hintContent2: document.getElementById("hint-content-2"),
  hintText2: document.getElementById("hint-text-2"),

  hintCard3: document.getElementById("hint-card-3"),
  hintHead3: document.getElementById("hint-head-3"),
  hintContent3: document.getElementById("hint-content-3"),
  hintText3: document.getElementById("hint-text-3"),

  hintCard4: document.getElementById("hint-card-4"),
  hintHead4: document.getElementById("hint-head-4"),
  hintContent4: document.getElementById("hint-content-4"),
  hintText4: document.getElementById("hint-text-4"),

  // Footer Dock
  inputStudentName: document.getElementById("input-student-name"),
  btnOpenNavigator: document.getElementById("btn-open-navigator"),
  navCurrentLabel: document.getElementById("nav-current-label"),
  navTotalLabel: document.getElementById("nav-total-label"),
  btnNavBack: document.getElementById("btn-nav-back"),
  btnNavNext: document.getElementById("btn-nav-next"),

  // Navigator Modal
  navigatorOverlay: document.getElementById("navigator-modal-overlay"),
  btnCloseNavigator: document.getElementById("btn-close-navigator"),
  navModalModuleTitle: document.getElementById("nav-modal-module-title"),
  navTilesGrid: document.getElementById("nav-tiles-grid"),

  // Modals
  modalCalculator: document.getElementById("modal-calculator"),
  btnCloseCalculator: document.getElementById("btn-close-calculator"),
  modalReference: document.getElementById("modal-reference"),
  btnCloseReference: document.getElementById("btn-close-reference"),
  modalErrorLog: document.getElementById("modal-error-log"),
  btnCloseErrorLog: document.getElementById("btn-close-error-log"),
  errorLogList: document.getElementById("error-log-list"),
  btnAddNewError: document.getElementById("btn-add-new-error"),
  selectFilterErrStatus: document.getElementById("select-filter-err-status"),
  modalStrategies: document.getElementById("modal-strategies"),
  btnCloseStrategies: document.getElementById("btn-close-strategies"),
  strategiesContent: document.getElementById("strategies-content"),

  // Scratchpad
  scratchpadDrawer: document.getElementById("scratchpad-drawer"),
  scratchpadCanvas: document.getElementById("scratchpad-canvas"),
  btnScratchClear: document.getElementById("btn-scratch-clear"),
  btnScratchClose: document.getElementById("btn-scratch-close"),
  colorButtons: document.querySelectorAll(".color-btn"),

  // Guide / Onboarding Modal
  modalOnboarding: document.getElementById("modal-onboarding"),
  btnCloseOnboarding: document.getElementById("btn-close-onboarding"),
  btnGuideDismiss: document.getElementById("btn-guide-dismiss"),
  obPreviewName: document.getElementById("ob-preview-name"),
  obPreviewEmail: document.getElementById("ob-preview-email"),
  btnObStart: document.getElementById("btn-ob-start"),

  // Finish Modal
  modalFinishTest: document.getElementById("modal-finish-test"),
  btnCloseFinish: document.getElementById("btn-close-finish"),
  finishStudentName: document.getElementById("finish-student-name"),
  finishStudentEmail: document.getElementById("finish-student-email"),
  noticeStudentEmail: document.getElementById("notice-student-email"),
  statAnswered: document.getElementById("stat-answered"),
  statScorePct: document.getElementById("stat-score-pct"),
  statL1Correct: document.getElementById("stat-l1-correct"),
  statL2Correct: document.getElementById("stat-l2-correct"),
  unansweredAlert: document.getElementById("unanswered-alert"),
  unansweredCount: document.getElementById("unanswered-count"),
  btnSubmitTestConfirm: document.getElementById("btn-submit-test-confirm"),
  btnSubmitText: document.getElementById("btn-submit-text"),
  submitSpinner: document.getElementById("submit-spinner"),
  btnDownloadExcelDirect: document.getElementById("btn-download-excel-direct"),
  btnCancelFinish: document.getElementById("btn-cancel-finish"),

  // Mandatory Reflection Modal
  modalMandatoryReflection: document.getElementById("modal-mandatory-reflection"),
  reflQLabel: document.getElementById("refl-q-label"),
  reflQTopic: document.getElementById("refl-q-topic"),
  reflQModule: document.getElementById("refl-q-module"),
  reflCorrectAns: document.getElementById("refl-correct-ans"),
  reflWrongPicks: document.getElementById("refl-wrong-picks"),
  reflHintBox: document.getElementById("refl-hint-box"),
  selectReflTrap: document.getElementById("select-refl-trap"),
  inputReflDetail: document.getElementById("input-refl-detail"),
  btnSaveMandatoryReflection: document.getElementById("btn-save-mandatory-reflection"),

  // Success Modal
  modalSubmitSuccess: document.getElementById("modal-submit-success"),
  successStatusText: document.getElementById("success-status-text"),
  successFilename: document.getElementById("success-filename"),
  btnRelaunchMail: document.getElementById("btn-relaunch-mail"),
  btnDownloadSubmittedFile: document.getElementById("btn-download-submitted-file"),
  btnCloseSuccess: document.getElementById("btn-close-success"),

  // Reset Confirmation Modal
  modalResetConfirm: document.getElementById("modal-reset-confirm"),
  chkResetAnswers: document.getElementById("chk-reset-answers"),
  chkResetTimer: document.getElementById("chk-reset-timer"),
  chkResetErrors: document.getElementById("chk-reset-errors"),
  btnConfirmDoReset: document.getElementById("btn-confirm-do-reset"),
  btnCancelReset: document.getElementById("btn-cancel-reset")
};

// ================= LOCALSTORAGE MANAGER =================
function loadLocalState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      App.studentState = { ...App.studentState, ...parsed };
      if (!App.studentState.attempts) App.studentState.attempts = {};

      // Purge any legacy default/seeded error logs
      if (App.studentState.error_logs) {
        App.studentState.error_logs = App.studentState.error_logs.filter(e => e && e.id && !e.id.startsWith("err_oct_"));
      } else {
        App.studentState.error_logs = [];
      }

      if (!App.studentState.timer_seconds) {
        App.studentState.timer_seconds = {
          "RW_Module1": 32 * 60,
          "RW_Module2": 32 * 60,
          "Math_Module1": 35 * 60,
          "Math_Module2": 35 * 60,
          "ALL": 134 * 60
        };
      }
    } else {
      App.studentState.error_logs = [];
    }
  } catch (e) {
    console.warn("Could not load from localStorage:", e);
    App.studentState.error_logs = [];
  }

  // Restore student name & email
  if (App.studentState.student_name) {
    if (DOM.inputStudentName) DOM.inputStudentName.value = App.studentState.student_name;
    if (DOM.headerStudentName) DOM.headerStudentName.textContent = App.studentState.student_name;
  }
}

function saveLocalState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(App.studentState));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
}

// ================= VIEW CONTROLLER (GOOGLE UX LANDING & PRACTICE) =================
function showView(viewName) {
  if (viewName === "home") {
    if (DOM.viewHome) {
      DOM.viewHome.classList.remove("hidden");
      DOM.viewHome.style.display = "flex";
    }
    if (DOM.viewPractice) {
      DOM.viewPractice.classList.add("hidden");
      DOM.viewPractice.style.display = "none";
    }
    App.timerRunning = false;
    syncHomeProfile();
    updateModuleCardStats();
    if (DOM.viewHome) DOM.viewHome.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    if (DOM.viewHome) {
      DOM.viewHome.classList.add("hidden");
      DOM.viewHome.style.display = "none";
    }
    if (DOM.viewPractice) {
      DOM.viewPractice.classList.remove("hidden");
      DOM.viewPractice.style.display = "flex";
    }
    if (DOM.modalOnboarding) {
      DOM.modalOnboarding.classList.add("hidden");
      DOM.modalOnboarding.style.display = "none";
    }
    App.timerRunning = true;
    renderCurrentQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function syncHomeProfile() {
  const name = App.studentState.student_name || "";
  const email = App.studentState.student_email || "";
  const target = App.studentState.student_target || "1400+";

  if (DOM.homeInputName) DOM.homeInputName.value = name;
  if (DOM.homeInputEmail) DOM.homeInputEmail.value = email;

  if (DOM.homeStudentNameChip) {
    if (name) {
      DOM.homeStudentNameChip.textContent = name;
      if (DOM.homeUserChip) DOM.homeUserChip.title = `Học sinh: ${name} (${email || "Chưa có email"})`;
    } else {
      DOM.homeStudentNameChip.textContent = "Chưa đăng ký";
      if (DOM.homeUserChip) DOM.homeUserChip.title = "Học sinh đang tham gia";
    }
  }

  if (DOM.targetChipsContainer) {
    const chips = DOM.targetChipsContainer.querySelectorAll(".target-chip");
    chips.forEach(chip => {
      if (chip.getAttribute("data-val") === target) {
        chip.classList.add("active");
      } else {
        chip.classList.remove("active");
      }
    });
  }
}

function updateModuleCardStats() {
  if (!App.db || !App.db.questions) return;

  const moduleMapping = {
    "RW_Module1": "stat-mod-rw1",
    "RW_Module2": "stat-mod-rw2",
    "Math_Module1": "stat-mod-math1",
    "Math_Module2": "stat-mod-math2"
  };

  Object.entries(moduleMapping).forEach(([modCode, elemId]) => {
    const elem = document.getElementById(elemId);
    if (!elem) return;

    const modQuestions = App.db.questions.filter(q => q.module_code === modCode);
    const total = modQuestions.length;
    
    let answeredCount = 0;
    let correctCount = 0;

    modQuestions.forEach(q => {
      const att = App.studentState.attempts[q.id];
      if (att && att.status && att.status !== "unanswered") {
        answeredCount++;
        if (att.status === "correct") correctCount++;
      }
    });

    if (answeredCount > 0) {
      elem.innerHTML = `<strong>${answeredCount}/${total}</strong> đã làm (${correctCount} đúng)`;
      elem.classList.add("in-progress");
    } else {
      elem.textContent = `${total} Câu`;
      elem.classList.remove("in-progress");
    }
  });
}

function startPracticeFromHome(targetModule) {
  let name = (DOM.homeInputName ? DOM.homeInputName.value.trim() : "") || App.studentState.student_name;
  let email = (DOM.homeInputEmail ? DOM.homeInputEmail.value.trim() : "") || App.studentState.student_email;

  if (!name || !email) {
    if (DOM.homeInputName && !DOM.homeInputName.value.trim()) {
      DOM.homeInputName.focus();
      DOM.homeInputName.parentElement.classList.add("input-error");
      setTimeout(() => DOM.homeInputName.parentElement.classList.remove("input-error"), 2000);
    } else if (DOM.homeInputEmail && !DOM.homeInputEmail.value.trim()) {
      DOM.homeInputEmail.focus();
      DOM.homeInputEmail.parentElement.classList.add("input-error");
      setTimeout(() => DOM.homeInputEmail.parentElement.classList.remove("input-error"), 2000);
    }
    alert("Vui lòng điền đầy đủ Họ và tên cùng Địa chỉ email của em để bắt đầu bài làm!");
    return;
  }

  App.studentState.student_name = name;
  App.studentState.student_email = email;

  if (DOM.targetChipsContainer) {
    const activeChip = DOM.targetChipsContainer.querySelector(".target-chip.active");
    if (activeChip) {
      App.studentState.student_target = activeChip.getAttribute("data-val");
    }
  }

  saveLocalState();

  if (DOM.headerStudentName) DOM.headerStudentName.textContent = name;
  if (DOM.inputStudentName) DOM.inputStudentName.value = name;

  if (targetModule && targetModule !== App.activeModuleCode) {
    App.activeModuleCode = targetModule;
    App.studentState.active_module = targetModule;
    saveLocalState();
    if (DOM.selectModule) DOM.selectModule.value = targetModule;
    setupModuleQuestions();
    startModuleTimer();
  }

  showView("practice");
}

// ================= INITIALIZATION =================
document.addEventListener("DOMContentLoaded", async () => {
  loadLocalState();
  initSplitResizer();
  initTheme();
  initScratchpad();
  initOnboarding();
  setupEventListeners();

  await fetchDatabase();
  setupModuleQuestions();
  startModuleTimer();
  updateModuleCardStats();
  syncHomeProfile();
  showView("home");
});

async function fetchDatabase() {
  try {
    const res = await fetch("/api/data");
    App.db = await res.json();
    if (!App.studentState.error_logs) {
      App.studentState.error_logs = [];
    }
    updateErrorBadge();
  } catch (e) {
    console.error("Failed to load test database:", e);
  }
}

function setupModuleQuestions() {
  if (!App.db) return;

  const mod = App.activeModuleCode;
  if (mod === "ALL") {
    App.questions = App.db.questions;
  } else {
    App.questions = App.db.questions.filter(q => q.module_code === mod);
  }

  App.currentIndex = 0;
  DOM.navTotalLabel.textContent = App.questions.length;
  DOM.selectModule.value = mod;

  renderCurrentQuestion();
}

// ================= TIMER =================
function startModuleTimer() {
  clearInterval(App.timerInterval);
  
  const updateDisplay = () => {
    let secs = App.studentState.timer_seconds[App.activeModuleCode] || 0;
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    DOM.timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(remSecs).padStart(2, "0")}`;
  };

  updateDisplay();

  App.timerInterval = setInterval(() => {
    if (App.timerRunning) {
      if (App.studentState.timer_seconds[App.activeModuleCode] > 0) {
        App.studentState.timer_seconds[App.activeModuleCode]--;
        updateDisplay();
        // Save timer state periodically
        if (App.studentState.timer_seconds[App.activeModuleCode] % 5 === 0) {
          saveLocalState();
        }
      } else {
        DOM.timerDisplay.textContent = "00:00";
      }
    }
  }, 1000);
}

// ================= QUESTION RENDERING =================
function renderCurrentQuestion() {
  const q = App.questions[App.currentIndex];
  if (!q) return;

  App.currentQuestion = q;
  App.selectedChoice = null;

  // Retrieve student's personal state for this question from localStorage
  const qState = App.studentState.attempts[q.id] || {
    attempts: [],
    status: "unanswered",
    efficiency: 0.0,
    marked: false,
    eliminated: []
  };

  // Header Labels
  DOM.qNumberLabel.textContent = `Question ${App.currentIndex + 1} of ${App.questions.length}`;
  DOM.navCurrentLabel.textContent = App.currentIndex + 1;
  DOM.qTopicBadge.textContent = q.topic;
  DOM.qDomainBadge.textContent = q.section;

  // Mark for review
  DOM.chkMarkReview.checked = !!qState.marked;
  DOM.markReviewLabel.classList.toggle("marked", !!qState.marked);

  // PDF Page Sync
  if (DOM.pdfSyncPageNum) DOM.pdfSyncPageNum.textContent = q.pdf_page;
  if (DOM.inputPdfPage) DOM.inputPdfPage.value = q.pdf_page;
  if (App.pdfViewerMode === "local") {
    navigatePdf(q.pdf_page);
  }

  // Excerpt Accordion
  DOM.excerptPassage.textContent = q.passage || "Xem văn bản trên trang đề thi PDF bên trái.";
  DOM.excerptPrompt.textContent = q.prompt || "";

  // Render Response Mode: Multiple-Choice or Grid-in
  if (q.is_grid_in) {
    DOM.mcqResponseArea.classList.add("hidden");
    DOM.gridinResponseArea.classList.remove("hidden");
    DOM.gridinInput.value = (qState.attempts && qState.attempts.length > 0) ? qState.attempts[qState.attempts.length - 1] : "";
    DOM.gridinInput.disabled = (qState.status.startsWith("mastered") || qState.status === "missed");
  } else {
    DOM.gridinResponseArea.classList.add("hidden");
    DOM.mcqResponseArea.classList.remove("hidden");
    renderOptions(q, qState);
  }

  // Attempt tracker & Slots
  renderAttemptSlots(q, qState);

  // Progressive Hints
  renderHints(q, qState);

  // Math typesetting
  if (window.renderMathInElement) {
    window.renderMathInElement(document.getElementById("pane-content"), {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
      ],
      throwOnError: false
    });
  }

  // Disable check button until selected
  DOM.btnCheckAnswer.disabled = true;
}

function renderOptions(q, qState) {
  DOM.optionsContainer.innerHTML = "";
  const isFinished = (qState.status.startsWith("mastered") || qState.status === "missed");
  const eliminated = qState.eliminated || [];

  const defaultKeys = ["A", "B", "C", "D"];
  const opts = (q.options && q.options.length > 0) ? q.options : defaultKeys.map(k => ({ key: k, text: `Option ${k}` }));

  opts.forEach(opt => {
    const row = document.createElement("div");
    row.className = "option-row";
    row.dataset.key = opt.key;

    if (eliminated.includes(opt.key)) {
      row.classList.add("eliminated");
    }

    if (isFinished) {
      if (opt.key === q.correct_answer) {
        row.classList.add("correct");
      } else if (qState.attempts.includes(opt.key)) {
        row.classList.add("wrong");
      }
    } else if (qState.attempts.includes(opt.key)) {
      row.classList.add("wrong");
    }

    row.innerHTML = `
      <div class="option-bubble">${opt.key}</div>
      <div class="option-text-wrap">${opt.text}</div>
      <button class="btn-strike-option" title="Gạch bỏ phương án này">⨉</button>
    `;

    // Click option to select
    row.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-strike-option")) return;
      if (isFinished) return;
      if (row.classList.contains("eliminated")) return;

      document.querySelectorAll(".option-row").forEach(r => r.classList.remove("selected"));
      row.classList.add("selected");
      App.selectedChoice = opt.key;
      DOM.btnCheckAnswer.disabled = false;
    });

    // Eliminator strike action
    const btnStrike = row.querySelector(".btn-strike-option");
    btnStrike.addEventListener("click", (e) => {
      e.stopPropagation();
      row.classList.toggle("eliminated");
      if (row.classList.contains("eliminated")) {
        if (!qState.eliminated) qState.eliminated = [];
        if (!qState.eliminated.includes(opt.key)) qState.eliminated.push(opt.key);
      } else {
        qState.eliminated = (qState.eliminated || []).filter(k => k !== opt.key);
      }
      App.studentState.attempts[q.id] = qState;
      saveLocalState();
    });

    DOM.optionsContainer.appendChild(row);
  });
}

function renderAttemptSlots(q, qState) {
  const attempts = qState.attempts || [];
  const status = qState.status || "unanswered";
  const eff = qState.efficiency || 0;

  const setSlot = (slotEl, idx) => {
    const textEl = slotEl.querySelector(".slot-text");
    if (attempts.length > idx) {
      textEl.textContent = attempts[idx];
      if (status.startsWith("mastered") && idx === attempts.length - 1) {
        textEl.className = "slot-text correct";
      } else {
        textEl.className = "slot-text wrong";
      }
    } else {
      textEl.textContent = "-";
      textEl.className = "slot-text";
    }
  };

  setSlot(DOM.slotL1, 0);
  setSlot(DOM.slotL2, 1);
  setSlot(DOM.slotL3, 2);

  DOM.effVal.textContent = `${Math.round(eff * 100)}%`;

  // Status Alert
  if (status === "mastered_l1") {
    showAlert(true, "🎉 Chính xác! Em đã làm đúng ngay Lần 1 (Hiệu suất 100%).");
  } else if (status === "mastered_l2") {
    showAlert(true, "✅ Rất tốt! Em đã làm đúng ở Lần 2 (Hiệu suất 66.7%).");
  } else if (status === "mastered_l3") {
    showAlert(true, "✅ Đúng ở Lần 3 (Hiệu suất 33.3%). Xem lại gợi ý để nắm chắc kiến thức.");
  } else if (status === "missed") {
    showAlert(false, `❌ Chưa chính xác sau 3 lần. Đáp án đúng là [${q.correct_answer}]. Hãy ghi lại vào Sổ lỗi.`);
  } else if (status.startsWith("retry")) {
    const left = 3 - attempts.length;
    showAlert(false, `⚠️ Chưa chính xác. Em còn ${left} lần thử. Đã mở gợi ý bên dưới!`);
  } else {
    DOM.statusAlert.className = "status-alert hidden";
  }
}

function showAlert(isSuccess, text) {
  DOM.statusAlert.className = `status-alert ${isSuccess ? "success" : "wrong"}`;
  DOM.alertIcon.textContent = isSuccess ? "✅" : "❌";
  DOM.alertText.textContent = text;
}

function renderHints(q, qState) {
  const attempts = qState.attempts || [];
  const isFinished = (qState.status.startsWith("mastered") || qState.status === "missed");

  // Tier 1: Định hướng bối cảnh & Tư duy tổng quan (Mở sau Lần 1 hoặc khi hoàn thành)
  if (attempts.length >= 1 || isFinished) {
    DOM.hintText1.innerHTML = q.tier1_hint || q.level1_tip || "Xác định từ khóa trọng tâm và logic ngữ cảnh của câu hỏi.";
    DOM.hintContent1.classList.remove("collapsed");
    DOM.hintCard1.classList.add("unlocked");
  } else {
    DOM.hintText1.textContent = "🔒 Thử sức Lần 1 để mở khóa gợi ý định hướng bối cảnh.";
    DOM.hintContent1.classList.add("collapsed");
    DOM.hintCard1.classList.remove("unlocked");
  }

  // Tier 2: Manh mối cấu trúc & Phân tích loại trừ (Mở sau Lần 2 hoặc khi hoàn thành)
  if (attempts.length >= 2 || isFinished) {
    DOM.hintText2.innerHTML = q.tier2_hint || q.level2_hint || "Áp dụng phương pháp loại trừ và phân tích cấu trúc đối chiếu.";
    DOM.hintContent2.classList.remove("collapsed");
    DOM.hintCard2.classList.add("unlocked");
  } else {
    DOM.hintText2.textContent = "🔒 Thử sức Lần 2 để mở khóa manh mối cấu trúc & loại trừ phương án sai.";
    DOM.hintContent2.classList.add("collapsed");
    DOM.hintCard2.classList.remove("unlocked");
  }

  // Tier 3: Chốt phương pháp & Lời giải chi tiết (Mở sau Lần 3 hoặc khi hoàn thành)
  if (attempts.length >= 3 || isFinished) {
    let sol = q.tier3_hint || q.level3_solution || "Chốt phương pháp: So sánh trực tiếp với giả thiết cốt lõi trong đề.";
    if (isFinished) {
      sol = `<strong>Đáp án đúng: <span class="correct-highlight">[${q.correct_answer}]</span></strong><br>${sol}`;
    }
    DOM.hintText3.innerHTML = sol;
    DOM.hintContent3.classList.remove("collapsed");
    DOM.hintCard3.classList.add("unlocked");
  } else {
    DOM.hintText3.textContent = "🔒 Mở khóa chốt phương pháp sau 3 lần thử hoặc khi làm đúng.";
    DOM.hintContent3.classList.add("collapsed");
    DOM.hintCard3.classList.remove("unlocked");
  }

  // Tier 4: Strategic Tip & Công thức chuẩn College Board (Mở khi làm đúng hoặc hoàn thành)
  if (DOM.hintCard4) {
    if (isFinished) {
      DOM.hintText4.innerHTML = `<strong>✨ Chiến thuật College Board:</strong><br>${q.strategic_tip || "Nắm vững quy tắc và công thức toán / ngữ pháp cốt lõi."}`;
      DOM.hintContent4.classList.remove("collapsed");
      DOM.hintCard4.classList.add("unlocked");
    } else {
      DOM.hintText4.textContent = "🔒 Hoàn thành câu hỏi để mở khóa Strategic Tip & Bí kíp công thức.";
      DOM.hintContent4.classList.add("collapsed");
      DOM.hintCard4.classList.remove("unlocked");
    }
  }
}

// ================= SUBMIT / CHECK ANSWER (100% LOCALSTORAGE) =================
function checkAnswer() {
  const q = App.currentQuestion;
  if (!q) return;

  let choice = App.selectedChoice;
  if (q.is_grid_in) {
    choice = DOM.gridinInput.value.trim();
  }

  if (!choice) return;

  const qState = App.studentState.attempts[q.id] || {
    attempts: [],
    status: "unanswered",
    efficiency: 0.0,
    marked: false,
    eliminated: []
  };

  qState.attempts = qState.attempts || [];
  qState.attempts.push(choice);
  const attemptCount = qState.attempts.length;

  // Evaluation: match string or float for grid-in
  let isCorrect = false;
  if (q.is_grid_in) {
    const cleanUser = choice.replace(/\s+/g, '');
    const cleanAns = q.correct_answer.replace(/\s+/g, '');
    isCorrect = (cleanUser === cleanAns);
    if (!isCorrect) {
      try {
        const uVal = evalFraction(cleanUser);
        const aVal = evalFraction(cleanAns);
        if (uVal !== null && aVal !== null && Math.abs(uVal - aVal) < 0.0001) {
          isCorrect = true;
        }
      } catch (e) {}
    }
  } else {
    isCorrect = (choice.toUpperCase() === q.correct_answer.toUpperCase());
  }

  // Scoring & Error Tracking
  if (isCorrect) {
    if (attemptCount === 1) {
      qState.status = "mastered_l1";
      qState.efficiency = 1.0;
    } else if (attemptCount === 2) {
      qState.status = "mastered_l2";
      qState.efficiency = 0.667;
    } else {
      qState.status = "mastered_l3";
      qState.efficiency = 0.333;
    }

    // Did the student make any mistake prior to getting it right?
    if (qState.had_mistake || attemptCount > 1) {
      if (!qState.error_logged) {
        qState.needs_error_log = true;
      }
    }
  } else {
    qState.had_mistake = true;
    if (attemptCount >= 3) {
      qState.status = "missed";
      qState.efficiency = 0.0;
      if (!qState.error_logged) {
        qState.needs_error_log = true;
      }
    } else {
      qState.status = `retry_l${attemptCount + 1}`;
      qState.efficiency = 0.0;
    }
  }

  // Save to Student's LocalStorage
  App.studentState.attempts[q.id] = qState;
  saveLocalState();

  // Re-render UI
  renderCurrentQuestion();

  // If question is completed (correct or 3 attempts) and has unlogged mistake, show mandatory reflection modal!
  if ((isCorrect || attemptCount >= 3) && qState.needs_error_log && !qState.error_logged) {
    setTimeout(() => {
      openMandatoryReflectionModal(q, qState);
    }, 400);
  }
}

function evalFraction(str) {
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (den !== 0) return num / den;
    }
  }
  const val = parseFloat(str);
  return isNaN(val) ? null : val;
}

// ================= BLUEBOOK QUESTION NAVIGATOR POPUP =================
function renderNavigatorTiles() {
  DOM.navTilesGrid.innerHTML = "";
  DOM.navModalModuleTitle.textContent = `${DOM.selectModule.options[DOM.selectModule.selectedIndex].text}`;

  App.questions.forEach((q, idx) => {
    const qState = App.studentState.attempts[q.id] || { status: "unanswered", attempts: [], marked: false };
    const tile = document.createElement("div");
    tile.className = "nav-tile";
    tile.textContent = idx + 1;

    if (idx === App.currentIndex) tile.classList.add("current");
    if (qState.attempts && qState.attempts.length > 0) tile.classList.add("answered");
    if (qState.marked) tile.classList.add("marked");

    tile.addEventListener("click", () => {
      if (idx !== App.currentIndex && !checkCanNavigate()) return;
      App.currentIndex = idx;
      renderCurrentQuestion();
      DOM.navigatorOverlay.classList.add("hidden");
    });

    DOM.navTilesGrid.appendChild(tile);
  });
}

// ================= PDF NAVIGATION =================
function navigatePdf(page, zoom = null) {
  const p = Math.max(1, Math.min(44, parseInt(page) || 1));
  if (DOM.inputPdfPage) DOM.inputPdfPage.value = p;
  if (DOM.pdfSyncPageNum) DOM.pdfSyncPageNum.textContent = p;

  if (App.pdfViewerMode === "local") {
    let url = `/pdf?p=${p}#page=${p}`;
    if (zoom) {
      url += `&zoom=${zoom}`;
    } else {
      url += `&view=FitH`;
    }
    DOM.pdfFrame.src = url;
  }
}

function setPdfViewerMode(mode) {
  App.pdfViewerMode = mode;
  if (mode === "drive") {
    DOM.btnModeDrive.classList.add("active");
    DOM.btnModeLocal.classList.remove("active");
    DOM.localPdfControls.classList.add("hidden");
    if (!DOM.pdfFrame.src.includes("drive.google.com")) {
      DOM.pdfFrame.src = DRIVE_PREVIEW_URL;
    }
  } else {
    DOM.btnModeDrive.classList.remove("active");
    DOM.btnModeLocal.classList.add("active");
    DOM.localPdfControls.classList.remove("hidden");
    const p = App.currentQuestion ? App.currentQuestion.pdf_page : (parseInt(DOM.inputPdfPage.value) || 3);
    navigatePdf(p);
  }
}

// ================= ERROR LOG & STRATEGIES =================
function updateErrorBadge() {
  const unres = (App.studentState.error_logs || []).filter(l => l.status !== "Đã triệt tiêu").length;
  DOM.badgeErrorCount.textContent = unres;
}

function renderErrorLogs() {
  const statusFilter = DOM.selectFilterErrStatus.value;
  const list = App.studentState.error_logs || [];
  DOM.errorLogList.innerHTML = "";

  const filtered = list.filter(l => (statusFilter === "all" || l.status === statusFilter));
  if (filtered.length === 0) {
    DOM.errorLogList.innerHTML = `<div style="text-align: center; padding: 30px; color: var(--bb-text-muted);">Chưa có ghi chép lỗi sai nào trong bộ lọc này.</div>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.style.cssText = "background: var(--bb-bg-surface); border: 1px solid var(--bb-border); border-radius: 8px; padding: 14px; margin-bottom: 12px;";
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: 700; color: #0284c7; font-size: 13px;">${item.module || "SAT"} • ${item.skill}</span>
        <div>
          <span style="font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: #fef3c7; color: #b45309;">${item.status}</span>
          <button class="btn-sm btn-del-err" style="margin-left: 8px; color: #dc2626; cursor: pointer;">✕</button>
        </div>
      </div>
      <div style="font-size: 13px; line-height: 1.5; margin-bottom: 6px;"><strong>🎯 Chi tiết bẫy:</strong> ${item.trap_detail}</div>
      <div style="font-size: 13px; line-height: 1.5; color: var(--bb-text-secondary);"><strong>🧠 Phân tích Socratic:</strong> ${item.socratic_analysis}</div>
    `;

    card.querySelector(".btn-del-err").addEventListener("click", () => {
      App.studentState.error_logs = App.studentState.error_logs.filter(x => x.id !== item.id);
      saveLocalState();
      updateErrorBadge();
      renderErrorLogs();
    });

    DOM.errorLogList.appendChild(card);
  });
}

function renderStrategiesModal() {
  if (!App.db || !App.db.strategies) return;
  DOM.strategiesContent.innerHTML = "";

  App.db.strategies.forEach(s => {
    const box = document.createElement("div");
    box.style.cssText = "background: var(--bb-bg-surface-elevated); border: 1px solid var(--bb-border); border-radius: 8px; padding: 16px; margin-bottom: 14px;";
    box.innerHTML = `
      <h4 style="color: #0369a1; font-size: 15px; font-weight: 800; margin-bottom: 6px;">${s.domain} (${s.category})</h4>
      <div style="font-size: 13px; line-height: 1.6; margin-bottom: 8px;"><strong>📚 Chiến thuật cốt lõi:</strong><br>${s.core_rules.replace(/\n/g, '<br>')}</div>
      <div style="font-size: 13px; line-height: 1.6; background: #fffbeb; border-left: 3px solid #d97706; padding: 8px 12px; border-radius: 4px;"><strong>⚠️ Bẫy SAT thường gặp:</strong><br>${s.traps.replace(/\n/g, '<br>')}</div>
    `;
    DOM.strategiesContent.appendChild(box);
  });
}

// ================= PRACTICE GUIDE MODAL =================
function initOnboarding() {
  const hasProfile = App.studentState.student_name && App.studentState.student_email;
  // Landing page contains profile form, keep guide modal hidden initially
  if (DOM.modalOnboarding) {
    DOM.modalOnboarding.classList.add("hidden");
    DOM.modalOnboarding.style.display = "none";
  }

  if (hasProfile) {
    if (DOM.headerStudentName) DOM.headerStudentName.textContent = App.studentState.student_name;
    if (DOM.inputStudentName) DOM.inputStudentName.value = App.studentState.student_name;
    if (DOM.homeStudentNameChip) DOM.homeStudentNameChip.textContent = App.studentState.student_name;
  }

  // Start Practice from Guide Modal
  if (DOM.btnObStart) {
    DOM.btnObStart.addEventListener("click", () => {
      if (DOM.modalOnboarding) {
        DOM.modalOnboarding.classList.add("hidden");
        DOM.modalOnboarding.style.display = "none";
      }
      startPracticeFromHome();
    });
  }

  // Dismiss Guide Modal
  if (DOM.btnGuideDismiss) {
    DOM.btnGuideDismiss.addEventListener("click", () => {
      if (DOM.modalOnboarding) {
        DOM.modalOnboarding.classList.add("hidden");
        DOM.modalOnboarding.style.display = "none";
      }
    });
  }

  // Close Guide Modal (X button)
  if (DOM.btnCloseOnboarding) {
    DOM.btnCloseOnboarding.addEventListener("click", () => {
      if (DOM.modalOnboarding) {
        DOM.modalOnboarding.classList.add("hidden");
        DOM.modalOnboarding.style.display = "none";
      }
    });
  }

  // Backdrop click closes Guide Modal
  if (DOM.modalOnboarding) {
    DOM.modalOnboarding.addEventListener("click", (e) => {
      if (e.target === DOM.modalOnboarding) {
        DOM.modalOnboarding.classList.add("hidden");
        DOM.modalOnboarding.style.display = "none";
      }
    });
  }

  // Edit Profile from Practice Header
  if (DOM.headerStudentBadge) {
    DOM.headerStudentBadge.addEventListener("click", () => {
      const current = App.studentState.student_name || "";
      const updated = prompt("Chỉnh sửa Họ và tên thí sinh:", current);
      if (updated && updated.trim()) {
        App.studentState.student_name = updated.trim();
        saveLocalState();
        syncHomeProfile();
        if (DOM.headerStudentName) DOM.headerStudentName.textContent = updated.trim();
      }
    });
  }
}

function handleHomeClick() {
  showView("home");
}

function handleResetConfirm() {
  // 1. Reset answers & attempts
  App.studentState.attempts = {};

  // 2. Reset timer if checked
  if (DOM.chkResetTimer && DOM.chkResetTimer.checked) {
    App.studentState.timer_seconds = {
      "RW_Module1": 32 * 60,
      "RW_Module2": 32 * 60,
      "Math_Module1": 35 * 60,
      "Math_Module2": 35 * 60,
      "ALL": 134 * 60
    };
  }

  // 3. Reset error logs if checked
  if (DOM.chkResetErrors && DOM.chkResetErrors.checked) {
    App.studentState.error_logs = [];
  }

  // 4. Reset navigation to Question 1 of Module 1
  App.activeModuleCode = "RW_Module1";
  DOM.selectModule.value = "RW_Module1";
  App.currentIndex = 0;
  App.studentState.active_module = "RW_Module1";
  App.studentState.active_q_index = 0;

  // 5. Persist and Re-render
  saveLocalState();
  setupModuleQuestions();
  startModuleTimer();
  updateErrorBadge();
  renderCurrentQuestion();

  DOM.modalResetConfirm.classList.add("hidden");
  alert("✨ Đã đặt lại bài thi thành công! Chúc em luyện tập thật tốt!");
}

// ================= TEST COMPLETION & SUBMISSION =================
function calculateTestSummary() {
  const allQs = (App.db && App.db.questions) ? App.db.questions : [];
  const total = allQs.length || 98;
  const attempts = App.studentState.attempts || {};

  let answered = 0;
  let l1Correct = 0;
  let l2Correct = 0;
  let l3Correct = 0;
  let earnedWeight = 0;

  allQs.forEach(q => {
    const st = attempts[q.id];
    if (st && st.attempts && st.attempts.length > 0) {
      answered++;
      const eff = parseFloat(st.efficiency) || 0;
      earnedWeight += eff;
      if (eff >= 0.99) l1Correct++;
      else if (eff >= 0.60) l2Correct++;
      else if (eff >= 0.30) l3Correct++;
    }
  });

  const scorePct = total > 0 ? Math.round((earnedWeight / total) * 100) : 0;
  const unanswered = Math.max(0, total - answered);

  return {
    total,
    answered,
    unanswered,
    l1Correct,
    l2Correct,
    l3Correct,
    scorePct,
    timeSpent: "Hoàn tất các Module"
  };
}

function openFinishModal() {
  if (!App.studentState.student_name || !App.studentState.student_email) {
    alert("Vui lòng nhập họ tên và email trước khi nộp bài!");
    initOnboarding();
    return;
  }

  const s = calculateTestSummary();
  DOM.finishStudentName.textContent = App.studentState.student_name;
  DOM.finishStudentEmail.textContent = App.studentState.student_email;
  DOM.noticeStudentEmail.textContent = App.studentState.student_email;

  DOM.statAnswered.textContent = `${s.answered} / ${s.total}`;
  DOM.statScorePct.textContent = `${s.scorePct}%`;
  DOM.statL1Correct.textContent = s.l1Correct;
  DOM.statL2Correct.textContent = s.l2Correct;

  if (s.unanswered > 0) {
    DOM.unansweredAlert.classList.remove("hidden");
    DOM.unansweredCount.textContent = s.unanswered;
  } else {
    DOM.unansweredAlert.classList.add("hidden");
  }

  DOM.modalFinishTest.classList.remove("hidden");
}

// ================= MANDATORY ERROR REFLECTION =================
function checkCanNavigate() {
  const currentQ = App.currentQuestion;
  if (!currentQ) return true;
  const qState = App.studentState.attempts[currentQ.id];
  if (qState && qState.needs_error_log && !qState.error_logged) {
    alert("⚠️ Em cần hoàn thành ghi chép sổ lỗi cho câu này trước khi chuyển sang câu tiếp theo!");
    openMandatoryReflectionModal(currentQ, qState);
    return false;
  }
  return true;
}

function openMandatoryReflectionModal(q, qState) {
  if (!q) q = App.currentQuestion;
  if (!qState) qState = App.studentState.attempts[q.id];
  if (!q || !qState) return;

  DOM.reflQLabel.textContent = `Câu ${q.q_label}`;
  DOM.reflQTopic.textContent = q.topic;
  DOM.reflQModule.textContent = q.module_title;
  DOM.reflCorrectAns.textContent = q.correct_answer;

  const wrongs = (qState.attempts || []).filter(a => a.toUpperCase() !== q.correct_answer.toUpperCase());
  DOM.reflWrongPicks.textContent = wrongs.length > 0
    ? wrongs.map((w, idx) => `Lần ${idx + 1}: [${w}]`).join("  •  ")
    : "Có lần thử trước đó chưa chính xác";

  const hint1 = q.tier1_hint || q.level1_tip || "Đọc kỹ từ khóa, ngữ cảnh và xác định bẫy SAT.";
  const hint2 = q.tier2_hint || q.level2_hint || "";
  DOM.reflHintBox.innerHTML = `<strong>💡 Gợi ý Tầng 1:</strong> ${hint1}${hint2 ? `<br><strong style="margin-top: 6px; display: inline-block;">🔍 Manh mối Tầng 2:</strong> ${hint2}` : ""}`;

  DOM.selectReflTrap.value = "";
  DOM.inputReflDetail.value = "";

  DOM.modalMandatoryReflection.classList.remove("hidden");
}

function saveMandatoryReflection() {
  const q = App.currentQuestion;
  if (!q) return;
  const qState = App.studentState.attempts[q.id];
  if (!qState) return;

  const trap = DOM.selectReflTrap.value;
  const detail = DOM.inputReflDetail.value.trim();

  if (!trap) {
    alert("Vui lòng chọn nhóm bẫy SAT em đã mắc phải!");
    DOM.selectReflTrap.focus();
    return;
  }

  if (!detail || detail.length < 5) {
    alert("Vui lòng nhập phân tích nguyên nhân sai và bài học rút ra (tối thiểu 5 ký tự)!");
    DOM.inputReflDetail.focus();
    return;
  }

  const newLog = {
    id: `err_${q.id}_${Date.now()}`,
    question_id: q.id,
    q_label: q.q_label,
    module: q.module_title,
    skill: q.topic,
    date: new Date().toLocaleDateString("vi-VN"),
    wrong_attempts: (qState.attempts || []).filter(a => a.toUpperCase() !== q.correct_answer.toUpperCase()),
    correct_answer: q.correct_answer,
    root_cause: trap,
    trap_detail: detail,
    socratic_analysis: q.level1_tip || "",
    status: "Đang theo dõi"
  };

  if (!App.studentState.error_logs) App.studentState.error_logs = [];
  App.studentState.error_logs.push(newLog);

  qState.error_logged = true;
  qState.needs_error_log = false;
  App.studentState.attempts[q.id] = qState;

  saveLocalState();
  updateErrorBadge();
  renderErrorLogs();

  DOM.modalMandatoryReflection.classList.add("hidden");

  // Show a brief success alert
  alert("✅ Ghi chép sổ lỗi thành công! Em đã mở khóa và có thể tiếp tục làm câu tiếp theo.");

  // Auto advance to next question
  if (App.currentIndex < App.questions.length - 1) {
    App.currentIndex++;
    renderCurrentQuestion();
  }
}

async function submitTestFinal() {
  const s = calculateTestSummary();
  DOM.btnSubmitTestConfirm.disabled = true;
  DOM.submitSpinner.classList.remove("hidden");
  DOM.btnSubmitText.textContent = "Đang chuẩn bị báo cáo...";

  const payload = {
    student_name: App.studentState.student_name,
    student_email: App.studentState.student_email,
    summary: {
      answered: s.answered,
      total: s.total,
      l1_correct: s.l1Correct,
      l2_correct: s.l2Correct,
      l3_correct: s.l3Correct,
      score_pct: s.scorePct,
      time_spent: s.timeSpent
    },
    attempts: App.studentState.attempts
  };

  try {
    const res = await fetch("/api/submit-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Submission failed");

    // Close finish modal
    DOM.modalFinishTest.classList.add("hidden");

    // Construct Mailto URL
    const teacherEmail = "mikepham358@gmail.com";
    const studentEmail = App.studentState.student_email || "";
    const studentName = App.studentState.student_name || "Học sinh";
    const errCount = (App.studentState.error_logs || []).length;

    const subject = `[Digital SAT Oct 2026] Báo cáo kết quả bài làm: ${studentName} - Điểm: ${s.scorePct}%`;
    const bodyText = `Kính gửi Thầy Mike Pham Bá Hong Son (Google for Education Innovator),

Em xin gửi kết quả bài làm đề thi Digital SAT Real Test October 2026 (INT-B):

- Họ và tên học sinh: ${studentName}
- Email học sinh: ${studentEmail}
- Thời gian nộp bài: ${new Date().toLocaleString("vi-VN")}
- Tổng số câu đã làm: ${s.answered} / ${s.total}
- Hiệu suất điểm toàn bài: ${s.scorePct}%
- Số câu đúng ngay Lần 1 (100%): ${s.l1Correct} câu
- Số câu đúng Lần 2 (66.7%): ${s.l2Correct} câu
- Số câu đúng Lần 3 (33.3%): ${s.l3Correct} câu
- Số lỗi sai đã ghi chép vào sổ lỗi: ${errCount} câu

(File Excel bài làm chi tiết: ${data.filename} đã được tải về thiết bị của em và đính kèm cùng email này).

Em cảm ơn Thầy!`;

    const mailtoUrl = `mailto:${teacherEmail}?cc=${encodeURIComponent(studentEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    App.lastMailtoUrl = mailtoUrl;

    // 1. Download file automatically
    const a = document.createElement("a");
    a.href = data.download_url;
    a.download = data.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    // 2. Launch Mail client on student's personal device
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 600);

    // 3. Populate and show instructional Success Modal
    DOM.successFilename.textContent = data.filename;
    DOM.btnDownloadSubmittedFile.href = data.download_url;
    DOM.btnDownloadSubmittedFile.setAttribute("download", data.filename);
    DOM.modalSubmitSuccess.classList.remove("hidden");
  } catch (err) {
    alert("Có lỗi khi tạo báo cáo: " + err.message);
  } finally {
    DOM.btnSubmitTestConfirm.disabled = false;
    DOM.submitSpinner.classList.add("hidden");
    DOM.btnSubmitText.textContent = "📤 Xác Nhận Hoàn Thành & Gửi Báo Cáo Email";
  }
}

// ================= EXPORT EXCEL (SENDS STUDENT'S LOCALSTORAGE) =================
async function exportExcelPersonalized() {
  const studentName = DOM.inputStudentName.value.trim() || prompt("Nhập họ và tên của em để xuất phiếu làm bài:") || "Hoc_Sinh";
  DOM.inputStudentName.value = studentName;
  App.studentState.student_name = studentName;
  saveLocalState();

  const payload = {
    student_name: studentName,
    attempts: App.studentState.attempts
  };

  try {
    const res = await fetch("/api/export-excel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Export failed");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SAT_October_2026_${studentName.replace(/\s+/g, '_')}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (e) {
    alert("Có lỗi khi xuất file Excel. Vui lòng kiểm tra lại kết nối máy chủ.");
  }
}

// ================= SCRATCHPAD CANVAS =================
function initScratchpad() {
  const canvas = DOM.scratchpadCanvas;
  const ctx = canvas.getContext("2d");
  let drawing = false;
  let currentColor = "#0f172a";

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight - 40;
  }
  window.addEventListener("resize", resize);
  setTimeout(resize, 200);

  canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });

  window.addEventListener("mouseup", () => { drawing = false; });

  DOM.colorButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      DOM.colorButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentColor = btn.dataset.color;
    });
  });

  DOM.btnScratchClear.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  DOM.btnScratchClose.addEventListener("click", () => {
    DOM.scratchpadDrawer.classList.add("hidden");
  });

  DOM.btnToggleScratchpad.addEventListener("click", () => {
    DOM.scratchpadDrawer.classList.toggle("hidden");
    if (!DOM.scratchpadDrawer.classList.contains("hidden")) resize();
  });
}

// ================= SPLIT RESIZER & THEME =================
function initSplitResizer() {
  const savedWidth = localStorage.getItem("bluebook_split_width") || "50%";
  DOM.panePdf.style.width = savedWidth;

  let isDragging = false;
  DOM.splitDivider.addEventListener("mousedown", (e) => {
    isDragging = true;
    DOM.splitDivider.classList.add("dragging");
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const containerRect = DOM.splitContainer.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;
    const totalWidth = containerRect.width;
    if (newWidth >= 300 && newWidth <= totalWidth - 360) {
      const pct = (newWidth / totalWidth * 100).toFixed(1) + "%";
      DOM.panePdf.style.width = pct;
      localStorage.setItem("bluebook_split_width", pct);
    }
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      DOM.splitDivider.classList.remove("dragging");
    }
  });
}

function initTheme() {
  DOM.btnThemeToggle.addEventListener("click", () => {
    document.body.classList.toggle("theme-slate");
  });
}

// ================= EVENT LISTENERS =================
function setupEventListeners() {
  // Module Change
  DOM.selectModule.addEventListener("change", (e) => {
    if (!checkCanNavigate()) {
      DOM.selectModule.value = App.activeModuleCode;
      return;
    }
    App.activeModuleCode = e.target.value;
    App.studentState.active_module = e.target.value;
    saveLocalState();
    setupModuleQuestions();
    startModuleTimer();
  });

  // Student Name input
  DOM.inputStudentName.addEventListener("input", (e) => {
    App.studentState.student_name = e.target.value;
    saveLocalState();
  });

  // Mark for review toggle
  DOM.chkMarkReview.addEventListener("change", (e) => {
    const q = App.currentQuestion;
    if (!q) return;
    const qState = App.studentState.attempts[q.id] || { attempts: [], status: "unanswered", efficiency: 0.0 };
    qState.marked = e.target.checked;
    App.studentState.attempts[q.id] = qState;
    saveLocalState();
    DOM.markReviewLabel.classList.toggle("marked", e.target.checked);
  });

  // Eliminator mode toggle [ABC]
  DOM.btnToggleEliminator.addEventListener("click", () => {
    App.eliminatorMode = !App.eliminatorMode;
    DOM.btnToggleEliminator.classList.toggle("active", App.eliminatorMode);
    document.body.classList.toggle("eliminator-mode-active", App.eliminatorMode);
  });

  // Check Answer
  DOM.btnCheckAnswer.addEventListener("click", checkAnswer);

  // Grid-in input change
  DOM.gridinInput.addEventListener("input", () => {
    DOM.btnCheckAnswer.disabled = (DOM.gridinInput.value.trim() === "");
  });
  DOM.gridinInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !DOM.btnCheckAnswer.disabled) {
      checkAnswer();
    }
  });

  // Navigation Dock
  DOM.btnNavBack.addEventListener("click", () => {
    if (!checkCanNavigate()) return;
    if (App.currentIndex > 0) {
      App.currentIndex--;
      renderCurrentQuestion();
    }
  });

  DOM.btnNavNext.addEventListener("click", () => {
    if (!checkCanNavigate()) return;
    if (App.currentIndex < App.questions.length - 1) {
      App.currentIndex++;
      renderCurrentQuestion();
    }
  });

  // Question Navigator Modal
  DOM.btnOpenNavigator.addEventListener("click", () => {
    renderNavigatorTiles();
    DOM.navigatorOverlay.classList.remove("hidden");
  });
  DOM.btnCloseNavigator.addEventListener("click", () => DOM.navigatorOverlay.classList.add("hidden"));
  DOM.navigatorOverlay.addEventListener("click", (e) => {
    if (e.target === DOM.navigatorOverlay) DOM.navigatorOverlay.classList.add("hidden");
  });

  // Timer Controls
  DOM.btnTimerToggleView.addEventListener("click", () => {
    App.timerHidden = !App.timerHidden;
    DOM.timerDisplay.classList.toggle("hidden-time", App.timerHidden);
    DOM.btnTimerToggleView.textContent = App.timerHidden ? "Show" : "Hide";
  });

  DOM.btnTimerPause.addEventListener("click", () => {
    App.timerRunning = !App.timerRunning;
    DOM.btnTimerPause.textContent = App.timerRunning ? "⏸️" : "▶️";
  });

  // Modals
  DOM.btnOpenCalc.addEventListener("click", () => DOM.modalCalculator.classList.toggle("hidden"));
  DOM.btnCloseCalculator.addEventListener("click", () => DOM.modalCalculator.classList.add("hidden"));

  DOM.btnOpenRef.addEventListener("click", () => DOM.modalReference.classList.remove("hidden"));
  DOM.btnCloseReference.addEventListener("click", () => DOM.modalReference.classList.add("hidden"));

  DOM.btnOpenErrorLog.addEventListener("click", () => {
    renderErrorLogs();
    DOM.modalErrorLog.classList.remove("hidden");
  });
  DOM.btnCloseErrorLog.addEventListener("click", () => DOM.modalErrorLog.classList.add("hidden"));

  DOM.btnAddNewError.addEventListener("click", () => {
    const q = App.currentQuestion;
    if (!q) return;
    const desc = prompt("Mô tả bẫy hoặc lỗi sai em vừa gặp:", `Câu ${q.q_label} (${q.topic})`);
    if (desc) {
      App.studentState.error_logs.push({
        id: `err_${Date.now()}`,
        module: q.module_title,
        skill: q.topic,
        root_cause: "Bẫy SAT Trap",
        trap_detail: desc,
        socratic_analysis: q.level1_tip || "Đọc kỹ đề bài.",
        status: "Chưa xử lý"
      });
      saveLocalState();
      updateErrorBadge();
      renderErrorLogs();
    }
  });

  DOM.selectFilterErrStatus.addEventListener("change", renderErrorLogs);

  DOM.btnOpenStrategies.addEventListener("click", () => {
    renderStrategiesModal();
    DOM.modalStrategies.classList.remove("hidden");
  });
  DOM.btnCloseStrategies.addEventListener("click", () => DOM.modalStrategies.classList.add("hidden"));

  // Home Button
  if (DOM.btnHome) {
    DOM.btnHome.addEventListener("click", handleHomeClick);
  }

  // Reset Test Controls
  if (DOM.btnResetTest) {
    DOM.btnResetTest.addEventListener("click", () => DOM.modalResetConfirm.classList.remove("hidden"));
  }
  if (DOM.btnCancelReset) {
    DOM.btnCancelReset.addEventListener("click", () => DOM.modalResetConfirm.classList.add("hidden"));
  }
  if (DOM.btnConfirmDoReset) {
    DOM.btnConfirmDoReset.addEventListener("click", handleResetConfirm);
  }

  // Export Excel
  DOM.btnExportExcel.addEventListener("click", exportExcelPersonalized);

  // Finish Test Controls
  DOM.btnFinishTest.addEventListener("click", openFinishModal);
  DOM.btnCloseFinish.addEventListener("click", () => DOM.modalFinishTest.classList.add("hidden"));
  DOM.btnCancelFinish.addEventListener("click", () => DOM.modalFinishTest.classList.add("hidden"));
  DOM.btnSubmitTestConfirm.addEventListener("click", submitTestFinal);
  DOM.btnDownloadExcelDirect.addEventListener("click", exportExcelPersonalized);

  // Success Modal Controls
  DOM.btnCloseSuccess.addEventListener("click", () => DOM.modalSubmitSuccess.classList.add("hidden"));
  if (DOM.btnRelaunchMail) {
    DOM.btnRelaunchMail.addEventListener("click", () => {
      if (App.lastMailtoUrl) window.location.href = App.lastMailtoUrl;
    });
  }

  // Mandatory Error Reflection Modal Controls
  if (DOM.btnSaveMandatoryReflection) {
    DOM.btnSaveMandatoryReflection.addEventListener("click", saveMandatoryReflection);
  }

  // PDF Mode Switcher
  DOM.btnModeDrive.addEventListener("click", () => setPdfViewerMode("drive"));
  DOM.btnModeLocal.addEventListener("click", () => setPdfViewerMode("local"));

  // PDF Controls
  if (DOM.btnPdfPrev) DOM.btnPdfPrev.addEventListener("click", () => navigatePdf(parseInt(DOM.inputPdfPage.value) - 1));
  if (DOM.btnPdfNext) DOM.btnPdfNext.addEventListener("click", () => navigatePdf(parseInt(DOM.inputPdfPage.value) + 1));
  if (DOM.inputPdfPage) DOM.inputPdfPage.addEventListener("change", (e) => navigatePdf(e.target.value));

  DOM.btnPdfExternal.addEventListener("click", () => {
    if (App.pdfViewerMode === "local") {
      window.open(`/pdf#page=${DOM.inputPdfPage.value}`, '_blank');
    } else {
      window.open(DRIVE_VIEW_URL, '_blank');
    }
  });

  // Excerpt Accordion
  DOM.excerptHeader.addEventListener("click", () => {
    DOM.excerptBody.classList.toggle("collapsed");
    DOM.excerptToggleIcon.textContent = DOM.excerptBody.classList.contains("collapsed") ? "▼" : "▲";
  });

  // Hints Accordion
  DOM.hintHead1.addEventListener("click", () => DOM.hintContent1.classList.toggle("collapsed"));
  DOM.hintHead2.addEventListener("click", () => DOM.hintContent2.classList.toggle("collapsed"));
  DOM.hintHead3.addEventListener("click", () => DOM.hintContent3.classList.toggle("collapsed"));
  if (DOM.hintHead4) DOM.hintHead4.addEventListener("click", () => DOM.hintContent4.classList.toggle("collapsed"));

  // --- Google Material UX Home Page Listeners ---
  if (DOM.btnHeroEnterTest) {
    DOM.btnHeroEnterTest.addEventListener("click", () => startPracticeFromHome());
  }
  if (DOM.btnHomeStartPractice) {
    DOM.btnHomeStartPractice.addEventListener("click", () => startPracticeFromHome());
  }
  if (DOM.homeUserChip) {
    DOM.homeUserChip.addEventListener("click", () => {
      if (DOM.homeInputName) DOM.homeInputName.focus();
    });
  }

  // Target score chips selection
  if (DOM.targetChipsContainer) {
    DOM.targetChipsContainer.addEventListener("click", (e) => {
      const chip = e.target.closest(".target-chip");
      if (!chip) return;
      DOM.targetChipsContainer.querySelectorAll(".target-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      App.studentState.student_target = chip.getAttribute("data-val");
      saveLocalState();
    });
  }

  // Home Form inputs real-time sync
  if (DOM.homeInputName) {
    DOM.homeInputName.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      App.studentState.student_name = val;
      if (DOM.homeStudentNameChip) {
        DOM.homeStudentNameChip.textContent = val || "Chưa đăng ký";
      }
      if (DOM.headerStudentName) {
        DOM.headerStudentName.textContent = val || "Học sinh";
      }
      saveLocalState();
    });
  }
  if (DOM.homeInputEmail) {
    DOM.homeInputEmail.addEventListener("input", (e) => {
      App.studentState.student_email = e.target.value.trim();
      saveLocalState();
    });
  }

  // View Guide button
  if (DOM.btnHomeViewGuide) {
    DOM.btnHomeViewGuide.addEventListener("click", () => {
      const name = App.studentState.student_name || (DOM.homeInputName ? DOM.homeInputName.value.trim() : "") || "Học sinh";
      const email = App.studentState.student_email || (DOM.homeInputEmail ? DOM.homeInputEmail.value.trim() : "") || "Chưa có email";
      if (DOM.obPreviewName) DOM.obPreviewName.textContent = name;
      if (DOM.obPreviewEmail) DOM.obPreviewEmail.textContent = email;
      if (DOM.modalOnboarding) {
        DOM.modalOnboarding.classList.remove("hidden");
        DOM.modalOnboarding.style.display = "flex";
      }
    });
  }

  // 4 Module Cards & Jump Buttons
  document.querySelectorAll(".module-card").forEach(card => {
    card.addEventListener("click", (e) => {
      const modCode = card.getAttribute("data-module");
      if (modCode) {
        startPracticeFromHome(modCode);
      }
    });
  });

  // Keyboard Shortcuts
  window.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;

    const key = e.key.toUpperCase();
    if (["A", "B", "C", "D"].includes(key) || ["1", "2", "3", "4"].includes(key)) {
      const optKey = ["1", "2", "3", "4"].includes(key) ? ["A", "B", "C", "D"][parseInt(key) - 1] : key;
      const row = document.querySelector(`.option-row[data-key="${optKey}"]`);
      if (row && !row.classList.contains("eliminated")) {
        row.click();
      }
    } else if (e.key === "Enter") {
      if (!DOM.btnCheckAnswer.disabled) {
        checkAnswer();
      }
    } else if (e.key === "[" || e.key === "ArrowLeft") {
      DOM.btnNavBack.click();
    } else if (e.key === "]" || e.key === "ArrowRight") {
      DOM.btnNavNext.click();
    }
  });
}
