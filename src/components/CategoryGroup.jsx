import GroceryItem from './GroceryItem'

export default function CategoryGroup({ category, items, onToggle, onDelete }) {
  return (
    <div className="mb-3">
      <div className="px-4 py-1.5 bg-gray-50 border-y border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {category}
        </h3>
      </div>
      <div className="bg-white shadow-sm rounded-b-lg overflow-hidden">
        {items.map((item) => (
          <GroceryItem
            key={item.id}
            item={item}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
