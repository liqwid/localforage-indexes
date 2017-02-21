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

`createIndex(indexName, keyPath, options)`

Creates an index on the specified storage
Returns a `Promise` which resolves with new index

```js
localforage.createIndex('LF_INDEX', 'INDEXED_FIELD')
.then((index) => {
  // index created
})
.catch((err) => {
  //...
});
```

### getIndex

`getIndex(indexName)`

Updates existing index on the specified storage
Returns a `Promise` which resolves with index

```js
localforage.getIndex('LF_INDEX')
.then(() => {
  // index deleted
})
.catch((err) => {
  //...
});
```

### updateIndex

`updateIndex(indexName, newKeyPath, newOptions)`

Updates existing index on the specified storage
Returns a `Promise` which resolves with updated index
Used to change keyPath or options of an index

```js
localforage.createIndex('LF_INDEX', 'ANOTHER_INDEXED_FIELD')
.then((index) => {
  // index updated
})
.catch((err) => {
  //...
});
```

### deleteIndex

`deleteIndex(indexName)`

Updates existing index on the specified storage
Returns a `Promise` which resolves when index is deleted

```js
localforage.deleteIndex('LF_INDEX')
.then(() => {
  // index deleted
})
.catch((err) => {
  //...
});
```

### Methods' arguments

Arguments are the same as of vanilla indexedDb API
[Details](https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/createIndex)

`indexName` - index name, must be unique for the store
`keyPath`   - path of the field that index is based upon, separated by dot: `EXAMPLE.KEY.PATH`
`options`:
  * `multiEntry` - will make an effect if keyPath resolves to an array. If true multiple index entry will be created for each array element, if false single instance is created. *Default: false*
  * `unique` - if set to true removes duplicates from index. *Default: false*

### Usage
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

[GitHub](https://github.com/liqwid/localforage-indexes)
[NPM](https://www.npmjs.com/package/localforage-indexes)
