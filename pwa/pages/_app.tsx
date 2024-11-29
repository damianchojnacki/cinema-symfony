import '../styles/globals.css'
import QueryClientProvider from '../components/common/QueryClientProvider'
import type { AppProps } from 'next/app'
import type { DehydratedState } from '@tanstack/react-query'

function MyApp ({ Component, pageProps }: AppProps<{ dehydratedState: DehydratedState }>) {
  return (
    <QueryClientProvider dehydratedState={pageProps.dehydratedState}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

export default MyApp
