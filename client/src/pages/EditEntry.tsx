
import { useParams } from 'react-router-dom';
import EntryEditor from '../components/EntryEditor';
import { useListEntriesQuery } from '../api';
import { ListEntriesResponseBody } from '../types';

const EditEntry = () => {
  const { collectionId, entryId } = useParams() as { collectionId: string; entryId?: string; };
  const { data: { data: entries } } = useListEntriesQuery({ collectionId }) as { data: ListEntriesResponseBody; };
  const entryIndex = entries.findIndex(({ id }) => entryId === id);

  return <EntryEditor entryIndex={entryIndex} key={`entry-editor-${collectionId}-${entryId}`} />;
};

export default EditEntry;