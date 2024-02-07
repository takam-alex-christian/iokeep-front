

function loginRequest({username, password}: {username: string, password: string}): Promise<{authed: boolean}>{
    return new Promise((loginResolve, loginReject)=>{

        const loginHeaders = new Headers()
        
        loginHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({username, password})


        fetch(`/be/auth/login`, {
            method: "POST",
            headers: loginHeaders,
            body: raw
            // redirect: "follow"
        }).then((res)=>{
            return loginResolve(res.json())
        }, (err)=>{
            loginReject(err)
            console.log(err)
        })
        
    })

}

function signupRequest({username, password}: {username: string, password: string}): Promise<{created: boolean}>{
    return new Promise((signupResolve, signupReject)=>{
        
        const signupHeaders = new Headers()

        signupHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({username, password})

        fetch(`/be/auth/signup`, {
            method: "POST",
            headers: signupHeaders,
            body: raw
        }).then((res)=>{
            return signupResolve(res.json())
        }, (err)=>{
            signupReject(err)
            console.log(err)
        })
    })
}

export {loginRequest, signupRequest}