import { fetch } from '@/utils/dataAccess'
import { PagedCollection } from '@/types/collection'
import { Showing } from '@/types/Showing'

export const getShowingsPath = (movieId: string): string => `/movies/${movieId}/showings`

export const getShowings = (movieId: string) => async () =>
  await fetch<PagedCollection<Showing>>(getShowingsPath(movieId))

export const getShowing = async (id: string) => await fetch<Showing>(`/showings/${id}`)

export const getShowingPath = (id: string): string => `/showings/${id}`
