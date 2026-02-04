import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { connectDb, User, LoginLog, DeveloperPageView } from '@/lib/db';
import type { Role } from '@/lib/constants';
import { getRoleOrder } from '@/lib/constants';
import EmployeesPageView from '../../../../components/dashboard/EmployeesPageView';

type EmployeeSession = {
  logId: string;
  loggedAt: string;
  loggedOutAt: string | null;
  timeOnlineMinutes: number;
  pageViews: { path: string; visitedAt: string }[];
};

type EmployeeWithStats = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  sessions: EmployeeSession[];
  isActive: boolean;
};

export default async function EmployeesPage() {
  const session = await auth();
  const locale = await getLocale();

  const role = session?.user?.role;
  if (!session?.user || (role !== 'SUPER_ADMIN' && role !== 'ADMIN')) {
    redirect(`/${locale}/dashboard`);
  }

  const employeeRoles: Role[] = role === 'SUPER_ADMIN' ? ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'DIGITAL_MARKETER'] : ['DEVELOPER', 'DIGITAL_MARKETER'];

  await connectDb();

  const userDocs = await User.find({ role: { $in: employeeRoles } }).sort({ name: 1, email: 1 }).lean();
  const userIds = userDocs.map((u: { _id: unknown }) => u._id);

  const loginLogDocs = await LoginLog.find({ userId: { $in: userIds } })
    .sort({ loggedAt: -1 })
    .limit(200)
    .lean();

  const developerLogIds = (loginLogDocs as { _id: unknown; userId: unknown }[])
    .map((l) => l._id);
  const pageViews = developerLogIds.length > 0
    ? await DeveloperPageView.find({ loginLogId: { $in: developerLogIds } }).sort({ visitedAt: 1 }).lean()
    : [];

  const pageViewsByLogId = (pageViews as { loginLogId: unknown; path: string; visitedAt: Date }[]).reduce(
    (acc, pv) => {
      const id = String(pv.loginLogId);
      if (!acc[id]) acc[id] = [];
      acc[id].push({ path: pv.path, visitedAt: pv.visitedAt.toISOString() });
      return acc;
    },
    {} as Record<string, { path: string; visitedAt: string }[]>
  );

  const logsByUserId = (loginLogDocs as { _id: unknown; userId: unknown; loggedAt: Date; loggedOutAt?: Date | null }[]).reduce(
    (acc, log) => {
      const uid = String(log.userId);
      if (!acc[uid]) acc[uid] = [];
      const end = log.loggedOutAt ? new Date(log.loggedOutAt).getTime() : Date.now();
      const start = new Date(log.loggedAt).getTime();
      const timeOnlineMinutes = Math.round((end - start) / 60000);
      acc[uid].push({
        logId: String(log._id),
        loggedAt: log.loggedAt.toISOString(),
        loggedOutAt: log.loggedOutAt ? log.loggedOutAt.toISOString() : null,
        timeOnlineMinutes,
        pageViews: pageViewsByLogId[String(log._id)] ?? [],
      });
      return acc;
    },
    {} as Record<string, EmployeeSession[]>
  );

  /** Only consider a user "active" if they have an open session that started recently (e.g. within last hour). Stale open sessions (never logged out) are treated as inactive. */
  const ACTIVE_SESSION_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour
  const now = Date.now();
  const employees: EmployeeWithStats[] = userDocs
    .map((u: { _id: unknown; email: string; name: string | null; role: string }) => {
      const sessions = logsByUserId[String(u._id)] ?? [];
      const isActive = sessions.some(
        (s) =>
          s.loggedOutAt === null &&
          now - new Date(s.loggedAt).getTime() < ACTIVE_SESSION_MAX_AGE_MS
      );
      return {
        id: String(u._id),
        email: u.email,
        name: u.name ?? null,
        role: u.role as Role,
        sessions,
        isActive,
      };
    })
    .sort((a, b) => getRoleOrder(a.role) - getRoleOrder(b.role) || (a.name || a.email).localeCompare(b.name || b.email));

  const dashboardHref = role === 'SUPER_ADMIN' ? `/${locale}/dashboard/super-admin` : `/${locale}/dashboard/admin`;

  return (
    <EmployeesPageView
      employees={employees}
      locale={locale}
      dashboardHref={dashboardHref}
    />
  );
}
