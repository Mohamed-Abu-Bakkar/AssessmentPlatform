import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import QuestionReview from '../components/result/QuestionReview.jsx'
import ResultStats from '../components/result/ResultStats.jsx'
import ScoreCard from '../components/result/ScoreCard.jsx'
import { getResult, getQuestions } from '../utils/storage.js'

export default function Result() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [result, setResult] = useState(null)
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    const storedResult = getResult()
    const storedQuestions = getQuestions() ?? []
    if (storedResult) {
      setResult(storedResult)
      setQuestions(storedQuestions)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready && !result) {
      navigate('/', { replace: true })
    }
  }, [ready, result, navigate])

  if (!ready || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading result…
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <p className="text-sm font-bold text-slate-900">Assessment Result</p>
          <Link to="/builder" className="btn-secondary">
            Back to Builder
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
        <ScoreCard result={result} />
        <ResultStats result={result} />
        <QuestionReview questions={questions} answers={result.answers ?? {}} />

        <div className="flex flex-col gap-2 pb-4 sm:flex-row sm:justify-center">
          <Link to="/builder" className="btn-secondary">
            Edit Assessment
          </Link>
          <button type="button" className="btn-primary" onClick={() => navigate('/preview')}>
            Retake Test
          </button>
        </div>
      </main>
    </div>
  )
}
