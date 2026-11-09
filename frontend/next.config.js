/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Emit /instant/<id>/index.html so S3 static website hosting serves clean URLs.
  trailingSlash: true,
  images: {
    loader: 'akamai',
    path: '',
    unoptimized: true,
  },
};

module.exports = nextConfig;
