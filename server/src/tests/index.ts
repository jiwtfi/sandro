import './setup';
import { run } from 'node:test';
import { tap } from 'node:test/reporters';
import path from 'node:path';

const testFiles = {
  routes: {
    users: {
      root: [
        'createUser',
        'retrieveCurrentUser',
        'listUsers'
      ]
    },
    collections: {
      root: [
        'createCollection',
        'retrieveCollection',
        'deleteCollection',
        'listCollections',
        'updateCollection'
      ],
      entries: [
        'addEntry',
        'deleteEntry',

        // 'retrieveEntry',
        // 'updateEntry'
        // 'listEntries',
      ]
    },
  }
};

const renderFilePaths = (obj: object, prefix = ''): string[] => (
  Array.isArray(obj) ? obj.map(file => `${prefix}/${file}`) : Object.entries(obj).reduce<string[]>((acc, [key, value]) => ([
    ...acc,
    ...renderFilePaths(value, `${prefix}${key === 'root' ? '' : `/${key}`}`)
  ]), [])
);

run({
  files: renderFilePaths(testFiles).map(fp => path.resolve(`./src/tests${fp}.test.ts`)),
  concurrency: false
}).compose(tap).pipe(process.stdout);