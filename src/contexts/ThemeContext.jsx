import { createContext, useContext, useEffect, useState } from 'react'

export const THEMES = [
  { id: 'green',  label: 'Fresh Green',   color: '#16a34a' },
  { id: 'blue',   label: 'Ocean Blue',    color: '#2563eb' },
  { id: 'orange', label: 'Warm Harvest',  color: '#f97316' },
  { id: 'purple', label: 'Berry',         color: '#9333ea' },
  { id: 'slate',  label: 'Slate Dark',    color: '#334155' },
]

export const LAYOUTS = [
  { id: 'comfortable', label: 'Comfortable', description: 'Default spacing' },
  { id: 'compact',     label: 'Compact',     description: 'Tighter, more items visible' },
  { id: 'cozy',        label: 'Cozy',        description: 'Larger text & touch targets' },
]

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem('familycart_theme') || 'green'
  )
  const [layout, setLayoutState] = useState(
    () => localStorage.getItem('familycart_layout') || 'comfortable'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    LAYOUTS.forEach((l) => document.documentElement.classList.remove(`layout-${l.id}`))
    document.documentElement.classList.add(`layout-${layout}`)
  }, [layout])

  // Apply persisted values immediately on first mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    LAYOUTS.forEach((l) => document.documentElement.classList.remove(`layout-${l.id}`))
    document.documentElement.classList.add(`layout-${layout}`)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function setTheme(t) {
    localStorage.setItem('familycart_theme', t)
    setThemeState(t)
  }

  function setLayout(l) {
    localStorage.setItem('familycart_layout', l)
    setLayoutState(l)
  }

  const isDark = theme === 'slate'

  return (
    <ThemeContext.Provider value={{ theme, layout, setTheme, setLayout, isDark, THEMES, LAYOUTS }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
