import React, { Fragment, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import { useAddEntryMutation, useListEntriesQuery, useUpdateEntryMutation } from '../api';
import { AddEntryRequestExampleParams, AddEntryRequestTermParams, Definition, Example } from '../types';
import TextField from '../components/TextField';
import { useTextField } from '../hooks/useTextField';
import { AddButton, CancelButton, DeleteButton, EditButton, SaveButton } from '../components/ActionButtons';
import { parseExampleOccurrences, sliceExampleText, stringifyExampleText } from '../utils/example';
import { languages } from '../config';
import { validateDefinitionText, validateExampleTextStringInput, validateTermText } from '../utils';
import IconButton from '../components/IconButton';
import SelectPriority from './SelectPriority';

interface ExampleTextRowProps {
  example: Pick<Example, 'text' | 'occurrences'>;
  index: number;
  selected: boolean;
  onEdit: React.MouseEventHandler<HTMLButtonElement>;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
}

interface EntryEditorProps {
  entryIndex: number;
}

interface LanguageMenuProps {
  lang: string;
  setLang: React.Dispatch<React.SetStateAction<string>>;
  name: string;
}

const ExampleTextRow: React.FC<ExampleTextRowProps> = ({ example, index, selected, onEdit, onDelete }) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      key={`example-${index}`}
    >
      <Typography sx={{
        flex: 1,
        opacity: selected ? .5 : 1
      }}>
        {sliceExampleText(example).map((text, j) => (
          <span key={`example-${index}-${j}`}>{(j % 2 === 1) ? (
            <span style={{ fontWeight: 'bold' }}>{text}</span>
          ) : text}
          </span>
        ))}
      </Typography>
      <Stack direction="row" spacing={1}>
        <EditButton
          size="small"
          onClick={onEdit}
          disabled={selected}
        />
        <DeleteButton
          size="small"
          onClick={onDelete}
          disabled={selected}
        />
      </Stack>
    </Stack>
  );
};

const LanguageMenu: React.FC<LanguageMenuProps> = ({ lang, setLang, name: fieldName }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isOpen = !!anchorEl;
  const handleClose = () => setAnchorEl(null);

  return (
    <Fragment>
      <IconButton title="Language" onClick={e => setAnchorEl(e.currentTarget)}>
        <Typography
          variant="button"
          textAlign="center"
          sx={{ width: '24px', height: '24px' }}
        >{lang}</Typography>
      </IconButton>
      <Menu
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        {languages.map(({ code, name }) => (
          <MenuItem
            key={`${fieldName}-${code}`}
            value={code}
            onClick={() => { setLang(code); handleClose(); }}
          >{name}</MenuItem>
        ))}
      </Menu>
    </Fragment >
  );
};

