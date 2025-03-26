const apiUrl = "https://chtkfzwofusetduxxorv.functions.supabase.co/pokemon-question";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodGtmendvZnVzZXRkdXh4b3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNzE4ODEsImV4cCI6MjA1Njg0Nzg4MX0.2EsaeTf5r1KdMr-U96tXK3Fo8EmcTlWXslewa_us7ho"; // truncated for brevity

// DOM Elements
const homeScreen = document.getElementById("homeScreen");
const quizScreen = document.getElementById("quizScreen");
const leaderboardEl = document.getElementById("leaderboard");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const timerEl = document.getElementById("timer");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const spriteEl = document.getElementById("sprite");
const startBtn = document.getElementById("startBtn");
const themeToggle = document.getElementById("themeToggle");
const timerBar = document.getElementById("timerBar");

let currentAnswer = "";
let score = 0;
let timer;
let timeLeft = 15;

// 🌗 Theme toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

// 🏆 Load leaderboard
async function loadLeaderboard() {
  const res = await fetch("https://chtkfzwofusetduxxorv.supabase.co/rest/v1/leaderboard?select=*&order=score.desc&limit=5", {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    }
  });

  const data = await res.json();

  if (!Array.isArray(data)) {
    leaderboardEl.innerHTML = `<li>Error loading leaderboard</li>`;
    return;
  }

  leaderboardEl.innerHTML = data
    .map((entry, index) => `
      <li class="leaderboard-entry">
        <span class="leaderboard-rank">#${index + 1}</span>
        <span class="leaderboard-name">${entry.username}</span>
        <span class="leaderboard-score">${entry.score}</span>
      </li>
    `)
    .join("");
}

// 💾 Save or update score
async function saveScore(score) {
  let username = "";

  while (!username) {
    username = prompt("Incorrect! Enter your name for the leaderboard:")?.trim();
    if (!username) continue;

    const res = await fetch(`https://chtkfzwofusetduxxorv.supabase.co/rest/v1/leaderboard?username=eq.${username}`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`
      }
    });

    const existing = await res.json();

    if (Array.isArray(existing) && existing.length > 0) {
      const confirmReplace = confirm(`${username} already exists. Do you want to replace their score?`);
      if (confirmReplace) {
        const patch = await fetch(`https://chtkfzwofusetduxxorv.supabase.co/rest/v1/leaderboard?username=eq.${username}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            Prefer: "return=representation"
          },
          body: JSON.stringify({ score: parseInt(score) })
        });

        if (!patch.ok) {
          alert("Failed to update score.");
        }
        return;
      } else {
        username = "";
        continue;
      }
    }
  }

  const response = await fetch("https://chtkfzwofusetduxxorv.supabase.co/rest/v1/leaderboard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Prefer: "return=representation"
    },
    body: JSON.stringify({ username, score: parseInt(score) })
  });

  if (!response.ok) {
    const data = await response.json();
    console.error("Error saving score:", data);
    alert("Error saving your score.");
  }
}

// 🔠 Capitalizer
function capitalize(text) {
  if (!text) return '';
  return text
    .split("/")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("/");
}

// ❓ Get Question
async function getQuestion() {
  const res = await fetch(`${apiUrl}?score=${score}`);
  const data = await res.json();

  currentAnswer = data.answer;
  questionEl.textContent = data.question;
  resultEl.textContent = "";
  choicesEl.innerHTML = "";

  if (data.sprite) spriteEl.src = data.sprite;
  else spriteEl.src = "";

  data.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];
    btn.innerHTML = `<span class="icon">${emojis[index] || "🔘"}</span> ${capitalize(choice)}`;
    btn.onclick = () => checkAnswer(choice);
    choicesEl.appendChild(btn);
  });

  // Enable keyboard choice input
  document.onkeydown = (e) => {
    const index = parseInt(e.key) - 1;
    const btns = choicesEl.querySelectorAll("button");
    if (index >= 0 && index < btns.length) {
      btns[index].click();
    }
  };

  startTimer();
}

// ⏳ Timer
function startTimer() {
  timeLeft = 15;
  timerEl.textContent = `Time: ${timeLeft}s`;
  timerBar.style.width = "100%";

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time: ${timeLeft}s`;
    timerBar.style.width = `${(timeLeft / 15) * 100}%`;

    if (timeLeft === 0) {
      clearInterval(timer);
      resultEl.textContent = "⏱ Time's up!";
      setTimeout(() => endGame("⏱ Time's up!"), 1000);
    }
  }, 1000);
}

// ✅ or ❌ Answer
async function checkAnswer(choice) {
  clearInterval(timer);

  if (choice === currentAnswer) {
    score++;
    scoreEl.textContent = `Score: ${score}`;
    resultEl.textContent = "✅ Correct!";
    questionEl.textContent = "";
    choicesEl.innerHTML = `<div class="loader"></div>`;
    timerEl.textContent = "";
    setTimeout(getQuestion, 1000);
  } else {
    resultEl.textContent = `❌ Wrong! The answer was: ${capitalize(currentAnswer)}`;
    await saveScore(score);
    setTimeout(() => endGame("❌ Game Over"), 1500);
  }
}

// 🛑 End Game
function endGame(message) {
  alert(message);
  quizScreen.style.display = "none";
  homeScreen.style.display = "block";
  loadLeaderboard();
}

// ▶️ Start Quiz
startBtn.onclick = () => {
  score = 0;
  scoreEl.textContent = "Score: 0";
  homeScreen.style.display = "none";
  quizScreen.style.display = "block";
  getQuestion();
};

// 🚀 Initial Load
loadLeaderboard();
