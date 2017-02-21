export default function(testLF, storeName, utils) {

  describe('Case 2: store has index\n', () => {

    var indexName = 'TEST_INDEX',
        keyPath   = 'TEST_KEYPATH',
        options   = { multiEntry: true, unique: true };

    describe('Case 2.1: testing getIndex method\n', () => {
      before(utils.createNewIndex.bind(null, testLF));
      after(utils.cleanIndex.bind(null, testLF));

      utils.isPromise(
        testLF.getIndex.bind(testLF, 'TEST_INDEX'),
        'getIndex call'
      );

      it('gets index', (done) => {
        testLF.getIndex(indexName)
        .then((index) => {
          utils.testIndex(index, keyPath, options);
          done();
        },
        (err) => {
          throw err;
        }).catch(done);
      });
    });

    describe('Case 2.2: testing updateIndex method\n', () => {
      before(utils.createNewIndex.bind(null, testLF));
      after(utils.cleanIndex.bind(null, testLF));

      utils.isPromise(
        testLF.updateIndex.bind(testLF, 'TEST_INDEX'),
        'updateIndex call'
      );

      var newKeyPath = 'NEW_TEST_KEYPATH';
      var newOptions = { multiEntry: false, unique: false };

      it('updates index', (done) => {
        testLF.updateIndex(indexName, newKeyPath, newOptions)
        .then((index) => {
          utils.testIndex(index, newKeyPath, newOptions);
          done();
        },
        (err) => {
          throw err;
        }).catch(done);
      });
    });

    describe('Case 2.3: testing deleteIndex method\n', () => {
      beforeEach(utils.createNewIndex.bind(null, testLF));
      after(utils.cleanIndex.bind(null, testLF));

      utils.isPromise(
        testLF.deleteIndex.bind(testLF, 'TEST_INDEX'),
        'deleteIndex call'
      );

      it('deletes index', (done) => {
        testLF.deleteIndex(indexName)
        .then(() => {
          try {
            testLF._dbInfo.db.transaction(storeName, 'readonly')
              .objectStore(storeName).index(indexName);
          } catch(e) {
            done();
          } finally {
            done('index was not deleted');
          }
        },
        (err) => {
          throw err;
        }).catch(done);
      });
    });

    describe('Case 2.4: testing createIndex method for warnings\n', () => {
      beforeEach(utils.createNewIndex.bind(null, testLF));
      after(utils.cleanIndex.bind(null, testLF));

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
}
