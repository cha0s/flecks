import fontLoader from '@neutrinojs/font-loader';
import imageLoader from '@neutrinojs/image-loader';
import styleLoader from '@neutrinojs/style-loader';

const augmentBuild = (target, config, flecks) => {
  config.use.push((neutrino) => {
    const isProduction = 'production' === neutrino.config.get('mode');
    const extract = {};
    const style = {};
    if ('server' === target) {
      extract.enabled = false;
      style.injectType = 'lazyStyleTag';
    }
    if ('web' === target) {
      extract.enabled = isProduction;
      style.injectType = 'styleTag';
    }
    if ('fleck' === target) {
      extract.enabled = true;
      extract.plugin = {
        filename: 'index.css',
      };
    }
    neutrino.use(
      styleLoader({
        extract,
        modules: {
          localIdentName: isProduction ? '[hash]' : '[path][name]__[local]',
        },
        style,
        test: /\.(c|s[ac])ss$/,
        modulesTest: /\.module\.(c|s[ac])ss$/,
        loaders: [
          {
            loader: 'postcss-loader',
            useId: 'postcss',
            options: {
              postcssOptions: {
                config: flecks.buildConfig('postcss.config.js'),
              },
            },
          },
          {
            loader: 'sass-loader',
            useId: 'sass',
          },
        ],
      }),
    );
  });
  config.use.push(fontLoader());
  config.use.push(imageLoader());
};

export default augmentBuild;
