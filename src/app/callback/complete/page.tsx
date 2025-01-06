import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const CompleteOAuthAfterCallback = async () => {
  const user = await currentUser();
  if (!user) redirect('/sign-in');
  return redirect('/dashboard');
};

export default CompleteOAuthAfterCallback;
