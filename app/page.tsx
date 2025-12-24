'use client';

import {Card, Title, Text, Flex, Bold, Grid, BarList, Col, Divider, Button} from '@tremor/react';
import {queryBuilder} from '../lib/planetscale';
import Search from './members/search';
import UsersTable from './members/table';
import Calendar from "./calendar";
import Form from "./form";
import {useSession, signIn, signOut} from "next-auth/react";

const website = [
  {name: 'Going', value: 10}
];

const shop = [
  {name: 'Going', value: 15}
];

const app = [
  {name: 'Going', value: 30}
];

const data = [
  {
    category: 'School Soccer Competition',
    datetime: '10 October 2023',
    data: website
  },
  {
    category: 'Kids Art Festival',
    datetime: '15 September 2023',
    data: shop
  },
  {
    category: 'Circus',
    datetime: '3 September 2023',
    data: app
  }
];

export const dynamic = 'force-dynamic';

export default async function IndexPage({searchParams}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';
  const { data: session } = useSession();

  if (session) {
    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Title>Events</Title>
        <Grid numItemsSm={2} numItemsLg={3} className="gap-6 mt-4">
          {data.map((item) => (
            <Card key={item.category}>
              <Title>{item.category}</Title>
              <Flex
                justifyContent="start"
                alignItems="baseline"
                className="space-x-2"
              >
                <Text><Bold>{item.datetime}</Bold></Text>
              </Flex>
              <BarList
                data={item.data}
                valueFormatter={(number: number) =>
                  Intl.NumberFormat('us').format(number).toString()
                }
                className="mt-2"
              />
            </Card>
          ))}
        </Grid>
        <Divider />
        <Grid numItemsSm={1} numItemsLg={3} className="gap-6 mt-8">
          <Form />
          <Col numColSpan={1} numColSpanLg={2}>
            <Calendar />
          </Col>
        </Grid>
      </main>
    )
  } else {
    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Flex
          justifyContent="center"
          alignItems="baseline"
          className="space-x-2">
          <Button onClick={() => signIn()} size="lg" variant="secondary">
            Sign In
          </Button>
          <div className="tremor-base tr-relative tr-w-full tr-mx-auto tr-text-left tr-ring-1 tr-mt-6 tr-max-w-none tr-bg-white tr-shadow tr-border-blue-400 tr-ring-gray-200 tr-pl-6 tr-pr-6 tr-pt-6 tr-pb-6 tr-rounded-lg h-[360px]" />
        </Flex>
      </main>
    )
  }
}