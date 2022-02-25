const {
  HTTP_DEV_HOST = 'localhost',
  HTTP_DEV_PORT = 32341,
  HTTP_DEV_PUBLIC,
  HTTP_HOST = '0.0.0.0',
  HTTP_PORT = 32340,
} = process.env;

module.exports = () => ({
  devHost: HTTP_DEV_HOST,
  devPort: HTTP_DEV_PORT,
  devPublic: HTTP_DEV_PUBLIC,
  host: HTTP_HOST,
  port: HTTP_PORT,
});
