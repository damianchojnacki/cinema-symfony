import { fetch } from '@/utils/dataAccess'
import { Entity, CreateReservationParams } from 'cinema-next'

export const getCreateReservationPath = (showingId: string): string => `/showings/${showingId}/reservations`

export const createReservation = async (showingId: string, data: CreateReservationParams) =>
  await fetch<Entity.Reservation>(getCreateReservationPath(showingId), {
    method: 'POST',
    body: JSON.stringify(data)
  })
