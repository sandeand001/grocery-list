import { useState } from 'react'
import { CATEGORIES, ADD_CUSTOM_ID } from '../utils/categories'

const knownIds = new Set(CATEGORIES.map((c) => c.id))

export default function IngredientRow({ ingredient, index, onChange, onRemove }) {
  const isKnownCat = knownIds.has(ingredient.category)
  const [showCustom, setShowCustom] = useState(!isKnownCat && !!ingredient.category)

  const selectValue = showCustom ? ADD_CUSTOM_ID : (isKnownCat ? ingredient.category : 'Produce')

  function handleSelectChange(val) {
    if (val === ADD_CUSTOM_ID) {
      setShowCustom(true)
      onChange(index, 'category', '')
    } else {
      setShowCustom(false)
      onChange(index, 'category', val)
    }
  }

  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1 grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Ingredient *"
          value={ingredient.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          required
        />
        <input
          type="text"
          placeholder="Qty (e.g. 1 cup)"
          value={ingredient.quantity}
          onChange={(e) => onChange(index, 'quantity', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        />
        <select
          value={selectValue}
          onChange={(e) => handleSelectChange(e.target.value)}
          className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
          <option value={ADD_CUSTOM_ID}>+ Add category…</option>
        </select>
        {showCustom && (
          <input
            type="text"
            placeholder="Category name *"
            value={ingredient.category || ''}
            onChange={(e) => onChange(index, 'category', e.target.value)}
            className="col-span-2 px-3 py-2 border border-[var(--color-primary)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            autoFocus
            required
          />
        )}
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
