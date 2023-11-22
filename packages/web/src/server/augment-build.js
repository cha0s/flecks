import {font, image, style} from './webpack';

const augmentBuild = (target, config, env, argv, flecks) => {
  const extract = {};
  const styleOptions = {};
  if ('server' === target) {
    extract.enabled = false;
    styleOptions.injectType = 'lazyStyleTag';
  }
  if ('web' === target) {
    styleOptions.injectType = 'styleTag';
  }
  if ('fleck' === target) {
    extract.enabled = true;
    extract.plugin = {
      filename: '[name].css',
    };
  }
  const loaders = [
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          config: flecks.buildConfig('postcss.config.js'),
        },
      },
    },
    {
      loader: 'sass-loader',
    },
  ];
  style(config, env, argv, {extract, loaders, style: styleOptions}, flecks);
  font(config, env, argv);
  image(config, env, argv);
};

export default augmentBuild;
