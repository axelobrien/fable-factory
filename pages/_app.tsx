import '../styles/globals.scss'
import { Inter } from 'next/font/google'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'

const inter = Inter({ subsets: ['latin'] })

function MyApp({ Component, pageProps }: AppProps) {
  return (<>
    <div className={inter.className}>
      <Navbar />
      <Component {...pageProps} />
    </div>
  </>)
}

export default MyApp
