import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="CareView - Medical Communication Training" />
        <title>CareView</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 