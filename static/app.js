/**
 * Digital SAT Practice Based on Learning Science — October 2026 (INT-B)
 * Designed by Mike Pham Bá Hong Son - Google for Education Innovator
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
  manualPause: false,  // Student clicked pause button manually
  timerHidden: false,
  pdfViewerMode: "drive", // Standard Google Drive viewer
  notebookFilterStatus: "all",
  notebookSearchQuery: "",
  editingLogId: null,

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

  // Split & PDF
  splitContainer: document.getElementById("split-container"),
  panePdf: document.getElementById("pane-pdf"),
  splitDivider: document.getElementById("split-divider"),
  pdfFrame: document.getElementById("pdf-frame"),
  pdfPageBadge: document.getElementById("pdf-page-badge"),
  pdfSyncPageNum: document.getElementById("pdf-sync-page-num"),
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

  // Socratic Error & Vocabulary Notebook
  modalErrorLog: document.getElementById("modal-error-log"),
  btnCloseErrorLog: document.getElementById("btn-close-error-log"),
  btnAddNewError: document.getElementById("btn-add-new-error"),
  errorLogList: document.getElementById("error-log-list"),
  inputFilterErrSearch: document.getElementById("input-filter-err-search"),
  btnClearErrSearch: document.getElementById("btn-clear-err-search"),
  badgeNotebookCount: document.getElementById("badge-notebook-count"),
  notebookFilterChips: document.getElementById("notebook-filter-chips"),
  countChipAll: document.getElementById("count-chip-all"),
  countChipPending: document.getElementById("count-chip-pending"),
  countChipTracking: document.getElementById("count-chip-tracking"),
  countChipResolved: document.getElementById("count-chip-resolved"),
  notebookAddPanel: document.getElementById("notebook-add-panel"),
  addPanelQBadge: document.getElementById("add-panel-q-badge"),
  selectNewTrap: document.getElementById("select-new-trap"),
  selectNewStatus: document.getElementById("select-new-status"),
  inputNewDetail: document.getElementById("input-new-detail"),
  inputNewNotes: document.getElementById("input-new-notes"),
  inputNewVocab: document.getElementById("input-new-vocab"),
  btnSaveNewError: document.getElementById("btn-save-new-error"),
  btnCancelAddError: document.getElementById("btn-cancel-add-error"),

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
  inputReflNotes: document.getElementById("input-refl-notes"),
  inputReflVocab: document.getElementById("input-refl-vocab"),
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
    pauseTimer();
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
    resumeTimer();
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
    let data = null;
    // 1. Try local/relative database.json (Works seamlessly on GitHub Pages & static hosting)
    try {
      const res = await fetch("database.json");
      if (res.ok) data = await res.json();
    } catch (err) {}

    // 2. Fallback to /api/data endpoint if running via Python server
    if (!data) {
      try {
        const res = await fetch("/api/data");
        if (res.ok) data = await res.json();
      } catch (err) {}
    }

    if (data) {
      App.db = data;
    }
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

// ================= TIMER CONTROLS & AUTO-PAUSE LOGIC =================
function pauseTimer() {
  App.timerRunning = false;
  if (DOM.btnTimerPause) {
    DOM.btnTimerPause.textContent = "▶️";
    DOM.btnTimerPause.title = "Tiếp tục tính giờ";
  }
  if (DOM.timerDisplay) {
    DOM.timerDisplay.classList.add("timer-paused");
  }
}

function resumeTimer() {
  if (App.manualPause) return; // Respect student's manual pause
  App.timerRunning = true;
  if (DOM.btnTimerPause) {
    DOM.btnTimerPause.textContent = "⏸️";
    DOM.btnTimerPause.title = "Tạm dừng";
  }
  if (DOM.timerDisplay) {
    DOM.timerDisplay.classList.remove("timer-paused");
  }
}

function shouldTimerRun() {
  if (App.manualPause) return false;

  // 1. Must be in practice view
  if (!DOM.viewPractice || DOM.viewPractice.classList.contains("hidden")) return false;

  // 2. Modals that suspend active practice (error notes, review, calculators, strategies, etc.)
  if (DOM.modalMandatoryReflection && !DOM.modalMandatoryReflection.classList.contains("hidden")) return false;
  if (DOM.modalErrorLog && !DOM.modalErrorLog.classList.contains("hidden")) return false;
  if (DOM.navigatorOverlay && !DOM.navigatorOverlay.classList.contains("hidden")) return false;
  if (DOM.modalCalculator && !DOM.modalCalculator.classList.contains("hidden")) return false;
  if (DOM.modalReference && !DOM.modalReference.classList.contains("hidden")) return false;
  if (DOM.modalStrategies && !DOM.modalStrategies.classList.contains("hidden")) return false;
  if (DOM.modalFinishTest && !DOM.modalFinishTest.classList.contains("hidden")) return false;
  if (DOM.modalSubmitSuccess && !DOM.modalSubmitSuccess.classList.contains("hidden")) return false;

  // 3. Question status check:
  // If the current question is already completed or just evaluated for review, pause the timer!
  const currentQ = App.currentQuestion || (App.questions ? App.questions[App.currentIndex] : null);
  if (!currentQ) return false;

  const qState = App.studentState.attempts[currentQ.id];
  if (qState) {
    const isFinished = (qState.status && (qState.status.startsWith("mastered") || qState.status === "missed"));
    if (isFinished) return false;
    if (qState.justChecked) return false;
  }

  return true;
}

function syncTimerState() {
  if (shouldTimerRun()) {
    resumeTimer();
  } else {
    pauseTimer();
  }
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
        pauseTimer();
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

  // Auto-sync timer based on practice vs review mode
  syncTimerState();
}

function renderOptions(q, qState) {
  DOM.optionsContainer.innerHTML = "";
  const isFinished = (qState.status.startsWith("mastered") || qState.status === "missed");
  const eliminated = qState.eliminated || [];

  const defaultKeys = ["A", "B", "C", "D"];
  const opts = defaultKeys.map(k => ({ key: k, text: `Lựa chọn ${k}` }));

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
      <div class="option-text-wrap font-medium">Lựa chọn ${opt.key}</div>
      <button class="btn-strike-option" title="Gạch bỏ phương án này">⨉</button>
    `;

    // Click option to select
    row.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-strike-option")) return;
      if (isFinished) return;
      if (row.classList.contains("eliminated")) return;

      if (qState.justChecked) {
        qState.justChecked = false;
        saveLocalState();
        syncTimerState();
      }

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

  // Pause timer so student can review explanations, hints, or record reflection without penalty
  pauseTimer();

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
      if (idx !== App.currentIndex) {
        App.currentIndex = idx;
        renderCurrentQuestion();
      }
      DOM.navigatorOverlay.classList.add("hidden");
    });

    DOM.navTilesGrid.appendChild(tile);
  });
}

// ================= PDF NAVIGATION (GOOGLE DRIVE OFFICIAL) =================
function navigatePdf(page, zoom = null) {
  const p = Math.max(1, Math.min(44, parseInt(page) || 1));
  if (DOM.pdfSyncPageNum) DOM.pdfSyncPageNum.textContent = p;
}

// ================= ERROR LOG & NOTEBOOK UTILS =================
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatVocabHtml(vocabText) {
  if (!vocabText) return "";
  const lines = vocabText.split(/[\n;]+/).map(s => s.trim()).filter(Boolean);
  if (lines.length > 1) {
    return `<div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">` +
      lines.map(line => {
        const parts = line.split(/[:=–-]/);
        if (parts.length >= 2) {
          const word = parts[0].trim();
          const def = parts.slice(1).join("=").trim();
          return `<div><span class="vocab-tag-highlight">${escapeHtml(word)}</span>: ${escapeHtml(def)}</div>`;
        }
        return `<div>• ${escapeHtml(line)}</div>`;
      }).join("") + `</div>`;
  }
  return `<span>${escapeHtml(vocabText)}</span>`;
}

function updateErrorBadge() {
  const unres = (App.studentState.error_logs || []).filter(l => l.status !== "Đã triệt tiêu").length;
  if (DOM.badgeErrorCount) DOM.badgeErrorCount.textContent = unres;
}

function renderErrorLogs() {
  const list = App.studentState.error_logs || [];
  const total = list.length;
  const pending = list.filter(l => l.status === "Chưa xử lý").length;
  const tracking = list.filter(l => l.status === "Đang theo dõi").length;
  const resolved = list.filter(l => l.status === "Đã triệt tiêu").length;
  const vocabCount = list.filter(l => l.vocabulary && l.vocabulary.trim()).length;

  if (DOM.countChipAll) DOM.countChipAll.textContent = total;
  if (DOM.countChipPending) DOM.countChipPending.textContent = pending;
  if (DOM.countChipTracking) DOM.countChipTracking.textContent = tracking;
  if (DOM.countChipResolved) DOM.countChipResolved.textContent = resolved;
  if (DOM.badgeNotebookCount) {
    DOM.badgeNotebookCount.textContent = `${total} ghi chép • ${vocabCount} từ mới`;
  }

  DOM.errorLogList.innerHTML = "";

  const qLower = (App.notebookSearchQuery || "").toLowerCase();
  const filtered = list.filter(item => {
    const matchStatus = (App.notebookFilterStatus === "all" || item.status === App.notebookFilterStatus);
    if (!matchStatus) return false;
    if (!qLower) return true;
    const searchTarget = [
      item.q_label,
      item.question_id,
      item.module,
      item.skill,
      item.root_cause,
      item.trap_detail,
      item.student_notes,
      item.vocabulary
    ].filter(Boolean).join(" ").toLowerCase();
    return searchTarget.includes(qLower);
  });

  if (filtered.length === 0) {
    DOM.errorLogList.innerHTML = `
      <div style="text-align: center; padding: 36px 16px; color: #5f6368;">
        <div style="font-size: 32px; margin-bottom: 8px;">📭</div>
        <div style="font-weight: 600; font-size: 14px; color: #202124;">Không tìm thấy ghi chép nào</div>
        <div style="font-size: 12.5px; margin-top: 4px;">
          ${qLower ? `Không có kết quả khớp với từ khóa "${escapeHtml(qLower)}".` : `Em chưa có ghi chép lỗi sai hoặc từ vựng nào trong mục này.`}
        </div>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    if (App.editingLogId === item.id) {
      // INLINE EDIT FORM (Google Material 3)
      const editCard = document.createElement("div");
      editCard.className = "g-inline-edit";
      editCard.innerHTML = `
        <div style="font-size: 13px; font-weight: 700; color: #1a73e8; margin-bottom: 10px;">
          ✏️ Đang chỉnh sửa: ${escapeHtml(item.module || "SAT")} • Câu ${escapeHtml(item.q_label || item.question_id || "")}
        </div>
        <div class="inline-edit-grid">
          <div>
            <label>Tình trạng xử lý:</label>
            <select class="g-select edit-status">
              <option value="Chưa xử lý" ${item.status === "Chưa xử lý" ? "selected" : ""}>⏳ Chưa xử lý</option>
              <option value="Đang theo dõi" ${item.status === "Đang theo dõi" ? "selected" : ""}>🔄 Đang theo dõi</option>
              <option value="Đã triệt tiêu" ${item.status === "Đã triệt tiêu" ? "selected" : ""}>✅ Đã triệt tiêu</option>
            </select>
          </div>
          <div>
            <label>Nhóm bẫy SAT:</label>
            <select class="g-select edit-trap">
              <option value="Bẫy từ vựng & Nghĩa trong ngữ cảnh (Context Clues)" ${item.root_cause?.includes("từ vựng") ? "selected" : ""}>📖 Bẫy từ vựng & Nghĩa trong ngữ cảnh (Context Clues)</option>
              <option value="Bẫy đảo cực & Từ tuyệt đối (Extreme Words: always, never, only...)" ${item.root_cause?.includes("đảo cực") ? "selected" : ""}>⚠️ Bẫy đảo cực & Từ tuyệt đối (Extreme Words: always, never, only...)</option>
              <option value="Bẫy tương phản giả & Cụm nối (However, Although, But...)" ${item.root_cause?.includes("tương phản") ? "selected" : ""}>⚡ Bẫy tương phản giả & Cụm nối (However, Although, But...)</option>
              <option value="Bẫy suy diễn quá xa / Lạc đề (Out of Scope / Assumption)" ${item.root_cause?.includes("suy diễn") ? "selected" : ""}>🔍 Bẫy suy diễn quá xa / Lạc đề (Out of Scope / Assumption)</option>
              <option value="Bẫy đọc lướt sót từ khóa quan trọng (Careless Reading)" ${item.root_cause?.includes("đọc lướt") ? "selected" : ""}>👀 Bẫy đọc lướt sót từ khóa quan trọng (Careless Reading)</option>
              <option value="Bẫy đại số / Đổi dấu / Chuyển vế nhầm (Algebra / Sign Trap)" ${item.root_cause?.includes("đại số") ? "selected" : ""}>🧮 Bẫy đại số / Đổi dấu / Chuyển vế nhầm (Algebra / Sign Trap)</option>
              <option value="Bẫy đọc nhầm câu hỏi (Đề hỏi y nhưng giải ra x)" ${item.root_cause?.includes("nhầm câu hỏi") ? "selected" : ""}>🎯 Bẫy đọc nhầm câu hỏi (Đề hỏi y nhưng giải ra x)</option>
              <option value="Bẫy làm tròn số / Phân số / Đơn vị đo (Fractions / Units)" ${item.root_cause?.includes("làm tròn") ? "selected" : ""}>📏 Bẫy làm tròn số / Phân số / Đơn vị đo (Fractions / Units)</option>
              <option value="Chưa nắm chắc công thức / lý thuyết cốt lõi" ${item.root_cause?.includes("công thức") ? "selected" : ""}>📚 Chưa nắm chắc công thức / lý thuyết cốt lõi</option>
              <option value="Khác" ${item.root_cause === "Khác" ? "selected" : ""}>💡 Bẫy khác...</option>
            </select>
          </div>
          <div class="full-width">
            <label>Phân tích nguyên nhân sai & Bài học rút ra:</label>
            <textarea class="g-textarea edit-detail" rows="2">${escapeHtml(item.trap_detail || "")}</textarea>
          </div>
          <div class="full-width">
            <label>📝 Ghi chú tư duy cá nhân (Mẹo nhớ nhanh):</label>
            <textarea class="g-textarea edit-notes" rows="2" placeholder="Ví dụ: Quy tắc gạch chân từ khóa, cách giải nhanh...">${escapeHtml(item.student_notes || "")}</textarea>
          </div>
          <div class="full-width">
            <label>📖 Từ mới & Thuật ngữ tiếng Anh:</label>
            <textarea class="g-textarea edit-vocab" rows="2" placeholder="Ví dụ: repudiate = bác bỏ; ephemeral = ngắn ngủi...">${escapeHtml(item.vocabulary || "")}</textarea>
          </div>
        </div>
        <div class="inline-edit-actions">
          <button class="btn-subtle btn-cancel-edit">✕ Hủy</button>
          <button class="btn-primary-g btn-save-edit">💾 Lưu thay đổi</button>
        </div>
      `;

      editCard.querySelector(".btn-cancel-edit").addEventListener("click", () => {
        App.editingLogId = null;
        renderErrorLogs();
      });

      editCard.querySelector(".btn-save-edit").addEventListener("click", () => {
        const newDetail = editCard.querySelector(".edit-detail").value.trim();
        if (!newDetail) {
          alert("Vui lòng không để trống phần phân tích lỗi sai!");
          return;
        }
        item.status = editCard.querySelector(".edit-status").value;
        item.root_cause = editCard.querySelector(".edit-trap").value;
        item.trap_detail = newDetail;
        item.student_notes = editCard.querySelector(".edit-notes").value.trim();
        item.vocabulary = editCard.querySelector(".edit-vocab").value.trim();

        saveLocalState();
        App.editingLogId = null;
        updateErrorBadge();
        renderErrorLogs();
      });

      DOM.errorLogList.appendChild(editCard);
      return;
    }

    // READ CARD (Material 3 Minimalist)
    const card = document.createElement("div");
    card.className = "g-notebook-card";

    let statusClass = "status-tracking";
    let statusText = "🔄 Đang theo dõi";
    if (item.status === "Chưa xử lý") {
      statusClass = "status-pending";
      statusText = "⏳ Chưa xử lý";
    } else if (item.status === "Đã triệt tiêu") {
      statusClass = "status-resolved";
      statusText = "✅ Đã triệt tiêu";
    }

    const notesHtml = item.student_notes ? `
      <div class="card-notes-box">
        <strong>📝 Ghi chú tư duy:</strong> ${escapeHtml(item.student_notes)}
      </div>
    ` : "";

    const vocabHtml = item.vocabulary ? `
      <div class="card-vocab-box">
        <strong>📖 Từ mới / Thuật ngữ:</strong>
        ${formatVocabHtml(item.vocabulary)}
      </div>
    ` : "";

    const quickToggleBtn = (item.status === "Đã triệt tiêu") ?
      `<button class="btn-quick-toggle-status" title="Chuyển về trạng thái đang theo dõi">🔄 Đưa về theo dõi</button>` :
      `<button class="btn-quick-toggle-status" title="Đánh dấu em đã nắm vững lỗi này">✅ Đã triệt tiêu lỗi</button>`;

    card.innerHTML = `
      <div class="card-top-row">
        <div class="card-top-left">
          <span class="card-q-tag">📘 ${escapeHtml(item.module || "SAT")} • Câu ${escapeHtml(item.q_label || item.question_id || "")}</span>
          <span class="card-status-badge ${statusClass}">${statusText}</span>
        </div>
        <div class="card-top-right">
          <button class="btn-card-action btn-edit-card" title="Chỉnh sửa ghi chép này">✏️ Sửa</button>
          <button class="btn-card-action btn-del-card" title="Xóa ghi chép này">✕</button>
        </div>
      </div>

      <div class="card-trap-content">
        <span class="card-trap-tag">${escapeHtml(item.root_cause || "Bẫy SAT")}</span>
        <span>${escapeHtml(item.trap_detail || "")}</span>
      </div>

      ${notesHtml}
      ${vocabHtml}

      <div class="card-footer">
        <span>🕒 ${escapeHtml(item.date || "Ghi chép")} ${item.skill ? `• ${escapeHtml(item.skill)}` : ""}</span>
        <div>${quickToggleBtn}</div>
      </div>
    `;

    // Edit button
    card.querySelector(".btn-edit-card").addEventListener("click", () => {
      App.editingLogId = item.id;
      renderErrorLogs();
    });

    // Delete button
    card.querySelector(".btn-del-card").addEventListener("click", () => {
      if (confirm(`Em có chắc chắn muốn xóa ghi chép lỗi câu ${item.q_label || item.question_id} này không?`)) {
        App.studentState.error_logs = App.studentState.error_logs.filter(x => x.id !== item.id);
        saveLocalState();
        updateErrorBadge();
        renderErrorLogs();
      }
    });

    // Quick status toggle
    const toggleBtn = card.querySelector(".btn-quick-toggle-status");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        item.status = (item.status === "Đã triệt tiêu") ? "Đang theo dõi" : "Đã triệt tiêu";
        saveLocalState();
        updateErrorBadge();
        renderErrorLogs();
      });
    }

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
  // Always pause timer during error notebook reflection
  pauseTimer();

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
  if (DOM.inputReflNotes) DOM.inputReflNotes.value = "";
  if (DOM.inputReflVocab) DOM.inputReflVocab.value = "";

  DOM.modalMandatoryReflection.classList.remove("hidden");
}

function saveMandatoryReflection() {
  const q = App.currentQuestion;
  if (!q) return;
  const qState = App.studentState.attempts[q.id];
  if (!qState) return;

  const trap = DOM.selectReflTrap.value;
  const detail = DOM.inputReflDetail.value.trim();
  const notes = DOM.inputReflNotes ? DOM.inputReflNotes.value.trim() : "";
  const vocab = DOM.inputReflVocab ? DOM.inputReflVocab.value.trim() : "";

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
    student_notes: notes,
    vocabulary: vocab,
    socratic_analysis: q.level1_tip || "",
    status: "Đang theo dõi"
  };

  if (!App.studentState.error_logs) App.studentState.error_logs = [];
  App.studentState.error_logs.unshift(newLog);

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
  } else {
    syncTimerState();
  }
}

// ================= CLIENT-SIDE EXCEL GENERATOR (MATCHES MASTER TEMPLATE - OCTOBER 2026) =================
async function generateClientExcelBlob(studentName, summary) {
  if (typeof XLSX === "undefined") return null;

  try {
    let wb = null;
    // 1. Try to load the master template.xlsx
    try {
      const res = await fetch("template.xlsx");
      if (res.ok) {
        const ab = await res.arrayBuffer();
        wb = XLSX.read(ab, { type: "array", cellStyles: true });
      }
    } catch (e) {
      console.warn("Could not fetch template.xlsx:", e);
    }

    if (wb && wb.SheetNames && wb.SheetNames.includes("RW_Module1")) {
      const attempts = App.studentState.attempts || {};
      const questions = (App.db && App.db.questions) ? App.db.questions : (App.questions || []);

      // 1. Populate Overview_Strategies with Tong_Quan structure
      if (wb.Sheets["Overview_Strategies"]) {
        const wsOv = wb.Sheets["Overview_Strategies"];
        wsOv["A1"] = { t: "s", v: "BÁO CÁO KẾT QUẢ DIGITAL SAT BLUEBOOK" };
        wsOv["A2"] = { t: "s", v: "Đề thi" };
        wsOv["B2"] = { t: "s", v: App.db ? App.db.test_title : "Digital SAT Practice Test — October 2026 (INT-B)" };
        wsOv["A3"] = { t: "s", v: "Học sinh" };
        wsOv["B3"] = { t: "s", v: studentName };
        wsOv["A4"] = { t: "s", v: "Email học sinh" };
        wsOv["B4"] = { t: "s", v: App.studentState.student_email || "Chưa cung cấp" };
        wsOv["A5"] = { t: "s", v: "Mục tiêu điểm" };
        wsOv["B5"] = { t: "s", v: App.studentState.student_target || "1400+" };
        wsOv["A6"] = { t: "s", v: "Thời gian nộp" };
        wsOv["B6"] = { t: "s", v: new Date().toLocaleString("vi-VN") };
        wsOv["A7"] = { t: "s", v: "Giáo viên phụ trách" };
        wsOv["B7"] = { t: "s", v: "Mike Pham Bá Hong Son (Google for Education Innovator: https://edudirectory.withgoogle.com/profiles/5087615831769088) - mikepham358@gmail.com" };
        wsOv["A8"] = { t: "s", v: "Nguồn tài liệu" };
        wsOv["B8"] = { t: "s", v: "Tham khảo từ hocsat.com" };

        wsOv["A10"] = { t: "s", v: "BẢNG TỔNG KẾT ĐIỂM SỐ" };
        wsOv["A11"] = { t: "s", v: "Tổng số câu" };
        wsOv["B11"] = { t: "n", v: summary ? summary.total : 98 };
        wsOv["A12"] = { t: "s", v: "Số câu đã làm" };
        wsOv["B12"] = { t: "n", v: summary ? summary.answered : 0 };
        wsOv["A13"] = { t: "s", v: "Số câu đúng Lần 1 (100%)" };
        wsOv["B13"] = { t: "n", v: summary ? summary.l1Correct : 0 };
        wsOv["A14"] = { t: "s", v: "Số câu đúng Lần 2 (66.7%)" };
        wsOv["B14"] = { t: "n", v: summary ? summary.l2Correct : 0 };
        wsOv["A15"] = { t: "s", v: "Số câu đúng Lần 3 (33.3%)" };
        wsOv["B15"] = { t: "n", v: summary ? summary.l3Correct : 0 };
        wsOv["A16"] = { t: "s", v: "Hiệu suất điểm" };
        wsOv["B16"] = { t: "s", v: summary ? `${summary.scorePct}%` : "0%" };
        wsOv["A17"] = { t: "s", v: "Điểm ước tính" };
        wsOv["B17"] = { t: "s", v: `${summary ? (summary.estimatedScore || Math.round(400 + (summary.scorePct / 100) * 1200)) : 400} / 1600` };
        wsOv["A18"] = { t: "s", v: "Số lỗi ghi sổ" };
        wsOv["B18"] = { t: "n", v: (App.studentState.error_logs || []).length };
      }

      // 2. Personalize Performance_Summary header
      if (wb.Sheets["Performance_Summary"]) {
        const wsPerf = wb.Sheets["Performance_Summary"];
        wsPerf["A1"] = { t: "s", v: `BẢNG TỔNG HỢP KẾT QUẢ: ${studentName.toUpperCase()} (OCTOBER 2026 TEST)` };
        wsPerf["A3"] = { t: "s", v: `Học sinh: ${studentName} | Thời gian làm bài: ${new Date().toLocaleString("vi-VN")}` };
      }

      // 3. Clear old attempt values from Module sheets & Master sheet
      const modSheets = ["RW_Module1", "RW_Module2", "Math_Module1", "Math_Module2"];
      modSheets.forEach(mName => {
        const ws = wb.Sheets[mName];
        if (ws) {
          for (let r = 5; r <= 35; r++) {
            delete ws[`F${r}`];
            delete ws[`H${r}`];
            delete ws[`J${r}`];
          }
        }
      });

      const wsMaster = wb.Sheets["Master_All_98_Questions"];
      if (wsMaster) {
        for (let r = 5; r <= 105; r++) {
          delete wsMaster[`G${r}`];
          delete wsMaster[`I${r}`];
          delete wsMaster[`K${r}`];
        }
      }

      // 4. Populate student attempts into Module sheets & Master sheet
      questions.forEach(q => {
        const qState = attempts[q.id];
        if (!qState) return;

        let attList = qState.attempts || [];
        if (!Array.isArray(attList)) attList = [attList];

        const att1 = attList[0] ? String(attList[0]).trim().toUpperCase() : "";
        const att2 = attList[1] ? String(attList[1]).trim().toUpperCase() : "";
        const att3 = attList[2] ? String(attList[2]).trim().toUpperCase() : "";

        // Module Sheet
        const ws = wb.Sheets[q.module_code];
        if (ws) {
          for (let r = 5; r <= 35; r++) {
            const cellA = ws[`A${r}`];
            if (cellA && String(cellA.v).trim() === String(q.q_label).trim()) {
              if (att1) ws[`F${r}`] = { t: "s", v: att1 };
              if (att2) ws[`H${r}`] = { t: "s", v: att2 };
              if (att3) ws[`J${r}`] = { t: "s", v: att3 };
              break;
            }
          }
        }

        // Master Sheet
        if (wsMaster) {
          const r = q.id + 4;
          if (att1) wsMaster[`G${r}`] = { t: "s", v: att1 };
          if (att2) wsMaster[`I${r}`] = { t: "s", v: att2 };
          if (att3) wsMaster[`K${r}`] = { t: "s", v: att3 };
        }
      });

      // 5. Populate SAT_Error_Log_Tracker with So_Tay_Loi_Sai_Tu_Vung structure
      const wsErr = wb.Sheets["SAT_Error_Log_Tracker"];
      if (wsErr) {
        // Headers in Row 1
        const headers = [
          "STT", "Mã câu", "Module", "Chủ đề / Kỹ năng", "Nhóm bẫy SAT",
          "Phân tích nguyên nhân & Bài học", "Ghi chú tư duy", "Từ mới / Thuật ngữ",
          "Tình trạng", "Thời gian"
        ];
        const cols = ["A","B","C","D","E","F","G","H","I","J"];
        headers.forEach((h, i) => {
          wsErr[`${cols[i]}1`] = { t: "s", v: h };
        });

        // Clear old rows 2 to 60
        for (let r = 2; r <= 60; r++) {
          for (let col of cols) {
            delete wsErr[`${col}${r}`];
          }
        }

        // Write student error logs
        const errList = App.studentState.error_logs || [];
        errList.forEach((e, idx) => {
          const r = 2 + idx;
          wsErr[`A${r}`] = { t: "n", v: idx + 1 };
          wsErr[`B${r}`] = { t: "s", v: String(e.q_label || `Q${e.question_id || ""}`) };
          wsErr[`C${r}`] = { t: "s", v: String(e.module || "") };
          wsErr[`D${r}`] = { t: "s", v: String(e.skill || "") };
          wsErr[`E${r}`] = { t: "s", v: String(e.root_cause || "Bẫy SAT") };
          wsErr[`F${r}`] = { t: "s", v: String(e.trap_detail || "") };
          wsErr[`G${r}`] = { t: "s", v: String(e.student_notes || "") };
          wsErr[`H${r}`] = { t: "s", v: String(e.vocabulary || "") };
          wsErr[`I${r}`] = { t: "s", v: String(e.status || "Đang theo dõi") };
          wsErr[`J${r}`] = { t: "s", v: String(e.date || new Date().toLocaleDateString("vi-VN")) };
        });
      }

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      return new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    }

    // Fallback: minimal workbook if template.xlsx is unreachable
    const fallbackWb = XLSX.utils.book_new();
    const overviewData = [
      ["BÁO CÁO KẾT QUẢ DIGITAL SAT BLUEBOOK"],
      ["Học sinh", studentName],
      ["Email", App.studentState.student_email || "N/A"],
      ["Hiệu suất", summary ? `${summary.scorePct}%` : "0%"]
    ];
    XLSX.utils.book_append_sheet(fallbackWb, XLSX.utils.aoa_to_sheet(overviewData), "Tong_Quan");
    const wbout = XLSX.write(fallbackWb, { bookType: "xlsx", type: "array" });
    return new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  } catch (e) {
    console.error("Client Excel generation failed:", e);
    return null;
  }
}

async function submitTestFinal() {
  const s = calculateTestSummary();
  DOM.btnSubmitTestConfirm.disabled = true;
  DOM.submitSpinner.classList.remove("hidden");
  DOM.btnSubmitText.textContent = "Đang chuẩn bị báo cáo...";

  const studentEmail = App.studentState.student_email || "";
  const studentName = App.studentState.student_name || "Hoc_Sinh";
  const teacherEmail = "mikepham358@gmail.com";
  const errCount = (App.studentState.error_logs || []).length;

  const payload = {
    student_name: studentName,
    student_email: studentEmail,
    summary: {
      answered: s.answered,
      total: s.total,
      l1_correct: s.l1Correct,
      l2_correct: s.l2Correct,
      l3_correct: s.l3Correct,
      score_pct: s.scorePct,
      time_spent: s.timeSpent
    },
    attempts: App.studentState.attempts,
    error_logs: App.studentState.error_logs || []
  };

  let serverData = null;
  try {
    const res = await fetch("/api/submit-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      serverData = await res.json();
    }
  } catch (err) {
    // Expected on static hosting (GitHub Pages)
  }

  // Determine file & download URL
  const defaultFilename = `October_2026_SAT_${studentName.replace(/\s+/g, '_')}_${Date.now()}.xlsx`;
  const filename = (serverData && serverData.filename) ? serverData.filename : defaultFilename;
  let fileBlobUrl = null;

  if (serverData && serverData.download_url) {
    fileBlobUrl = serverData.download_url;
  } else {
    const clientBlob = await generateClientExcelBlob(studentName, s);
    if (clientBlob) {
      fileBlobUrl = window.URL.createObjectURL(clientBlob);
    }
  }

  // Close finish modal
  DOM.modalFinishTest.classList.add("hidden");

  // Construct Mailto URL
  const subject = `[Digital SAT Oct 2026] Báo cáo kết quả bài làm: ${studentName} - Điểm: ${s.scorePct}%`;
  const bodyText = `Kính gửi Thầy Mike Pham Bá Hong Son (Google for Education Innovator),

Em xin gửi kết quả bài làm đề thi Digital SAT Real Test October 2026 (INT-B):

- Họ và tên học sinh: ${studentName}
- Email học sinh: ${studentEmail}
- Thời gian nộp bài: ${new Date().toLocaleString("vi-VN")}
- Tổng số câu đã làm: ${s.answered} / ${s.total}
- Hiệu suất điểm toàn bài: ${s.scorePct}%
- Điểm ước tính: ${s.estimatedScore || Math.round(400 + (s.scorePct / 100) * 1200)} / 1600
- Số câu đúng ngay Lần 1 (100%): ${s.l1Correct} câu
- Số câu đúng Lần 2 (66.7%): ${s.l2Correct} câu
- Số câu đúng Lần 3 (33.3%): ${s.l3Correct} câu
- Số lỗi sai đã ghi chép vào sổ lỗi: ${errCount} câu

(File Excel bài làm chi tiết: ${filename} đã được tải về thiết bị của em và đính kèm cùng email này).

Em cảm ơn Thầy!`;

  const mailtoUrl = `mailto:${teacherEmail}?cc=${encodeURIComponent(studentEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  App.lastMailtoUrl = mailtoUrl;

  // 1. Download file automatically
  if (fileBlobUrl) {
    const a = document.createElement("a");
    a.href = fileBlobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // 2. Launch Mail client on student's personal device
  setTimeout(() => {
    window.location.href = mailtoUrl;
  }, 600);

  // 3. Populate and show instructional Success Modal
  DOM.successFilename.textContent = filename;
  if (fileBlobUrl) {
    DOM.btnDownloadSubmittedFile.href = fileBlobUrl;
    DOM.btnDownloadSubmittedFile.setAttribute("download", filename);
  }
  DOM.modalSubmitSuccess.classList.remove("hidden");

  DOM.btnSubmitTestConfirm.disabled = false;
  DOM.submitSpinner.classList.add("hidden");
  DOM.btnSubmitText.textContent = "📤 Xác Nhận Hoàn Thành & Gửi Báo Cáo Email";
}

// ================= EXPORT EXCEL (SENDS STUDENT'S LOCALSTORAGE) =================
async function exportExcelPersonalized() {
  const studentName = DOM.inputStudentName.value.trim() || prompt("Nhập họ và tên của em để xuất phiếu làm bài:") || "Hoc_Sinh";
  DOM.inputStudentName.value = studentName;
  App.studentState.student_name = studentName;
  saveLocalState();

  const payload = {
    student_name: studentName,
    attempts: App.studentState.attempts,
    error_logs: App.studentState.error_logs || []
  };

  let downloaded = false;
  try {
    const res = await fetch("/api/export-excel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SAT_October_2026_${studentName.replace(/\s+/g, '_')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      downloaded = true;
    }
  } catch (e) {}

  // Fallback to client-side SheetJS generation (for GitHub Pages)
  if (!downloaded) {
    const s = calculateTestSummary();
    const blob = await generateClientExcelBlob(studentName, s);
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SAT_October_2026_${studentName.replace(/\s+/g, '_')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      alert("Không thể tạo file Excel. Vui lòng tải lại trang.");
    }
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
    const q = App.currentQuestion;
    if (q) {
      const qState = App.studentState.attempts[q.id];
      if (qState && qState.justChecked) {
        qState.justChecked = false;
        saveLocalState();
        syncTimerState();
      }
    }
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
    pauseTimer();
    renderNavigatorTiles();
    DOM.navigatorOverlay.classList.remove("hidden");
  });
  DOM.btnCloseNavigator.addEventListener("click", () => {
    DOM.navigatorOverlay.classList.add("hidden");
    syncTimerState();
  });
  DOM.navigatorOverlay.addEventListener("click", (e) => {
    if (e.target === DOM.navigatorOverlay) {
      DOM.navigatorOverlay.classList.add("hidden");
      syncTimerState();
    }
  });

  // Timer Controls
  DOM.btnTimerToggleView.addEventListener("click", () => {
    App.timerHidden = !App.timerHidden;
    DOM.timerDisplay.classList.toggle("hidden-time", App.timerHidden);
    DOM.btnTimerToggleView.textContent = App.timerHidden ? "Show" : "Hide";
  });

  DOM.btnTimerPause.addEventListener("click", () => {
    if (App.timerRunning) {
      App.manualPause = true;
      pauseTimer();
    } else {
      App.manualPause = false;
      resumeTimer();
    }
  });

  // Modals
  DOM.btnOpenCalc.addEventListener("click", () => {
    DOM.modalCalculator.classList.toggle("hidden");
    syncTimerState();
  });
  DOM.btnCloseCalculator.addEventListener("click", () => {
    DOM.modalCalculator.classList.add("hidden");
    syncTimerState();
  });

  DOM.btnOpenRef.addEventListener("click", () => {
    pauseTimer();
    DOM.modalReference.classList.remove("hidden");
  });
  DOM.btnCloseReference.addEventListener("click", () => {
    DOM.modalReference.classList.add("hidden");
    syncTimerState();
  });

  DOM.btnOpenErrorLog.addEventListener("click", () => {
    pauseTimer();
    App.editingLogId = null;
    if (DOM.notebookAddPanel) DOM.notebookAddPanel.classList.add("hidden");
    renderErrorLogs();
    DOM.modalErrorLog.classList.remove("hidden");
  });
  DOM.btnCloseErrorLog.addEventListener("click", () => {
    DOM.modalErrorLog.classList.add("hidden");
    syncTimerState();
  });

  // Notebook Add Entry Panel
  if (DOM.btnAddNewError) {
    DOM.btnAddNewError.addEventListener("click", () => {
      if (!DOM.notebookAddPanel) return;
      const isHidden = DOM.notebookAddPanel.classList.contains("hidden");
      if (isHidden) {
        DOM.notebookAddPanel.classList.remove("hidden");
        const q = App.currentQuestion;
        if (DOM.addPanelQBadge) {
          DOM.addPanelQBadge.textContent = q ? `Câu ${q.q_label} (${q.topic})` : "Ghi chép tự do";
        }
        if (DOM.inputNewDetail) DOM.inputNewDetail.focus();
      } else {
        DOM.notebookAddPanel.classList.add("hidden");
      }
    });
  }

  if (DOM.btnCancelAddError) {
    DOM.btnCancelAddError.addEventListener("click", () => {
      if (DOM.notebookAddPanel) DOM.notebookAddPanel.classList.add("hidden");
    });
  }

  if (DOM.btnSaveNewError) {
    DOM.btnSaveNewError.addEventListener("click", () => {
      const q = App.currentQuestion;
      const detail = DOM.inputNewDetail ? DOM.inputNewDetail.value.trim() : "";
      if (!detail) {
        alert("Vui lòng nhập phân tích lỗi sai hoặc bài học rút ra!");
        if (DOM.inputNewDetail) DOM.inputNewDetail.focus();
        return;
      }
      const newEntry = {
        id: `err_man_${Date.now()}`,
        question_id: q ? q.id : "custom",
        q_label: q ? q.q_label : "Ghi chép",
        module: q ? q.module_title : "SAT",
        skill: q ? q.topic : "Luyện thi",
        date: new Date().toLocaleDateString("vi-VN"),
        wrong_attempts: [],
        correct_answer: q ? q.correct_answer : "",
        root_cause: DOM.selectNewTrap ? DOM.selectNewTrap.value : "Bẫy SAT Trap",
        trap_detail: detail,
        student_notes: DOM.inputNewNotes ? DOM.inputNewNotes.value.trim() : "",
        vocabulary: DOM.inputNewVocab ? DOM.inputNewVocab.value.trim() : "",
        socratic_analysis: q ? (q.level1_tip || "") : "",
        status: DOM.selectNewStatus ? DOM.selectNewStatus.value : "Đang theo dõi"
      };

      if (!App.studentState.error_logs) App.studentState.error_logs = [];
      App.studentState.error_logs.unshift(newEntry);

      // Clear add form
      if (DOM.inputNewDetail) DOM.inputNewDetail.value = "";
      if (DOM.inputNewNotes) DOM.inputNewNotes.value = "";
      if (DOM.inputNewVocab) DOM.inputNewVocab.value = "";
      if (DOM.notebookAddPanel) DOM.notebookAddPanel.classList.add("hidden");

      saveLocalState();
      updateErrorBadge();
      renderErrorLogs();
    });
  }

  // Notebook Search Input
  if (DOM.inputFilterErrSearch) {
    DOM.inputFilterErrSearch.addEventListener("input", (e) => {
      App.notebookSearchQuery = e.target.value.trim();
      if (DOM.btnClearErrSearch) {
        DOM.btnClearErrSearch.classList.toggle("hidden", !App.notebookSearchQuery);
      }
      renderErrorLogs();
    });
  }

  if (DOM.btnClearErrSearch) {
    DOM.btnClearErrSearch.addEventListener("click", () => {
      if (DOM.inputFilterErrSearch) DOM.inputFilterErrSearch.value = "";
      App.notebookSearchQuery = "";
      DOM.btnClearErrSearch.classList.add("hidden");
      renderErrorLogs();
    });
  }

  // Notebook Filter Chips
  if (DOM.notebookFilterChips) {
    DOM.notebookFilterChips.querySelectorAll(".filter-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        DOM.notebookFilterChips.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        App.notebookFilterStatus = chip.dataset.status || "all";
        renderErrorLogs();
      });
    });
  }

  DOM.btnOpenStrategies.addEventListener("click", () => {
    pauseTimer();
    renderStrategiesModal();
    DOM.modalStrategies.classList.remove("hidden");
  });
  DOM.btnCloseStrategies.addEventListener("click", () => {
    DOM.modalStrategies.classList.add("hidden");
    syncTimerState();
  });

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

  // PDF External Drive Opener
  if (DOM.btnPdfExternal) {
    DOM.btnPdfExternal.addEventListener("click", () => {
      window.open(DRIVE_VIEW_URL, '_blank');
    });
  }

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
