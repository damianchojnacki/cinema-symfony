import {
  GetServerSideProps,
  NextComponentType
} from 'next'
import DefaultErrorPage from 'next/error'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import { Showing } from '@/types/Showing'
import { FetchResponse } from '@/utils/dataAccess'
import { useMercure } from '@/utils/mercure'
import { getShowing, getShowingPath } from '@/utils/api/showings'
import Layout from '@/components/common/Layout'
import { getMovie, getMoviePath } from '@/utils/api/movies'
import { Create } from '@/components/reservation/Create'

const Page: NextComponentType = () => {
  const { query: { id, showingId } } = useRouter()

  const { data: { data: movie } = { hubURL: null, text: '' } } =
    useQuery({
      queryKey: [getMoviePath(id)],
      queryFn: async () => await getMovie(id)
    })

  const { data: { data: showing, hubURL, text } = { hubURL: null, text: '' } } =
    useQuery<FetchResponse<Showing> | undefined>({
      queryKey: [getShowingPath(showingId)],
      queryFn: async () => await getShowing(showingId)
    })

  const data = useMercure(showing, hubURL)

  if ((data == null) || (movie == null)) {
    return <DefaultErrorPage statusCode={404} />
  }

  return (
    <Layout>
      <Head>
        <title>{`Reservation - ${movie.title}`}</title>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>

      <Create showing={data} movie={movie} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id || !params?.showingId) {
    return {
      notFound: true
    }
  }

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: [getShowingPath(params.showingId)],
    queryFn: async () => await getShowing(params.showingId)
  })

  await queryClient.prefetchQuery({
    queryKey: [getMoviePath(params.id)],
    queryFn: async () => await getMovie(params.id)
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

export default Page
