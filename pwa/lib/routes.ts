export const routes = {
  getMoviesPath: () => '/movies',
  getMoviePath: (id: string) => `/movies/${id}`,
  getMoviesPagePath: (page: number) => `/movies/page/${page}`,
  getMovieShowingsPath: (id: string) => `/movies/${id}/showings`,
  getShowingPath: (movieId: string, id: string) => `/movies/${movieId}/showings/${id}`
}
