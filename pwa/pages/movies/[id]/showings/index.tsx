import {
  GetStaticPaths,
  GetStaticProps
} from 'next'
import { dehydrate, QueryClient } from '@tanstack/react-query'

import { PagedCollection } from '@/types/collection'
import { Movie } from '@/types/Movie'
import { fetch, getItemPaths } from '@/utils/dataAccess'
import { getShowings, getShowingsPath } from '@/lib/api/showings'
import { getMovie, getMoviePath } from '@/lib/api/movies'
import { PageList } from '@/components/showing/PageList'

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {}
}) => {
  if (!id) throw new Error('id not in query param')

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: [getMoviePath(id)],
    queryFn: async () => await getMovie(id)
  })

  await queryClient.prefetchQuery({
    queryKey: [getShowingsPath(id)],
    queryFn: getShowings(id)
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Movie>>('/movies')
  const paths = await getItemPaths(response, 'movies', '/movies/[id]/showings')

  return {
    paths,
    fallback: true
  }
}

export default PageList
