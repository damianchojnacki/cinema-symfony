import { fetch } from '@/utils/dataAccess'
import { PagedCollection } from '@/types/collection'
import { Entity } from 'cinema-next'

export const getShowingsPath = (movieId: string): string => `/movies/${movieId}/showings`

export const getShowings = (movieId: string) => async () =>
  await fetch<PagedCollection<Entity.Showing>>(getShowingsPath(movieId))

export const getShowing = async (id: string) => await fetch<Entity.Showing>(`/showings/${id}`)

export const getShowingPath = (id: string): string => `/showings/${id}`
