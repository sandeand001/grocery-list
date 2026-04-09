export const CATEGORIES = [
  { id: 'Produce',    label: 'Produce',    icon: '🥦', color: 'bg-green-100 text-green-800' },
  { id: 'Dairy',      label: 'Dairy',      icon: '🧈', color: 'bg-blue-100 text-blue-800' },
  { id: 'Meat',       label: 'Meat',       icon: '🥩', color: 'bg-red-100 text-red-800' },
  { id: 'Bakery',     label: 'Bakery',     icon: '🍞', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'Frozen',     label: 'Frozen',     icon: '🧊', color: 'bg-cyan-100 text-cyan-800' },
  { id: 'Pantry',     label: 'Pantry',     icon: '🫙', color: 'bg-orange-100 text-orange-800' },
  { id: 'Beverages',  label: 'Beverages',  icon: '🧃', color: 'bg-purple-100 text-purple-800' },
  { id: 'Household',  label: 'Household',  icon: '🧹', color: 'bg-gray-100 text-gray-800' },
  { id: 'Other',      label: 'Other',      icon: '📦', color: 'bg-pink-100 text-pink-800' },
]

export const ADD_CUSTOM_ID = 'ADD_CUSTOM'

export const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id))

export function getCategoryStyle(categoryId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId)
  return cat ? cat.color : 'bg-gray-100 text-gray-800'
}

export const RECIPE_CATEGORIES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Appetizer',
  'Side Dish',
  'Dessert',
  'Baked Goods',
  'Snack',
  'Beverage',
  'Soup',
  'Salad',
  'Sauce',
  'Other',
]

export const CUISINES = [
  'American',
  'Mexican',
  'Italian',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'Mediterranean',
  'French',
  'Korean',
  'Greek',
  'Vietnamese',
  'Middle Eastern',
  'Southern',
  'Cajun',
  'Other',
]
