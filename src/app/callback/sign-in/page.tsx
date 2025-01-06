import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const CompleteSigIn = async () => {
  const user = await currentUser();
  if (!user) return redirect('/sign-in');
  return redirect('/');
};

export default CompleteSigIn;
