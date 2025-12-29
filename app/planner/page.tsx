'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import PlannerClient from './PlannerClient';
import plan from '../../state/plan.json';

type PlannerTask = {
  id: string;
  title: string;
  date: string;
  category?: string;
  duration?: number;
  tags?: string[];
  weekTheme?: string;
  start?: string;
  end?: string;
};

type PlannerEventItem = {
  title: string;
  start: string;
  end: string;
  category?: string;
  type?: string;
  notes?: string;
  isMultiDay?: boolean;
};

type DefaultConfig = {
  title?: string;
  duration?: number;
};

type PlannerDefaults = {
  daily?: DefaultConfig;
  weekly?: DefaultConfig;
  monthly?: DefaultConfig;
};

type ExecutionTask = {
  title: string;
  isDefault: boolean;
  hasTime?: boolean;
  start?: Date;
  end?: Date;
  sortIndex?: number;
  category?: string;
};

type PlannerEvent = {
  title: string;
  start: Date;
  end: Date;
};

type PlannerItem = {
  title: string;
  start: Date;
  end: Date;
  source: 'task' | 'event';
  hasTime: boolean;
  sortIndex: number;
  category?: string;
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

function parseDateBoundary(value: string, isEnd: boolean) {
  if (value.includes('T')) {
    return new Date(value);
  }
  const date = parseDateKey(value);
  if (isEnd) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date;
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

function getMonthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
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
    const startValue = task.start || task.date;
    const endValue = task.end || task.date;
    const taskStart = parseDateBoundary(startValue, false);
    const taskEnd = parseDateBoundary(endValue, true);
    return taskStart < range.end && taskEnd > range.start;
  });
}

function itemsInRange(items: PlannerItem[], range: { start: Date; end: Date }) {
  return items.filter((item) => item.start < range.end && item.end > range.start);
}

function getWeekTheme(tasks: PlannerTask[]) {
  return tasks.find((task) => task.weekTheme)?.weekTheme;
}

function toPlannerItemFromTask(task: PlannerTask, sortIndex: number): PlannerItem {
  const startValue = task.start || task.date;
  const endValue = task.end || task.date;
  const hasTime = startValue.includes('T') || endValue.includes('T');
  return {
    title: task.title,
    start: parseDateBoundary(startValue, false),
    end: parseDateBoundary(endValue, true),
    source: 'task',
    hasTime,
    sortIndex,
    category: task.category,
  };
}

function toPlannerItemFromEvent(event: PlannerEventItem, sortIndex: number): PlannerItem {
  const hasTime = event.start.includes('T') || event.end.includes('T');
  return {
    title: event.title,
    start: parseDateBoundary(event.start, false),
    end: parseDateBoundary(event.end, true),
    source: 'event',
    hasTime,
    sortIndex,
    category: event.category,
  };
}

function resolveDefaultTitle(defaults: PlannerDefaults | undefined) {
  const dailyTitle = defaults?.daily?.title;
  const weeklyTitle = defaults?.weekly?.title;
  const monthlyTitle = defaults?.monthly?.title;

  return dailyTitle || weeklyTitle || monthlyTitle || 'Execute default focus block (30 min)';
}

function normalizeDefaultTitle(title: string) {
  return title.replace(/^Default:\s*/i, '');
}

function buildExecutionTasks(items: PlannerItem[], dateKey: string, defaultTitle: string): ExecutionTask[] {
  const dayStart = parseDateBoundary(dateKey, false);
  const dayEnd = parseDateBoundary(dateKey, true);
  const explicitTasks = itemsInRange(items, { start: dayStart, end: dayEnd }).map((item) => ({
    title: item.title,
    isDefault: false,
    hasTime: item.hasTime,
    start: item.start,
    end: item.end,
    sortIndex: item.sortIndex,
    category: item.category,
  }));

  if (explicitTasks.length > 0) {
    return explicitTasks;
  }

  return [{ title: normalizeDefaultTitle(defaultTitle), isDefault: true }];
}

