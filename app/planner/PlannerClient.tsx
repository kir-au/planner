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
      <aside className="w-1/4 p-4 border-r self-start">
        <Card className="mt-[0px]">
          <Title>Goals</Title>
          <Text className="mt-2 font-bold">Yearly Goals</Text>
          <ul>
            {goals.yearly.map((goal, index) => (
              <li key={index} className="text-sm">{goal}</li>
            ))}
          </ul>
          <Text className="mt-4 font-bold">Monthly Goal</Text>
          <Text className="text-sm">{goals.monthly}</Text>
          <Text className="mt-4 font-bold">Weekly Goal</Text>
          <Text className="text-sm">{goals.weekly}</Text>
          <Text className="mt-4 font-bold">Daily Tasks</Text>
          <ul>
            {dailyGoals.map((task, index) => (
              <li key={index} className="text-sm">{task}</li>
            ))}
          </ul>
        </Card>
      </aside>

      <section className="flex-1">
        <div className="pt-0">
          <Grid numItemsSm={1} numItemsLg={3} className="gap-6 mb-6">
            <Card>
              <Title>Today</Title>
              <Text className="mt-2">{todayTitle}</Text>
              <Text className="mt-2 text-sm opacity-80">{timeboxMinutes} minutes</Text>
            </Card>

            <Card>
              <Title>This week</Title>
              <Text className="mt-2">{weekTheme}</Text>
              <Text className="mt-2 text-sm opacity-80">Default: {defaultAction}</Text>
            </Card>

            <Card>
              <Title>Rule</Title>
              <Text className="mt-2">One default action per day. No daily planning.</Text>
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
