import BottomNav from './BottomNav'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <BottomNav />
      <main className="lg:ml-48 min-h-screen" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
        <div className="max-w-2xl mx-auto lg:pb-0">
          {children}
        </div>
      </main>
    </div>
  )
}
