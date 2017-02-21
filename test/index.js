import { extendPrototypeResult as localforage } from '../lib/localforage-indexes.js';
import * as utils from './utils.js';
import no_index_scenarios from './no_index_scenarios.js';
import index_scenarios from './index_scenarios.js';
import non_indexeddb_driver_scenarios from './non_indexeddb_driver_scenarios.js';

var storeName = 'INDEX_API_TEST'

var testLF = localforage.createInstance({
  driver      : 'asyncStorage',
  name        : 'indexTestDb',
  storeName   : storeName
});

no_index_scenarios(testLF, storeName, utils);
index_scenarios(testLF, storeName, utils);
non_indexeddb_driver_scenarios(localforage, storeName, utils);
