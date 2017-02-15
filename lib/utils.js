/*
 * Resolves a store created in versionchange transaction
 * @param {localforage} localforageInstance
 * @return {Promise} {
 *  store - store's indexes can be modified
 *  request - version update connection
 *  dbInfo - container with indexedDb config
 *  newVersion - current version of indexedDb
 *  oldVersion - previous version of indexedDb
 * }
*/
export function getUpgradableStore(localforageInstance) {
    return localforageInstance.ready()
    .then(() => getUpgradeConnection(localforageInstance._dbInfo))
    .then(function({ request, dbInfo, newVersion, oldVersion }) {
        var store = request.transaction.objectStore(dbInfo.storeName);

        return Promise.resolve({ store, request, dbInfo, newVersion, oldVersion });
    });
}

/*
 * Resolves a version update connection
 * @param {dbInfo} config of the db
 * @return {Promise} {
 *  request -version update connection
 *  dbInfo - container with indexedDb config
 *  newVersion - current version of indexedDb
 *  oldVersion - previous version of indexedDb
 * }
*/
function getUpgradeConnection(dbInfo) {
    return new Promise(function(resolve, reject) {
        dbInfo.db.close();
        var request = getIDB().open(dbInfo.name, dbInfo.db.version + 1);

        request.onupgradeneeded = function({ newVersion, oldVersion }) {
            dbInfo.db = request.result;
            resolve({ request, dbInfo, newVersion, oldVersion });
        }

        request.onerror = function (e) {
            e.preventDefault();
            reject(request.error);
        }
    });
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
