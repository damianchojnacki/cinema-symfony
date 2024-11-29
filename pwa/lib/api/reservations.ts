import { fetch } from '@/utils/dataAccess'
import { Reservation } from '@/types/Reservation'

export const getCreateReservationPath = (showingId) => `/showings/${showingId}/reservations`

export const createReservation = async (showingId, { values }: SaveParams) =>
  await fetch<Reservation>(getCreateReservationPath(showingId), {
    method: 'POST',
    body: JSON.stringify(values)
  })

export const getReservationQrCodePath = (token) => `/reservations/${token}/qr`
