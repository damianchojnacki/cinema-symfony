import { GetStaticProps, NextComponentType } from 'next'
import { dehydrate, QueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Movie, Entity } from '@damianchojnacki/cinema'
import { getMovies, getMoviesPath } from '@/utils/api/movies'
import { useMemo } from 'react'
import Layout from '@/components/Layout'

const PageList: NextComponentType = () => {
  const {
    query,
  } = useRouter()

  const page = Array.isArray(query.page) ? undefined : query.page

  const { data, fetchNextPage } = useInfiniteQuery({
    queryFn: async ({ pageParam }) => await getMovies(pageParam),
    queryKey: [getMoviesPath(page)],
    initialPageParam: page ?? '1',
    getNextPageParam: (data) => data?.data?.view?.next?.split('?page=')[1],
  })

  const movies = useMemo(() => data?.pages.flatMap((page) => page?.data?.member).filter((movie) => movie) as Entity.Movie[], [data])

  if (!movies) return null

  return (
    <Layout>
      <Head>
        <title>Currently playing</title>
      </Head>

      <Movie.CurrentlyPlaying movies={movies} handleLoadNextPage={() => void fetchNextPage()} />
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
    pages: 1,
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default PageList
