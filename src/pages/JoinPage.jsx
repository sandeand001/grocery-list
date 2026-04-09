import { useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function JoinPage() {
  const { familyId: inviteFamilyId } = useParams()
  const { currentUser, familyId, loading, refreshUserDoc } = useAuth()
  const navigate = useNavigate()
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (loading) return
    if (!currentUser) return // will redirect to login below
    if (familyId === inviteFamilyId) {
      // Already in this family
      navigate('/grocery', { replace: true })
      return
    }
    if (!familyId) {
      // No family yet — auto-join
      autoJoin()
    }
  }, [loading, currentUser, familyId])

  async function autoJoin() {
    setJoining(true)
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { familyId: inviteFamilyId })
      await refreshUserDoc()
      navigate('/grocery', { replace: true })
    } catch (err) {
      console.error('Failed to join family:', err)
      setError('Could not join this family. The link may be invalid.')
      setJoining(false)
    }
  }

  async function handleJoin() {
    setJoining(true)
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { familyId: inviteFamilyId })
      await refreshUserDoc()
      navigate('/grocery', { replace: true })
    } catch (err) {
      console.error('Failed to join family:', err)
      setError('Could not join this family. The link may be invalid.')
      setJoining(false)
    }
  }

  if (loading) return <LoadingSpinner />

  // Not logged in — redirect to login, then they'll come back to this URL
  if (!currentUser) {
    // Store the join URL so after login they land back here
    sessionStorage.setItem('pendingJoin', `/join/${inviteFamilyId}`)
    return <Navigate to="/login" replace />
  }

  if (joining) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <LoadingSpinner />
        <p className="mt-4 text-[var(--color-text-muted)] text-sm">Joining family…</p>
      </div>
    )
  }

  // Already in a different family — ask to switch
  if (familyId && familyId !== inviteFamilyId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <p className="text-4xl mb-4">👨‍👩‍👧‍👦</p>
        <h1 className="text-xl font-bold text-[var(--color-text)] mb-2">Join a new family?</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-6 max-w-xs">
          You're already in a family. Joining this one will switch you over. Your current family data stays — you just won't see it anymore.
        </p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={() => navigate('/grocery', { replace: true })}
            className="flex-1 py-3 border border-[var(--color-border)] text-[var(--color-text-muted)] font-semibold rounded-xl hover:bg-[var(--color-border-light)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            className="flex-1 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-90 transition-colors"
          >
            Switch
          </button>
        </div>
      </div>
    )
  }

  return null
}
