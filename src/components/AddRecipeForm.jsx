import { useState } from 'react'
import IngredientRow from './IngredientRow'

const emptyIngredient = () => ({ name: '', quantity: '', category: 'Produce' })

export default function AddRecipeForm({ onAdd, onCancel }) {
  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState([emptyIngredient()])
  const [saving, setSaving] = useState(false)

  function handleIngredientChange(index, field, value) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    )
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, emptyIngredient()])
  }

  function removeIngredient(index) {
    if (ingredients.length === 1) return
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validIngredients = ingredients.filter((i) => i.name.trim())
    if (!name.trim() || validIngredients.length === 0) return
    setSaving(true)
    try {
      await onAdd({ name: name.trim(), ingredients: validIngredients })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name *</label>
        <input
          type="text"
          placeholder="e.g. Pasta Primavera"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients *</label>
        <div className="space-y-3">
          {ingredients.map((ing, i) => (
            <IngredientRow
              key={i}
              ingredient={ing}
              index={i}
              onChange={handleIngredientChange}
              onRemove={removeIngredient}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addIngredient}
          className="mt-3 text-sm text-green-600 font-medium flex items-center gap-1 hover:text-green-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Ingredient
        </button>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Recipe'}
        </button>
      </div>
    </form>
  )
}
