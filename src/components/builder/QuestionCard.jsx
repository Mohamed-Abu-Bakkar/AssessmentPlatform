import { Code2, Edit3, ListChecks, Trash2 } from 'lucide-react'

export default function QuestionCard({ index, question, onEdit, onDelete }) {
  const isCode = question.type === 'code'

  return (
    <div className="card flex items-center gap-3 p-4 transition hover:border-brand-300 hover:shadow">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
        Q{index + 1}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{question.questionText}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
            {isCode ? <Code2 className="h-3.5 w-3.5" /> : <ListChecks className="h-3.5 w-3.5" />}
            {isCode ? 'Code Question' : 'MCQ'}
          </span>
          <span>·</span>
          <span>{question.marks} mark{question.marks === 1 ? '' : 's'}</span>
          {isCode && question.language && (
            <>
              <span>·</span>
              <span className="capitalize">{question.language}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          onClick={() => onEdit(question)}
          aria-label={`Edit question ${index + 1}`}
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          onClick={() => onDelete(question)}
          aria-label={`Delete question ${index + 1}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
