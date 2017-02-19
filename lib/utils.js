/*
 * Resolves a store created in versionchange transaction
 * @param {localforage} localforageInstance
 * @param {callback function} action - action to perform on store
 * HACK: callback is used instead of Promise because Firefox destroys
 *       transactions that are passed through resolve()
 * @param {callback function} finished - called after action is preformed
 * @return {Promise} {
 *  store - store's indexes can be modified
 *  request - version update connection
 *  dbInfo - container with indexedDb config
 *  newVersion - current version of indexedDb
 *  oldVersion - previous version of indexedDb
 * }
*/
export function upgradeStore(localforageInstance, action, finished) {
    return localforageInstance.ready()
    .then(() => {
        var dbInfo = localforageInstance._dbInfo;
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
