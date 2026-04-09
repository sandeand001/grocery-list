import { useEffect, useState, useCallback } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

function compressImage(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ratio = Math.min(1, maxWidth / img.width)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality)
    }
    img.src = URL.createObjectURL(file)
  })
}

export function useRecipes() {
  const { familyId, currentUser } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!familyId) {
      setRecipes([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'families', familyId, 'recipes'),
      orderBy('name', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snap) => {
      setRecipes(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }, (err) => {
      console.error('Recipes listener error:', err)
      setError('Failed to load recipes')
      setLoading(false)
    })

    return unsubscribe
  }, [familyId])

  const clearError = useCallback(() => setError(null), [])

  async function uploadRecipeImage(file) {
    const compressed = await compressImage(file)
    const path = `families/${familyId}/recipes/${Date.now()}-${file.name}`
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, compressed)
    return { url: await getDownloadURL(storageRef), path }
  }

  async function addRecipe({ name, ingredients, steps, category, cuisine, imageFile }) {
    if (!familyId) return
    try {
      setError(null)
      let imageUrl = null
      let imagePath = null
      if (imageFile) {
        const result = await uploadRecipeImage(imageFile)
        imageUrl = result.url
        imagePath = result.path
      }
      await addDoc(collection(db, 'families', familyId, 'recipes'), {
        name,
        ingredients,
        steps: steps || [],
        category: category || null,
        cuisine: cuisine || null,
        imageUrl,
        imagePath,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
      })
    } catch (err) {
      console.error('Failed to add recipe:', err)
      setError('Failed to save recipe. Please try again.')
      throw err
    }
  }

  async function deleteRecipe(recipeId) {
    if (!familyId) return
    try {
      setError(null)
      const recipe = recipes.find((r) => r.id === recipeId)
      if (recipe?.imagePath) {
        try {
          await deleteObject(ref(storage, recipe.imagePath))
        } catch (e) {
          console.warn('Failed to delete recipe image:', e)
        }
      }
      await deleteDoc(doc(db, 'families', familyId, 'recipes', recipeId))
    } catch (err) {
      console.error('Failed to delete recipe:', err)
      setError('Failed to delete recipe.')
    }
  }

  async function updateRecipe(recipeId, { name, ingredients, steps, category, cuisine, imageFile, removeImage }) {
    if (!familyId) return
    try {
      setError(null)
      const existing = recipes.find((r) => r.id === recipeId)
      const updates = {
        name,
        ingredients,
        steps: steps || [],
        category: category || null,
        cuisine: cuisine || null,
        updatedAt: serverTimestamp(),
      }

      if (removeImage && existing?.imagePath) {
        try {
          await deleteObject(ref(storage, existing.imagePath))
        } catch (e) {
          console.warn('Failed to delete old recipe image:', e)
        }
        updates.imageUrl = null
        updates.imagePath = null
      }

      if (imageFile) {
        if (existing?.imagePath) {
          try {
            await deleteObject(ref(storage, existing.imagePath))
          } catch (e) {
            console.warn('Failed to delete old recipe image:', e)
          }
        }
        const result = await uploadRecipeImage(imageFile)
        updates.imageUrl = result.url
        updates.imagePath = result.path
      }

      await updateDoc(doc(db, 'families', familyId, 'recipes', recipeId), updates)
    } catch (err) {
      console.error('Failed to update recipe:', err)
      setError('Failed to update recipe. Please try again.')
      throw err
    }
  }

  return { recipes, loading, error, clearError, addRecipe, deleteRecipe, updateRecipe }
}
