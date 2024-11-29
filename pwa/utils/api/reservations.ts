import { fetch } from '@/utils/dataAccess'
import { Reservation } from '@/types/Reservation'

export const getCreateReservationPath = (showingId: string) => `/showings/${showingId}/reservations`

export type CreateReservationParams = Pick<Reservation, 'email' | 'seats'>

export const createReservation = async (showingId: string, data: CreateReservationParams) =>
  await fetch<Reservation>(getCreateReservationPath(showingId), {
    method: 'POST',
    body: JSON.stringify(data)
  })
