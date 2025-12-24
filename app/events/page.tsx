import { Card, Title, Text } from '@tremor/react';
import { queryBuilder } from '../../lib/planetscale';
import Search from './search';
import EventsTable from './table';
//import CommunityMembers from "./data";

export const dynamic = 'force-dynamic';

export default async function IndexPage({ searchParams }: {
    searchParams: { q: string };
}) {
    const search = searchParams.q ?? '';
    const events = await queryBuilder
        .selectFrom('events')
        .select(['id', 'event_name', 'description', 'location_name'])
        .where('event_name', 'like', `%${search}%`)
        .execute();

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Title>Events</Title>
            <Text>
                A list of events.
            </Text>
            <Search />
            <Card className="mt-6">
                <EventsTable events={events} />
            </Card>
        </main>
    );
}