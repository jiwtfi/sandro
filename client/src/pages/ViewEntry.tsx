import { Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ListIcon from '@mui/icons-material/List';
import { useListEntriesQuery } from '../api';
import PaginationControl from '../components/PaginationControl';
import { ListEntriesResponseBody } from '../types';
import SelectPriority from '../components/SelectPriority';
import { usePriorityChangeHandler } from '../utils/priority';
import ExampleText from '../components/ExampleText';
import { EditButton } from '../components/ActionButtons';
import IconButton from '../components/IconButton';

const ViewEntry = () => {
  const navigate = useNavigate();
  const { collectionId, entryId } = useParams() as { collectionId: string; entryId: string; };
  const { data: { data: entries } } = useListEntriesQuery({ collectionId }) as { data: ListEntriesResponseBody; };
  const entryIndex = entries.findIndex(({ id }) => entryId === id);

  // ToDo: ERROR
  const entry = entries[entryIndex];
  const { term, definition, examples, priority } = entry;
  const handlePriorityChange = usePriorityChangeHandler(collectionId, entry);

  return (
    <Stack height="100%">
      <Stack direction="row" paddingTop="1rem" width="100%" spacing={1}>
        <Stack flex={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Priority</Typography>
            <SelectPriority priority={priority} onChange={handlePriorityChange} />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h5" sx={{ overflowWrap: 'anywhere' }}>{term.text}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ overflowWrap: 'anywhere' }}>{definition.text}</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack flex={1} paddingBottom="1rem">
        <Stack paddingTop="1rem" spacing={3} flex={1}>
          <Stack direction="row" spacing={1} alignItems="center">
          </Stack>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center">
              <Typography sx={{ fontWeight: 'bold', flex: 1 }}>Examples</Typography>
            </Stack>
            {examples.map((example, i) => (
              <ExampleText example={example} key={`example-${i}`} />
            ))}
          </Stack>

        </Stack>
      </Stack>
      <Divider />
      <PaginationControl
        currentIndex={entryIndex + 1}
        totalCount={entries.length}
        onBack={entryIndex !== 0 ? () => navigate(`/collections/${collectionId}/entries/${entries[entryIndex - 1].id}/view`) : undefined}
        onForward={entryIndex < entries.length ? () => navigate(`/collections/${collectionId}/entries/${`${entries[entryIndex + 1].id}/view`}`) : undefined}
        actions={(
          <Fragment>
            <EditButton
              onClick={() => navigate(`/collections/${collectionId}/entries/${entry.id}/edit`)}
            />
            <IconButton
              title="Back to Entry List"
              onClick={() => navigate(`/collections/${collectionId}/view`)}
            >
              <ListIcon />
            </IconButton>

          </Fragment>
        )}
      />
    </Stack>
  );
};

export default ViewEntry;