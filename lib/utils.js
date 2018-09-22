/*
 * Resolves a store created in versionchange transaction
 * @param {localforage} localforageInstance
 * @param {callback function} action - action to perform on store
 * HACK: callback is used instead of Promise because Firefox & Safari destroy
 *       transactions that are passed through promise
 * @param {callback function} finished - called after action is preformed
 * @return {Promise} {
 *  store - store's indexes can be modified
 *  request - version update connection
 *  dbInfo - container with indexedDb config
 *  newVersion - current version of indexedDb
 *  oldVersion - previous version of indexedDb
 * }
*/
export function _upgradeStore(localforageInstance, action, finished) {
    return localforageInstance.ready()
    .then(() => {
        var dbInfo = localforageInstance._dbInfo;
        if (!(dbInfo.db instanceof IDBDatabase)) {
          return finished(new Error(`Driver ${localforageInstance.driver()} does not support indexing`));
        }

        dbInfo.db.close();
        var request = getIDB().open(dbInfo.name, dbInfo.db.version + 1);

        request.onupgradeneeded = ({ newVersion, oldVersion }) => {
            dbInfo.db = request.result;
            var store = request.transaction.objectStore(dbInfo.storeName);

            action({ store, dbInfo, newVersion, oldVersion });
        };

        request.onerror = (e) => {
            e.preventDefault();
            finished(request.error);
        };

        request.onsuccess = () => finished();
    });
}

export function _getIndex(localforageInstance, indexName) {
    var dbInfo = localforageInstance._dbInfo;
    var storeName = dbInfo.storeName;
    return dbInfo.db.transaction(storeName, 'readonly')
        .objectStore(storeName).index(indexName);
}

export function _executePromiseOrCallback(promise, callback) {
    if (typeof callback === 'function') {
      var resolve = (result) => callback(null, result);
      var reject  = (error)  => callback(error);

      return promise(resolve, reject);
    }

    return new Promise(promise);
}

export function _resolveParams(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options  = undefined;
    }

    return { options, callback };
}

function getIDB() {
    /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
    try {
        if (typeof indexedDB !== 'undefined') {
            return indexedDB;
        }
        if (typeof webkitIndexedDB !== 'undefined') {
            return webkitIndexedDB;
        }
        if (typeof mozIndexedDB !== 'undefined') {
            return mozIndexedDB;
        }
        if (typeof OIndexedDB !== 'undefined') {
            return OIndexedDB;
        }
        if (typeof msIndexedDB !== 'undefined') {
            return msIndexedDB;
        }
        throw new Error("indexedDb not supported by browser");
    } catch (e) {
      throw e;
    }
}
