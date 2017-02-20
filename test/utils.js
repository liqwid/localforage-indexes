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
