import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { syncUserWithDatabase } from '@/actions/account';

const SyncUserPage = async () => {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  // Sync user regardless of sign-in/sign-up flow
  await syncUserWithDatabase(user);

  // Redirect based on your app logic
  return redirect(user?.username ? '/dashboard' : '/');
};

export default SyncUserPage;
