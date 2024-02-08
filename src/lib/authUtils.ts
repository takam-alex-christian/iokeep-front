


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

function signupRequest({username, password}: {username: string, password: string}): Promise<{success: boolean}>{
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

function getAccessToken(): Promise <{success: boolean}>{
    return new Promise((resolve, reject)=>{
        fetch(`/be/auth/access_token`, {
            method: "POST"
        }).then((res)=>{
            resolve({...res.json()})
        }).catch((err)=>{
            reject(err)
        })
    })
}

function logoutRequest (): Promise<{loggedOut: boolean, error: boolean, errorMessage: string}>{
    return new Promise((logoutResolve, logoutReject)=>{
        fetch('/be/auth/logout', {
            method: "PATCH"
        }).then((res)=>{
            logoutResolve(res.json())
        }).catch((err)=>{
            logoutReject(err)
        })
    })
}

export {loginRequest, signupRequest, getAccessToken, logoutRequest}