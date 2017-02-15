import localforage from 'localforage';
import { getUpgradableStore } from './utils';

function handleMethodCall(localforageInstance, methodName, args) {
    return localforageInstance.ready()
        .then(function () {
            console.log('Invoking ' + methodName + ' with arguments: ', args);
            var promise = localforageInstance._baseMethods[methodName].apply(localforageInstance, args);
            promise.then(function(result) {
                console.log('Invoking ' + methodName + ' resolved with: ', result);
            }, function(err) {
                console.log('Invoking ' + methodName + ' rejected with: ', err);
            });
            return promise;
        });
}

// wraps the localForage methods of the WrappedLibraryMethods array and
// allows you to execute code before & after their invocation
function wireUpMethods(localforageInstance) {
    var WrappedLibraryMethods = [
        'clear',
        'getItem',
        'iterate',
        'key',
        'keys',
        'length',
        'removeItem',
        'setItem'
    ];

    function wireUpMethod(localforageInstance, methodName) {
        localforageInstance._baseMethods = localforageInstance._baseMethods || {};
        localforageInstance._baseMethods[methodName] = localforageInstance[methodName];
        localforageInstance[methodName] = function () {
            return handleMethodCall(this, methodName, arguments);
        };
    }

    for (var i = 0, len = WrappedLibraryMethods.length; i < len; i++) {
        var methodName = WrappedLibraryMethods[i];
        wireUpMethod(localforageInstance, methodName);
    }
}

// place your plugin initialization logic here
// useful in case that you need to preserve a state
function setup(localforageInstance) {
    if (!localforageInstance._pluginPrivateVariables) {
        localforageInstance._pluginPrivateVariables = {
            listOfImportantThings: [],
            callCount: 0
        };

        // in case you need to observe the invocation of some methods
        wireUpMethods(localforageInstance);
    }
}

/*
 * Creates index
 * @param {String} indexName
 * @param {String} keyPath, indexDb key path, keys separated with dot
 * @param {Object} options, indexDb index creation options
 * @return {Promise} resolves when index is created, rejects if index is present
*/
export function createIndex(indexName, keyPath, options) {
    var localforageInstance = this;
    setup(localforageInstance);

    return new Promise(function(resolve, reject) {
      getUpgradableStore(localforageInstance)
      .then(function({ store, request, dbInfo, newVersion, oldVersion }) {
          if (store.indexNames.contains(indexName)) {
              console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + oldVersion + ' to version ' + newVersion + ', but the index "' + indexName + '" in the storage "' + dbInfo.storeName + '" already exists.');
              return reject();
          }

          store.createIndex(indexName, keyPath, options || {});
          request.onsuccess = resolve;
      })
      .catch(reject)
    })
}

/*
 * Deletes index
 * @param {String} indexName
 * @return {Promise} resolves when index is delted, rejects if index isn't present
*/
export function deleteIndex(indexName) {
    var localforageInstance = this;
    setup(localforageInstance);

    return new Promise(function(resolve, reject) {
      getUpgradableStore(localforageInstance)
      .then(function({ store, request, dbInfo, newVersion, oldVersion }) {
          if (!store.indexNames.contains(indexName)) {
              console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + oldVersion + ' to version ' + newVersion + ', but the index "' + indexName + '" in the storage "' + dbInfo.storeName + '" does not exists.');
              return reject();
          }

          store.deleteIndex(indexName);
          request.onsuccess = resolve;
      })
      .catch(reject)
    })
}

/*
 * Deltes then recreates index
 * Use to change index keyPath or options
 * @param {String} indexName
 * @param {String} keyPath, indexDb key path, keys separated with dot
 * @param {Object} options, indexDb index creation options
 * @return {Promise} resolves when new index is created, rejects if index is present
*/
export function updateIndex(indexName, keyPath, options) {
    var localforageInstance = this;
    setup(localforageInstance);

    return new Promise(function(resolve, reject) {
      getUpgradableStore(localforageInstance)
      .then(function({ store, request, dbInfo, newVersion, oldVersion }) {
          if (!store.indexNames.contains(indexName)) {
              console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + oldVersion + ' to version ' + newVersion + ', but the index "' + indexName + '" in the storage "' + dbInfo.storeName + '" does not exists.');
              return reject();
          }

          store.deleteIndex(indexName);
          store.createIndex(indexName, keyPath, options);
          request.onsuccess = resolve;
      })
      .catch(reject)
    })
}

// add your plugin method to every localForage instance
export function extendPrototype(localforage) {
    var localforagePrototype = Object.getPrototypeOf(localforage);
    if (localforagePrototype) {
        localforagePrototype.createIndex = createIndex;
        localforagePrototype.deleteIndex = deleteIndex;
        localforagePrototype.updateIndex = updateIndex;
    }
    return localforage;
}

export var extendPrototypeResult = extendPrototype(localforage);
