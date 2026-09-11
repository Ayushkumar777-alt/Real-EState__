import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Saved from './pages/Saved'
import ListProperty from './pages/ListProperty'
import SearchRecommend from './pages/SearchRecommend'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/list-property" element={<ListProperty />} />
      <Route path="/search" element={<SearchRecommend />} />
    </Routes>
  )
}

export default App
