import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react'
import CodeBlock from '../assessment/CodeBlock.jsx'
import { getQuestionStatus, optionLabel } from '../../utils/assessment.js'

export default function QuestionReview({ questions, answers }) {
  return (
    <div className="card p-5 sm:p-6">
      <h2 className="section-title">Question Review</h2>
      <p className="muted mt-1">Check your answers and review code questions in full format.</p>

      <div className="mt-5 space-y-4">
        {questions.map((question, index) => {
          const status = getQuestionStatus(question, answers)
          const given = answers[question.id]
          const hasAnswer = given !== undefined && given !== null

          const tone =
            status === 'correct'
              ? {
                  border: 'border-emerald-200',
                  bg: 'bg-emerald-50/60',
                  icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
                  label: 'Correct',
                  labelClass: 'text-emerald-700',
                }
              : status === 'incorrect'
                ? {
                    border: 'border-red-200',
                    bg: 'bg-red-50/50',
                    icon: <XCircle className="h-5 w-5 text-red-600" />,
                    label: 'Incorrect',
                    labelClass: 'text-red-700',
                  }
                : {
                    border: 'border-slate-200',
                    bg: 'bg-slate-50',
                    icon: <MinusCircle className="h-5 w-5 text-slate-500" />,
                    label: 'Unanswered',
                    labelClass: 'text-slate-600',
                  }

          return (
            <div
              key={question.id}
              className={`rounded-xl border ${tone.border} ${tone.bg} p-4 sm:p-5`}
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5">{tone.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Question {index + 1}</p>
                    <p className={`text-xs font-semibold ${tone.labelClass}`}>{tone.label}</p>
                  </div>
                </div>
                <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                  {question.type === 'code' ? 'Code Question' : 'MCQ'} · {question.marks} mark
                  {question.marks === 1 ? '' : 's'}
                </span>
              </div>

              <p className="mb-3 text-sm font-medium leading-relaxed text-slate-800">
                {question.questionText}
              </p>

              {question.type === 'code' && (
                <div className="mb-4">
                  <CodeBlock code={question.code} language={question.language} />
                </div>
              )}

              <div className="space-y-1.5 text-sm">
                {hasAnswer && (
                  <p className={status === 'correct' ? 'text-emerald-700' : 'text-red-700'}>
                    <span className="font-semibold">Your answer:</span> {optionLabel(given)} —{' '}
                    {question.options[given]}
                  </p>
                )}
                {!hasAnswer && <p className="text-slate-600">Your answer: —</p>}
                {status !== 'correct' && (
                  <p className="text-slate-700">
                    <span className="font-semibold">Correct answer:</span>{' '}
                    {optionLabel(question.correctAnswer)} — {question.options[question.correctAnswer]}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
