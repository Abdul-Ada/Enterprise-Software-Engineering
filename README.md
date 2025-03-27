# Pokémon Quiz – Enterprise Software Engineering Project

## 🧠 Introduction

This project is a full-stack enterprise web application developed for the **Enterprise Software Engineering** module. It is a secure, scalable, and responsive Pokémon quiz game that pulls live data from the PokéAPI using Supabase Edge Functions. Players answer progressively harder questions within a time limit, and their scores are submitted to a live leaderboard. The app showcases enterprise principles such as modular architecture, cloud deployment, and robust error handling.

---

## 🚀 Solution Overview

This application is a full-stack Pokémon-themed quiz game that combines real-time data, secure authentication, and dynamic gameplay. Built using Supabase and vanilla JavaScript, the solution features three integrated layers:

- **Frontend**: A responsive interface with theme toggle, keyboard support, and animations that delivers an engaging user experience.
- **Middleware**: Supabase Edge Functions dynamically generate quiz questions based on player score and difficulty, using real-time data from the PokéAPI.
- **Backend**: Supabase Postgres stores leaderboard scores, while Supabase Auth secures login/signup and enforces access control.

The game adapts question difficulty as the user progresses, supports user authentication, and records scores in a global leaderboard. Error handling and fallback mechanisms ensure the app remains responsive even during API issues. The architecture is modular, scalable, and optimized for performance and security.

---

## 📌 Project Aim & Objectives

### **Aim**

The primary aim of this project is to **design, build, and deploy a secure, responsive, and scalable full-stack quiz application** that showcases enterprise-grade architecture. The application is intended to demonstrate how dynamic APIs, real-time data processing, and secure authentication can be integrated using modern cloud-based technologies like Supabase.

### **Objectives**

- ✅ **Implement Dynamic Question Logic**  
  Use Supabase Edge Functions and PokéAPI to generate dynamic, real-time quiz questions that scale with the user's score.

- ✅ **Enable Secure User Authentication**  
  Use Supabase Auth to handle user registration, login, and logout, ensuring secure access to the app and leaderboard.

- ✅ **Create a Real-Time Leaderboard System**  
  Store scores in Supabase Postgres. Implement update logic to prevent duplicate entries and maintain a competitive global ranking.

- ✅ **Design an Interactive and Accessible Frontend**  
  Build a responsive and engaging UI with dark mode, keyboard controls, and animations for all screen sizes.

- ✅ **Ensure Enterprise-Level Architecture**  
  Apply modular code structure, error handling, cloud deployment, and environment variable security practices.

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

## 🏗️ Enterprise Considerations

| Area | Details |
|------|---------|
| **Performance** | Supabase Edge Functions minimize load using caching. Expensive operations like species lookup are conditional. Lightweight frontend logic ensures a responsive experience. |
| **Scalability** | Stateless edge functions scale horizontally. Supabase Postgres supports concurrent read/writes. Modular code enables easy feature extensions. |
| **Robustness** | All fetch and async logic uses `try/catch`. Fallback content is loaded from a Supabase table if the PokéAPI fails. |
| **Security** | Only the `anonKey` is exposed on the frontend. Supabase Auth is used for secure authentication. Passwords are hashed. RLS protects sensitive data. |
| **Deployment** | Supabase Edge Functions are deployed via CLI. Frontend is served via `node server.js` or hosted on Netlify/Vercel. Environment variables manage credentials securely. |

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

## 🐛 Known Issues & Future Enhancements

While the Pokémon Quiz application is fully functional and demonstrates key enterprise software engineering principles, there are a few known limitations and opportunities for future improvement.

### Known Issues

Some Pokémon entries returned by the PokéAPI may be missing data such as sprites or species classifications, which can result in fallback questions. The leaderboard currently supports only simple username tracking via email. Real-time updates are not implemented yet and require a page refresh. Some network errors may display fallback UI but not always offer retry options.

### Future Enhancements

Planned improvements include real-time leaderboard updates using Supabase Subscriptions, adding sound effects and animations, and offering OAuth login support (Google/GitHub). UI accessibility improvements, multi-language support, and fully automated CI/CD deployment pipelines are also on the roadmap. Automated testing (unit and integration) will improve long-term reliability and maintainability.

---

## 📚 References

- [Supabase Documentation](https://supabase.com/docs)
- [PokéAPI](https://pokeapi.co/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Supabase Frontend Starter Template](https://github.com/supabase/supabase/tree/master/examples)