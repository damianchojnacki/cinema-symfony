import {
  GetServerSideProps,
  NextComponentType
} from 'next'
import DefaultErrorPage from 'next/error'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { dehydrate, QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMercure } from '@/utils/mercure'
import { getShowing, getShowingPath } from '@/utils/api/showings'
import { Reservation } from '@damianchojnacki/cinema'
import { getMovie, getMoviePath } from '@/utils/api/movies'
import Layout from "@/components/Layout";

const Page: NextComponentType = () => {
  const { query: { id, showingId } } = useRouter()

  const queryClient = useQueryClient()

  const { data: { data: movie } = { hubURL: null, text: '' } } =
    useQuery({
      queryKey: [getMoviePath(id as string)],
      queryFn: async () => await getMovie(id as string)
    })

  const { data: { data: showing, hubURL, text } = { hubURL: null, text: '' } } =
    useQuery({
      queryKey: [getShowingPath(showingId as string)],
      queryFn: async () => await getShowing(showingId as string)
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>

      <Reservation.Create showing={data} movie={movie} queryClient={queryClient} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id || !params?.showingId || Array.isArray(params?.id) || Array.isArray(params?.showingId)) {
    return {
      notFound: true
    }
  }

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: [getShowingPath(params.showingId)],
    queryFn: async () => await getShowing(params.showingId as string)
  })

  await queryClient.prefetchQuery({
    queryKey: [getMoviePath(params.id)],
    queryFn: async () => await getMovie(params.id as string)
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

export default Page
