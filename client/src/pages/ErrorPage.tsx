import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);
  return (
    <div>
      <h3>Error</h3>
      <p>{(error as Error).message}</p>
    </div>
  );
};

export default ErrorPage;