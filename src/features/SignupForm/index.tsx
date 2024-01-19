"use client"

import React, { useState, useRef} from "react"
import { Input, Button, Link, user } from "@nextui-org/react"

interface FormState {
    username: string,
    password: string,
    confirmPassword: string
}

export default function () {



    const [formState, setFormState] = useState<FormState>({
        username: "",
        password: "",
        confirmPassword: ""
    })
    
    function formSubmitHandler(e: React.FormEvent){
        e.preventDefault()
        console.log("sigup form submitted")
    }
    return (
        <div className="p-6 w-96">
            <form onSubmit={formSubmitHandler}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Input
                            key={0}

                            value={formState.username}
                            onValueChange={(usernameValue) => { setFormState((prevState: FormState) => { return { ...prevState, username: usernameValue } }) }}

                            placeholder={"Username"}
                            required={true}
                            size="sm"

                            autoFocus={true}
                            autoComplete={"off"}
                        />
                        <Input
                            key={1}
                            value={formState.password}
                            onValueChange={(passwordValue) => { setFormState((prevState: FormState) => { return { ...prevState, password: passwordValue } }) }}

                            placeholder={"Password"}

                            type="password"
                            required={true}
                            size="sm"

                            autoComplete="off"
                        />

                        <Input
                            key={2}

                            value={formState.confirmPassword}
                            onValueChange={(confirmPasswordValue) => { setFormState((prevState: FormState) => { return { ...prevState, confirmPassword: confirmPasswordValue } }) }}

                            placeholder={"Confirm Password"}

                            type={"password"}
                            required={true}
                            size="sm"

                            autoComplete="off"
                        />

                    </div>

                    <Button type="submit" size="lg" color="primary" variant="solid">Sign Up</Button>

                </div>
            </form>
            <div className="flex flex-row gap-2 px-2 py-4 justify-center items-center">
                <div>Already have an account?</div>
                <Link href={"/login"} showAnchorIcon={true}>Log in</Link>
            </div>
        </div>
    )
}