import { optionLabel } from '../../utils/assessment.js'

export default function MCQOptions({ options, selected, onChange, disabled = false }) {
  return (
    <div className="space-y-2.5" role="radiogroup" aria-label="Answer options">
      {options.map((option, index) => {
        const optionId = String.fromCharCode(65 + index)
        const isSelected = selected === index

        return (
          <label
            key={index}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 text-sm transition ${
              isSelected
                ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            } ${disabled ? 'cursor-default opacity-70' : ''}`}
          >
            <input
              type="radio"
              name="answer-option"
              className="mt-0.5 accent-brand-600"
              value={index}
              checked={isSelected}
              disabled={disabled}
              onChange={() => onChange?.(index)}
            />
            <span className="flex-1 text-slate-800">
              <span className="mr-2 font-semibold text-slate-500">{optionId}.</span>
              {option}
            </span>
          </label>
        )
      })}
    </div>
  )
}
