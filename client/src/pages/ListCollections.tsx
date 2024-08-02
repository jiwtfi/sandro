import ButtonBase from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { useListCollectionsQuery } from '../api';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { actionButtonBaseStyles, DeleteButton, FlashcardsButton, GameButton } from '../components/ActionButtons';
import { useDeleteCollectionDialog } from '../hooks/useDeleteCollectionDialog';

const ListCollections = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useListCollectionsQuery();
  const { Dialog: DeleteCollectionDialog, setCollection } = useDeleteCollectionDialog();

  if (isLoading) return <Spinner />;
  if (!data) return null;
  return (
    <Stack paddingY="2rem" height="100%">
      <Grid container>
        {data.map(collection => (
          <Grid item key={collection.id} xs={12} sm={6} md={4} padding="1rem">
            <Card>
              <ButtonBase
                onClick={() => navigate(`/collections/${collection.id}/view`)}
                sx={{ width: '100%' }}
              >
                <CardContent
                  sx={{ width: '100%', height: '100%' }}
                >
                  <Stack alignItems="start" width="100%" height="100%">
                    <Typography>{collection.title}</Typography>
                    <Typography variant="body2">{collection.description}</Typography>
                  </Stack>
                </CardContent>
              </ButtonBase>
              <Divider />
              <CardActions>
                <FlashcardsButton
                  sx={actionButtonBaseStyles}
                  onClick={() => navigate(`/collections/${collection.id}/flashcards`)}
                />
                <GameButton
                  sx={actionButtonBaseStyles}
                  onClick={() => navigate(`/collections/${collection.id}/game`)}
                />
                <DeleteButton
                  sx={actionButtonBaseStyles}
                  onClick={() => {
                    setCollection(collection);
                  }}
                />
              </CardActions>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4} padding="1rem 2rem">
          <ButtonBase
            onClick={() => navigate('/collections/new')}
            sx={theme => ({
              width: '100%', height: '100%', borderRadius: '2rem',
              borderWidth: '1px',
              borderStyle: 'dashed',
              borderColor: theme.palette.divider
            })}
          >
            <Stack alignItems="center" justifyContent="center" spacing={1}>
              <AddIcon sx={{ fontSize: '2.5rem' }} />
              <Typography variant="body2">Create New Collection</Typography>
            </Stack>
          </ButtonBase>
        </Grid>
      </Grid>
      <DeleteCollectionDialog />
    </Stack >
  );
};

export default ListCollections;