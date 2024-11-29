import { useCurrentMovie } from '@/lib/hooks/useCurrentMovie'
import { FunctionComponent } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Summary } from '@/components/movie/Summary'
import { useRoutes } from '@/lib/hooks/useRoutes'
import { Backdrop } from '@/components/movie/Backdrop'

export const Current: FunctionComponent = () => {
  const { movie } = useCurrentMovie()
  const routes = useRoutes()

  if (movie == null) {
    return null
  }

  return (
    <div className='relative'>
      <Backdrop movie={movie} />

      <div className='absolute top-[20%] px-4 xl:px-8'>
        <Summary movie={movie} />

        <Link href={routes?.getMovieShowingsPath(movie.id as string) ?? ''} className='block md:inline text-center'>
          <Button size='lg' variant='secondary' className='text-lg font-bold'>Get Tickets</Button>
        </Link>
      </div>
    </div>
  )
}
