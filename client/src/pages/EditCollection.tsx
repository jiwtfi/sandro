import { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditCollectionDialog from '../components/EditCollectionDialog';
import { useRetrieveCollectionQuery } from '../api';
import { RetrieveCollectionResponseBody } from '../types';

const EditCollection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const { collectionId } = useParams() as { collectionId: string; };
  const { data: collection } = useRetrieveCollectionQuery({ collectionId }) as { data: RetrieveCollectionResponseBody };


  return (
    <Fragment>
      <EditCollectionDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} collection={collection} />
    </Fragment>
  );
};

export default EditCollection;