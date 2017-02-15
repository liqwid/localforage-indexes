export function isPromise(instance, entity) {
  it(entity + ' should return a promise', () => {
    assert(instance.contains('then'), entity + ' does not return a promise')
  });
}
