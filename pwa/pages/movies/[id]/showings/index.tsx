import {
  GetStaticPaths,
  GetStaticProps
  , NextComponentType
} from 'next'
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import { PagedCollection } from '@/types/collection'
import { fetch, getItemPaths } from '@/utils/dataAccess'
import { getShowings, getShowingsPath } from '@/utils/api/showings'
import { getMovie, getMoviePath } from '@/utils/api/movies'
import { Item } from '@/types/item'
import { useRouter } from 'next/router'
import DefaultErrorPage from 'next/error'
import Head from 'next/head'
import {Showing} from '@damianchojnacki/cinema'
import Layout from "@/components/Layout";

const PageList: NextComponentType = () => {
  const { query: {id} } = useRouter()

  const { data: { data: movie } = { hubURL: null, text: '' } } =
    useQuery({
      queryKey: [getMoviePath(id as string)],
      queryFn: async () => await getMovie(id as string)
    })

  const { data: { data: showings } = { hubURL: null, text: '' } } =
    useQuery({
      queryKey: [getShowingsPath(id as string)],
      queryFn: getShowings(id as string)
    })

  if (movie == null) {
    return <DefaultErrorPage statusCode={404} />
  }

  return (
    <Layout>
      <Head>
        <title>{`Upcoming showings - ${movie.title}`}</title>
      </Head>

      <Showing.UpcomingShowings movie={movie} showings={showings?.member ?? []} />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {}
}) => {
  if (!id || Array.isArray(id)) {
    return {
      notFound: true
    }
  }

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
  const response = await fetch<PagedCollection<Item>>('/movies')
  const paths = await getItemPaths(response, 'movies', '/movies/[id]/showings')

  return {
    paths,
    fallback: true
  }
}

export default PageList
