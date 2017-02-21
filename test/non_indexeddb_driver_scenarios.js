export default function(localforage, storeName, utils) {

  describe('Case 3: testing incomatible drivers\n', () => {

    describe('Case 3.1: localStorage\n', () => {
      describe('Case 3.1.1: exception shall be thrown\n', () => {
        var driverName = 'localStorageWrapper';
        var testLF = localforage.createInstance({
          driver      : driverName,
          name        : 'testLS',
          storeName   : storeName
        });

        utils.throwsBadDriverException(testLF.createIndex.bind(testLF), 'createIndex', driverName);
        utils.throwsBadDriverException(testLF.updateIndex.bind(testLF), 'updateIndex', driverName);
        utils.throwsBadDriverException(testLF.deleteIndex.bind(testLF), 'deleteIndex', driverName);
      });
    });

    describe('Case 3.2: webSQL\n', () => {
      describe('Case 3.2.2: exception shall be thrown\n', () => {
        var driverName = 'webSQLStorage';
        var testLF = localforage.createInstance({
          driver      : driverName,
          name        : 'testWebSQL',
          storeName   : storeName
        });

        utils.throwsBadDriverException(testLF.createIndex.bind(testLF), 'createIndex', driverName);
        utils.throwsBadDriverException(testLF.updateIndex.bind(testLF), 'updateIndex', driverName);
        utils.throwsBadDriverException(testLF.deleteIndex.bind(testLF), 'deleteIndex', driverName);
      });
    });

  });
}
