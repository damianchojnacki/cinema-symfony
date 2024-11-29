import { createReservation } from '@/utils/api/reservations'
import { Client } from '@/lib/hooks/useApiClient'

export const client: Client = {
  createReservation: async (showingId, data) => {
    const response = await createReservation(showingId, data)

    if ((response?.data) == null) {
      throw new Error('Could not create reservation.')
    }

    return response.data
  }
}
