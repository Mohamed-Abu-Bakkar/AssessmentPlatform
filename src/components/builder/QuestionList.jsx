import { FileQuestion, Plus } from 'lucide-react'
import QuestionCard from './QuestionCard.jsx'

export default function QuestionList({ questions, onAdd, onEdit, onDelete }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="section-title">Questions</h2>
          <p className="muted mt-1">
            {questions.length} question{questions.length === 1 ? '' : 's'} in this assessment
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add Question
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
          <FileQuestion className="mb-3 h-10 w-10 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">No questions yet</p>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Add a multiple choice or code question to build your assessment.
          </p>
          <button type="button" className="btn-primary mt-4" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              index={index}
              question={question}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
