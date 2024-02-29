import { defineConfig } from 'drizzle-kit';
import { env } from 'process';

export default defineConfig({
  schema: './src/db/schemas',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString:
      env.NODE_ENV === 'development' ? env.DB_LOCAL_URL! : env.DB_PROD_URL!,
  },
  verbose: true,
  strict: true,
});
