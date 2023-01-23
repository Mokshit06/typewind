import { useEffect, useState } from 'react';

export default function Tweet() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <blockquote
        className="twitter-tweet"
        data-conversation="none"
        data-dnt="true"
        data-theme="dark"
      >
        <p lang="en" dir="ltr">
          here&#39;s an idea{' '}
          <a href="https://t.co/L74inu8TKW">pic.twitter.com/L74inu8TKW</a>
        </p>
        &mdash; Colin McDonnell (@colinhacks){' '}
        <a href="https://twitter.com/colinhacks/status/1615154756204523521?ref_src=twsrc%5Etfw">
          January 17, 2023
        </a>
      </blockquote>{' '}
      <script
        async
        src="https://platform.twitter.com/widgets.js"
        charSet="utf-8"
      ></script>
    </>
  );
}
