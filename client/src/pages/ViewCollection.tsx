import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';
import EntryList from '../components/EntryList';
import ActionButtonsContainer from '../components/ActionButtonsContainer';
import { actionButtonBaseStyles, AddButton, FlashcardsButton, GameButton, SearchButton } from '../components/ActionButtons';
import SearchField from '../components/SearchField';

const ViewCollection = () => {
  const navigate = useNavigate();
  const { collectionId } = useParams();
  const [searchKeyword, setSearchKeyword] = useState('');
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const [isSearchFieldOpen, setIsSearchFieldOpen] = useState(isMd);
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (isSearchFieldOpen && !isMd) inputRef.current?.focus();
  }, [isSearchFieldOpen, isMd]);

  return (
    <Stack height="100%">
      <Stack direction="row" width="100%" paddingY=".5rem" alignItems="center" spacing={3}>
        <Typography sx={theme => ({
          color: theme.palette.text.secondary,
          fontWeight: 'bold'
        })}>Entries</Typography>
        {isSearchFieldOpen ? (
          <Stack paddingY="4px">
            <SearchField
              inputRef={inputRef}
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              onBlur={() => { if (!isMd) setIsSearchFieldOpen(false); }}
            />
          </Stack>
        ) : null}
        <Box flex={1} />
        {(!isSearchFieldOpen || isMd) ?
          (
            <ActionButtonsContainer>
              {!isSearchFieldOpen ? <SearchButton
                onClick={() => {
                  setIsSearchFieldOpen(true);
                }}
                sx={{
                  ...actionButtonBaseStyles,
                  ...(searchKeyword.length > 0 ? { opacity: '100%' } : {})
                }}
              /> : null}
              <FlashcardsButton
                onClick={() => navigate(`/collections/${collectionId}/flashcards`)}
                sx={actionButtonBaseStyles}
              />
              <GameButton
                onClick={() => navigate(`/collections/${collectionId}/game`)}
                sx={actionButtonBaseStyles}
              />
              <AddButton
                onClick={() => navigate(`/collections/${collectionId}/entries/new`)}
                sx={actionButtonBaseStyles}
              />

            </ActionButtonsContainer>
          )
          : null}
      </Stack>
      <Box flex={1} paddingBottom="1rem">
        <EntryList searchKeyword={searchKeyword} />
      </Box>
    </Stack>
  );
};

export default ViewCollection;