function buildSummaryTasks(explicitTasks: PlannerItem[], defaultTitle: string): ExecutionTask[] {
  if (explicitTasks.length > 0) {
    return explicitTasks.map((task) => ({
      title: task.title,
      isDefault: false,
      hasTime: task.hasTime,
      start: task.start,
      end: task.end,
      sortIndex: task.sortIndex,
      category: task.category,
    }));
  }

  return [{ title: normalizeDefaultTitle(defaultTitle), isDefault: true }];
}

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const tasks = (plan?.tasks || []) as PlannerTask[];
  const events = (plan?.events || []) as PlannerEventItem[];
  const defaults = plan?.defaults as PlannerDefaults | undefined;
  const selectedDateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);
  const defaultTitle = useMemo(() => resolveDefaultTitle(defaults), [defaults]);

  const tasksWithDates = useMemo(
    () => tasks.filter((task) => Boolean(task.date)),
    [tasks]
  );
  const plannerItems = useMemo(() => {
    const taskItems = tasksWithDates.map((task, index) => toPlannerItemFromTask(task, index));
    const eventItems = events.map((event, index) => toPlannerItemFromEvent(event, index + taskItems.length));
    return [...taskItems, ...eventItems];
  }, [events, tasksWithDates]);

  const todayKey = selectedDateKey;
  const tomorrowKey = useMemo(() => formatDateKey(addDays(selectedDate, 1)), [selectedDate]);
  const dayAfterKey = useMemo(() => formatDateKey(addDays(selectedDate, 2)), [selectedDate]);

  const todayTasks = useMemo(
    () => buildExecutionTasks(plannerItems, todayKey, defaultTitle),
    [plannerItems, todayKey, defaultTitle]
  );
  const tomorrowTasks = useMemo(
    () => buildExecutionTasks(plannerItems, tomorrowKey, defaultTitle),
    [plannerItems, tomorrowKey, defaultTitle]
  );
  const dayAfterTasks = useMemo(
    () => buildExecutionTasks(plannerItems, dayAfterKey, defaultTitle),
    [plannerItems, dayAfterKey, defaultTitle]
  );

  const thisWeekRange = useMemo(() => getIsoWeekRange(selectedDate), [selectedDate]);
  const nextWeekRange = useMemo(() => shiftRange(thisWeekRange, 7), [thisWeekRange]);
  const weekAfterRange = useMemo(() => shiftRange(thisWeekRange, 14), [thisWeekRange]);

  const thisWeekTasks = useMemo(() => itemsInRange(plannerItems, thisWeekRange), [plannerItems, thisWeekRange]);
  const nextWeekTasks = useMemo(() => itemsInRange(plannerItems, nextWeekRange), [plannerItems, nextWeekRange]);
  const weekAfterTasks = useMemo(() => itemsInRange(plannerItems, weekAfterRange), [plannerItems, weekAfterRange]);
  const thisWeekTaskEntries = useMemo(() => tasksInRange(tasksWithDates, thisWeekRange), [tasksWithDates, thisWeekRange]);
  const nextWeekTaskEntries = useMemo(() => tasksInRange(tasksWithDates, nextWeekRange), [tasksWithDates, nextWeekRange]);
  const weekAfterTaskEntries = useMemo(() => tasksInRange(tasksWithDates, weekAfterRange), [tasksWithDates, weekAfterRange]);

  const thisWeekTheme = plan?.goals?.weekly?.title || defaults?.weekly?.title || getWeekTheme(thisWeekTaskEntries);
  const nextWeekTheme = getWeekTheme(nextWeekTaskEntries);
  const weekAfterTheme = getWeekTheme(weekAfterTaskEntries);

  const monthRange = useMemo(() => getMonthRange(selectedDate), [selectedDate]);
  const monthTasks = useMemo(() => itemsInRange(plannerItems, monthRange), [plannerItems, monthRange]);

  const thisWeekPanelTasks = useMemo(
    () => buildSummaryTasks(thisWeekTasks, defaultTitle),
    [thisWeekTasks, defaultTitle]
  );
  const nextWeekPanelTasks = useMemo(
    () => buildSummaryTasks(nextWeekTasks, defaultTitle),
    [nextWeekTasks, defaultTitle]
  );
  const weekAfterPanelTasks = useMemo(
    () => buildSummaryTasks(weekAfterTasks, defaultTitle),
    [weekAfterTasks, defaultTitle]
  );
  const monthPanelTasks = useMemo(
    () => buildSummaryTasks(monthTasks, defaultTitle),
    [monthTasks, defaultTitle]
  );

  const summaryPanels = [
    {
      title: 'This Week',
      count: thisWeekTasks.length,
      description: thisWeekTheme || undefined,
      tasks: thisWeekPanelTasks,
    },
    {
      title: 'Next Week',
      count: nextWeekTasks.length,
      tasks: nextWeekPanelTasks,
    },
    {
      title: 'Week After',
      count: weekAfterTasks.length,
      tasks: weekAfterPanelTasks,
    },
    {
      title: 'This Month',
      count: monthTasks.length,
      tasks: monthPanelTasks,
    },
  ];

  const systemToday = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const isTodayContext = useMemo(() => formatDateKey(selectedDate) === formatDateKey(systemToday), [selectedDate, systemToday]);
  const formatLabel = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const executionSections = [
    {
      title: isTodayContext ? 'Today' : formatLabel(selectedDate),
      tasks: todayTasks,
    },
    {
      title: isTodayContext ? 'Tomorrow' : formatLabel(addDays(selectedDate, 1)),
      tasks: tomorrowTasks,
    },
    {
      title: isTodayContext ? 'Day After Tomorrow' : formatLabel(addDays(selectedDate, 2)),
      tasks: dayAfterTasks,
    },
  ];

  const calendarEvents = useMemo(
    () => parseEvents(tasksWithDates, plan?.events || []),
    [tasksWithDates]
  );

  const didLogRef = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || didLogRef.current) {
      return;
    }
    didLogRef.current = true;
    console.log('Planner aggregation check', {
      selectedDate: selectedDateKey,
      weekRanges: {
        thisWeek: { start: formatDateKey(thisWeekRange.start), end: formatDateKey(thisWeekRange.end) },
        nextWeek: { start: formatDateKey(nextWeekRange.start), end: formatDateKey(nextWeekRange.end) },
        weekAfter: { start: formatDateKey(weekAfterRange.start), end: formatDateKey(weekAfterRange.end) },
      },
      explicitCounts: {
        thisWeek: thisWeekTasks.length,
        nextWeek: nextWeekTasks.length,
        weekAfter: weekAfterTasks.length,
        thisMonth: monthTasks.length,
      },
      fallbackUsed: {
        thisWeek: thisWeekTasks.length === 0,
        nextWeek: nextWeekTasks.length === 0,
        weekAfter: weekAfterTasks.length === 0,
        thisMonth: monthTasks.length === 0,
        today: todayTasks[0]?.isDefault === true,
        tomorrow: tomorrowTasks[0]?.isDefault === true,
        dayAfter: dayAfterTasks[0]?.isDefault === true,
      },
    });
  }, [
    dayAfterTasks,
    monthTasks,
    nextWeekRange,
    nextWeekTasks,
    selectedDateKey,
    thisWeekRange,
    thisWeekTasks,
    todayTasks,
    tomorrowTasks,
    weekAfterRange,
    weekAfterTasks,
  ]);

  return (
    <main className="w-full px-6 py-4 md:py-10">
      <PlannerClient
        selectedDate={selectedDate}
        events={calendarEvents}
        summaryPanels={summaryPanels}
        executionSections={executionSections}
        onSelectDate={setSelectedDate}
      />
    </main>
  );
}
