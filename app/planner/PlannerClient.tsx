'use client';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, Title, Text, Grid } from '@tremor/react';

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
}) {
  const { todayTitle, weekTheme, defaultAction, timeboxMinutes, events } = props;

  return (
    <main className="p-6">
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
        <div className="mt-4" style={{ height: 520 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={['month','week','day','agenda']}
            style={{ height: 520 }}
          />
        </div>
      </Card>
    </main>
  );
}
