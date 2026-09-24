The goal is to prove one idea:

A structured question builder can produce a much more readable candidate assessment experience, especially for programming questions, while preserving the familiar assessment flow.

The prototype should be independent of Codelytix's backend and use React state + localStorage + JSON seed data.

1. Prototype Scope
                  ASSESSMENT UX PROTOTYPE

                         ┌───────────────┐
                         │ Test Builder  │
                         │    Page 1     │
                         └───────┬───────┘
                                 │
                         Add Questions
                                 │
                                 ▼
                         ┌───────────────┐
                         │ Test Preview  │
                         │    Page 2     │
                         └───────┬───────┘
                                 │
                              Submit
                                 │
                                 ▼
                         ┌───────────────┐
                         │ Test Result   │
                         │    Page 3     │
                         └───────────────┘
Explicitly out of scope

Don't build these yet:

Authentication
Backend
Database
Proctoring
Copy/paste detection
Real API integration
Admin roles
Candidate accounts
Deployment infrastructure
Email
Analytics

That keeps the contribution focused.

2. Technology Requirements

Use:

React
Vite
Tailwind CSS
React Router
Lucide React
localStorage
JSON

I would not add Redux, Zustand, TanStack Query, Axios, or a backend at this stage.

The application is small enough that React state + localStorage is sufficient.

3. Project Structure

I'd use:

assessment-ux-prototype/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── builder/
│   │   │   ├── QuestionForm.jsx
│   │   │   ├── QuestionList.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   └── TestSettings.jsx
│   │   │
│   │   ├── assessment/
│   │   │   ├── QuestionRenderer.jsx
│   │   │   ├── CodeBlock.jsx
│   │   │   ├── MCQOptions.jsx
│   │   │   ├── QuestionNavigator.jsx
│   │   │   └── Timer.jsx
│   │   │
│   │   └── result/
│   │       ├── ScoreCard.jsx
│   │       ├── ResultStats.jsx
│   │       └── QuestionReview.jsx
│   │
│   ├── pages/
│   │   ├── Builder.jsx
│   │   ├── Preview.jsx
│   │   └── Result.jsx
│   │
│   ├── data/
│   │   └── mockQuestions.json
│   │
│   ├── hooks/
│   │   └── useLocalStorage.js
│   │
│   ├── utils/
│   │   ├── assessment.js
│   │   └── storage.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── README.md

This structure deliberately separates question authoring, candidate assessment, and result rendering.

4. Page 1 — Test Builder

This is the most important page from the contribution perspective.

Layout
┌─────────────────────────────────────────────────────┐
│ Codelytix-style Assessment Builder                  │
│                                                     │
│ Create Assessment                                   │
│ Build and preview your assessment                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Test Information                                    │
│                                                     │
│ Title                                               │
│ [ Full Stack Developer - Round 2 ]                  │
│                                                     │
│ Duration                 Passing Percentage         │
│ [ 15 min ]                [ 80% ]                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Questions                          [+ Add Question] │
│                                                     │
│ ┌───────────────────────────────────────────────┐   │
│ │ Q1   JavaScript Scope                    ⋮   │   │
│ │      Code Question · 1 mark                  │   │
│ └───────────────────────────────────────────────┘   │
│                                                     │
│ ┌───────────────────────────────────────────────┐   │
│ │ Q2   JavaScript Operators                 ⋮   │   │
│ │      MCQ · 1 mark                            │   │
│ └───────────────────────────────────────────────┘   │
│                                                     │
│                         [ Preview Test ]             │
└─────────────────────────────────────────────────────┘
5. Add Question

Clicking:

+ Add Question

opens a modal/drawer.

Question type
Question Type

○ Multiple Choice
○ Code Question
6. MCQ Form
Question

[ What is the output of 2 + "2"? ]

Options

A  [ 22                          ]
B  [ 4                           ]
C  [ Error                       ]
D  [ undefined                   ]

Correct Answer

[ A ▼ ]

Marks

[ 1 ]

                    [Cancel] [Add Question]
7. Code Question Form

This is where your actual contribution becomes visible.

Question

[ What is the output of the following code? ]

Language

[ JavaScript ▼ ]

Code

┌─────────────────────────────────────────────┐
│ 1  var x = 10;                              │
│ 2                                           │
│ 3  function foo() {                         │
│ 4      var x = 5;                           │
│ 5      console.log(x);                      │
│ 6  }                                        │
│ 7                                           │
│ 8  foo();                                   │
│ 9  console.log(x);                          │
└─────────────────────────────────────────────┘

Options

A [ 10, 10 ]
B [ 10, 5  ]
C [ 5, 10  ]
D [ 5, 5   ]

Correct Answer
[ D ]

Marks
[ 1 ]

                 [Cancel] [Add Question]
Important

The authoring form itself should provide a code textarea/editor, rather than asking the question author to paste everything into one giant question field.

8. Mock JSON

Start with something like:

