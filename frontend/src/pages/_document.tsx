import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/icon.png" />
        <Script
          id="gtag-script-1"
          strategy="beforeInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-WS0TN7G1EE`}
        />
        <Script
          id="gtag-script-2"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WS0TN7G1EE', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <Script
          id="gadsense-script"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3051999847338334`}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
