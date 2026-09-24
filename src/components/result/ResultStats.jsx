export default function ResultStats({ result }) {
  const stats = [
    { label: 'Unanswered', value: result.unanswered, tone: 'text-slate-700' },
    { label: 'Questions', value: result.correct + result.incorrect + result.unanswered, tone: 'text-slate-700' },
    { label: 'Passing %', value: `${result.passingPercentage}%`, tone: 'text-slate-700' },
    { label: 'Your %', value: `${result.percentage}%`, tone: result.passed ? 'text-emerald-600' : 'text-red-600' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="card px-4 py-4 text-center">
          <p className={`text-xl font-bold ${stat.tone}`}>{stat.value}</p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}
