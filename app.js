const timerEl = document.getElementById('timer');
const modeLabel = document.getElementById('modeLabel');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');
const workInput = document.getElementById('workInput');
const breakInput = document.getElementById('breakInput');
const logList = document.getElementById('logList');
const logCount = document.getElementById('logCount');

const LOG_KEY = 'pomodoro-log';

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function readStorage() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadLogs() {
  return readStorage().filter(e => e.date === todayStr());
}

function saveLog(entry) {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}-${String(cutoff.getDate()).padStart(2, '0')}`;
    const pruned = readStorage().filter(e => e.date >= cutoffStr);
    pruned.push(entry);
    localStorage.setItem(LOG_KEY, JSON.stringify(pruned));
  } catch {
    // storage unavailable — entry silently dropped, timer still works
  }
}

function renderLogs() {
  const logs = loadLogs();
  logList.replaceChildren(...logs.map(e => {
    const li = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = `${e.minutes}분 집중`;
    const time = document.createElement('span');
    time.className = 'log-time';
    time.textContent = e.time;
    li.append(label, time);
    return li;
  }));
  logCount.textContent = `${logs.length}개`;
  logList.scrollTop = logList.scrollHeight;
}

function addLog(minutes) {
  const now = new Date();
  const time = now.toTimeString().slice(0, 5);
  saveLog({ date: todayStr(), time, minutes });
  renderLogs();
}

let workMinutes = 25;
let breakMinutes = 5;
let mode = 'work';
let timeLeft = workMinutes * 60;
let isRunning = false;
let interval = null;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateDisplay() {
  timerEl.textContent = formatTime(timeLeft);
  document.title = `${formatTime(timeLeft)} — ${mode === 'work' ? 'WORK' : 'BREAK'}`;
}

function switchMode() {
  if (mode === 'work') addLog(workMinutes);
  mode = mode === 'work' ? 'break' : 'work';
  timeLeft = (mode === 'work' ? workMinutes : breakMinutes) * 60;
  modeLabel.textContent = mode === 'work' ? 'WORK' : 'BREAK';
  modeLabel.className = 'mode-label' + (mode === 'break' ? ' break' : '');
  updateDisplay();
}

function tick() {
  if (timeLeft <= 0) {
    switchMode();
    return;
  }
  timeLeft--;
  updateDisplay();
}

startBtn.addEventListener('click', () => {
  if (isRunning) {
    clearInterval(interval);
    isRunning = false;
    startBtn.textContent = 'Start';
    startBtn.classList.remove('running');
  } else {
    interval = setInterval(tick, 1000);
    isRunning = true;
    startBtn.textContent = 'Pause';
    startBtn.classList.add('running');
  }
});

resetBtn.addEventListener('click', () => {
  clearInterval(interval);
  isRunning = false;
  startBtn.textContent = 'Start';
  startBtn.classList.remove('running');
  mode = 'work';
  timeLeft = workMinutes * 60;
  modeLabel.textContent = 'WORK';
  modeLabel.className = 'mode-label';
  updateDisplay();
});

saveBtn.addEventListener('click', () => {
  const w = parseInt(workInput.value, 10);
  const b = parseInt(breakInput.value, 10);
  if (w > 0 && b > 0) {
    workMinutes = w;
    breakMinutes = b;
    resetBtn.click();
  } else {
    workInput.value = workMinutes;
    breakInput.value = breakMinutes;
  }
});

updateDisplay();
renderLogs();
