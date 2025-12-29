'use client';

import { useMemo, useState } from 'react';
import PlannerClient from './PlannerClient';
import plan from '../../state/plan.json';

type PlannerTask = {
  id: string;
  title: string;
  date: string;
  duration?: number;
  tags?: string[];
  weekTheme?: string;
  start?: string;
  end?: string;
};

type PlannerEvent = {
  title: string;
  start: Date;
  end: Date;
};

type TimedEvent = {
  title: string;
  start: string;
  end: string;
};

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getIsoWeekRange(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const day = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - day);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function shiftRange(range: { start: Date; end: Date }, days: number) {
  const start = addDays(range.start, days);
  const end = addDays(range.end, days);
  return { start, end };
}

function parseDateValue(value: string) {
  return value.includes('T') ? new Date(value) : parseDateKey(value);
}

function parseEvents(tasks: PlannerTask[], timedEvents: TimedEvent[]) {
  const events: PlannerEvent[] = [];

  for (const task of tasks || []) {
    const startValue = task.start || task.date;
    const endValue = task.end || task.date;
    events.push({
      title: task.title,
      start: parseDateValue(startValue),
      end: parseDateValue(endValue),
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

function tasksInRange(tasks: PlannerTask[], range: { start: Date; end: Date }) {
  return tasks.filter((task) => {
    if (!task.date) {
      return false;
    }
    const taskDate = parseDateKey(task.date);
    return taskDate >= range.start && taskDate <= range.end;
  });
}

function getWeekTheme(tasks: PlannerTask[]) {
  return tasks.find((task) => task.weekTheme)?.weekTheme;
}

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const tasks = (plan?.tasks || []) as PlannerTask[];
  const selectedDateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);

  const tasksWithDates = useMemo(
    () => tasks.filter((task) => Boolean(task.date)),
    [tasks]
  );

  const todayKey = selectedDateKey;
  const tomorrowKey = useMemo(() => formatDateKey(addDays(selectedDate, 1)), [selectedDate]);
  const dayAfterKey = useMemo(() => formatDateKey(addDays(selectedDate, 2)), [selectedDate]);

  const todayTasks = useMemo(
    () => tasksWithDates.filter((task) => task.date === todayKey).map((task) => task.title),
    [tasksWithDates, todayKey]
  );
  const tomorrowTasks = useMemo(
    () => tasksWithDates.filter((task) => task.date === tomorrowKey).map((task) => task.title),
    [tasksWithDates, tomorrowKey]
  );
  const dayAfterTasks = useMemo(
    () => tasksWithDates.filter((task) => task.date === dayAfterKey).map((task) => task.title),
    [tasksWithDates, dayAfterKey]
  );

  const thisWeekRange = useMemo(() => getIsoWeekRange(selectedDate), [selectedDate]);
  const nextWeekRange = useMemo(() => shiftRange(thisWeekRange, 7), [thisWeekRange]);
  const weekAfterRange = useMemo(() => shiftRange(thisWeekRange, 14), [thisWeekRange]);

  const thisWeekTasks = useMemo(() => tasksInRange(tasksWithDates, thisWeekRange), [tasksWithDates, thisWeekRange]);
  const nextWeekTasks = useMemo(() => tasksInRange(tasksWithDates, nextWeekRange), [tasksWithDates, nextWeekRange]);
  const weekAfterTasks = useMemo(() => tasksInRange(tasksWithDates, weekAfterRange), [tasksWithDates, weekAfterRange]);

  const thisWeekTheme = plan?.goals?.weekly?.title || getWeekTheme(thisWeekTasks);
  const nextWeekTheme = getWeekTheme(nextWeekTasks);
  const weekAfterTheme = getWeekTheme(weekAfterTasks);

  const monthTasks = useMemo(() => {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    return tasksWithDates.filter((task) => {
      const taskDate = parseDateKey(task.date);
      return taskDate.getMonth() === month && taskDate.getFullYear() === year;
    });
  }, [tasksWithDates, selectedDate]);

  const summaryPanels = [
    {
      title: 'This Week',
      count: thisWeekTasks.length,
      description: thisWeekTheme || undefined,
    },
    {
      title: 'Next Week',
      count: nextWeekTasks.length,
      description: nextWeekTheme || undefined,
    },
    {
      title: 'Week After',
      count: weekAfterTasks.length,
      description: weekAfterTheme || undefined,
    },
    {
      title: 'This Month',
      count: monthTasks.length,
    },
  ];

  const executionSections = [
    { title: 'Today', tasks: todayTasks },
    { title: 'Tomorrow', tasks: tomorrowTasks },
    { title: 'Day After Tomorrow', tasks: dayAfterTasks },
  ];

  const events = useMemo(
    () => parseEvents(tasksWithDates, plan?.events || []),
    [tasksWithDates]
  );

  return (
    <main className="w-full px-6 py-4 md:py-10">
      <PlannerClient
        selectedDate={selectedDate}
        events={events}
        summaryPanels={summaryPanels}
        executionSections={executionSections}
        onSelectDate={setSelectedDate}
      />
    </main>
  );
}
