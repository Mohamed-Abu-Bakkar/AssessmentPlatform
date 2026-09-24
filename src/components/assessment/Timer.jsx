import { formatClock } from '../../utils/assessment.js'

export default function Timer({ secondsRemaining }) {
  const isUrgent = secondsRemaining <= 60
  const isWarning = secondsRemaining <= 300 && !isUrgent

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm font-semibold tabular-nums ${
        isUrgent
          ? 'border-red-200 bg-red-50 text-red-700'
          : isWarning
            ? 'border-amber-200 bg-amber-50 text-amber-700'
            : 'border-slate-200 bg-slate-50 text-slate-700'
      }`}
      role="timer"
      aria-live={isUrgent ? 'assertive' : 'off'}
      aria-label={`Time remaining ${formatClock(secondsRemaining)}`}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {formatClock(secondsRemaining)}
      {isUrgent && <span className="sr-only">Time is running out</span>}
    </div>
  )
}
