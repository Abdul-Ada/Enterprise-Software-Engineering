# Pokémon Quiz – Enterprise Software Engineering Project

## 🧠 Introduction

This project is a full-stack enterprise-grade web application developed as part of the Enterprise Software Engineering module. It delivers a real-time, interactive quiz experience themed around Pokémon trivia, where players must answer progressively more difficult questions under time pressure.

At its core, the application is designed to demonstrate key principles of modern software engineering including modularity, scalability, security, and resilience. It integrates a responsive frontend, real-time serverless backend logic via Supabase Edge Functions, and cloud-hosted storage and authentication through Supabase Postgres and Supabase Auth.

The quiz dynamically fetches data from the public PokéAPI—ensuring each game session is unique—and tailors question difficulty to the player's score. Players must log in or sign up before participating, and their final scores are submitted to a secure, cloud-hosted leaderboard.

---

## 🚀 Solution Overview

This application is a full-stack Pokémon-themed quiz game designed to simulate the development and deployment of a real-world enterprise application. It integrates cloud-native technologies, dynamic content generation, and secure authentication to deliver a responsive and engaging user experience. The architecture is composed of three key layers—frontend, middleware, and backend—each fulfilling a distinct role within the system.

Frontend
The frontend is a responsive web interface built with HTML, CSS, and vanilla JavaScript. It includes interactive components such as a theme toggle for dark/light modes, keyboard-based input for accessibility and speed, and a visual timer bar to increase gameplay pressure. All user interactions, including login, quiz progression, and leaderboard updates, are dynamically managed on the client side. The interface adapts to different screen sizes, ensuring usability across desktop and mobile devices.

Middleware (Edge Functions)
Middleware logic is implemented using Supabase Edge Functions, which serve as the application’s core API layer. These functions act as stateless services that generate quiz questions based on the player’s current score—automatically adjusting difficulty levels (easy, medium, hard, rare) using live data from the PokéAPI. Question logic is split into modular services (easyQuestions.ts, mediumQuestions.ts, hardQuestions.ts) to ensure maintainability and scalability. The use of Edge Functions ensures low latency and horizontal scalability.

Backend
The backend consists of Supabase’s fully-managed Postgres database and authentication services. Supabase Auth handles secure user signup, login, and session management using JWTs. All user actions—including submitting a score—require valid authentication. The leaderboard is stored in a relational Postgres table with row-level access control (RLS) in place to protect user data. Supabase's real-time capabilities and RESTful endpoints allow seamless integration with the frontend.

Application Workflow
A new user signs up or logs in via the authentication form.

Upon authentication, they can start a quiz session.

A GET request is made to the Edge Function with the current score as a query parameter.

The function selects a Pokémon and generates a question, returning choices and a sprite.

Users answer the question within 15 seconds; if correct, difficulty increases.

On a wrong answer or timeout, their score is submitted to the leaderboard.

The leaderboard updates and displays the top scores globally.

---

## 📌 Project Aim & Objectives

🏁 Aim
The primary aim of this project is to design, build, and deploy a secure, responsive, and scalable full-stack quiz application that reflects enterprise-grade software engineering standards. This application is not only a functional Pokémon quiz but a showcase of architectural decisions, integration of third-party APIs, and secure user management using modern cloud platforms. It demonstrates how real-time data, secure authentication, and cloud-native deployment pipelines can be effectively combined to build an enterprise-ready solution.

🎯 Objectives
✅ 1. Implement Dynamic Question Logic
Goal: Use Supabase Edge Functions and the PokéAPI to generate real-time, score-dependent quiz questions that scale in difficulty.

How It Was Achieved:

Questions are dynamically generated inside the Supabase Edge Function (pokemon-question/index.ts) using PokéAPI data.

Difficulty tiers (easy, medium, hard) are conditionally triggered based on the user’s score.

The logic is split across modular service files (easyQuestions.ts, mediumQuestions.ts, hardQuestions.ts), improving readability and maintainability.

📍 Achieved: Yes – Functionally implemented, tested, and deployed. The question system is modular and scalable.

