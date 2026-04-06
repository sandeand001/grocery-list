import { useState } from 'react'
import { CATEGORIES, ADD_CUSTOM_ID } from '../utils/categories'

const knownIds = new Set(CATEGORIES.map((c) => c.id))

export default function AddItemForm({ onAdd }) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [category, setCategory] = useState('Produce')
  const [customCategory, setCustomCategory] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  function handleCategoryChange(val) {
    if (val === ADD_CUSTOM_ID) {
      setShowCustom(true)
      setCategory(ADD_CUSTOM_ID)
    } else {
      setShowCustom(false)
      setCategory(val)
      setCustomCategory('')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    const finalCategory = showCustom ? customCategory.trim() : category
    if (showCustom && !finalCategory) return
    await onAdd({ name: name.trim(), quantity: quantity.trim(), category: finalCategory })
    setName('')
    setQuantity('')
    setCategory('Produce')
    setCustomCategory('')
    setShowCustom(false)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 w-14 h-14 bg-[var(--color-primary)] text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all z-40"
        aria-label="Add item"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center z-50"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:mx-auto rounded-t-2xl sm:rounded-2xl p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Add Item</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Item name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            autoFocus
            required
          />
          <input
            type="text"
            placeholder="Quantity (e.g. 2 lbs)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
          <select
            value={showCustom ? ADD_CUSTOM_ID : category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white"
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
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--color-primary)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              autoFocus
              required
            />
          )}
          <button
            type="submit"
            className="w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all"
          >
            Add to List
          </button>
        </form>
      </div>
    </div>
  )
}
