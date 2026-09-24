import { CheckCircle2, XCircle } from 'lucide-react'
import { formatDuration, formatDateTime } from '../../utils/assessment.js'

export default function ScoreCard({ result }) {
  const passed = result.passed

  return (
    <div className="card overflow-hidden">
      <div
        className={`px-6 py-8 text-center sm:px-8 sm:py-10 ${
          passed ? 'bg-gradient-to-b from-emerald-50 to-white' : 'bg-gradient-to-b from-red-50 to-white'
        }`}
      >
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
            passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {passed ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
        </div>

        <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
          {passed ? 'Assessment Completed' : 'Assessment Failed'}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{result.title}</p>

        <div className="mt-6">
          <p className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            {result.percentage}%
          </p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Score
          </p>
        </div>

        <div
          className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${
            passed ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {passed ? 'PASSED' : 'FAILED'}
          <span className="opacity-80">·</span>
          <span className="opacity-90">Pass mark {result.passingPercentage}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 border-t border-slate-100 sm:grid-cols-4 sm:divide-y-0">
        <div className="px-4 py-5 text-center">
          <p className="text-lg font-bold text-slate-900">
            {result.score} / {result.totalMarks}
          </p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Marks
          </p>
        </div>
        <div className="px-4 py-5 text-center">
          <p className="text-lg font-bold text-slate-900">{formatDuration(result.timeTaken)}</p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Time
          </p>
        </div>
        <div className="px-4 py-5 text-center">
          <p className="text-lg font-bold text-emerald-600">{result.correct}</p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Correct
          </p>
        </div>
        <div className="px-4 py-5 text-center">
          <p className="text-lg font-bold text-red-600">{result.incorrect}</p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Incorrect
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1 border-t border-slate-100 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:justify-between">
        <span>Started: {formatDateTime(result.startedAt)}</span>
        <span>Submitted: {formatDateTime(result.submittedAt)}</span>
      </div>
    </div>
  )
}
