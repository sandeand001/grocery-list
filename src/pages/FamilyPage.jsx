import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export default function FamilyPage() {
  const { currentUser, familyId, refreshUserDoc } = useAuth()
  const [joinId, setJoinId] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function createFamily() {
    const newId = crypto.randomUUID()
    await updateDoc(doc(db, 'users', currentUser.uid), { familyId: newId })
    await refreshUserDoc()
  }

  async function joinFamily(e) {
    e.preventDefault()
    const id = joinId.trim()
    if (!id) return
    setError('')
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { familyId: id })
      await refreshUserDoc()
    } catch (err) {
      setError('Could not join that family. Check the ID and try again.')
    }
  }

  async function copyFamilyId() {
    await navigator.clipboard.writeText(familyId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (familyId) {
    return (
      <div className="px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Family</h1>
          <p className="text-gray-500 text-sm mt-1">Share your Family ID to let others join.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Family ID</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 break-all text-gray-800">
              {familyId}
            </code>
            <button
              onClick={copyFamilyId}
              className="flex-shrink-0 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            {currentUser.photoURL && (
              <img src={currentUser.photoURL} alt="" className="w-10 h-10 rounded-full" />
            )}
            <div>
              <p className="font-medium text-gray-900">{currentUser.displayName}</p>
              <p className="text-xs text-gray-500">{currentUser.email}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser.displayName?.split(' ')[0]}!</h1>
        <p className="text-gray-500 text-sm mt-1">Set up your family to start sharing your grocery list.</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Create a Family</h2>
          <p className="text-sm text-gray-500 mb-4">Start a new family group. Share the ID with family members so they can join.</p>
          <button
            onClick={createFamily}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 active:scale-95 transition-all"
          >
            Create My Family
          </button>
        </div>

        <div className="relative flex items-center">
          <div className="flex-1 border-t border-gray-200" />
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Join a Family</h2>
          <p className="text-sm text-gray-500 mb-4">Enter the Family ID shared with you by a family member.</p>
          <form onSubmit={joinFamily} className="space-y-3">
            <input
              type="text"
              placeholder="Family ID"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 border-2 border-green-600 text-green-700 font-semibold rounded-xl hover:bg-green-50 active:scale-95 transition-all"
            >
              Join Family
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
