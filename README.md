# VibeCheck

**Test your creative intent before you publish.**

VibeCheck is a creator intelligence tool that helps you understand how your content will actually be perceived — before you post it.

Upload a visual, describe the vibe you’re aiming for, and get a structured breakdown:

* Vibe alignment score (0–100)
* Clear verdict
* 3 perception insights
* 3 visual improvement suggestions
* 6 audience persona reactions

This is not a chatbot.
It is a **decision engine for creators**.

---

## 🚀 Why VibeCheck

Creators often don’t know:

> “Does my content actually feel the way I intended?”

They rely on:

* guessing
* posting blindly
* inconsistent feedback

VibeCheck solves this by simulating **audience perception instantly**.

---

## ⚙️ Tech Stack

* Next.js 15 (App Router) + TypeScript
* Tailwind CSS (dark, premium UI)
* NextAuth (Auth.js)
* Prisma + PostgreSQL
* HuggingFace Inference (Llama-3.1-8B-Instruct)
* Zod for validation

---

## 🧠 How it works

1. Upload a visual
2. Enter intended vibe + context
3. Run analysis
4. Get structured feedback:

   * Score + verdict
   * What the content actually communicates
   * How different audiences react
   * What to fix

If the AI fails, the system uses a deterministic fallback so the app never crashes.

---

## 🧪 Example Use Case

**Input:**

* Vibe: *rebellious and high energy*
* Platform: TikTok
* Audience: gamers

**Output:**

* Low score if visuals are flat or muted
* Clear explanation why it fails
* Specific fixes (contrast, typography, composition)

---

## 🧩 Project Structure (Simplified)

```
app/
  api/                  # routes (auth, projects, analyze)
  (auth)/               # login/signup
  (app)/                # dashboard + projects
components/             # UI + analysis components
lib/
  analysis/             # core analysis logic
  huggingface/          # AI client
  db/                   # Prisma client
prisma/
  schema.prisma
```

---

## 🛠 Local Setup

### 1. Install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in:

```env
DATABASE_URL="your_database_url"
AUTH_SECRET="your_secret"
HUGGINGFACE_API_KEY="your_token"
AUTH_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3001"
```

### 3. Push DB schema

```bash
npm run db:push
```

### 4. Run

```bash
npm run dev
```

Open:
👉 http://localhost:3001

---

## 🔐 Authentication

* Credentials-based login
* JWT sessions
* Protected routes via middleware

---

## 📦 Storage

Local storage under `/uploads`

Can be replaced with S3/Cloudinary easily.

---

## 🧠 Analysis System

Pipeline:

```
API → analysis service → HuggingFace → fallback (if needed)
```

Key design decisions:

* Always returns structured JSON
* Never crashes on AI failure
* Uses strong prompt engineering for realistic critique

---

## 🧨 Important Notes

* Current model is text-based (no direct image vision)
* Analysis is based on intent + contextual cues
* Output is optimized for **credibility and decision-making**

---

## 🏆 Demo Focus

VibeCheck is built for:

* fast feedback
* strong opinions
* real-world creator use

---

## 📄 License

MIT
