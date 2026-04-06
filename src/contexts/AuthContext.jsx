import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userDoc, setUserDoc] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const ref = doc(db, 'users', user.uid)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          const data = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            familyId: null,
          }
          await setDoc(ref, data)
          setUserDoc(data)
        } else {
          setUserDoc(snap.data())
        }
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
        setUserDoc(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  async function signUpWithEmail(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
  }

  async function signInWithEmail(email, password) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    await signOut(auth)
  }

  async function refreshUserDoc() {
    if (!currentUser) return
    const snap = await getDoc(doc(db, 'users', currentUser.uid))
    if (snap.exists()) setUserDoc(snap.data())
  }

  const familyId = userDoc?.familyId ?? null

  return (
    <AuthContext.Provider value={{
      currentUser, userDoc, familyId, loading,
      signInWithGoogle, signUpWithEmail, signInWithEmail, logout, refreshUserDoc,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
