import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { NavActions, QuestionPalette } from '../components/assessment/QuestionNavigator.jsx'
import QuestionRenderer from '../components/assessment/QuestionRenderer.jsx'
import Timer from '../components/assessment/Timer.jsx'
import {
  calculateResult,
} from '../utils/assessment.js'
import {
  clearAttempt,
  getAttempt,
  getQuestions,
  getTest,
  saveAttempt,
  saveResult,
} from '../utils/storage.js'

export default function Preview() {
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [attempt, setAttempt] = useState(null)
  const [ready, setReady] = useState(false)
  const [missing, setMissing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const submittedRef = useRef(false)

  useEffect(() => {
    const storedTest = getTest()
    const storedQuestions = getQuestions()

    if (!storedTest || !Array.isArray(storedQuestions) || storedQuestions.length === 0) {
      setMissing(true)
      setReady(true)
      return
    }

    setTest(storedTest)
    setQuestions(storedQuestions)

    const existing = getAttempt()
    if (existing && existing.testId === storedTest.id && !existing.submittedAt) {
      setAttempt(existing)
    } else {
      const fresh = {
        testId: storedTest.id,
        currentQuestion: 0,
        answers: {},
        startedAt: new Date().toISOString(),
        submittedAt: null,
        timeRemaining: (storedTest.duration || 15) * 60,
      }
      saveAttempt(fresh)
      setAttempt(fresh)
    }
    setReady(true)
  }, [])

  const submitTest = useCallback(
    (finalAttempt, reason = 'manual') => {
      if (submittedRef.current) return
      submittedRef.current = true
      setSubmitting(true)

      const submittedAt = new Date().toISOString()
      const completed = {
        ...finalAttempt,
        submittedAt,
        submitReason: reason,
      }
      const result = calculateResult({
        test,
        questions,
        answers: completed.answers ?? {},
        startedAt: completed.startedAt,
        submittedAt,
        timeRemaining: completed.timeRemaining ?? 0,
      })

      saveResult(result)
      clearAttempt()
      navigate('/result', { replace: true })
    },
    [navigate, questions, test],
  )

  useEffect(() => {
    if (!ready || !attempt || submitting || submittedRef.current) return undefined

    const id = setInterval(() => {
      setAttempt((prev) => {
        if (!prev) return prev
        const nextRemaining = Math.max(0, (prev.timeRemaining ?? 0) - 1)
        const next = { ...prev, timeRemaining: nextRemaining }
        saveAttempt(next)

        if (nextRemaining === 0) {
          clearInterval(id)
          setTimeout(() => submitTest(next, 'timeout'), 0)
        }
        return next
      })
    }, 1000)

    return () => clearInterval(id)
  }, [ready, attempt?.testId, submitting, submitTest])

  const currentIndex = attempt?.currentQuestion ?? 0
  const currentQuestion = questions[currentIndex]
  const answers = attempt?.answers ?? {}

  const handleNavigate = (index) => {
    if (!attempt || index < 0 || index >= questions.length) return
    const next = { ...attempt, currentQuestion: index }
    setAttempt(next)
    saveAttempt(next)
  }

  const handleSelect = (optionIndex) => {
    if (!attempt || !currentQuestion) return
    const next = {
      ...attempt,
      answers: { ...attempt.answers, [currentQuestion.id]: optionIndex },
    }
    setAttempt(next)
    saveAttempt(next)
  }

  const answeredCount = useMemo(
    () =>
      questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== null).length,
    [questions, answers],
  )

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading assessment…
      </div>
    )
  }

  if (missing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <AlertTriangle className="mb-4 h-10 w-10 text-amber-500" />
        <h1 className="text-lg font-bold text-slate-900">No assessment found</h1>
        <p className="mt-1 max-w-md text-sm text-slate-500">
          Build a test with at least one question in the builder, then click Preview Test.
        </p>
        <button type="button" className="btn-primary mt-5" onClick={() => navigate('/builder')}>
          Back to Builder
        </button>
      </div>
    )
  }

  if (!attempt || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Preparing questions…
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 sm:text-base">{test.title}</p>
            <p className="text-xs text-slate-500">
              {answeredCount} of {questions.length} answered
            </p>
          </div>
          <Timer secondsRemaining={attempt.timeRemaining ?? 0} />
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-4 px-4 py-5 sm:px-6">
        <QuestionPalette
          questions={questions}
          answers={answers}
          currentIndex={currentIndex}
          onNavigate={handleNavigate}
        />

        <div className="card p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <p className="text-sm font-semibold text-slate-600">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              Marks: {currentQuestion.marks}
            </span>
          </div>

          <QuestionRenderer
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id]}
            onSelect={handleSelect}
            disabled={submitting}
          />
        </div>
      </main>

      <NavActions
        questions={questions}
        currentIndex={currentIndex}
        onPrevious={() => handleNavigate(currentIndex - 1)}
        onNext={() => handleNavigate(currentIndex + 1)}
        onSubmit={() => setConfirmSubmit(true)}
        isSubmitting={submitting}
      />

      {confirmSubmit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setConfirmSubmit(false)
          }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-bold text-slate-900">Submit assessment?</h2>
            <p className="mt-2 text-sm text-slate-600">
              You answered {answeredCount} of {questions.length} questions. Unanswered questions
              will be marked incorrect.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setConfirmSubmit(false)}>
                Keep working
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setConfirmSubmit(false)
                  submitTest(attempt, 'manual')
                }}
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
