import { ReactNode } from 'react'

const Layout = ({
  children
}: {
  children: ReactNode
}) => {
  return (
    <main className='bg-gray-950 text-white min-h-screen'>
      {children}
    </main>
  )
}

export default Layout
