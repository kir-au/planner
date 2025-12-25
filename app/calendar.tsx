"use client";

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const events: { start: Date; end: Date; title: string }[] = []; // Explicitly typed empty events array

export default function BigCalendar() {
  return (
    <div style={{ height: 450 }}>
      <Calendar
        events={events}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 450 }}
        eventPropGetter={() => ({ style: { backgroundColor: 'rgb(191 219 254 / var(--tw-bg-opacity))' } })}
      />
    </div>
  );
}