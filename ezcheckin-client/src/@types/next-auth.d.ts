
interface IUser {
    
}

declare module "next-auth/jwt"{
    interface JWT {
        access_token:string;
        refresh_token:string
        user:IUser,
        error:string
    }
}