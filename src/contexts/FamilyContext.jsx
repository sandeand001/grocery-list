import { createContext, useContext, useEffect, useState } from 'react'
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './AuthContext'

const FamilyContext = createContext(null)

export function FamilyProvider({ children }) {
  const { familyId, currentUser } = useAuth()
  const [members, setMembers] = useState([])
  const [familyName, setFamilyName] = useState('')
  const [loading, setLoading] = useState(false)

  // Ensure user is registered in the family doc's members array
  useEffect(() => {
    if (!familyId || !currentUser) return
    const familyRef = doc(db, 'families', familyId)
    async function ensureMembership() {
      const snap = await getDoc(familyRef)
      const memberEntry = {
        uid: currentUser.uid,
        displayName: currentUser.displayName || 'Unknown',
        email: currentUser.email,
        photoURL: currentUser.photoURL || null,
      }
      if (!snap.exists()) {
        await setDoc(familyRef, {
          name: `${currentUser.displayName?.split(' ')[0]}'s Family`,
          members: [memberEntry],
          createdBy: currentUser.uid,
        }, { merge: true })
      } else {
        const data = snap.data()
        const existingMember = data.members?.find(m => m.uid === currentUser.uid)
        if (!existingMember) {
          await updateDoc(familyRef, { members: arrayUnion(memberEntry) })
        } else if (existingMember.displayName !== memberEntry.displayName || existingMember.photoURL !== memberEntry.photoURL) {
          // Update stale member info
          const updated = data.members.map(m => m.uid === currentUser.uid ? memberEntry : m)
          await updateDoc(familyRef, { members: updated })
        }
      }
    }
    ensureMembership().catch(console.error)
  }, [familyId, currentUser])

  // Real-time listener for family doc
  useEffect(() => {
    if (!familyId) {
      setMembers([])
      setFamilyName('')
      setLoading(false)
      return
    }
    setLoading(true)
    const unsubscribe = onSnapshot(doc(db, 'families', familyId), (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        setMembers(data.members || [])
        setFamilyName(data.name || '')
      } else {
        setMembers([])
        setFamilyName('')
      }
      setLoading(false)
    })
    return unsubscribe
  }, [familyId])

  async function updateFamilyName(name) {
    if (!familyId || !name.trim()) return
    await updateDoc(doc(db, 'families', familyId), { name: name.trim() })
  }

  return (
    <FamilyContext.Provider value={{ familyId, members, familyName, loading, updateFamilyName }}>
      {children}
    </FamilyContext.Provider>
  )
}

export function useFamily() {
  return useContext(FamilyContext)
}
