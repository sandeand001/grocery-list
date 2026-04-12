import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { useGroceryList } from '../hooks/useGroceryList'
import { useMenu } from '../hooks/useMenu'
import { getCategoryStyle } from '../utils/categories'
import LoadingSpinner from '../components/LoadingSpinner'
import AddRecipeForm from '../components/AddRecipeForm'
import { useToast } from '../components/Toast'

export default function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recipes, loading, updateRecipe } = useRecipes()
  const { addItems } = useGroceryList()
  const { addMenuItem } = useMenu()
  const toast = useToast()
  const [cookMode, setCookMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [adding, setAdding] = useState(false)
  const [addingToMenu, setAddingToMenu] = useState(false)
  const [editing, setEditing] = useState(false)

  if (loading) return <LoadingSpinner />

  const recipe = recipes.find((r) => r.id === id)

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <p className="text-gray-500">Recipe not found.</p>
        <button onClick={() => navigate('/recipes')} className="mt-4 text-amber-600 font-medium">
          Back to Recipes
        </button>
      </div>
    )
  }

  const steps = recipe.steps || []

  if (editing) {
    return (
      <div>
        <div className="sticky top-0 z-30 bg-[var(--color-bg)]/95 backdrop-blur-md">
          <div className="px-5 pt-5 pb-3">
            <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Edit Recipe</h1>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
        </div>
        <div className="px-5 py-4">
          <AddRecipeForm
            initial={recipe}
            onAdd={async (data) => {
              await updateRecipe(recipe.id, data)
              setEditing(false)
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      </div>
    )
  }

  async function handleAddToList() {
    setAdding(true)
    try {
      const result = await addItems(recipe.ingredients)
      const parts = []
      if (result?.addedCount > 0) parts.push(`${result.addedCount} added`)
      if (result?.mergedCount > 0) parts.push(`${result.mergedCount} merged with existing`)
      toast.success(parts.length > 0 ? `${recipe.name}: ${parts.join(', ')}` : 'Items added to list!')
      navigate('/grocery')
    } catch {
      toast.error('Failed to add items to list')
    } finally {
      setAdding(false)
    }
  }

  async function handleAddToMenu() {
    setAddingToMenu(true)
    try {
      await addMenuItem({ name: recipe.name, recipeId: recipe.id })
      toast.success(`${recipe.name} added to menu`)
    } catch {
      toast.error('Failed to add to menu')
    } finally {
      setAddingToMenu(false)
    }
  }

  function enterCookMode() {
    setCurrentStep(0)
    setCookMode(true)
  }

  return (
    <div>
      {/* Header — clean typographic, back button + title */}
      <div className="sticky top-0 z-30 bg-[var(--color-bg)]/95 backdrop-blur-md">
        <div className="px-5 pt-4 pb-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/recipes')}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors -ml-1"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-[var(--color-text)] flex-1 truncate">{recipe.name}</h1>
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-[var(--color-primary)] font-medium hover:opacity-70 transition-opacity"
          >
            ✏️ Edit
          </button>
          {steps.length > 0 && (
            <button
              onClick={enterCookMode}
              className="text-sm text-[var(--color-primary)] font-medium hover:opacity-70 transition-opacity"
            >
              🍳 Cook
            </button>
          )}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
      </div>

      {/* Hero image — only if recipe has a photo */}
      {recipe.imageUrl && (
        <div className="w-full">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full max-h-64 object-cover"
          />
        </div>
      )}

      {/* Recipe content — continuous flow, no cards */}
      <div className="px-5 pt-6 pb-4">
        {/* Category & Cuisine tags */}
        {(recipe.category || recipe.cuisine) && (
          <div className="flex flex-wrap gap-2 mb-5">
            {recipe.category && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                {recipe.category}
              </span>
            )}
            {recipe.cuisine && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-border-light)] text-[var(--color-text-muted)]">
                {recipe.cuisine}
              </span>
            )}
          </div>
        )}

        {/* Ingredients section */}
        <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-4">
          Ingredients · {recipe.ingredients?.length ?? 0}
        </h2>

        <div className="mb-8">
          {recipe.ingredients?.map((ing, i) => (
            <div key={i} className="flex items-baseline gap-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0 mt-1.5" />
              <div className="flex-1 min-w-0">
                <span className="text-[0.95rem] text-[var(--color-text)]">{ing.name}</span>
                {ing.quantity && (
                  <span className="text-sm text-[var(--color-text-muted)] ml-2">{ing.quantity}</span>
                )}
              </div>
              <span className="text-[0.65rem] text-[var(--color-text-muted)] flex-shrink-0">
                {ing.category}
              </span>
            </div>
          ))}
        </div>

        {/* Steps section — flowing reading experience */}
        {steps.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-4">
              Preparation · {steps.length} steps
            </h2>
            <div className="space-y-5">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-2xl font-light text-[var(--color-text-muted)] flex-shrink-0 leading-none mt-0.5 w-7 text-right">
                    {i + 1}
                  </span>
                  <p className="text-[0.95rem] text-[var(--color-text)] leading-relaxed flex-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add to list / menu — prominent but not boxy */}
        <div className="pt-4 pb-2">
          <div className="h-px bg-[var(--color-border-light)] mb-6" />
          <div className="space-y-3">
            <button
              onClick={handleAddToList}
              disabled={adding}
              className="w-full py-4 bg-[var(--color-primary)] text-white font-semibold rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {adding ? 'Adding...' : 'Add All to Grocery List'}
            </button>
            <button
              onClick={handleAddToMenu}
              disabled={addingToMenu}
              className="w-full py-3.5 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold rounded-2xl hover:opacity-80 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {addingToMenu ? 'Adding...' : 'Add to Menu'}
            </button>
          </div>
        </div>
      </div>

      {/* Cook Mode overlay */}
      {cookMode && (
        <div className="fixed inset-0 bg-gray-900 text-white z-50 flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <h2 className="font-bold text-lg truncate flex-1">{recipe.name}</h2>
            <button
              onClick={() => setCookMode(false)}
              className="ml-3 w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
              aria-label="Exit cook mode"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 pt-4 pb-2">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= currentStep ? 'bg-amber-500' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          <div className="flex-1 flex items-center px-6">
            <p className="text-2xl leading-relaxed font-light">{steps[currentStep]}</p>
          </div>

          <div className="px-6 pb-8 pt-4 flex gap-3">
            <button
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0}
              className="flex-1 py-4 rounded-2xl bg-gray-700 font-semibold disabled:opacity-30 hover:bg-gray-600 transition-colors"
            >
              ← Previous
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep((s) => s + 1)}
                className="flex-1 py-4 rounded-2xl bg-amber-500 font-semibold hover:bg-amber-600 transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => setCookMode(false)}
                className="flex-1 py-4 rounded-2xl bg-green-600 font-semibold hover:bg-green-500 transition-colors"
              >
                ✓ Done!
              </button>
            )}
          </div>

          <p className="text-center text-xs text-gray-600 pb-4">
            Tip: Keep your screen on while cooking
          </p>
        </div>
      )}
    </div>
  )
}
