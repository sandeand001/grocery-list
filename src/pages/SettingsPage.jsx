import { useState } from 'react'
import { useTheme, THEMES, LAYOUTS } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

export default function SettingsPage() {
  const { theme, layout, setTheme, setLayout } = useTheme()
  const { currentUser, familyId, logout } = useAuth()
  const [copied, setCopied] = useState(false)

  async function copyFamilyId() {
    if (!familyId) return
    await navigator.clipboard.writeText(familyId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : currentUser?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="px-4 py-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* User profile */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <div className="flex items-center gap-4">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="" className="w-14 h-14 rounded-full" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-lg font-bold">
              {initials}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 text-base">{currentUser?.displayName || 'No name'}</p>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
          </div>
        </div>
      </section>

      {/* Family ID */}
      {familyId && (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Family ID</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 break-all text-gray-700">
              {familyId}
            </code>
            <button
              onClick={copyFamilyId}
              className="flex-shrink-0 px-3 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        </section>
      )}

      {/* Theme picker */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Color Theme</p>
        <div className="grid grid-cols-5 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              title={t.label}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                theme === t.id
                  ? 'ring-2 ring-offset-2 bg-gray-50'
                  : 'hover:bg-gray-50'
              }`}
              style={theme === t.id ? { ringColor: t.color } : {}}
            >
              <div
                className="w-9 h-9 rounded-full shadow-sm border-2 border-white"
                style={{ backgroundColor: t.color }}
              />
              <span className="text-xs text-gray-600 text-center leading-tight">{t.label}</span>
              {theme === t.id && (
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }} />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Layout picker */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Layout Style</p>
        <div className="space-y-2">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLayout(l.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left ${
                layout === l.id
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div>
                <p className={`text-sm font-medium ${layout === l.id ? 'text-[var(--color-primary-text)]' : 'text-gray-900'}`}>
                  {l.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{l.description}</p>
              </div>
              {layout === l.id && (
                <svg className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Sign out */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <button
          onClick={logout}
          className="w-full py-3 border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 active:scale-95 transition-all"
        >
          Sign Out
        </button>
      </section>
    </div>
  )
}
