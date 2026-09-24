import CodeBlock from './CodeBlock.jsx'
import MCQOptions from './MCQOptions.jsx'

export default function QuestionRenderer({ question, selectedAnswer, onSelect, disabled = false }) {
  if (!question) return null

  return (
    <div>
      <div className="mb-5">
        <p className="text-base font-medium leading-relaxed text-slate-900">
          {question.questionText}
        </p>
      </div>

      {question.type === 'code' && (
        <div className="mb-6">
          <CodeBlock code={question.code} language={question.language} />
        </div>
      )}

      <MCQOptions
        options={question.options}
        selected={selectedAnswer}
        onChange={onSelect}
        disabled={disabled}
      />
    </div>
  )
}
