import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const CompleteSigIn = async () => {
  console.log('sig-in');
  const user = await currentUser();
  console.log(user);
  if (!user) return redirect('/sign-in');
  return redirect('/');
};

export default CompleteSigIn;
