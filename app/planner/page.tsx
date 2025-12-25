import PlannerClient from './PlannerClient';
import plan from '../../state/plan.json';

function parseEvents(dailyTasks: Record<string, string[]>) {
  const events: { title: string; start: Date; end: Date }[] = [];
  for (const [date, tasks] of Object.entries(dailyTasks || {})) {
    tasks.forEach((task: string) => {
      events.push({
        title: task,
        start: new Date(date),
        end: new Date(date),
      });
    });
  }
  return events;
}

export default function PlannerPage() {
  const todayTitle = plan.current_week?.theme || "";
  const weekTheme = plan.current_week?.theme || "";
  const defaultAction = plan.current_week?.default_action || "";
  const timeboxMinutes = plan.current_week?.timebox_minutes || 30;
  const events = parseEvents(plan.daily_tasks);
  const goals = {
    yearly: plan.yearly_goals?.map((goal) => goal.goal) || [],
    monthly: plan.monthly_goals?.["2026-01"] || "",
    weekly: plan.weekly_goals?.["2026-W01"] || "",
    daily: plan.daily_tasks?.["2026-01-05"] || [],
  };

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <PlannerClient
        todayTitle={todayTitle}
        weekTheme={weekTheme}
        defaultAction={defaultAction}
        timeboxMinutes={timeboxMinutes}
        events={events}
        goals={goals}
      />
    </main>
  );
}
