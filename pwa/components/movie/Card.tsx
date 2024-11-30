import { FunctionComponent } from 'react'

import { Movie } from '@/types/Movie'
import { useCurrentMovie } from '@/lib/hooks/useCurrentMovie'

interface Props {
  movie: Movie
}

export const Card: FunctionComponent<Props> = ({ movie }) => {
  const { movie: current, update } = useCurrentMovie()

  return (
    <div
      onClick={() => update(movie)}
      className={`snap-center flex flex-col items-center justify-center w-fit cursor-pointer shadow transform hover:scale-105 transition ${movie.id === current?.id ? 'ring-2 ring-gray-500' : ''}`}
      role="button"
      tabIndex={Number(movie.id)}
      aria-label={`Select ${movie.title}`}
      onKeyDown={(e) => {
        if (!['Enter', ' '].includes(e.key)) {
          return
        }

        e.preventDefault()

        update(movie)
      }}
    >
      <img
        className="object-cover"
        width="384px"
        src={`${movie.poster_url}?w=192&fm=webp`}
        srcSet={`${movie.poster_url}?w=192&fm=webp 640w, ${movie.poster_url}?w=384&fm=webp 1200w`}
        alt={`${movie.title} poster`}
        loading="lazy"
      />
    </div>
  )
}
