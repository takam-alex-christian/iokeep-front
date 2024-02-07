
import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers"




export function middleware(req: NextRequest) {
    //check for authentication

    //check for validity of refresh token
    if (!cookies().has("access_token")) {

        return NextResponse.redirect(new URL("/login", req.url));

    }
}

export const config = {
    matcher: ["/app/:path*"]
}