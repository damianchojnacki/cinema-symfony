import { fetch } from '@/utils/dataAccess'
import { PagedCollection } from '@/types/collection'
import { Showing } from '@/types/Showing'

export const getShowingsPath = (movieId: string | string[] | undefined) => `/movies/${movieId}/showings`

export const getShowings = (movieId: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Showing>>(getShowingsPath(movieId))

export const getShowing = async (id: string | string[] | undefined) =>
  id ? await fetch<Showing>(`/showings/${id}`) : undefined

export const getShowingPath = (id: string | string[] | undefined) => `/showings/${id}`
