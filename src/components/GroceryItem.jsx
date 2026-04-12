import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function GroceryItem({ item, onToggle, onDelete, onUpdate }) {
  const { style } = useTheme()
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(item.name)
  const [editQty, setEditQty] = useState(item.quantity || '')
  const [editingQty, setEditingQty] = useState(false)
  const [qtyValue, setQtyValue] = useState(item.quantity || '')
  const qtyInputRef = useRef(null)

  useEffect(() => {
    if (editingQty && qtyInputRef.current) qtyInputRef.current.focus()
  }, [editingQty])

  function handleSave() {
    if (editName.trim() && onUpdate) {
      onUpdate(item.id, { name: editName.trim(), quantity: editQty.trim() })
    }
    setEditing(false)
  }

  function handleQtySave() {
    const trimmed = qtyValue.trim()
    if (onUpdate && trimmed !== (item.quantity || '')) {
      onUpdate(item.id, { quantity: trimmed })
    }
    setEditingQty(false)
  }

  function startQtyEdit(e) {
    e.stopPropagation()
    if (item.checked) return
    setQtyValue(item.quantity || '')
    setEditingQty(true)
  }

  // ── Terminal: each item is a line of stdout ──
  if (style === 'terminal') {
    return (
      <div
        className="flex items-center gap-1 py-0.5 group"
        style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem', lineHeight: '1.4' }}
      >
        <span
          onClick={() => onToggle(item.id, !item.checked)}
          style={{ color: item.checked ? '#003d0f' : '#00ff41', cursor: 'pointer', userSelect: 'none' }}
        >
          {item.checked ? '  ✓' : '  ○'}
        </span>
        <div style={{ flex: 1 }}>
          <span style={{
            color: item.checked ? '#003d0f' : '#00ff41',
            textDecoration: item.checked ? 'line-through' : 'none',
          }}>
            {' '}{item.name}
          </span>
          <div style={{ paddingLeft: '1ch' }}>
            {editingQty ? (
              <input
                ref={qtyInputRef}
                type="text"
                value={qtyValue}
                onChange={(e) => setQtyValue(e.target.value)}
                onBlur={handleQtySave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleQtySave()
                  if (e.key === 'Escape') setEditingQty(false)
                }}
                onClick={(e) => e.stopPropagation()}
                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #00ff41', color: '#00ff41', fontFamily: 'inherit', fontSize: 'inherit', width: '6em', outline: 'none', padding: '2px 0' }}
              />
            ) : (
              <span
                onClick={startQtyEdit}
                style={{ color: '#007a1f', cursor: item.checked ? 'default' : 'pointer', display: 'inline-block', padding: '2px 0' }}
              >
                {item.quantity ? `[${item.quantity}]` : (item.checked ? '' : '[+ qty]')}
              </span>
            )}
          </div>
        </div>
        <span
          onClick={() => onDelete(item.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: '#5c0000', cursor: 'pointer', fontSize: '0.7rem' }}
        >
          rm
        </span>
      </div>
    )
  }

  // ── Broadsheet: inline text entry like a classified listing ──
  if (style === 'broadsheet') {
    if (item.checked) return null // checked items handled at category level

    return (
      <div
        className="mb-1 break-inside-avoid"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        <div className="flex items-start gap-1.5">
          <span
            onClick={() => onToggle(item.id, !item.checked)}
            style={{
              display: 'inline-block',
              width: '7px',
              height: '7px',
              border: '1.5px solid #4a3728',
              background: 'transparent',
              cursor: 'pointer',
              flexShrink: 0,
              position: 'relative',
              top: '6px',
            }}
          />
          <div style={{ flex: 1 }}>
            <strong style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '0.9rem', color: '#1a1a1a' }}>{item.name}</strong>
            <div>
              {editingQty ? (
                <input
                  ref={qtyInputRef}
                  type="text"
                  value={qtyValue}
                  onChange={(e) => setQtyValue(e.target.value)}
                  onBlur={handleQtySave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQtySave()
                    if (e.key === 'Escape') setEditingQty(false)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #6b5a3e', color: '#6b5a3e', fontStyle: 'italic', fontSize: '0.8rem', fontFamily: 'inherit', width: '6em', outline: 'none', padding: '2px 0' }}
                />
              ) : (
                <span
                  onClick={startQtyEdit}
                  style={{ color: '#6b5a3e', fontStyle: 'italic', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-block', padding: '2px 0' }}
                >
                  {item.quantity ? item.quantity : '+ qty'}
                </span>
              )}
            </div>
          </div>
          <span
            onClick={() => onDelete(item.id)}
            style={{ color: '#c9b99a', cursor: 'pointer', fontSize: '0.7rem', flexShrink: 0 }}
          >
            ✕
          </span>
        </div>
      </div>
    )
  }

  // ── Corkboard: handwritten list items on a sticky note ──
  if (style === 'corkboard') {
    return (
      <div
        className="flex items-start gap-2 py-0.5"
        style={{ fontFamily: '"Caveat", cursive' }}
      >
        <span
          onClick={() => onToggle(item.id, !item.checked)}
          style={{
            cursor: 'pointer',
            fontSize: '1.1rem',
            lineHeight: 1,
            color: item.checked ? '#8b7355' : '#3d2b1f',
            marginTop: '2px',
          }}
        >
          {item.checked ? '☑' : '☐'}
        </span>
        <div style={{ flex: 1 }}>
          <span style={{
            fontSize: '1.05rem',
            color: item.checked ? '#a89279' : '#3d2b1f',
            textDecoration: item.checked ? 'line-through' : 'none',
            display: 'block',
          }}>
            {item.name}
          </span>
          {editingQty ? (
            <input
              ref={qtyInputRef}
              type="text"
              value={qtyValue}
              onChange={(e) => setQtyValue(e.target.value)}
              onBlur={handleQtySave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleQtySave()
                if (e.key === 'Escape') setEditingQty(false)
              }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #8b7355', color: '#8b7355', fontFamily: 'inherit', fontSize: '0.85rem', width: '6em', outline: 'none', padding: '2px 0' }}
            />
          ) : (
            <span
              onClick={startQtyEdit}
              style={{ fontSize: '0.85rem', color: '#8b7355', cursor: item.checked ? 'default' : 'pointer', display: 'inline-block', padding: '2px 0' }}
            >
              {item.quantity ? item.quantity : (item.checked ? '' : '+ qty')}
            </span>
          )}
        </div>
        <span
          onClick={() => onDelete(item.id)}
          style={{ color: '#c9a96e', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          ✕
        </span>
      </div>
    )
  }

  // ── Default: edge-to-edge, no card, just a row ──
  if (editing) {
    return (
      <div className="flex items-center gap-3 px-5 py-2.5">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="flex-1 px-0 py-1 text-sm bg-transparent border-b-2 border-[var(--color-primary)] focus:outline-none text-[var(--color-text)]"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <input
          type="text"
          value={editQty}
          onChange={(e) => setEditQty(e.target.value)}
          placeholder="Qty"
          className="w-20 px-0 py-1 text-sm bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none text-[var(--color-text)]"
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <button onClick={handleSave} className="text-[var(--color-primary)] text-sm font-medium">Save</button>
        <button onClick={() => setEditing(false)} className="text-[var(--color-text-muted)] text-sm">✕</button>
      </div>
    )
  }

  return (
    <div
      className={`group flex items-center gap-3 px-5 py-3 transition-all active:bg-[var(--color-border-light)] ${
        item.checked ? 'opacity-50' : ''
      }`}
      onDoubleClick={() => !item.checked && setEditing(true)}
    >
      {/* Checkbox — minimal circle */}
      <button
        onClick={() => onToggle(item.id, !item.checked)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          item.checked
            ? 'bg-[var(--color-primary)] border-[var(--color-primary)] scale-90'
            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
        }`}
        aria-label={item.checked ? 'Uncheck item' : 'Check item'}
      >
        {item.checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Item text */}
      <div className="flex-1 min-w-0">
        <span className={`text-[0.95rem] block truncate transition-colors ${
          item.checked ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text)]'
        }`}>
          {item.name}
        </span>
        {editingQty ? (
          <input
            ref={qtyInputRef}
            type="text"
            value={qtyValue}
            onChange={(e) => setQtyValue(e.target.value)}
            onBlur={handleQtySave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleQtySave()
              if (e.key === 'Escape') setEditingQty(false)
            }}
            placeholder="Qty"
            className="text-xs w-24 px-0 py-0.5 bg-transparent border-b border-[var(--color-primary)] focus:outline-none text-[var(--color-text)]"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            onClick={startQtyEdit}
            className={`text-xs transition-colors ${
              item.checked
                ? 'text-[var(--color-text-muted)]'
                : 'text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-primary)]'
            }`}
          >
            {item.quantity || (item.checked ? '' : '+ qty')}
          </span>
        )}
      </div>

      {/* Delete — subtly visible always, full opacity on group hover */}
      <button
        onClick={() => onDelete(item.id)}
        className="text-[var(--color-text-muted)] hover:text-red-400 transition-all flex-shrink-0 opacity-30 group-hover:opacity-100"
        aria-label="Delete item"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
