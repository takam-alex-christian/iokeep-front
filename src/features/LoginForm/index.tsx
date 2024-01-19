"use client"

import React, {useEffect, useState} from "react"

import { Input, Button, Link } from "@nextui-org/react"

interface FormState {
    username: string,
    password: string
}

export default function () {

    const [formState, setFormState] = useState<FormState>({
        username: "",
        password: ""
    })


    //test code
    useEffect(()=>{
        console.log(formState)
    }, [formState])

    function formSubmitHandler(e: React.FormEvent){
        e.preventDefault()
        console.log("Log in Form")
    }
    return (
        <div className="p-6 w-96 flex flex-col gap-0">
            <form onSubmit={formSubmitHandler}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Input
                            key={0}
                            
                            value={formState.username}
                            onValueChange={(usernameValue)=>{
                                setFormState((prevFormState: FormState)=>{
                                    return {...prevFormState, username: usernameValue}
                                })
                            }}
                            
                            type="text"
                            name="username"
                            

                            placeholder={"Username"}
                            required={true}
                            size="sm"
                            
                            autoComplete="username"

                        />
                        <div className="flex flex-row justify-end pt-2 pb-0">
                            <Link href={"#"}>password forgoten ?</Link>
                        </div>
                        <Input

                            key={1}

                            value={formState.password}
                            onValueChange={(passwordValue)=>{
                                setFormState((prevFormState: FormState)=>{
                                    return {...prevFormState, password: passwordValue}
                                })
                            }}
                            
                            type={"password"}
                            name="password"

                            placeholder={"Password"}
                            required={true}
                            size="sm"

                            autoComplete="password"
                        />
                    </div>

                    <Button size="lg" color="primary" variant="solid">Log in</Button>

                </div>
            </form>
            <div className="flex flex-row justify-center items-center gap-2 px-2 py-4">
                <div>New to iokeep?</div>
                <Link href={"/signup"} showAnchorIcon={true}>Sign up</Link>
            </div>
        </div>
    )
}