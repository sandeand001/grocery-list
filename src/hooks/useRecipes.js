import { useEffect, useState } from 'react'
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

export function useRecipes() {
  const { familyId, currentUser } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!familyId) {
      setRecipes([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'families', familyId, 'recipes'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snap) => {
      setRecipes(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })

    return unsubscribe
  }, [familyId])

  async function addRecipe({ name, ingredients }) {
    if (!familyId) return
    await addDoc(collection(db, 'families', familyId, 'recipes'), {
      name,
      ingredients,
      createdBy: currentUser.uid,
      createdAt: serverTimestamp(),
    })
  }

  async function deleteRecipe(recipeId) {
    if (!familyId) return
    await deleteDoc(doc(db, 'families', familyId, 'recipes', recipeId))
  }

  return { recipes, loading, addRecipe, deleteRecipe }
}
