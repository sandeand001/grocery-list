import { useMemo } from 'react'
import { useGroceryList } from '../hooks/useGroceryList'
import { CATEGORIES } from '../utils/categories'
import CategoryGroup from '../components/CategoryGroup'
import AddItemForm from '../components/AddItemForm'
import LoadingSpinner from '../components/LoadingSpinner'

export default function GroceryListPage() {
  const { items, loading, addItem, toggleItem, deleteItem, clearChecked } = useGroceryList()

  const grouped = useMemo(() => {
    const map = {}
    for (const cat of CATEGORIES) {
      const catItems = items.filter((i) => i.category === cat.id)
      if (catItems.length > 0) map[cat.id] = catItems
    }
    return map
  }, [items])

  const checkedCount = items.filter((i) => i.checked).length
  const totalCount = items.length

  if (loading) return <LoadingSpinner />

  return (
    <div className="relative min-h-full">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Grocery List</h1>
            {totalCount > 0 && (
              <p className="text-xs text-gray-500">
                {totalCount - checkedCount} remaining · {checkedCount} checked
              </p>
            )}
          </div>
          {checkedCount > 0 && (
            <button
              onClick={clearChecked}
              className="text-xs text-red-500 font-medium border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors"
            >
              Clear checked ({checkedCount})
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-2 py-2">
        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Your list is empty</p>
            <p className="text-gray-400 text-sm mt-1">Tap + to add your first item</p>
          </div>
        ) : (
          Object.entries(grouped).map(([cat, catItems]) => (
            <CategoryGroup
              key={cat}
              category={cat}
              items={catItems}
              onToggle={toggleItem}
              onDelete={deleteItem}
            />
          ))
        )}
      </div>

      <AddItemForm onAdd={addItem} />
    </div>
  )
}
