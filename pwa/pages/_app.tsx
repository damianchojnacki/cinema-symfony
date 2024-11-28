import '../styles/globals.css'
import Provider from '../components/common/Provider'
import type { AppProps } from 'next/app'
import type { DehydratedState } from '@tanstack/react-query'

function MyApp ({ Component, pageProps }: AppProps<{ dehydratedState: DehydratedState }>) {
  return (
    <Provider dehydratedState={pageProps.dehydratedState}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
