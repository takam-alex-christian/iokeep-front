"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Link, user, Alert } from "@heroui/react";
import { signupRequest } from "@/lib/authUtils";

import { useRouter } from "next/navigation";
import FormButton from "@/components/FormButton";
import { AnimatePresence, motion } from "motion/react";

interface FormState {
  username: {
    value: string;
    isInValid: boolean;
    errorMessage: string;
    isEngaged: boolean; //can only start validating a component if it has been engaged
  };
  password: {
    value: string;
    isInValid: boolean;
    errorMessage: string;
    isEngaged: boolean;
  };
  confirmPassword: {
    value: string;
    isInValid: boolean;
    errorMessage: string;
    isEngaged: boolean;
  };
  isLoading: boolean;
  beAlert: string;
}

export default function SignupForm() {
  const [formState, setFormState] = useState<FormState>({
    username: {
      value: "",
      isInValid: false,
      errorMessage: "",
      isEngaged: false,
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
    },
    isLoading: false,
    beAlert: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (formState.username.isEngaged) validateUsername();

    if (formState.password.isEngaged) validatePassword();

    if (formState.confirmPassword.isEngaged) validateConfirmPassword();
  }, [
    formState.username.value,
    formState.password.value,
    formState.confirmPassword.value,
  ]);

  useEffect(() => {
    if (formState.beAlert.length > 0) {
      setTimeout(() => {
        setFormState((prevState) => {
          return { ...prevState, beAlert: "" };
        });
      }, 2000);
    }
  }, [formState.beAlert]);

  function usernameChangeHandler(value: string) {
    setFormState((prevState: FormState) => {
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
    setFormState((prevState: FormState) => {
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

  function confirmPasswordChangeHandler(value: string) {
    setFormState((prevState: FormState) => {
      return {
        ...prevState,
        confirmPassword: {
          ...prevState.confirmPassword,
          value,
          isEngaged: true,
        },
      };
    });
  }

  function validateConfirmPassword() {
    let isInValid: boolean = false;
    let errorMessage: string = "";

    if (formState.confirmPassword.value.length > 0) {
      if (formState.password.value != formState.confirmPassword.value) {
        isInValid = true;
        errorMessage = "Both passwords don't match";
      }
    } else {
      isInValid = true;
      errorMessage = "password can not be empty!";
    }

    setFormState((prevState) => {
      return {
        ...prevState,
        confirmPassword: {
          ...prevState.confirmPassword,
          isInValid,
          errorMessage,
        },
      };
    });
  }

  function formSubmitHandler(e: React.FormEvent) {
    e.preventDefault();

    //activate a loading state
    setFormState((prevState) => {
      return { ...prevState, isLoading: true };
    });

    signupRequest({
      username: formState.username.value,
      password: formState.password.value,
    })
      .then((jsonResponse) => {
        setFormState((prevState) => {
          return { ...prevState, isLoading: false };
        });
        if (jsonResponse.error) {
          // console.error(jsonResponse.error.message);
          setFormState((prevState) => {
            return { ...prevState, beAlert: jsonResponse.error?.message! };
          });
        } else {
          if (jsonResponse.success) router.push("/login");
          //communicate to the user that they just singed up and should login to access app
          else console.log(jsonResponse.info);
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
              size="lg"
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
              size="lg"
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
              size="lg"
              autoComplete="off"
            />
          </div>

          <FormButton isLoading={formState.isLoading} label="Sign Up" />
        </div>
      </form>
      <div className="flex flex-row gap-2 px-2 py-4 justify-center items-center">
        <div>Already have an account?</div>
        <Link href={"/login"} showAnchorIcon={true}>
          Log in
        </Link>
      </div>
      <div>
        <AnimatePresence>
          {formState.beAlert.length != 0 && (
            <motion.div
              initial={{ opacity: 0, height: "0px" }}
              animate={{ opacity: 1, height: "40px" }}
              exit={{ opacity: 0, height: "0px" }}
            >
              <Alert description={formState.beAlert} color="danger" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
