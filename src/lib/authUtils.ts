
//this interface should match that from be AuthFeature type
interface AuthJsonResponse {
    success: boolean,
    info: string,
    error: null | {message: string}
    timeStamp: number
}

function loginRequest({username, password}: {username: string, password: string}): Promise<AuthJsonResponse>{
    return new Promise((loginResolve, loginReject)=>{

        const loginHeaders = new Headers()
        
        loginHeaders.append("Content-Type", "application/json");

        const jsonBody = JSON.stringify({username, password})


        fetch(`/be/auth/login`, {
            method: "POST",
            headers: loginHeaders,
            body: jsonBody
            // redirect: "follow"
        }).then((res)=>{
            return loginResolve(res.json())
        }, (err)=>{
            loginReject(err)
            console.log(err)
        })
        
    })

}

function signupRequest({username, password}: {username: string, password: string}): Promise<AuthJsonResponse>{
    return new Promise((signupResolve, signupReject)=>{
        
        const signupHeaders = new Headers()

        signupHeaders.append("Content-Type", "application/json");

        const jsonBody = JSON.stringify({username, password})

        fetch(`/be/auth/signup`, {
            method: "POST",
            headers: signupHeaders,
            body: jsonBody
        }).then((res)=>{
            return signupResolve(res.json())
        }, (err)=>{
            signupReject(err)
            console.log(err)
        })
    })
}

function getAccessToken(): Promise <AuthJsonResponse>{
    return new Promise((resolve, reject)=>{
        fetch(`/be/auth/access_token`, {
            method: "POST"
        }).then((res)=>{
            resolve({...res.json()})
        }).catch((err)=>{
            console.log(err);
            reject(err)
        })
    })
}

//solve this on be
function logoutRequest (): Promise<AuthJsonResponse>{
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