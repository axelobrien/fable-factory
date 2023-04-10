import '../styles/globals.scss'
import { Inter } from 'next/font/google'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

function MyApp({ Component, pageProps }: AppProps) {
  return (<>
    <Head>
      <link rel="icon" type="image/x-icon" href="/images/favicon.png"/>
    </Head>
    <div className={inter.className}>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </div>
  </>)
}

export default MyApp
