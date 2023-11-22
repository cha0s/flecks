const {regexFromExtensions, require: R} = require('@flecks/core/server');

exports.font = (config, env, argv, options) => {
  const isProduction = 'production' === argv.mode;
  config.module.rules.push({
    test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          ...options,
          name: isProduction ? 'assets/[name].[hash:8].[ext]' : 'assets/[name].[ext]',
        },
      },
    ],
  });
};

exports.image = (config, env, argv, options) => {
  const isProduction = 'production' === argv.mode;
  config.module.rules.push({
    test: /\.(ico|png|jpg|jpeg|gif|svg|webp)(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          ...options,
          limit: 8192,
          name: isProduction ? 'assets/[name].[hash:8].[ext]' : 'assets/[name].[ext]',
        },
      },
    ],
  });
};

exports.style = (config, env, argv, options) => {
  const {
    css = {},
    extensions = [],
    loaders = [],
    style,
  } = options;
  const isProduction = 'production' === argv.mode;
  const extract = {
    ...options.extract,
    enabled: isProduction,
    loader: {
      ...options.extract.loader,
      esModule: true,
    },
    plugin: {
      ...options.extract.plugin,
      filename: isProduction ? 'assets/[name].[contenthash:8].css' : 'assets/[name].css',
    },
  };
  const modules = {
    ...options.modules,
    localIdentName: isProduction ? '[hash]' : '[path][name]__[local]',
  };
  const ExtractPlugin = extract?.enabled ? R('mini-css-extract-plugin') : undefined;
  const styleExtensions = [...new Set(extensions.concat(['css', 'sass', 'scss']))];
  const StyleLoader = ExtractPlugin ? ExtractPlugin.loader : 'style-loader';
  const importLoaders = 2 + loaders.length;
  const buildOneOf = (test, cssArgs = {}) => ({
    test,
    use: [
      {
        loader: StyleLoader,
        options: ExtractPlugin ? extract.loader : style,
      },
      {
        loader: 'css-loader',
        options: {
          ...css,
          ...cssArgs,
          importLoaders,
        },
      },
      ...loaders,
    ],
  });
  config.module.rules.push(
    {
      oneOf: [
        // `.module.*` must match first.
        buildOneOf(regexFromExtensions(styleExtensions.map((ext) => `module.${ext}`)), {modules}),
        buildOneOf(regexFromExtensions(styleExtensions)),
      ],
    },
  );
  if (ExtractPlugin) {
    config.plugins.push(new ExtractPlugin(options.extract.plugin));
  }
};
