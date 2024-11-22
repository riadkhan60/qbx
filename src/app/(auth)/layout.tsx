import AuthBackgroud from '@/components/Authentication/AuthBackgroud/AuthBackgroud';

export default function layout({ children }: { children: React.ReactNode }) {
  return <AuthBackgroud>{children}</AuthBackgroud>;
}
