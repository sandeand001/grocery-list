import { createContext, useContext, useEffect, useState } from 'react'

export const THEMES = [
  { id: 'green',  label: 'Fresh Green',   color: '#16a34a' },
  { id: 'blue',   label: 'Ocean Blue',    color: '#2563eb' },
  { id: 'orange', label: 'Warm Harvest',  color: '#f97316' },
  { id: 'purple', label: 'Berry',         color: '#9333ea' },
  { id: 'slate',  label: 'Slate Dark',    color: '#334155' },
]

export const DENSITIES = [
  { id: 'comfortable', label: 'Comfortable', description: 'Default spacing' },
  { id: 'compact',     label: 'Compact',     description: 'Tighter, more items visible' },
  { id: 'cozy',        label: 'Cozy',        description: 'Larger text & touch targets' },
]

export const STYLES = [
  { id: 'default',    label: 'Default',    description: 'Clean card-based layout',               icon: '▦' },
  { id: 'terminal',   label: 'Terminal',   description: 'Hacker CLI — pure text output',         icon: '▸' },
  { id: 'broadsheet', label: 'Broadsheet', description: 'Flowing newspaper columns',             icon: '☰' },
  { id: 'corkboard',  label: 'Corkboard',  description: 'Scattered sticky notes on a board',     icon: '📌' },
]

// Alias so any existing imports of LAYOUTS still work
export const LAYOUTS = DENSITIES

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem('familycart_theme') || 'green'
  )
  const [layout, setLayoutState] = useState(
    () => localStorage.getItem('familycart_layout') || 'comfortable'
  )
  const [style, setStyleState] = useState(
    () => localStorage.getItem('familycart_style') || 'default'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    DENSITIES.forEach((l) => document.documentElement.classList.remove(`layout-${l.id}`))
    document.documentElement.classList.add(`layout-${layout}`)
  }, [layout])

  useEffect(() => {
    STYLES.forEach((s) => document.documentElement.classList.remove(`layout-style-${s.id}`))
    if (style !== 'default') {
      document.documentElement.classList.add(`layout-style-${style}`)
    }
  }, [style])

  // Apply persisted values immediately on first mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    DENSITIES.forEach((l) => document.documentElement.classList.remove(`layout-${l.id}`))
    document.documentElement.classList.add(`layout-${layout}`)
    STYLES.forEach((s) => document.documentElement.classList.remove(`layout-style-${s.id}`))
    if (style !== 'default') {
      document.documentElement.classList.add(`layout-style-${style}`)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function setTheme(t) {
    localStorage.setItem('familycart_theme', t)
    setThemeState(t)
  }

  function setLayout(l) {
    localStorage.setItem('familycart_layout', l)
    setLayoutState(l)
  }

  function setStyle(s) {
    localStorage.setItem('familycart_style', s)
    setStyleState(s)
  }

  const isDark = theme === 'slate'

  return (
    <ThemeContext.Provider value={{ theme, layout, style, setTheme, setLayout, setStyle, isDark, THEMES, LAYOUTS, DENSITIES, STYLES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
