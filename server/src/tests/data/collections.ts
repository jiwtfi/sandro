import { AddEntryRequestBody, CreateCollectionRequestBody } from '../../types';

export const testCollections: CreateCollectionRequestBody[] = [
  {
    title: 'Test Collection 0 (fi-en)',
    description: 'Test description 0',
    private: false,
  },
  {
    title: 'Test Collection 1 (en-en)',
    description: 'Test description 1',
    private: true,
  },
  {
    title: 'Test Collection 2 (da-en)',
    private: false,
  },
  {
    title: 'Test Collection 3 (jp-en)',
    description: 'Test description 3',
    private: false,
  },
  // {
  //   title: '', description: '', private: false,
  // }
];

export const testCollectionWithEmptyTitle = {
  description: 'Test description'
};

