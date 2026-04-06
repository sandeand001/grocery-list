import { CATEGORIES } from '../utils/categories'

export default function IngredientRow({ ingredient, index, onChange, onRemove }) {
  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1 grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Ingredient *"
          value={ingredient.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
        <input
          type="text"
          placeholder="Qty (e.g. 1 cup)"
          value={ingredient.quantity}
          onChange={(e) => onChange(index, 'quantity', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <select
          value={ingredient.category}
          onChange={(e) => onChange(index, 'category', e.target.value)}
          className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mt-2 text-gray-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
        aria-label="Remove ingredient"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
