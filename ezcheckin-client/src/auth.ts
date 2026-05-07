import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { AUTH_ROUTES } from "./routes/auth/auth.route"
import { InvalidEmailPasswordError } from "./utils/error"
import { apiServer } from "./lib/apiServer"
import { LoginResponse } from "./@types/auth.type"
import { APIResponse } from "./@types/response.type"
import { toast } from "sonner"

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret:process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
 
        // user={
        //     name:"Hiếu"
        // }
        const dataLogin = await apiServer.post<APIResponse<LoginResponse>>("/auth/login",{
          email:credentials.email,
          password:credentials.password
        },{
          passError:true
        })
        if(dataLogin.statusCode===401){
          throw new InvalidEmailPasswordError()
        }
        else if(dataLogin.data){
          user={} 
        }
        return user
      },
    }),
  ],
  pages:{
    signIn:AUTH_ROUTES.LOGIN
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
      },
    },
  },
})