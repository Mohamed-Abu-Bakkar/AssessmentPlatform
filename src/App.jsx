import { Navigate, Route, Routes } from 'react-router-dom'
import Builder from './pages/Builder.jsx'
import Preview from './pages/Preview.jsx'
import Result from './pages/Result.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Builder />} />
      <Route path="/builder" element={<Builder />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/result" element={<Result />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
