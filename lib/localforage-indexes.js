import localforage from 'localforage';
import { _upgradeStore, _getIndex, _executePromiseOrCallback, _resolveParams } from './utils';

function handleMethodCall(localforageInstance, methodName, args) {
    return localforageInstance.ready()
        .then(function () {
            var promise = localforageInstance._baseMethods[methodName].apply(localforageInstance, args);
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
 * @param {Function<err | index>} callback
 * @return {Promise<index>} resolves with new index, rejects if index is present
*/
export function createIndex(indexName, keyPath, options, callback) {
    ({ options, callback } = _resolveParams(options, callback));
    var localforageInstance = this;
    setup(localforageInstance);

    return _executePromiseOrCallback(function(resolve, reject) {
        _upgradeStore(localforageInstance,
            function({ store, dbInfo, newVersion, oldVersion }) {
                if (store.indexNames.contains(indexName)) {
                    return reject(new Error(`The database "${dbInfo.name}" has been upgraded from version ${oldVersion} to version ${newVersion}, but the index "${indexName}" in the storage "${dbInfo.storeName}" already exists.`));
                }

                store.createIndex(indexName, keyPath, options || {});
            }
        ,
            function(err) {
                if (err) return reject(err);

                resolve(_getIndex(localforageInstance, indexName));
            }
        );
    }, callback);
}

/*
 * Gets index
 * @param {String} indexName
 * @param {Function<err | index>} callback
 * @return {Promise<index>} resolves with an index, rejects if index is not found
*/
export function getIndex(indexName, callback) {
    var localforageInstance = this;
    setup(localforageInstance);

    return _executePromiseOrCallback(function(resolve, reject) {
        localforageInstance.ready()
        .then(() => resolve(_getIndex(localforageInstance, indexName)))
        .catch(reject)
    }, callback);
}

/*
 * Deletes then recreates index
 * Use to change index keyPath or options
 * @param {String} indexName
 * @param {String} keyPath, indexDb key path, keys separated with dot
 * @param {Object} options, indexDb index creation options
 * @param {Function<err | index>} callback
 * @return {Promise<index>} resolves with updated index, rejects if index is present
*/
export function updateIndex(indexName, keyPath, options, callback) {
    ({ options, callback } = _resolveParams(options, callback));
    var localforageInstance = this;
    setup(localforageInstance);

    return _executePromiseOrCallback(function(resolve, reject) {
        _upgradeStore(localforageInstance,
            function({ store, dbInfo, newVersion, oldVersion }) {
                if (!store.indexNames.contains(indexName)) {
                    return reject(new Error(`The database "${dbInfo.name}" has been upgraded from version ${oldVersion} to version ${newVersion}, but the index "${indexName}" in the storage "${dbInfo.storeName}" does not exists.`));
                }

                store.deleteIndex(indexName);
                store.createIndex(indexName, keyPath, options);
            }
        ,
            function(err) {
                if (err) return reject(err);

                resolve(_getIndex(localforageInstance, indexName));
            }
        );
    }, callback);
}

/*
 * Deletes index
 * @param {String} indexName
 * @param {Function<err>} callback
 * @return {Promise} resolves when index is delted, rejects if index isn't present
*/
export function deleteIndex(indexName, callback) {
    var localforageInstance = this;
    setup(localforageInstance);

    return _executePromiseOrCallback(function(resolve, reject) {
        _upgradeStore(localforageInstance,
            function({ store, dbInfo, newVersion, oldVersion }) {
                if (!store.indexNames.contains(indexName)) {
                    return reject(new Error(`The database "${dbInfo.name}" has been upgraded from version ${oldVersion} to version ${newVersion}, but the index "${indexName}" in the storage "${dbInfo.storeName}" does not exists.`));
                }

                store.deleteIndex(indexName);
            }
        ,
            function(err) {
                if (err) return reject(err);

                resolve();
            }
        );
    }, callback);
}

// add your plugin method to every localForage instance
export function extendPrototype(localforage) {
    var localforagePrototype = Object.getPrototypeOf(localforage);
    if (localforagePrototype) {
        localforagePrototype.createIndex = createIndex;
        localforagePrototype.getIndex    = getIndex;
        localforagePrototype.updateIndex = updateIndex;
        localforagePrototype.deleteIndex = deleteIndex;
    }
    return localforage;
}

export var extendPrototypeResult = extendPrototype(localforage);
