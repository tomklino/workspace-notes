import GoogleProvider from "next-auth/providers/google"
import { NuxtAuthHandler } from '#auth'
import type { GoogleProfile } from 'next-auth/providers/google'

const providers: any[] = []
const googleClientId: string | undefined = process.env['GOOGLE_CLIENT_ID']
const googleClientSecret: string | undefined = process.env['GOOGLE_CLIENT_SECRET']

if(typeof googleClientId === 'string' && typeof googleClientSecret === 'string') {
  // @ts-expect-error Use .default here for it to work during SSR.
  const googleProvider = GoogleProvider.default({
    clientId: googleClientId,
    clientSecret: googleClientSecret,
    profile(profile: GoogleProfile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
  })
  providers.push(googleProvider)
}

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: useRuntimeConfig().authSecret,
  providers
})
