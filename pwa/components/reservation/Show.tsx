import { FunctionComponent } from 'react'
import { Summary } from '@/components/reservation/Summary'
import { Reservation } from '@/types/Reservation'

export interface Props {
  reservation: Reservation
}

export const Show: FunctionComponent<Props> = ({ reservation }) => {
  return (
    <div className="mt-4 md:w-1/3">
      <Summary />

      <p>Email: <span className="font-medium">{reservation.email}</span></p>

      <p className="my-4">Please show QR Code below to the cinema staff:</p>

      <img src={reservation.qr_url} alt="reservation qr code" width={320} height={320} className="mx-auto" />
    </div>
  )
}
