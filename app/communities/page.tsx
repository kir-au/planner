'use client';

import {Card, Metric, Text, Title, BarList, Flex, Grid, Button} from '@tremor/react';
import {signIn, useSession} from "next-auth/react";

const website = [
  { name: '/home', value: 1230 },
  { name: '/contact', value: 751 },
  { name: '/gallery', value: 471 },
  { name: '/august-discount-offer', value: 280 },
  { name: '/case-studies', value: 78 }
];

const shop = [
  { name: '/home', value: 453 },
  { name: '/imprint', value: 351 },
  { name: '/shop', value: 271 },
  { name: '/pricing', value: 191 }
];

const app = [
  { name: '/shop', value: 789 },
  { name: '/product-features', value: 676 },
  { name: '/about', value: 564 },
  { name: '/login', value: 234 },
  { name: '/downloads', value: 191 }
];

const data = [
  {
    category: 'School',
    stat: '340',
    data: website
  },
  {
    category: 'Soccer Club',
    stat: '50',
    data: shop
  },
  {
    category: 'Gymnastics',
    stat: '10',
    data: app
  }
];

export default function CommunitiesPage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
          {data.map((item) => (
            <Card key={item.category}>
              <Flex className="mt-6">
                <Title>{item.category}</Title>
                <Button size="xs" variant="primary">
                  Send invite
                </Button>
              </Flex>

              <Flex
                justifyContent="start"
                alignItems="baseline"
                className="space-x-2"
              >
                <Metric>{item.stat}</Metric>
                <a href="/members">
                  <Text>Members</Text>
                </a>
              </Flex>
            </Card>
          ))}
        </Grid>
      </main>
    );
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
