export const CATEGORIES = [
  { id: 'Produce',    label: 'Produce',    color: 'bg-green-100 text-green-800' },
  { id: 'Dairy',      label: 'Dairy',      color: 'bg-blue-100 text-blue-800' },
  { id: 'Meat',       label: 'Meat',       color: 'bg-red-100 text-red-800' },
  { id: 'Bakery',     label: 'Bakery',     color: 'bg-yellow-100 text-yellow-800' },
  { id: 'Frozen',     label: 'Frozen',     color: 'bg-cyan-100 text-cyan-800' },
  { id: 'Pantry',     label: 'Pantry',     color: 'bg-orange-100 text-orange-800' },
  { id: 'Beverages',  label: 'Beverages',  color: 'bg-purple-100 text-purple-800' },
  { id: 'Household',  label: 'Household',  color: 'bg-gray-100 text-gray-800' },
  { id: 'Other',      label: 'Other',      color: 'bg-pink-100 text-pink-800' },
]

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id)

export function getCategoryStyle(categoryId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId)
  return cat ? cat.color : 'bg-gray-100 text-gray-800'
}
