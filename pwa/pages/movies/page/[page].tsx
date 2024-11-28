import { GetStaticPaths, GetStaticProps } from 'next'
import { dehydrate, QueryClient } from '@tanstack/react-query'

import {
  PageList
} from '@/components/movie/PageList'
import { PagedCollection } from '@/types/collection'
import { Movie } from '@/types/Movie'
import { fetch, getCollectionPaths } from '@/utils/dataAccess'
import { getMovies, getMoviesPath } from '@/lib/api/movies'

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {}
}) => {
  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: [getMoviesPath(page)],
    queryFn: async ({ pageParam }) => await getMovies(pageParam),
    initialPageParam: page,
    getNextPageParam: (data) => data?.data.view.next?.split('?page=')[1],
    pages: 1
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Movie>>('/movies')
  const paths = await getCollectionPaths(
    response,
    'movies',
    '/movies/page/[page]'
  )

  return {
    paths,
    fallback: true
  }
}

export default PageList
