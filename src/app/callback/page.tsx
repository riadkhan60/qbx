import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import DiscoverLoading from './loading';
import { currentUser } from '@clerk/nextjs/server';

const  CallBackPage = async () => {
  const user = await currentUser();
  console.log(user);
  return (
    <div>
      <DiscoverLoading />
      <AuthenticateWithRedirectCallback />;
    </div>
  );
};

export default CallBackPage;
