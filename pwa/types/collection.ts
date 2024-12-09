export interface PagedCollection<T> {
  '@context'?: string
  '@id'?: string
  '@type'?: string
  member?: T[]
  search?: Record<string, unknown>
  totalItems?: number
  view?: {
    '@id': string
    '@type': string
    first?: string
    last?: string
    previous?: string
    next?: string
  }
}

export const isPagedCollection = <T>(data: unknown): data is PagedCollection<T> => {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const typedData = data as Partial<PagedCollection<T>>

  return 'member' in typedData && Array.isArray(typedData.member)
}
