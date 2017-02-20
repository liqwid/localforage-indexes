import { extendPrototypeResult as localforage } from '../lib/localforage-indexes.js';
import * as utils from './utils.js';

var storeName = 'INDEXES_TEST'

describe('Case 1: localStorage\n', () => {
  describe('Case 1.1: exception shall be thrown\n', () => {
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

describe('Case 2: webSQL\n', () => {
  describe('Case 1.2: exception shall be thrown\n', () => {
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