✅ 2. Enable Secure User Authentication
Goal: Implement login, signup, and logout functionality using Supabase Auth to ensure only authenticated users can access the game and leaderboard.

How It Was Achieved:

Integrated Supabase Auth v2 (email/password-based).

Authenticated state is tracked on the frontend (client.js using onAuthStateChange()).

Only logged-in users can start the quiz or submit scores.

Auth section toggles dynamically based on user session.

📍 Achieved: Yes – Fully implemented with conditional UI logic and secure session handling.

✅ 3. Create a Real-Time Leaderboard System
Goal: Store and retrieve user scores in Supabase Postgres, prevent duplicate usernames, and update scores when appropriate.

How It Was Achieved:

Supabase database includes a leaderboard table with indexed sorting.

saveScore() function checks if the user already exists (via email), and asks before replacing the score.

loadLeaderboard() retrieves the top 5 scores and renders them dynamically.

Leaderboard is refreshed on login and after gameplay.

📍 Achieved: Yes – Leaderboard is functional, secure, and uses efficient queries.

✅ 4. Design an Interactive and Accessible Frontend
Goal: Deliver a responsive UI with support for keyboard input, dark mode, animations, and dynamic DOM updates.

How It Was Achieved:

Built entirely with vanilla JavaScript, CSS, and HTML.

Themed UI toggle (themeToggle.onclick) changes between light/dark modes.

Keyboard input (1–4) allows for quick answers.

A timer bar visually counts down each question.

Responsive layout works on desktop and mobile.

📍 Achieved: Yes – All design goals implemented and verified on various screen sizes.

✅ 5. Ensure Enterprise-Level Architecture
Goal: Apply best practices in modular design, error handling, security, and deployment to reflect enterprise development standards.

How It Was Achieved:

Modular code separation: services, edge functions, and client logic are clearly separated.

Secure keys are stored in secret_key.env and never exposed on the frontend.

Robust try/catch blocks are in place for question loading, auth, leaderboard fetches, and score submissions.

Edge Functions deployed using supabase functions deploy.

Middleware (server.js) provides static file serving, and can be swapped for Netlify/Vercel deployment.

📍 Achieved: Yes – Architecture is modular, secure, and scalable with clear deployment pipeline.

---

## 📋 Feature Overview

| Feature | Purpose | Code Location & Components |
|--------|---------|-----------------------------|
| **Dynamic Quiz Engine** | Dynamically generates quiz questions based on the user’s score. The difficulty increases with progress—from type-based to classification-based questions. | `supabase/functions/pokemon-question/index.ts`<br>`services/easyQuestions.ts`, `mediumQuestions.ts`, `hardQuestions.ts` |
| **Leaderboard System** | Displays the top 5 scores and allows players to submit or update their scores after each session. Duplicate usernames are prompted for confirmation. | `client.js` (`loadLeaderboard()`, `saveScore()`)<br>Supabase leaderboard table<br>`index.html` (`#leaderboard`) |
| **User Authentication** | Secure login/signup using Supabase Auth. Users must be authenticated before accessing the quiz. Session is tracked and login state affects UI rendering. | `client.js` (`signupBtn`, `loginBtn`, `logoutBtn`, `handleAuth()`)<br>`index.html` (`#auth-section`) |
| **Edge Function Endpoint** | Edge Function acts as the core API for quiz question generation. Responds to GET requests with a difficulty-adjusted question payload. | `supabase/functions/pokemon-question/index.ts`<br>Endpoint: `/functions/v1/pokemon-question?score=X` |
| **Dark/Light Theme Toggle** | Enhances user experience by letting users switch between dark and light UI themes with a single click. | `client.js` (`themeToggle.onclick`)<br>`styles.css`, `index.html` |
| **Keyboard Input** | Improves accessibility and responsiveness by letting users answer via keyboard (1–4). | `client.js` (`getQuestion()`, `document.onkeydown`) |
| **Timer & Visual Bar** | Each question has a 15-second timer with a visual progress bar. Auto-triggers end if time runs out. | `client.js` (`startTimer()`), `styles.css`, `index.html` |
| **Responsive UI Design** | Ensures the app is usable across screen sizes with flexible layouts and modern UI. | `styles.css` (media queries, flexbox/grid), `index.html` |
| **Error Handling & Fallbacks** | Handles API errors, login/signup failures, and Supabase issues with user-friendly messages. | `client.js` (alerts, fallback logic)<br>`index.ts` (fallback from Supabase DB) |

