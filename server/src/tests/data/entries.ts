import { AddEntryRequestBody } from '../../types';

export const testEntries: AddEntryRequestBody[][][] = [
  [
    [
      {
        term: { text: 'lempeys', lang: 'fi' },
        definition: { text: 'gentleness, mildness, tenderness', lang: 'en' },
        examples: [
          {
            text: 'Lempeys leviää kuin metsäpalo',
            lang: 'fi',
            occurrences: [{ start: 0, end: 7 }],
            notes: 'Kindness spreads like wildfire'
          }
        ],
        priority: 3
      },
      {
        term: { text: 'syöttö', lang: 'fi' },
        definition: { text: 'feeding, pass, serve, input', lang: 'en' },
        examples: [
          {
            text: 'Jalkapallo-ottelussa hänen tarkka syöttönsä johti maaliin',
            lang: 'fi',
            occurrences: [{ start: 34, end: 43 }]
          }
        ],
        priority: 2
      }
    ],
    // [],
    // []
  ],
  // [[]],
  // []
];

export const testEntryWithEmptyTermText: AddEntryRequestBody = {
  ...testEntries[0][0][0],
  term: {
    ...testEntries[0][0][0].term, text: ''
  }
};

export const testEntryWithEmptyTermLanguage: AddEntryRequestBody = {
  ...testEntries[0][0][0],
  term: {
    ...testEntries[0][0][0].term, lang: ''
  }
};

export const testEntryWithEmptyDefinitionText: AddEntryRequestBody = {
  ...testEntries[0][0][0],
  definition: {
    ...testEntries[0][0][0].definition, text: ''
  }
};

export const testEntryWithEmptyExampleText: AddEntryRequestBody = {
  ...testEntries[0][0][0],
  examples: [
    { text: '', lang: 'fi', occurrences: [] }
  ]
};

export const testEntryWithInvalidPriority: AddEntryRequestBody = {
  ...testEntries[0][0][0],
  priority: -5
};
