import { ReactNode, useState } from 'react'
import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from '@tanstack/react-query'

const QueryClientProvider = ({
  children,
  dehydratedState,
}: {
  children: ReactNode
  dehydratedState: DehydratedState
}) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ReactQueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </ReactQueryClientProvider>
  )
}

export default QueryClientProvider
