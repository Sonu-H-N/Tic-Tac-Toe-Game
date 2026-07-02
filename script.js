/* ============================================================
   Tic Tac Toe — Game Logic
   Modes: PvP | Player vs AI (minimax, unbeatable)
   ============================================================ */

/* ── AUDIO (Web Audio API — no external files) ── */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

function playClick() {
  try {
    const ctx = getAudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 660;
    o.type = "sine";
    g.gain.setValueAtTime(0.07, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
    o.start(); o.stop(ctx.currentTime + 0.07);
  } catch {}
}

function playWin() {
  try {
    const ctx = getAudioCtx();
    const notes = [523, 659, 784, 1047]; // C E G C
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq;
      o.type = "triangle";
      const t = ctx.currentTime + i * 0.13;
      g.gain.setValueAtTime(0.09, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.start(t); o.stop(t + 0.21);
    });
  } catch {}
}

function playDraw() {
  try {
    const ctx = getAudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 300;
    o.type = "sine";
    g.gain.setValueAtTime(0.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    o.start(); o.stop(ctx.currentTime + 0.35);
  } catch {}
}

/* ── STATE ── */
const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diagonals
];

let board       = Array(9).fill(null);
let currentPlayer = "X";
let gameOver    = false;
let mode        = "pvp"; // "pvp" | "ai"
let scores      = JSON.parse(localStorage.getItem("ttt_scores")) || { X:0, O:0, draw:0 };

/* ── DOM REFS ── */
const cells       = document.querySelectorAll(".cell");
const statusEl    = document.getElementById("status");
const scoreXEl    = document.getElementById("scoreX");
const scoreOEl    = document.getElementById("scoreO");
const scoreDrawEl = document.getElementById("scoreDraw");
const nameOEl     = document.getElementById("nameO");
const winLineEl   = document.getElementById("winLine");
const toastEl     = document.getElementById("toast");
const btnPvP      = document.getElementById("btnPvP");
const btnAI       = document.getElementById("btnAI");

/* ── INIT ── */
function init() {
  renderScores();
  updateStatus();
}

/* ── SET MODE ── */
function setMode(m) {
  mode = m;
  btnPvP.classList.toggle("active", m === "pvp");
  btnAI.classList.toggle("active",  m === "ai");
  nameOEl.textContent = m === "ai" ? "AI" : "Player O";
  resetGame();
}

/* ── HANDLE CLICK ── */
function handleClick(index) {
  if (gameOver || board[index]) return;
  if (mode === "ai" && currentPlayer === "O") return; // AI's turn

  makeMove(index, currentPlayer);

  if (!gameOver && mode === "ai" && currentPlayer === "O") {
    statusEl.textContent = "AI is thinking…";
    statusEl.className   = "status thinking";
    setTimeout(aiMove, 420);
  }
}

