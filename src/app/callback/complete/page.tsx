import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { syncUserWithDatabase } from '@/actions/account'; // Adjust path as needed

const CompleteOAuthAfterCallback = async () => {
  console.log('sign-up');
  const user = await currentUser();

  if (!user) redirect('/sign-in');

  // Sync the user with your database
  await syncUserWithDatabase(user);

  return redirect('/dashboard');
};

export default CompleteOAuthAfterCallback;
