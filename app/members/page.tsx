import { Card, Title, Text } from '@tremor/react';
import { queryBuilder } from '../../lib/planetscale';
import Search from './search';
import UsersTable from './table';
//import CommunityMembers from "./data";

export const dynamic = 'force-dynamic';

export default async function IndexPage({ searchParams }: {
    searchParams: { q: string };
}) {
    const search = searchParams.q ?? '';
    const users = await queryBuilder
        .selectFrom('users')
        .select(['id', 'first_name', 'username', 'email'])
        .where('first_name', 'like', `%${search}%`)
        .execute();

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Title>Users</Title>
            <Text>
                A list of users.
            </Text>
            <Search />
            <Card className="mt-6">
                <UsersTable users={users} />
            </Card>
        </main>
    );
}