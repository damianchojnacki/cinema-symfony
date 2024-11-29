import { fetch } from '@/utils/dataAccess'
import { PagedCollection } from '@/types/collection'
import { Movie } from '@/types/Movie'

export const getMoviesPath = (page?: string | string[] | undefined) =>
  `/movies${Number(page) > 0 ? `?page=${page}` : ''}`

export const getMovies = async (page?: string | string[] | undefined) =>
  await fetch<PagedCollection<Movie>>(getMoviesPath(page))

export const getMovie = async (id: string | string[] | undefined) =>
  id ? await fetch<Movie>(`/movies/${id}`) : undefined

export const getMoviePath = (movieId: string | string[] | undefined) => `/movies/${movieId}`
