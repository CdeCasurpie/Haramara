/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["localhost", "picsum.photos"], // Agrega aquí el dominio de tu backend
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '5000',
          pathname: '/static/uploads/services/**',
        },
      ],
    },
  };

export default nextConfig;
