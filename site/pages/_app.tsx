import "../styles.css";
import "nextra-theme-docs/style.css";
import Script from "next/script";

export default function Nextra({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return getLayout(
    <>
      <Script src="https://platform.twitter.com/widgets.js" />
      <Component {...pageProps} />
    </>
  );
}
