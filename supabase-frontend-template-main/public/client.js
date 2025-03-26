// client.js
const apiUrl = "https://chtkfzwofusetduxxorv.functions.supabase.co/pokemon-question";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodGtmendvZnVzZXRkdXh4b3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNzE4ODEsImV4cCI6MjA1Njg0Nzg4MX0.2EsaeTf5r1KdMr-U96tXK3Fo8EmcTlWXslewa_us7ho"; // Replace this securely

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

// 🌓 Theme toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

// 🏆 Load Top Scores
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
    .map(entry => `<li>${entry.username}: ${entry.score}</li>`)
    .join("");
}

// 💾 Save Score to Supabase
async function saveScore(score) {
  const username = prompt("Incorrect! Enter your name to enter your score into the leaderboard:");
  if (!username) return;

  const response = await fetch("https://chtkfzwofusetduxxorv.supabase.co/rest/v1/leaderboard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      username: username.trim(),
      score: parseInt(score)
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error saving score:", data);
    alert("Error saving your score.");
  }
}

// 🧠 Load New Question
async function getQuestion() {
  const res = await fetch(`${apiUrl}?score=${score}`);
  const data = await res.json();

  currentAnswer = data.answer;
  questionEl.textContent = data.question;
  resultEl.textContent = "";
  choicesEl.innerHTML = "";

  if (data.sprite) spriteEl.src = data.sprite;

  data.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice);
    choicesEl.appendChild(btn);
  });

  document.onkeydown = (e) => {
    const index = parseInt(e.key) - 1;
    const btns = choicesEl.querySelectorAll("button");
    if (index >= 0 && index < btns.length) {
      btns[index].click();
    }
  };

  startTimer();
}

// ⏳ Start Timer
function startTimer() {
  timeLeft = 15;
  timerEl.textContent = `Time: ${timeLeft}s`;
  timerBar.style.width = "100%";

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time: ${timeLeft}s`;
    timerBar.style.width = `${(timeLeft / 15) * 100}%`;

    if (timeLeft === 0) {
      clearInterval(timer);
      endGame("⏱ Time's up!");
    }
  }, 1000);
}

// ✅ or ❌ Answer Handling
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
    resultEl.textContent = `❌ Wrong! The answer was: ${currentAnswer}`;
    await saveScore(score);
    setTimeout(() => endGame("❌ Game Over"), 1500);
  }
}

// 🔚 End Game
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

// 🏁 Load leaderboard on page load
loadLeaderboard();
