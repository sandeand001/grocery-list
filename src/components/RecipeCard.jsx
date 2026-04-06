import { useNavigate } from 'react-router-dom'

export default function RecipeCard({ recipe, onDelete }) {
  const navigate = useNavigate()

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-transform cursor-pointer"
      onClick={() => navigate(`/recipes/${recipe.id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">{recipe.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {recipe.ingredients?.length ?? 0} ingredient{recipe.ingredients?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(recipe.id)
          }}
          className="text-gray-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
          aria-label="Delete recipe"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {recipe.ingredients?.slice(0, 4).map((ing, i) => (
          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {ing.name}
          </span>
        ))}
        {recipe.ingredients?.length > 4 && (
          <span className="text-xs text-gray-400">+{recipe.ingredients.length - 4} more</span>
        )}
      </div>
    </div>
  )
}
