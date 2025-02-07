"use client";
import Image from "next/image";
import Link from "next/link";

import V2Logo from "@/assets/logo.svg";

import { Button, Switch } from "@heroui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faCircleHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { logoutRequest } from "@/lib/authUtils";

import { useRouter } from "next/navigation";

import { useTheme } from "next-themes";

export default function () {
  const router = useRouter();

  const { theme: preferedTheme, setTheme } = useTheme();

  function logoutButtonHandler() {
    logoutRequest().then((jsonResponse) => {
      if (jsonResponse.error) {
        //maybe show a modal to communicate the error with user for improved user experience
        alert(jsonResponse.error.message);
      } else {
        if (jsonResponse.success) {
          router.replace("/login");
        } else {
          alert(jsonResponse.info);
        }
      }
    });
  }

  function selectedThemeChangeHandler() {
    // let currentTheme = window.localStorage.getItem("iokeepSelectedTheme");
    // let newPreferedTheme = currentTheme == "light" ? "dark" : "light";
    // window.localStorage.setItem("iokeepSelectedTheme", newPreferedTheme);
    // if (currentTheme) document.body.classList.remove(currentTheme);
    // document.body.classList.add(newPreferedTheme);

    if (preferedTheme == "light") {
      setTheme("dark");
    } else setTheme("light");
  }

  return (
    <header className="custom-navbar-bg px-2 py-4 flex flex-row justify-center ">
      <div className="w-4/5 flex flex-row justify-between items-center ">
        {/* logo */}
        <Link href={"/app"} className="flex flex-row gap-0 items-center">
          <Image width={48} src={V2Logo} alt={"iokeep v2 logo"} />
          <span>
            Iokeep
            <span className="text-primary-800 bg-primary-100 py-1 ml-1 px-2 rounded-full font-semibold">
              v3
            </span>
          </span>
        </Link>

        <div className="flex flex-row justify-center items-center gap-2">
          <Button
            onPress={selectedThemeChangeHandler}
            isIconOnly
            variant="flat"
            color="default"
          >
            <FontAwesomeIcon icon={faCircleHalfStroke} />
          </Button>
          <Button
            onPress={logoutButtonHandler}
            variant="flat"
            color="default"
            isIconOnly
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
          </Button>
        </div>
      </div>
    </header>
  );
}
