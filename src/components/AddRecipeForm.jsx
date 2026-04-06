import { useState } from 'react'
import IngredientRow from './IngredientRow'

const emptyIngredient = () => ({ name: '', quantity: '', category: 'Produce' })

export default function AddRecipeForm({ onAdd, onCancel }) {
  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState([emptyIngredient()])
  const [steps, setSteps] = useState([''])
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

  function handleStepChange(index, value) {
    setSteps((prev) => prev.map((s, i) => (i === index ? value : s)))
  }

  function addStep() {
    setSteps((prev) => [...prev, ''])
  }

  function removeStep(index) {
    if (steps.length === 1) return
    setSteps((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validIngredients = ingredients.filter((i) => i.name.trim())
    if (!name.trim() || validIngredients.length === 0) return
    const validSteps = steps.map((s) => s.trim()).filter(Boolean)
    setSaving(true)
    try {
      await onAdd({ name: name.trim(), ingredients: validIngredients, steps: validSteps })
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
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
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
          className="mt-3 text-sm text-[var(--color-primary)] font-medium flex items-center gap-1 hover:opacity-80"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Ingredient
        </button>
      </div>

      {/* Preparation Steps */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Steps</label>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="mt-2.5 text-sm font-semibold text-[var(--color-primary)] w-5 flex-shrink-0 text-right">
                {i + 1}.
              </span>
              <input
                type="text"
                placeholder={`Step ${i + 1}`}
                value={step}
                onChange={(e) => handleStepChange(i, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  className="mt-2 text-gray-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                  aria-label="Remove step"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStep}
          className="mt-3 text-sm text-[var(--color-primary)] font-medium flex items-center gap-1 hover:opacity-80"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Step
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
          className="flex-1 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Recipe'}
        </button>
      </div>
    </form>
  )
}
