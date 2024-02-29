import { AuthConfig } from '@auth/core';

import Github from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import credentials from '@auth/core/providers/credentials';
import bcrypt from 'bcryptjs';

import { SigninSchema } from '@/schemas';
import { getUserByEmail } from '@/db/queries/user';

export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    credentials({
      async authorize(credentials) {
        console.log('\n\n\n🤞🤞🤞🤞');
        const validatedFields = SigninSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) return user;

        return null;
      },
    }),
  ],
} satisfies AuthConfig;
