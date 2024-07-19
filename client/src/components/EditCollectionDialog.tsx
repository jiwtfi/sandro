import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from './TextField';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectHasUnsavedChanges, setHasUnsavedChanges } from '../reducers/uiSlice';
import { useTextField } from '../hooks/useTextField';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { LoadingButton } from '@mui/lab';
import { useCreateCollectionMutation, useUpdateCollectionMutation } from '../api';
import { validateTextField } from '../utils';
import { discardUnsavedChangeConfirmationText } from '../utils/messages';
import { ErrorData, FieldError } from '../types/errors';
import { extractFieldError } from '../utils/errorHandlers';
import { Collection, WithId } from '../types';

interface EditCollectionDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  collection?: WithId<Collection>;
}

// ToDo: isPrivate field
const EditCollectionDialog: React.FC<EditCollectionDialogProps> = ({ isOpen, setIsOpen, collection }) => {
  const navigate = useNavigate();
  const [createCollection, { isLoading: isCreateCollectionLoading }] = useCreateCollectionMutation();
  const [updateCollection, { isLoading: isUpdateCollectionLoading }] = useUpdateCollectionMutation();
  const hasUnsavedChanges = useAppSelector(selectHasUnsavedChanges);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);

  const defaultValues = {
    title: collection?.title ?? '',
    description: collection?.description ?? '',
    // isPrivate: collection?.private
  };

  const {
    isValid: isTitleValid,
    isTouched: isTitleTouched,
    fieldProps: title,
    clear: clearTitle,
    isEmpty: isTitleEmpty
  } = useTextField({
    defaultValue: defaultValues.title,
    validator: validateTextField,
    error: extractFieldError(fieldErrors, 'title')
  });
  const {
    isValid: isDescriptionValid,
    isTouched: isDescriptionTouched,
    fieldProps: description,
    clear: clearDescription,
    isEmpty: isDescriptionEmpty
  } = useTextField({
    defaultValue: defaultValues.description,
    error: extractFieldError(fieldErrors, 'description')
  });

  const isValid = isTitleValid && isDescriptionValid;
  const isModified = !collection || ((collection.title !== title.value) || (collection.description !== description.value));

  const clearValues = () => {
    clearTitle();
    clearDescription();
    setError(null);
    setFieldErrors([]);
  };

  useEffect(() => {
    dispatch(setHasUnsavedChanges((isTitleTouched || isDescriptionTouched) && (!isTitleEmpty || !isDescriptionEmpty)));
  }, [isTitleTouched, isDescriptionTouched, isTitleEmpty, isDescriptionEmpty, dispatch]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm(discardUnsavedChangeConfirmationText)) return;
      dispatch(setHasUnsavedChanges(false));
    }
    clearValues();
    setIsOpen(false);
    navigate(collection ? `/collections/${collection.id}/view` : '/collections');
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();
    if (!isValid) return;
    setError(null);
    setFieldErrors([]);

    if (collection) {
      const result = await updateCollection({
        collectionId: collection.id,
        body: {
          ...(isTitleTouched ? { title: title.value } : {}),
          ...(isDescriptionTouched ? { description: description.value } : {}),
        }
      });
      if ('data' in result) {
        navigate(`/collections/${result.data.id}/view`);
        clearValues();
        dispatch(setHasUnsavedChanges(false));
        setIsOpen(false);
      } else {
        if ('data' in result.error) {
          const { message, errors } = result.error.data as ErrorData;
          setError(message);
          if (errors) setFieldErrors(errors);
        }
      }

    } else {
      const result = await createCollection({
        body: {
          title: title.value,
          ...(description.value ? { description: description.value } : {})
        }
      });
      if ('data' in result) {
        navigate(`/collections/${result.data.id}/entries/new`);
        clearValues();
        dispatch(setHasUnsavedChanges(false));
        setIsOpen(false);
      } else {
        if ('data' in result.error) {
          const { message, errors } = result.error.data as ErrorData;
          setError(message);
          if (errors) setFieldErrors(errors);
        }
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
    >
      <DialogTitle>{collection ? 'Edit' : 'New'} Collection</DialogTitle>
      <DialogContent>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            persistentHelperText
            label="Title"
            name="title"
            {...title}
          />
          <TextField
            fullWidth
            persistentHelperText
            multiline
            rows={3}
            label="Description"
            name="description"
            {...description}
          />
          <LoadingButton
            fullWidth
            type="submit"
            variant="contained"
            disabled={!isValid || !isModified}
            loading={isCreateCollectionLoading || isUpdateCollectionLoading}
          >Submit</LoadingButton>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCollectionDialog;