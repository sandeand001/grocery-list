import { useState } from 'react'
import { useRecipes } from '../hooks/useRecipes'
import RecipeCard from '../components/RecipeCard'
import AddRecipeForm from '../components/AddRecipeForm'
import LoadingSpinner from '../components/LoadingSpinner'

export default function RecipesPage() {
  const { recipes, loading, addRecipe, deleteRecipe } = useRecipes()
  const [showForm, setShowForm] = useState(false)

  if (loading) return <LoadingSpinner />

  if (showForm) {
    return (
      <div>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-30">
          <h1 className="text-xl font-bold text-gray-900">New Recipe</h1>
        </div>
        <div className="px-4 py-4">
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

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-30">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Recipes</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-[var(--color-primary)] text-white text-sm font-medium px-3 py-1.5 rounded-full hover:opacity-90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-3">
        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No recipes yet</p>
            <p className="text-gray-400 text-sm mt-1">Add a recipe to quickly fill your grocery list</p>
          </div>
        ) : (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onDelete={deleteRecipe} />
          ))
        )}
      </div>
    </div>
  )
}
