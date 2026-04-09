import { useState } from 'react'
import { useTheme, THEMES, LAYOUTS, DENSITIES, STYLES } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

export default function SettingsPage() {
  const { theme, layout, style, setTheme, setLayout, setStyle } = useTheme()
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
    <div className="max-w-2xl">
      {/* Header — cool gray for settings */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-white">Settings</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* User profile */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="" className="w-14 h-14 rounded-full" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center text-white text-lg font-bold">
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
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Family ID</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 break-all text-gray-700">
                {familyId}
              </code>
              <button
                onClick={copyFamilyId}
                className="flex-shrink-0 px-3 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                {copied ? '✓' : 'Copy'}
              </button>
            </div>
          </section>
        )}

        {/* Theme picker */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
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

        {/* Density picker */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Density</p>
          <div className="space-y-2">
            {DENSITIES.map((l) => (
              <button
                key={l.id}
                onClick={() => setLayout(l.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left ${
                  layout === l.id
                    ? 'border-gray-700 bg-gray-50'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div>
                  <p className={`text-sm font-medium ${layout === l.id ? 'text-gray-900' : 'text-gray-900'}`}>
                    {l.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{l.description}</p>
                </div>
                {layout === l.id && (
                  <svg className="w-5 h-5 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Visual Style picker */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Visual Style</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                  style === s.id
                    ? 'border-gray-700 bg-gray-50'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <span className="text-2xl leading-none">{s.icon}</span>
                <p className={`text-sm font-medium ${style === s.id ? 'text-gray-900' : 'text-gray-900'}`}>
                  {s.label}
                </p>
                <p className="text-xs text-gray-500 leading-tight">{s.description}</p>
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
    </div>
  )
}
