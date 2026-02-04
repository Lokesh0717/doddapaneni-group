import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import RecordDeveloperPage from '@/components/dashboard/RecordDeveloperPage';
import RecordDashboardVisit from '@/components/dashboard/RecordDashboardVisit';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/dashboard`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <RecordDeveloperPage />
      <RecordDashboardVisit />
      <DashboardHeader user={session.user} locale={locale} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto max-w-[1400px] w-full mx-auto">{children}</main>
    </div>
  );
}
