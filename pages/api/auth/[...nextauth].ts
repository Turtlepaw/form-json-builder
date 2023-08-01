import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

console.log(process.env.CLIENT_ID as string, process.env.CLIENT_SECRET as string)
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    DiscordProvider(),
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)
