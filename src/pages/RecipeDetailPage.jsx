import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { useGroceryList } from '../hooks/useGroceryList'
import { getCategoryStyle } from '../utils/categories'
import LoadingSpinner from '../components/LoadingSpinner'

export default function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recipes, loading } = useRecipes()
  const { addItems } = useGroceryList()
  const [cookMode, setCookMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  if (loading) return <LoadingSpinner />

  const recipe = recipes.find((r) => r.id === id)

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <p className="text-gray-500">Recipe not found.</p>
        <button onClick={() => navigate('/recipes')} className="mt-4 text-[var(--color-primary)] font-medium">
          Back to Recipes
        </button>
      </div>
    )
  }

  const steps = recipe.steps || []

  async function handleAddToList() {
    await addItems(recipe.ingredients)
    navigate('/grocery')
  }

  function enterCookMode() {
    setCurrentStep(0)
    setCookMode(true)
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-30">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate('/recipes')}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900 flex-1 truncate">{recipe.name}</h1>
          {steps.length > 0 && (
            <button
              onClick={enterCookMode}
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-full hover:opacity-90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cook Mode
            </button>
          )}
        </div>
      </div>

      {/* Ingredients */}
      <div className="px-4 py-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Ingredients ({recipe.ingredients?.length ?? 0})
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {recipe.ingredients?.map((ing, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-900">{ing.name}</span>
                {ing.quantity && (
                  <span className="text-xs text-gray-500 ml-2">{ing.quantity}</span>
                )}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${getCategoryStyle(ing.category)}`}>
                {ing.category}
              </span>
            </div>
          ))}
        </div>

        {/* Steps */}
        {steps.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Preparation Steps ({steps.length})
            </h2>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[var(--color-primary-text)]">{i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleAddToList}
          className="w-full py-4 bg-[var(--color-primary)] text-white font-semibold rounded-2xl shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add All to Grocery List
        </button>
      </div>

      {/* Cook Mode overlay */}
      {cookMode && (
        <div className="fixed inset-0 bg-gray-900 text-white z-50 flex flex-col">
          {/* Cook mode header */}
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

          {/* Step indicator */}
          <div className="px-6 pt-4 pb-2">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= currentStep ? 'bg-[var(--color-primary)]' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          {/* Step content */}
          <div className="flex-1 flex items-center px-6">
            <p className="text-2xl leading-relaxed font-light">{steps[currentStep]}</p>
          </div>

          {/* Navigation */}
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
                className="flex-1 py-4 rounded-2xl bg-[var(--color-primary)] font-semibold hover:opacity-90 transition-colors"
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
