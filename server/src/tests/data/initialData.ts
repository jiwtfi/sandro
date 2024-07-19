import { Collection, Entry, User, WithId } from '../../types';

export const initialUsers: (User & { password: string; })[] = [
  // export const initialUsers: (WithId<User> & { password: string; })[] = [
  {
    // id: 'bmAr5REBnnSz7arQ52XonN2cFat1',
    email: 'user0@test.com',
    password: 'testPassword0',
    username: 'user_0',
    bio: 'I am a test user.',
    imageUrl: 'https://sandro-20240214.web.app/favicon.svg',
  },
  {
    // id: 'OMsztlSROYTzKSWHCTh078OSA8B3',
    email: 'user1@test.com',
    password: 'testPassword1',
    username: 'user_1',
    bio: '',
    imageUrl: ''
  },
  {
    // id: 's8TosND1mQPdJ65Rj9a18vAIw002',
    email: 'user2@test.com',
    password: 'testPassword2',
    username: 'user_2',
    bio: 'I am another test user.',
    imageUrl: ''
  },
];

// export const initialCollections: (Omit<Collection, 'createdBy'> & { entries: Entry[]; })[][] = [
export const initialCollections: (Omit<WithId<Collection>, 'createdBy'> & { entries: WithId<Entry>[]; })[][] = [
  // export const initialCollections: (WithId<NewCollectionParams> & { entries: WithId<Entry>[]; })[] = [
  [
    {
      id: 'zRD4RPeFLPTqQjT8oiVn',
      title: 'Collection 0 (fi-en)',
      description: 'Description 0',
      private: false,
      entries: [
        {
          id: 'FohwNcXs9hqOB9HFYj2s',
          index: 0,
          term: {
            text: 'syvä',
            lang: 'fi',
            audioUrl: 'https://storage.googleapis.com/sandro-20240214.appspot.com/audio%2Fb4E8Op4EC9CtzrBEatj6%2F2MZFCj6ieVUzOJkLuGxy_term.mp3'
          },
          definition: { text: 'deep, profound', lang: 'en' },
          examples: [
            {
              text: 'Oppilaidemme ylpeys koulustaan on hyvin syvällä',
              lang: 'en',
              occurrences: [
                { start: 40, end: 47 }
              ],
              notes: 'Our students\' pride in their school is very deep',
              imageUrls: [],
              audioUrl: 'https://storage.googleapis.com/sandro-20240214.appspot.com/audio%2Fb4E8Op4EC9CtzrBEatj6%2F2MZFCj6ieVUzOJkLuGxy_example_0.mp3'
            },
            {
              text: 'Valituista asiakkaista tehtiin syvempi analyysi',
              lang: 'en',
              occurrences: [
                { start: 31, end: 38 }
              ],
              notes: '',
              imageUrls: [],
              audioUrl: 'https://storage.googleapis.com/sandro-20240214.appspot.com/audio%2Fb4E8Op4EC9CtzrBEatj6%2F2MZFCj6ieVUzOJkLuGxy_example_1.mp3'
            }
          ],
          imageUrls: [],
          priority: 5
        },
        {
          id: 'zK7e2NmjsabUy08H1PYp',
          index: 1,
          term: {
            text: 'patsas',
            lang: 'fi',
            audioUrl: 'https://storage.googleapis.com/sandro-20240214.appspot.com/audio%2FVYOVyikKYJqVdfr3AKlm%2FtL1QL0wCXWb6Mnja5dRR_term.mp3'
          },
          definition: { text: 'statue', lang: 'en' },
          examples: [
            {
              text: 'Patsaan pinta on nyt ruskea, kun se aikaisemmin oli vihreä',
              lang: 'fi',
              occurrences: [
                { start: 0, end: 7 }
              ],
              notes: 'The surface of the statue is now brown, while it used to be green',
              imageUrls: [],
              audioUrl: 'https://storage.googleapis.com/sandro-20240214.appspot.com/audio%2FVYOVyikKYJqVdfr3AKlm%2FtL1QL0wCXWb6Mnja5dRR_example_0.mp3'
            }
          ],
          imageUrls: [],
          priority: 3
        },
        {
          id: '2WQ3EgPH3Qfl2RiIpz8m',
          index: 2,
          term: {
            text: 'häikäistä',
            lang: 'fi',
            audioUrl: 'https://storage.googleapis.com/sandro-20240214.appspot.com/audio%2Fb4E8Op4EC9CtzrBEatj6%2F6lTPSZnw6nseibVCKGJ5_term.mp3'
          },
          definition: { text: 'to blind, to dazzle', lang: 'en' },
          examples: [
            {
              text: 'Auringonvalo häikäisi hänen silmiään',
              lang: 'fi',
              occurrences: [
                { start: 13, end: 21 }
              ],
              notes: 'The sunlight dazzled her eyes',
              imageUrls: [],
              audioUrl: 'https://storage.googleapis.com/sandro-20240214.appspot.com/audio%2Fb4E8Op4EC9CtzrBEatj6%2F6lTPSZnw6nseibVCKGJ5_example_0.mp3'
            }
          ],
          imageUrls: [],
          priority: 4
        }
      ]
    },
    {
      id: 'jAKozQW8KE9AehkrkCOx',
      title: 'Collection 1 (en-en, private)',
      description: 'Description 1',
      private: true,
      entries: [

      ]
    },
    {
      id: 'CnJsu48Mky9HrjrgGXfs',
      title: 'Collection 2 (da-en)',
      description: 'Description 2',
      private: false,
      entries: [

      ]
    }
  ],
  [
    {
      id: 'Woi90iDEQO9OJxSc0D2X',
      title: 'Collection 3 (jp-en)',
      description: 'Description 3',
      private: false,
      entries: [
        // {
        //   index: 0,
        //   term: { text: '', lang: '' },
        //   definition: { text: '', lang: '' },
        //   examples: [
        //     { text: '', lang: '', occurrences: [], notes: '', imageUrls: [] },
        //   ],
        //   imageUrls: [],
        //   priority: 3
        // }
      ]
    }
  ],
  []
];

export const initialUserCount = initialUsers.length;
export const initialCollectionsCount = initialCollections.reduce((acc, collections) => (
  acc + collections.length
), 0);
// export const initialCollectionsCount = initialCollections.length;