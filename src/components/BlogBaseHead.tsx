import React from 'react';

interface BlogBaseHeadProps {
  title: string;
  description: string;
  permalink: string;
  filename: string;
  lang: string;
}

export const BlogBaseHead: React.FC<BlogBaseHeadProps> = ({
  title,
  description,
  permalink,
  filename,
  lang,
}) => {
  const ogpUrl =
    lang != 'ja' ? `/ogp/${filename}.png` : `/ogp/ja/${filename}.png`;
  const url =
    lang != 'ja'
      ? `https://togami2864.github.io/${filename}/`
      : `https://togami2864.github.io/ja/${filename}/`;
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />

      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogpUrl} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogpUrl} />

      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@400;700&display=swap"
      />
    </>
  );
};
