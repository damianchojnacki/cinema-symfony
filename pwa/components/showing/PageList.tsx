import { NextComponentType } from 'next'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { getMovie, getMoviePath } from '@/lib/api/movies'
import { getShowings, getShowingsPath } from '@/lib/api/showings'
import { useMercure } from '@/utils/mercure'
import DefaultErrorPage from 'next/error'
import Head from 'next/head'
import { Show } from '@/components/movie/Show'
import { Current } from '@/components/movie/Current'
import { List } from '@/components/showing/List'
import { useEffect } from 'react'
import { useCurrentMovie } from '@/lib/hooks/useCurrentMovie'
import Layout from '@/components/common/Layout'
import { Summary } from '@/components/movie/Summary'
import Link from 'next/link'
import { routes } from '@/lib/routes'
import { Button } from '@/components/ui/button'
import { Backdrop } from '@/components/movie/Backdrop'

export const PageList: NextComponentType = () => {
  const router = useRouter()
  const { id } = router.query

  const { data: { data: movie } = { hubURL: null, text: '' } } =
    useQuery({
      queryKey: [getMoviePath(id)],
      queryFn: async () => await getMovie(id)
    })

  const { data: { data: showings, hubURL, text } = { hubURL: null, text: '' } } =
    useQuery({
      queryKey: [getShowingsPath(id)],
      queryFn: getShowings(id)
    })

  const collection = useMercure(showings, hubURL)

  if (movie == null) {
    return <DefaultErrorPage statusCode={404} />
  }

  return (
    <Layout>
      <div>
        <Head>
          <title>{`Upcoming showings - ${movie.title}`}</title>
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </Head>
      </div>

      <div className='relative overflow-y-auto overflow-x-hidden h-screen'>
        <Backdrop movie={movie} />

        <div className='absolute top-[20%] px-4 xl:px-8'>
          <Summary movie={movie} />

          <Link href={routes.getMoviesPath()}>
            <Button size='lg' variant='default' className='text-lg font-bold'>
              <svg
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5}
                stroke='currentColor' className='size-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3' />
              </svg>

              Return to movies
            </Button>
          </Link>

          <List showings={collection?.member ?? []} />
        </div>
      </div>
    </Layout>
  )
}
