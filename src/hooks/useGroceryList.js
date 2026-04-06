import { useEffect, useState } from 'react'
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
    })

    return unsubscribe
  }, [familyId])

  async function addItem({ name, quantity, category }) {
    if (!familyId) return
    await addDoc(collection(db, 'families', familyId, 'groceryItems'), {
      name,
      quantity,
      category,
      checked: false,
      addedBy: currentUser.uid,
      addedAt: serverTimestamp(),
    })
  }

  async function toggleItem(itemId, checked) {
    if (!familyId) return
    await updateDoc(doc(db, 'families', familyId, 'groceryItems', itemId), { checked })
  }

  async function deleteItem(itemId) {
    if (!familyId) return
    await deleteDoc(doc(db, 'families', familyId, 'groceryItems', itemId))
  }

  async function clearChecked() {
    if (!familyId) return
    const checked = items.filter((i) => i.checked)
    await Promise.all(checked.map((i) => deleteDoc(doc(db, 'families', familyId, 'groceryItems', i.id))))
  }

  async function addItems(newItems) {
    if (!familyId) return
    await Promise.all(
      newItems.map((item) =>
        addDoc(collection(db, 'families', familyId, 'groceryItems'), {
          name: item.name,
          quantity: item.quantity || '',
          category: item.category || 'Other',
          checked: false,
          addedBy: currentUser.uid,
          addedAt: serverTimestamp(),
        })
      )
    )
  }

  return { items, loading, addItem, toggleItem, deleteItem, clearChecked, addItems }
}
