import type { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const testMode = process.env.NEXT_PUBLIC_TEST_SESSION === 'true'

export const authOptions: NextAuthOptions = {
  providers: testMode
    ? [
        CredentialsProvider({
          id: 'test',
          name: 'Test',
          credentials: {},
          async authorize() {
            return { id: '1', name: 'Test User', email: 'test@example.com' }
          },
        }),
      ]
    : [
        GitHubProvider({
          clientId: process.env.GITHUB_CLIENT_ID ?? '',
          clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID ?? '',
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        }),
      ],
  secret: process.env.NEXTAUTH_SECRET,
}
