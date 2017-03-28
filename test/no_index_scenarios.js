export default function(testLF, storeName, utils) {

  describe('Case 1: store has no index\n', () => {

    describe('Case 1.1: testing createIndex method\n', () => {
      beforeEach(utils.cleanIndex.bind(null, testLF));

      utils.isPromise(
        testLF.createIndex.bind(testLF, 'TEST_INDEX', 'TEST_KEYPATH'),
        'createIndex call'
      );

      utils.callbackResolves(
        testLF.createIndex.bind(testLF, 'TEST_INDEX', 'TEST_KEYPATH'),
        'createIndex call'
      );

      it('creates index with correct parameters', (done) => {
        var indexName = 'TEST_INDEX',
            keyPath   = 'TEST_KEYPATH',
            options   = { multiEntry: true, unique: true };

        testLF.createIndex(indexName, keyPath, options)
        .then((index) => {
          utils.testIndex(index, keyPath, options);
          done();
        },
        (err) => {
          throw err;
        }).catch(done);
      });
    });

    describe('Case 1.2: testing updateIndex, getIndex and deleteIndex method for warnings\n', () => {
      beforeEach(utils.cleanIndex.bind(null, testLF));

      utils.callbackError(
        testLF.getIndex.bind(testLF, 'TEST_INDEX'),
        'getIndex call'
      );

      it('requesting for non-existing index rejects with an error', (done) => {
        var indexName = 'TEST_INDEX';

        testLF.getIndex(indexName)
        .then(() => {
          done('promise was not rejected');
        },
        (err) => {
          assert(err instanceof Error, 'promise reject not return error');
          done();
        }).catch(done);
      });

      utils.callbackError(
        testLF.deleteIndex.bind(testLF, 'TEST_INDEX'),
        'deleteIndex call'
      );

      it('deleting non-existing index rejects with an error', (done) => {
        var indexName = 'TEST_INDEX';

        testLF.deleteIndex(indexName)
        .then(() => {
          done('promise was not rejected');
        },
        (err) => {
          assert(err instanceof Error, 'promise reject not return error');
          done();
        }).catch(done);
      });

      utils.callbackError(
        testLF.updateIndex.bind(testLF, 'TEST_INDEX', 'NEW_TEST_KEYPATH'),
        'updateIndex call'
      );

      it('updating non-existing index rejects with an error', (done) => {
        var indexName = 'TEST_INDEX';

        testLF.updateIndex(indexName, 'NEW_TEST_KEYPATH')
        .then(() => {
          done('promise was not rejected');
        },
        (err) => {
          assert(err instanceof Error, 'promise reject not return error');
          done();
        }).catch(done);
      });
    });
  });
}
