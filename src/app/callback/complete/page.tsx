import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const CompleteOAuthAfterCallback = async () => {
  console.log('sig-up');
  const user = await currentUser();
  console.log(user);
  if (!user) redirect('/sign-in');
  return redirect('/dashboard');
};

export default CompleteOAuthAfterCallback;
