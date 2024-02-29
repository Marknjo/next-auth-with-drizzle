import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  boolean,
  date,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from '@auth/core/adapters';
import { createId } from '@paralleldrive/cuid2';
import { ERoles } from '../types';
import { sql } from 'drizzle-orm';

const roles = Object.values(ERoles) as [string, ...string[]];
export const ROLES = pgEnum('role', roles);

export const users = pgTable('user', {
  id: text('id')
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  name: text('name').unique().notNull(),
  email: text('email').notNull(),
  password: text('password'),
  role: ROLES('role').default(ERoles.USER),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  isTwoFactorEnabled: boolean('isTwoFactorEnabled').default(false),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const verificationTokens = pgTable(
  'verificationToken',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .notNull(),
    email: text('email').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);

export const passwordResetTokens = pgTable(
  'passwordResetTokens',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .notNull(),
    email: text('email').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  (pRT) => ({
    compoundKey: primaryKey({ columns: [pRT.id, pRT.token] }),
  })
);

export const twoFactorTokens = pgTable(
  'twoFactorTokens',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .notNull(),
    email: text('email').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  (twoFa) => ({
    compoundKey: primaryKey({ columns: [twoFa.id, twoFa.token] }),
  })
);

export const twoFactorConfirmations = pgTable('twoFactorConfirmations', {
  id: text('id')
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date', withTimezone: true }).notNull(),
});
