import { GetServerSideProps, NextComponentType, NextPageContext } from 'next'
import Head from 'next/head'

import { Form } from '@/components/reservation/Form'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getShowing, getShowingPath } from '@/lib/api/showings'

const Page: NextComponentType = () => (
  <div>
    <div>
      <Head>
        <title>Create Reservation</title>
      </Head>
    </div>
    <Form />
  </div>
)

export default Page

export const getServerSideProps: GetServerSideProps = async ({
  params: { id } = {}
}) => {
  if (!id) throw new Error('id not in query param')

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: [getShowingPath(id)],
    queryFn: async () => await getShowing(id)
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}