---

🏗️ Enterprise Considerations (Fully Expanded with Code Examples & Explanations)
This section outlines the architectural, performance, and engineering decisions that align the Pokémon Quiz App with enterprise-grade standards of scalability, security, resilience, and deployment readiness.

📈 Performance
Optimized for low latency and minimal overhead on both the client and server.

✅ Edge Function In-Memory Caching
To avoid redundant API calls during a single function lifecycle, Pokémon data is cached in memory inside the Edge Function.

ts
Copy
Edit
// supabase/functions/pokemon-question/index.ts
const cache: Record<string, any> = {};

async function getPokemon(id: number) {
  if (!cache[id]) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    cache[id] = await res.json();
  }
  return cache[id];
}
Why it matters:
While Edge Functions are stateless between invocations, caching during a single run avoids repeated network calls when multiple components (e.g., species data) rely on the same Pokémon info.

✅ Conditional Expensive Fetches
Expensive calls like species/habitat info are only triggered for high-difficulty questions.

ts
Copy
Edit
if (difficulty === 'hard') {
  const speciesRes = await fetch(pokemon.species.url);
  const species = await speciesRes.json();
  const color = species.color.name; // Used in hard questions
}
Why it matters:
Minimizes external API load and keeps question generation fast for easier levels.

✅ Frontend Efficiency
Async operations, minimal blocking, and clean UI updates.

js
Copy
Edit
// public/client.js
async function getQuestion(score) {
  try {
    const res = await fetch(`/functions/v1/pokemon-question?score=${score}`);
    const question = await res.json();
    renderQuestion(question);
  } catch (err) {
    showError("⚠️ Could not load question.");
  }
}
Why it matters:
This ensures a responsive user experience with smooth interactions and low overhead, even on low-powered devices.

⚖️ Scalability
Built using cloud-native, stateless, and modular principles for horizontal scalability.

✅ Stateless Edge Functions
Supabase Edge Functions are stateless and scalable globally.

ts
Copy
Edit
Deno.serve(async (req) => {
  const score = Number(new URL(req.url).searchParams.get("score"));
  const question = await generateQuestion(score);
  return new Response(JSON.stringify(question));
});
Why it matters:
Stateless architecture allows edge functions to run concurrently and scale automatically without session dependency.

✅ Modular Codebase for Questions
Each difficulty level is abstracted into its own file:

ts
Copy
Edit
// services/hardQuestions.ts
export function generateSpeedQuestion(pokemon) {
  return {
    question: `What is the base speed of ${pokemon.name}?`,
    options: [...],
    answer: pokemon.stats.find(stat => stat.stat.name === 'speed').base_stat
  };
}
Why it matters:
This design allows new question types to be added or modified without affecting other modules—supporting long-term maintenance and growth.

✅ Concurrent Supabase Writes
Multiple users can save scores at the same time.

js
Copy
Edit
await supabase
  .from("leaderboard")
  .insert({ username, score });
Why it matters:
Leverages Supabase's scalable Postgres backend, which handles thousands of concurrent operations efficiently.

🛡️ Robustness
Resilient to API failures, bad input, and network issues.

✅ Try/Catch Error Handling
All fetch operations are wrapped to avoid app crashes:

js
Copy
Edit
try {
  const response = await fetch("/functions/v1/pokemon-question?score=3");
  const data = await response.json();
  displayQuestion(data);
} catch (error) {
  showError("⚠️ Could not load question.");
}
Why it matters:
Prevents runtime failures and ensures a fallback or error message is always shown.

✅ Fallback Supabase Questions
If the PokéAPI is down or slow, the app fetches a pre-defined fallback question.

ts
Copy
Edit
const { data: fallback } = await supabase
  .from("fallback_questions")
  .select("*")
  .order("id", { ascending: false })
  .limit(1)
  .single();

