import '../styles/globals.css'
import '@damianchojnacki/cinema/style.css'
import type { AppProps } from 'next/app'
import type { DehydratedState } from '@tanstack/react-query'
import { routes } from '@/utils/routes'
import { client } from '@/utils/api/client'
import QueryClientProvider from "@/components/QueryClientProvider";
import { ApiClientContextProvider, RoutesContextProvider } from "@damianchojnacki/cinema";

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
