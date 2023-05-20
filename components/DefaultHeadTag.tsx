import React from 'react'
import Head from 'next/head'

function DefaultHeadTag() {
  return (<>
    <Head>
      <link rel='icon' type='image/x-icon' href='/images/favicon.png'/>
      <meta property='og:title' content='Fable Factory' />
      <meta property='og:site_name' content='Fable Factory' />
      <meta property='og:description' content='Generate & read fables in the language you’re learning. For free!' /> 
      <meta property='og:type' content='article' />
      
      <meta property='image' content='/images/og-image.png' />
      <meta property='og:image' content='/images/og-image.png' />
      <meta property='og:image:height' content='1080' />
      <meta property='og:image:width' content='1920' />

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@sirbananathe6th' />
      <meta name='twitter:title' content='Fable Factory' />
      <meta name='twitter:description' content='Generate & read fables in the language you’re learning. For free!' /> 
      <meta name='twitter:image' content='/images/og-image.png' />
    </Head>
  </>)
}

export default DefaultHeadTag