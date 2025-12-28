'use client';

import { useMemo, useState } from 'react';
import PlannerClient from './PlannerClient';
import plan from '../../state/plan.json';

type DailyTask = {
  date: string;
  title: string;
  action: string;
  durationMinutes: number;
};

type PlannerEvent = {
  title: string;
  start: Date;
  end: Date;
};

function toDateKey(date: Date) {
  return date.toISOString().split('T')[0];
}

function parseEvents(dailyTasks: DailyTask[], timedEvents: { title: string; start: string; end: string }[]) {
  const events: PlannerEvent[] = [];

  for (const task of dailyTasks || []) {
    events.push({
      title: task.title || task.action,
      start: new Date(task.date),
      end: new Date(task.date),
    });
  }

  for (const event of timedEvents || []) {
    events.push({
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
    });
  }

  return events;
}

function getWeekRange(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dailyTasks = (plan?.goals?.daily || []) as DailyTask[];
  const yearlyGoals = (plan?.goals?.yearly || []) as string[];

  const selectedDateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);
  const weekRange = useMemo(() => getWeekRange(selectedDate), [selectedDate]);

  const todayTasks = useMemo(
    () =>
      dailyTasks
        .filter((task) => task.date === selectedDateKey)
        .map((task) => task.title || task.action),
    [dailyTasks, selectedDateKey]
  );

  const weekTasks = useMemo(
    () =>
      dailyTasks
        .filter((task) => {
          const taskDate = new Date(task.date);
          return taskDate >= weekRange.start && taskDate <= weekRange.end;
        })
        .map((task) => task.title || task.action),
    [dailyTasks, weekRange]
  );

  const events = useMemo(
    () => parseEvents(dailyTasks, plan?.events || []),
    [dailyTasks]
  );

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <PlannerClient
        selectedDate={selectedDateKey}
        events={events}
        todayTasks={todayTasks}
        weekTasks={weekTasks}
        yearlyGoals={yearlyGoals}
        onSelectDate={setSelectedDate}
      />
    </main>
  );
}
