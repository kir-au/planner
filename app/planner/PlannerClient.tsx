'use client';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, Title, Text, Grid } from '@tremor/react';
import { useState, useEffect } from 'react';

const localizer = momentLocalizer(moment);

export type PlannerEvent = {
  title: string;
  start: Date;
  end: Date;
};

export default function PlannerClient(props: {
  todayTitle: string;
  weekTheme: string;
  defaultAction: string;
  timeboxMinutes: number;
  events: PlannerEvent[];
  goals: {
    yearly: string[];
    monthly: string;
    weekly: string;
    daily: { date: string; title: string; action: string; durationMinutes: number }[];
  };
}) {
  const { todayTitle, weekTheme, defaultAction, timeboxMinutes, events, goals } = props;
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const todayTasks = props.goals.daily.filter((task) => task.date === selectedDate);

  const weekTasks = props.goals.daily.filter((task) => {
    const selectedDateObj = new Date(selectedDate);
    const weekStart = new Date(selectedDateObj);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const taskDate = new Date(task.date);
    return taskDate >= weekStart && taskDate <= weekEnd;
  });

  return (
    <main className="p-6 grid" style={{ gridTemplateColumns: '1fr 3fr', gridTemplateRows: 'auto 1fr', height: '100vh' }}>
      <aside className="p-4 border-r flex flex-col" style={{ gridRow: '1 / span 2' }}>
        <Card>
          <Title>Execution Panel</Title>
          <Text className="mt-2 font-bold">Today</Text>
          <ul>
            {todayTasks.length > 0 ? (
              todayTasks.map((task, index) => (
                <li key={index} className="text-sm">{task.title}</li>
              ))
            ) : (
              <Text className="text-sm">No tasks for today</Text>
            )}
          </ul>

          <Text className="mt-4 font-bold">This Week</Text>
          <ul>
            {weekTasks.length > 0 ? (
              weekTasks.map((task, index) => (
                <li key={index} className="text-sm">{task.title}</li>
              ))
            ) : (
              <Text className="text-sm">No tasks for this week</Text>
            )}
          </ul>
        </Card>
      </aside>

      <section className="flex-1">
        <div className="pt-0">
          <Grid numItemsSm={1} numItemsLg={3} className="gap-6 mb-6">
            <Card>
              <Title>Today</Title>
              <Text className="mt-2">{`${todayTasks.length} tasks`}</Text>
            </Card>

            <Card>
              <Title>This Week</Title>
              <Text className="mt-2">{`${weekTasks.length} tasks`}</Text>
            </Card>

            <Card>
              <Title>This Year</Title>
              <ul>
                {props.goals.yearly.slice(0, 4).map((goal, index) => (
                  <li key={index} className="text-sm">{goal}</li>
                ))}
              </ul>
            </Card>
          </Grid>

          <Card>
            <Title>Calendar</Title>
            <div className="mt-4" style={{ height: 600 }}>
              <Calendar
                localizer={localizer}
                events={props.events}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'week', 'day', 'agenda']}
                style={{ height: 600 }}
                onSelectSlot={(slotInfo) => handleSelectDate(slotInfo.start)}
                selectable
              />
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
