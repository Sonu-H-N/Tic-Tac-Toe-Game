# ✕ Tic Tac Toe

> A clean, polished Tic Tac Toe game with Player vs Player and an unbeatable AI — built with vanilla HTML, CSS, and JavaScript.

![PWA Ready](https://img.shields.io/badge/PWA-Installable-1a2e1a?style=flat-square)
![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## ✨ Features

- **Two game modes** — Player vs Player and Player vs AI
- **Unbeatable AI** using the Minimax algorithm with alpha-beta pruning
- **Animated marks** — X and O draw themselves on the board (SVG stroke animation)
- **Animated win line** that draws across the winning three cells
- **Score tracking** persisted in localStorage (survives page refresh)
- **Sound feedback** — click sound on placement, win chime, draw tone (Web Audio API, no external files)
- **Keyboard support** — press 1–9 to play cells, R to reset
- **Toast notifications** for win/draw results
- **Installable as a PWA** with offline support

---

## 🎮 How to Play

- **vs Player:** Two people take turns clicking cells — X always goes first
- **vs AI:** You play as X, the AI plays as O and is unbeatable (Minimax)
- **Keyboard:** Press `1`–`9` (matching the grid left-to-right, top-to-bottom) to place marks; `R` to start a new game

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Game board markup, accessible button grid |
| CSS3 | Blackboard theme, SVG stroke-dash animations, responsive layout |
| Vanilla JavaScript (ES6+) | Game logic, Minimax AI, Web Audio API sounds |
| Service Worker | PWA offline caching |
| Google Fonts — Caveat + Inter | Handwritten + clean UI typography |

---

## 📂 Project Structure

```
tic-tac-toe/
├── index.html          # Game markup
├── style.css             # Design system (blackboard theme, animations)
├── script.js               # Game logic, Minimax AI, sounds, scoring
├── service-worker.js         # PWA offline cache
├── manifest.json               # PWA manifest
└── README.md                     # This file
```

> Open `index.html` in a browser — no install or build step needed.

---

## 🤖 About the AI

The AI uses **Minimax with alpha-beta pruning**:
- It explores every possible game state recursively
- It always picks the move that leads to the best outcome for itself
- Alpha-beta pruning skips branches that can't improve the result, making it fast
- The AI cannot be beaten — the best a human player can do is draw

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `1`–`9` | Play cell (left-to-right, top-to-bottom) |
| `R` | Start new game |

---

## 🔮 Possible Extensions

- Adjustable AI difficulty (Easy / Medium / Hard)
- Online multiplayer via WebSockets
- Move history / undo
- Larger grids (4×4, 5×5)

---

## 👨‍💻 Author

**Sonu H N** — Passionate about web development and building things that are fun to use.

---

## 📜 License

This project is open-source under the MIT License.
