import { useState } from 'react'
import { useRecipes } from '../hooks/useRecipes'
import RecipeCard from '../components/RecipeCard'
import AddRecipeForm from '../components/AddRecipeForm'
import ImportRecipeForm from '../components/ImportRecipeForm'
import LoadingSpinner from '../components/LoadingSpinner'
import { useTheme } from '../contexts/ThemeContext'

export default function RecipesPage() {
  const { recipes, loading, error, addRecipe, deleteRecipe } = useRecipes()
  const { style: visualStyle } = useTheme()
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [search, setSearch] = useState('')
  const [groupBy, setGroupBy] = useState('none') // 'none' | 'category' | 'cuisine'

  const filteredRecipes = search.trim()
    ? recipes.filter(r =>
        r.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        r.ingredients?.some(i => i.name.toLowerCase().includes(search.trim().toLowerCase()))
      )
    : recipes

  function getGroupedRecipes() {
    if (groupBy === 'none') return null
    const groups = {}
    for (const recipe of filteredRecipes) {
      const key = (groupBy === 'category' ? recipe.category : recipe.cuisine) || 'Uncategorized'
      if (!groups[key]) groups[key] = []
      groups[key].push(recipe)
    }
    return Object.entries(groups).sort(([a], [b]) => {
      if (a === 'Uncategorized') return 1
      if (b === 'Uncategorized') return -1
      return a.localeCompare(b)
    })
  }

  const grouped = getGroupedRecipes()

  if (loading) return <LoadingSpinner />

  if (showForm) {
    return (
      <div>
        <div className="sticky top-0 z-30 bg-[var(--color-bg)]/95 backdrop-blur-md">
          <div className="px-5 pt-5 pb-3">
            <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">New Recipe</h1>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
        </div>
        <div className="px-5 py-4">
          <AddRecipeForm
            onAdd={async (data) => {
              await addRecipe(data)
              setShowForm(false)
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </div>
    )
  }

  if (showImport) {
    return (
      <div>
        <div className="sticky top-0 z-30 bg-[var(--color-bg)]/95 backdrop-blur-md">
          <div className="px-5 pt-5 pb-3">
            <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Import Recipes</h1>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
        </div>
        <div className="px-5 py-4">
          <ImportRecipeForm
            onImport={addRecipe}
            onCancel={() => setShowImport(false)}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Error banner */}
      {error && (
        <div className="px-5 pt-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Header — typographic, no gradient bar */}
      <div className="sticky top-0 z-30 bg-[var(--color-bg)]/95 backdrop-blur-md">
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Recipes</h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => setShowImport(true)}
              className="text-sm text-[var(--color-text-muted)] font-medium hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-[var(--color-primary)] font-medium hover:opacity-70 transition-opacity flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>
        </div>

        {/* Search — minimal underline style */}
        {recipes.length > 0 && (
          <div className="px-5 pb-3">
            <div className="relative">
              <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search recipes or ingredients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-6 pr-2 py-1.5 text-sm bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none transition-colors placeholder-[var(--color-text-muted)]"
              />
            </div>
          </div>
        )}

        {/* Group by controls */}
        {recipes.length > 0 && (
          <div className="px-5 pb-3 flex items-center gap-2">
            <span className="text-xs text-[var(--color-text-muted)]">Group:</span>
            {['none', 'category', 'cuisine'].map((opt) => (
              <button
                key={opt}
                onClick={() => setGroupBy(opt)}
                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                  groupBy === opt
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-border-light)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {opt === 'none' ? 'A–Z' : opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
      </div>

      {/* Content — continuous scroll, no card wrappers */}
      <div className={`${visualStyle === 'corkboard' ? 'flex flex-wrap justify-center pt-6 px-2' : ''}`}>
        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-8">
            <p className="text-5xl mb-4">📖</p>
            <p className="text-[var(--color-text)] font-semibold text-lg">No recipes yet</p>
            <p className="text-[var(--color-text-muted)] text-sm mt-1 max-w-[260px] leading-relaxed">
              Create a recipe to quickly add all its ingredients to your grocery list
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-5 text-[var(--color-primary)] font-medium text-sm hover:opacity-70 transition-opacity"
            >
              Create your first recipe →
            </button>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[var(--color-text-muted)] text-sm">No recipes match your search</p>
          </div>
        ) : grouped ? (
          grouped.map(([group, groupRecipes]) => (
            <div key={group}>
              <div className="px-5 pt-4 pb-2">
                <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-[0.15em]">
                  {group}
                </h2>
              </div>
              <div className={`${visualStyle === 'corkboard' ? 'flex flex-wrap justify-center px-2' : ''}`}>
                {groupRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} onDelete={deleteRecipe} />
                ))}
              </div>
            </div>
          ))
        ) : (
          filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onDelete={deleteRecipe} />
          ))
        )}
      </div>
    </div>
  )
}
