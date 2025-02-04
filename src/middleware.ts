
import { NextRequest, NextResponse, NextMiddleware } from "next/server";

import { cookies } from "next/headers"

import { AuthJsonResponse } from "./types";


export async function middleware(req: NextRequest) {

    //check for authentication
    // console.log(cookies().getAll())
    //check for validity of refresh token
    if ((await cookies()).has("refresh_token")) {
        //verify refresh
        const authHeaders = new Headers();
        authHeaders.append("Authorization", `Bearer ${(await cookies()).get("refresh_token")?.value}`)

        try {

            let authResponse: AuthJsonResponse = await fetch(`${process.env.BE_URL}/auth/refresh_token`, {
                headers: authHeaders,
                method: "POST",
            }).then((authResponse => authResponse.json()))

            if (authResponse.error){
                // ideally return 
                console.log(authResponse.error.message)
                return NextResponse.redirect(new URL("/login", req.nextUrl.basePath))
            }else {
                if (!authResponse.success) return NextResponse.redirect(new URL("/login", req.url))
                else {
                    return NextResponse.next()
                }

            }

        } catch (err) {
            console.log(err)
        }

    } else {
        return NextResponse.redirect(new URL("/login", req.url));
    }



}

export const config = {
    matcher: ["/app/:path*"]
}