import {
  GetStaticPaths,
  GetStaticProps
  , NextComponentType
} from 'next'
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import { PagedCollection } from '@/types/collection'
import { Movie } from '@/types/Movie'
import { fetch, getItemPaths } from '@/utils/dataAccess'
import { getShowings, getShowingsPath } from '@/utils/api/showings'
import { getMovie, getMoviePath } from '@/utils/api/movies'
import { Item } from '@/types/item'
import { useRouter } from 'next/router'
import DefaultErrorPage from 'next/error'
import Head from 'next/head'
import Layout from '@/components/common/Layout'
import { UpcomingShowings } from '@/components/showing/UpcomingShowings'

const PageList: NextComponentType = () => {
  const router = useRouter()
  const { id } = router.query

  const { data: { data: movie } = { hubURL: null, text: '' } } =
    useQuery({
      queryKey: [getMoviePath(id)],
      queryFn: async () => await getMovie(id)
    })

  const { data: { data: showings } = { hubURL: null, text: '' } } =
    useQuery({
      queryKey: [getShowingsPath(id)],
      queryFn: getShowings(id)
    })

  if (movie == null) {
    return <DefaultErrorPage statusCode={404} />
  }

  return (
    <Layout>
      <Head>
        <title>{`Upcoming showings - ${movie.title}`}</title>
      </Head>

      <UpcomingShowings movie={movie} showings={showings?.member ?? []} />
    </Layout>
  )
}

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
  const response = await fetch<PagedCollection<Movie & Item>>('/movies')
  const paths = await getItemPaths(response, 'movies', '/movies/[id]/showings')

  return {
    paths,
    fallback: true
  }
}

export default PageList
