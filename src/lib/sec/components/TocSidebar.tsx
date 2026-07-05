'use client'

/**
 * The report's sections in filing order (`Structure.number`) — for SEC this leads
 * with the Cover Page. A flat list matching how the report reads; no re-grouping.
 * A dot marks sections already fetched; a spinner marks the one loading.
 */
import { Spinner } from 'flowbite-react'

export interface SectionRef {
  id: string
  title: string
}

interface TocSidebarProps {
  sections: SectionRef[]
  selectedId: string | null
  loadingId: string | null
  loadedIds: Set<string>
  onSelect: (id: string) => void
}

export function TocSidebar({
  sections,
  selectedId,
  loadingId,
  loadedIds,
  onSelect,
}: TocSidebarProps) {
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Report sections">
      {sections.map((s) => {
        const isActive = s.id === selectedId
        return (
          <button
            key={s.id}
            type="button"
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
              isActive
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
            }`}
            onClick={() => onSelect(s.id)}
            aria-current={isActive}
          >
            <span className="min-w-0 flex-1 truncate">{s.title}</span>
            {loadingId === s.id ? (
              <Spinner size="sm" className="shrink-0" />
            ) : loadedIds.has(s.id) ? (
              <span
                className="bg-primary-400 dark:bg-primary-500 h-1.5 w-1.5 shrink-0 rounded-full"
                title="Loaded"
              />
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}
