const {regexFromExtensions} = require('@flecks/build/src/server');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.hook = async (target, config, env, argv, flecks) => {
  const isProduction = 'production' === argv.mode;
  let finalLoader;
  switch (target) {
    case 'fleck': {
      finalLoader = {loader: MiniCssExtractPlugin.loader};
      config.plugins.push(new MiniCssExtractPlugin({filename: 'assets/[name].css'}));
      break;
    }
    case 'server': {
      finalLoader = {loader: MiniCssExtractPlugin.loader, options: {emit: false}};
      config.plugins.push(new MiniCssExtractPlugin({filename: 'assets/[name].css'}));
      break;
    }
    case 'test': {
      finalLoader = {loader: MiniCssExtractPlugin.loader};
      config.plugins.push(new MiniCssExtractPlugin({filename: 'assets/[name].css'}));
      break;
    }
    case 'web': {
      if (isProduction) {
        finalLoader = {loader: MiniCssExtractPlugin.loader};
        config.plugins.push(new MiniCssExtractPlugin({filename: 'assets/[name].css'}));
      }
      else {
        finalLoader = {loader: 'style-loader'};
      }
      break;
    }
    default: break;
  }
  const buildOneOf = (test, loaders, cssOptions = {}) => ({
    test,
    use: [
      finalLoader,
      {
        loader: 'css-loader',
        options: {
          ...cssOptions,
          importLoaders: loaders.length,
        },
      },
      ...loaders,
      'source-map-loader',
    ],
  });
  const stylesWithModulesRule = (extensions, loaders) => ({
    oneOf: [
      // `.module.*` must match first.
      buildOneOf(
        regexFromExtensions(extensions.map((ext) => `module${ext}`)),
        loaders,
        {
          modules: {
            localIdentName: isProduction
              ? '[hash:base64:5]'
              : '[path][name]__[local]',
          },
        },
      ),
      buildOneOf(
        regexFromExtensions(extensions),
        loaders,
      ),
    ],
  });
  const postcss = {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        config: await flecks.resolveBuildConfig('postcss.config.js'),
      },
    },
  };
  // Originally separated because Sass can't handle incoming source maps, but probably more
  // performant with 3rd-party CSS anyway.
  config.module.rules.push(stylesWithModulesRule(['.css'], [postcss]));
  config.module.rules.push(stylesWithModulesRule(['.sass', '.scss'], [postcss, 'sass-loader']));
  // Fonts.
  if (isProduction) {
    config.module.rules.push({
      generator: {
        filename: 'assets/[hash][ext][query]',
      },
      test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      type: 'asset',
    });
  }
  else {
    config.module.rules.push({
      test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      type: 'asset/inline',
    });
  }
  // Images.
  config.module.rules.push({
    generator: {
      filename: 'assets/[hash][ext][query]',
    },
    test: /\.(ico|png|jpg|jpeg|gif|svg|webp)(\?v=\d+\.\d+\.\d+)?$/,
    type: 'asset',
  });
};
