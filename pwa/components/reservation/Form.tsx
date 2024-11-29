import { FunctionComponent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { FetchError } from '@/utils/dataAccess'
import { Reservation } from '@/types/Reservation'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useReservation } from '@/lib/hooks/useReservation'
import { Label } from '@/components/ui/label'
import { CreateReservationParams } from '@/utils/api/reservations'
import { Alert } from '@/components/ui/alert'
import { Summary } from '@/components/reservation/Summary'
import { useApiClient } from '@/lib/hooks/useApiClient'

interface Props {
  showingId: string
}

export interface AxiosError {
  message: string
  response?: {
    data: {
      message: string
      errors?: { [key: string]: string }
    }
  }
}

export const Form: FunctionComponent<Props> = ({ showingId }) => {
  const { seats, updateReservation, nextStep, previousStep } = useReservation()
  const apiClient = useApiClient()

  const { mutate, error } = useMutation<
  Reservation,
  Error | FetchError | AxiosError,
  CreateReservationParams
  >({
    mutationFn: async (data) => {
      if (apiClient == null) {
        throw new Error('Could not create reservation! API Client is not set.')
      }

      return await apiClient.createReservation(showingId, data)
    },
    onSuccess: (reservation) => {
      updateReservation(reservation)
      nextStep()
    }
  })

  const form = useForm({
    defaultValues: {
      email: ''
    }
  })

  function onSubmit (data: { email: string }) {
    mutate({
      ...data,
      seats
    })
  }

  function renderErrors () {
    if (error == null) {
      return <></>
    }

    if ('fields' in error) {
      return Object.values(error.fields).map((error, index) => (
        <Alert key={index} variant='destructive' className='mb-2'>
          {error}
        </Alert>
      ))
    }

    if ('response' in error && (error.response != null)) {
      if (error.response.data.errors == null) {
        return (
          <Alert variant='destructive' className='mb-2'>
            {error.response.data.message}
          </Alert>
        )
      }

      return Object.values(error.response.data.errors).map((error, index) => (
        <Alert key={index} variant='destructive' className='mb-2'>
          {error}
        </Alert>
      ))
    }

    return (
      <Alert variant='destructive' className='mb-2'>
        {error.message}
      </Alert>
    )
  }

  return (
    <div className='mt-4 md:w-1/3'>
      {renderErrors()}

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
