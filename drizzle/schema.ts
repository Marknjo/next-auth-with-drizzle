import { pgTable, pgEnum, text, timestamp, boolean, foreignKey, primaryKey, integer } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const role = pgEnum("role", ['user', 'admin'])


export const user = pgTable("user", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	password: text("password"),
	emailVerified: timestamp("emailVerified", { mode: 'string' }),
	image: text("image"),
	role: role("role").default('user'),
	isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
});

export const twoFactorConfirmations = pgTable("twoFactorConfirmations", {
	id: text("id").primaryKey().notNull(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	expires: timestamp("expires", { withTimezone: true, mode: 'string' }).notNull(),
});

export const verificationToken = pgTable("verificationToken", {
	id: text("id").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { withTimezone: true, mode: 'string' }).notNull(),
	email: text("email").notNull(),
},
(table) => {
	return {
		verificationTokenIdTokenPk: primaryKey({ columns: [table.id, table.token], name: "verificationToken_id_token_pk"})
	}
});

export const twoFactorTokens = pgTable("twoFactorTokens", {
	id: text("id").notNull(),
	email: text("email").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { withTimezone: true, mode: 'string' }).notNull(),
},
(table) => {
	return {
		twoFactorTokensIdTokenPk: primaryKey({ columns: [table.id, table.token], name: "twoFactorTokens_id_token_pk"})
	}
});

export const passwordResetTokens = pgTable("passwordResetTokens", {
	id: text("id").notNull(),
	email: text("email").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { withTimezone: true, mode: 'string' }).notNull(),
},
(table) => {
	return {
		passwordResetTokensIdTokenPk: primaryKey({ columns: [table.id, table.token], name: "passwordResetTokens_id_token_pk"})
	}
});

export const account = pgTable("account", {
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
(table) => {
	return {
		accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"})
	}
});