import { extendPrototypeResult as localforage } from '../lib/localforage-indexes.js';
import * as tests from './tests.js';

var storeName = 'INDEXES_TEST'

var testLF = localforage.createInstance({
  driver      : 'asyncStorage',
  name        : 'indexTestDb',
  storeName   : storeName
});

describe('Case 1: store has no index', () => {
  describe('Case 1.1: testing createIndex method', () => {
    beforeEach(tests.cleanIndex.bind(null, testLF));


    tests.isPromise(
      testLF.createIndex.bind(testLF, 'TEST_INDEX', 'TEST_KEYPATH'),
      'createIndex call'
    );

    it('creates index with correct', (done) => {
      var indexName = 'TEST_INDEX',
          keyPath   = 'TEST_KEYPATH',
          options   = { multiEntry: true, unique: true };

      testLF.createIndex(indexName, keyPath, options)
      .then(() => {
        var index = testLF._dbInfo.db.transaction(storeName, 'readonly')
          .objectStore(storeName).index(indexName);

        assert.ok(index, 'index was not created');
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
})
