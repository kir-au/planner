import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Card, Text, Title} from "@tremor/react";
import events from './mock/events';

const localizer = momentLocalizer(moment)

export default async function BigCalendar() {

  return (
    <Card>
      <div>
        <Calendar
          events={events}
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          style={{height: 450}}
          eventPropGetter={(event) => {
            const backgroundColor = 'rgb(191 219 254 / var(--tw-bg-opacity))';
            return {style: {backgroundColor}}
          }}
        />
      </div>
    </Card>
  );
}