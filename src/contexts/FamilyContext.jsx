import { createContext, useContext, useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './AuthContext'

const FamilyContext = createContext(null)

export function FamilyProvider({ children }) {
  const { familyId } = useAuth()
  const [members, setMembers] = useState([])

  useEffect(() => {
    // We can't easily query all users by familyId without an index,
    // so we just expose the familyId for sharing purposes.
    // Member list is informational only.
    setMembers([])
  }, [familyId])

  return (
    <FamilyContext.Provider value={{ familyId, members }}>
      {children}
    </FamilyContext.Provider>
  )
}

export function useFamily() {
  return useContext(FamilyContext)
}
