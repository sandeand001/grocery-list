import { useState } from 'react'
import { CATEGORIES } from '../utils/categories'

const GROCERY_CATEGORIES = CATEGORIES.map(c => c.id)

function validateRecipe(data) {
  const errors = []
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('"name" is required')
  }
  if (!Array.isArray(data.ingredients) || data.ingredients.length === 0) {
    errors.push('"ingredients" must be a non-empty array')
  } else {
    data.ingredients.forEach((ing, i) => {
      if (!ing.name || typeof ing.name !== 'string' || !ing.name.trim()) {
        errors.push(`Ingredient ${i + 1}: "name" is required`)
      }
    })
  }
  return errors
}

function normalizeRecipe(data) {
  return {
    name: data.name.trim(),
    category: data.category || null,
    cuisine: data.cuisine || null,
    ingredients: data.ingredients.map(ing => ({
      name: (ing.name || '').trim(),
      quantity: (ing.quantity || '').trim(),
      category: GROCERY_CATEGORIES.includes(ing.category) ? ing.category : 'Other',
    })),
    steps: Array.isArray(data.steps)
      ? data.steps.filter(s => typeof s === 'string' && s.trim()).map(s => s.trim())
      : [],
  }
}

const EXAMPLE = JSON.stringify({
  name: "Chicken Parmesan",
  category: "Dinner",
  cuisine: "Italian",
  ingredients: [
    { name: "Chicken breast", quantity: "2 lbs", category: "Meat" },
    { name: "Marinara sauce", quantity: "1 jar", category: "Pantry" },
    { name: "Mozzarella", quantity: "8 oz", category: "Dairy" }
  ],
  steps: [
    "Pound chicken to even thickness",
    "Bread and pan-fry until golden",
    "Top with sauce and cheese, bake at 400°F for 15 min"
  ]
}, null, 2)

export default function ImportRecipeForm({ onImport, onCancel }) {
  const [text, setText] = useState('')
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  const [importing, setImporting] = useState(false)

  function handleParse() {
    setError(null)
    setPreview(null)

    let parsed
    try {
      parsed = JSON.parse(text.trim())
    } catch {
      setError('Invalid JSON. Make sure you paste valid JSON.')
      return
    }

    // Support single recipe or array
    const recipes = Array.isArray(parsed) ? parsed : [parsed]

    const allErrors = []
    const normalized = []
    for (let i = 0; i < recipes.length; i++) {
      const errs = validateRecipe(recipes[i])
      if (errs.length > 0) {
        const prefix = recipes.length > 1 ? `Recipe ${i + 1}: ` : ''
        allErrors.push(...errs.map(e => prefix + e))
      } else {
        normalized.push(normalizeRecipe(recipes[i]))
      }
    }

    if (allErrors.length > 0) {
      setError(allErrors.join('\n'))
      return
    }

    setPreview(normalized)
  }

  async function handleImport() {
    if (!preview) return
    setImporting(true)
    try {
      for (const recipe of preview) {
        await onImport(recipe)
      }
      onCancel()
    } catch {
      setError('Failed to import. Please try again.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-[var(--color-text-muted)] mb-3">
          Paste recipe JSON below. You can import one recipe or an array of multiple recipes.
        </p>

        {/* Collapsible format reference */}
        <details className="mb-3">
          <summary className="text-xs font-medium text-[var(--color-primary)] cursor-pointer">
            View format &amp; example
          </summary>
          <pre className="mt-2 text-xs bg-[var(--color-border-light)] text-[var(--color-text)] p-3 rounded-xl overflow-x-auto whitespace-pre">
{EXAMPLE}
          </pre>
          <div className="mt-2 text-xs text-[var(--color-text-muted)] space-y-1">
            <p><strong>Required:</strong> name, ingredients (each with name)</p>
            <p><strong>Optional:</strong> category, cuisine, steps, ingredient quantity &amp; category</p>
            <p><strong>Ingredient categories:</strong> {GROCERY_CATEGORIES.join(', ')}</p>
            <p><strong>Tip:</strong> Tell your AI tool to output in this exact JSON format.</p>
          </div>
        </details>
      </div>

      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setError(null); setPreview(null) }}
        placeholder='Paste recipe JSON here...'
        rows={10}
        className="w-full p-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:border-[var(--color-primary)] focus:outline-none text-[var(--color-text)] font-mono resize-y"
      />

      {error && (
        <pre className="mt-2 text-xs text-red-500 whitespace-pre-wrap">{error}</pre>
      )}

      {/* Preview */}
      {preview && (
        <div className="mt-3 p-3 bg-[var(--color-border-light)] rounded-xl">
          <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">
            Preview · {preview.length} recipe{preview.length !== 1 ? 's' : ''}
          </p>
          {preview.map((r, i) => (
            <div key={i} className="mb-2 last:mb-0">
              <p className="text-sm font-semibold text-[var(--color-text)]">{r.name}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {r.ingredients.length} ingredient{r.ingredients.length !== 1 ? 's' : ''}
                {r.steps.length > 0 && ` · ${r.steps.length} step${r.steps.length !== 1 ? 's' : ''}`}
                {r.category && ` · ${r.category}`}
                {r.cuisine && ` · ${r.cuisine}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        {!preview ? (
          <button
            onClick={handleParse}
            disabled={!text.trim()}
            className="flex-1 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-40"
          >
            Preview
          </button>
        ) : (
          <button
            onClick={handleImport}
            disabled={importing}
            className="flex-1 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-60"
          >
            {importing ? 'Importing...' : `Import ${preview.length} Recipe${preview.length !== 1 ? 's' : ''}`}
          </button>
        )}
        <button
          onClick={onCancel}
          className="px-4 py-3 text-[var(--color-text-muted)] font-medium rounded-xl hover:bg-[var(--color-border-light)] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
