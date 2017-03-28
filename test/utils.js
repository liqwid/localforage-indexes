export function isPromise(method, entity) {
  it(entity + ' should return a promise', (done) => {
    assert.ok(method().then(() => done(), done), entity + ' does not return a promise');
  });
}

export function callbackResolves(method, entity) {
  it(entity + ' should return result inside a callback', (done) => {
    method((err, index) => {
      try {
        assert.isNotOk(err, 'callback returns error');
        assert.isOk(index, 'clallback does not return an index');
        // Checking if index's transaction is not destroyed
        index.count();
      } catch(e) {
        done(e);
      } finally {
        done();
      }
    })
  });
}

export function callbackError(method, entity) {
  it(entity + ' should return error inside a callback', (done) => {
    method((err, result) => {
      done(assert(err instanceof Error || err instanceof DOMError, 'callback does not return error'));
    });
  });
}

export function throwsBadDriverException(func, funcName, driverName) {
  it(funcName + ' shall throw exception', () => {
    func()
    .then(() => assert.ok(false, funcName + ' doesn\'t throw exception'))
    .catch((err) => assert.strictEqual(
      err.message,
      `Driver ${driverName} does not support indexing`,
      funcName + ' doesn\'t throw exception'
    ));
  });
}

export function cleanIndex(localforage, done) {
  console.log('Cleaning index...');
  localforage.deleteIndex('TEST_INDEX')
    .then(() => {
      console.log('Index cleaned');
      done();
    }, () => {
      done()
    });
}

export function createNewIndex(localforage, done) {
  console.log('Creating new test index...');
  localforage.createIndex('TEST_INDEX', 'TEST_KEYPATH', { multiEntry: true, unique: true })
  .then(() => {
    console.log('Index created');
    done();
  }, () =>
    done()
  );
}

export function testIndex(index, keyPath, options) {
  assert.isOk(index, 'index was not returned');
  assert.strictEqual(index.keyPath, keyPath, 'incorrect keypath');
  assert.strictEqual(index.multiEntry, options.multiEntry, 'incorrect multiEntry option');
  assert.strictEqual(index.unique, options.unique, 'incorrect unique option');
}
