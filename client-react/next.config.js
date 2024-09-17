const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "custom",
    loaderFile: "./image.loader.js",
  },
  env: {
    BACKEND: "http://localhost:5000/api",
  },
};

module.exports = nextConfig;
