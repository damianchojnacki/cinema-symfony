import { createContext, useContext, useState, FunctionComponent, PropsWithChildren } from 'react'
import { CreateReservationParams } from '@/utils/api/reservations'
import { Reservation } from '@/types/Reservation'

export interface Client {
  createReservation: (showingId: string, data: CreateReservationParams) => Promise<Reservation>
}

const ApiClientContext = createContext<Client | null>(null)

export const useApiClient = () => useContext(ApiClientContext)

interface Props extends PropsWithChildren {
  client: Client
}

export const ApiClientContextProvider: FunctionComponent<Props> = ({ children, client }) => {
  const [state] = useState<Client | null>(client)

  return (
    <ApiClientContext.Provider value={state}>
      {children}
    </ApiClientContext.Provider>
  )
}
