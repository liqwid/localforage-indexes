export function isPromise(method, entity) {
  it(entity + ' should return a promise', (done) => {
    assert.ok(method().then(() => done(), done), entity + ' does not return a promise');
  });
}

export function cleanIndex(localforage, done) {
  console.log("Cleaning index...");
  localforage.deleteIndex('TEST_INDEX')
    .then(() => {
      console.log("Index cleaned");
      done();
    }, () =>
      done()
    );
}
