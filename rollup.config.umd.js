import config from './rollup.config';

config.format = 'umd';
config.dest = 'dist/localforage-create-index.js';
config.moduleName = 'localforagePluginBoilerplate';

export default config;
