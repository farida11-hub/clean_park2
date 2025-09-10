// 🎮 Clean the Park Game – Organized Version

const trashTypes = ["🍎","📄", "🍕", "💩", "🥑", "🤡"];
// onst trashTypes = ["", "", "📰", "📦", "🍏"];
let level = 1;
let trashCount = 3;
let recycled = 0;
let trashItems = [];
let musicStarted = false;
let timeLeft = 30;
let timerInterval = null;

// 🎵 Background music
const bgMusic = new Audio("bg.mp3");
bgMusic.loop = true; // تکرار موسیقی

// 🔊 Sound effect for recycling
const popSound = new Audio("pop.mp3")

const bin = document.getElementById("bin");
const message = document.getElementById("message");
const levelDisplay = document.getElementById("level");
const timerDisplay = document.getElementById("timer");

// 🎲 Utility Functions
const rand = (min, max) => Math.random() * (max - min) + min;
const choose = arr => arr[Math.floor(Math.random() * arr.length)];

// 🗑 Create Trash Items
function createTrash(num) {
  trashItems = []; // Reset list
  for (let i = 0; i < num; i++) {
    const trash = document.createElement("div");
    trash.className = "trash";
    trash.textContent = choose(trashTypes);
    trash.style.left =` ${rand(0, window.innerWidth - 50)}px`;
    trash.style.top = `${rand(100, window.innerHeight - 100)}px`;
    trash.draggable = true;

    trash.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  trash.dataset.offsetX = touch.clientX - trash.offsetLeft;
  trash.dataset.offsetY = touch.clientY - trash.offsetTop;
});

trash.addEventListener("touchmove", e => {
  e.preventDefault(); // جلوگیری از اسکرول صفحه
  const touch = e.touches[0];
  const offsetX = parseFloat(trash.dataset.offsetX);
  const offsetY = parseFloat(trash.dataset.offsetY);
  trash.style.left =` ${touch.clientX - offsetX}px`;
  trash.style.top = `${touch.clientY - offsetY}px`;
});

trash.addEventListener("touchend", e => {
  const touch = e.changedTouches[0];
  if (isInsideBin(touch.clientX, touch.clientY)) {
    recycleTrash(trash);
  }
});

trash.draggable = true;

trash.addEventListener("dragstart", () => {
  trash.classList.add("wiggle");
  showMessage("Drag the trash and drop it into the bin! 🗑");
});

trash.addEventListener("dragend", e => {
  if (isInsideBin(e.clientX, e.clientY)) {
    recycleTrash(trash);
  } else {
    trash.classList.remove("wiggle");
    showMessage("Try to drop the trash exactly into the bin!");
  }
});



    document.body.appendChild(trash);
    trashItems.push(trash);
  }
}

// ✅ Check if dropped inside bin
function isInsideBin(x, y) {
  const binRect = bin.getBoundingClientRect();
  return (
    x > binRect.left &&
    x < binRect.right &&
    y > binRect.top &&
    y < binRect.bottom
  );
}

// ♻️ Recycle Trash
function recycleTrash(trash) {
  trash.remove();
  recycled++;
  popSound.play();
  bin.classList.add("active");
  setTimeout(() => bin.classList.remove("active"), 300);
  showMessage(`Tarsh recycled ✅ Total : ${recycled}`);
  checkLevelUp();
}

// 🔼 Level Up Logic
function checkLevelUp() {
  if (recycled >= trashCount) {
    level++;
    trashCount += 2;
    recycled = 0;
    levelDisplay.textContent =` Level: ${level}`;
    showMessage(`🎉 level ${level}  started !New trash incoming...`);
    createTrash(trashCount);
    resetTimer();
  }
}

// ⏱️ Timer Functions
function startTimer() {
  timeLeft = 60;
  timerDisplay.textContent =` Time remaining: ${timeLeft} seconds`

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent =` Time remaining: ${timeLeft} seconds`

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  startTimer();
}

// 🛑 End Game
function endGame() {
  trashItems.forEach(trash => trash.remove());
  trashItems = [];
  bgMusic.pause();
  showMessage(`⏱️ Time's up! Final score ${level - 1}`);
}

// 📝 Message Display
function showMessage(text) {
  message.textContent = text;
}

// 🎮 Game Start
function startGame() {
  if (musicStarted) return;
  musicStarted = true;

  bgMusic.play(); // 🎵 پخش موسیقی پس‌زمینه
  levelDisplay.textContent = `Level: ${level}`;
  showMessage("Game started! Drag Trash into the bin");
  createTrash(trashCount);
  startTimer();
}



// 🧠 Event Listeners
document.body.addEventListener("click", startGame);