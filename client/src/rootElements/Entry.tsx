import { Fragment } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useRetrieveEntryQuery } from '../api';

const Entry = () => {
  // const { collectionId, entryId } = useParams();
  // if (!collectionId || !entryId) throw new Error();
  // useRetrieveEntryQuery({ collectionId, entryId });

  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
};

export default Entry;