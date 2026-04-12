import { useEffect, useState, useCallback } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export function useMenu() {
  const { familyId, currentUser } = useAuth()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!familyId) {
      setMenuItems([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'families', familyId, 'menuItems'),
      orderBy('addedAt', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snap) => {
      setMenuItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }, (err) => {
      console.error('Menu listener error:', err)
      setError('Failed to load menu')
      setLoading(false)
    })

    return unsubscribe
  }, [familyId])

  const clearError = useCallback(() => setError(null), [])

  async function addMenuItem({ name, recipeId }) {
    if (!familyId) return
    try {
      setError(null)
      await addDoc(collection(db, 'families', familyId, 'menuItems'), {
        name,
        recipeId: recipeId || null,
        addedBy: currentUser.uid,
        addedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error('Failed to add menu item:', err)
      setError('Failed to add menu item.')
      throw err
    }
  }

  async function deleteMenuItem(itemId) {
    if (!familyId) return
    try {
      setError(null)
      await deleteDoc(doc(db, 'families', familyId, 'menuItems', itemId))
    } catch (err) {
      console.error('Failed to delete menu item:', err)
      setError('Failed to delete menu item.')
    }
  }

  return { menuItems, loading, error, clearError, addMenuItem, deleteMenuItem }
}
