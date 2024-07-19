import { Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';
import { Entry, WithId } from '../types';
import { actionButtonBaseStyles, DeleteButton, EditButton } from './ActionButtons';
import { sliceExampleText } from '../utils/exampleText';
import SelectPriority from './SelectPriority';
import { useListEntriesQuery, useUpdateEntryMutation } from '../api';
import ActionButtonsContainer from './ActionButtonsContainer';
import { useDeleteEntryDialog } from '../hooks/useDeleteEntryDialog';

interface EntryListItemProps {
  entry: WithId<Entry>;
}

const EntryListItem: React.FC<EntryListItemProps> = ({ entry }) => {
  const navigate = useNavigate();
  const { collectionId } = useParams() as { collectionId: string; };
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const [updateEntry, { isError: isUpdateEntryError }] = useUpdateEntryMutation();
  const { Dialog: DeleteEntryDialog, setEntry: setEntryToBeDeleted } = useDeleteEntryDialog({ collectionId });

  const handlePriorityChange = async (value: number) => {
    if (value === entry.priority) return;
    await updateEntry({
      collectionId, entryId: entry.id,
      body: { priority: value }
    });
  };

  return (
    <ListItem divider>
      <Stack
        direction="row"
        width="100%"
        alignItems="center"
        spacing={1}>
        <Grid container >
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                flex: 1,
              }}>{entry.term.text}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack flex={2}>
              <Typography sx={{ fontSize: { xs: '95%', md: '100%' } }}>{entry.definition.text}</Typography>
              <Typography variant="body2"              >
                {entry.examples?.map((example, i) => (
                  sliceExampleText(example).map((text, j) => (
                    <Fragment key={`${entry.id}-example-${i}-${j}`}>{(j % 2 === 1) ? (
                      <span style={{ fontWeight: 'bold' }}>{text}</span>
                    ) : text}</Fragment>
                  ))
                ))}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <ActionButtonsContainer direction={isMd ? 'row' : 'column'}>
          <SelectPriority
            priority={entry.priority}
            onChange={value => handlePriorityChange(value)}
            iconButtonProps={{ size: 'small', sx: actionButtonBaseStyles }}
          />
          <EditButton
            size="small"
            sx={actionButtonBaseStyles}
            onClick={() => navigate(`../entries/${entry.id}/edit`)}
          />
          <DeleteButton
            size="small"
            sx={actionButtonBaseStyles}
            onClick={() => setEntryToBeDeleted(entry)}
          />
        </ActionButtonsContainer>
      </Stack>
      <DeleteEntryDialog />
    </ListItem>
  );
};

export default EntryListItem;