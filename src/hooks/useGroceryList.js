import { useEffect, useState, useCallback } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export function useGroceryList() {
  const { familyId, currentUser } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!familyId) {
      setItems([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'families', familyId, 'groceryItems'),
      orderBy('addedAt', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }, (err) => {
      console.error('Grocery list listener error:', err)
      setError('Failed to load grocery list')
      setLoading(false)
    })

    return unsubscribe
  }, [familyId])

  const clearError = useCallback(() => setError(null), [])

  async function addItem({ name, quantity, category }) {
    if (!familyId) return
    try {
      setError(null)
      await addDoc(collection(db, 'families', familyId, 'groceryItems'), {
        name,
        quantity,
        category,
        checked: false,
        addedBy: currentUser.uid,
        addedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error('Failed to add item:', err)
      setError('Failed to add item. Please try again.')
      throw err
    }
  }

  async function updateItem(itemId, updates) {
    if (!familyId) return
    try {
      setError(null)
      await updateDoc(doc(db, 'families', familyId, 'groceryItems', itemId), updates)
    } catch (err) {
      console.error('Failed to update item:', err)
      setError('Failed to update item.')
      throw err
    }
  }

  async function toggleItem(itemId, checked) {
    if (!familyId) return
    try {
      setError(null)
      await updateDoc(doc(db, 'families', familyId, 'groceryItems', itemId), { checked })
    } catch (err) {
      console.error('Failed to toggle item:', err)
      setError('Failed to update item.')
    }
  }

  async function deleteItem(itemId) {
    if (!familyId) return
    try {
      setError(null)
      await deleteDoc(doc(db, 'families', familyId, 'groceryItems', itemId))
    } catch (err) {
      console.error('Failed to delete item:', err)
      setError('Failed to delete item.')
    }
  }

  async function clearChecked() {
    if (!familyId) return
    try {
      setError(null)
      const checked = items.filter((i) => i.checked)
      await Promise.all(checked.map((i) => deleteDoc(doc(db, 'families', familyId, 'groceryItems', i.id))))
    } catch (err) {
      console.error('Failed to clear checked:', err)
      setError('Failed to clear checked items.')
    }
  }

  // Deduplication: merge with existing items by name + category
  async function addItems(newItems) {
    if (!familyId) return
    let addedCount = 0
    let mergedCount = 0
    try {
      setError(null)
      const uncheckedItems = items.filter(i => !i.checked)

      for (const item of newItems) {
        const itemName = (item.name || '').trim().toLowerCase()
        const itemCategory = item.category || 'Other'
        const existing = uncheckedItems.find(
          (e) => e.name.trim().toLowerCase() === itemName && e.category === itemCategory
        )

        if (existing) {
          // Merge: append quantity info
          const newQty = item.quantity
            ? existing.quantity
              ? `${existing.quantity} + ${item.quantity}`
              : item.quantity
            : existing.quantity
          await updateDoc(doc(db, 'families', familyId, 'groceryItems', existing.id), {
            quantity: newQty,
          })
          mergedCount++
        } else {
          await addDoc(collection(db, 'families', familyId, 'groceryItems'), {
            name: item.name,
            quantity: item.quantity || '',
            category: itemCategory,
            checked: false,
            addedBy: currentUser.uid,
            addedAt: serverTimestamp(),
          })
          addedCount++
        }
      }
      return { addedCount, mergedCount }
    } catch (err) {
      console.error('Failed to add items:', err)
      setError('Failed to add some items to the list.')
      return { addedCount, mergedCount }
    }
  }

  return { items, loading, error, clearError, addItem, updateItem, toggleItem, deleteItem, clearChecked, addItems }
}