if (!question && fallback) {
  return new Response(JSON.stringify(fallback));
}
Why it matters:
Ensures continuity of gameplay even during external API outages.

✅ User-Friendly Error UI
Errors are communicated clearly on the frontend.

js
Copy
Edit
function showError(message) {
  questionEl.textContent = message;
  resultEl.textContent = "Try refreshing or check your connection.";
}
Why it matters:
Improves trust and usability during unexpected events.

🔐 Security
Implements best practices for protecting data, credentials, and access.

✅ Authenticated Access with Supabase
Only logged-in users can access the game and leaderboard.

js
Copy
Edit
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
Why it matters:
Prevents anonymous misuse and ensures user scores are correctly tracked.

✅ Secure Backend Key Handling
Sensitive keys are handled only in Edge Functions, never exposed to the frontend.

ts
Copy
Edit
const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
);
Why it matters:
Protects elevated privileges and ensures only secure backend operations can modify sensitive data.

✅ Public-Only Keys on Frontend
Frontend uses anonKey, restricted by Row-Level Security (RLS).

js
Copy
Edit
const supabase = window.supabase.createClient(SUPABASE_URL, ANON_KEY);
Why it matters:
Reduces risk of misuse or unauthorized data access from the client side.

✅ Row-Level Security + Hashed Passwords
Supabase RLS policies restrict access so users only see and edit their own records.

Supabase hashes passwords by default with secure algorithms (e.g., bcrypt).

Why it matters:
Implements zero-trust security by default, protecting user identity and data integrity.

🚀 Deployment
Designed for rapid iteration and scalable deployment.

✅ Edge Function Deployment
bash
Copy
Edit
npx supabase functions deploy pokemon-question
Why it matters:
Easily deploys stateless functions globally using CLI tools with zero downtime.

✅ Frontend Local or Cloud Hosting
bash
Copy
Edit
node server.js
Why it matters:
Supports local development via Express server or cloud hosting via Netlify, Vercel, or GitHub Pages.

✅ Secure Environment Variables
env
Copy
Edit
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-secret-role-key
Why it matters:
Prevents credentials from being exposed in public repositories or browser JavaScript.

✅ CI/CD Ready
Easily adaptable to GitHub Actions, Netlify Deploy Hooks, or custom pipelines.

yaml
Copy
Edit
# .github/workflows/deploy.yml
- name: Deploy Edge Function
  run: npx supabase functions deploy pokemon-question
Why it matters:
Enables automated testing, linting, and deployment for faster, safer iterations.

---

## 🛠️ Installation & Usage Instructions

### 🔧 Prerequisites

- Node.js (v16+)
- Supabase CLI
- Supabase account/project

### ⚙️ Setup Steps

```bash
git clone <your-repo-url>
cd <your-repo-name>
npm install
npx supabase login
npx supabase link --project-ref <your-project-id>
```

Create a `.env` or `secret_key.env` file and add:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### ▶️ Running the Application

```bash
npx supabase start
npx supabase functions deploy pokemon-question
node server.js
```

