import { FunctionComponent } from 'react'

import { Showing } from '@/types/Showing'
import { Button } from '@/components/ui/button'
import { useReservation } from '@/lib/hooks/useReservation'

interface Props {
  showing: Showing
}

export const SelectSeats: FunctionComponent<Props> = ({ showing }) => {
  const { seats: selectedSeats, selectSeats, nextStep } = useReservation()

  const toggleSeatSelection = (row: number, col: number) => {
    // Check if the seat is already selected
    const seatIndex = selectedSeats.findIndex(
      (seat) => seat[0] === row && seat[1] === col
    )

    if (seatIndex > -1) {
      // Seat is already selected, remove it from the selectedSeats array
      const updatedSeats = [...selectedSeats]
      updatedSeats.splice(seatIndex, 1)
      selectSeats(updatedSeats)
    } else {
      // Add the seat to the selectedSeats array
      selectSeats([...selectedSeats, [row, col]])
    }
  }

  const isSeatTaken = (row: number, col: number) => {
    if (showing.seats_taken != null) {
      return showing.seats_taken.some(
        (seat: number[]) => seat[0] === row && seat[1] === col
      )
    }

    return false
  }

  const isSeatSelected = (row: number, col: number) => {
    return selectedSeats.some((seat) => seat[0] === row && seat[1] === col)
  }

  return (
    <div className="w-full md:w-fit">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium my-4 p-1" suppressHydrationWarning>
          {`Showtime: ${new Date(showing.starts_at ?? Date.now()).toLocaleString(['en-US'], {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}`}
        </h2>

        <Button onClick={nextStep} className={selectedSeats.length > 0 ? '!bg-green-700' : ''} disabled={selectedSeats.length === 0}>Next</Button>
      </div>

      <div
        className="grid w-full md:w-fit mx-auto md:mx-0 max-w-[93vw] overflow-x-auto gap-2 place-items-center p-1"
        style={{
          gridTemplateRows: `repeat(${showing.rows}, 1fr)`,
          gridTemplateColumns: `repeat(${showing.columns}, 1fr)`
        }}
      >
        {Array.from({ length: showing.rows ?? 1 }, (_, row) =>
          Array.from({ length: showing.columns ?? 1 }, (_, col) => {
            const isTaken = isSeatTaken(row, col)
            const isSelected = isSeatSelected(row, col)

            return (
              <button
                key={`${row}-${col}`}
                className={`w-16 h-16 font-bold rounded-lg focus:outline-none
                  ${isTaken
                    ? 'bg-gray-500 text-white cursor-not-allowed'
                  : isSelected
                    ? 'bg-green-700 text-white'
                    : 'bg-white text-black transform hover:scale-105 transition'
                  }`}
                onClick={() => !isTaken && toggleSeatSelection(row, col)}
                disabled={isTaken}
              >
                {`${row + 1}-${col + 1}`}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
