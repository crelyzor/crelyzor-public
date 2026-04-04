export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-sm animate-pulse">
        {/* Card skeleton — matches 1.586:1 aspect ratio */}
        <div
          className="w-full rounded-2xl bg-neutral-800"
          style={{ aspectRatio: '1.586 / 1' }}
        />
        {/* Detail section skeleton */}
        <div
          className="mt-5 rounded-2xl bg-white overflow-hidden"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
        >
          {/* Quick action buttons */}
          <div className="p-4 flex gap-2">
            <div className="flex-1 h-11 rounded-xl bg-neutral-100" />
            <div className="flex-1 h-11 rounded-xl bg-neutral-100" />
          </div>
          {/* Bio line */}
          <div className="h-px bg-neutral-50 mx-4" />
          <div className="px-4 py-4 space-y-2">
            <div className="h-3 bg-neutral-100 rounded-lg w-full" />
            <div className="h-3 bg-neutral-100 rounded-lg w-3/4" />
          </div>
          {/* Links */}
          <div className="h-px bg-neutral-50 mx-4" />
          <div className="px-4 py-3 space-y-2">
            <div className="h-2.5 bg-neutral-100 rounded w-12" />
            <div className="h-10 bg-neutral-50 rounded-xl" />
            <div className="h-10 bg-neutral-50 rounded-xl" />
          </div>
          {/* Save / Share buttons */}
          <div className="h-px bg-neutral-50 mx-4" />
          <div className="p-4 flex gap-2">
            <div className="flex-1 h-11 rounded-xl bg-neutral-100" />
            <div className="flex-1 h-11 rounded-xl bg-neutral-100" />
          </div>
        </div>
        {/* Footer */}
        <div className="mx-auto mt-6 h-2.5 bg-neutral-200 rounded w-28" />
      </div>
    </div>
  );
}
