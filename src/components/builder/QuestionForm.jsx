import { useEffect, useMemo, useState } from 'react'
import { List, X } from 'lucide-react'

const LANGUAGES = ['javascript', 'python', 'java', 'cpp', 'typescript', 'go', 'sql']

const emptyForm = {
  type: 'mcq',
  questionText: '',
  language: 'javascript',
  code: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  marks: 1,
}

function parseCsvOptions(text) {
  return text
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
}

function optionsToCsv(options) {
  return options.filter((opt) => opt.trim() !== '').join(', ')
}

function optionsContainComma(options) {
  return options.some((opt) => opt.includes(','))
}

function normalizeForm(question) {
  if (!question) {
    return { ...emptyForm, options: ['', '', '', ''], optionsMode: 'csv' }
  }

  const options =
    question.options && question.options.length >= 2
      ? [...question.options]
      : ['', '', '', '']

  return {
    type: question.type ?? 'mcq',
    questionText: question.questionText ?? '',
    language: question.language ?? 'javascript',
    code: question.code ?? '',
    options,
    correctAnswer: question.correctAnswer ?? 0,
    marks: question.marks ?? 1,
    // Options like "10, 10" need individual boxes to avoid bad comma splits
    optionsMode: optionsContainComma(options) ? 'individual' : 'csv',
  }
}

