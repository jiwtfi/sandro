import { createBrowserRouter } from 'react-router-dom';
import Root from './rootElements/Root';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Collection from './rootElements/Collection';
import NewCollection from './pages/NewCollection';
import EditCollection from './pages/EditCollection';
import ViewCollection from './pages/ViewCollection';
import ListCollections from './pages/ListCollections';
import EditEntry from './pages/EditEntry';
import Game from './pages/Game';
import Flashcards from './pages/Flashcards';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      {
        path: 'collections',
        children: [
          { path: 'new', element: <NewCollection /> },
          {
            path: ':collectionId',
            element: <Collection />,
            children: [
              { path: 'edit', element: <EditCollection /> },
              { path: 'view', element: <ViewCollection /> },
              {
                path: 'entries',
                children: [
                  { path: 'new', element: <EditEntry /> },
                  {
                    path: ':entryId',
                    children: [
                      { path: 'edit', element: <EditEntry /> }
                    ]
                  }
                ]
              },
              { path: 'game', element: <Game /> },
              { path: 'flashcards', element: <Flashcards /> }
            ]
          },
          {
            index: true,
            element: <ListCollections />
          }
        ]
      },
    ]
  },
]);