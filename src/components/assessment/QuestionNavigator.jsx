function StatusDot({ status }) {
  if (status === 'answered') {
    return (
      <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
    )
  }
  return <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-slate-300 bg-white" />
}

export function QuestionPalette({ questions, answers, currentIndex, onNavigate }) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-slate-900">Question Palette</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <StatusDot status="answered" /> Answered
          </span>
          <span className="inline-flex items-center gap-1.5">
            <StatusDot status="unvisited" /> Unanswered
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-brand-600 text-[10px] font-bold text-white">
              {currentIndex + 1}
            </span>
            Current
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {questions.map((question, index) => {
          const isCurrent = index === currentIndex
          const answered = answers[question.id] !== undefined && answers[question.id] !== null

          let className =
            'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 '
          if (isCurrent) {
            className += 'border-brand-600 bg-brand-600 text-white shadow-sm '
          } else if (answered) {
            className += 'border-emerald-300 bg-emerald-50 text-emerald-700 '
          } else {
            className += 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 '
          }

          const stateLabel = isCurrent ? 'current' : answered ? 'answered' : 'unvisited'

          return (
            <button
              key={question.id}
              type="button"
              className={className}
              onClick={() => onNavigate(index)}
              aria-label={`Question ${index + 1}, ${stateLabel}`}
              aria-current={isCurrent ? 'true' : undefined}
            >
              <span className="flex items-center gap-1.5">
                {index + 1}
                {!isCurrent && <StatusDot status={answered ? 'answered' : 'unvisited'} />}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function NavActions({
  questions,
  currentIndex,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting = false,
}) {
  const isFirst = currentIndex === 0
  const isLast = currentIndex >= questions.length - 1

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          className="btn-secondary flex-1 sm:w-auto sm:flex-none"
          onClick={onPrevious}
          disabled={isFirst}
        >
          Previous
        </button>

        <span className="hidden text-xs font-semibold text-slate-500 sm:block">
          {currentIndex + 1} / {questions.length}
        </span>

        <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
          {!isLast && (
            <button
              type="button"
              className="btn-secondary flex-1 sm:w-auto sm:flex-none"
              onClick={onNext}
            >
              Next
            </button>
          )}
          <button
            type="button"
            className="btn-primary flex-1 sm:w-auto sm:flex-none"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting…' : isLast ? 'Submit Test' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function QuestionNavigator(props) {
  return (
    <>
      <QuestionPalette {...props} />
      <NavActions {...props} />
    </>
  )
}
