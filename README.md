localforage-indexes
==============================

Plugin for localforage to work with indexes in indexedDb
[localForage](https://github.com/mozilla/localForage).

## Requirements

* [localforage](https://github.com/mozilla/localForage) v1.4.0+

## Installation
`npm i localforage-indexes`

## API

### createIndex

`createIndex(indexName, keyPath[, options[, callback]])`

Creates an index on the specified storage
Supports promises and callbacks

Promise case:

```js
localforage.createIndex('LF_INDEX', 'INDEXED_FIELD')
.then((index) => {
  // index created
})
.catch((err) => {
  //...
});
```

Callback case:

```js
localforage.createIndex('LF_INDEX', 'INDEXED_FIELD', (err, index) => {
  // check error here
});
```

### getIndex

`getIndex(indexName)`

Updates existing index on the specified storage
Supports promises and callbacks

Promise case:

```js
localforage.getIndex('LF_INDEX')
.then(() => {
  // index deleted
})
.catch((err) => {
  //...
});
```

Callback case:

```js
localforage.getIndex('LF_INDEX', (err, index) => {
  // check error here
})
```

### updateIndex

`updateIndex(indexName, newKeyPath, newOptions)`

Updates existing index on the specified storage
Used to change keyPath or options of an index
Supports promises and callbacks

Promise case:

```js
localforage.updateIndex('LF_INDEX', 'ANOTHER_INDEXED_FIELD')
.then((index) => {
  // index updated
})
.catch((err) => {
  //...
});
```

Callback case:

```js
localforage.updateIndex('LF_INDEX', 'ANOTHER_INDEXED_FIELD', (err, index) => {
  // check error here
});
```

### deleteIndex

`deleteIndex(indexName)`

Updates existing index on the specified storage
Supports promises and callbacks

Promise case:

```js
localforage.deleteIndex('LF_INDEX')
.then(() => {
  // index deleted
})
.catch((err) => {
  //...
});
```

Callback case:

```js
localforage.deleteIndex('LF_INDEX', (err, index) => {
  // check error here
})
```

### Methods' arguments

Arguments are the same as of vanilla indexedDb API
[Details](https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/createIndex)

`indexName` - index name, must be unique for the store
`keyPath`   - path of the field that index is based upon, separated by dot: `EXAMPLE.KEY.PATH`
`options`:
  * `multiEntry` - will make an effect if keyPath resolves to an array. If true multiple index entry will be created for each array element, if false single instance is created. *Default: false*
  * `unique` - if set to true removes duplicates from index. *Default: false*
`callback` - Callback function. If one is provided method call won't return a promise. Instead a callback will be called when the indexedDB transaction is finished.

### Usage

#### Warning: Firefox and Safari do not support usage of Promises with indexedDB's transactions
Any transaction passed through native promise will get destroyed.
Firefox/Safari transactions can still be used with callbacks.

Intended to use only with indexedDb. Custom driver to be compatible with indexes must inherit from localforage's indexdDb(asyncStorage) driver.

```js
import {extendPrototypeResult as localforage} from 'localforage-indexes';

localforage.createIndex('LF_INDEX', 'INDEXED_FIELD')
.then((index) => {
  // working with index...
})
```

Can be used with a single instance of localforage for each indexDb database.

```js
import {extendPrototypeResult as localforage} from 'localforage-indexes';

var forage = localforage.createInstance({
  driver      : 'asyncStorage',
  name        : 'multiInstance',
  storeName   : 'multiInstanceStore'
});

var another_forage = localforage.createInstance({
  driver      : 'asyncStorage',
  name        : 'multiInstance',
  storeName   : 'anotherMultiInstanceStore'
});

forage.createIndex('newIndex', 'KEYPATH')
.then(() => {
  // will most likely cause an error because of conflicting db
  // versions
  another_forage.createIndex('anotherIndex');
});
```

### Links

* [GitHub](https://github.com/liqwid/localforage-indexes)
* [NPM](https://www.npmjs.com/package/localforage-indexes)
