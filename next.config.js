/* @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Sets security headers for all routes
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // {
          //   key: 'Content-Security-Policy',
          //   value: `
          //     default-src 'self' ${process.env.NEXT_PUBLIC_DEFAULT_URL} ${process.env.NEXT_PUBLIC_DEFAULT_SNOMED_URL};
          //     img-src 'self' data: ${process.env.NEXT_PUBLIC_DEFAULT_URL} ${process.env.NEXT_PUBLIC_DEFAULT_SNOMED_URL};
          //     style-src 'self' ${process.env.NEXT_PUBLIC_DEFAULT_URL} ${process.env.NEXT_PUBLIC_DEFAULT_SNOMED_URL} 'unsafe-inline';
          //     script-src 'self' ${process.env.NEXT_PUBLIC_DEFAULT_URL} ${process.env.NEXT_PUBLIC_DEFAULT_SNOMED_URL} 'unsafe-inline' 'unsafe-eval';
          //     object-src 'self' data: ${process.env.NEXT_PUBLIC_DEFAULT_URL} ${process.env.NEXT_PUBLIC_DEFAULT_SNOMED_URL};
          //     frame-src 'self' ${process.env.NEXT_PUBLIC_DEFAULT_URL} ${process.env.NEXT_PUBLIC_DEFAULT_SNOMED_URL} data: ;
          //   `
          //     .replace(/\s{2,}/g, " ")
          //     .trim(),
          // },
        ],

      },
    ];
  },
};
module.exports = nextConfig;
