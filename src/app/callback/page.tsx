import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import DiscoverLoading from './loading';

const CallBackPage = () => {
  return (
    <div>
      <DiscoverLoading />
      <AuthenticateWithRedirectCallback />;
    </div>
  );
};

export default CallBackPage;
