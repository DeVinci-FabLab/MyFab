import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    const runtimeEnv = {
      API: process.env.API || "",
    };
    const serialized = JSON.stringify(runtimeEnv).replace(/</g, "\\u003c");
    return (
      <Html>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__ENV__ = ${serialized};`,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
