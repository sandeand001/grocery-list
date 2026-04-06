import { getCategoryStyle } from '../utils/categories'

export default function GroceryItem({ item, onToggle, onDelete }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 last:border-0 transition-opacity ${
        item.checked ? 'opacity-50' : ''
      }`}
    >
      <button
        onClick={() => onToggle(item.id, !item.checked)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          item.checked
            ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
            : 'border-gray-300 hover:border-[var(--color-primary)]'
        }`}
        aria-label={item.checked ? 'Uncheck item' : 'Check item'}
      >
        {item.checked && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium block truncate ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {item.name}
        </span>
        {item.quantity && (
          <span className="text-xs text-gray-500">{item.quantity}</span>
        )}
      </div>

      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${getCategoryStyle(item.category)}`}>
        {item.category}
      </span>

      <button
        onClick={() => onDelete(item.id)}
        className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 p-1"
        aria-label="Delete item"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