export default function QuestionForm({ open, initialQuestion, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm)
  const [csvText, setCsvText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      const next = normalizeForm(initialQuestion)
      setForm(next)
      setCsvText(optionsToCsv(next.options))
      setError('')
    }
  }, [open, initialQuestion])

  const previewOptions = useMemo(() => {
    if (form.optionsMode === 'csv') {
      const parsed = parseCsvOptions(csvText)
      return parsed.length > 0 ? parsed : ['', '']
    }
    return form.options
  }, [form.optionsMode, csvText, form.options])

  if (!open) return null

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }))

  const updateOption = (index, value) => {
    const options = [...form.options]
    options[index] = value
    update({ options })
  }

  const addOption = () => {
    if (form.options.length >= 8) return
    update({ options: [...form.options, ''] })
  }

  const removeOption = (index) => {
    if (form.options.length <= 2) return
    const options = form.options.filter((_, i) => i !== index)
    const correctAnswer = Math.min(form.correctAnswer, options.length - 1)
    update({ options, correctAnswer })
  }

  const switchMode = (mode) => {
    if (mode === form.optionsMode) return

    if (mode === 'csv') {
      if (optionsContainComma(form.options)) {
        setError(
          'Some options contain commas (e.g. "10, 10"). Use individual boxes for these so they are not split incorrectly.',
        )
        return
      }
      setCsvText(optionsToCsv(form.options))
      setError('')
    } else {
      const parsed = parseCsvOptions(csvText)
      const options = parsed.length > 0 ? parsed : ['', '']
      update({
        options,
        correctAnswer: Math.min(form.correctAnswer, options.length - 1),
      })
      setError('')
    }

    update({ optionsMode: mode })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedText = form.questionText.trim()

    let trimmedOptions
    if (form.optionsMode === 'csv') {
      trimmedOptions = parseCsvOptions(csvText)
    } else {
      trimmedOptions = form.options.map((opt) => opt.trim())
    }

    if (!trimmedText) {
      setError('Question text is required.')
      return
    }
    if (trimmedOptions.length < 2) {
      setError('Enter at least 2 options (comma-separated).')
      return
    }
    if (trimmedOptions.some((opt) => !opt)) {
      setError('All options must be filled.')
      return
    }
    if (form.type === 'code' && !form.code.trim()) {
      setError('Code is required for code questions.')
      return
    }
    if (form.correctAnswer >= trimmedOptions.length) {
      setError('Select a valid correct answer.')
      return
    }

    onSave({
      type: form.type,
      questionText: trimmedText,
      options: trimmedOptions,
      correctAnswer: form.correctAnswer,
      marks: Math.max(1, Number(form.marks) || 1),
      ...(form.type === 'code'
        ? { language: form.language, code: form.code.replace(/\s+$/, '') }
        : {}),
    })
  }

  const lineCount = form.code.split('\n').length
  const isCsv = form.optionsMode === 'csv'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="question-form-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-h-[90vh] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="question-form-title" className="text-base font-bold text-slate-900">
              {initialQuestion ? 'Edit Question' : 'Add Question'}
            </h2>
            <p className="muted mt-0.5">Choose a type and fill in the details.</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5">
          <fieldset className="mb-5">
            <legend className="label">Question Type</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { value: 'mcq', label: 'Multiple Choice', hint: 'Classic options-only question' },
                { value: 'code', label: 'Code Question', hint: 'Code block + options' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${
                    form.type === opt.value
                      ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="question-type"
                    className="mt-1 accent-brand-600"
                    value={opt.value}
                    checked={form.type === opt.value}
                    onChange={() => update({ type: opt.value })}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{opt.label}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{opt.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mb-4">
            <label className="label" htmlFor="question-text">
              Question
            </label>
            <input
              id="question-text"
              className="input"
              value={form.questionText}
              onChange={(e) => update({ questionText: e.target.value })}
              placeholder={
                form.type === 'code'
                  ? 'What is the output of the following code?'
                  : 'Enter your question'
              }
            />
          </div>

          {form.type === 'code' && (
            <>
              <div className="mb-4">
                <label className="label" htmlFor="question-language">
                  Language
                </label>
                <select
                  id="question-language"
                  className="input"
                  value={form.language}
                  onChange={(e) => update({ language: e.target.value })}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="label" htmlFor="question-code">
                  Code
                </label>
                <textarea
                  id="question-code"
                  className="input min-h-44 resize-y font-mono text-[13px] leading-6"
                  value={form.code}
                  onChange={(e) => update({ code: e.target.value })}
                  spellCheck={false}
                  placeholder={'var x = 10;\nconsole.log(x);'}
                  rows={Math.max(8, lineCount + 1)}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Indentation and blank lines are preserved.
                </p>
              </div>
            </>
          )}

          <div className="mb-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="label mb-0">Options</span>
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => switchMode('csv')}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                    isCsv ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                  aria-pressed={isCsv}
                >
                  Comma-separated
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('individual')}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                    !isCsv
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  aria-pressed={!isCsv}
                >
                  Individual boxes
                </button>
              </div>
            </div>

            {isCsv ? (
              <>
                <textarea
                  id="options-csv"
                  className="input min-h-20 resize-y leading-6"
                  value={csvText}
                  onChange={(e) => {
                    setCsvText(e.target.value)
                    setError('')
                  }}
                  placeholder="map(), push(), pop(), shift()"
                  aria-label="Options separated by commas"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Separate each option with a comma. Example:{' '}
                  <span className="font-mono">22, 4, Error, undefined</span>
                </p>
              </>
            ) : (
              <div className="space-y-2">
                {form.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-600">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <input
                      className="input"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      aria-label={`Option ${String.fromCharCode(65 + index)}`}
                    />
                    {form.options.length > 2 && (
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        onClick={() => removeOption(index)}
                        aria-label={`Remove option ${String.fromCharCode(65 + index)}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                  onClick={addOption}
                  disabled={form.options.length >= 8}
                >
                  + Add option
                </button>
                <p className="text-xs text-slate-400">
                  Use individual boxes when an option itself contains a comma (e.g.{' '}
                  <span className="font-mono">10, 10</span>).
                </p>
              </div>
            )}

            {previewOptions.filter(Boolean).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {previewOptions
                  .filter(Boolean)
                  .map((opt, index) => (
                    <span
                      key={`${opt}-${index}`}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                    >
                      <List className="h-3 w-3 text-slate-400" />
                      <span className="font-semibold text-slate-500">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {opt}
                    </span>
                  ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="correct-answer">
                Correct Answer
              </label>
              <select
                id="correct-answer"
                className="input"
                value={Math.min(form.correctAnswer, previewOptions.length - 1)}
                onChange={(e) => update({ correctAnswer: Number(e.target.value) })}
              >
                {previewOptions.map((opt, index) => (
                  <option key={index} value={index}>
                    {String.fromCharCode(65 + index)}
                    {opt ? ` — ${opt}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="marks">
                Marks
              </label>
              <input
                id="marks"
                type="number"
                min="1"
                className="input"
                value={form.marks}
                onChange={(e) => update({ marks: Number(e.target.value) })}
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {initialQuestion ? 'Save Question' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
