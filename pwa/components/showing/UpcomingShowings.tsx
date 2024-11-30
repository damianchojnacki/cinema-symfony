import { List } from '@/components/showing/List'
import { Summary } from '@/components/movie/Summary'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Backdrop } from '@/components/movie/Backdrop'
import { useRoutes } from '@/lib/hooks/useRoutes'
import { FunctionComponent } from 'react'
import { Movie } from '@/types/Movie'
import { Showing } from '@/types/Showing'

export interface Props {
  movie: Movie
  showings: Showing[]
}

export const UpcomingShowings: FunctionComponent<Props> = ({ movie, showings }) => {
  const routes = useRoutes()

  return (
    <div className="relative overflow-y-auto overflow-x-hidden h-screen">
      <Backdrop movie={movie} />

      <div className="absolute top-[20%] px-4 xl:px-8">
        <Summary movie={movie} />

        <Link href={routes?.getMoviesPath() ?? ''} className="block md:inline text-center">
          <Button size="lg" variant="default" className="text-lg font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
              stroke="currentColor" className="size-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>

            Return to movies
          </Button>
        </Link>

        <List showings={showings} />
      </div>
    </div>
  )
}
