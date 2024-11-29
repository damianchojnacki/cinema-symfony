export const routes = {
  getMoviesPath: () => '/movies',
  getMovieShowingsPath: (id: string) => `/movies/${id}/showings`,
  getShowingPath: (movieId: string, id: string) => `/movies/${movieId}/showings/${id}`
}
