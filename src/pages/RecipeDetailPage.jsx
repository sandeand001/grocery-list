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

  if (loading) return <LoadingSpinner />

  const recipe = recipes.find((r) => r.id === id)

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <p className="text-gray-500">Recipe not found.</p>
        <button onClick={() => navigate('/recipes')} className="mt-4 text-green-600 font-medium">
          Back to Recipes
        </button>
      </div>
    )
  }

  async function handleAddToList() {
    await addItems(recipe.ingredients)
    navigate('/grocery')
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

        <button
          onClick={handleAddToList}
          className="w-full py-4 bg-green-600 text-white font-semibold rounded-2xl shadow-sm hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add All to Grocery List
        </button>
      </div>
    </div>
  )
}
