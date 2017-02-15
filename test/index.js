import { extendPrototypeResult as localforage } from '../lib/localForage-create-index.js';
import * from './tests.js';

var storeName = 'INDEXES_TEST'

var testLF = localforage.createInstance
  driver      : 'asyncStorage'
  name        : 'indexTestDb'
  storeName   : storeName

describe('Case 1: store has no index', () => {
  beforeEach((done) => {
    testLF.deleteIndex('TEST_INDEX')
      .then(() => done(), () => done());
  });

  describe('Case 1.1: testing createIndex method', () => {
    isPromise(testLF.createIndex('TEST_INDEX'), 'createIndex call');

    it('should create correct index', (done) => {
      var keyPath = 'KEYPATH';
      var indexPromise = testLF.createIndex('TEST_INDEX', keyPath)
      .then(() => {
        var index = testLF._dbInfo.db.transaction(storeName, 'readonly')
          .objectStore(storeName).index('TEST_INDEX');

        assert.ok(index);
        assert(index.keyPath = keyPath);

        done();
      },
      (err) => {
        done(err);
      });
    });
  });
})
