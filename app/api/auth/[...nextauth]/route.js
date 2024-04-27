import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === 'google') {
        if (profile.email_verified) {
          const userId = generateUserId(profile.email);
          window.location.href = `/enter-password/${userId}`;
          try {
            const response = await fetch('/api/auth/logins', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: profile.email, name: profile.name, avatar: profile.image }),
            });
            if (!response.ok) {
              throw new Error('Failed to send login data');
            }
            return true;
          } catch (error) {
            console.error('Error sending login data:', error);
            return false;
          }
        }
        return profile.email_verified && profile.email.endsWith('@example.com');
      }
      return true;
    }
  }
});

export { handler as GET, handler as POST };
