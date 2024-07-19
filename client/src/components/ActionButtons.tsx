import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import StyleIcon from '@mui/icons-material/Style';
import TranslateIcon from '@mui/icons-material/Translate';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import IconButton, { IconButtonProps } from './IconButton';
import { Optional } from '../types';

interface ActionButtonProps extends Optional<IconButtonProps, 'title'> { }

export const actionButtonBaseStyles = { opacity: '50%', ':hover': { opacity: '100%' } };

export const AddButton: React.FC<ActionButtonProps> = props => (
  <IconButton title="Add" {...props}>
    <AddIcon />
  </IconButton>
);

export const AudioButton: React.FC<ActionButtonProps> = props => (
  <IconButton title="Audio" {...props}>
    <VolumeUpIcon />
  </IconButton>
);

export const CancelButton: React.FC<ActionButtonProps> = props => (
  <IconButton title="Cancel" {...props}>
    <CancelIcon />
  </IconButton>
);

export const DeleteButton: React.FC<ActionButtonProps> = props => (
  <IconButton title="Delete" {...props}>
    <DeleteIcon />
  </IconButton>
);

export const EditButton: React.FC<ActionButtonProps> = props => (
  <IconButton title="Edit" {...props}>
    <ModeEditIcon />
  </IconButton>
);

export const SaveButton: React.FC<ActionButtonProps> = props => (
  <IconButton title="Save" {...props}>
    <CheckIcon />
  </IconButton>
);

export const SearchButton: React.FC<ActionButtonProps> = props => (
  <IconButton title="Save" {...props}>
    <SearchIcon />
  </IconButton>
);

export const FlashcardsButton: React.FC<ActionButtonProps> = props => (
  <IconButton title="Flashcards" {...props}>
    <StyleIcon />
  </IconButton>
);

export const GameButton: React.FC<ActionButtonProps> = props => (
  <IconButton title="Game" {...props}>
    <SportsEsportsIcon />
  </IconButton>
);

export const LanguageButton: React.FC<ActionButtonProps> = props => (
  <IconButton title="Language" {...props}>
    <TranslateIcon />
  </IconButton>
);

export const MuteButton: React.FC<ActionButtonProps> = props => (
  <IconButton title="Mute" {...props}>
    <VolumeOffIcon />
  </IconButton>
);

export const PreferencesButton: React.FC<ActionButtonProps> = props => (
  <IconButton title="Preferences" {...props}>
    <SettingsIcon />
  </IconButton>
);