{
  "test": {
    "id": "demo-test-001",
    "title": "Full Stack Developer - Round 2",
    "duration": 15,
    "passingPercentage": 80
  },
  "questions": [
    {
      "id": "q1",
      "type": "code",
      "questionText": "What is the output of the following code?",
      "language": "javascript",
      "code": "var x = 10;\n\nfunction foo() {\n    var x = 5;\n    console.log(x);\n}\n\nfoo();\nconsole.log(x);",
      "options": [
        "10, 10",
        "10, 5",
        "5, 10",
        "5, 5"
      ],
      "correctAnswer": 3,
      "marks": 1
    },
    {
      "id": "q2",
      "type": "mcq",
      "questionText": "Which method is used to create a new array from an existing array?",
      "options": [
        "map()",
        "push()",
        "pop()",
        "shift()"
      ],
      "correctAnswer": 0,
      "marks": 1
    }
  ]
}

The critical difference is:

"type": "code"

and:

"code": "..."

rather than putting the code inside questionText.

9. Page 2 — Test Taking

This should feel very close to the assessment screenshot you showed, but cleaner.

The original assessment uses a question navigation system and a single-question-at-a-time flow. Your prototype should preserve that basic interaction.

Header
┌──────────────────────────────────────────────────────┐
│ Full Stack Developer - Round 2       ⏱ 14:32        │
└──────────────────────────────────────────────────────┘
Question
Question 1 of 10                         Marks: 1

What is the output of the following code?

┌───────────────────────────────────────────────┐
│ 1  var x = 10;                                │
│                                               │
│ 3  function foo() {                           │
│ 4      var x = 5;                             │
│ 5      console.log(x);                        │
│ 6  }                                          │
│                                               │
│ 8  foo();                                     │
│ 9  console.log(x);                            │
└───────────────────────────────────────────────┘

○ 10, 10

○ 10, 5

○ 5, 10

○ 5, 5

This is the part that directly addresses your original problem.

10. Code Renderer

Create a dedicated:

CodeBlock.jsx

Don't put code rendering directly inside QuestionRenderer.

Conceptually:

<QuestionRenderer question={question} />

then:

if (question.type === "code") {
    return (
        <>
            <QuestionText />
            <CodeBlock
                code={question.code}
                language={question.language}
            />
            <MCQOptions />
        </>
    );
}

This separation will make the eventual contribution much easier to integrate into another application.

11. CodeBlock Design

Minimum version:

┌───────────────────────────────────────────┐
│ JavaScript                         Copy   │
├───────────────────────────────────────────┤
│ 1  var x = 10;                            │
│                                           │
│ 3  function foo() {                       │
│ 4      var x = 5;                         │
│ 5      console.log(x);                    │
│ 6  }                                      │
└───────────────────────────────────────────┘

Requirements:

Monospace font
Preserve whitespace
Preserve indentation
Line numbers
Horizontal scrolling
Syntax highlighting
Copy button
Language label

Don't make the code editor editable during the candidate test.

12. Question Navigator

At the bottom:

Previous                         Next

and:

Question Palette

[1] [2] [3] [4] [5] [6] [7] [8] [9] [10]

Use states:

Unvisited
Answered
Current

For example:

1  2  3  4  5  6  7  8  9  10
●  ●  ○  ○  ●  ●  ○  ○  ○   ○

Don't rely only on color; use visual state differences so accessibility is reasonable.

13. Timer

Create:

Timer.jsx

Initial value:

15 * 60

Display:

14:32

Behavior:

Start test
     ↓
Countdown
     ↓
00:00
     ↓
Automatic submission
     ↓
Result

For the prototype, the timer should actually work.

14. Test State

Keep the candidate state separate from the question data.

For example:

{
  currentQuestion: 0,

  answers: {
    q1: 3,
    q2: 0
  },

  startedAt: "...",
  submittedAt: null,

  timeRemaining: 872
}

This will make the result calculation straightforward.

15. Page 3 — Result

Follow the visual language of the screenshot you provided.

┌──────────────────────────────────────────────┐
│                                              │
│              ✓                               │
│                                              │
│        Assessment Completed                  │
│                                              │
│     Full Stack Developer - Round 2           │
│                                              │
│                  80%                         │
│                  Score                       │
│                                              │
├──────────┬──────────┬──────────┬────────────┤
│ 8 / 10   │ 12m 34s  │    8     │     2      │
│ Marks    │ Time     │ Correct  │ Incorrect  │
└──────────┴──────────┴──────────┴────────────┘

             PASSED

Started: ...
Submitted: ...

Question Review

If score is below the passing percentage:

Assessment Failed
53%

like the screenshot.

16. Result Calculation

Create:

src/utils/assessment.js

Functions:

calculateScore()
calculatePercentage()
calculateCorrectAnswers()
calculateIncorrectAnswers()
calculateUnanswered()
calculateResult()

Example:

10 questions
8 correct
1 incorrect
1 unanswered

Marks = 8 / 10
Percentage = 80%
Passing = 80%

Result = PASS

Don't hardcode the result page.

It should derive the result from the candidate's answers.

17. Question Review

At the bottom of the result:

Question Review

✓ Question 1
Correct
Your answer: D

✓ Question 2
Correct
Your answer: A

✕ Question 3
Incorrect
Your answer: B
Correct answer: C

