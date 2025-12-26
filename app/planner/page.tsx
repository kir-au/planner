import PlannerClient from './PlannerClient';
import plan from '../../state/plan.json';

function parseEvents(dailyTasks: { date: string; title: string; action: string; durationMinutes: number }[]) {
  const events: { title: string; start: Date; end: Date }[] = [];
  for (const task of dailyTasks || []) {
    events.push({
      title: task.title,
      start: new Date(task.date),
      end: new Date(task.date),
    });
  }
  return events;
}

export default function PlannerPage() {
  const todayTitle = plan.goals.weekly?.title || "";
  const weekTheme = plan.goals.weekly?.title || "";
  const defaultAction = plan.goals.weekly?.defaultAction || "";
  const timeboxMinutes = 30; // Default value
  const events = parseEvents(plan.goals.daily);
  const goals = {
    yearly: plan.goals.yearly || [],
    monthly: plan.goals.monthly?.title || "",
    weekly: plan.goals.weekly?.title || "",
    daily: plan.goals.daily || [],
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
