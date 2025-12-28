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

export default function PlannerClient(props: {
  selectedDate: string;
  events: PlannerEvent[];
  todayTasks: string[];
  weekTasks: string[];
  yearlyGoals: string[];
  onSelectDate: (date: Date) => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
            <path d="M7 3.75V7" strokeLinecap="round" />
            <path d="M17 3.75V7" strokeLinecap="round" />
            <path d="M3.5 9.5H20.5" strokeLinecap="round" />
            <path d="M8.2 15.2L10.4 17.4L15.8 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-sm text-gray-500">Planner</span>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <Title>Today</Title>
          <Text className="mt-2">{`${props.todayTasks?.length || 0} tasks`}</Text>
        </Card>

        <Card>
          <Title>This Week</Title>
          <Text className="mt-2">{`${props.weekTasks?.length || 0} tasks`}</Text>
        </Card>

        <Card>
          <Title>This Year</Title>
          <Text className="mt-2">Yearly goals summary</Text>
        </Card>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-6 items-stretch">
        <aside className="flex">
          <Card className="w-full h-full flex flex-col">
            <Title>Execution Panel</Title>
            <Text className="mt-2">Today</Text>
            <ul className="text-sm space-y-1">
              {props.todayTasks?.slice(0, 6).map((task, index) => (
                <li key={index} className="truncate text-gray-700">{task}</li>
              ))}
              {props.todayTasks?.length > 6 && (
                <li className="text-sm text-gray-500">… +{props.todayTasks.length - 6} more</li>
              )}
            </ul>

            <Text className="mt-4">This Week</Text>
            <ul className="text-sm space-y-1">
              {props.weekTasks?.slice(0, 6).map((task, index) => (
                <li key={index} className="truncate text-gray-700">{task}</li>
              ))}
              {props.weekTasks?.length > 6 && (
                <li className="text-sm text-gray-500">… +{props.weekTasks.length - 6} more</li>
              )}
            </ul>
          </Card>
        </aside>

        <Card className="flex flex-col">
          <Title>Calendar</Title>
          <div className="mt-4 h-[600px]">
            <Calendar
              localizer={localizer}
              events={props.events.map((event) => ({
                ...event,
                title: event.title.length > 32 ? `${event.title.slice(0, 32)}…` : event.title,
              }))}
              startAccessor="start"
              endAccessor="end"
              views={['month', 'week', 'day', 'agenda']}
              style={{ height: '100%' }}
              selectable
              popup
              longPressThreshold={10}
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
        </Card>
      </div>
    </div>
  );
}
