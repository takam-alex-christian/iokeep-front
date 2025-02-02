"use client"

import React, { useState, useRef, useEffect } from "react"
import { Input, Button, Link, user } from "@nextui-org/react"
import { signupRequest } from "@/lib/authUtils"

import { useRouter } from "next/navigation"

interface FormState {
    username: {
        value: string,
        isInValid: boolean,
        errorMessage: string,
        isEngaged: boolean //can only start validating a component if it has been engaged
    },
    password: {
        value: string,
        isInValid: boolean,
        errorMessage: string,
        isEngaged: boolean
    },
    confirmPassword: {
        value: string,
        isInValid: boolean,
        errorMessage: string,
        isEngaged: boolean
    }
}


export default function () {

    const [formState, setFormState] = useState<FormState>({
        username: {
            value: "",
            isInValid: false,
            errorMessage: "",
            isEngaged: false
        },
        password: {
            value: "",
            isInValid: false,
            errorMessage: "",
            isEngaged: false,

        },
        confirmPassword: {
            value: "",
            isInValid: false,
            errorMessage: "",
            isEngaged: false,
        }
    })

    const router = useRouter()

    useEffect(() => {

        if (formState.username.isEngaged) validateUsername()

        if (formState.password.isEngaged) validatePassword()

        if (formState.confirmPassword.isEngaged) validateConfirmPassword()

    }, [formState.username.value, formState.password.value, formState.confirmPassword.value])

    function usernameChangeHandler(value: string) {

        setFormState((prevState: FormState) => { return { ...prevState, username: { ...prevState.username, value, isEngaged: true } } })

    }

    function validateUsername() {

        let isInValid: boolean = false
        let errorMessage: string = ""

        if (formState.username.value.length == 0) {
            isInValid = true;
            errorMessage = "Username can not be empty!"
        }

        setFormState((prevState) => {
            return { ...prevState, username: { ...prevState.username, isInValid, errorMessage, } }
        })

    }

    function passwordChangeHandler(value: string) {


        setFormState((prevState: FormState) => { return { ...prevState, password: { ...prevState.password, value, isEngaged: true } } })
    }

    function validatePassword() {
        let isInValid: boolean = false
        let errorMessage: string = ""

        if (formState.password.value.length == 0) {
            isInValid = true;
            errorMessage = "password can not be empty!"
        }

        setFormState((prevState) => {
            return { ...prevState, password: { ...prevState.password, isInValid, errorMessage } }
        })
    }

    function confirmPasswordChangeHandler(value: string) {

        setFormState((prevState: FormState) => { return { ...prevState, confirmPassword: { ...prevState.confirmPassword, value, isEngaged: true } } })
    }

    function validateConfirmPassword() {
        let isInValid: boolean = false
        let errorMessage: string = ""


        if (formState.confirmPassword.value.length > 0) {
            if (formState.password.value != formState.confirmPassword.value) {
                isInValid = true;
                errorMessage = "Both passwords don\'t match"
            }
        } else {
            isInValid = true;
            errorMessage = "password can not be empty!"
        }

        setFormState((prevState) => {
            return { ...prevState, confirmPassword: { ...prevState.confirmPassword, isInValid, errorMessage } }
        })


    }

    function formSubmitHandler(e: React.FormEvent) {

        e.preventDefault()

        //activate a loading state

        signupRequest({ username: formState.username.value, password: formState.password.value }).then((jsonResponse) => {

            if (jsonResponse.error) alert(jsonResponse.error.message)
            else {

                if (jsonResponse.success) router.push("/login") //communicate to the user that they just singed up and should login to access app
                else alert(jsonResponse.info)
        
            }

        }).catch((err) => {
            console.log(err)
        })

    }


    return (
        <div className="p-6 w-96">
            <form onSubmit={formSubmitHandler}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Input
                            key={0}

                            value={formState.username.value}
                            onValueChange={usernameChangeHandler}

                            placeholder={"Username"}
                            isRequired

                            isInvalid={formState.username.isInValid}
                            errorMessage={formState.username.errorMessage}

                            size="sm"

                            autoFocus={true}
                            autoComplete={"off"}
                        />
                        <Input
                            key={1}
                            value={formState.password.value}
                            onValueChange={passwordChangeHandler}

                            placeholder={"Password"}

                            type="password"
                            isRequired

                            isInvalid={formState.password.isInValid}
                            errorMessage={formState.password.errorMessage}
                            size="sm"

                            autoComplete="off"
                        />

                        <Input
                            key={2}

                            value={formState.confirmPassword.value}
                            onValueChange={confirmPasswordChangeHandler}

                            placeholder={"Confirm Password"}

                            type={"password"}
                            isRequired

                            isInvalid={formState.confirmPassword.isInValid}
                            errorMessage={formState.confirmPassword.errorMessage}

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