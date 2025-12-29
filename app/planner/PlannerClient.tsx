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
  category?: string;
  hasTime?: boolean;
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

const CATEGORY_COLORS = {
  family: {
    bg: '#FEF3C7',
    border: '#F59E0B',
    text: '#92400E',
  },
  health: {
    bg: '#ECFDF5',
    border: '#10B981',
    text: '#065F46',
  },
  work: {
    bg: '#EFF6FF',
    border: '#3B82F6',
    text: '#1E3A8A',
  },
  personal: {
    bg: '#F5F3FF',
    border: '#8B5CF6',
    text: '#4C1D95',
  },
  travel: {
    bg: '#FFF7ED',
    border: '#FB923C',
    text: '#9A3412',
  },
  default: {
    bg: '#F9FAFB',
    border: '#9CA3AF',
    text: '#374151',
  },
  allDay: {
    bg: '#E0F2FE',
    border: '#0284C7',
    text: '#0C4A6E',
  },
};

type CategoryKey = keyof typeof CATEGORY_COLORS;

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
  const resolveCategoryKey = (category?: string, isDefault?: boolean, hasTime?: boolean): CategoryKey => {
    if (isDefault) {
      return 'default';
    }
    if (category) {
      const normalized = category.toLowerCase();
      if (normalized.includes('family')) {
        return 'family';
      }
      if (normalized.includes('health')) {
        return 'health';
      }
      if (normalized.includes('work') || normalized.includes('business')) {
        return 'work';
      }
      if (normalized.includes('personal') || normalized.includes('social')) {
        return 'personal';
      }
      if (normalized.includes('travel')) {
        return 'travel';
      }
      if (normalized.includes('default')) {
        return 'default';
      }
    }
    return hasTime === false ? 'allDay' : 'default';
  };
  const getCategoryColors = (category?: string, isDefault?: boolean, hasTime?: boolean) =>
    CATEGORY_COLORS[resolveCategoryKey(category, isDefault, hasTime)];
  const legendItems: { key: CategoryKey; label: string }[] = [
    { key: 'family', label: 'Family' },
    { key: 'health', label: 'Health' },
    { key: 'work', label: 'Work' },
    { key: 'personal', label: 'Personal' },
    { key: 'travel', label: 'Travel' },
    { key: 'default', label: 'Default' },
    { key: 'allDay', label: 'All day' },
  ];

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
              <ul className="text-[15px] leading-snug pr-1 divide-y divide-gray-100">
                {panel.tasks.map((task, index) => {
                  const label = task.isDefault ? `Default: ${task.title}` : task.title;
                  const colors = getCategoryColors(task.category, task.isDefault, task.hasTime);
                  return (
                    <li
                      key={`${panel.title}-${index}`}
                      className={[
                        task.isDefault ? 'text-gray-400 italic whitespace-nowrap' : 'text-gray-700 break-words',
                        'border-l-2 pl-2 py-0.5',
                      ].join(' ')}
                      style={{ borderLeftColor: colors.border }}
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

      <div className="mb-6 flex flex-wrap items-center gap-3 text-[13px] text-gray-500">
        {legendItems.map((item) => {
          const colors = CATEGORY_COLORS[item.key];
          return (
            <div key={item.key} className="inline-flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-sm border"
                style={{ backgroundColor: colors.bg, borderColor: colors.border }}
              />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 items-stretch lg:grid-cols-[320px_1fr]">
        <aside className="flex">
          <Card className="w-full h-full flex flex-col border border-gray-200 shadow-sm">
            <Title>Execution Panel</Title>
            {props.executionSections.map((section) => (
              <div key={section.title} className="mt-4 first:mt-3">
                <Text className="text-[15px] font-semibold text-gray-800">{section.title}</Text>
                <ul className="text-[15px] leading-snug mt-2 divide-y divide-gray-100">
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
                        const colors = getCategoryColors(task.category, task.isDefault, task.hasTime);
                        const label = task.isDefault ? `Default: ${task.title}` : task.title;
                        return (
                          <li
                            key={`${section.title}-${index}`}
                            className={[
                              task.isDefault ? 'text-gray-400 italic whitespace-nowrap' : 'text-gray-700 break-words',
                              'border-l-2 pl-2 py-1',
                            ].join(' ')}
                            style={{ borderLeftColor: colors.border }}
                          >
                            {timeLabel ? (
                              <>
                                <span className="font-semibold">{timeLabel}</span>
                                <span className="font-normal">{` · ${label}`}</span>
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
              eventPropGetter={(event) => {
                const colors = getCategoryColors(event.category, false, event.hasTime);
                return {
                  style: {
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    borderRadius: '6px',
                  },
                };
              }}
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
