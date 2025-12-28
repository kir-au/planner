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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dailyGoals, setDailyGoals] = useState<string[]>(goals.daily.map((goal) => goal.action));

  const handleSelectDate = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
  };

  useEffect(() => {
    if (selectedDate) {
      const matchedGoal = props.goals.daily.find((task) => task.date === selectedDate);
      if (matchedGoal) {
        setDailyGoals([matchedGoal.action]);
      } else {
        setDailyGoals([defaultAction]);
      }
    }
  }, [selectedDate, props.goals.daily, defaultAction]);

  return (
    <main className="p-6 flex">
      <aside className="w-1/4 p-4 border-r flex flex-col">
        <Card>
          <Title>Execution Panel</Title>
          <Text className="mt-2 font-bold">Today</Text>
          <ul>
            {props.events
              .filter((event) => {
                const selectedDateObj = selectedDate ? new Date(selectedDate) : new Date();
                return (
                  new Date(event.start) <= selectedDateObj &&
                  selectedDateObj <= new Date(event.end)
                );
              })
              .map((event, index) => (
                <li key={index} className="text-sm">{event.title}</li>
              ))}
          </ul>

          <Text className="mt-4 font-bold">This Week</Text>
          <ul>
            {props.events
              .filter((event) => {
                const selectedDateObj = selectedDate ? new Date(selectedDate) : new Date();
                const weekStart = new Date(selectedDateObj);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                return (
                  new Date(event.start) <= weekEnd &&
                  weekStart <= new Date(event.end)
                );
              })
              .map((event, index) => (
                <li key={index} className="text-sm">{event.title}</li>
              ))}
          </ul>

          <Text className="mt-4 font-bold">This Year</Text>
          <ul>
            {props.goals.yearly.map((goal, index) => (
              <li key={index} className="text-sm">{goal}</li>
            ))}
          </ul>
        </Card>
      </aside>

      <section className="flex-1">
        <div className="pt-0">
          <Grid numItemsSm={1} numItemsLg={3} className="gap-6 mb-6">
            <Card>
              <Title>Today</Title>
              <Text className="mt-2">Tasks for selected date</Text>
            </Card>

            <Card>
              <Title>This Week</Title>
              <Text className="mt-2">Tasks overlapping selected week</Text>
            </Card>

            <Card>
              <Title>This Year</Title>
              <Text className="mt-2">Yearly context</Text>
            </Card>
          </Grid>

          <Card>
            <Title>Calendar</Title>
            <div className="mt-4" style={{ height: 600 }}>
              <Calendar
                localizer={localizer}
                events={events}
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
