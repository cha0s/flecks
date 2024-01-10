import {regexFromExtensions} from '@flecks/core/server';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const augmentBuild = (target, config, env, argv, flecks) => {
  let finalLoader;
  switch (target) {
    case 'fleck': {
      finalLoader = {loader: MiniCssExtractPlugin.loader};
      config.plugins.push(new MiniCssExtractPlugin({filename: '[name].css'}));
      break;
    }
    case 'server': {
      finalLoader = {loader: 'style-loader', options: {injectType: 'lazyStyleTag'}};
      break;
    }
    case 'web': {
      finalLoader = {loader: MiniCssExtractPlugin.loader};
      config.plugins.push(new MiniCssExtractPlugin({filename: 'assets/[name].css'}));
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
            localIdentName: '[hash:4]',
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
        config: flecks.buildConfig('postcss.config.js'),
      },
    },
  };
  // Originally separated because Sass can't handle incoming source maps, but probably more
  // performant with 3rd-party CSS anyway.
  config.module.rules.push(stylesWithModulesRule(['.css'], [postcss]));
  config.module.rules.push(stylesWithModulesRule(['.sass', '.scss'], [postcss, 'sass-loader']));
  // Fonts.
  config.module.rules.push({
    generator: {
      filename: 'assets/[hash][ext][query]',
    },
    test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
    type: 'asset',
  });
  // Images.
  config.module.rules.push({
    generator: {
      filename: 'assets/[hash][ext][query]',
    },
    test: /\.(ico|png|jpg|jpeg|gif|svg|webp)(\?v=\d+\.\d+\.\d+)?$/,
    type: 'asset',
  });
};

export default augmentBuild;
