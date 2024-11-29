import { NextComponentType } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useInfiniteQuery } from '@tanstack/react-query'

import { List } from './List'
import { Movie } from '@/types/Movie'
import { getMovies, getMoviesPath } from '@/lib/api/movies'
import Layout from '@/components/common/Layout'
import { useCurrentMovie } from '@/lib/hooks/useCurrentMovie'
import { useEffect, useMemo } from 'react'
import { Current } from '@/components/movie/Current'
import { Backdrop } from '@/components/movie/Backdrop'

export const PageList: NextComponentType = () => {
  const {
    query: { page }
  } = useRouter()

  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryFn: async ({ pageParam }) => await getMovies(pageParam),
    queryKey: [getMoviesPath(page)],
    initialPageParam: page ?? '1',
    getNextPageParam: (data) => data?.data?.view?.next?.split('?page=')[1]
  })

  const movies = useMemo(() => data?.pages.flatMap((page) => page?.data?.member).filter((movie) => movie) as Movie[], [data])

  const { movie, update: selectCurrentMovie } = useCurrentMovie()

  useEffect(() => {
    if (!movies || !movies[0]) return

    selectCurrentMovie(movies[0])
  }, [movies])

  if (!movies) return null

  return (
    <Layout>
      <Head>
        <title>Movie List</title>
      </Head>

      <div className='relative'>
        {(movie != null)
          ? (
            <Backdrop movie={movie} />
            )
          : null}

        <Current />
      </div>

      <div className='absolute bottom-0 w-full'>
        <List movies={movies} load={fetchNextPage} isLoading={isFetching} />
      </div>
    </Layout>
  )
}
