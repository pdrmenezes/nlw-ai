/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.experiments = { asyncWebAssembly: true, layers: true };
    config.resolve.alias['/node_modules/@ffmpeg/core/dist/ffmpeg-core.js'] =
      '/node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js';
    config.resolve.alias['fs'] = false;
    return config;
  },
}

module.exports = nextConfig