/* ── MAKE MOVE ── */
function makeMove(index, player) {
  board[index] = player;
  renderCell(index, player);
  playClick();

  const win = checkWin();
  if (win) {
    handleWin(player, win);
    return;
  }

  if (board.every(c => c)) {
    handleDraw();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
}

/* ── RENDER CELL ── */
function renderCell(index, player) {
  const cell = cells[index];
  cell.dataset.mark = player;
  cell.disabled = true;
  cell.setAttribute("aria-label", `Cell ${index + 1}: ${player}`);

  if (player === "X") {
    cell.innerHTML = `
      <svg class="mark-x" viewBox="0 0 58 58" aria-hidden="true">
        <line x1="10" y1="10" x2="48" y2="48"/>
        <line x1="48" y1="10" x2="10" y2="48"/>
      </svg>`;
  } else {
    cell.innerHTML = `
      <svg class="mark-o" viewBox="0 0 58 58" aria-hidden="true">
        <circle cx="29" cy="29" r="20"/>
      </svg>`;
  }
}

/* ── CHECK WIN ── */
function checkWin() {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return null;
}

/* ── HANDLE WIN ── */
function handleWin(player, line) {
  gameOver = true;

  // Highlight winning cells
  line.forEach(i => cells[i].classList.add("win-cell"));

  // Draw win line
  drawWinLine(line);

  // Status
  const label = player === "O" && mode === "ai" ? "AI" : `Player ${player}`;
  statusEl.textContent = `${label} wins! 🎉`;
  statusEl.className   = "status win";

  playWin();

  scores[player]++;
  saveScores();
  renderScores();

  showToast(`${label} wins! 🎉`);
}

/* ── HANDLE DRAW ── */
function handleDraw() {
  gameOver = true;
  statusEl.textContent = "It's a draw!";
  statusEl.className   = "status draw";
  playDraw();
  scores.draw++;
  saveScores();
  renderScores();
  showToast("It's a draw!");
}

/* ── UPDATE STATUS ── */
function updateStatus() {
  if (gameOver) return;
  const isAI = mode === "ai" && currentPlayer === "O";
  const label = isAI ? "AI" : `Player ${currentPlayer}`;
  statusEl.textContent = `${label}'s turn`;
  statusEl.className   = `status ${currentPlayer === "X" ? "x-turn" : "o-turn"}`;
}

/* ── WIN LINE DRAWING ── */
// The SVG viewBox is "0 0 3 3" so cell centres are at 0.5, 1.5, 2.5
const CELL_CENTERS = [
  [0.5,0.5],[1.5,0.5],[2.5,0.5],
  [0.5,1.5],[1.5,1.5],[2.5,1.5],
  [0.5,2.5],[1.5,2.5],[2.5,2.5]
];

function drawWinLine(line) {
  const [a, , c] = line;
  const [x1, y1] = CELL_CENTERS[a];
  const [x2, y2] = CELL_CENTERS[c];

  // Extend line slightly beyond cell centres for visual polish
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx*dx + dy*dy);
  const ext = 0.28;
  const ux = dx/len, uy = dy/len;

  winLineEl.setAttribute("x1", (x1 - ux*ext).toFixed(3));
  winLineEl.setAttribute("y1", (y1 - uy*ext).toFixed(3));
  winLineEl.setAttribute("x2", (x2 + ux*ext).toFixed(3));
  winLineEl.setAttribute("y2", (y2 + uy*ext).toFixed(3));

  // Animate the line drawing
  const totalLen = len + ext * 2;
  winLineEl.style.strokeDasharray  = totalLen;
  winLineEl.style.strokeDashoffset = totalLen;
  // Force reflow
  void winLineEl.getBoundingClientRect();
  winLineEl.style.transition = "stroke-dashoffset 0.45s ease-out";
  winLineEl.style.strokeDashoffset = 0;
}

/* ── AI (MINIMAX) ── */
function aiMove() {
  if (gameOver) return;
  const best = getBestMove(board);
  makeMove(best, "O");
}

function getBestMove(b) {
  let bestScore = -Infinity;
  let bestMove  = -1;

  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = "O";
      const score = minimax(b, 0, false, -Infinity, Infinity);
      b[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove  = i;
      }
    }
  }

  return bestMove;
}

function minimax(b, depth, isMax, alpha, beta) {
  const winner = getWinner(b);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (b.every(c => c)) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "O";
        best = Math.max(best, minimax(b, depth+1, false, alpha, beta));
        b[i] = null;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "X";
        best = Math.min(best, minimax(b, depth+1, true, alpha, beta));
        b[i] = null;
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

function getWinner(b) {
  for (const [a, c_, cc] of WIN_LINES) {
    if (b[a] && b[a] === b[c_] && b[a] === b[cc]) return b[a];
  }
  return null;
}

/* ── RESET ── */
function resetGame() {
  board         = Array(9).fill(null);
  currentPlayer = "X";
  gameOver      = false;

  cells.forEach(cell => {
    cell.innerHTML   = "";
    cell.disabled    = false;
    cell.className   = "cell";
    cell.dataset.mark = "";
    cell.setAttribute("aria-label", `Cell ${+cell.dataset.index + 1}`);
  });

  // Reset win line
  winLineEl.style.transition      = "none";
  winLineEl.style.strokeDashoffset = 5;
  winLineEl.setAttribute("x1", "0");
  winLineEl.setAttribute("y1", "0");
  winLineEl.setAttribute("x2", "0");
  winLineEl.setAttribute("y2", "0");

  updateStatus();
}

function resetScore() {
  scores = { X: 0, O: 0, draw: 0 };
  saveScores();
  renderScores();
  showToast("Scores reset");
}

/* ── SCORES ── */
function renderScores() {
  scoreXEl.textContent    = scores.X;
  scoreOEl.textContent    = scores.O;
  scoreDrawEl.textContent = scores.draw;
}

function saveScores() {
  localStorage.setItem("ttt_scores", JSON.stringify(scores));
}

/* ── TOAST ── */
let toastTimer;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
}

/* ── KEYBOARD SUPPORT ── */
document.addEventListener("keydown", e => {
  if (e.key === "r" || e.key === "R") resetGame();
  // 1-9 to play cells
  const n = parseInt(e.key);
  if (n >= 1 && n <= 9) handleClick(n - 1);
});

/* ── SERVICE WORKER ── */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").catch(() => {});
}

/* ── START ── */
init();
