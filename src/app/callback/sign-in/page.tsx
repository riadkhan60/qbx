import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
 // Adjust path as needed

const CompleteSigIn = async () => {
  console.log('sign-in');
  const user = await currentUser();
  
  if (!user) return redirect('/sign-in');
  
  // Sync the user with your database even during sign-in
  // This handles cases where a user might sign up with one provider and later sign in with another
 
  
  return redirect('/dashboard');
};

export default CompleteSigIn;
