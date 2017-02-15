requirejs.config({
    paths: {
        localforage: '../node_modules/localforage/dist/localforage'
    }
});
define([
  'localforage',
  '../dist/localforage-plugin-boilerplate'
], function(localforage, pluginBoilerplate) {
  localforage.ready(function() {
    localforage.pluginMethod().then(function(result) {
      console.log(result);
    });

    localforage.setItem('test1', 'value1').then(function() {
      console.log('setItem(\'test1\', \'value1\')');
      return localforage.clear();
    });
  });
});