Then open [http://localhost:3000](http://localhost:3000)

---

🐛 Known Issues & Future Enhancements
While the Pokémon Quiz application is fully functional and aligns with modern enterprise software engineering practices, there are several known limitations that affect user experience and system capabilities. Additionally, a number of enhancements are planned to improve performance, usability, accessibility, and maintainability in future iterations.

🔍 Known Issues
Incomplete or Inconsistent Data from PokéAPI
Some Pokémon entries retrieved from the PokéAPI may lack complete metadata such as:

Missing sprites (e.g., broken or undefined image URLs)

Undefined species classification (used in hard questions)

Inconsistent ability/type structures for edge cases

Impact:
This causes the application to either skip questions or fall back to backup data stored in the fallback_questions table. While the system degrades gracefully, it reduces the variety and difficulty of questions available to the user.

Workaround:
The Edge Function attempts to detect missing data and fetch a predefined fallback question to avoid blank or broken experiences.

Leaderboard Requires Manual Refresh
The leaderboard is populated using a static SELECT query on page load or after submitting a score. It does not yet support real-time updates, meaning:

Scores submitted by other players do not appear unless the page is refreshed.

Players do not get immediate feedback about their global ranking position post-submission.

Impact:
This breaks immersion in competitive gameplay and limits the real-time interactivity of the application.

Minimal Profile & Score Management
The current leaderboard logic uses the authenticated user's email as a display name and:

Does not support custom usernames, avatars, or editable profiles.

Prevents users from submitting a score more than once without confirmation.

Does not distinguish between multiple scores from the same user.

Impact:
Limits user engagement and personalization. Could confuse users who want to track multiple quiz attempts or improve scores without overwriting data.

Limited Error Feedback & Recovery Options
While most API failures are caught and handled with user-friendly alerts, some scenarios do not:

Allow retrying without refreshing the page

Distinguish between recoverable and non-recoverable errors

Display detailed error messages in case of login/signup failure (e.g., bad password, email taken)

Impact:
Reduces the overall robustness and accessibility of the application for less technical users.

Lack of Offline Support
The application depends entirely on a live connection to PokéAPI and Supabase. There is no Service Worker or caching strategy to:

Load fallback UI in offline mode

Allow minimal play with cached questions

Resume failed submissions when network is restored

Impact:
Prevents use in unreliable network environments and may disrupt user sessions during brief disconnects.

🌱 Future Enhancements
Real-Time Leaderboard with Supabase Realtime
Implementing Supabase Realtime will allow:

Instant updates to leaderboard scores across clients

Automatic re-rendering of leaderboard components when new scores are inserted

Live competition feel without refreshing

Benefit:
Enhances interactivity, fairness, and the competitive gaming experience.

Audio Feedback & Animations
To improve engagement and accessibility:

Add sound effects for correct/wrong answers and timers

Use animations for question transitions and score updates

Provide visual emphasis for key actions (e.g., countdown beeps)

Benefit:
Makes gameplay more immersive and fun, especially for children or casual users.

OAuth Login Support
Support for third-party authentication (e.g., Google, GitHub, Apple) using Supabase Auth providers:

js
Copy
Edit
await supabase.auth.signInWithOAuth({ provider: 'google' });
Benefit:
Reduces login friction, improves security, and increases sign-up rates. Useful for mobile devices where email/password entry is less convenient.

Accessibility Improvements
Enhancements under consideration include:

Screen reader compatibility for all question/answer elements

Keyboard-only navigation throughout all views

Colorblind-friendly themes and contrast tuning

ARIA labels on interactive components

Benefit:
Expands usability to all users, including those with visual, motor, or cognitive impairments.

Multi-Language Support (i18n)
Support for different languages by externalizing all UI text and messages into translation files (e.g., en.json, es.json, fr.json).

Benefit:
Broadens accessibility for international users and aligns with global best practices for inclusivity.

Profile Management & Session History
Future upgrades may allow users to:

Set a custom username and avatar

Track high scores and attempt history

Reset or update previously saved scores

Benefit:
Builds deeper user engagement and opens the door for gamification (e.g., badges, milestones).

Offline Support (PWA & Caching)
Implement a Service Worker to:

Cache key assets and questions

Detect offline mode and serve fallback UI

Retry submissions after reconnecting

Benefit:
Makes the app usable in low-connectivity environments (e.g., public transit, schools).

Automated CI/CD Deployment
Integrate CI/CD pipelines using GitHub Actions, Vercel, or Netlify to:

Automatically deploy Edge Functions and frontend on commit

Run linting, testing, and build steps in each pull request

Benefit:
Reduces manual work, enforces quality, and ensures a consistent development workflow.

Unit, Integration & End-to-End Testing
Expand test coverage using tools like:

vitest or jest for logic testing

playwright or cypress for frontend E2E scenarios

Supabase mock APIs for testing DB logic without real calls

Benefit:
Improves code reliability and enables faster iteration with confidence during feature updates.

---

## 📚 References

- [Supabase Documentation](https://supabase.com/docs)
- [PokéAPI](https://pokeapi.co/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Supabase Frontend Starter Template](https://github.com/supabase/supabase/tree/master/examples)
- [Github Repositary](https://github.com/Abdul-Ada/Enterprise-Software-Engineering)
