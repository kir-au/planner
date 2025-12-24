import 'server-only';
import { Generated, Kysely } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';

interface User {
  id: Generated<number>;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

interface Event {
  id: number;
  event_name: string;
  description: string;
  location_name: string;
}

interface Database {
  users: User;
  events: Event;
  // https://github.com/nextauthjs/next-auth/issues/4922
}

export const queryBuilder = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    url: process.env.DATABASE_URL
  })
});
