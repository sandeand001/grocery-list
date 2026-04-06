import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import GroceryListPage from './pages/GroceryListPage'
import RecipesPage from './pages/RecipesPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import FamilyPage from './pages/FamilyPage'
import LoadingSpinner from './components/LoadingSpinner'

function PrivateRoutes() {
  const { currentUser, familyId, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!currentUser) return <Navigate to="/login" replace />

  if (!familyId) {
    return (
      <Layout>
        <Routes>
          <Route path="/family" element={<FamilyPage />} />
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
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/grocery" replace /> : <LoginPage />} />
        <Route path="/*" element={<PrivateRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}
