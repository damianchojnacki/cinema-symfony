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
import { Summary } from '@/components/reservation/Summary'

interface Props {
  showingId?: string
}

interface SaveParams {
  values: Reservation
}

export const Form: FunctionComponent<Props> = ({ showingId }) => {
  const { seats, updateReservation, nextStep, previousStep } = useReservation()

  const { mutate, error } = useMutation<
  FetchResponse<Reservation> | undefined,
  Error | FetchError,
  SaveParams
  >({
    mutationFn: async (saveParams) => await createReservation(showingId, saveParams),
    onSuccess: (response) => {
      updateReservation(response.data)
      nextStep()
    }
  })

  const form = useForm({
    defaultValues: {
      email: ''
    }
  })

  function onSubmit (values) {
    mutate({
      values: {
        ...values,
        seats
      }
    })
  }

  return (
    <div className='mt-4 md:w-1/3'>
      {(error != null)
        ? (
          <Alert variant='destructive' className='mb-2'>
            {error.message}
          </Alert>
          )
        : null}

      {error?.fields?.takenSeats
        ? (
          <Alert variant='destructive' className='mb-2'>
            {error.fields.takenSeats}
          </Alert>
          )
        : null}

      <Summary />

      <form onSubmit={form.handleSubmit(onSubmit)} className=''>
        <Label htmlFor='email'>
          Please fill your email below so we can send your tickets to mailbox:
        </Label>

        <Input
          id='email'
          type='email'
          placeholder='user@example.com'
          required
          className='w-64 mb-2'
          {...form.register('email')}
        />

        <Button type='button' className='mr-2' onClick={previousStep}>Change seats</Button>
        <Button type='submit' variant='secondary'>Submit</Button>
      </form>
    </div>
  )
}
