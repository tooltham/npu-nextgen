/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com https://*.upstash.io; frame-src 'self'; object-src 'none';",
  },
];

const nextConfig = {
  output: "standalone",
  // Security Headers
  async headers() {
    return [
      {
        source: "/:path((?!api/admin/export/pdf).*)",
        headers: [
          ...securityHeaders,
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
      // Override X-Frame-Options for the PDF export route only
      // so it can be embedded in an iframe from the same origin (Admin Dashboard)
      {
        source: "/api/admin/export/pdf",
        headers: [
          ...securityHeaders,
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
