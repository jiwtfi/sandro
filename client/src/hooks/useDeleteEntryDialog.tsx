import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from '../components/DeleteDialog';
import { Entry, WithId } from '../types';
import { useDeleteEntryMutation } from '../api';

interface DeleteEntryDialogProps {
  collectionId: string;
  entry: WithId<Entry> | null;
  setEntry: React.Dispatch<React.SetStateAction<WithId<Entry> | null>>;
}

const DeleteEntryDialog: React.FC<DeleteEntryDialogProps> = ({ collectionId, entry, setEntry }) => {
  const navigate = useNavigate();
  const [deleteEntry] = useDeleteEntryMutation();

  const handleDelete = async () => {
    if (entry) {
      await deleteEntry({ collectionId, entryId: entry.id });
      setEntry(null);
      navigate(`/collections/${collectionId}/view`);
    }
  };

  if (!entry) return null;
  return (
    <DeleteDialog
      open
      title="Delete Entry"
      prompt={`Are you sure you would like to delete ${entry.term.text}?`}
      onDelete={handleDelete}
      onClose={() => setEntry(null)}
      onCancel={() => setEntry(null)}
    />
  );
};

export const useDeleteEntryDialog = ({ collectionId }: { collectionId: string; }) => {
  const [entry, setEntry] = useState<WithId<Entry> | null>(null);

  return {
    entry, setEntry,
    Dialog: () => <DeleteEntryDialog collectionId={collectionId} entry={entry} setEntry={setEntry} />
  };
};