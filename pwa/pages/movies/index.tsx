import { GetStaticProps } from 'next'
import { dehydrate, QueryClient } from '@tanstack/react-query'

import {
  PageList
} from '@/components/movie/PageList'
import { getMovies, getMoviesPath } from '@/lib/api/movies'

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
