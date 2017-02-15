localForage-plugin-boilerplate
==============================
[![npm](https://img.shields.io/npm/dm/localforage-plugin-boilerplate.svg)](https://www.npmjs.com/package/localforage-plugin-boilerplate)

A simple plugin boilerplate for [localForage](https://github.com/mozilla/localForage).

## Requirements

* [localForage](https://github.com/mozilla/localForage) v1.4.0+

## Installation
`npm i localforage-plugin-boilerplate`

## API
The boilerplate makes the dummy `pluginMethod()` available to all localforage instances.
```js
localforage.pluginMethod().then(function(result) {
  console.log(result);
});
```

## Create your plugin

* Rename the occurrences  of `pluginMethod`, `localforagePluginBoilerplate` and `_pluginPrivateVariables` in the `lib/localforage-plugin-boilerplate.js` (and the file itself) to something more appropriate for your plugin.
* Change the respective names in:
  * `README.md`
  * `package.json`
  * `rollup.config.es6.js`
  * `rollup.config.js`
  * `rollup.config.umd.js`
* Provide a simple example in the `examples/index.html`
