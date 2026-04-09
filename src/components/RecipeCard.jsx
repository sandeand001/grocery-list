import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

const stickyColors = ['#fff9c4', '#c8e6c9', '#bbdefb', '#f8bbd0', '#d1c4e9', '#ffe0b2', '#b2dfdb', '#ffccbc']

function hashColor(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0
  return stickyColors[Math.abs(h) % stickyColors.length]
}

function hashRotation(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0
  const rots = [-2.5, 1.5, -1, 2, -0.5, 3, -1.8, 0.8]
  return rots[Math.abs(h) % rots.length]
}

export default function RecipeCard({ recipe, onDelete }) {
  const navigate = useNavigate()
  const { style } = useTheme()

  // ── Terminal: file listing ──
  if (style === 'terminal') {
    return (
      <div
        onClick={() => navigate(`/recipes/${recipe.id}`)}
        className="group cursor-pointer py-0.5 px-3"
        style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem' }}
      >
        <span style={{ color: '#007a1f' }}>-rw-r--r-- </span>
        <span style={{ color: '#00ff41' }}>{recipe.name}</span>
        <span style={{ color: '#005a15' }}> ({recipe.ingredients?.length ?? 0} ingredients, {recipe.steps?.length ?? 0} steps)</span>
        <span
          onClick={(e) => { e.stopPropagation(); onDelete(recipe.id) }}
          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
          style={{ color: '#5c0000', cursor: 'pointer' }}
        >
          rm
        </span>
      </div>
    )
  }

  // ── Broadsheet: article teaser ──
  if (style === 'broadsheet') {
    return (
      <article
        onClick={() => navigate(`/recipes/${recipe.id}`)}
        className="cursor-pointer mb-4"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        <div style={{ borderTop: '2px solid #1a1a1a', paddingTop: '0.5rem' }}>
          <div className="flex items-start justify-between gap-2">
            <h3 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: '1.2rem',
              color: '#1a1a1a',
              lineHeight: 1.2,
              marginBottom: '0.25rem',
            }}>
              {recipe.name}
            </h3>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(recipe.id) }}
              style={{ color: '#c9b99a', fontSize: '0.8rem', flexShrink: 0, paddingTop: '0.25rem' }}
            >✕</button>
          </div>
          <p style={{
            fontSize: '0.85rem',
            color: '#4a3728',
            fontStyle: 'italic',
            lineHeight: 1.4,
          }}>
            A recipe featuring{' '}
            {recipe.ingredients?.slice(0, 3).map(i => i.name.toLowerCase()).join(', ')}
            {(recipe.ingredients?.length ?? 0) > 3 && ` and ${recipe.ingredients.length - 3} more`}
            .{' '}
            <span style={{ color: '#9b7b4a' }}>
              {recipe.steps?.length ?? 0} preparation step{recipe.steps?.length !== 1 ? 's' : ''}.
            </span>
          </p>
        </div>
      </article>
    )
  }

  // ── Corkboard: recipe card as an index card pinned to the board ──
  if (style === 'corkboard') {
    const bg = hashColor(recipe.name)
    const rot = hashRotation(recipe.name)

    return (
      <div
        onClick={() => navigate(`/recipes/${recipe.id}`)}
        className="cursor-pointer inline-block align-top mx-2 mb-5"
        style={{
          width: 'calc(50% - 1rem)',
          minWidth: '150px',
          transform: `rotate(${rot}deg)`,
          transformOrigin: 'center top',
        }}
      >
        {/* Tape */}
        <div style={{
          width: '45px', height: '12px', background: 'rgba(200,200,180,0.6)',
          margin: '0 auto -6px', borderRadius: '1px', position: 'relative', zIndex: 2,
        }} />
        <div style={{
          background: bg,
          padding: '0.85rem 0.75rem 0.6rem',
          boxShadow: '2px 3px 10px rgba(0,0,0,0.18)',
          minHeight: '90px',
        }}>
          <div className="flex items-start justify-between">
            <h3 style={{
              fontFamily: '"Caveat", cursive',
              fontWeight: 700,
              fontSize: '1.15rem',
              color: '#3d2b1f',
              lineHeight: 1.1,
              textDecoration: 'underline',
              textDecorationColor: '#c9a96e',
              textUnderlineOffset: '2px',
            }}>
              {recipe.name}
            </h3>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(recipe.id) }}
              style={{ color: '#a89279', fontSize: '0.9rem', fontFamily: '"Caveat", cursive' }}
            >✕</button>
          </div>
          <p style={{
            fontFamily: '"Caveat", cursive',
            fontSize: '0.95rem',
            color: '#6b5a3e',
            marginTop: '0.3rem',
          }}>
            {recipe.ingredients?.slice(0, 3).map(i => i.name).join(', ')}
            {(recipe.ingredients?.length ?? 0) > 3 && '...'}
          </p>
        </div>
      </div>
    )
  }

  // ── Default: full-width row, no card ──
  return (
    <div
      className="cursor-pointer active:bg-[var(--color-border-light)] transition-colors"
      onClick={() => navigate(`/recipes/${recipe.id}`)}
    >
      <div className="px-5 py-4 flex items-start gap-4">
        {/* Thumbnail — only if image exists */}
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
          />
        )}

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[var(--color-text)] text-base leading-snug">{recipe.name}</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1 leading-relaxed">
            {recipe.ingredients?.slice(0, 4).map(i => i.name).join(', ')}
            {(recipe.ingredients?.length ?? 0) > 4 && ` +${recipe.ingredients.length - 4} more`}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
            {recipe.ingredients?.length ?? 0} ingredients{recipe.steps?.length > 0 ? ` · ${recipe.steps.length} steps` : ''}
          </p>
          {(recipe.category || recipe.cuisine) && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {recipe.category && (
                <span className="text-[0.65rem] font-medium px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  {recipe.category}
                </span>
              )}
              {recipe.cuisine && (
                <span className="text-[0.65rem] font-medium px-2 py-0.5 rounded-full bg-[var(--color-border-light)] text-[var(--color-text-muted)]">
                  {recipe.cuisine}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(recipe.id)
          }}
          className="text-[var(--color-border)] hover:text-red-400 transition-colors p-1 flex-shrink-0 mt-1"
          aria-label="Delete recipe"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      {/* Subtle separator — visible thin line */}
      <div className="mx-5 h-px bg-[var(--color-border)]" />
    </div>
  )
}
