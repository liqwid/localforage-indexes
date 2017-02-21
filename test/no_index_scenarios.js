export default function(testLF, storeName, utils) {

  describe('Case 1: store has no index\n', () => {

    describe('Case 1.1: testing createIndex method\n', () => {
      beforeEach(utils.cleanIndex.bind(null, testLF));

      utils.isPromise(
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
      before(sinon.spy(console, 'warn'));

      it('requesting for non-existing index reject with an error', (done) => {
        var indexName = 'TEST_INDEX';

        testLF.getIndex(indexName)
        .then(() => {
          assert(false, 'resolved without error');
        },
        (err) => done());
      });

      it('deleting non-existing index logs warning', (done) => {
        var indexName = 'TEST_INDEX';

        testLF.deleteIndex(indexName)
        .then(() => {
          assert(console.warn.calledOnce, 'warning not called');
          done();
        },
        (err) => {
          throw err;
        }).catch(done);
      });

      it('updating non-existing index logs warning', (done) => {
        var indexName = 'TEST_INDEX';

        testLF.updateIndex(indexName)
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
}
