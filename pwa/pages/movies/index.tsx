import { GetStaticProps, NextComponentType } from 'next'
import { dehydrate, QueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { List } from '@/components/movie/List'
import { Movie } from '@/types/Movie'
import { getMovies, getMoviesPath } from '@/utils/api/movies'
import Layout from '@/components/common/Layout'
import { useCurrentMovie } from '@/lib/hooks/useCurrentMovie'
import { useEffect, useMemo } from 'react'
import { Current } from '@/components/movie/Current'

const PageList: NextComponentType = () => {
  const {
    query
  } = useRouter()

  const page = Array.isArray(query.page) ? undefined : query.page

  const { data, fetchNextPage } = useInfiniteQuery({
    queryFn: async ({ pageParam }) => await getMovies(pageParam),
    queryKey: [getMoviesPath(page)],
    initialPageParam: page ?? '1',
    getNextPageParam: (data) => data?.data?.view?.next?.split('?page=')[1]
  })

  const movies = useMemo(() => data?.pages.flatMap((page) => page?.data?.member).filter((movie) => movie) as Movie[], [data])

  const { update: selectCurrentMovie } = useCurrentMovie()

  useEffect(() => {
    if (!movies?.[0]) return

    selectCurrentMovie(movies[0])
  }, [movies])

  if (!movies) return null

  return (
    <Layout>
      <Head>
        <title>Currently playing</title>
      </Head>

      <Current />

      <List movies={movies} handleLoadNextPage={() => fetchNextPage} />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: [getMoviesPath()],
    queryFn: async ({ pageParam }) => await getMovies(pageParam),
    initialPageParam: '1',
    getNextPageParam: (data) => data?.data.view?.next?.split('?page=')[1],
    pages: 1
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

export default PageList
