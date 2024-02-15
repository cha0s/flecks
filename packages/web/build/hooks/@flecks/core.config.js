exports.hook = () => ({
  /**
   * The ID of the root element on the page.
   */
  appMountId: 'root',
  /**
   * Base tag path.
   */
  base: '/',
  /**
   * (webpack-dev-server) Host to bind. Defaults to `flecks.web.host`
   */
  devHost: undefined,
  /**
   * (webpack-dev-server) Port to bind. Defaults to random port.
   */
  devPort: 0,
  /**
   * (webpack-dev-server) Webpack stats output.
   */
  devStats: {
    preset: 'minimal',
  },
  /**
   * Modules to externalize using `webpack.DllPlugin`.
   */
  dll: [],
  /**
   * Host to bind.
   *
   * Defaults to 'localhost' in development and '0.0.0.0' in production.
   */
  host: undefined,
  /**
   * Path to icon.
   */
  icon: '',
  /**
   * Port to bind.
   */
  port: 3000,
  /**
   * Meta tags.
   */
  meta: {
    charset: 'utf-8',
    viewport: 'width=device-width, user-scalable=no',
  },
  /**
   * Public path to server. Defaults to `[@flecks/web.host]:[@flecks/web.port]`.
   */
  public: undefined,
  /**
   * Webpack stats configuration.
   */
  stats: {
    preset: 'minimal',
  },
  /**
   * HTML title.
   */
  title: '[@flecks/core.id]',
  /**
   * Proxies to trust.
   *
   * See: https://www.npmjs.com/package/proxy-addr
   */
  trust: false,
});
