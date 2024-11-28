import {fetch, parsePage} from "@/utils/dataAccess";
import {PagedCollection} from "@/types/collection";
import {Movie} from "@/types/Movie";

export const getMoviesPath = (page?: string | string[] | undefined) =>
  `/movies${Number(page) > 0 ? `?page=${page}` : ""}`;

export const getMovies = (page?: string | string[] | undefined) =>
  fetch<PagedCollection<Movie>>(getMoviesPath(page));

export const getMoviesPagePath = (path: string) =>
  `/movies/page/${parsePage("movies", path)}`;

export const getMovie = async (id: string | string[] | undefined) =>
  id ? await fetch<Movie>(`/movies/${id}`) : Promise.resolve(undefined);

export const getMoviePath = (movieId: string | string[] | undefined) => `/movies/${movieId}`;

