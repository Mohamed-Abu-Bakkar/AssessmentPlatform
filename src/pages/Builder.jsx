import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, RotateCcw } from 'lucide-react'
import QuestionForm from '../components/builder/QuestionForm.jsx'
import QuestionList from '../components/builder/QuestionList.jsx'
import TestSettings from '../components/builder/TestSettings.jsx'
import mockData from '../data/mockQuestions.json'
import {
  clearAll,
  getQuestions,
  getTest,
  saveQuestions,
  saveTest,
} from '../utils/storage.js'

const defaultTest = {
  id: `test-${Date.now()}`,
  title: '',
  duration: 15,
  passingPercentage: 80,
}

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export default function Builder() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [test, setTest] = useState(defaultTest)
  const [questions, setQuestions] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const storedTest = getTest()
    const storedQuestions = getQuestions()

    if (storedTest) {
      setTest(storedTest)
      setQuestions(Array.isArray(storedQuestions) ? storedQuestions : [])
    } else {
      const seededTest = { ...mockData.test }
      const seededQuestions = mockData.questions
      setTest(seededTest)
      setQuestions(seededQuestions)
      saveTest(seededTest)
      saveQuestions(seededQuestions)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    saveTest(test)
  }, [test, ready])

  useEffect(() => {
    if (!ready) return
    saveQuestions(questions)
  }, [questions, ready])

  useEffect(() => {
    if (!toast) return undefined
    const id = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(id)
  }, [toast])

  const handleAdd = useCallback(() => {
    setEditing(null)
    setModalOpen(true)
  }, [])

  const handleEdit = useCallback((question) => {
    setEditing(question)
    setModalOpen(true)
  }, [])

  const handleSaveQuestion = useCallback(
    (payload) => {
      if (editing) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === editing.id ? { ...q, ...payload } : q)),
        )
        setToast('Question updated')
      } else {
        setQuestions((prev) => [...prev, { id: createId('q'), ...payload }])
        setToast('Question added')
      }
      setModalOpen(false)
      setEditing(null)
    },
    [editing],
  )

  const handleDeleteRequest = useCallback((question) => {
    setConfirmDelete(question)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (!confirmDelete) return
    setQuestions((prev) => prev.filter((q) => q.id !== confirmDelete.id))
    setConfirmDelete(null)
    setToast('Question deleted')
  }, [confirmDelete])

  const handlePreview = () => {
    if (!test.title.trim()) {
      setToast('Add a test title before previewing')
      return
    }
    if (questions.length === 0) {
      setToast('Add at least one question before previewing')
      return
    }
    clearAll()
    navigate('/preview')
  }

  const handleResetDemo = () => {
    const seededTest = { ...mockData.test }
    const seededQuestions = mockData.questions
    setTest(seededTest)
    setQuestions(seededQuestions)
    saveTest(seededTest)
    saveQuestions(seededQuestions)
    clearAll()
    setToast('Demo data restored')
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading builder…
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
                <ClipboardList className="h-3.5 w-3.5" />
                Assessment UX Prototype
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Codelytix-style Assessment Builder
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Create Assessment — build and preview your assessment
              </p>
            </div>
            <button type="button" className="btn-secondary" onClick={handleResetDemo}>
              <RotateCcw className="h-4 w-4" />
              Reset demo data
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
        <TestSettings test={test} onChange={setTest} />

        <QuestionList
          questions={questions}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />

        <div className="flex flex-col-reverse gap-2 pb-6 sm:flex-row sm:justify-end">
          <button type="button" className="btn-secondary" onClick={handleResetDemo}>
            Reset demo data
          </button>
          <button type="button" className="btn-primary px-6" onClick={handlePreview}>
            Preview Test
          </button>
        </div>
      </main>

      <QuestionForm
        open={modalOpen}
        initialQuestion={editing}
        onSave={handleSaveQuestion}
        onCancel={() => {
          setModalOpen(false)
          setEditing(null)
        }}
      />

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setConfirmDelete(null)
          }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-bold text-slate-900">Delete question?</h2>
            <p className="mt-2 text-sm text-slate-600">
              This removes “{confirmDelete.questionText}” from the assessment.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button type="button" className="btn-danger" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </div>
      )}
    </div>
  )
}
