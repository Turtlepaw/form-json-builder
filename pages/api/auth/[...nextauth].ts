import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.NEXTAUTH_ID as string,
      clientSecret: process.env.NEXTAUTH_SECRET as string
    }),
    // ...add more providers here
  ],
}

const handler = NextAuth(authOptions) as unknown;
export { handler as GET, handler as POST };