const EntryEditor: React.FC<EntryEditorProps> = ({ entryIndex }) => {
  const navigate = useNavigate();
  const { collectionId } = useParams() as { collectionId: string; };
  const { data } = useListEntriesQuery({ collectionId });
  const entries = data!.data;
  const [addEntry, { isLoading: isAddEntryLoading }] = useAddEntryMutation();
  const [updateEntry, { isLoading: isUpdateEntryLoading }] = useUpdateEntryMutation();

  const entry = entryIndex >= 0 ? entries[entryIndex] : undefined;

  const defaultValues = {
    termText: entry?.term.text ?? '',
    definitionText: entry?.definition.text ?? '',
    termLang: entry?.term.lang ?? (entries.length > 0 ? entries[entries.length - 1].term.lang : languages[0].code),
    defLang: entry?.definition.lang ?? (entries.length > 0 ? entries[entries.length - 1].definition.lang : languages[0].code),
    examples: entry?.examples ?? [],
    priority: entry?.priority ?? 3
  };

  const { fieldProps: termText, setValue: setTermText, clear: clearTermText, isValid: isTermTextValid } = useTextField({
    defaultValue: defaultValues.termText,
    validator: validateTermText,
    hideError: true
  });
  const { fieldProps: definitionText, setValue: setDefinitionText, clear: clearDefinitionText, isValid: isDefinitionTextValid } = useTextField({
    defaultValue: defaultValues.definitionText,
    validator: validateDefinitionText,
    hideError: true
  });

  const [termLang, setTermLang] = useState(defaultValues.termLang);
  const [defLang, setDefLang] = useState(defaultValues.defLang);
  const [examples, setExamples] = useState<AddEntryRequestExampleParams[]>(defaultValues.examples);
  const [priority, setPriority] = useState(defaultValues.priority);
  const { fieldProps: exampleDraft, setValue: setExampleDraft } = useTextField({
    validator: validateExampleTextStringInput,
    hideError: true
  });
  const [exampleDraftIndex, setExampleDraftIndex] = useState(-1);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const isTermModified = entry ? (entry.term.text !== termText.value || entry.term.lang !== termLang) : true;
  const isDefinitionModified = entry ? (entry.definition.text !== definitionText.value || entry.definition.lang !== defLang) : true;
  const areExamplesModified = entry ? (
    entry.examples.length !== examples.length || entry.examples.reduce((acc, example, i) => (
      acc || stringifyExampleText(example) !== stringifyExampleText(examples[i]) || example.lang !== termLang
    ), false)
  ) : true;
  const isPriorityModified = entry?.priority !== priority;
  const isEntryModified = isTermModified || isDefinitionModified || areExamplesModified || isPriorityModified;
  const isNew = entryIndex === - 1;
  const areFieldsValid = isTermTextValid && isDefinitionTextValid;

  // imageUrls
  // example.imageUrls

  const clearValues = () => {
    if (defaultValues.termText) setTermText(defaultValues.termText);
    else clearTermText();
    if (defaultValues.definitionText) setDefinitionText(defaultValues.definitionText);
    else clearDefinitionText();
    setTermLang(defaultValues.termLang);
    setDefLang(defaultValues.defLang);
    setExamples(defaultValues.examples);
    clearExampleDraft();
  };


  const getExampleTextDeleteHandler = (index: number): React.MouseEventHandler<HTMLButtonElement> => () => {
    setExamples([
      ...examples.slice(0, index),
      ...examples.slice(index + 1)
    ]);
  };

  const getExampleTextEditHandler = (index: number): React.MouseEventHandler<HTMLButtonElement> => () => {
    setExampleDraftIndex(index);
    setExampleDraft(stringifyExampleText(examples[index]));
  };

  const clearExampleDraft = () => {
    setExampleDraft('');
    setExampleDraftIndex(-1);
  };

  const addExample = () => {
    if (exampleDraft.error) return;
    setExamples([
      ...examples,
      {
        ...parseExampleOccurrences(exampleDraft.value),
        lang: termLang
      }
    ]);
    clearExampleDraft();
  };

  const updateExample = () => {
    if (exampleDraft.error) return;
    const { text, occurrences } = parseExampleOccurrences(exampleDraft.value);
    setExamples([
      ...examples.slice(0, exampleDraftIndex),
      {
        ...examples[exampleDraftIndex],
        audioUrl: text === examples[exampleDraftIndex].text ? examples[exampleDraftIndex].audioUrl : undefined,
        text, occurrences,
        lang: termLang
      },
      ...examples.slice(exampleDraftIndex + 1)
    ]);
    clearExampleDraft();
  };

  const handleSubmit = async () => {
    const term: AddEntryRequestTermParams = { text: termText.value, lang: termLang };
    const definition: Definition = { text: definitionText.value, lang: defLang };
    if (isNew) {
      await addEntry({
        collectionId, body: {
          term,
          definition,
          examples,
          priority
          // imageUrls
        }
      });
      setFeedbackMessage('Entry added');
      clearValues();
    } else {
      await updateEntry({
        collectionId, entryId: entry!.id, body: {
          ...(isTermModified ? { term } : {}),
          ...(isDefinitionModified ? { definition } : {}),
          ...(areExamplesModified ? { examples } : {}),
          ...(isPriorityModified ? { priority } : {}),
          // imageUrls
        }
      });
      setFeedbackMessage('Entry updated');
    }
  };

  return (
    <Stack height="100%">
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={!!feedbackMessage}
        autoHideDuration={5000}
        onClose={() => setFeedbackMessage('')}
        message={feedbackMessage}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          <Typography>{feedbackMessage}</Typography>
        </Alert>
      </Snackbar>
      <form style={{ height: '100%', paddingBottom: '1rem' }}>
        <Stack paddingTop="1rem" spacing={3} flex={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label="Term"
              sx={{ flex: 1 }}
              {...termText}
            />
            <SelectPriority
              priority={priority}
              onChange={setPriority}
            />
            <LanguageMenu
              lang={termLang}
              setLang={setTermLang}
              name="termLang"
            />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label="Definition"
              multiline
              rows={2}
              {...definitionText}
            />
            <LanguageMenu
              lang={defLang}
              setLang={setDefLang}
              name="defLang"
            />
          </Stack>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center">
              <Typography sx={{ fontWeight: 'bold', flex: 1 }}>Examples</Typography>
            </Stack>
            {examples.map((example, i) => (
              <ExampleTextRow
                key={`example-${i}`}
                example={example}
                index={i}
                onEdit={getExampleTextEditHandler(i)}
                onDelete={getExampleTextDeleteHandler(i)}
                selected={i === exampleDraftIndex}
              />
            ))}
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Example"
                onKeyUp={event => {
                  if (event.key === 'Enter' && !validateExampleTextStringInput(exampleDraft.value) && !exampleDraft.error) {
                    if (exampleDraftIndex === -1) addExample();
                    else updateExample();
                  }
                }}
                {...exampleDraft}
                error={false}
              />
              {exampleDraftIndex === -1 ? (
                <AddButton
                  size="small"
                  onClick={addExample}
                  disabled={!!validateExampleTextStringInput(exampleDraft.value) || !!exampleDraft.error}
                />
              ) : <SaveButton
                size="small"
                onClick={updateExample}
              />}
              {exampleDraftIndex !== -1 ? (
                <CancelButton
                  size="small"
                  onClick={clearExampleDraft}
                />
              ) : null}
            </Stack>
          </Stack>
        </Stack>
      </form>
      <Divider />
      <Stack direction="row" paddingTop=".5rem" alignItems="center">
        <IconButton
          disabled={entryIndex === 0}
          onClick={() => navigate(`/collections/${collectionId}/entries/${entries[isNew ? entries.length - 1 : entryIndex - 1].id}/edit`)}
        >
          <ArrowBackIcon />
        </IconButton>
        <Stack direction="row" alignItems="center" spacing={3} flex={1} justifyContent="center">
          <Typography>
            {isNew ? 'new' : entryIndex + 1} / {entries.length}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
            <IconButton
              title="Cancel"
              onClick={() => navigate(`/collections/${collectionId}/view`)}
            >
              <CloseIcon />
            </IconButton>
            {isNew ? (
              <AddButton
                disabled={!areFieldsValid || isAddEntryLoading}
                onClick={handleSubmit}
              />
            ) : (
              <SaveButton
                disabled={!isEntryModified || !areFieldsValid || isUpdateEntryLoading}
                onClick={handleSubmit}
              />
            )}
          </Stack>
        </Stack>
        <IconButton
          disabled={isNew}
          onClick={() => navigate(`/collections/${collectionId}/entries/${entryIndex === entries.length - 1 ? 'new' : `${entries[entryIndex + 1].id}/edit`}`)}
        >
          <ArrowForwardIcon />
        </IconButton>

      </Stack>
    </Stack>
  );
};

export default EntryEditor;