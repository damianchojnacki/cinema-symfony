import { FunctionComponent } from 'react'

import { Showing } from '@/types/Showing'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { routes } from '@/lib/routes'

interface Props {
  showings: Showing[]
}

const groupByDate = (showings: Showing[]) => {
  return showings.reduce((acc: Record<string, Showing[]>, showing) => {
    if (showing.starts_at == null) return acc

    const date = new Date(showing.starts_at).toLocaleDateString(['en-US'], {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })

    if (!acc[date]) {
      acc[date] = []
    }

    acc[date].push(showing)

    return acc
  }, {})
}

export const List: FunctionComponent<Props> = ({ showings }) => {
  const { query: { id: movieId } } = useRouter()

  const groupedShowings = groupByDate(showings)

  return (
    <div className='mt-6'>
      <h1 className='text-2xl font-bold mb-4'>Upcoming showings</h1>

      {Object.entries(groupedShowings).map(([date, showings]) => (
        <div key={date} className='mb-6'>
          <h2 className='text-xl font-semibold mb-2 border-b pb-2'>{date}</h2>

          <div className='flex gap-4'>
            {showings.map((showing) => (
              <Link
                href={routes.getShowingPath(movieId as string, String(showing.id))}
                key={showing.id}
              >
                <Button variant='secondary' className='text-sm font-medium' suppressHydrationWarning>
                  {new Date(showing.starts_at ?? Date.now()).toLocaleTimeString(['en-US'], { hour: '2-digit', minute: '2-digit' })}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
