import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useEffect } from 'react'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import GroceryListPage from './pages/GroceryListPage'
import RecipesPage from './pages/RecipesPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import FamilyPage from './pages/FamilyPage'
import SettingsPage from './pages/SettingsPage'
import JoinPage from './pages/JoinPage'
import LoadingSpinner from './components/LoadingSpinner'

function PendingJoinRedirect() {
  const { currentUser, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading || !currentUser) return
    const pending = sessionStorage.getItem('pendingJoin')
    if (pending) {
      sessionStorage.removeItem('pendingJoin')
      navigate(pending, { replace: true })
    }
  }, [loading, currentUser])

  return null
}

function PrivateRoutes() {
  const { currentUser, familyId, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!currentUser) return <Navigate to="/login" replace />

  if (!familyId) {
    return (
      <Layout>
        <Routes>
          <Route path="/family" element={<FamilyPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/family" replace />} />
        </Routes>
      </Layout>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/grocery" element={<GroceryListPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/grocery" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <PendingJoinRedirect />
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/grocery" replace /> : <LoginPage />} />
        <Route path="/join/:familyId" element={<JoinPage />} />
        <Route path="/*" element={<PrivateRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}
