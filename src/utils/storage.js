const KEYS = {
  test: 'assessment_test',
  questions: 'assessment_questions',
  attempt: 'assessment_attempt',
  result: 'assessment_result',
}

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function getTest() {
  return read(KEYS.test)
}

export function saveTest(test) {
  return write(KEYS.test, test)
}

export function getQuestions() {
  return read(KEYS.questions)
}

export function saveQuestions(questions) {
  return write(KEYS.questions, questions)
}

export function getAttempt() {
  return read(KEYS.attempt)
}

export function saveAttempt(attempt) {
  return write(KEYS.attempt, attempt)
}

export function clearAttempt() {
  localStorage.removeItem(KEYS.attempt)
}

export function getResult() {
  return read(KEYS.result)
}

export function saveResult(result) {
  return write(KEYS.result, result)
}

export function clearResult() {
  localStorage.removeItem(KEYS.result)
}

export function clearAll() {
  clearAttempt()
  clearResult()
}

export { KEYS }
