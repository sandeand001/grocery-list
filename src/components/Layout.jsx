import BottomNav from './BottomNav'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <BottomNav />
      {/* Offset for desktop sidebar (lg:ml-48) and mobile bottom nav (pb-20) */}
      <main className="lg:ml-48 pb-20 lg:pb-0 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
