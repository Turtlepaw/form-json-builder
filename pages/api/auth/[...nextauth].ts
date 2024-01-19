import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

console.log(process.env.CLIENT_ID as string, process.env.CLIENT_SECRET as string)
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

export default NextAuth(authOptions)
