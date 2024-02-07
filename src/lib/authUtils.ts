

function loginRequest({username, password}: {username: string, password: string}): Promise<{authed: boolean}>{
    return new Promise((loginResolve, loginReject)=>{

        const loginHeaders = new Headers()
        
        loginHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({username, password})

        fetch(`${process.env.BE_URL}`, {
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

function signupRequest({username, password}: {username: string, password: string}){

}

export {loginRequest}