import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from '../components/DeleteDialog';
import { Collection, WithId } from '../types';
import { useDeleteCollectionMutation } from '../api';

interface DeleteCollectionDialogProps {
  collection: WithId<Collection> | null;
  setCollection: React.Dispatch<React.SetStateAction<WithId<Collection> | null>>;
}

const DeleteCollectionDialog: React.FC<DeleteCollectionDialogProps> = ({ collection, setCollection }) => {
  const navigate = useNavigate();
  const [deleteCollection, { isLoading }] = useDeleteCollectionMutation();

  const handleDelete = async () => {
    if (collection) {
      await deleteCollection({ collectionId: collection.id });
      setCollection(null);
      navigate('/home');
    }
  };

  if (!collection) return null;
  return (
    <DeleteDialog
      open
      title="Delete Collection"
      prompt={`Are you sure you would like to delete ${collection.title}?`}
      onDelete={handleDelete}
      onClose={() => setCollection(null)}
      onCancel={() => setCollection(null)}
    />
  );
};

export const useDeleteCollectionDialog = () => {
  const [collection, setCollection] = useState<WithId<Collection> | null>(null);

  return {
    collection, setCollection,
    Dialog: () => <DeleteCollectionDialog collection={collection} setCollection={setCollection} />
  };
};