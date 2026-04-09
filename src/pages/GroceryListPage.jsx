import { useMemo, useState } from 'react'
import { useGroceryList } from '../hooks/useGroceryList'
import { CATEGORIES, CATEGORY_IDS } from '../utils/categories'
import CategoryGroup from '../components/CategoryGroup'
import AddItemForm from '../components/AddItemForm'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../components/Toast'
import { useTheme } from '../contexts/ThemeContext'

export default function GroceryListPage() {
  const { items, loading, error, clearError, addItem, toggleItem, deleteItem, updateItem, clearChecked } = useGroceryList()
  const toast = useToast()
  const { style: visualStyle } = useTheme()
  const [search, setSearch] = useState('')
  const [hideChecked, setHideChecked] = useState(false)

  const filteredItems = useMemo(() => {
    let result = items
    if (hideChecked) result = result.filter(i => !i.checked)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
    }
    return result
  }, [items, search, hideChecked])

  const grouped = useMemo(() => {
    const map = {}
    for (const cat of CATEGORIES) {
      const catItems = filteredItems.filter((i) => i.category === cat.id)
      if (catItems.length > 0) map[cat.id] = catItems
    }
    for (const item of filteredItems) {
      if (!CATEGORY_IDS.has(item.category)) {
        if (!map[item.category]) map[item.category] = []
        map[item.category].push(item)
      }
    }
    return map
  }, [filteredItems])

  const checkedCount = items.filter((i) => i.checked).length
  const totalCount = items.length

  if (loading) return <LoadingSpinner />

  return (
    <div className="relative min-h-full">
      {/* Error banner */}
      {error && (
        <div className="px-5 pt-3">
          <p className="text-red-600 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-400 hover:text-red-600 ml-2">✕</button>
          </p>
        </div>
      )}

      {/* Header — typographic, edge-to-edge, no gradient box */}
      <div className="sticky top-0 z-30 bg-[var(--color-bg)]/95 backdrop-blur-md">
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Grocery List</h1>
              {totalCount > 0 && (
                <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                  {totalCount - checkedCount} to get{checkedCount > 0 ? ` · ${checkedCount} done` : ''}
                </p>
              )}
            </div>
            {checkedCount > 0 && (
              <button
                onClick={clearChecked}
                className="text-sm text-[var(--color-primary)] font-medium hover:opacity-70 transition-opacity"
              >
                Clear done
              </button>
            )}
          </div>
        </div>

        {/* Search — minimal, underline-style */}
        {totalCount > 0 && (
          <div className="px-5 pb-3 flex items-center gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-6 pr-2 py-1.5 text-sm bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none transition-colors placeholder-[var(--color-text-muted)]"
              />
            </div>
            <button
              onClick={() => setHideChecked(!hideChecked)}
              className={`text-xs font-medium transition-colors ${
                hideChecked ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
              }`}
            >
              {hideChecked ? 'Show all' : 'Hide done'}
            </button>
          </div>
        )}

        {/* Subtle divider — just a thin gradient line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
      </div>

      {/* Content */}
      <div className={`${visualStyle === 'corkboard' ? 'flex flex-wrap justify-center pt-6 px-2' : 'pt-2'}`}>
        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-8">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-[var(--color-text)] font-semibold text-lg">Your list is empty</p>
            <p className="text-[var(--color-text-muted)] text-sm mt-1 max-w-[240px] leading-relaxed">
              Tap + to add items, or add ingredients from a recipe
            </p>
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <p className="text-[var(--color-text-muted)] text-sm">No items match your search</p>
          </div>
        ) : (
          Object.entries(grouped).map(([cat, catItems]) => (
            <CategoryGroup
              key={cat}
              category={cat}
              items={catItems}
              onToggle={toggleItem}
              onDelete={deleteItem}
              onUpdate={updateItem}
            />
          ))
        )}
      </div>

      <AddItemForm onAdd={addItem} />
    </div>
  )
}
