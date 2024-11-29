import { FunctionComponent, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import { fetch, FetchError, FetchResponse } from '@/utils/dataAccess'
import { Reservation } from '@/types/Reservation'
import { useForm } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useReservation } from '@/lib/hooks/useReservation'
import { Label } from '@/components/ui/label'
import { createReservation } from '@/lib/api/reservations'
import { Alert } from '@/components/ui/alert'

export const Summary: FunctionComponent = () => {
  const { seats } = useReservation()

  const price = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(seats.length * 9)
  }, [seats])

  return (
    <div className='mb-4'>
      <p className='mb-1'>Selected seats:</p>

      {seats.map(([row, col]) => (
        <div
          key={`${row}-${col}`}
          className='inline-block mr-1 w-10 h-10 font-bold rounded-lg bg-white text-black text-center content-center'
        >
          {`${row + 1}-${col + 1}`}
        </div>
      ))}

      <p className='mt-4'>
        Total: <span className='font-medium'>{price}</span>
      </p>
    </div>
  )
}
