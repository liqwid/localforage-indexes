import { extendPrototypeResult as localforage } from '../lib/localforage-indexes.js';
import * as utils from './utils.js';

var storeName = 'INDEXES_TEST';

var testLF = localforage.createInstance({
  driver      : 'asyncStorage',
  name        : 'indexTestDb',
  storeName   : storeName
});

describe('Case 2: store has index\n', () => {
  var indexName = 'TEST_INDEX',
      keyPath   = 'TEST_KEYPATH',
      options   = { multiEntry: true, unique: true };
  beforeEach((done) =>
    testLF.createIndex(indexName, keyPath, options)
    .then(() => done(), () => done())
  );

  describe('Case 2.1: testing deleteIndex method\n', () => {
    utils.isPromise(
      testLF.deleteIndex.bind(testLF, 'TEST_INDEX'),
      'deleteIndex call'
    );

    it('deletes index', (done) => {
      testLF.deleteIndex(indexName)
      .then(() => {
        var index = testLF._dbInfo.db.transaction(storeName, 'readonly')
          .objectStore(storeName).index(indexName);

        assert.ok(!index, 'index was not deleted');

        done();
      },
      (err) => {
        throw err;
      }).catch(done);
    });
  });

  describe('Case 2.2: testing updateIndex method\n', () => {
    utils.isPromise(
      testLF.updateIndex.bind(testLF, 'TEST_INDEX'),
      'updateIndex call'
    );

    keyPath = 'NEW_TEST_KEYPATH';
    options = { multiEntry: false, unique: false };

    it('updates index', (done) => {
      testLF.updateIndex(indexName, keyPath, options)
      .then(() => {
        var index = testLF._dbInfo.db.transaction(storeName, 'readonly')
          .objectStore(storeName).index(indexName);

        assert.ok(index, 'index was not created during update');
        assert.strictEqual(index.keyPath, keyPath, 'incorrect keypath');
        assert.strictEqual(index.multiEntry, options.multiEntry, 'incorrect multiEntry option');
        assert.strictEqual(index.unique, options.unique, 'incorrect unique option');
        done();
      },
      (err) => {
        throw err;
      }).catch(done);
    });
  });

  describe('Case 2.3: testing createIndex method for warnings\n', () => {
    beforeEach(utils.cleanIndex.bind(null, testLF));

    it('creating existing index logs warning', (done) => {
      testLF.createIndex(indexName, keyPath, options)
      .then(() => {
        assert(console.warn.calledOnce, 'warning not called');
        done();
      },
      (err) => {
        throw err;
      }).catch(done);
    });
  });
});
