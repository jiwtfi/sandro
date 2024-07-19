import { Fragment, useState } from 'react';
import EditCollectionDialog from '../components/EditCollectionDialog';

const NewCollection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  return (
    <Fragment>
      <EditCollectionDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </Fragment>
  );
};

export default NewCollection;