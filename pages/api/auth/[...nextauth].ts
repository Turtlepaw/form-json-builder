import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string
    }),
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)