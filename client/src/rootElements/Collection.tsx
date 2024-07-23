import { Outlet, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useListEntriesQuery, useRetrieveCollectionQuery } from '../api';
import Spinner from '../components/Spinner';
import CollectionHeader from '../components/CollectionHeader';

const Collection = () => {
  const { collectionId } = useParams();
  if (!collectionId) throw new Error();
  const {
    isLoading: isRetrieveCollectionLoading,
    // error: retrieveCollectionError
  } = useRetrieveCollectionQuery({ collectionId });
  const {
    isLoading: isListEntriesLoading,
    // error: listEntriesError
  } = useListEntriesQuery({ collectionId });


  // ToDo: Error
  // if (error) {
  //   if ('data' in error) {

  //   }
  //   return <div>error</div>;
  // }

  if (isRetrieveCollectionLoading || isListEntriesLoading) return <Spinner />;
  return (
    <Stack height="100%">
      <Box display="flex" padding="2rem 0 1rem 0">
        <CollectionHeader />
      </Box>
      <Divider />
      <Box flex={1}>
        <Outlet />
      </Box>
    </Stack>
  );
};

export default Collection;