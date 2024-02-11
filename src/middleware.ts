
import { NextRequest, NextResponse, NextMiddleware } from "next/server";

import { cookies } from "next/headers"




export async function middleware(req: NextRequest) {


    //check for authentication
    // console.log(cookies().getAll())
    //check for validity of refresh token
    if (cookies().has("refresh_token")) {
        //verify refresh
        const authHeaders = new Headers();
        authHeaders.append("Authorization", `Bearer ${cookies().get("refresh_token")?.value}`)

        try {
            let authResponseData = await fetch(`${process.env.BE_URL}/auth/refresh_token`, {
                headers: authHeaders,
                method: "POST",
            }).then((authResponse => authResponse.json()))

            if (!authResponseData.isVerified || !authResponseData.isValid) return NextResponse.redirect(new URL("/login", req.url))
            else return NextResponse.next()

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