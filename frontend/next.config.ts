import type { NextConfig } from "next";

const securityHeaders = [
  // 1. Prevent Clickjacking: Disallows embedding VIRALYTIX inside an iframe on another domain
  { key: "X-Frame-Options", value: "DENY" },

  // 2. Prevent MIME Confusion: Tells browser not to guess content types
  { key: "X-Content-Type-Options", value: "nosniff" },

  // 3. Strict Referrer Policy: Never leaks sensitive paths to external domains
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // 4. Force HTTPS: Enforces SSL for 2 years including all subdomains
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },

  // 5. Restrict Browser Hardware APIs: Blocks camera, microphone, geolocation
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },

  // 6. Content Security Policy (CSP): Controls authorized domains for scripts, styles, and connections
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
      "connect-src 'self' https://viralytix-backend-162z.onrender.com http://localhost:8000 http://127.0.0.1:8000",
      "img-src 'self' blob: data: https:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
