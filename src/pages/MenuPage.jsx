import { useState } from 'react'
import { useMenu } from '../hooks/useMenu'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

export default function MenuPage() {
  const { menuItems, loading, error, clearError, addMenuItem, deleteMenuItem } = useMenu()
  const navigate = useNavigate()
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  async function handleAdd(e) {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    setAdding(true)
    try {
      await addMenuItem({ name })
      setNewName('')
    } catch {
      // error handled by hook
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="relative min-h-full">
      {/* Error banner */}
      {error && (
        <div className="px-5 pt-3">
          <p className="text-red-600 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-400 hover:text-red-600 ml-2">✕</button>
          </p>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 bg-[var(--color-bg)]/95 backdrop-blur-md">
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Menu</h1>
              {menuItems.length > 0 && (
                <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                  {menuItems.length} meal{menuItems.length !== 1 ? 's' : ''} planned
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Add form */}
        <form onSubmit={handleAdd} className="px-5 pb-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a meal..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 px-0 py-1.5 text-sm bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none transition-colors placeholder-[var(--color-text-muted)] text-[var(--color-text)]"
          />
          <button
            type="submit"
            disabled={!newName.trim() || adding}
            className="text-sm font-medium text-[var(--color-primary)] disabled:opacity-40 transition-opacity"
          >
            {adding ? '...' : 'Add'}
          </button>
        </form>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
      </div>

      {/* Content */}
      <div className="pt-2">
        {menuItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-8">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-[var(--color-text)] font-semibold text-lg">No meals planned</p>
            <p className="text-[var(--color-text-muted)] text-sm mt-1 max-w-[260px] leading-relaxed">
              Add meals above or use "Add to Menu" from a recipe
            </p>
          </div>
        ) : (
          menuItems.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-3 px-5 py-3 transition-all active:bg-[var(--color-border-light)]"
            >
              {/* Meal icon */}
              <span className="text-lg flex-shrink-0">🍽️</span>

              {/* Meal name */}
              <div className="flex-1 min-w-0">
                <span
                  className="text-[0.95rem] block truncate text-[var(--color-text)] cursor-pointer hover:text-[var(--color-primary)] transition-colors"
                  onClick={() => item.recipeId && navigate(`/recipes/${item.recipeId}`)}
                >
                  {item.name}
                </span>
                {item.recipeId && (
                  <span className="text-xs text-[var(--color-text-muted)]">From recipes</span>
                )}
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteMenuItem(item.id)}
                className="text-[var(--color-text-muted)] hover:text-red-400 transition-all flex-shrink-0 opacity-30 group-hover:opacity-100"
                aria-label="Remove meal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
