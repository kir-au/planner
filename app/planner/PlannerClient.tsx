'use client';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, Title, Text } from '@tremor/react';

const localizer = momentLocalizer(moment);

export type PlannerEvent = {
  title: string;
  start: Date;
  end: Date;
};

type SummaryPanel = {
  title: string;
  count: number;
  description?: string;
};

type ExecutionSection = {
  title: string;
  tasks: string[];
};

export default function PlannerClient(props: {
  selectedDate: Date;
  events: PlannerEvent[];
  summaryPanels: SummaryPanel[];
  executionSections: ExecutionSection[];
  onSelectDate: (date: Date) => void;
}) {
  const formatCount = (count: number) => `${count} task${count === 1 ? '' : 's'}`;
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 xl:grid-cols-4">
        {props.summaryPanels.map((panel) => (
          <Card key={panel.title}>
            <Title>{panel.title}</Title>
            <Text className="mt-2">{formatCount(panel.count)}</Text>
            {panel.description ? (
              <Text className="mt-2 text-sm opacity-80">{panel.description}</Text>
            ) : null}
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 items-stretch lg:grid-cols-[320px_1fr]">
        <aside className="flex">
          <Card className="w-full h-full flex flex-col">
            <Title>Execution Panel</Title>
            {props.executionSections.map((section) => (
              <div key={section.title} className="mt-3 first:mt-2">
                <Text>{section.title}</Text>
                <ul className="text-sm space-y-1 mt-1">
                  {section.tasks.length === 0 ? (
                    <li className="text-gray-500">No tasks scheduled</li>
                  ) : (
                    section.tasks.map((task, index) => (
                      <li key={`${section.title}-${index}`} className="text-gray-700 break-words">
                        {task}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </Card>
        </aside>

        <Card className="flex flex-col min-w-0">
          <Title>Calendar</Title>
          <div className="mt-4 overflow-x-auto">
            <div className="min-w-[720px] h-[600px]">
              <Calendar
                localizer={localizer}
                events={props.events.map((event) => ({
                  ...event,
                  title: event.title.length > 32 ? `${event.title.slice(0, 32)}…` : event.title,
                }))}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'week', 'day', 'agenda']}
                date={props.selectedDate}
                style={{ height: '100%' }}
                selectable
                popup
                longPressThreshold={10}
                onNavigate={(date) => props.onSelectDate(date)}
                dayPropGetter={(date) =>
                  isSameDay(date, props.selectedDate)
                    ? { style: { backgroundColor: 'rgb(219 234 254)' } }
                    : {}
                }
                onSelectSlot={(slotInfo) => {
                  if (slotInfo?.start) {
                    props.onSelectDate(new Date(slotInfo.start));
                  }
                }}
                onSelectEvent={(event) => {
                  if (event?.start) {
                    props.onSelectDate(new Date(event.start));
                  }
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
