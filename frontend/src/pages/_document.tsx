import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="zh-Hant-TW">
      <Head>
        <link rel="icon" href="/icon.png" />
        <meta
          name="google-site-verification"
          content="VZYlmjm2nQXB01Ifn3vwk9X9z0b9wWCC7glkeOpWZlg"
        />
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
