import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import DiscoverLoading from './loading';

// Adjust path as needed

const CallBackPage = async () => {

  return (
    <div>
      <DiscoverLoading />
      <AuthenticateWithRedirectCallback  />;
    </div>
  );
};

export default CallBackPage;
