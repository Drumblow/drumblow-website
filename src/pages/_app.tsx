import type { AppProps } from 'next/app'
import BaseLayout from '../components/layouts/BaseLayout'
import '@/app/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BaseLayout>
      <Component {...pageProps} />
    </BaseLayout>
  )
}