import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import { useListEntriesQuery } from '../api';
import EntryListItem from './EntryListItem';
import { Entry, ListEntriesResponseBody, WithId } from '../types';

interface EntryListProps {
  searchKeyword: string;
}

const EntryList: React.FC<EntryListProps> = ({ searchKeyword }) => {
  const { collectionId } = useParams() as { collectionId: string; };
  const { data } = useListEntriesQuery({ collectionId }) as { data: ListEntriesResponseBody; };
  const entries = data.data;
  const filteredEntries = useMemo(() => {
    const keywordLowerCase = searchKeyword.toLowerCase();
    const matchedEntries: [WithId<Entry>[], WithId<Entry>[], WithId<Entry>[]] = [[], [], []];
    entries.forEach(entry => {
      if (entry.term.text.toLowerCase().includes(keywordLowerCase)) matchedEntries[0].push(entry);
      else if (entry.definition.text.toLowerCase().includes(keywordLowerCase)) matchedEntries[1].push(entry);
      else if (entry.examples.find(example => (example.text.toLowerCase().includes(keywordLowerCase)))) matchedEntries[2].push(entry);
    });
    return matchedEntries.flat();
  }, [searchKeyword, entries]);

  return (
    <Stack width="100%" height="100%" alignItems="center">
      <Box
        flex={1}
        width="100%"
        sx={theme => ({
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        })}
      >
        <List sx={{ padding: 0 }}>
          {filteredEntries.map((entry, i) => (
            <EntryListItem
              key={entry.id}
              entry={entry}
            />
          ))}
        </List>
      </Box>
    </Stack>
  );
};

export default EntryList;