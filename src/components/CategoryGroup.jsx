import GroceryItem from './GroceryItem'
import { useTheme } from '../contexts/ThemeContext'
import { CATEGORIES } from '../utils/categories'

function getCategoryIcon(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId)?.icon ?? ''
}

// Deterministic "random" rotation from string
function hashRotation(str, index) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0
  const rotations = [-3, -1.5, 0.8, 2, -2.5, 1.2, -0.5, 3, 1.8, -1]
  return rotations[(Math.abs(h) + index) % rotations.length]
}

const stickyColors = [
  '#fffde7', '#fff9c4', '#fff3e0', '#e8f5e9', '#e3f2fd',
  '#fce4ec', '#f3e5f5', '#e0f7fa', '#fff8e1', '#f1f8e9',
]

export default function CategoryGroup({ category, items, onToggle, onDelete, onUpdate }) {
  const { style } = useTheme()

  // ── Terminal: pure text output, no containers ──
  if (style === 'terminal') {
    return (
      <div className="mb-1 font-mono" style={{ color: '#00ff41' }}>
        <div className="px-3 py-0.5" style={{ color: '#007a1f' }}>
          <span style={{ color: '#005a15' }}>~/groceries$</span>{' '}
          <span style={{ color: '#00ff41' }}>ls {category.toLowerCase().replace(/\s+/g, '_')}/</span>
        </div>
        <div className="pl-3">
          {items.map((item) => (
            <GroceryItem key={item.id} item={item} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
          ))}
        </div>
        <div className="px-3 pt-0.5 pb-1" style={{ color: '#003d0f', fontSize: '0.7rem' }}>
          {items.length} item{items.length !== 1 ? 's' : ''} — {items.filter(i => i.checked).length} done
        </div>
      </div>
    )
  }

  // ── Broadsheet: flowing newspaper column, no cards ──
  if (style === 'broadsheet') {
    const unchecked = items.filter(i => !i.checked)
    const checked = items.filter(i => i.checked)

    return (
      <div className="mb-5 px-4" style={{ fontFamily: 'Georgia, serif' }}>
        {/* Section rule + headline */}
        <div style={{ borderTop: '3px double #1a1a1a', paddingTop: '0.5rem', marginBottom: '0.4rem' }}>
          <h3 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            fontSize: '1.15rem',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            lineHeight: 1.1,
          }}>
            {category}
          </h3>
          <div style={{ width: '100%', borderBottom: '1px solid #1a1a1a', marginTop: '0.25rem' }} />
        </div>

        {/* Flowing inline items like a classified ad column */}
        <div style={{
          columnCount: unchecked.length > 4 ? 2 : 1,
          columnGap: '1.5rem',
          columnRule: '1px solid #c9b99a',
          paddingTop: '0.25rem',
        }}>
          {unchecked.map((item) => (
            <GroceryItem key={item.id} item={item} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
          ))}
        </div>

        {/* Struck-through items in smaller italic text */}
        {checked.length > 0 && (
          <div style={{ marginTop: '0.5rem', paddingTop: '0.25rem', borderTop: '1px dotted #c9b99a' }}>
            <span style={{ fontSize: '0.65rem', color: '#9b7b4a', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Acquired ·{' '}
            </span>
            {checked.map((item, i) => (
              <span key={item.id} style={{ fontSize: '0.8rem', color: '#9b7b4a', textDecoration: 'line-through', fontStyle: 'italic' }}>
                <span
                  onClick={() => onToggle(item.id, false)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.name}{item.quantity ? ` (${item.quantity})` : ''}
                </span>
                {i < checked.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── Corkboard: scattered sticky notes ──
  if (style === 'corkboard') {
    const rotation = hashRotation(category, 0)
    const colorIdx = Math.abs(category.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % stickyColors.length
    const bgColor = stickyColors[colorIdx]

    return (
      <div className="inline-block align-top mx-2 mb-6" style={{
        width: 'calc(50% - 1rem)',
        minWidth: '160px',
        maxWidth: '280px',
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center top',
      }}>
        {/* Tape strip */}
        <div style={{
          width: '50px',
          height: '14px',
          background: 'rgba(200, 200, 180, 0.6)',
          margin: '0 auto -7px',
          borderRadius: '1px',
          position: 'relative',
          zIndex: 2,
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }} />
        {/* Note */}
        <div style={{
          background: bgColor,
          padding: '1rem 0.75rem 0.75rem',
          boxShadow: '2px 3px 10px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.1)',
          position: 'relative',
          minHeight: '100px',
        }}>
          <h3 style={{
            fontFamily: '"Caveat", cursive',
            fontWeight: 700,
            fontSize: '1.2rem',
            color: '#3d2b1f',
            marginBottom: '0.4rem',
            textDecoration: 'underline',
            textDecorationColor: '#c9a96e',
            textUnderlineOffset: '3px',
          }}>
            {category}
          </h3>
          {items.map((item) => (
            <GroceryItem key={item.id} item={item} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
          ))}
        </div>
      </div>
    )
  }

  // ── Default: edge-to-edge, no cards, typography-driven ──
  const icon = getCategoryIcon(category)
  return (
    <div className="mb-6">
      {/* Category header — icon + label, generous top spacing */}
      <div className="px-5 pt-6 pb-2 flex items-baseline justify-between">
        <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-[0.15em] flex items-center gap-1.5">
          {icon && <span className="text-sm not-italic normal-case">{icon}</span>}
          {category}
        </h3>
        <span className="text-[0.7rem] text-[var(--color-text-muted)]">
          {items.filter(i => !i.checked).length} left
        </span>
      </div>
      {/* Items — full-width rows separated by whitespace, no container */}
      <div>
        {items.map((item) => (
          <GroceryItem
            key={item.id}
            item={item}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  )
}
