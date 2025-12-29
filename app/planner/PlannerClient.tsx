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
  tasks: ExecutionTask[];
};

type ExecutionSection = {
  title: string;
  tasks: ExecutionTask[];
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
  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  const categoryClass = (category?: string) => {
    if (!category) {
      return '';
    }
    const normalized = category.toLowerCase();
    if (normalized.includes('health')) {
      return 'border-emerald-300';
    }
    if (normalized.includes('family')) {
      return 'border-amber-300';
    }
    if (normalized.includes('business') || normalized.includes('work')) {
      return 'border-sky-300';
    }
    return 'border-gray-200';
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 xl:grid-cols-4">
        {props.summaryPanels.map((panel) => (
          <Card key={panel.title} className="flex flex-col">
            <Title>{panel.title}</Title>
            <Text className="mt-2 text-[15px]">{formatCount(panel.count)}</Text>
            {panel.description ? (
              <Text className="mt-2 text-[14px] text-gray-500">{panel.description}</Text>
            ) : null}
            <div className="mt-3 max-h-28 overflow-y-auto">
              <ul className="text-[15px] leading-snug space-y-0.5 pr-1">
                {panel.tasks.map((task, index) => {
                  const label = task.isDefault ? `Default: ${task.title}` : task.title;
                  const indicator = categoryClass(task.category);
                  return (
                    <li
                      key={`${panel.title}-${index}`}
                      className={[
                        task.isDefault ? 'text-gray-400 italic whitespace-nowrap' : 'text-gray-700 break-words',
                        indicator ? `border-l-2 pl-2 ${indicator}` : '',
                      ].join(' ')}
                    >
                      {label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 items-stretch lg:grid-cols-[320px_1fr]">
        <aside className="flex">
          <Card className="w-full h-full flex flex-col border border-gray-200 shadow-sm">
            <Title>Execution Panel</Title>
            {props.executionSections.map((section) => (
              <div key={section.title} className="mt-4 first:mt-3">
                <Text className="text-[15px] font-semibold text-gray-800">{section.title}</Text>
                <ul className="text-[15px] leading-snug space-y-0.5 mt-2">
                  {section.tasks.length === 0 ? (
                    <li className="text-gray-500">No tasks scheduled</li>
                  ) : (
                    [...section.tasks]
                      .sort((a, b) => {
                        const aTimed = Boolean(a.hasTime);
                        const bTimed = Boolean(b.hasTime);
                        if (aTimed !== bTimed) {
                          return aTimed ? -1 : 1;
                        }
                        if (!aTimed && !bTimed) {
                          return (a.sortIndex ?? 0) - (b.sortIndex ?? 0);
                        }
                        const aTime = a.start ? a.start.getHours() * 60 + a.start.getMinutes() : Number.MAX_SAFE_INTEGER;
                        const bTime = b.start ? b.start.getHours() * 60 + b.start.getMinutes() : Number.MAX_SAFE_INTEGER;
                        if (aTime !== bTime) {
                          return aTime - bTime;
                        }
                        return (a.sortIndex ?? 0) - (b.sortIndex ?? 0);
                      })
                      .map((task, index) => {
                        const timeLabel =
                          task.hasTime && task.start && task.end
                            ? `${formatTime(task.start)}–${formatTime(task.end)}`
                            : null;
                        const indicator = categoryClass(task.category);
                        const label = task.isDefault ? `Default: ${task.title}` : task.title;
                        return (
                          <li
                            key={`${section.title}-${index}`}
                            className={[
                              task.isDefault ? 'text-gray-400 italic whitespace-nowrap' : 'text-gray-700 break-words',
                              indicator ? `border-l-2 pl-2 ${indicator}` : '',
                            ].join(' ')}
                          >
                            {timeLabel ? (
                              <>
                                <span className="font-semibold">{timeLabel}</span>
                                <span>{` · ${label}`}</span>
                              </>
                            ) : (
                              label
                            )}
                          </li>
                        );
                      })
                  )}
                </ul>
              </div>
            ))}
          </Card>
        </aside>

        <Card className="flex flex-col min-w-0 border border-gray-100 shadow-none">
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
