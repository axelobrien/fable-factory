import '../styles/globals.scss'
import { Inter } from 'next/font/google'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Script from 'next/script'
import DefaultHeadTag from '../components/DefaultHeadTag'

const inter = Inter({ subsets: ['latin-ext'], fallback: ['Segoe UI'] })

function MyApp({ Component, pageProps }: AppProps) {
  return (<>
    {/* TODO: Put this on each page and customize /library/fable/[id] */}
    <DefaultHeadTag />
    
    {/* Google ads */}
    <Script
      id='google-ads-import'
      async
      src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1118139568662085'
      crossOrigin='anonymous'
    />

    {/* Google tag (gtag.js) */}
    <Script
      id='google-analytics-import'
      async
      src='https://www.googletagmanager.com/gtag/js?id=G-Z0CWRZB0K6 '
    />

    <Script
      id='google-analytics-init'
      strategy='lazyOnload'
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-Z0CWRZB0K6 ');`
      }}
    />
    <div className={inter.className}>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </div>
  </>)
}

export default MyApp
