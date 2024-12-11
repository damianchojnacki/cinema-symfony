import React, { ReactNode } from 'react'
import Head from 'next/head'
import { Layout as BaseLayout } from '@damianchojnacki/cinema'

const Layout = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <BaseLayout className={className}>
      <Head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96"/>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
        <link rel="shortcut icon" href="/favicon.ico"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <meta name="apple-mobile-web-app-title" content="Cinema"/>
        <link rel="manifest" href="/manifest.json"/>
      </Head>

      {children}
    </BaseLayout>
  )
}

export default Layout
