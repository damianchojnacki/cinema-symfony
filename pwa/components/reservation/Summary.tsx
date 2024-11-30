import { FunctionComponent, useMemo } from 'react'
import { useReservation } from '@/lib/hooks/useReservation'

export const Summary: FunctionComponent = () => {
  const { seats } = useReservation()

  const price = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(seats.length * 9)
  }, [seats])

  return (
    <div className="mb-4">
      <p className="mb-1">Selected seats:</p>

      {seats.map(([row, col]) => (
        <div
          key={`${row}-${col}`}
          className="inline-block mr-1 w-10 h-10 font-bold rounded-lg bg-white text-black text-center content-center"
        >
          {`${row + 1}-${col + 1}`}
        </div>
      ))}

      <p className="mt-4">
        Total: <span className="font-medium">{price}</span>
      </p>
    </div>
  )
}
