import { createContext, useContext, useState, FunctionComponent, PropsWithChildren } from 'react'

export interface Routes {
  getMoviesPath: () => string
  getMovieShowingsPath: (id: string) => string
  getShowingPath: (movieId: string, id: string) => string
}

const RoutesContext = createContext<Routes | null>(null)

export const useRoutes = () => useContext(RoutesContext)

interface Props extends PropsWithChildren {
  routes: Routes
}

export const RoutesContextProvider: FunctionComponent<Props> = ({ children, routes }) => {
  const [state] = useState<Routes | null>(routes)

  return (
    <RoutesContext.Provider value={state}>
      {children}
    </RoutesContext.Provider>
  )
}
