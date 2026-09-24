# Assessment UX Prototype

Proof-of-concept for a structured question builder that renders programming questions as readable, formatted code blocks — independent of any backend, using React state + localStorage + JSON seed data.

## Flow

```
/builder  →  /preview  →  /result
 Builder    Test Taking   Result
```

## Stack

- React + Vite
- Tailwind CSS v4
- React Router
- Lucide React
- localStorage + JSON mock data

## Run with Docker

```bash
# production build on http://localhost:4173
docker compose up app

# dev server with hot reload on http://localhost:5173
docker compose up dev
```

## Run locally

```bash
npm install
npm run dev
```

## Features

### Builder
- Set title, duration, passing percentage
- Add / edit / delete MCQ and code questions
- Code questions use a dedicated code textarea (not a giant question field)
- Persists to `localStorage` (`assessment_test`, `assessment_questions`)

### Assessment (Preview)
- Single-question-at-a-time flow with question palette
- Answered / unvisited / current states (shape + color, not color alone)
- Working countdown timer with auto-submit at 00:00
- `CodeBlock` with line numbers, language label, copy button, horizontal scroll, lightweight syntax highlighting
- Attempt state persists to `assessment_attempt`

### Result
- Score, percentage, correct / incorrect / unanswered counts
- Time taken and pass / fail derived from data
- Full question review; code questions re-render with formatted code

## Project structure

```
src/
├── components/
│   ├── builder/       # TestSettings, QuestionForm, QuestionList, QuestionCard
│   ├── assessment/    # QuestionRenderer, CodeBlock, MCQOptions, QuestionNavigator, Timer
│   └── result/        # ScoreCard, ResultStats, QuestionReview
├── pages/             # Builder, Preview, Result
├── data/              # mockQuestions.json
├── hooks/             # useLocalStorage
└── utils/             # assessment.js (scoring), storage.js (localStorage API)
```

## localStorage keys

| Key | Purpose |
| --- | --- |
| `assessment_test` | Test settings |
| `assessment_questions` | Question bank |
| `assessment_attempt` | In-progress candidate state |
| `assessment_result` | Last submitted result |
