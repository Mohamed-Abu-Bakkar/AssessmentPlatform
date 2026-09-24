import { useState } from 'react'

export default function TestSettings({ test, onChange }) {
  const [local, setLocal] = useState(test)

  const update = (patch) => {
    const next = { ...local, ...patch }
    setLocal(next)
    onChange(next)
  }

  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="section-title">Test Information</h2>
        <p className="muted mt-1">Configure the assessment details candidates will see.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label" htmlFor="test-title">
            Title
          </label>
          <input
            id="test-title"
            className="input"
            value={local.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Full Stack Developer - Round 2"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="test-duration">
              Duration (minutes)
            </label>
            <input
              id="test-duration"
              type="number"
              min="1"
              max="480"
              className="input"
              value={local.duration}
              onChange={(e) => update({ duration: Math.max(1, Number(e.target.value) || 1) })}
            />
          </div>
          <div>
            <label className="label" htmlFor="test-passing">
              Passing Percentage (%)
            </label>
            <input
              id="test-passing"
              type="number"
              min="0"
              max="100"
              className="input"
              value={local.passingPercentage}
              onChange={(e) =>
                update({
                  passingPercentage: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