For a code question, allow the candidate to see the formatted code again.

This reinforces the point of the prototype.

18. localStorage Architecture

Use localStorage for:

assessment_test
assessment_questions
assessment_attempt
assessment_result

But don't scatter:

localStorage.setItem(...)

through every component.

Create:

src/utils/storage.js

with:

getTest()
saveTest()

getQuestions()
saveQuestions()

getAttempt()
saveAttempt()

clearAttempt()

Then components don't need to know how persistence works.

19. Routing

Use:

/                         → Builder

/builder                  → Builder

/preview                  → Test Taking

/result                   → Result

Potentially later:

/question/:id

but don't introduce unnecessary routes now.

The flow should be:

/builder
    │
    │ Preview Test
    ▼
/preview
    │
    │ Submit
    ▼
/result
20. Important UX Decision

I would not make the builder and candidate UI identical.

They should share the design system but have different priorities.

Builder

Focus:

Create
Edit
Organize
Preview
Candidate

Focus:

Read
Answer
Navigate
Submit
Result

Focus:

Understand
Score
Review

This makes the prototype feel like an actual product rather than three screenshots connected together.

21. Design System

Use a small set of reusable UI rules.

Typography

Use:

Inter / Plus Jakarta Sans

and:

JetBrains Mono

for code.

The existing site uses Plus Jakarta Sans and Sora in its HTML, so retaining a similar typography direction will make your prototype feel familiar.

Cards
rounded-xl
border
subtle shadow
Buttons

Primary:

Preview Test
Submit Test
Add Question

Secondary:

Cancel
Previous
Back
Status

Use:

Success
Warning
Error
Neutral

But don't make the entire interface dependent on colors.

22. Responsive Design

This matters because your original issue is partly readability.

Test at:

Desktop
1366 × 768

Laptop
1280 × 720

Tablet
768px

Mobile
390px

Especially test code blocks.

A long line should become:

┌───────────────────────────────┐
│ console.log(someVeryLong... → │
│                               │
└───────────────────────────────┘

with horizontal scrolling rather than destroying the page layout.

23. Implementation Phases

Don't build all three pages simultaneously.

Phase 1 — Foundation
Create Vite project
Install Tailwind
Install React Router
Install Lucide
Create folder structure
Create global design system

Deliverable: empty routed application.

Phase 2 — Mock Data

Create:

mockQuestions.json

Include:

2 MCQs
3 code questions
JavaScript
different answer states

Deliverable: questions can be loaded into React.

Phase 3 — Builder

Implement:

TestSettings
QuestionForm
QuestionList
QuestionCard

Features:

Add MCQ
Add Code Question
Edit
Delete
Reorder later if needed
localStorage

Deliverable:

Create Test
       ↓
Add Questions
       ↓
See Questions
Phase 4 — Preview

Implement:

Timer
QuestionRenderer
CodeBlock
MCQOptions
QuestionNavigator

Deliverable:

Preview Test
      ↓
Actually take test
      ↓
Answer questions
      ↓
Submit
Phase 5 — Result

Implement:

score calculation
percentage
pass/fail
correct/incorrect
time taken
question review

Deliverable:

Submit
  ↓
Result
Phase 6 — Polish

Then improve:

responsive layout
animations
empty states
confirmation dialogs
timer warning
code copying
accessibility
loading states
error states

Don't spend time on animations before the assessment flow works.

24. Acceptance Criteria

The prototype is finished only when all of these work:

Builder
 Create a test
 Set duration
 Set passing percentage
 Add MCQ
 Add Code Question
 Edit question
 Delete question
 Questions persist after refresh
 Preview button works
Assessment
 Questions load
 Code is properly formatted
 JavaScript indentation is preserved
 Syntax highlighting works
 MCQ selection works
 Question navigation works
 Answered state is shown
 Timer counts down
 Timer automatically submits
 Manual submit works
Result
 Score calculated
 Percentage calculated
 Correct count
 Incorrect count
 Unanswered count
 Time taken
 Pass/fail
 Question review
 Code question remains readable
Persistence
 Refresh builder → questions remain
 Refresh before submission → attempt state remains, if desired
 Result is available after submission
25. The Most Important Demonstration

When you eventually show this to Codelytix, don't start with:

"I built an assessment system."

That's too broad.

Show this:

Current experience
What is the output of the following code snippet? var x = 10; function foo() { var x = 5; console.log(x); } foo(); console.log(x);
Proposed experience
What is the output of the following code snippet?

┌───────────────────────────────────────────┐
│ 1  var x = 10;                            │
│                                           │
│ 3  function foo() {                       │
│ 4      var x = 5;                         │
│ 5      console.log(x);                    │
│ 6  }                                      │
│                                           │
│ 8  foo();                                 │
│ 9  console.log(x);                        │
└───────────────────────────────────────────┘

Then:

Builder → Preview → Take Test → Result

That tells a much stronger story:

"I noticed a usability problem while taking the assessment, traced how the frontend handles questions, and built a small proof-of-concept that separates question content from code and renders programming questions in a readable format."

That is a legitimate frontend contribution proposal, rather than just a personal workaround.
