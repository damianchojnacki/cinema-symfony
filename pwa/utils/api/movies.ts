import { fetch } from '@/utils/dataAccess'
import { PagedCollection } from '@/types/collection'
import { Entity } from 'cinema-next'

export const getMoviesPath = (page?: string): string =>
  `/movies${(Number(page) > 0) ? `?page=${page}` : ''}`

export const getMovies = async (page?: string) =>
  await fetch<PagedCollection<Entity.Movie>>(getMoviesPath(page))

export const getMovie = async (id: string) => await fetch<Entity.Movie>(`/movies/${id}`)

export const getMoviePath = (movieId: string): string => `/movies/${movieId}`
