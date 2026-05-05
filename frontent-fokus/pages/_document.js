import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Import font */}
        <style>
          {`@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap")`}
        </style>

        {/* Highlight.js CSS */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"
          rel="stylesheet"
        />

        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="FokusEdu" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* KaTeX CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css"
          integrity="sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP"
          crossOrigin="anonymous"
        />
      </Head>
      <body className="antialiased custom-scroll font-poppins max-w-[1440px] mx-auto">
        <Main />
        <NextScript />

        {/* Highlight.js JS */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            window.hljs?.highlightAll();
          }}
        />

        {/* KaTeX */}
        <Script
          src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/contrib/auto-render.min.js"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          onLoad={() => {
            window.renderMathInElement?.(document.body);
          }}
        />
      </body>
    </Html>
  );
}
