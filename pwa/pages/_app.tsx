import '../styles/globals.css'
import QueryClientProvider from '../components/common/QueryClientProvider'
import type { AppProps } from 'next/app'
import type { DehydratedState } from '@tanstack/react-query'
import { RoutesContextProvider } from '@/lib/hooks/useRoutes'
import { routes } from '@/utils/routes'
import { ApiClientContextProvider } from '@/lib/hooks/useApiClient'
import { client } from '@/utils/api/client'

function MyApp ({ Component, pageProps }: AppProps<{ dehydratedState: DehydratedState }>) {
  return (
    <QueryClientProvider dehydratedState={pageProps.dehydratedState}>
      <ApiClientContextProvider client={client}>
        <RoutesContextProvider routes={routes}>
          <Component {...pageProps} />
        </RoutesContextProvider>
      </ApiClientContextProvider>
    </QueryClientProvider>
  )
}

export default MyApp
