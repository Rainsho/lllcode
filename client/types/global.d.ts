import * as idb from 'idb-keyval';

declare global {
  interface Window {
    idbKeyval: typeof idb;
  }
}
