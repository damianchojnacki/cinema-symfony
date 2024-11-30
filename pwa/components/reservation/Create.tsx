import { useRouter } from 'next/router'
import { SelectSeats } from '@/components/reservation/SelectSeats'
import { Showing } from '@/types/Showing'
import { Backdrop } from '@/components/movie/Backdrop'
import { Summary } from '@/components/movie/Summary'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FunctionComponent, useEffect } from 'react'
import { Form } from '@/components/reservation/Form'
import { useReservation } from '@/lib/hooks/useReservation'
import { Show } from '@/components/reservation/Show'
import { useRoutes } from '@/lib/hooks/useRoutes'
import { Movie } from '@/types/Movie'

interface Props {
  showing: Showing
  movie: Movie
}

export const Create: FunctionComponent<Props> = ({ showing, movie }) => {
  const { query: { id } } = useRouter()
  const routes = useRoutes()

  const { step, reservation, reset } = useReservation()

  useEffect(() => {
    reset()
  }, [])

  function renderStep () {
    switch (step) {
      case 0:
        return <SelectSeats showing={showing} />
      case 1:
        return <Form showingId={String(showing.id)} />
      case 2:
        return (reservation != null) ? <Show reservation={reservation} /> : <></>
      default:
        throw new Error('Invalid reservation step ' + step)
    }
  }

  return (
    <div className="relative overflow-y-auto overflow-x-hidden h-screen">
      <Backdrop movie={movie} />

      <div className="absolute top-[20%] px-4 xl:px-8 pb-4">
        <Summary movie={movie} />

        <Link href={routes?.getMovieShowingsPath(id as string) ?? ''} className="block md:inline text-center mb-4">
          <Button size="lg" variant="default" className="text-lg font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
              stroke="currentColor" className="size-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>

            Return to upcoming showings
          </Button>
        </Link>

        {renderStep()}
      </div>
    </div>
  )
}
