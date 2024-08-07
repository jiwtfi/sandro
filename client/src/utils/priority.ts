import { useUpdateEntryMutation } from '../api';
import { Entry, WithId } from '../types';

export const usePriorityChangeHandler = (collectionId: string, entry: WithId<Entry>) => {
  const [updateEntry] = useUpdateEntryMutation();

  const handlePriorityChange = async (value: number) => {
    if (value === entry.priority) return;
    await updateEntry({
      collectionId, entryId: entry.id,
      body: { priority: value }
    });
  };
  return handlePriorityChange;
};