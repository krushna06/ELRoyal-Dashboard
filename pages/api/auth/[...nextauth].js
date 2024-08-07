import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const usersJson = process.env.NEXTAUTH_USERS_JSON;
const users = usersJson ? JSON.parse(usersJson) : [];

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        // Find user by email
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
          // Return a user object if authentication is successful
          return { id: user.id, email: user.email };
        }

        // Return null if authentication fails
        return null;
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
