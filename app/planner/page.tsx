import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import fs from 'fs/promises';
import path from 'path';
import PlannerClient, { PlannerEvent } from './PlannerClient';

type Plan = {
  user: { timezone: string; notify_time: string; name?: string };
  year: number;
  current_week: {
    week_start_local: string; // ISO with offset
    theme: string;
    default_action: string;
    timebox_minutes: number;
    default_time_local: string; // HH:mm
  };
};

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default async function PlannerPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/api/auth/signin');

  const planPath = path.join(process.cwd(), 'state', 'plan.json');
  const raw = await fs.readFile(planPath, 'utf8');
  const plan = JSON.parse(raw) as Plan;

  // Build 7 daily blocks for the current week.
  const weekStart = new Date(plan.current_week.week_start_local);

  const [hh, mm] = plan.current_week.default_time_local.split(':').map(Number);
  const events: PlannerEvent[] = Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(weekStart, i);
    const start = new Date(day);
    start.setHours(hh, mm, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + plan.current_week.timebox_minutes);

    return {
      title: `DEFAULT: ${plan.current_week.default_action} (${plan.current_week.timebox_minutes}m)`,
      start,
      end,
    };
  });

  const todayTitle = `DEFAULT: ${plan.current_week.default_action}`;

  return (
    <PlannerClient
      todayTitle={todayTitle}
      weekTheme={plan.current_week.theme}
      defaultAction={plan.current_week.default_action}
      timeboxMinutes={plan.current_week.timebox_minutes}
      events={events}
    />
  );
}
