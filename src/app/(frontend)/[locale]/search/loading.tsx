export default function Loading() {
  return (
    <div className="p-4 space-y-6 container">
      {/* Fake search bar */}
      <div className="mt-20 mb-16 h-10 rounded-md bg-card-foreground animate-pulse w-full mx-auto" />

      {/* Grid of placeholder cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-md bg-card-foreground aspect-[4/3] animate-pulse" />
        ))}
      </div>
    </div>
  )
}
