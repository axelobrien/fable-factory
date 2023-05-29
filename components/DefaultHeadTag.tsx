import React from 'react'
import Head from 'next/head'

function DefaultHeadTag() {
  return (<>
    <Head>
      <link rel='icon' type='image/x-icon' href='/images/favicon.png'/>
      <meta property='og:title' content='Fable Factory' key='og:title' />
      <meta property='og:site_name' content='Fable Factory'key='og:site_name'  />
      <meta property='og:description' content='Generate & read fables in the language you’re learning. For free!' key='og:description' /> 
      <meta property='og:type' content='article' key='og:type' />
      
      <meta property='image' content='/images/og-image.png' key='image' />
      <meta property='og:image' content='/images/og-image.png' key='og:image' />
      <meta property='og:image:height' content='1080' key='og:image:height' />
      <meta property='og:image:width' content='1920' key='og:image:width' />

      <meta name='twitter:card' content='summary_large_image' key='twitter:card' />
      <meta name='twitter:site' content='@sirbananathe6th' key='twitter:site' />
      <meta name='twitter:title' content='Fable Factory' key='twitter:title' />
      <meta name='twitter:description' content='Generate & read fables in the language you’re learning. For free!' key='twitter:description' />
      <meta name='twitter:image' content='/images/og-image.png' key='twitter:image' />
    </Head>
  </>)
}

export default DefaultHeadTag