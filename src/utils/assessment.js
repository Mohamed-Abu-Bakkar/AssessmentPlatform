export function calculateScore(questions, answers) {
  return questions.reduce((total, question) => {
    const given = answers[question.id]
    if (given === undefined || given === null) return total
    return given === question.correctAnswer ? total + question.marks : total
  }, 0)
}

export function calculateTotalMarks(questions) {
  return questions.reduce((total, question) => total + question.marks, 0)
}

export function calculatePercentage(score, totalMarks) {
  if (!totalMarks) return 0
  return Math.round((score / totalMarks) * 100)
}

export function calculateCorrectAnswers(questions, answers) {
  return questions.filter(
    (question) =>
      answers[question.id] !== undefined &&
      answers[question.id] !== null &&
      answers[question.id] === question.correctAnswer,
  ).length
}

export function calculateIncorrectAnswers(questions, answers) {
  return questions.filter(
    (question) =>
      answers[question.id] !== undefined &&
      answers[question.id] !== null &&
      answers[question.id] !== question.correctAnswer,
  ).length
}

export function calculateUnanswered(questions, answers) {
  return questions.filter(
    (question) =>
      answers[question.id] === undefined || answers[question.id] === null,
  ).length
}

export function formatDuration(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0))
  const mins = Math.floor(safe / 60)
  const secs = safe % 60
  if (mins >= 60) {
    const hours = Math.floor(mins / 60)
    const restMins = mins % 60
    return `${hours}h ${restMins}m ${secs}s`
  }
  if (mins > 0 && safe >= 60) {
    return `${mins}m ${String(secs).padStart(2, '0')}s`
  }
  return `${secs}s`
}

export function formatClock(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0))
  const mins = Math.floor(safe / 60)
  const secs = safe % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function formatDateTime(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export function calculateResult({ test, questions, answers, startedAt, submittedAt, timeRemaining }) {
  const score = calculateScore(questions, answers)
  const totalMarks = calculateTotalMarks(questions)
  const percentage = calculatePercentage(score, totalMarks)
  const correct = calculateCorrectAnswers(questions, answers)
  const incorrect = calculateIncorrectAnswers(questions, answers)
  const unanswered = calculateUnanswered(questions, answers)
  const passed = percentage >= (test?.passingPercentage ?? 0)

  const durationSeconds = test?.duration ? test.duration * 60 : 0
  const timeTaken =
    durationSeconds && typeof timeRemaining === 'number'
      ? Math.max(0, durationSeconds - timeRemaining)
      : 0

  return {
    testId: test?.id ?? null,
    title: test?.title ?? 'Assessment',
    score,
    totalMarks,
    percentage,
    correct,
    incorrect,
    unanswered,
    passed,
    passingPercentage: test?.passingPercentage ?? 0,
    startedAt,
    submittedAt,
    timeTaken,
    timeRemaining: timeRemaining ?? 0,
    answers: answers ?? {},
  }
}

export function getQuestionStatus(question, answers) {
  const given = answers[question.id]
  if (given === undefined || given === null) return 'unanswered'
  return given === question.correctAnswer ? 'correct' : 'incorrect'
}

export function optionLabel(index) {
  return String.fromCharCode(65 + (index ?? 0))
}
