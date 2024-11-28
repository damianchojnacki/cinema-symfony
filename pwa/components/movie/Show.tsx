import { FunctionComponent } from 'react'
import Link from 'next/link'
import Head from 'next/head'

import { Movie } from '@/types/Movie'
import { List } from '@/components/showing/List'
import { Showing } from '@/types/Showing'

interface Props {
  movie: Movie
  text: string
  showings: Showing[]
}

export const Show: FunctionComponent<Props> = ({ movie, text, showings }) => {
  return (
    <div className='p-4'>
      <Head>
        <title>{`Show Movie ${movie['@id']}`}</title>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <Link
        href='/movies'
        className='text-sm text-cyan-500 font-bold hover:text-cyan-700'
      >
        {'< Back to list'}
      </Link>
      <h1 className='text-3xl mb-2'>{`Show Movie ${movie['@id']}`}</h1>
      <table
        cellPadding={10}
        className='shadow-md table border-collapse min-w-full leading-normal table-auto text-left my-3'
      >
        <thead className='w-full text-xs uppercase font-light text-gray-700 bg-gray-200 py-2 px-4'>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody className='text-sm divide-y divide-gray-200'>
          <tr>
            <th scope='row'>title</th>
            <td>{movie.title}</td>
          </tr>
          <tr>
            <th scope='row'>description</th>
            <td>{movie.description}</td>
          </tr>
          <tr>
            <th scope='row'>release_date</th>
            <td>{movie.release_date?.toLocaleString()}</td>
          </tr>
          <tr>
            <th scope='row'>rating</th>
            <td>{movie.rating}</td>
          </tr>
        </tbody>
      </table>

      <List showings={showings} />
    </div>
  )
}
