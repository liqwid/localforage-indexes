import config from './rollup.config';

config.format = 'umd';
config.dest = 'dist/localforage-indexes.js';
config.moduleName = 'localforagePluginBoilerplate';

export default config;
