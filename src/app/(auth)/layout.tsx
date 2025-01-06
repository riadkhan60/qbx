import AuthBackgroud from '@/components/Authentication/AuthBackgroud/AuthBackgroud';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user) {
    // Explicitly redirect to home page if user is logged in
    redirect('/');
    
  }
  return <AuthBackgroud>{children}</AuthBackgroud>;
}
