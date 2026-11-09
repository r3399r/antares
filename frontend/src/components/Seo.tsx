import Head from 'next/head';
import { SITE_NAME, SITE_URL } from '@/constant/site';

type Props = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  jsonLd?: object[];
};

const Seo = ({ title, description, path, image, imageAlt, jsonLd = [] }: Props) => {
  const url = `${SITE_URL}${path}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="zh_TW" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      {image && imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      {jsonLd.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify keeps quotes in titles from breaking the markup; escape "<" so
          // no value can close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
      ))}
    </Head>
  );
};

export default Seo;
