import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text
} from '@tremor/react';

interface Event {
  id: number;
  event_name: string;
  description: string;
  location_name: string;
}

export default async function EventsTable({ events: events }: { events: Event[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Description</TableHeaderCell>
          <TableHeaderCell>Location</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>{event.event_name}</TableCell>
            <TableCell>
              <Text>{event.description}</Text>
            </TableCell>
            <TableCell>
              <Text>{event.location_name}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
