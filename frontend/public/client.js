const supabase = window.supabase.createClient(
  "https://chtkfzwofusetduxxorv.supabase.co", // Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodGtmendvZnVzZXRkdXh4b3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNzE4ODEsImV4cCI6MjA1Njg0Nzg4MX0.2EsaeTf5r1KdMr-U96tXK3Fo8EmcTlWXslewa_us7ho" // anon key (frontend safe)
);


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

// Auth elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

let currentAnswer = "";
let score = 0;
let timer;
let timeLeft = 15;

// 🌗 Theme toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

// 👤 Handle auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  handleAuth(session);
});


function handleAuth(session) {
  const loggedIn = !!session;

  document.getElementById("auth-section").style.display = loggedIn ? "none" : "block";
  homeScreen.style.display = loggedIn ? "block" : "none";
  quizScreen.style.display = "none";
  logoutBtn.style.display = loggedIn ? "inline-block" : "none";
  startBtn.disabled = !loggedIn;

  if (loggedIn) {
    loadLeaderboard();
  }
}



// 🧠 Auth logic
loginBtn.onclick = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value,
  });
  if (error) alert(error.message);
};

signupBtn.onclick = async () => {
  const { error } = await supabase.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value,
  });
  if (error) alert(error.message);
  else alert("Signup successful! Please check your email.");
};

logoutBtn.onclick = async () => {
  await supabase.auth.signOut();
  location.reload();
};



async function loadLeaderboard() {
  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false })
      .limit(5);

    if (error || !Array.isArray(data)) throw new Error("Leaderboard load failed");

    leaderboardEl.innerHTML = data.map((entry, index) => `
      <li class="leaderboard-entry">
        <span class="leaderboard-rank">#${index + 1}</span>
        <span class="leaderboard-name">${entry.username}</span>
        <span class="leaderboard-score">${entry.score}</span>
      </li>
    `).join("");
  } catch (err) {
    leaderboardEl.innerHTML = `<li>⚠️ Could not load leaderboard</li>`;
    console.error("Leaderboard error:", err.message);
  }
}


async function saveScore(score) {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    const username = user?.email;
    if (!username) throw new Error("No user found");

    const { data: existing } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (existing) {
      const confirmReplace = confirm(`${username} already exists. Replace score?`);
      if (!confirmReplace) return;

      await supabase.from("leaderboard").update({ score }).eq("username", username);
    } else {
      await supabase.from("leaderboard").insert({ username, score });
    }
  } catch (err) {
    alert("Failed to save score. Try again.");
    console.error("Score save error:", err.message);
  }
}


// 🔠 Capitalize helper
function capitalize(text) {
  if (!text) return "";
  return text
    .split("/")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("/");
}

async function getQuestion() {
  try {
    const res = await fetch(`https://chtkfzwofusetduxxorv.supabase.co/functions/v1/pokemon-question?score=${score}`);
    const data = await res.json();

    currentAnswer = data.answer;
    questionEl.textContent = data.question;
    resultEl.textContent = "";
    choicesEl.innerHTML = "";
    spriteEl.src = data.sprite || "";

    data.choices.forEach((choice, index) => {
      const btn = document.createElement("button");
      const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];
      btn.innerHTML = `<span class="icon">${emojis[index]}</span> ${capitalize(choice)}`;
      btn.onclick = () => checkAnswer(choice);
      choicesEl.appendChild(btn);
    });

    document.onkeydown = (e) => {
      const index = parseInt(e.key) - 1;
      const btns = choicesEl.querySelectorAll("button");
      if (index >= 0 && index < btns.length) btns[index].click();
    };

    startTimer();
  } catch (err) {
    questionEl.textContent = "⚠️ Could not load question.";
    resultEl.textContent = "Try refreshing or check your connection.";
    console.error("Question error:", err.message);
  } // <-- ✅ this closing brace was missing!
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

// ✅/❌ Answer
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

// 🛑 End game
function endGame(message) {
  alert(message);
  quizScreen.style.display = "none";
  homeScreen.style.display = "block";
  loadLeaderboard();
}

// ▶️ Start quiz
startBtn.onclick = () => {
  score = 0;
  scoreEl.textContent = "Score: 0";
  homeScreen.style.display = "none";
  quizScreen.style.display = "block";
  getQuestion();
};

// Initial Load
loadLeaderboard();