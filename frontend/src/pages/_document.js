import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      lang="en"
      className="bg-white dark:bg-gray-950 scheme-light dark:scheme-dark transition-colors duration-500 ease-in-out"
      suppressHydrationWarning>
      <Head>
        <style jsx global>{`
          /* Theme transition overlay */
          .theme-transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent);
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s ease-out;
          }
          
          .theme-transition-overlay.active {
            opacity: 1;
          }
        `}</style>
      </Head>
      <body className="antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-all duration-500 ease-in-out">
        <div id="theme-transition-overlay" className="theme-transition-overlay" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
