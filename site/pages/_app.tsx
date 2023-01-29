import '../styles.css';
import 'nextra-theme-docs/style.css';
import Script from 'next/script';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';

export default function Nextra({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);
  return getLayout(
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={'true' as any}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Outfit:wght@800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Script src="https://platform.twitter.com/widgets.js" />
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
