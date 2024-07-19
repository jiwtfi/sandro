import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'fi', name: 'Finnish' },
  { code: 'da', name: 'Danish' },
  { code: 'ja', name: 'Japanese' },
];

export const priorityLevels = [
  { value: 5, label: 'Very High', icon: KeyboardDoubleArrowUpIcon },
  { value: 4, label: 'High', icon: KeyboardArrowUpIcon },
  { value: 3, label: 'Medium', icon: HorizontalRuleIcon },
  { value: 2, label: 'Low', icon: KeyboardArrowDownIcon },
  { value: 1, label: 'Very Low', icon: KeyboardDoubleArrowDownIcon }
];