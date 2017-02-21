export function isPromise(method, entity) {
  it(entity + ' should return a promise', (done) => {
    assert.ok(method().then(() => done(), done), entity + ' does not return a promise');
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
    }, () =>
      done()
    );
}

export function createNewIndex(localforage, done) {
  console.log('Creating new test index...');

  localforage.createIndex('TEST_INDEX', 'TEST_KEYPATH', { multiEntry: true, unique: true })
  .then(() => {
    console.log('Index cleaned');
    done();
  }, () =>
    done()
  );
}

export function testIndex(index, keyPath, options) {
  assert.ok(index, 'index was not created');
  assert.strictEqual(index.keyPath, keyPath, 'incorrect keypath');
  assert.strictEqual(index.multiEntry, options.multiEntry, 'incorrect multiEntry option');
  assert.strictEqual(index.unique, options.unique, 'incorrect unique option');
}
