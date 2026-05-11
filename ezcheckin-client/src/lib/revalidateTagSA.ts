"use server"
import { revalidateTag } from "next/cache";

export async function revalidateServerAction(tag:string){
  await revalidateTag(tag,"max")
}