import {
  GetServerSideProps,
  NextComponentType
} from 'next'
import DefaultErrorPage from 'next/error'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'

import { SelectSeats } from '@/components/reservation/SelectSeats'
import { Showing } from '@/types/Showing'
import { FetchResponse } from '@/utils/dataAccess'
import { useMercure } from '@/utils/mercure'
import { getShowing, getShowingPath } from '@/lib/api/showings'
import { Backdrop } from '@/components/movie/Backdrop'
import { Summary } from '@/components/movie/Summary'
import Link from 'next/link'
import { routes } from '@/lib/routes'
import { Button } from '@/components/ui/button'
import { List } from '@/components/showing/List'
import Layout from '@/components/common/Layout'
import { getMovie, getMoviePath } from '@/lib/api/movies'
import { useEffect, useState } from 'react'
import { Form } from '@/components/reservation/Form'
import { useReservation } from '@/lib/hooks/useReservation'
import { Show } from '@/components/reservation/Show'

const Page: NextComponentType = () => {
  const { query: { id, showingId } } = useRouter()

  const { data: { data: movie } = { hubURL: null, text: '' } } =
    useQuery({
      queryKey: [getMoviePath(id)],
      queryFn: async () => await getMovie(id)
    })

  const { data: { data: showing, hubURL, text } = { hubURL: null, text: '' } } =
    useQuery<FetchResponse<Showing> | undefined>({
      queryKey: ['showing', showingId],
      queryFn: async () => await getShowing(showingId)
    })

  const data = useMercure(showing, hubURL)

  const { step, reset } = useReservation()

  useEffect(() => {
    reset()
  }, [])

  if ((data == null) || (movie == null)) {
    return <DefaultErrorPage statusCode={404} />
  }

  function renderStep () {
    switch (step) {
      case 0:
        return <SelectSeats showing={data as Showing} />
      case 1:
        return <Form showingId={String(data?.id)} />
      case 2:
        return <Show />
      default:
        throw new Error('Invalid reservation step ' + step)
    }
  }

  return (
    <Layout>
      <div>
        <Head>
          <title>{`Upcoming showings - ${movie.title}`}</title>
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </Head>
      </div>

      <div className='relative overflow-y-auto overflow-x-hidden h-screen'>
        <Backdrop movie={movie} />

        <div className='absolute top-[20%] px-4 xl:px-8 pb-4'>
          <Summary movie={movie} />

          <Link href={routes.getMovieShowingsPath(id as string)} className='block md:inline text-center mb-4'>
            <Button size='lg' variant='default' className='text-lg font-bold'>
              <svg
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5}
                stroke='currentColor' className='size-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3' />
              </svg>

              Return to upcoming showings
            </Button>
          </Link>

          {renderStep()}
        </div>
      </div>
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
