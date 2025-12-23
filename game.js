const ITEM_COUNT = 5;

let life = 3;
let score = 0;
let time = 60;

const itemsEl = document.getElementById("items");
const santa = document.getElementById("santa");

const lifeEl = document.getElementById("life");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");

let queue = [];

/* ===== 유틸 ===== */
function randomItem() {
  return Math.random() < 0.6 ? "bear" : "bomb";
}

function createItem(type) {
  const el = document.createElement("div");
  el.className = "item";
  el.dataset.type = type;
  el.style.backgroundImage = `url(assets/${type}.png)`;
  return el;
}

/* ===== 초기화 ===== */
function init() {
  for (let i = 0; i < ITEM_COUNT; i++) {
    queue.push(createItem(randomItem()));
  }
  render();
}

init();

/* ===== 렌더 ===== */
function render() {
  itemsEl.innerHTML = "";

  /*
    grid 왼쪽 → 오른쪽
    [4][3][2][1][0]
             ↑
         queue[0]
  */
  for (let i = ITEM_COUNT - 1; i >= 0; i--) {
    itemsEl.appendChild(queue[i]);
  }
}

/* ===== 판정 ===== */
function judge(action) {
  const item = queue[0];
  if (!item) return;

  let success = false;

  if (item.dataset.type === "bear" && action === "wrap") {
    success = true;
    score++;
    scoreEl.textContent = score;
  }

  if (item.dataset.type === "bomb" && action === "discard") {
    success = true;
  }

  if (!success) {
    life--;
    lifeEl.textContent = life;
    if (life <= 0) return gameOver();
  }

  playItemAnimation(item, action);
}
function playItemAnimation(item, action) {
  // 판정된 아이템만 애니메이션
  item.classList.add(action); // wrap 또는 discard

  // 애니메이션 끝난 뒤 컨베이어 이동
  const delay = action === "wrap" ? 200 : 300;

  setTimeout(() => {
    moveConveyor();
  }, delay);
}
function moveConveyor() {
  // queue[0] 제거 (이미 애니메이션 끝남)
  queue.shift();

  // 왼쪽에서 새 물건 추가
  queue.push(createItem(randomItem()));

  render();
}

/* ===== 입력 ===== */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowDown" || e.key === "s") judge("wrap");
  if (e.key === "ArrowUp" || e.key === "w") judge("discard");
});

/* ===== 타이머 ===== */
const timer = setInterval(() => {
  time--;
  timeEl.textContent = time;
  if (time <= 0) gameOver();
}, 1000);

function gameOver() {
  clearInterval(timer);
  alert(`GAME OVER\n점수: ${score}`);
  location.reload();
}
