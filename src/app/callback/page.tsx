import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import DiscoverLoading from './loading';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { syncUserWithDatabase } from '@/actions/account';
// Adjust path as needed

const CallBackPage = async () => {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  console.log('chodna');
  console.log(user);
  await syncUserWithDatabase(user);

  return (
    <div>
      <DiscoverLoading />
      <AuthenticateWithRedirectCallback />;
    </div>
  );
};

export default CallBackPage;
