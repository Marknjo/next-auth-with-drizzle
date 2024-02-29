import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { db } from '.';
import * as schema from '@drizzle/schema';

const migrateDb = async () => {
  try {
    console.log('🟠 Migrating client');

    await migrate(db as PostgresJsDatabase<typeof schema>, {
      migrationsFolder: 'drizzle',
    });

    console.log('🟢 Migration successful');

    process.exit(0);
  } catch (error) {
    console.log('🔴 Error migrating client');
    console.log(error);
    process.exit(1);
  }
};

migrateDb();
