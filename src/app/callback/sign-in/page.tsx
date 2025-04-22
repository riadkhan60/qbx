import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
 // Adjust path as needed

const CompleteSigIn = async () => {
  console.log('sign-in');
  const user = await currentUser();
  
  if (!user) return redirect('/sign-in');
  
 
  
  return redirect('/dashboard');
};

export default CompleteSigIn;
