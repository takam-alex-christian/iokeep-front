"use client";

import React, { useEffect, useState } from "react";

import { Input, Button, Link } from "@heroui/react";

import { loginRequest } from "@/lib/authUtils";

import { useRouter } from "next/navigation";

interface FormTextInputType {
  value: string;
  isInvalid: boolean;
  errorMessage: string;
  isEngaged: boolean;
}

interface FormState {
  username: FormTextInputType;
  password: FormTextInputType;
}

export default function LoginForm() {
  const initialTextInputData = {
    value: "",
    isInvalid: false,
    errorMessage: "",
    isEngaged: false,
  };

  const [formState, setFormState] = useState<FormState>({
    username: initialTextInputData,
    password: initialTextInputData,
  });

  const router = useRouter();

  useEffect(() => {
    if (formState.username.isEngaged) validateUsername();

    if (formState.password.isEngaged) validatePassword();
  }, [formState.username.value, formState.password.value]);

  function usernameChangeHandler(value: string) {
    setFormState((prevState) => {
      return {
        ...prevState,
        username: { ...prevState.username, value, isEngaged: true },
      };
    });
  }

  function validateUsername() {
    let isInValid: boolean = false;
    let errorMessage: string = "";

    if (formState.username.value.length == 0) {
      isInValid = true;
      errorMessage = "Username can not be empty!";
    }

    setFormState((prevState) => {
      return {
        ...prevState,
        username: { ...prevState.username, isInValid, errorMessage },
      };
    });
  }

  function passwordChangeHandler(value: string) {
    setFormState((prevState) => {
      return {
        ...prevState,
        password: { ...prevState.password, value, isEngaged: true },
      };
    });
  }

  function validatePassword() {
    let isInValid: boolean = false;
    let errorMessage: string = "";

    if (formState.password.value.length == 0) {
      isInValid = true;
      errorMessage = "password can not be empty!";
    }

    setFormState((prevState) => {
      return {
        ...prevState,
        password: { ...prevState.password, isInValid, errorMessage },
      };
    });
  }

  function formSubmitHandler(e: React.FormEvent) {
    e.preventDefault();

    //validate inputs

    //initiate request
    loginRequest({
      username: formState.username.value,
      password: formState.password.value,
    })
      .then((jsonResponse) => {
        if (process.env.NODE_ENV === "development")
          console.log(`loginRequest Response ${jsonResponse}`);

        if (jsonResponse.error) {
          alert(jsonResponse.error.message);
        } else {
          if (jsonResponse.success) {
            router.replace("/app");
          } else {
            alert(jsonResponse.info);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="p-6 w-96 flex flex-col gap-0">
      <form onSubmit={formSubmitHandler}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input
              key={0}
              value={formState.username.value}
              onValueChange={usernameChangeHandler}
              // className="focus-within:outline-dashed focus-within:outline-8 focus-within:outline-red-700"

              type="text"
              name="username"
              placeholder={"Username"}
              isRequired
              isInvalid={formState.username.isInvalid}
              errorMessage={formState.username.errorMessage}
              size="lg"
              autoFocus
              autoComplete="username"
            />
            <div className="flex flex-row justify-end pt-2 pb-0">
              <Link href={"#"}>password forgoten ?</Link>
            </div>
            <Input
              key={1}
              value={formState.password.value}
              onValueChange={passwordChangeHandler}
              type={"password"}
              name="password"
              placeholder={"Password"}
              isRequired
              isInvalid={formState.password.isInvalid}
              errorMessage={formState.password.errorMessage}
              size="lg"
              autoComplete="password"
            />
          </div>

          <Button size="lg" color="primary" variant="solid" type="submit">
            Log in
          </Button>
        </div>
      </form>
      <div className="flex flex-row justify-center items-center gap-2 px-2 py-4">
        <div>New to iokeep?</div>
        <Link href={"/signup"} showAnchorIcon={true}>
          Sign up
        </Link>
      </div>
    </div>
  );
}
