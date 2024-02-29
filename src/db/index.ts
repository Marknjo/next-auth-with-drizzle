import { env } from 'process';
import { sql } from '@vercel/postgres';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  drizzle as vercelDrizzle,
  VercelPgDatabase,
} from 'drizzle-orm/vercel-postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { isDev } from '@/lib/utils';
import * as schema from '@drizzle/schema';

declare global {
  var drizzle:
    | PostgresJsDatabase<typeof schema>
    | VercelPgDatabase<typeof schema>
    | undefined;
}

const url: string = isDev ? env.DB_LOCAL_URL! : env.DB_PROD_URL!;

let client: postgres.Sql<{}> | typeof sql;

if (isDev) {
  client = postgres(url, { max: 1 });
} else {
  client = sql;
}

let db: PostgresJsDatabase<typeof schema> | VercelPgDatabase<typeof schema>;

if (isDev) {
  db = drizzle(client as postgres.Sql<{}>, {
    schema,
    logger: isDev,
  }) as PostgresJsDatabase<typeof schema>;
} else {
  db = vercelDrizzle(sql) as VercelPgDatabase<typeof schema>;
}

if (env.NODE_ENV !== 'production') globalThis.drizzle = db;

export { db };
