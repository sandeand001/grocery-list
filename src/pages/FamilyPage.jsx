import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { useFamily } from '../contexts/FamilyContext'

export default function FamilyPage() {
  const { currentUser, familyId, refreshUserDoc } = useAuth()
  const { members, familyName, updateFamilyName } = useFamily()
  const [joinId, setJoinId] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')

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
    const link = `${window.location.origin}/join/${familyId}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function shareFamilyLink() {
    const link = `${window.location.origin}/join/${familyId}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my family on FamilyCart',
          text: `Join my grocery list on FamilyCart!`,
          url: link,
        })
      } catch (e) {
        // User cancelled share — ignore
      }
    } else {
      await copyFamilyId()
    }
  }

  async function handleNameSave() {
    if (nameInput.trim()) {
      await updateFamilyName(nameInput)
    }
    setEditingName(false)
  }

  function getInitials(name) {
    return (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const avatarColors = [
    'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-rose-500', 'bg-cyan-500', 'bg-pink-500', 'bg-indigo-500',
  ]

  if (familyId) {
    return (
      <div>
        {/* Header — indigo/violet for family */}
        <div className="bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="text-lg font-bold bg-white/20 text-white placeholder-white/60 px-2 py-1 rounded-lg border border-white/30 focus:outline-none flex-1"
                    placeholder="Family name"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                  />
                  <button onClick={handleNameSave} className="text-white/80 hover:text-white text-sm font-medium">Save</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-white">{familyName || 'My Family'}</h1>
                  <button
                    onClick={() => { setNameInput(familyName); setEditingName(true) }}
                    className="text-white/60 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-xs text-white/70">{members.length} member{members.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Invite link */}
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border border-violet-100 p-4">
            <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-2">Invite Link</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-white border border-violet-200 rounded-lg px-3 py-2 break-all text-violet-800 font-mono truncate">
                {`${window.location.origin}/join/${familyId}`}
              </code>
              <button
                onClick={copyFamilyId}
                className="flex-shrink-0 px-3 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <button
              onClick={shareFamilyLink}
              className="mt-3 w-full py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Invite Link
            </button>
            <p className="text-xs text-violet-500 mt-2">Send this link to family members so they can join instantly</p>
          </div>

          {/* Members list */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Family Members</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {members.map((member, i) => (
                <div key={member.uid} className="flex items-center gap-3 px-4 py-3">
                  {member.photoURL ? (
                    <img src={member.photoURL} alt="" className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold`}>
                      {getInitials(member.displayName)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {member.displayName}
                      {member.uid === currentUser.uid && (
                        <span className="text-xs text-violet-500 ml-2">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                  </div>
                </div>
              ))}
              {members.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                  Loading members...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No family yet — setup screen
  return (
    <div>
      <div className="bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-5">
        <h1 className="text-lg font-bold text-white">Welcome, {currentUser.displayName?.split(' ')[0]}!</h1>
        <p className="text-sm text-white/80 mt-1">Set up your family to start sharing</p>
      </div>

      <div className="px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Create a Family</h2>
              <p className="text-xs text-gray-500">Start a new group and invite others</p>
            </div>
          </div>
          <button
            onClick={createFamily}
            className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 active:scale-95 transition-all"
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
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Join a Family</h2>
              <p className="text-xs text-gray-500">Enter a code from a family member</p>
            </div>
          </div>
          <form onSubmit={joinFamily} className="space-y-3">
            <input
              type="text"
              placeholder="Paste family code here"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 border-2 border-violet-600 text-violet-700 font-semibold rounded-xl hover:bg-violet-50 active:scale-95 transition-all"
            >
              Join Family
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
