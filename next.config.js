/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// import "./src/env.js";

// /** @type {import("next").NextConfig} */
// const config = {};

// export default config;




// /** @type {import('next').NextConfig} */
// const config = {
//     typescript: {
//       ignoreBuildErrors: false,
//     },
//     reactStrictMode: true,
//   };
  
//   export default config;

// import { withAxiom } from 'next-axiom';

// /** @type {import("next").NextConfig} */
// const config = {
//   experimental: {},
//   webpack: (config) => {
//     config.resolve.fallback = {
//       ...config.resolve.fallback,
//       fs: false,
//       path: false,
//     };
//     return config;
//   },
// };

// export default withAxiom(config);

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/model/:path*',
        destination: 'https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2/:path*'
      }
    ]
  }
}

export default nextConfig