import { Fragment } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMatches, useNavigate, useParams } from 'react-router-dom';
import { RetrieveCollectionResponseBody } from '../types';
import { useRetrieveCollectionQuery } from '../api';
import { actionButtonBaseStyles, DeleteButton, EditButton } from './ActionButtons';
import ActionButtonsContainer from './ActionButtonsContainer';
import { useDeleteCollectionDialog } from '../hooks/useDeleteCollectionDialog';

// Edit
const CollectionHeader = () => {
  const { collectionId } = useParams() as { collectionId: string; };
  const matches = useMatches();
  const navigate = useNavigate();
  const { data: collection } = useRetrieveCollectionQuery({ collectionId }) as { data: RetrieveCollectionResponseBody };
  const { Dialog: DeleteCollectionDialog, setCollection: setCollectionToBeDeleted } = useDeleteCollectionDialog();

  const isViewCollection = matches[matches.findIndex(({ pathname }) => pathname === '/collections') + 2]?.pathname.endsWith('/view');

  return (
    <Stack direction="row" width="100%" alignItems="center">
      {isViewCollection ? (
        <Fragment>
          <Stack flex={1}>
            <Typography variant="h5">{collection.title}</Typography>
            <Typography variant="body2">{collection.description}</Typography>
          </Stack>
          <ActionButtonsContainer>
            <EditButton
              title="Edit Collection"
              sx={actionButtonBaseStyles}
              onClick={() => navigate(`/collections/${collectionId}/edit`)}
            />
            <DeleteButton
              title="Delete Collection"
              sx={actionButtonBaseStyles}
              onClick={() => setCollectionToBeDeleted(collection)}
            />
          </ActionButtonsContainer>
          <DeleteCollectionDialog />
        </Fragment>
      ) : (
        <Typography variant="h6">{collection.title}</Typography>
      )}

    </Stack>
  );
};

export default CollectionHeader;