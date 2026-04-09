import { useState, useRef } from 'react'
import IngredientRow from './IngredientRow'
import { RECIPE_CATEGORIES, CUISINES } from '../utils/categories'

const emptyIngredient = () => ({ name: '', quantity: '', category: 'Produce' })

export default function AddRecipeForm({ onAdd, onCancel, initial }) {
  const [name, setName] = useState(initial?.name || '')
  const [category, setCategory] = useState(initial?.category || '')
  const [customCategory, setCustomCategory] = useState(
    initial?.category && !RECIPE_CATEGORIES.includes(initial.category) ? initial.category : ''
  )
  const [showCustomCategory, setShowCustomCategory] = useState(
    initial?.category ? !RECIPE_CATEGORIES.includes(initial.category) : false
  )
  const [cuisine, setCuisine] = useState(initial?.cuisine || '')
  const [customCuisine, setCustomCuisine] = useState(
    initial?.cuisine && !CUISINES.includes(initial.cuisine) ? initial.cuisine : ''
  )
  const [showCustomCuisine, setShowCustomCuisine] = useState(
    initial?.cuisine ? !CUISINES.includes(initial.cuisine) : false
  )
  const [ingredients, setIngredients] = useState(
    initial?.ingredients?.length ? initial.ingredients.map(i => ({ ...i })) : [emptyIngredient()]
  )
  const [steps, setSteps] = useState(initial?.steps?.length ? [...initial.steps] : [''])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initial?.imageUrl || null)
  const [removeImage, setRemoveImage] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function removeImageHandler() {
    setImageFile(null)
    setImagePreview(null)
    setRemoveImage(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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
    const finalCategory = showCustomCategory ? customCategory.trim() : category
    const finalCuisine = showCustomCuisine ? customCuisine.trim() : cuisine
    setSaving(true)
    try {
      await onAdd({
        name: name.trim(),
        ingredients: validIngredients,
        steps: validSteps,
        category: finalCategory || null,
        cuisine: finalCuisine || null,
        imageFile,
        removeImage,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Recipe Name *</label>
        <input
          type="text"
          placeholder="e.g. Pasta Primavera"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent placeholder:text-[var(--color-text-muted)]"
          required
          autoFocus
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Category</label>
        {showCustomCategory ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-[var(--color-primary)] rounded-xl text-sm text-[var(--color-text)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent placeholder:text-[var(--color-text-muted)]"
              autoFocus
            />
            <button
              type="button"
              onClick={() => { setShowCustomCategory(false); setCustomCategory(''); setCategory('') }}
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] px-2"
            >Cancel</button>
          </div>
        ) : (
          <select
            value={category}
            onChange={(e) => {
              if (e.target.value === '__custom__') {
                setShowCustomCategory(true)
                setCategory('')
              } else {
                setCategory(e.target.value)
              }
            }}
            className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          >
            <option value="">Select category…</option>
            {RECIPE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="__custom__">+ Add custom…</option>
          </select>
        )}
      </div>

      {/* Cuisine */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Cuisine</label>
        {showCustomCuisine ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Custom cuisine"
              value={customCuisine}
              onChange={(e) => setCustomCuisine(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-[var(--color-primary)] rounded-xl text-sm text-[var(--color-text)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent placeholder:text-[var(--color-text-muted)]"
              autoFocus
            />
            <button
              type="button"
              onClick={() => { setShowCustomCuisine(false); setCustomCuisine(''); setCuisine('') }}
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] px-2"
            >Cancel</button>
          </div>
        ) : (
          <select
            value={cuisine}
            onChange={(e) => {
              if (e.target.value === '__custom__') {
                setShowCustomCuisine(true)
                setCuisine('')
              } else {
                setCuisine(e.target.value)
              }
            }}
            className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          >
            <option value="">Select cuisine…</option>
            {CUISINES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="__custom__">+ Add custom…</option>
          </select>
        )}
      </div>

      {/* Optional photo */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Photo <span className="font-normal text-[var(--color-text-muted)]">(optional)</span></label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Recipe preview"
              className="w-full max-h-48 object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={removeImageHandler}
              className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Remove photo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 border-2 border-dashed border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Add a photo
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Ingredients *</label>
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
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Preparation Steps</label>
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
                className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent placeholder:text-[var(--color-text-muted)]"
              />
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  className="mt-2 text-[var(--color-text-muted)] hover:text-red-400 transition-colors p-1 flex-shrink-0 opacity-50 hover:opacity-100"
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
          className="flex-1 py-3 border border-[var(--color-border)] text-[var(--color-text-muted)] font-semibold rounded-xl hover:bg-[var(--color-border-light)] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : initial ? 'Update Recipe' : 'Save Recipe'}
        </button>
      </div>
    </form>
  )
}
