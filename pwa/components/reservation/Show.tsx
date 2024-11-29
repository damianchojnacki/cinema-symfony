import { FunctionComponent } from 'react'
import { useReservation } from '@/lib/hooks/useReservation'
import { Summary } from '@/components/reservation/Summary'
import Image from 'next/image'
import { getReservationQrCodePath } from '@/lib/api/reservations'

export const Show: FunctionComponent = () => {
  const { reservation } = useReservation()

  return (
    <div className='mt-4 md:w-1/3'>
      <Summary />

      <p>Email: <span className='font-medium'>{reservation.email}</span></p>

      <p className='my-4'>Please show QR Code below to the cinema staff:</p>

      <img src={getReservationQrCodePath(reservation.token)} alt='reservation qr code' width={320} height={320} className='mx-auto' />
    </div>
  )
}
