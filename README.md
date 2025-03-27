Pokémon Quiz – Enterprise Software Engineering Project
🧠 Introduction
This project is a full-stack enterprise web application developed for the Enterprise Software Engineering module. It is a real-time Pokémon quiz that dynamically pulls data from the PokéAPI using Supabase Edge Functions. Users answer timed questions, and scores are submitted to a global leaderboard.

🚀 Solution Overview
The app challenges users to identify Pokémon types, abilities, stats, and more, progressing from easy to difficult questions. Scores are tracked and stored in Supabase, allowing users to compete on a live leaderboard.

🎯 Project Aim & Objectives
Aim:
To design, build, and demonstrate a scalable, interactive, and secure full-stack quiz application.

Objectives:

✅ Implement dynamic question generation with Supabase Edge Functions.

✅ Store and retrieve user scores using Supabase Postgres.

✅ Authenticate and manage usernames with update logic.

✅ Build a responsive, animated UI with dark/light theme toggle.

✅ Deploy and test all three layers: frontend, middleware, and backend.

📋 Feature Overview
Feature	Description	Location
Dynamic Quiz	Loads questions via Supabase Edge Function based on player score (difficulty curve)	supabase/functions/pokemon-question/index.ts
Leaderboard	Stores top scores in Supabase. If a username exists, asks before replacing.	client.js, index.html, Supabase DB
Dark/Light Mode	Toggle button to switch UI theme.	client.js, styles.css
Keyboard Support	Users can press 1–4 keys to answer faster.	client.js
Timer Bar	Visual countdown for each question.	client.js, styles.css
Responsive UI	Works on mobile and desktop, styled with glassy buttons and icons.	styles.css
Error Handling & Fallbacks	Graceful error messages and UI fallbacks.	client.js

Have you successfully implemented key functionalities?
Is the application fully functional and meeting its intended purpose?

🏗️ Enterprise Considerations
Area	Details
Performance	Edge Function optimizes API calls (e.g., species lookup only if needed). Question difficulty progresses logically.
Scalability	Stateless function-based architecture. Uses Supabase for scalable Postgres hosting.
Robustness	Includes error handling for API failure, user input, and timeouts. Leaderboard updates are conditional.
Security	Only the anon key is exposed. Supabase handles access with RLS and roles. Production setup would hide service roles.
Deployment	Middleware is deployed via Supabase Edge Functions. Frontend runs locally or on any static hosting provider.

Is the three-layer architecture well-structured?
Are enterprise-grade qualities (security, scalability, robustness) considered?

🛠️ Installation & Usage Instructions
🔧 Prerequisites
Node.js (v16+)

Supabase CLI

Supabase account

curl for testing Edge Functions locally (optional)

⚙️ Setup
bash
Copy
Edit
git clone <repo-url>
cd <repo>
npm install
Ensure Supabase is installed and logged in:

supabase start

bash
Copy
Edit
npx supabase login
npx supabase link --project-ref <your-project-id>
▶️ Running the App Locally
bash
Copy
Edit
# Deploy your Edge function
npx supabase functions deploy pokemon-question

# Start the local server
node server.js

# Open browser
http://localhost:3000
🔄 Deployment
Supabase Edge Functions: Deployed via npx supabase functions deploy

Frontend: Runs locally from public/ or can be hosted via Netlify, Vercel, etc.

No hardcoded service role keys in frontend


Has the application been successfully deployed?
Have best deployment practices (e.g., securing environment variables) been followed?


🐛 Known Issues & Future Enhancements
 No user login/auth (username is manually entered).

 Some Pokémon data is missing or inconsistent.

 Add real-time leaderboard (via Supabase subscriptions).

 Add sprite animation / sound effects.

 Deploy frontend to Netlify with build pipeline.

📚 References
Supabase Documentation

PokéAPI

MDN Web Docs

Supabase Frontend Starter Template